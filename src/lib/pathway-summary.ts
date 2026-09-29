// Short, scannable values for the Pathways explorer rows and compare view.
// The full sentences in `pathways.ts` stay the source of truth and are shown
// in the route panel; these are display summaries only. Keep them in sync
// when a pathway's research is re-verified.

export type PathwaySummary = {
  code: string        // ISO-3166-1 alpha-2, for flagSrc()
  shortName: string   // row title
  keyFact: string     // the one number people compare first
  processing: string
  fees: string
  family: 'Yes' | 'May apply' | 'Per person' | 'No'
}

export const PATHWAY_SUMMARY: Record<string, PathwaySummary> = {
  'portugal-remote-work': { code: 'pt', shortName: 'Remote-work route', keyFact: '4× minimum wage /mo', processing: 'Varies', fees: 'Varies', family: 'May apply' },
  'germany-eu-blue-card': { code: 'de', shortName: 'EU Blue Card', keyFact: '€50,700 /yr', processing: 'Varies', fees: 'Confirm locally', family: 'Yes' },
  'portugal-entrepreneur': { code: 'pt', shortName: 'Entrepreneur route', keyFact: 'Proof of means', processing: '~60 days', fees: '€90+', family: 'May apply' },
  'portugal-passive-income': { code: 'pt', shortName: 'Stable-income route', keyFact: 'Stable income', processing: 'Varies', fees: 'Varies', family: 'May apply' },
  'canada-study-permit': { code: 'ca', shortName: 'Study permit', keyFact: 'Tuition + living', processing: 'Varies', fees: 'CA$150+', family: 'May apply' },
  'spain-family-reunification': { code: 'es', shortName: 'Family reunification', keyFact: '150% IPREM', processing: 'Varies', fees: 'Varies', family: 'Yes' },
  'ireland-foreign-births': { code: 'ie', shortName: 'Foreign Births Register', keyFact: 'No income test', processing: 'Can change', fees: 'See schedule', family: 'Per person' },
  'new-zealand-active-investor-plus': { code: 'nz', shortName: 'Active Investor Plus', keyFact: 'NZ$5M+ invested', processing: '~10.5 weeks', fees: 'NZ$27,470+', family: 'Yes' },
}

export function summaryFor(id: string, fallbackName: string): PathwaySummary {
  return PATHWAY_SUMMARY[id] ?? { code: '', shortName: fallbackName, keyFact: '—', processing: '—', fees: '—', family: 'May apply' }
}
