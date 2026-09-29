import 'server-only'

import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getRequestUser } from '@/lib/auth'
import { getSql } from '@/lib/db'
import { getProfile, hasCompletedProfile } from '@/lib/profile'
import { clientIp, rateLimit } from '@/lib/security'

export const runtime = 'nodejs'

const DAILY_LIMIT = 30 // chat messages per user per day
const CHAT_IP_LIMIT = 60 // requests per minute per IP (the chat endpoint calls a paid API)
const MAX_HISTORY = 10 // how many past messages to send the AI
const MAX_MESSAGE_CHARS = 1000

const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
})

const requestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1),
})

type ChatMessage = z.infer<typeof chatMessageSchema>

type ResponsesAnnotation = {
  type: string
  url?: string
  title?: string
}

type ResponsesContentBlock = {
  type: string
  text?: string
  annotations?: ResponsesAnnotation[]
}

type ResponsesOutputItem = {
  type: string
  role?: string
  content?: ResponsesContentBlock[]
}

type ResponsesApiResponse = {
  status?: string
  output?: ResponsesOutputItem[]
  error?: { message?: string; code?: string }
  incomplete_details?: { reason?: string }
}

// Privacy-preserving user attribution for the AI provider (its documented
// recommendation for user-facing apps): a sha256 of the internal user id,
// never the email or name.
async function sha256Hex(value: string): Promise<string> {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

let usageTableReady: Promise<void> | null = null

async function ensureChatUsageTable() {
  if (!usageTableReady) {
    usageTableReady = (async () => {
      const sql = getSql()
      await sql`
        CREATE TABLE IF NOT EXISTS chat_usage (
          user_id INT NOT NULL,
          day TEXT NOT NULL,
          count INT NOT NULL DEFAULT 0,
          PRIMARY KEY (user_id, day)
        )
      `
    })().catch((error) => {
      usageTableReady = null
      throw error
    })
  }
  await usageTableReady
}

const SYSTEM_PROMPT =
  'You are the Kolmari Guide, an AI assistant inside Kolmari, a relocation-decision app. ' +
  'Help the user think through where to move: cost of living, neighborhoods, jobs, schools, ' +
  'visas and immigration routes, climate and tradeoffs between their options. Be warm, clear and concise. ' +
  'You can search the web for current facts (visa rules, prices, rents, laws). Use the search when the ' +
  'user asks about something time-sensitive or country-specific, and mention which facts came from the web. ' +
  'Never ask for sensitive info like SSNs, bank or card numbers. ' +
  'Do not give legal or financial advice; give information that helps them decide.'

// The only provider-specific code. To switch to Claude or another provider
// later, change just this function.
//
// Uses Meta's Responses API rather than Chat Completions: it is the only
// endpoint with the built-in web_search tool, so the Guide can ground answers
// about visas, costs and country facts in current web sources with citations.
async function callMetaModelApi(
  system: string,
  messages: ChatMessage[],
  signal: AbortSignal,
  userId: string | number,
) {
  // Trim: pasted secrets often carry a trailing newline that would invalidate the header.
  const apiKey = (process.env.MODEL_API_KEY || '').trim()
  const res = await fetch('https://api.meta.ai/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL?.trim() || 'muse-spark-1.3', // standard tier: not used to improve Meta's products
      instructions: system, // developer-level prompt for the Responses API
      input: messages.map((m) => ({
        role: m.role,
        content: [{ type: m.role === 'assistant' ? 'output_text' : 'input_text', text: m.content }],
      })),
      tools: [{ type: 'web_search' }], // the model decides when a search is needed
      // Reasoning, web-search steps and the visible answer share this budget;
      // a search question needs far more headroom than a plain one.
      max_output_tokens: 16000,
      store: false, // stateless: no conversation retained server-side
      safety_identifier: await sha256Hex(`kolmari:${userId}`),
    }),
    signal,
  })
  const raw = await res.text().catch(() => '')
  let data: ResponsesApiResponse = {}
  try {
    data = JSON.parse(raw) as ResponsesApiResponse
  } catch {
    // Non-JSON error body; keep the raw text for the message below.
  }
  if (!res.ok) {
    const providerMessage = data.error?.message || raw.slice(0, 300)
    throw new Error(`AI provider ${res.status}${providerMessage ? `: ${providerMessage}` : ''}`)
  }
  if (data.status && data.status !== 'completed') {
    const providerMessage =
      data.error?.message ||
      (data.incomplete_details?.reason ? `incomplete: ${data.incomplete_details.reason}` : `status ${data.status}`)
    throw new Error(`AI provider: ${providerMessage}`)
  }
  const texts: string[] = []
  const sources: { url: string; title: string }[] = []
  for (const item of data.output ?? []) {
    if (item.type !== 'message' || item.role !== 'assistant') continue
    for (const block of item.content ?? []) {
      if (block.type !== 'output_text' || !block.text) continue
      texts.push(block.text)
      for (const annotation of block.annotations ?? []) {
        if (
          annotation.type === 'url_citation' &&
          annotation.url &&
          !sources.some((s) => s.url === annotation.url)
        ) {
          sources.push({ url: annotation.url, title: annotation.title || annotation.url })
        }
      }
    }
  }
  const reply = texts.join('').trim()
  if (!reply) {
    throw new Error(
      `empty reply (output items: ${data.output?.length ?? 0}, status: ${data.status ?? 'n/a'})`,
    )
  }
  // The widget renders plain text, so citations become a Sources footer.
  if (sources.length > 0) {
    return `${reply}\n\nSources:\n${sources.map((s) => `- ${s.title}: ${s.url}`).join('\n')}`
  }
  return reply
}

export async function POST(request: Request) {
  const user = await getRequestUser(request)
  if (!user) return NextResponse.json({ error: 'Please sign in to use the Kolmari Guide.' }, { status: 401 })

  // Per-IP flood protection on top of the per-user daily cap below. The chat
  // endpoint calls a paid AI API, so a burst of requests gets throttled fast.
  const ipLimit = rateLimit(`chat:${clientIp(request)}`, CHAT_IP_LIMIT, 60_000)
  if (!ipLimit.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(ipLimit.retryAfterSeconds) } },
    )
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Send at least one message to start chatting.' }, { status: 400 })
  }

  // Clean up the conversation the browser sent: last 10 messages, 1000 chars each
  const messages = parsed.data.messages
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }))

  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return NextResponse.json({ error: 'No question found' }, { status: 400 })
  }

  const apiKey = process.env.MODEL_API_KEY?.trim()
  if (!apiKey) {
    return NextResponse.json(
      { error: 'The Kolmari Guide is not configured yet. Please check back soon.' },
      { status: 503 },
    )
  }

  // Daily limit per user
  await ensureChatUsageTable()
  const today = new Date().toISOString().slice(0, 10)
  const sql = getSql()
  const usedRows = (await sql`SELECT count FROM chat_usage WHERE user_id = ${user.id} AND day = ${today}`) as { count?: string | number }[]
  const used = Number(usedRows[0]?.count ?? 0)
  if (used >= DAILY_LIMIT) {
    return NextResponse.json({ reply: "You've reached today's chat limit. Come back tomorrow!" })
  }

  // Pull only the fields the chatbot needs for personalization
  let profileContext: Record<string, unknown> | null = null
  try {
    const profile = await getProfile(user.id)
    if (hasCompletedProfile(profile)) {
      profileContext = {
        display_name: profile.display_name,
        citizenship: profile.citizenship,
        current_country: profile.current_country,
        preferred_regions: profile.preferred_regions,
        preferred_region: profile.preferred_region,
        timeline: profile.timeline,
        priority: profile.priority,
        goals: profile.goals,
        climate: profile.climate,
        household_type: profile.household_type,
        family_size: profile.family_size,
      }
    }
  } catch (error) {
    console.error('Kolmari Guide profile lookup failed', error)
    // Profile lookup failed: the chatbot still works, just less personal
  }

  const system =
    SYSTEM_PROMPT +
    '\n\n' +
    (profileContext
      ? `What this user told Kolmari: ${JSON.stringify(profileContext)}`
      : "This user hasn't finished the onboarding quiz yet; you can encourage them to.")

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60_000)

  let reply: string
  try {
    reply = await callMetaModelApi(system, messages, controller.signal, user.id)
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError'
    const detail = error instanceof Error ? error.message : 'request_error'
    // Log the provider detail server-side; surface a short version so failures
    // are diagnosable without leaking anything sensitive.
    console.error('Kolmari Guide request failed', timedOut ? 'timeout' : detail)
    return NextResponse.json(
      {
        error: `The Kolmari Guide could not answer right now. Please try again in a minute. (provider: ${timedOut ? 'timeout' : detail})`,
      },
      { status: 502 },
    )
  } finally {
    clearTimeout(timeout)
  }

  // Count the message only after a successful AI reply
  await sql`
    INSERT INTO chat_usage (user_id, day, count) VALUES (${user.id}, ${today}, 1)
    ON CONFLICT (user_id, day) DO UPDATE SET count = chat_usage.count + 1
  `

  return NextResponse.json({ reply })
}
