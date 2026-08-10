// Real, sourced cost baselines for the My Plan budget (Phase 6).
//
// Every figure in BUDGET_BASELINES is cited in its `sources` entry (source name,
// URL, access date). Values are Standard-tier, per single adult, monthly USD for
// the `monthly` categories; one-time USD for `oneTime`. Countries without
// defensible sourced data are simply omitted — the UI then shows an honest empty
// state rather than a fabricated number. Never add an uncited number here.

import type { BudgetLine, LifestyleTier } from './plan-types'

// Tier scales the monthly living-cost baselines. These multipliers are a stated
// modelling assumption (not sourced data); one-time costs are not scaled.
export const TIER_MULTIPLIER: Record<LifestyleTier, number> = { Budget: 0.8, Standard: 1, Premium: 1.4 }

type MonthlyKey = 'housing' | 'food' | 'transport' | 'healthcare' | 'other'
type OneTimeKey = 'visa' | 'deposits' | 'flights' | 'logistics'
export type BaselineCategory = MonthlyKey | OneTimeKey

export type CountryBaseline = {
  monthly: Partial<Record<MonthlyKey, number>>
  oneTime: Partial<Record<OneTimeKey, number>>
  sources: Partial<Record<BaselineCategory, string>>
  gdpPerCapitaPPP?: { value: number; source: string }
}

const MONTHLY_KEYS: readonly string[] = ['housing', 'food', 'transport', 'healthcare', 'other']
const ONE_TIME_KEYS: readonly string[] = ['visa', 'deposits', 'flights', 'logistics']

// Keyed by destination country name (matches KolmariPlan.saved_nextination). Each
// scored country has one benchmark city; the city and its source are named in
// every `sources` string. Figures are Standard-tier, per single adult.
//
// What is deliberately NOT here (shown as an honest empty state instead of a
// fabricated number):
//   • food — Numbeo publishes per-item grocery prices, not a sourced monthly
//     basket, so any single total would be invented.
//   • healthcare — private-insurance quotes are wide, age-dependent broker
//     RANGES; no defensible single published figure exists.
//   • visa / flights / deposits / logistics — visa fees found were aggregator-
//     sourced, conflicting, and unverified against official government sites
//     (visa/legal costs are also on the never-fabricate list); the rest were not
//     researched.
//   • Athens (Greece) and Playa del Carmen (Mexico) city costs — only ranges or
//     unconfirmed 2026 prices surfaced, so those countries carry only their
//     authoritative national GDP figure.
//
// Monthly "other" bundles the three sourced recurring utilities (basic
// utilities + broadband + mobile). EUR→USD converted at 1.154 (end-July 2026,
// exchange-rates.org). Numbeo is crowd-sourced and labelled as such; operator
// transit fares and World Bank GDP are authoritative. Retrieved 2026-08-02.
export const BUDGET_BASELINES: Record<string, CountryBaseline> = {
  Portugal: {
    monthly: { housing: 1625, transport: 35, other: 208 },
    oneTime: {},
    sources: {
      housing: 'Numbeo (crowd-sourced), Lisbon 1-bedroom apartment, city centre: €1,408/mo × 1.154 FX (Jul 2026). numbeo.com/cost-of-living/in/Lisbon — accessed 2026-08-02.',
      transport: 'Metropolitano de Lisboa — Navegante Municipal monthly pass €30 × 1.154 FX (2026 fares). metrolisboa.pt — accessed 2026-08-02.',
      other: 'Numbeo (crowd-sourced), Lisbon: basic utilities €126 + broadband 60Mbps+ €36.25 + mobile plan €18.17 = €180.42/mo × 1.154 FX (Jul 2026). numbeo.com/cost-of-living/in/Lisbon — accessed 2026-08-02.',
    },
    gdpPerCapitaPPP: {
      value: 50617,
      source: 'World Bank, GDP per capita, PPP (current international $), Portugal 2024 — series NY.GDP.PCAP.PP.CD. data.worldbank.org — accessed 2026-08-02.',
    },
  },

  Spain: {
    monthly: { housing: 1454, transport: 26, other: 248 },
    oneTime: {},
    sources: {
      housing: 'Numbeo (crowd-sourced), Barcelona 1-bedroom apartment, city centre: €1,260/mo × 1.154 FX (Jul 2026). numbeo.com/cost-of-living/in/Barcelona — accessed 2026-08-02.',
      transport: 'TMB — T-usual monthly pass (1 zone) €22.80 × 1.154 FX (2026 fares). tmb.cat — accessed 2026-08-02.',
      other: 'Numbeo (crowd-sourced), Barcelona: basic utilities €163 + broadband 60Mbps+ €35 + mobile plan €17 = €215/mo × 1.154 FX (Jul 2026). numbeo.com/cost-of-living/in/Barcelona — accessed 2026-08-02.',
    },
    gdpPerCapitaPPP: {
      value: 56926,
      source: 'World Bank, GDP per capita, PPP (current international $), Spain 2024 — series NY.GDP.PCAP.PP.CD. data.worldbank.org — accessed 2026-08-02.',
    },
  },

  Estonia: {
    monthly: { housing: 808, transport: 35, other: 382 },
    oneTime: {},
    sources: {
      housing: 'Numbeo (crowd-sourced), Tallinn 1-bedroom apartment, city centre: ~€700/mo × 1.154 FX (Jul 2026; lower-confidence — a €700–1,100 range appears for premium-central areas). numbeo.com/cost-of-living/in/Tallinn — accessed 2026-08-02.',
      transport: 'City of Tallinn — 30-day public-transport ticket €30 for non-residents × 1.154 FX (2026; free for registered Tallinn residents). tallinn.ee — accessed 2026-08-02.',
      other: 'Numbeo (crowd-sourced), Tallinn: basic utilities €289 (reflects winter heating) + broadband 60Mbps+ €27 + mobile plan €15 = €331/mo × 1.154 FX (Jul 2026). numbeo.com/cost-of-living/in/Tallinn — accessed 2026-08-02.',
    },
    gdpPerCapitaPPP: {
      value: 49334,
      source: 'World Bank, GDP per capita, PPP (current international $), Estonia 2024 — series NY.GDP.PCAP.PP.CD. data.worldbank.org — accessed 2026-08-02.',
    },
  },

  Greece: {
    monthly: {},
    oneTime: {},
    sources: {},
    gdpPerCapitaPPP: {
      value: 44074,
      source: 'World Bank, GDP per capita, PPP (current international $), Greece 2024 — series NY.GDP.PCAP.PP.CD. data.worldbank.org — accessed 2026-08-02.',
    },
  },

  Mexico: {
    monthly: {},
    oneTime: {},
    sources: {},
    gdpPerCapitaPPP: {
      value: 25688,
      source: 'World Bank, GDP per capita, PPP (current international $), Mexico 2024 — series NY.GDP.PCAP.PP.CD. data.worldbank.org — accessed 2026-08-02.',
    },
  },
}

export function hasBaselines(country: string | null | undefined): boolean {
  return Boolean(country && country in BUDGET_BASELINES)
}

/** Baseline (USD) for a budget category at a tier; null when not sourced. */
export function baselineFor(country: string | null | undefined, category: string, tier: LifestyleTier): number | null {
  if (!country) return null
  const b = BUDGET_BASELINES[country]
  if (!b) return null
  if (MONTHLY_KEYS.includes(category)) {
    const v = b.monthly[category as MonthlyKey]
    return typeof v === 'number' ? Math.round(v * TIER_MULTIPLIER[tier]) : null
  }
  if (ONE_TIME_KEYS.includes(category)) {
    const v = b.oneTime[category as OneTimeKey]
    return typeof v === 'number' ? v : null
  }
  return null
}

export function baselineSource(country: string | null | undefined, category: string): string | null {
  if (!country) return null
  return BUDGET_BASELINES[country]?.sources[category as BaselineCategory] ?? null
}

/** National GDP per capita (PPP) benchmark for the destination; null when not sourced. */
export function baselineGdp(country: string | null | undefined): { value: number; source: string } | null {
  if (!country) return null
  return BUDGET_BASELINES[country]?.gdpPerCapitaPPP ?? null
}

/** Budget lines with systemBaseline filled from the destination + tier. */
export function applyBaselines(budget: BudgetLine[], country: string | null | undefined, tier: LifestyleTier): BudgetLine[] {
  return budget.map((line) => {
    const next = baselineFor(country, line.category, tier)
    return line.systemBaseline === next ? line : { ...line, systemBaseline: next }
  })
}

/** Whether applying baselines would change any line (avoids autosave loops). */
export function baselinesDiffer(budget: BudgetLine[], country: string | null | undefined, tier: LifestyleTier): boolean {
  return budget.some((line) => line.systemBaseline !== baselineFor(country, line.category, tier))
}
