import { NextResponse } from 'next/server'
import { getRequestUser } from '@/lib/auth'
import { generatorRequestSchema, type GeneratedAssetType } from '@/lib/country-visuals/schema'
import { buildHeroPrompt, buildHeroEditPrompt, buildCityPrompt } from '@/lib/country-visuals/prompt'

export const runtime = 'nodejs'
export const maxDuration = 120

type OpenAIImageResponse = {
  data?: Array<{ b64_json?: string }>
  error?: { message?: string }
}

// A base64 image data URL → Blob for a multipart image input. Returns null when
// the string is not a recognizable image data URL.
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

// The Country Visual Asset Engine generates two AI asset types — the flag +
// silhouette hero and premium city photography. (Snapshot maps are Mapbox and
// never hit this endpoint.) Each type has its own prompt, output size, and
// canonical filename.
export async function POST(request: Request) {
  const user = await getRequestUser(request)
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  if (!isAllowedAdmin(user.email)) {
    return NextResponse.json({ error: 'You do not have permission to generate country artwork.' }, { status: 403 })
  }

  // Server-only secret. On this project (Next.js App Router via OpenNext for
  // Cloudflare) runtime secrets are read from process.env — the same mechanism
  // that already powers process.env.DATABASE_URL / process.env.JWT_SECRET in
  // production. The key is never sent to the browser and never logged.
  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Image generation is unavailable: OPENAI_API_KEY is not configured on the server. Set it as an encrypted Cloudflare Worker secret and redeploy.' },
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
    return NextResponse.json(
      { error: 'Please correct the highlighted fields.', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const data = parsed.data
  const assetType: GeneratedAssetType = data.assetType

  // For a hero, gather any image inputs (the country's own flag raster + an
  // optional style reference). When at least one is available we use the
  // image-*edits* endpoint so the output preserves the real flag and matches the
  // reference look; otherwise we fall back to plain text-to-image generation.
  const heroImages: Array<{ blob: Blob; filename: string }> = []
  if (data.assetType === 'hero') {
    if (data.flagCode) {
      try {
        const flagUrl = new URL(`/flags-png/${data.flagCode.toLowerCase()}.png`, request.url)
        const flagRes = await fetch(flagUrl)
        if (flagRes.ok) {
          const flagBytes = Buffer.from(await flagRes.arrayBuffer())
          heroImages.push({ blob: new Blob([flagBytes], { type: 'image/png' }), filename: `${data.flagCode.toLowerCase()}.png` })
        }
      } catch {
        // No flag raster available — fall through (text prompt or reference-only).
      }
    }
    if (data.styleReferenceDataUrl) {
      const ref = dataUrlToImage(data.styleReferenceDataUrl)
      if (ref) heroImages.push({ blob: ref.blob, filename: `reference.${ref.filename.split('.').pop()}` })
    }
  }

  let prompt: string
  let size: string
  let filename: string
  if (data.assetType === 'hero') {
    prompt = heroImages.length ? buildHeroEditPrompt(data, { hasStyleRef: Boolean(data.styleReferenceDataUrl) }) : buildHeroPrompt(data)
    size = '1536x1024'
    filename = `${data.countrySlug}-hero.webp`
  } else {
    prompt = buildCityPrompt(data)
    size = '1024x1024'
    filename = `${data.citySlug}.webp`
  }

  // Hero with image inputs → multipart edits; everything else → JSON generations.
  const useEdits = data.assetType === 'hero' && heroImages.length > 0

  let response: Response
  try {
    if (useEdits) {
      const form = new FormData()
      form.append('model', 'gpt-image-2')
      form.append('prompt', prompt)
      form.append('size', size)
      form.append('quality', parsed.data.quality)
      form.append('output_format', 'webp')
      form.append('background', 'opaque')
      form.append('n', '1')
      for (const img of heroImages) form.append('image[]', img.blob, img.filename)
      response = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        // No Content-Type header — fetch sets the multipart boundary from FormData.
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
        signal: AbortSignal.timeout(115_000),
      })
    } else {
      response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-image-2',
          prompt,
          size,
          quality: parsed.data.quality,
          output_format: 'webp',
          background: 'opaque',
          n: 1,
        }),
        // gpt-image-2 can take a while; bound it so a hung request fails cleanly.
        signal: AbortSignal.timeout(115_000),
      })
    }
  } catch (caught) {
    // Log only the failure kind — never the request (which carries the key).
    console.error('OpenAI image request failed', caught instanceof Error ? caught.name : 'unknown')
    return NextResponse.json({ error: 'Could not reach the image service. Please try again.' }, { status: 504 })
  }

  const result = (await response.json().catch(() => ({}))) as OpenAIImageResponse
  if (!response.ok) {
    // result.error?.message is OpenAI's message — it does not contain our key.
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

  return NextResponse.json({
    imageDataUrl: `data:image/webp;base64,${base64}`,
    filename,
    prompt,
    model: 'gpt-image-2',
    assetType,
  })
}
