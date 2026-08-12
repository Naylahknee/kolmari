import { NextResponse } from 'next/server'
import { getRequestUser } from '@/lib/auth'
import { generatorRequestSchema, type GeneratedAssetType } from '@/lib/country-visuals/schema'
import { buildHeroPrompt, buildHeroEditPrompt, buildDashboardDestinationPrompt, buildCityPrompt } from '@/lib/country-visuals/prompt'

export const runtime = 'nodejs'
export const maxDuration = 120

type OpenAIImageResponse = {
  data?: Array<{ b64_json?: string }>
  error?: { message?: string }
}

function dataUrlToImage(dataUrl: string): { blob: Blob; filename: string } | null {
  const match = /^data:(image\/[a-z+.-]+);base64,(.+)$/i.exec(dataUrl)
  if (!match) return null
  const [, contentType, base64] = match
  const bytes = Buffer.from(base64, 'base64')
  const ext = (contentType.split('/')[1] ?? 'png').replace('+xml', '').replace('jpeg', 'jpg')
  return { blob: new Blob([bytes], { type: contentType }), filename: `image.${ext}` }
}

function isAllowedAdmin(email: string) {
  const configured = process.env.KOLMARI_ADMIN_EMAILS
    ?.split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
  if (!configured?.length) return process.env.NODE_ENV !== 'production'
  return configured.includes(email.toLowerCase())
}

async function fetchFlag(requestUrl: string, code?: string) {
  if (!code) return null
  try {
    const flagUrl = new URL(`/flags-png/${code.toLowerCase()}.png`, requestUrl)
    const flagRes = await fetch(flagUrl)
    if (!flagRes.ok) return null
    const flagBytes = Buffer.from(await flagRes.arrayBuffer())
    return { blob: new Blob([flagBytes], { type: 'image/png' }), filename: `${code.toLowerCase()}.png` }
  } catch {
    return null
  }
}

// Country Page Generator Engine image endpoint. This remains admin-only and
// generates exactly one preview image per request. Nothing is saved here; saving
// is a separate explicit admin approval action through /api/admin/country-asset.
export async function POST(request: Request) {
  const user = await getRequestUser(request)
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  if (!isAllowedAdmin(user.email)) {
    return NextResponse.json({ error: 'You do not have permission to generate country artwork.' }, { status: 403 })
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Image generation is unavailable: OPENAI_API_KEY is not configured on the server.' },
      { status: 503 },
    )
  }

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: 'The request body must be valid JSON.' }, { status: 400 })
  }

  const parsed = generatorRequestSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please correct the highlighted fields.', issues: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const assetType: GeneratedAssetType = data.assetType
  const editImages: Array<{ blob: Blob; filename: string }> = []
  let hasStyleRef = false

  if (data.assetType === 'hero' || data.assetType === 'dashboard_destination') {
    const flag = await fetchFlag(request.url, data.flagCode)
    if (flag) editImages.push(flag)
  }

  if (data.assetType === 'hero') {
    if (data.styleReferenceDataUrl) {
      const ref = dataUrlToImage(data.styleReferenceDataUrl)
      if (ref) {
        editImages.push({ blob: ref.blob, filename: `reference.${ref.filename.split('.').pop()}` })
        hasStyleRef = true
      }
    } else if (editImages.length) {
      try {
        const refUrl = new URL('/references/national-flag-shadow-hero.webp', request.url)
        const refRes = await fetch(refUrl)
        if (refRes.ok) {
          const refBytes = Buffer.from(await refRes.arrayBuffer())
          editImages.push({ blob: new Blob([refBytes], { type: 'image/webp' }), filename: 'reference.webp' })
          hasStyleRef = true
        }
      } catch {
        // Proceed with the real flag alone.
      }
    }
  }

  let prompt: string
  let size: string
  let filename: string

  if (data.assetType === 'hero') {
    prompt = editImages.length ? buildHeroEditPrompt(data, { hasStyleRef }) : buildHeroPrompt(data)
    size = '1536x1024'
    filename = `${data.countrySlug}-hero.webp`
  } else if (data.assetType === 'dashboard_destination') {
    prompt = buildDashboardDestinationPrompt(data)
    size = '1536x1024'
    filename = `${data.countrySlug}-dashboard-destination.webp`
  } else {
    prompt = buildCityPrompt(data)
    // gpt-image-2 supports square/portrait/landscape presets; use the closest
    // supported landscape output to the documented 1200×800 city standard.
    size = '1536x1024'
    filename = `${data.citySlug}.webp`
  }

  // Hero and dashboard_destination may use the official flag raster as an edit
  // input. Dashboard images intentionally do NOT use the hero style reference.
  const useEdits = (data.assetType === 'hero' || data.assetType === 'dashboard_destination') && editImages.length > 0

  let response: Response
  try {
    if (useEdits) {
      const form = new FormData()
      form.append('model', 'gpt-image-2')
      form.append('prompt', prompt)
      form.append('size', size)
      form.append('quality', data.quality)
      form.append('output_format', 'webp')
      form.append('background', 'opaque')
      form.append('n', '1')
      for (const image of editImages) form.append('image[]', image.blob, image.filename)
      response = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
        signal: AbortSignal.timeout(115_000),
      })
    } else {
      response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-image-2',
          prompt,
          size,
          quality: data.quality,
          output_format: 'webp',
          background: 'opaque',
          n: 1,
        }),
        signal: AbortSignal.timeout(115_000),
      })
    }
  } catch (caught) {
    console.error('OpenAI image request failed', caught instanceof Error ? caught.name : 'unknown')
    return NextResponse.json({ error: 'Could not reach the image service. Please try again.' }, { status: 504 })
  }

  const result = (await response.json().catch(() => ({}))) as OpenAIImageResponse
  if (!response.ok) {
    console.error('OpenAI image generation failed', response.status, result.error?.message)
    return NextResponse.json({ error: result.error?.message ?? 'Image generation failed.' }, { status: response.status >= 500 ? 502 : 400 })
  }

  const base64 = result.data?.[0]?.b64_json
  if (!base64) return NextResponse.json({ error: 'The image service returned no image.' }, { status: 502 })

  return NextResponse.json({
    imageDataUrl: `data:image/webp;base64,${base64}`,
    filename,
    prompt,
    model: 'gpt-image-2',
    assetType,
  })
}
