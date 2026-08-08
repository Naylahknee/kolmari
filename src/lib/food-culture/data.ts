import type { FoodCultureCountry } from './types'

/* Per-country Food & Health Fit data.
 *
 * INTENTIONALLY EMPTY. The curated, source-checked country entries from the
 * research session should be pasted here — each conforming to `FoodCultureCountry`
 * in ./types.ts. Do not fabricate allergen prevalence, labeling law, or heart-
 * health claims: these are regulatory/statistical assertions and must be verified
 * (EU entries and Japan are well-sourced; lower-confidence entries such as Costa
 * Rica, Colombia, Ghana, Mauritius, and the UAE need statute-level checks before
 * anyone relies on them for an allergy-sensitive move).
 *
 * Every entry must set `assessmentType: 'kolmari-editorial'` and a real
 * `lastReviewed` date. Slugs must match src/lib/countries.ts.
 *
 * Until entries are added, the filter renders an honest "being added" state
 * rather than any placeholder or invented data. */
export const FOOD_CULTURE_COUNTRIES: FoodCultureCountry[] = []
