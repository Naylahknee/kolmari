import { NextResponse } from 'next/server'
import { getRequestUser } from '@/lib/auth'
import { buildCountryHeroPrompt, countryHeroInputSchema } from '@/lib/country-hero/prompt'

export const runtime = 'nodejs'
export const maxDuration = 120

type OpenAIImageResponse = {
  data?: Array<{ b64_json?: string }>
  error?: { message?: string }
}

function isAllowedAdmin(email: string) {
  const configured = process.env.KOLMARI_ADMIN_EMAILS
    ?.split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  if (!configured?.length) return process.env.NODE_ENV !== 'production'
  return configured.includes(email.toLowerCase())
}

export async function POST(request: Request) {
  const user = await getRequestUser(request)
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  if (!isAllowedAdmin(user.email)) {
    return NextResponse.json({ error: 'You do not have permission to generate country artwork.' }, { status: 403 })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not configured on the server.' },
      { status: 503 },
    )
  }

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: 'The request body must be valid JSON.' }, { status: 400 })
  }

  const parsed = countryHeroInputSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please correct the highlighted destination details.', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const prompt = buildCountryHeroPrompt(parsed.data)
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-2',
      prompt,
      size: '1536x1024',
      quality: parsed.data.quality,
      output_format: 'webp',
      background: 'opaque',
      n: 1,
    }),
  })

  const result = (await response.json()) as OpenAIImageResponse
  if (!response.ok) {
    console.error('OpenAI image generation failed', response.status, result.error?.message)
    return NextResponse.json(
      { error: result.error?.message ?? 'Image generation failed.' },
      { status: response.status >= 500 ? 502 : 400 },
    )
  }

  const base64 = result.data?.[0]?.b64_json
  if (!base64) {
    return NextResponse.json({ error: 'The image service returned no image.' }, { status: 502 })
  }

  const slug = `${parsed.data.countryName}-${parsed.data.cityName}`
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return NextResponse.json({
    imageDataUrl: `data:image/webp;base64,${base64}`,
    filename: `${slug}-flag-map.webp`,
    prompt,
    model: 'gpt-image-2',
  })
}
