import 'server-only'

import { getSql } from './db'

/* Server-side storage for approved, generated country visuals (hero + city
 * images) in Neon Postgres. This is the "save" target for the Country Page
 * Generator Engine: the admin generates an image, reviews it, and saves it here;
 * the country page then serves it from /api/country-asset without a redeploy. */

export type GeneratedAssetType = 'hero' | 'city'

let tableReady: Promise<void> | null = null
async function ensureTable() {
  if (!tableReady) {
    tableReady = (async () => {
      const sql = getSql()
      await sql`
        CREATE TABLE IF NOT EXISTS country_generated_assets (
          country_slug TEXT NOT NULL,
          asset_type TEXT NOT NULL,
          city_slug TEXT NOT NULL DEFAULT '',
          content_type TEXT NOT NULL DEFAULT 'image/webp',
          image_base64 TEXT NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (country_slug, asset_type, city_slug)
        )
      `
    })().catch((error) => { tableReady = null; throw error })
  }
  await tableReady
}

/** Upsert a generated asset (hero: city_slug=''; city: city_slug set). */
export async function saveGeneratedAsset(args: {
  countrySlug: string
  assetType: GeneratedAssetType
  citySlug?: string
  base64: string
  contentType?: string
}): Promise<void> {
  await ensureTable()
  const city = args.assetType === 'city' ? (args.citySlug ?? '') : ''
  const contentType = args.contentType ?? 'image/webp'
  await getSql()`
    INSERT INTO country_generated_assets (country_slug, asset_type, city_slug, content_type, image_base64, updated_at)
    VALUES (${args.countrySlug}, ${args.assetType}, ${city}, ${contentType}, ${args.base64}, NOW())
    ON CONFLICT (country_slug, asset_type, city_slug)
    DO UPDATE SET image_base64 = EXCLUDED.image_base64, content_type = EXCLUDED.content_type, updated_at = NOW()
  `
}

/** Fetch a stored asset's bytes (base64) + content type, or null when absent. */
export async function getGeneratedAsset(
  countrySlug: string,
  assetType: GeneratedAssetType,
  citySlug = '',
): Promise<{ base64: string; contentType: string } | null> {
  await ensureTable()
  const rows = (await getSql()`
    SELECT image_base64, content_type FROM country_generated_assets
    WHERE country_slug = ${countrySlug} AND asset_type = ${assetType} AND city_slug = ${citySlug}
    LIMIT 1
  `) as { image_base64: string; content_type: string }[]
  const row = rows[0]
  return row ? { base64: row.image_base64, contentType: row.content_type } : null
}

/** A stable version stamp for a stored hero (updated_at), or null when none.
 *  Used as a cache-busting query param on the serve URL. */
export async function getGeneratedHeroVersion(countrySlug: string): Promise<string | null> {
  await ensureTable()
  const rows = (await getSql()`
    SELECT updated_at FROM country_generated_assets
    WHERE country_slug = ${countrySlug} AND asset_type = 'hero' AND city_slug = ''
    LIMIT 1
  `) as { updated_at: string | Date }[]
  const row = rows[0]
  return row ? String(new Date(row.updated_at).getTime()) : null
}

/** The set of country slugs that already have a saved hero. One query, used by
 *  the backfill to compute what's still missing without N round-trips. */
export async function listSavedHeroSlugs(): Promise<Set<string>> {
  await ensureTable()
  const rows = (await getSql()`
    SELECT country_slug FROM country_generated_assets
    WHERE asset_type = 'hero' AND city_slug = ''
  `) as { country_slug: string }[]
  return new Set(rows.map((r) => r.country_slug))
}

// ---------------------------------------------------------------------------
// Hero generation lock — dedupes automated (self-heal) generation so a country's
// hero is generated at most once, not once per concurrent viewer. A short
// staleness window lets a stalled/failed claim be retried later.
// ---------------------------------------------------------------------------
let jobTableReady: Promise<void> | null = null
async function ensureJobTable() {
  if (!jobTableReady) {
    jobTableReady = (async () => {
      await getSql()`
        CREATE TABLE IF NOT EXISTS country_hero_jobs (
          country_slug TEXT PRIMARY KEY,
          status TEXT NOT NULL DEFAULT 'running',
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
    })().catch((error) => { jobTableReady = null; throw error })
  }
  await jobTableReady
}

/** Atomically try to claim generation for a country. Returns true when this
 *  caller won the claim (no fresh in-progress claim existed) and should proceed
 *  to generate; false when another caller is already handling it. */
export async function claimHeroJob(countrySlug: string): Promise<boolean> {
  await ensureJobTable()
  const rows = (await getSql()`
    INSERT INTO country_hero_jobs (country_slug, status, updated_at)
    VALUES (${countrySlug}, 'running', NOW())
    ON CONFLICT (country_slug) DO UPDATE
      SET status = 'running', updated_at = NOW()
      WHERE country_hero_jobs.status <> 'running'
         OR country_hero_jobs.updated_at < NOW() - INTERVAL '5 minutes'
    RETURNING country_slug
  `) as { country_slug: string }[]
  return rows.length > 0
}

/** Release a claim, recording the outcome. */
export async function finishHeroJob(countrySlug: string, status: 'done' | 'failed'): Promise<void> {
  await ensureJobTable()
  await getSql()`
    UPDATE country_hero_jobs SET status = ${status}, updated_at = NOW()
    WHERE country_slug = ${countrySlug}
  `
}
