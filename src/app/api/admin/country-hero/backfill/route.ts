import { NextResponse } from 'next/server'
import { getRequestUser } from '@/lib/auth'
import { COUNTRIES } from '@/lib/countries'
import { defaultHeroInput, generateCountryHero } from '@/lib/country-visuals/generate'
import { listSavedHeroSlugs, saveGeneratedAsset } from '@/lib/country-assets'

export const runtime = 'nodejs'
export const maxDuration = 120

// Same allowlist gate as the interactive generator route (KOLMARI_ADMIN_EMAILS).
function isAllowedAdmin(email: string) {
  const configured = process.env.KOLMARI_ADMIN_EMAILS
    ?.split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
  if (!configured?.length) return process.env.NODE_ENV !== 'production'
  return configured.includes(email.toLowerCase())
}

/* Backfill missing country heroes. Generating ~35 images far exceeds a single
 * request's budget, so this endpoint generates ONE missing hero per call and
 * reports progress; the admin client loops until `remaining` reaches 0. This
 * keeps each request short and gives a live progress bar. Admin-only. */
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

  const saved = await listSavedHeroSlugs()
  const missing = COUNTRIES.filter((c) => !saved.has(c.slug))
  const total = COUNTRIES.length

  // Nothing left — everything is covered.
  if (missing.length === 0) {
    return NextResponse.json({ done: true, generated: null, remaining: 0, total })
  }

  const next = missing[0]
  const origin = new URL(request.url).origin
  const result = await generateCountryHero({ input: defaultHeroInput(next), apiKey, origin })
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, generated: null, failedSlug: next.slug, remaining: missing.length, total },
      { status: result.status >= 500 ? 502 : 400 },
    )
  }

  try {
    await saveGeneratedAsset({ countrySlug: next.slug, assetType: 'hero', base64: result.base64, contentType: 'image/webp' })
  } catch {
    return NextResponse.json({ error: `Generated ${next.name} but could not save it.`, remaining: missing.length, total }, { status: 500 })
  }

  return NextResponse.json({
    done: missing.length - 1 === 0,
    generated: { slug: next.slug, name: next.name },
    remaining: missing.length - 1,
    total,
  })
}
