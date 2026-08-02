// Supporting content for the Pathways page, ported verbatim from the approved
// design reference (design-reference/claude-design/Kolmari-App-Reference.html.html
// — the JOURNEY and ALT arrays).
//
// These carry no official source URL or verification date yet, unlike the
// researched routes in `pathways.ts`. They are presented as orientation, and the
// page states that official requirements still control eligibility. Add a source
// and lastVerified to each before treating any of it as researched guidance.

export type JourneyStepState = 'done' | 'current' | 'todo'
export type VisaJourneyStep = { label: string; meta: string; state: JourneyStepState }

/**
 * The consulate-to-permit sequence for the selected route. Keyed by the
 * destination country so a plan pointed elsewhere does not show Portuguese
 * steps; countries without a researched sequence show an empty state.
 */
export const VISA_JOURNEYS: Record<string, VisaJourneyStep[]> = {
  Portugal: [
    { label: 'Confirm eligibility', meta: 'Done', state: 'done' },
    { label: 'Gather documents', meta: '5 of 13', state: 'current' },
    { label: 'Book consulate slot', meta: 'Sep 2026', state: 'todo' },
    { label: 'Attend appointment', meta: 'Not scheduled', state: 'todo' },
    { label: 'Enter Portugal', meta: 'Within 120 days', state: 'todo' },
    { label: 'AIMA permit', meta: 'Post-arrival', state: 'todo' },
  ],
}

export type LesserKnownRoute = {
  country: string
  name: string
  tag: string
  tone: 'good' | 'mid'
  body: string
  who: string
}

/** Routes that are commonly overlooked next to the headline visa for a country. */
export const LESSER_KNOWN_ROUTES: LesserKnownRoute[] = [
  {
    country: 'Portugal', name: 'Citizenship by descent', tag: 'Skips residency', tone: 'good',
    body: 'A Portuguese grandparent can mean citizenship directly, with no income test, no permit, and no five-year wait. Almost nobody checks before filing a visa.',
    who: 'For anyone with Portuguese ancestry',
  },
  {
    country: 'Portugal', name: 'D3 Tech Visa', tag: 'Employer fast-track', tone: 'good',
    body: 'Certified Portuguese tech companies can sponsor under a fast-tracked process that runs months quicker than the standard work route.',
    who: 'For engineers and technical hires',
  },
  {
    country: 'Portugal', name: 'Job-seeker visa', tag: '120 + 60 days', tone: 'mid',
    body: 'Enter legally to look for work, then convert on the spot when you find it. Rarely mentioned because it feels risky, but it is a real route.',
    who: 'For those willing to search on the ground',
  },
  {
    country: 'Portugal', name: 'D5 Research permit', tag: 'Overlooked', tone: 'mid',
    body: 'Attached to a research institution rather than an employer. Lower income scrutiny than the D-series and counts fully toward naturalization.',
    who: 'For academics and researchers',
  },
  {
    country: 'Ghana', name: 'Right of Abode', tag: 'No income test', tone: 'good',
    body: 'Indefinite residence for people of African descent, with no financial requirement at all. Structurally different from every other route on your list.',
    who: 'For the diaspora',
  },
  {
    country: 'Mexico', name: 'Family unity route', tag: 'Bypasses solvency', tone: 'mid',
    body: 'A Mexican citizen or permanent-resident relative removes the savings test entirely. Two degrees of relation are enough in some cases.',
    who: 'For those with Mexican family',
  },
  {
    country: 'EU-wide', name: 'EU family member route', tag: 'Fastest of all', tone: 'good',
    body: 'An EU spouse, parent, or child gives you free-movement rights that outrun every national visa. Worth checking before anything else.',
    who: 'For anyone married into the EU',
  },
  {
    country: 'Portugal', name: 'CPLP agreement', tag: 'Simplified filing', tone: 'mid',
    body: 'Nationals of Lusophone countries get a materially simpler process. Relevant if you hold a second passport from Brazil, Cabo Verde, Angola, or Mozambique.',
    who: 'For dual nationals',
  },
]

/** How a person earns, offered by the Match calculator. Mirrors the profile's income_type values. */
export const INCOME_TYPES = ['Employment', 'Freelance / self-employed', 'Pension', 'Investments', 'Mixed'] as const
