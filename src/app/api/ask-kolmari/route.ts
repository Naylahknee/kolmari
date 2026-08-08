import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getRequestUser } from '@/lib/auth'
import { routeDecisionQuestion } from '@/lib/decision-routing'
import type { KolmariSource } from '@/lib/kolmari-copilot'

export const runtime = 'nodejs'

const requestSchema = z.object({
  question: z.string().trim().min(3).max(1200),
})

type OpenAIAnnotation = {
  type?: string
  url?: string
  title?: string
  url_citation?: {
    url?: string
    title?: string
  }
}

type OpenAIContent = {
  type?: string
  text?: string
  annotations?: OpenAIAnnotation[]
}

type OpenAIOutputItem = {
  type?: string
  content?: OpenAIContent[]
}

type OpenAIResponse = {
  output_text?: string
  output?: OpenAIOutputItem[]
  error?: { message?: string }
}

const KOLMARI_INSTRUCTIONS = `You are Kolmari Copilot, a relocation decision-support assistant.

Your job is to help people understand relocation, immigration, expatriate life, international employment, and move-planning questions without pretending to be a lawyer, tax professional, medical professional, or licensed immigration adviser.

Rules:
1. Search current sources before answering factual questions that can change.
2. Prefer official government, embassy, consulate, labor ministry, tax authority, international institution, and employer sources.
3. Clearly separate published rules from judgment, assumptions, and lived experience.
4. Never say a person definitely qualifies for a visa. Say what appears plausible, what is missing, and what requires official or professional confirmation.
5. Do not invent minimum-income figures, processing times, fees, sponsorship policies, or employer practices.
6. If reliable current evidence is insufficient, say so plainly.
7. Keep the answer practical and readable. Include the most important caveat and no more than three next actions.
8. Do not ask for highly sensitive identifiers such as passport numbers, Social Security numbers, bank credentials, or immigration case numbers.

Use this response structure in plain text:
WHAT I FOUND
A direct answer in 2-5 short paragraphs.

WHAT COULD CHANGE THE ANSWER
The most important missing fact, exception, or risk.

NEXT ACTIONS
- Up to three concrete actions.

End with one confidence line exactly as one of:
CONFIDENCE: HIGH
CONFIDENCE: MODERATE
CONFIDENCE: LOW

Also end with one status line exactly as one of:
STATUS: VERIFIED INFORMATION
STATUS: DECISION SUPPORT
STATUS: NEEDS PROFESSIONAL REVIEW`

function extractText(response: OpenAIResponse): string {
  if (typeof response.output_text === 'string' && response.output_text.trim()) {
    return response.output_text.trim()
  }

  return (response.output ?? [])
    .flatMap((item) => item.content ?? [])
    .filter((content) => content.type === 'output_text' && typeof content.text === 'string')
    .map((content) => content.text?.trim())
    .filter(Boolean)
    .join('\n\n')
}

function extractSources(response: OpenAIResponse): KolmariSource[] {
  const seen = new Set<string>()
  const sources: KolmariSource[] = []

  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) {
      for (const annotation of content.annotations ?? []) {
        const url = annotation.url_citation?.url ?? annotation.url
        if (!url || seen.has(url)) continue
        seen.add(url)
        sources.push({
          title: annotation.url_citation?.title ?? annotation.title ?? new URL(url).hostname,
          url,
        })
      }
    }
  }

  return sources.slice(0, 6)
}

function parseConfidence(answer: string): 'high' | 'moderate' | 'low' {
  if (/CONFIDENCE:\s*HIGH/i.test(answer)) return 'high'
  if (/CONFIDENCE:\s*LOW/i.test(answer)) return 'low'
  return 'moderate'
}

function parseStatus(answer: string): 'verified_information' | 'decision_support' | 'needs_professional_review' {
  if (/STATUS:\s*VERIFIED INFORMATION/i.test(answer)) return 'verified_information'
  if (/STATUS:\s*NEEDS PROFESSIONAL REVIEW/i.test(answer)) return 'needs_professional_review'
  return 'decision_support'
}

function cleanAnswer(answer: string): string {
  return answer
    .replace(/\n?CONFIDENCE:\s*(HIGH|MODERATE|LOW)\s*/gi, '')
    .replace(/\n?STATUS:\s*(VERIFIED INFORMATION|DECISION SUPPORT|NEEDS PROFESSIONAL REVIEW)\s*/gi, '')
    .trim()
}

function extractNextActions(answer: string): string[] {
  const section = answer.split(/NEXT ACTIONS/i)[1]?.split(/CONFIDENCE:/i)[0] ?? ''
  return section
    .split('\n')
    .map((line) => line.replace(/^\s*[-*\d.)]+\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 3)
}

export async function POST(request: Request) {
  const user = await getRequestUser(request)
  if (!user) return NextResponse.json({ error: 'Please sign in to ask Kolmari.' }, { status: 401 })

  const parsed = requestSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter a relocation question between 3 and 1,200 characters.' }, { status: 400 })
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) {
    return NextResponse.json({ error: 'Kolmari Copilot is not configured yet.' }, { status: 503 })
  }

  const route = routeDecisionQuestion(parsed.data.question)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 90_000)

  try {
    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.KOLMARI_AI_MODEL?.trim() || 'gpt-5',
        instructions: KOLMARI_INSTRUCTIONS,
        input: parsed.data.question,
        tools: [{ type: 'web_search' }],
        store: false,
      }),
      signal: controller.signal,
    })

    const response = (await upstream.json().catch(() => ({}))) as OpenAIResponse
    if (!upstream.ok) {
      console.error('Kolmari Copilot upstream error', upstream.status, response.error?.message ?? 'Unknown error')
      return NextResponse.json({ error: 'Kolmari could not complete that research request.' }, { status: 502 })
    }

    const rawAnswer = extractText(response)
    if (!rawAnswer) {
      return NextResponse.json({ error: 'Kolmari did not return a usable answer.' }, { status: 502 })
    }

    return NextResponse.json({
      answer: cleanAnswer(rawAnswer),
      confidence: parseConfidence(rawAnswer),
      status: parseStatus(rawAnswer),
      nextActions: extractNextActions(rawAnswer),
      sources: extractSources(response),
      workspace: { href: route.href, label: route.label },
    })
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError'
    console.error('Kolmari Copilot request failed', timedOut ? 'timeout' : 'request_error')
    return NextResponse.json(
      { error: timedOut ? 'Kolmari research timed out. Please try a narrower question.' : 'Kolmari could not answer right now.' },
      { status: timedOut ? 504 : 502 },
    )
  } finally {
    clearTimeout(timeout)
  }
}
