import type { RegionSlug } from './regionData'

export type GreenbookEntry = {
  id: string
  regionSlug: RegionSlug
  location: string
  context: string
  note: string
  tags: string[]
  sourceLabel: 'Kolmari editorial planning prompt'
  verifiedMemberStory: false
}

export type PublishedGreenbookInsight = {
  countrySlug: 'portugal' | 'spain' | 'thailand' | 'mexico'
  communityFit: string
  bestAreas: string[]
  watchAreas: string[]
  summary: string
  /**
   * Black-traveler / Black-expat lens. Portugal is the hand-curated reference;
   * where this is absent the UI shows an honest "being verified" state rather
   * than borrowing another country's context.
   */
  blackTravelerNote?: string
  sourceTitle: string
  sourceUrl: string
  lastReviewed: string
}

// These prompts are product guidance, not member testimonials.
export const GREENBOOK_ENTRIES: GreenbookEntry[] = [
  {
    id: 'lisbon-first-month', regionSlug: 'europe', location: 'Lisbon, Portugal',
    context: 'First-month planning prompt',
    note: 'Choose a neighborhood around the errands you repeat, not only the view. Compare groceries, transit, healthcare, and workday noise before signing a longer lease.',
    tags: ['Neighborhoods', 'Daily life'], sourceLabel: 'Kolmari editorial planning prompt', verifiedMemberStory: false,
  },
  {
    id: 'valencia-paperwork', regionSlug: 'europe', location: 'Valencia, Spain',
    context: 'Paperwork planning prompt',
    note: 'Keep printed and encrypted cloud copies of appointment confirmations. Organize documents in the order requested by the responsible consulate.',
    tags: ['Documents', 'Arrival'], sourceLabel: 'Kolmari editorial planning prompt', verifiedMemberStory: false,
  },
  {
    id: 'merida-seasons', regionSlug: 'americas', location: 'Merida, Mexico',
    context: 'Climate planning prompt',
    note: 'Complete a scouting stay during the hottest or wettest season before committing. Climate can materially change housing and transport needs.',
    tags: ['Climate', 'Housing'], sourceLabel: 'Kolmari editorial planning prompt', verifiedMemberStory: false,
  },
  {
    id: 'medellin-budget', regionSlug: 'americas', location: 'Medellin, Colombia',
    context: 'Budget planning prompt',
    note: 'Short-term furnished rent can distort a long-term budget. Keep a higher arrival-month estimate and compare longer leases after learning neighborhoods in person.',
    tags: ['Budget', 'Housing'], sourceLabel: 'Kolmari editorial planning prompt', verifiedMemberStory: false,
  },
  {
    id: 'kl-connectivity', regionSlug: 'asia-pacific', location: 'Kuala Lumpur, Malaysia',
    context: 'Workday planning prompt',
    note: 'Verify call quality from the specific building before signing. Building-level connectivity can differ even when listings advertise similar speeds.',
    tags: ['Remote work', 'Housing'], sourceLabel: 'Kolmari editorial planning prompt', verifiedMemberStory: false,
  },
  {
    id: 'chiang-mai-air', regionSlug: 'asia-pacific', location: 'Chiang Mai, Thailand',
    context: 'Seasonal planning prompt',
    note: 'Research seasonal air quality before choosing dates or a neighborhood, and include alternate locations or indoor air measures in the Move Plan.',
    tags: ['Climate', 'Health'], sourceLabel: 'Kolmari editorial planning prompt', verifiedMemberStory: false,
  },
  {
    id: 'accra-community', regionSlug: 'africa-middle-east', location: 'Accra, Ghana',
    context: 'Community planning prompt',
    note: 'Contact local professional and community groups before moving. Specific introductions can improve housing research and the first weeks after arrival.',
    tags: ['Community', 'Work'], sourceLabel: 'Kolmari editorial planning prompt', verifiedMemberStory: false,
  },
  {
    id: 'mauritius-car', regionSlug: 'africa-middle-east', location: 'Grand Baie, Mauritius',
    context: 'Transport planning prompt',
    note: 'Test the time to groceries, healthcare, and workspaces at normal commuting hours before choosing a lease.',
    tags: ['Transport', 'Daily life'], sourceLabel: 'Kolmari editorial planning prompt', verifiedMemberStory: false,
  },
]

export const PUBLISHED_GREENBOOK_INSIGHTS: PublishedGreenbookInsight[] = [
  {
    countrySlug: 'portugal', communityFit: 'Strong starting signal',
    bestAreas: ['Lisbon', 'Porto'], watchAreas: ['Central-city housing pressure', 'Petty theft in crowded areas'],
    summary: 'Portugal can offer a practical base for remote professionals, but Community Fit still depends on neighborhood, housing access, and the communities a person builds. General safety guidance does not measure the experience of Black Americans, so Kolmari recommends community-specific research and a scouting stay.',
    blackTravelerNote: 'Lisbon and Porto have visible, growing African-diaspora and Black-American communities, and Portugal has large Portuguese-speaking African populations — but day-to-day belonging still varies by neighborhood and workplace. Before committing: connect with Black-led expat networks in your target city ahead of arrival, confirm hair-care and specialist-care access where you plan to live, and treat a scouting stay as research rather than a vacation. Advisories measure safety, not racialized belonging — validate that through the community, not a national label.',
    sourceTitle: 'U.S. Department of State — Portugal Travel Advisory',
    sourceUrl: 'https://travel.state.gov/en/international-travel/travel-advisories/portugal.html',
    lastReviewed: '2026-07-21',
  },
  {
    countrySlug: 'spain', communityFit: 'Strong city variety',
    bestAreas: ['Madrid', 'Valencia', 'Barcelona'], watchAreas: ['Housing competition', 'Regional language and paperwork differences'],
    summary: 'Large cities provide several ways to build professional and social community. Official advisories cover general safety rather than racialized experience, so Community Fit should be validated through local Black-led groups, housing research, and time in the specific city.',
    sourceTitle: 'U.S. Department of State — Spain Travel Advisory',
    sourceUrl: 'https://travel.state.gov/en/international-travel/travel-advisories/spain.html',
    lastReviewed: '2026-07-21',
  },
  {
    countrySlug: 'thailand', communityFit: 'Research by neighborhood',
    bestAreas: ['Bangkok', 'Chiang Mai', 'Phuket'], watchAreas: ['Northern smoke season', 'Areas named in current border advisories'],
    summary: 'Thailand has established international hubs, but day-to-day belonging varies by city and neighborhood. General advisories do not describe the experience of Black Americans; validate healthcare, hair care, housing, and community access before choosing a long-term base.',
    sourceTitle: 'U.S. Department of State — Thailand Travel Advisory',
    sourceUrl: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/thailand-travel-advisory.html',
    lastReviewed: '2026-07-21',
  },
  {
    countrySlug: 'mexico', communityFit: 'Highly location-specific',
    bestAreas: ['Mexico City', 'Merida', 'Queretaro'], watchAreas: ['State-by-state security differences', 'Short-term housing inflation'],
    summary: 'Mexico offers many distinct city contexts, so a national label is not enough. Review the advisory for the exact state and validate Community Fit through local networks, housing research, and an in-person scouting period.',
    sourceTitle: 'U.S. Department of State — Mexico Travel Advisory',
    sourceUrl: 'https://travel.state.gov/en/international-travel/travel-advisories/mexico.html',
    lastReviewed: '2026-07-21',
  },
]

export function getGreenbookEntries(regionSlug?: RegionSlug) {
  const entries = regionSlug ? GREENBOOK_ENTRIES.filter((entry) => entry.regionSlug === regionSlug) : GREENBOOK_ENTRIES
  return entries.slice(0, 4)
}

export function getPublishedGreenbookInsight(countrySlug: string) {
  return PUBLISHED_GREENBOOK_INSIGHTS.find((insight) => insight.countrySlug === countrySlug)
}
