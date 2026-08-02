// Verifiable membership facts per country — public, stable, and safe to display
// (not estimated data). Used for the hero designation badges. Countries not
// listed return null, so no badge is shown rather than a guessed one.
//
// Sources: EU (europa.eu member states), Schengen Area (ec.europa.eu), NATO
// (nato.int member countries). Reflects membership as of 2026, incl. Bulgaria &
// Romania full Schengen (2025). Add a country only when its status is certain.

export type CountryFacts = { eu: boolean; schengen: boolean; nato: boolean }

const FACTS: Record<string, CountryFacts> = {
  // Scored destinations
  portugal: { eu: true, schengen: true, nato: true },
  spain: { eu: true, schengen: true, nato: true },
  greece: { eu: true, schengen: true, nato: true },
  estonia: { eu: true, schengen: true, nato: true },
  mexico: { eu: false, schengen: false, nato: false },

  // Common discoverable destinations (only entries with certain status)
  germany: { eu: true, schengen: true, nato: true },
  france: { eu: true, schengen: true, nato: true },
  italy: { eu: true, schengen: true, nato: true },
  netherlands: { eu: true, schengen: true, nato: true },
  ireland: { eu: true, schengen: false, nato: false },
  malta: { eu: true, schengen: true, nato: false },
  slovenia: { eu: true, schengen: true, nato: true },
  bulgaria: { eu: true, schengen: true, nato: true },
  romania: { eu: true, schengen: true, nato: true },
  'united-kingdom': { eu: false, schengen: false, nato: true },
  canada: { eu: false, schengen: false, nato: true },
  australia: { eu: false, schengen: false, nato: false },
  'new-zealand': { eu: false, schengen: false, nato: false },
  japan: { eu: false, schengen: false, nato: false },
  'south-korea': { eu: false, schengen: false, nato: false },
  'costa-rica': { eu: false, schengen: false, nato: false },
  panama: { eu: false, schengen: false, nato: false },
  uruguay: { eu: false, schengen: false, nato: false },
  paraguay: { eu: false, schengen: false, nato: false },
  belize: { eu: false, schengen: false, nato: false },
  ecuador: { eu: false, schengen: false, nato: false },
  thailand: { eu: false, schengen: false, nato: false },
  philippines: { eu: false, schengen: false, nato: false },
  albania: { eu: false, schengen: false, nato: true },
  georgia: { eu: false, schengen: false, nato: false },
  cambodia: { eu: false, schengen: false, nato: false },
  israel: { eu: false, schengen: false, nato: false },
}

/** Membership facts for a country slug, or null when not known. */
export function countryFacts(slug: string): CountryFacts | null {
  return FACTS[slug] ?? null
}
