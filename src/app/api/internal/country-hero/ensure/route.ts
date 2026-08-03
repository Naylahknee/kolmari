import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getRequestUser } from '@/lib/auth'
import { COUNTRIES } from '@/lib/countries'
import { defaultHeroInput, generateCountryHero } from '@/lib/country-visuals/generate'
import {
  getGeneratedAsset,
  saveGeneratedAsset,
  claimHeroJob,
  finishHeroJob,
} from '@/lib/country-assets'

export const runtime = 'nodejs'
export const maxDuration = 120

const bodySchema = z.object({ slug: z.string().trim().min(2).max(80) })

/* Self-heal: ensure a country has a saved hero image, generating one in the
 * background when it doesn't. Called fire-and-forget by the country page when it
 * renders without a saved hero. Safe to call on every uncovered view — it is
 * deduped and capped:
 *   - only slugs that exist in the fixed COUNTRIES list are accepted;
 *   - if a hero already exists it is a no-op;
 *   - a DB lock ensures at most one generation runs per country at a time, so
 *     concurrent first-views don't each spend an image;
 *   - once saved, the page stops calling this endpoint for that country.
 * It only ever creates the decorative hero image — never page content/figures. */
export async function POST(request: Request) {
  // Require an authenticated session (country pages are behind app auth); this
  // keeps the endpoint off the open internet while still letting any signed-in
  // viewer trigger coverage.
  const user = await getRequestUser(request)
  if (!user) return NextResponse.json({ status: 'unauthorized' }, { status: 401 })

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ status: 'bad-request' }, { status: 400 })
  }
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ status: 'bad-request' }, { status: 400 })

  const country = COUNTRIES.find((c) => c.slug === parsed.data.slug)
  if (!country) return NextResponse.json({ status: 'unknown-country' }, { status: 404 })

  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) return NextResponse.json({ status: 'unconfigured' })

  // Already covered? Nothing to do.
  const existing = await getGeneratedAsset(country.slug, 'hero').catch(() => null)
  if (existing) return NextResponse.json({ status: 'ready' })

  // Only one generation per country at a time.
  const claimed = await claimHeroJob(country.slug).catch(() => false)
  if (!claimed) return NextResponse.json({ status: 'pending' })

  try {
    const origin = new URL(request.url).origin
    const result = await generateCountryHero({ input: defaultHeroInput(country), apiKey, origin })
    if (!result.ok) {
      await finishHeroJob(country.slug, 'failed').catch(() => {})
      return NextResponse.json({ status: 'failed' }, { status: 200 })
    }
    await saveGeneratedAsset({ countrySlug: country.slug, assetType: 'hero', base64: result.base64, contentType: 'image/webp' })
    await finishHeroJob(country.slug, 'done').catch(() => {})
    return NextResponse.json({ status: 'generated' })
  } catch (caught) {
    console.error('Self-heal hero generation failed', caught instanceof Error ? caught.name : 'unknown')
    await finishHeroJob(country.slug, 'failed').catch(() => {})
    return NextResponse.json({ status: 'failed' }, { status: 200 })
  }
}
