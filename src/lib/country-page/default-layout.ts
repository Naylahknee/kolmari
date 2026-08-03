import { countryPageLayoutConfigSchema, type CountryPageLayoutConfig } from './schema'

/* The Kolmari Country Page Standard — the single default layout every country
 * page uses (reference implementation: Portugal). Foundational spacing and
 * structure are NOT per-country overridable; only explicit, limited fields are.
 * There is deliberately no per-country layout table here: all countries resolve
 * to this same config until a real, reviewed override is introduced. */
export const DEFAULT_COUNTRY_PAGE_LAYOUT: CountryPageLayoutConfig = countryPageLayoutConfigSchema.parse({
  layoutStyle: 'kolmari-country-page-standard',
  hero: {
    minHeight: 320,
    contentMaxWidth: 560,
    focalPoint: { x: 50, y: 50 },
    overlayStrength: 0.55,
    // Required four hero metrics, in order. Values resolve from country_data +
    // the user profile at render time — never hardcoded per country.
    metrics: [
      { id: 'cost', label: 'Cost vs your budget', valueSource: 'countryData.monthlyCostUsd', supportingSource: 'profile.budget' },
      { id: 'route', label: 'Your best route', valueSource: 'countryData.primaryVisaRoute', supportingSource: 'profile.eligibility' },
      { id: 'residency', label: 'Time to residency', valueSource: 'countryData.timeToResidency' },
      { id: 'citizenship', label: 'Path to citizenship', valueSource: 'countryData.pathToCitizenship' },
    ],
  },
  tabs: [
    { id: 'overview', label: 'Overview', route: 'overview' },
    { id: 'move-there', label: 'Move There', route: 'move-there' },
    { id: 'cost-housing', label: 'Cost & Housing', route: 'cost-housing' },
    { id: 'work-study', label: 'Work & Study', route: 'work-study' },
    { id: 'healthcare', label: 'Healthcare', route: 'healthcare' },
    { id: 'family-schools', label: 'Family & Schools', route: 'family-schools' },
    { id: 'lifestyle-community', label: 'Lifestyle & Community', route: 'lifestyle-community' },
    { id: 'tax-money', label: 'Tax & Money', route: 'tax-money' },
  ],
  overview: {
    mainSidebarRatio: 'minmax(0, 3fr) minmax(260px, 0.9fr)',
    personalizedSummary: { enabled: true },
    snapshot: {
      showMap: true,
      showClimateStrip: true,
      showTradeoff: true,
      factKeys: ['capital', 'population', 'currency', 'language', 'government', 'timezone', 'driving', 'schengen', 'eu', 'climate'],
    },
    showMatchScore: true,
    showRecommendedActions: true,
    showTopCities: true,
  },
})

/** The layout config for a country. Every country uses the shared standard. */
export function getCountryPageLayout(_slug: string): CountryPageLayoutConfig {
  return DEFAULT_COUNTRY_PAGE_LAYOUT
}
