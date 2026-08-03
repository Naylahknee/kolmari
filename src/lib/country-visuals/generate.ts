import 'server-only'

import { buildHeroPrompt, buildHeroEditPrompt } from './prompt'
import { heroImageInputSchema, type HeroImageInput } from './schema'

/* Shared hero-generation core for automated coverage (backfill + self-heal).
 *
 * The interactive admin route (src/app/api/admin/country-hero/route.ts) still
 * owns the tunable, human-driven path. This helper is the unattended path: given
 * a country's name/slug/flag code it builds a sensible National Flag Shadow Hero
 * request and calls OpenAI, so pages can be covered without anyone in the admin
 * panel. It never fabricates page content — only the decorative hero image. */

type OpenAIImageResponse = {
  data?: Array<{ b64_json?: string }>
  error?: { message?: string }
}

export type HeroGenerationResult =
  | { ok: true; base64: string }
  | { ok: false; status: number; error: string }

/** A default National Flag Shadow Hero input for a country, using the approved
 *  standard defaults. Text fields are generic-but-safe: the real flag raster and
 *  the committed reference carry the exact look, and the model preserves the
 *  actual emblem from the provided flag image, so no per-country prose is needed. */
export function defaultHeroInput(country: { name: string; slug: string; code: string }): HeroImageInput {
  return heroImageInputSchema.parse({
    countryName: country.name,
    countrySlug: country.slug,
    flagCode: country.code,
    protectedSymbolDescription: `the national emblem, coat of arms, or crest exactly as it appears on the provided ${country.name} flag`,
    protectedSymbolPosition: 'its official position on the flag',
    geographicRequirements: `the complete mainland of ${country.name} plus its major islands and outlying territories`,
    // The remaining fields (safeZonePercent, silhouette scale/position, shadow
    // opacity/depth, fabric intensity, focal point, quality) use schema defaults,
    // which encode the approved standard.
  })
}

/** Fetch a public asset from this deployment's own origin as an image Blob. */
async function fetchImageBlob(origin: string, path: string, type: string): Promise<{ blob: Blob; filename: string } | null> {
  try {
    const res = await fetch(new URL(path, origin))
    if (!res.ok) return null
    const bytes = Buffer.from(await res.arrayBuffer())
    return { blob: new Blob([bytes], { type }), filename: path.split('/').pop() ?? 'image' }
  } catch {
    return null
  }
}

/** Generate a National Flag Shadow Hero (WebP base64) for a country. Prefers the
 *  image-edits endpoint with the country's own flag raster + the committed
 *  reference so the real flag is preserved and the approved look is matched;
 *  falls back to text-to-image when no flag raster is available. */
export async function generateCountryHero({
  input,
  apiKey,
  origin,
}: {
  input: HeroImageInput
  apiKey: string
  origin: string
}): Promise<HeroGenerationResult> {
  const images: Array<{ blob: Blob; filename: string }> = []
  let hasStyleRef = false

  if (input.flagCode) {
    const flag = await fetchImageBlob(origin, `/flags-png/${input.flagCode.toLowerCase()}.png`, 'image/png')
    if (flag) images.push(flag)
  }
  if (images.length) {
    // Built-in National Flag Shadow Hero standard as the style exemplar. Only
    // attached alongside the country's own flag so its identity can't bleed in.
    const ref = await fetchImageBlob(origin, '/references/national-flag-shadow-hero.webp', 'image/webp')
    if (ref) {
      images.push({ blob: ref.blob, filename: 'reference.webp' })
      hasStyleRef = true
    }
  }

  const prompt = images.length ? buildHeroEditPrompt(input, { hasStyleRef }) : buildHeroPrompt(input)
  const size = '1536x1024'

  let response: Response
  try {
    if (images.length) {
      const form = new FormData()
      form.append('model', 'gpt-image-2')
      form.append('prompt', prompt)
      form.append('size', size)
      form.append('quality', input.quality)
      form.append('output_format', 'webp')
      form.append('background', 'opaque')
      form.append('n', '1')
      for (const img of images) form.append('image[]', img.blob, img.filename)
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
          quality: input.quality,
          output_format: 'webp',
          background: 'opaque',
          n: 1,
        }),
        signal: AbortSignal.timeout(115_000),
      })
    }
  } catch (caught) {
    // Log only the failure kind — never the request (which carries the key).
    console.error('OpenAI hero request failed', caught instanceof Error ? caught.name : 'unknown')
    return { ok: false, status: 504, error: 'Could not reach the image service.' }
  }

  const result = (await response.json().catch(() => ({}))) as OpenAIImageResponse
  if (!response.ok) {
    console.error('OpenAI hero generation failed', response.status, result.error?.message)
    return { ok: false, status: response.status >= 500 ? 502 : 400, error: result.error?.message ?? 'Image generation failed.' }
  }

  const base64 = result.data?.[0]?.b64_json
  if (!base64) return { ok: false, status: 502, error: 'The image service returned no image.' }
  return { ok: true, base64 }
}
