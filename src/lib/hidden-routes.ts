// "5 relocation routes most people never hear about" — content ported verbatim
// from the approved Kolmari Hidden Routes Guide. Sources checked Oct 1, 2026.
// Re-verify fees, thresholds and windows before each release.

export type HiddenRouteFact = { label: string; value: string }
export type HiddenRoute = {
  id: string
  country: string
  short: string
  audience: string
  title: string
  intro: string
  facts: HiddenRouteFact[]
  catch: string
}

export const HIDDEN_ROUTES_CHECKED = 'Oct 1, 2026'

export const HIDDEN_ROUTES: HiddenRoute[] = [
  {
    id: 'daft', country: 'Netherlands', short: 'Netherlands · DAFT', audience: 'Freelancers, founders',
    title: 'Dutch-American Friendship Treaty (DAFT)',
    intro: 'A 1956 treaty that lets Americans live in the Netherlands as self-employed entrepreneurs. Freelancers qualify the same as larger businesses, and your clients can be anywhere, including the U.S.',
    facts: [
      { label: 'You need', value: 'U.S. passport, a registered Dutch business you own at least 25% of' },
      { label: 'Money', value: '€4,500 kept in a Dutch business account, plus a €423 application fee' },
      { label: 'Length', value: '2-year permit, renewable for 5 years. Permanent residency possible after 5 years' },
      { label: 'Family', value: 'Spouse, registered partner and minor children can join' },
    ],
    catch: "you can't take a regular job with a Dutch employer on this permit, and the €4,500 must stay in the business. No Dutch is needed to apply, but permanent residency requires the language and integration exams.",
  },
  {
    id: 'opportunity-card', country: 'Germany', short: 'Germany · Opportunity Card', audience: 'Skilled job-seekers',
    title: 'Opportunity Card (Chancenkarte)',
    intro: "A job-search permit launched in June 2024. You move first and look for skilled work on the ground, with no job offer required. Once you're hired, you switch to a work permit without leaving Germany.",
    facts: [
      { label: 'You need', value: 'A degree or 2+ years of vocational training, plus English B2 or German A1' },
      { label: 'The test', value: 'A fully recognised qualification, or 6 points for experience, language, age and ties to Germany' },
      { label: 'Money', value: 'Proof of about €1,091 a month (€13,092 for the year), plus health insurance' },
      { label: 'Length', value: 'Up to 12 months, with part-time work of up to 20 hours a week allowed' },
    ],
    catch: "you need an official language certificate, and the funds must usually sit in a blocked account. The card is for finding a job. It doesn't support you long-term on its own.",
  },
  {
    id: 'foreign-births-register', country: 'Ireland', short: 'Ireland · Foreign Births Register', audience: 'Irish grandparent',
    title: 'Citizenship through the Foreign Births Register',
    intro: 'If one of your grandparents was born anywhere on the island of Ireland, you can register and become an Irish citizen. An Irish passport is an EU passport, so you could then live and work in any EU country.',
    facts: [
      { label: 'You need', value: 'Full birth certificates for you, your parent and your Irish-born grandparent, plus documents linking them' },
      { label: 'Money', value: '€278 per adult, €153 per child, plus certificate and notary costs' },
      { label: 'Timeline', value: 'About 12 months, processed in strict date order' },
      { label: 'Age / income', value: 'No age limit and no income test' },
    ],
    catch: "it only goes back to grandparents. Great-grandparents count only if your parent was registered before you were born. If you're planning children, register before they're born so they qualify too.",
  },
  {
    id: 'nalcap', country: 'Spain', short: 'Spain · Language Assistant', audience: 'Graduates, students',
    title: 'Language and Culture Assistants (NALCAP)',
    intro: "Spain's Ministry of Education places native English speakers in public schools as classroom assistants. It comes with a monthly stipend, health insurance and a student visa, and applying directly through the Ministry is free.",
    facts: [
      { label: 'You need', value: 'A college degree or 2nd-year+ enrolment. New applicants must be 18 to under 45 on Jan 1, 2027' },
      { label: 'Stipend', value: 'About €700–€1,000 a month, depending on region' },
      { label: 'Hours', value: '12–16 classroom hours a week, roughly October to May' },
      { label: 'Next window', value: '2026–27 is closed. The 2027–28 call usually opens in early 2027' },
    ],
    catch: "the stipend doesn't cover flights or moving costs, so bring savings for your first three months. The program has been changing, with some regions reported to be leaving it, so check which regions take part before you apply.",
  },
  {
    id: 'working-holiday', country: 'Australia', short: 'Australia · Working Holiday', audience: 'Ages 18–30',
    title: 'Work and Holiday visa (subclass 462)',
    intro: 'Live and work in Australia for a year in any legal job, with no employer sponsor. The whole application is online. Americans also have working holiday options in New Zealand, Ireland, South Korea, Singapore and Canada.',
    facts: [
      { label: 'You need', value: 'Age 18–30, a U.S. passport, and health and character checks' },
      { label: 'Money', value: 'About AU$5,000 in savings and a ticket home (or the funds to buy one)' },
      { label: 'Length', value: '12 months, extendable to 3 years with specified regional work' },
      { label: 'Cap', value: 'No annual limit for Americans' },
    ],
    catch: 'you can only do it once, and you must apply before you turn 31. Some guides say the 462 visa needs a degree or current enrolment, so confirm the education rule on the official site.',
  },
]

export const HIDDEN_ROUTE_SOURCES = [
  { label: 'Netherlands IND', href: 'https://ind.nl/en' },
  { label: 'Make it in Germany', href: 'https://www.make-it-in-germany.com/en/visa-residence/types/job-search-opportunity-card' },
  { label: 'Ireland DFAT · Foreign Births', href: 'https://www.ireland.ie/en/dfa/citizenship/born-abroad/registering-a-foreign-birth/' },
  { label: 'Spain Ministry of Education', href: 'https://www.educacionfpydeportes.gob.es/en/servicios-al-ciudadano/catalogo/general/99/998188/ficha/998188-2025.html' },
  { label: 'Australia Home Affairs', href: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-462' },
]
