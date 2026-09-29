import { timingSafeEqual } from 'node:crypto'
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
  listSavedHeroSlugs,
} from '@/lib/country-assets'

export const runtime = 'nodejs'
export const maxDuration = 120

const bodySchema = z.object({
  slug: z.string().trim().min(2).max(80).optional(),
})

type BackfillStatus =
  | 'generated'
  | 'ready'
  | 'no-missing'
  | 'failed'
  | 'unknown-country'
  | 'unauthorized'

function isAllowedAdmin(email: string) {
  // Same pattern as the admin country-asset route: the KOLMARI_ADMIN_EMAILS
  // allowlist decides who may act as an admin for country artwork.
  const configured = process.env.KOLMARI_ADMIN_EMAILS
    ?.split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
  if (!configured?.length) return process.env.NODE_ENV !== 'production'
  return configured.includes(email.toLowerCase())
}

/** True when the Authorization header carries the scheduler's bearer secret.
 *  Compared in constant time so the value can't be probed. */
function bearerAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) return false
  const header = request.headers.get('authorization')
  if (!header) return false
  const space = header.indexOf(' ')
  if (space < 0) return false
  const scheme = header.slice(0, space).toLowerCase()
  const token = header.slice(space + 1)
  if (scheme !== 'bearer' || !token) return false
  const a = Buffer.from(token, 'utf8')
  const b = Buffer.from(secret, 'utf8')
  return a.length === b.length && timingSafeEqual(a, b)
}

async function adminAuthorized(request: Request) {
  const user = await getRequestUser(request).catch(() => null)
  return !!user && isAllowedAdmin(user.email)
}

/* Nightly backfill: pre-generate country hero images the on-demand self-heal
 * hasn't covered yet, so country pages never wait on a first visit to look
 * complete. One hero per invocation keeps each call inside the Worker request
 * time limit; the GitHub Actions schedule loops until nothing is missing.
 *
 * Auth accepts EITHER a bearer CRON_SECRET (scheduler path) OR an admin
 * session (manual operator path). It only ever creates the decorative hero
 * image via the approved National Flag Shadow Hero engine, never page
 * content. Body is optional: { slug } processes one country; no slug
 * processes the first uncovered country in COUNTRIES order. */
export async function POST(request: Request) {
  const authorized = bearerAuthorized(request) || (await adminAuthorized(request))
  if (!authorized) {
    return NextResponse.json({ status: 'unauthorized' } satisfies { status: BackfillStatus }, { status: 401 })
  }

  let json: unknown = {}
  try {
    json = await request.json()
  } catch {
    // Empty or unparseable body just means "no slug".
    json = {}
  }
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ status: 'unknown-country' } satisfies { status: BackfillStatus }, { status: 400 })

  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) return NextResponse.json({ status: 'unconfigured' }, { status: 200 })

  let country = parsed.data.slug ? COUNTRIES.find((c) => c.slug === parsed.data.slug) : undefined
  if (parsed.data.slug && !country) {
    return NextResponse.json({ status: 'unknown-country' } satisfies { status: BackfillStatus }, { status: 404 })
  }

  if (!country) {
    // Find the first country with no saved hero. listSavedHeroSlugs does this
    // in one query instead of one per country.
    const saved = await listSavedHeroSlugs().catch(() => null)
    if (!saved) return NextResponse.json({ status: 'failed' } satisfies { status: BackfillStatus }, { status: 200 })
    const next = COUNTRIES.find((c) => !saved.has(c.slug))
    if (!next) return NextResponse.json({ status: 'no-missing' } satisfies { status: BackfillStatus })
    country = next
  }

  // Already covered? Nothing to do.
  const existing = await getGeneratedAsset(country.slug, 'hero').catch(() => null)
  if (existing) return NextResponse.json({ status: 'ready', slug: country.slug })

  // Only one generation per country at a time. If another job holds the lock
  // (e.g. the on-demand self-heal), report ready: coverage is on its way.
  const claimed = await claimHeroJob(country.slug).catch(() => false)
  if (!claimed) return NextResponse.json({ status: 'ready', slug: country.slug })

  try {
    const origin = new URL(request.url).origin
    const result = await generateCountryHero({ input: defaultHeroInput(country), apiKey, origin })
    if (!result.ok) {
      await finishHeroJob(country.slug, 'failed').catch(() => {})
      return NextResponse.json({ status: 'failed', slug: country.slug }, { status: 200 })
    }
    await saveGeneratedAsset({
      countrySlug: country.slug,
      assetType: 'hero',
      base64: result.base64,
      contentType: 'image/webp',
    })
    await finishHeroJob(country.slug, 'done').catch(() => {})
    return NextResponse.json({ status: 'generated', slug: country.slug })
  } catch (caught) {
    console.error('Backfill hero generation failed', caught instanceof Error ? caught.name : 'unknown')
    await finishHeroJob(country.slug, 'failed').catch(() => {})
    return NextResponse.json({ status: 'failed', slug: country.slug }, { status: 200 })
  }
}
