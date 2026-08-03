import 'server-only'

import { getSql } from './db'

// Per-country verified relocation figures. Every populated field is expected to
// carry a citation in `sources` and a `last_verified` date; unset fields render
// as honest "being verified" states in the UI (never estimated).
export type CountryData = {
  country_slug: string
  primary_visa_route: string | null
  visa_fee_usd: number | null
  time_to_residency: string | null
  path_to_citizenship: string | null
  monthly_cost_usd: number | null
  sources: Record<string, string>
  last_verified: string | null
}

export type CountryDataInput = Partial<Omit<CountryData, 'country_slug'>>

// Seed of cited figures gathered by the research pass (accessed 2026-08-03).
// Sources are named per field; consular fees/timelines are from reputable
// immigration firms unless noted official. Seeded only when a row is absent
// (ON CONFLICT DO NOTHING) so admin edits are never overwritten.
type Seed = {
  slug: string; route: string; residency: string; citizenship: string
  sources: Record<string, string>
}
const SEED: Seed[] = [
  {
    slug: 'portugal', route: 'D7 Visa (passive income)', residency: '3–9 months',
    citizenship: '5 yrs + A2 Portuguese (2026 reform may raise non-EU to 10 yrs)',
    sources: {
      primaryVisaRoute: 'Global Citizen Solutions — globalcitizensolutions.com/portugal-d7-visa (accessed 2026-08-03)',
      timeToResidency: 'Global Citizen Solutions / Relocate.World (accessed 2026-08-03)',
      pathToCitizenship: 'Global Citizen Solutions — Portuguese Nationality Law 2026 updates (accessed 2026-08-03)',
    },
  },
  {
    slug: 'spain', route: 'Digital Nomad Visa', residency: '1–3 months (≈4 mo to residence card)',
    citizenship: '10 yrs + DELE A2 & CCSE (no US fast-track)',
    sources: {
      primaryVisaRoute: 'Get Golden Visa — getgoldenvisa.com/spain-digital-nomad-visa (accessed 2026-08-03)',
      timeToResidency: 'Global Citizen Solutions (accessed 2026-08-03)',
      pathToCitizenship: 'Lexidy / Global Citizen Solutions (accessed 2026-08-03)',
    },
  },
  {
    slug: 'greece', route: 'Digital Nomad Visa (Type D)', residency: '1–3 months',
    citizenship: '7 yrs + B1 Greek & culture exam',
    sources: {
      primaryVisaRoute: 'Get Golden Visa — getgoldenvisa.com/greece-digital-nomad-visa (accessed 2026-08-03)',
      timeToResidency: 'Global Citizen Solutions / Savory & Partners (accessed 2026-08-03)',
      pathToCitizenship: 'Global Citizen Solutions / Lexidy (accessed 2026-08-03)',
    },
  },
  {
    slug: 'estonia', route: 'Digital Nomad Visa (Type D, 1-yr stay)', residency: 'Decision ~30 days (stay visa — not a residence permit)',
    citizenship: '8 yrs (last 5 on permanent permit) + B1 Estonian; no dual citizenship',
    sources: {
      primaryVisaRoute: 'Estonian Embassy Washington (MFA), official — washington.mfa.ee/digital-nomad-visa (accessed 2026-08-03)',
      timeToResidency: 'Work in Estonia (official) — workinestonia.com/digital-nomad-visa (accessed 2026-08-03)',
      pathToCitizenship: 'Estonian Police and Border Guard Board (official) — politsei.ee (accessed 2026-08-03)',
    },
  },
  {
    slug: 'mexico', route: 'Temporary Resident Visa', residency: '~2–4 months',
    citizenship: '5 yrs + Spanish & culture exam',
    sources: {
      primaryVisaRoute: 'Mexperience — mexperience.com/mexico-residency-related-fees (accessed 2026-08-03)',
      timeToResidency: 'ResidencyMexico / Migaku guide (accessed 2026-08-03)',
      pathToCitizenship: 'Mexperience — mexperience.com/becoming-a-naturalized-mexican (accessed 2026-08-03)',
    },
  },
]

let tableReady: Promise<void> | null = null
async function ensureTable() {
  if (!tableReady) {
    tableReady = (async () => {
      const sql = getSql()
      await sql`
        CREATE TABLE IF NOT EXISTS country_data (
          country_slug TEXT PRIMARY KEY,
          primary_visa_route TEXT,
          visa_fee_usd INT,
          time_to_residency TEXT,
          path_to_citizenship TEXT,
          monthly_cost_usd INT,
          sources JSONB NOT NULL DEFAULT '{}'::jsonb,
          last_verified DATE,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
      for (const s of SEED) {
        await sql`
          INSERT INTO country_data (country_slug, primary_visa_route, time_to_residency, path_to_citizenship, sources, last_verified)
          VALUES (${s.slug}, ${s.route}, ${s.residency}, ${s.citizenship}, ${JSON.stringify(s.sources)}::jsonb, '2026-08-03')
          ON CONFLICT (country_slug) DO NOTHING
        `
      }
    })().catch((error) => { tableReady = null; throw error })
  }
  await tableReady
}

function normalize(row: (CountryData & { last_verified: string | Date | null }) | undefined, slug: string): CountryData {
  if (!row) {
    return { country_slug: slug, primary_visa_route: null, visa_fee_usd: null, time_to_residency: null, path_to_citizenship: null, monthly_cost_usd: null, sources: {}, last_verified: null }
  }
  return {
    country_slug: row.country_slug,
    primary_visa_route: row.primary_visa_route ?? null,
    visa_fee_usd: row.visa_fee_usd ?? null,
    time_to_residency: row.time_to_residency ?? null,
    path_to_citizenship: row.path_to_citizenship ?? null,
    monthly_cost_usd: row.monthly_cost_usd ?? null,
    sources: (row.sources && typeof row.sources === 'object') ? row.sources : {},
    last_verified: row.last_verified ? String(row.last_verified).slice(0, 10) : null,
  }
}

/** Verified data for one country (empty shell when none stored). */
export async function getCountryData(slug: string): Promise<CountryData> {
  await ensureTable()
  const rows = (await getSql()`SELECT * FROM country_data WHERE country_slug = ${slug} LIMIT 1`) as (CountryData & { last_verified: string | Date | null })[]
  return normalize(rows[0], slug)
}

/** All stored country data rows (for the admin console). */
export async function listCountryData(): Promise<CountryData[]> {
  await ensureTable()
  const rows = (await getSql()`SELECT * FROM country_data ORDER BY country_slug`) as (CountryData & { last_verified: string | Date | null })[]
  return rows.map((r) => normalize(r, r.country_slug))
}

/** Upsert a country's verified figures (admin / research engine writes). */
export async function upsertCountryData(slug: string, input: CountryDataInput): Promise<void> {
  await ensureTable()
  const current = await getCountryData(slug)
  const next = { ...current, ...input }
  const sources = JSON.stringify(next.sources ?? {})
  await getSql()`
    INSERT INTO country_data (country_slug, primary_visa_route, visa_fee_usd, time_to_residency, path_to_citizenship, monthly_cost_usd, sources, last_verified, updated_at)
    VALUES (${slug}, ${next.primary_visa_route}, ${next.visa_fee_usd}, ${next.time_to_residency}, ${next.path_to_citizenship}, ${next.monthly_cost_usd}, ${sources}::jsonb, ${next.last_verified}, NOW())
    ON CONFLICT (country_slug) DO UPDATE SET
      primary_visa_route = EXCLUDED.primary_visa_route,
      visa_fee_usd = EXCLUDED.visa_fee_usd,
      time_to_residency = EXCLUDED.time_to_residency,
      path_to_citizenship = EXCLUDED.path_to_citizenship,
      monthly_cost_usd = EXCLUDED.monthly_cost_usd,
      sources = EXCLUDED.sources,
      last_verified = EXCLUDED.last_verified,
      updated_at = NOW()
  `
}
