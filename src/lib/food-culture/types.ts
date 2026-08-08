/* Food & Health Fit — taxonomy and types.
 *
 * A food/health dimension for country research, expressed as FILTERABLE TAGS
 * rather than a single blended score. A seafood-forward country is a great
 * heart-health fit and a poor shellfish-allergy fit at the same time; one number
 * would hide that tension, so we keep the axes separate and let the user weigh
 * them.
 *
 * Data-integrity note: every country entry is editorial
 * (`assessmentType: 'kolmari-editorial'`) and must carry `lastReviewed`. Labeling
 * law and allergen prevalence are regulatory/statistical claims — never invent
 * them; cite a source where possible and show honest "being verified" states
 * when a value is not yet confirmed. */

// The 9 locked cuisine archetype tags.
export const FOOD_ARCHETYPES = [
  'mediterranean',
  'farm-to-table',
  'seafood-forward',
  'plant-forward',
  'strict-allergen-labeling',
  'low-processed-food',
  'dairy-heavy',
  'nut-heavy',
  'high-processed-food',
] as const
export type FoodArchetype = (typeof FOOD_ARCHETYPES)[number]

// The 6 tracked allergens.
export const TRACKED_ALLERGENS = ['shellfish', 'treeNuts', 'peanuts', 'dairy', 'gluten', 'eggs'] as const
export type TrackedAllergen = (typeof TRACKED_ALLERGENS)[number]

// How often an allergen shows up in everyday, typical cuisine.
export type AllergenPrevalence = 'common' | 'occasional' | 'rare'

export type LabelingLaw = {
  /** Plain-language summary of the country's food-allergen labeling regime. */
  summary: string
  /** Optional citation for the summary (statute, regulator, or official page). */
  sourceUrl?: string
}

export type FoodCultureCountry = {
  /** Must match a slug in src/lib/countries.ts. */
  slug: string
  name: string
  archetypes: FoodArchetype[]
  /** Prevalence per tracked allergen in everyday cuisine. */
  allergenPrevalence: Record<TrackedAllergen, AllergenPrevalence>
  labelingLaw: LabelingLaw
  /** Editorial note on cardiovascular/heart-health fit. */
  cardioNote: string
  /** All entries are editorial assessments, disclosed on every card. */
  assessmentType: 'kolmari-editorial'
  /** ISO date (YYYY-MM-DD) the entry was last reviewed. */
  lastReviewed: string
}

// ---------------------------------------------------------------------------
// Display metadata
// ---------------------------------------------------------------------------
export const ARCHETYPE_LABELS: Record<FoodArchetype, string> = {
  mediterranean: 'Mediterranean',
  'farm-to-table': 'Farm-to-table',
  'seafood-forward': 'Seafood-forward',
  'plant-forward': 'Plant-forward',
  'strict-allergen-labeling': 'Strict allergen labeling',
  'low-processed-food': 'Low processed food',
  'dairy-heavy': 'Dairy-heavy',
  'nut-heavy': 'Nut-heavy',
  'high-processed-food': 'High processed food',
}

export const ARCHETYPE_DESCRIPTIONS: Record<FoodArchetype, string> = {
  mediterranean: 'Olive oil, vegetables, legumes, fish, and whole grains as the everyday base.',
  'farm-to-table': 'Fresh, locally sourced produce is the norm rather than the exception.',
  'seafood-forward': 'Fish and shellfish feature heavily in typical meals.',
  'plant-forward': 'Vegetables, legumes, and grains anchor most plates.',
  'strict-allergen-labeling': 'Enforced allergen declaration on packaged food and often menus.',
  'low-processed-food': 'Everyday eating leans on fresh, minimally processed ingredients.',
  'dairy-heavy': 'Milk, cheese, and butter appear across everyday cooking.',
  'nut-heavy': 'Tree nuts and/or peanuts are common in everyday dishes.',
  'high-processed-food': 'Packaged and ultra-processed foods are a large share of the everyday diet.',
}

export const ALLERGEN_LABELS: Record<TrackedAllergen, string> = {
  shellfish: 'Shellfish',
  treeNuts: 'Tree nuts',
  peanuts: 'Peanuts',
  dairy: 'Dairy',
  gluten: 'Gluten',
  eggs: 'Eggs',
}

export const PREVALENCE_LABELS: Record<AllergenPrevalence, string> = {
  common: 'Common',
  occasional: 'Occasional',
  rare: 'Rare',
}

// ---------------------------------------------------------------------------
// Ranking
// ---------------------------------------------------------------------------
/** Flagging an allergen never removes a country — it flags it and breaks ranking
 *  ties toward safety. A country is "flagged" for a selected allergen when that
 *  allergen is `common` in its everyday cuisine. */
export function allergenFlagCount(country: FoodCultureCountry, flagged: TrackedAllergen[]): number {
  return flagged.reduce((n, a) => (country.allergenPrevalence[a] === 'common' ? n + 1 : n), 0)
}

/** Count of the user's selected archetypes that a country matches. */
export function archetypeMatchCount(country: FoodCultureCountry, selected: FoodArchetype[]): number {
  return selected.reduce((n, a) => (country.archetypes.includes(a) ? n + 1 : n), 0)
}

/** Sort: archetype match count desc, then fewer allergen flags, then alphabetical. */
export function rankCountries(
  countries: FoodCultureCountry[],
  selected: FoodArchetype[],
  flagged: TrackedAllergen[],
): FoodCultureCountry[] {
  return [...countries].sort((a, b) => {
    const matchDiff = archetypeMatchCount(b, selected) - archetypeMatchCount(a, selected)
    if (matchDiff !== 0) return matchDiff
    const flagDiff = allergenFlagCount(a, flagged) - allergenFlagCount(b, flagged)
    if (flagDiff !== 0) return flagDiff
    return a.name.localeCompare(b.name)
  })
}
