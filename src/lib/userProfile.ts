import 'server-only'

import { getProfile, hasCompletedProfile, type PathwayGoal, type RelocationProfile } from './profile'
import { REGION_SLUGS, type RegionSlug } from './nexitnation-data'
import { evaluatePathways } from './pathways'
import { COUNTRIES, type CountryDetail } from './countries'
import { calculateNexitReadiness } from './readiness'

export type NexitnationUserProfile = {
  name: string
  regionMatches: Record<RegionSlug, number>
}

const labelToSlug: Record<string, RegionSlug> = {
  Europe: 'europe', Africa: 'africa', Asia: 'asia', Oceania: 'oceania',
  'North America': 'north-america', 'Latin America': 'latin-america',
}

const regionalSignals: Record<RegionSlug, PathwayGoal[]> = {
  europe: ['Remote Work', 'Employment', 'Entrepreneurship', 'Passive Income / Retirement', 'Education', 'Family Reunification', 'Ancestry', 'Investment'],
  africa: ['Employment', 'Entrepreneurship', 'Education', 'Family Reunification', 'Ancestry', 'Investment'],
  asia: ['Remote Work', 'Employment', 'Entrepreneurship', 'Education', 'Investment'],
  'north-america': ['Employment', 'Entrepreneurship', 'Education', 'Family Reunification', 'Investment'],
  'latin-america': ['Remote Work', 'Entrepreneurship', 'Passive Income / Retirement', 'Education', 'Family Reunification', 'Investment'],
  oceania: ['Employment', 'Entrepreneurship', 'Education', 'Family Reunification', 'Ancestry', 'Investment'],
}

export function calculateRegionMatches(profile: RelocationProfile): Record<RegionSlug, number> | null {
  if (!hasCompletedProfile(profile)) return null
  const selected = new Set(profile.preferred_regions.map((label) => labelToSlug[label]).filter(Boolean))
  const open = profile.preferred_regions.includes('Open to anywhere')
  return Object.fromEntries(REGION_SLUGS.map((slug) => {
    const preference = selected.has(slug) ? 35 : open ? 20 : 0
    const goalHits = profile.goals.filter((goal) => regionalSignals[slug].includes(goal)).length
    const goals = profile.goals.length ? Math.round(goalHits / profile.goals.length * 35) : 0
    const planningFacts = [profile.monthly_income !== null, profile.timeline !== null, profile.occupation !== null].filter(Boolean).length * 10
    return [slug, Math.min(100, preference + goals + planningFacts)]
  })) as Record<RegionSlug, number>
}

export function buildNexitnationProfile(profile: RelocationProfile, fallbackName: string): NexitnationUserProfile | null {
  const regionMatches = calculateRegionMatches(profile)
  if (!regionMatches) return null
  return { name: profile.display_name || fallbackName, regionMatches }
}

export async function loadNexitnationProfile(userId: number, email: string) {
  return buildNexitnationProfile(await getProfile(userId), email.split('@')[0])
}

// Compatibility helper. Overall readiness remains unavailable until real
// document and research completion inputs are implemented.
export function calculateReadiness(profile: RelocationProfile): number | null {
  return calculateNexitReadiness(profile).overall
}

export type CountryMatch = { score: number; reasons: string[]; tradeoff: string }

export function calculateCountryMatch(profile: RelocationProfile, country: CountryDetail): CountryMatch | null {
  if (!hasCompletedProfile(profile)) return null
  const reasons: string[] = []
  let score = 0

  if (profile.monthly_income !== null) {
    if (profile.monthly_income >= country.incomeRequired * 1.5) {
      score += 30
      reasons.push(`Your budget comfortably covers ${country.name}'s typical income guide`)
    } else if (profile.monthly_income >= country.incomeRequired) {
      score += 22
      reasons.push(`Your income meets ${country.name}'s planning income guide`)
    } else {
      score += 8
    }
  }

  const regionLabels = country.region === 'Europe' ? ['Europe'] : ['North America', 'Latin America']
  if (regionLabels.some((label) => profile.preferred_regions.includes(label))) {
    score += 25
    reasons.push(`${country.region === 'Europe' ? 'Europe' : 'the Americas'} is one of your preferred regions`)
  } else if (profile.preferred_regions.includes('Open to anywhere')) {
    score += 15
  }

  const evaluations = evaluatePathways(profile)
  const strong = evaluations.filter((item) => item.status === 'Strong Match').length
  const possible = evaluations.filter((item) => item.status === 'Possible Match').length
  score += Math.min(25, strong * 14 + possible * 5)
  if (strong > 0) reasons.push(`${strong} Nexit Pathway${strong > 1 ? 's' : ''} may support your move`)

  if (profile.remote && /nomad|remote|d7/i.test(country.visaType)) {
    score += 10
    reasons.push(`${country.name} offers a route suited to remote income`)
  }

  score += country.safety === 'High' ? 10 : 6
  if (country.safety === 'High' && reasons.length < 3) reasons.push(`${country.name} rates highly on general safety signals`)

  const tradeoff = profile.monthly_income !== null && profile.monthly_income < country.incomeRequired
    ? `Central ${country.city} may exceed your current budget — smaller cities can be more affordable.`
    : `Costs vary widely by city; central ${country.city} runs higher than regional areas.`

  return { score: Math.min(100, Math.round(score)), reasons: reasons.slice(0, 3), tradeoff }
}

export type RankedNextination = { country: CountryDetail; match: CountryMatch }

export function rankNextinations(profile: RelocationProfile): RankedNextination[] {
  return COUNTRIES
    .map((country) => ({ country, match: calculateCountryMatch(profile, country) }))
    .filter((item): item is RankedNextination => item.match !== null)
    .sort((a, b) => b.match.score - a.match.score)
}
