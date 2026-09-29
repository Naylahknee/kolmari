import 'server-only'

import { NextResponse } from 'next/server'
import { z } from 'zod'

import { getRequestUser } from '@/lib/auth'
import { getSql } from '@/lib/db'
import { getProfile, hasCompletedProfile } from '@/lib/profile'

export const runtime = 'nodejs'

const DAILY_LIMIT = 30 // chat messages per user per day
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

type MetaModelResponse = {
  choices?: { message?: { content?: string } }[]
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
  'climate and tradeoffs between their options. Be warm, clear and concise. ' +
  'If you are not sure about a current fact (prices, rents, laws), say so and suggest checking a ' +
  'current source. Never ask for sensitive info like SSNs, bank or card numbers. ' +
  'Do not give legal or financial advice; give information that helps them decide.'

// The only provider-specific code. To switch to Claude or another provider
// later, change just this function.
async function callMetaModelApi(system: string, messages: ChatMessage[], signal: AbortSignal) {
  const res = await fetch('https://api.meta.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.MODEL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL?.trim() || 'muse-spark-1.3', // standard tier: not used to improve Meta's products
      messages: [{ role: 'system', content: system }, ...messages],
      max_tokens: 800,
    }),
    signal,
  })
  const data = (await res.json().catch(() => ({}))) as MetaModelResponse
  if (!res.ok) throw new Error(`AI provider ${res.status}`)
  return data.choices?.[0]?.message?.content?.trim() || ''
}

export async function POST(request: Request) {
  const user = await getRequestUser(request)
  if (!user) return NextResponse.json({ error: 'Please sign in to use the Kolmari Guide.' }, { status: 401 })

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
    reply = await callMetaModelApi(system, messages, controller.signal)
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError'
    console.error('Kolmari Guide request failed', timedOut ? 'timeout' : 'request_error')
    return NextResponse.json(
      { error: 'The Kolmari Guide could not answer right now. Please try again in a minute.' },
      { status: 502 },
    )
  } finally {
    clearTimeout(timeout)
  }

  if (!reply) {
    return NextResponse.json({ error: 'The Kolmari Guide did not return a usable answer.' }, { status: 502 })
  }

  // Count the message only after a successful AI reply
  await sql`
    INSERT INTO chat_usage (user_id, day, count) VALUES (${user.id}, ${today}, 1)
    ON CONFLICT (user_id, day) DO UPDATE SET count = chat_usage.count + 1
  `

  return NextResponse.json({ reply })
}
