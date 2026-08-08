/* Food & Health Fit — taxonomy and types.
 *
 * A food/health dimension for country research, expressed as FILTERABLE TAGS
 * rather than a single blended score. A seafood-forward country is a great
 * heart-health fit and a poor shellfish-allergy fit at the same time; one number
 * would hide that tension, so we keep the axes separate and let the user weigh
 * them.
 *
 * Data-integrity note: archetypes, cardioNote, and allergenPrevalence are
 * Kolmari's own editorial assessment (assessmentType: 'kolmari-editorial'), not a
 * certified medical or regulatory dataset. labelingLaw + sourceUrl are legal
 * claims and must be verified/refreshed on a review cadence like the visa data.
 * allergenPrevalence describes how commonly an allergen shows up in
 * everyday/traditional cuisine — "common" is a caution flag, not a disqualifier. */

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

// How often an allergen shows up in everyday cuisine.
export type AllergenPrevalence = 'common' | 'occasional' | 'rare'

export type CountryFoodCulture = {
  /** Must match a slug in src/lib/countries.ts where the country exists there. */
  countrySlug: string
  archetypes: FoodArchetype[]
  allergenPrevalence: Record<TrackedAllergen, AllergenPrevalence>
  /** Plain-language summary of the country's food-allergen labeling regime. */
  labelingLaw: string
  /** Editorial note on cardiovascular/heart-health fit. */
  cardioNote: string
  /** All entries are editorial assessments, disclosed on every card. */
  assessmentType: 'kolmari-editorial'
  /** Optional citation for the labeling summary. */
  sourceUrl?: string
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
// Ranking helpers
// ---------------------------------------------------------------------------
/** Flagging an allergen never removes a country — it flags it and breaks ranking
 *  ties toward safety. A country is "flagged" for a selected allergen when that
 *  allergen is `common` in its everyday cuisine. */
export function allergenFlagCount(country: CountryFoodCulture, flagged: TrackedAllergen[]): number {
  return flagged.reduce((n, a) => (country.allergenPrevalence[a] === 'common' ? n + 1 : n), 0)
}

/** Count of the user's selected archetypes that a country matches. */
export function archetypeMatchCount(country: CountryFoodCulture, selected: FoodArchetype[]): number {
  return selected.reduce((n, a) => (country.archetypes.includes(a) ? n + 1 : n), 0)
}
