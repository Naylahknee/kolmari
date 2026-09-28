import type { RegionSlug } from './regionData'
import { COUNTRIES, DISCOVERABLE_COUNTRIES } from './countries'

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

/* ------------------------------------------------------------------ */
/* Watch + reviews: country-driven research content                    */
/*                                                                     */
/* Videos and reviews are hand-curated from real, public sources and    */
/* labeled as such. Every entry links out to its source. Nothing here   */
/* is a member testimonial and nothing is scraped. Coverage grows by    */
/* adding entries per country slug.                                     */
/* ------------------------------------------------------------------ */

export type GreenbookCountryMeta = { slug: string; name: string; code: string }

/** Countries with curated video/review coverage. */
export const GREENBOOK_COUNTRIES: GreenbookCountryMeta[] = [
  { slug: 'portugal', name: 'Portugal', code: 'PT' },
  { slug: 'spain', name: 'Spain', code: 'ES' },
  { slug: 'mexico', name: 'Mexico', code: 'MX' },
  { slug: 'thailand', name: 'Thailand', code: 'TH' },
  { slug: 'ghana', name: 'Ghana', code: 'GH' },
]

/** Resolve a stored destination name (e.g. "Portugal") to a country slug, or null when unknown. */
export function resolveCountrySlug(name: string): string | null {
  const needle = name.trim().toLowerCase()
  if (!needle) return null
  const known: { slug: string; name: string }[] = [...GREENBOOK_COUNTRIES, ...COUNTRIES, ...DISCOVERABLE_COUNTRIES]
  const hit = known.find((c) => c.slug === needle || c.name.toLowerCase() === needle)
  return hit ? hit.slug : null
}

/** Meta for any destination slug; falls back to a title-cased name when the country has no curated coverage yet. */
export function greenbookCountryMeta(slug: string): GreenbookCountryMeta {
  const known = GREENBOOK_COUNTRIES.find((c) => c.slug === slug)
  if (known) return known
  const name = slug.split('-').map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w)).join(' ')
  return { slug, name, code: '' }
}

export type VideoLens = 'black-traveler' | 'women' | 'general'

export type GreenbookVideo = {
  id: string
  title: string
  /** Null when the uploader could not be verified; the card then omits the channel line. */
  channel: string | null
  countrySlug: string
  lens: VideoLens
  sourceUrl: string
}

export const GREENBOOK_VIDEOS: GreenbookVideo[] = [
  // Portugal
  { id: 'bTwEbStoAQE', title: 'Is Portugal Safe for Black Americans? What We Found', channel: 'The Okoties', countrySlug: 'portugal', lens: 'black-traveler', sourceUrl: 'https://www.youtube.com/watch?v=bTwEbStoAQE' },
  { id: 'mINGugjGJGI', title: 'For The Black Woman Planning Her Move Abroad Alone. Watch This.', channel: 'Kayosha Morton', countrySlug: 'portugal', lens: 'women', sourceUrl: 'https://www.youtube.com/watch?v=mINGugjGJGI' },
  { id: 'LXzGTslLVBM', title: 'Mexico vs Portugal: Which Is Best For Blaxigrants In 2026?', channel: 'Melanated in Mexico', countrySlug: 'portugal', lens: 'black-traveler', sourceUrl: 'https://www.youtube.com/watch?v=LXzGTslLVBM' },
  // Spain
  { id: 'cijaieC1oIU', title: 'Living in Spain Without Speaking Spanish | My Biggest Regrets', channel: null, countrySlug: 'spain', lens: 'women', sourceUrl: 'https://www.youtube.com/watch?v=cijaieC1oIU' },
  { id: 'WITjCtrpQac', title: "Why I Left Torrevieja for Santa Pola: An American Retiree's Honest Spain Experience", channel: 'SpainGuru', countrySlug: 'spain', lens: 'women', sourceUrl: 'https://www.youtube.com/watch?v=WITjCtrpQac' },
  { id: 'HuAJCXTTHrM', title: 'Living while Black in Spain', channel: 'Original Beach Bums', countrySlug: 'spain', lens: 'black-traveler', sourceUrl: 'https://www.youtube.com/watch?v=HuAJCXTTHrM' },
  // Mexico
  { id: 'iAacrUgVJ6E', title: '1 Year in Mexico as Black Americans: What We Wish We Knew Before Moving', channel: 'Melanated In Mexico', countrySlug: 'mexico', lens: 'black-traveler', sourceUrl: 'https://www.youtube.com/watch?v=iAacrUgVJ6E' },
  { id: 'L1BLFYZxzHI', title: 'Living In Playa Del Carmen: My 6-Month Experience as a Black Expat', channel: 'Picky Girl Travels The World', countrySlug: 'mexico', lens: 'women', sourceUrl: 'https://www.youtube.com/watch?v=L1BLFYZxzHI' },
  { id: 'cdVtbSAOXgQ', title: 'Living in Puerto Vallarta | Black American Expats Move to Mexico', channel: 'MOOD Travel Abroad', countrySlug: 'mexico', lens: 'black-traveler', sourceUrl: 'https://www.youtube.com/watch?v=cdVtbSAOXgQ' },
  // Thailand
  { id: 'rfIbcWr9Of4', title: 'I Left Atlanta for Bangkok, Thailand: Now My Entire Life Costs Less Than My Rent in America', channel: 'Webnation Africa', countrySlug: 'thailand', lens: 'black-traveler', sourceUrl: 'https://www.youtube.com/watch?v=rfIbcWr9Of4' },
  { id: 'oshZ8vzGzqw', title: 'Rwanda to Bangkok: How I Find Community as a Black American Woman', channel: "L'Erin Alta", countrySlug: 'thailand', lens: 'women', sourceUrl: 'https://www.youtube.com/watch?v=oshZ8vzGzqw' },
  { id: 'Z4sMj26oGfw', title: "We're Moving Abroad From America to Chiang Mai Thailand!", channel: null, countrySlug: 'thailand', lens: 'general', sourceUrl: 'https://www.youtube.com/watch?v=Z4sMj26oGfw' },
  // Ghana
  { id: 'g6yYiNwWl7g', title: 'Black American Woman Moved From Houston To Ghana | Nana\u2019s Story', channel: 'Authentic African', countrySlug: 'ghana', lens: 'women', sourceUrl: 'https://www.youtube.com/watch?v=g6yYiNwWl7g' },
  { id: 'cBQga7e_9Hs', title: 'I Moved From the USA to Ghana, I Gave Up My Career, Left America, and Found Myself in Ghana', channel: 'Webnation', countrySlug: 'ghana', lens: 'women', sourceUrl: 'https://www.youtube.com/watch?v=cBQga7e_9Hs' },
  { id: '_6gXHMTXZMM', title: 'We Left America for Ghana: Was It Worth It?', channel: 'Expat Life Ghana', countrySlug: 'ghana', lens: 'black-traveler', sourceUrl: 'https://www.youtube.com/watch?v=_6gXHMTXZMM' },
]

export function getGreenbookVideos(countrySlug: string) {
  return GREENBOOK_VIDEOS.filter((video) => video.countrySlug === countrySlug)
}

export type ReviewLens = 'women' | 'black-traveler'

export type GreenbookReview = {
  id: string
  countrySlug: string
  lens: ReviewLens
  place: string
  /** Editorial summary of what the linked source covers, not a member quote. */
  summary: string
  sourceTitle: string
  sourceUrl: string
  lastReviewed: string
}

export const GREENBOOK_REVIEWS: GreenbookReview[] = [
  {
    id: 'rev-portugal-travel-noire-petrina', countrySlug: 'portugal', lens: 'black-traveler', place: 'Portugal',
    summary: 'Interview with Black expat creator Petrina on expectations vs. reality in Portugal: racism nuances, what surprised her, and what Black women should prepare for before moving.',
    sourceTitle: 'Travel Noire — The Black Expat: This Is My Experience Of Racism In Portugal',
    sourceUrl: 'https://travelnoire.com/the-black-expat-this-is-my-experience-of-racism-in-portugal',
    lastReviewed: '2026-09-28',
  },
  {
    id: 'rev-portugal-black-in-portugal', countrySlug: 'portugal', lens: 'black-traveler', place: 'Portugal',
    summary: 'Profiles the Black In Portugal community run by four Black women: visa and schooling guidance, honest talk about daily treatment, and how newcomers plug into community before and after arrival.',
    sourceTitle: 'Travel Noire — Black In Portugal Is Creating Community for Expats',
    sourceUrl: 'https://archive.blkalerts.com/2023/04/01/black-in-portugal-is-creating-community-for-expats-meet-the-black-women-behind-it-travel-noire/',
    lastReviewed: '2026-09-28',
  },
  {
    id: 'rev-spain-melanin-madrid', countrySlug: 'spain', lens: 'women', place: 'Madrid',
    summary: 'Community guide for Black women relocating to Madrid: why they move (freedom, wellness, cost of living), welcoming neighborhoods like Lavapiés and Malasaña, and diaspora support networks.',
    sourceTitle: 'Melanin Madrid — Why Black Women Are Moving to Madrid',
    sourceUrl: 'https://melaninmadrid.com/black-women-madrid/',
    lastReviewed: '2026-09-28',
  },
  {
    id: 'rev-spain-sojournies', countrySlug: 'spain', lens: 'black-traveler', place: 'Granada & Logroño',
    summary: 'First-person Black traveler advice from living in Granada and Logroño: cultural friction points, classroom experiences, and practical awareness tips for daily life in Spain.',
    sourceTitle: 'Sojournies — Black in Spain: Advice for Black American Travelers',
    sourceUrl: 'https://sojournies.com/black-in-spain/',
    lastReviewed: '2026-09-28',
  },
  {
    id: 'rev-mexico-bet-cdmx', countrySlug: 'mexico', lens: 'women', place: 'Mexico City',
    summary: 'Black American women on choosing Mexico City: safety, affordability, and belonging over U.S. burnout, with firsthand quotes on feeling less watched and policed in daily life.',
    sourceTitle: 'BET — From Burnout to Soft Life in CDMX',
    sourceUrl: 'https://www.bet.com/article/0uvxwt/from-burnout-to-soft-life-in-cdmx-mexico-city-draws-black-american-women',
    lastReviewed: '2026-09-28',
  },
  {
    id: 'rev-mexico-ebony-expats', countrySlug: 'mexico', lens: 'black-traveler', place: 'Playa del Carmen & beyond',
    summary: 'Profiles of Black expats across Mexico on healing, rest, and community building — and why they left the U.S. seeking liberation over luxury.',
    sourceTitle: 'Ebony — Why More Black Americans Are Choosing Mexico as Their New Home',
    sourceUrl: 'https://www.ebony.com/black-expats-mexico-the-ones-who-left/',
    lastReviewed: '2026-09-28',
  },
  {
    id: 'rev-thailand-bk-adventures', countrySlug: 'thailand', lens: 'black-traveler', place: 'Bangkok',
    summary: 'Interview with the organizers of Adventures While Black, Thailand\u2019s largest Black travel and expat community, on building and maintaining community for Black travelers and expats in Bangkok.',
    sourceTitle: 'BK Magazine — Melanin is the vibe: Adventures While Black in Bangkok',
    sourceUrl: 'https://www.bkmagazine.com/city-living/news/melanin-vibe-adventures-while-black-organizers-creating-and-maintaining-community/',
    lastReviewed: '2026-09-28',
  },
  {
    id: 'rev-thailand-realgirl-safety', countrySlug: 'thailand', lens: 'women', place: 'Thailand',
    summary: 'Women\u2019s-lens safety guide for Thailand: ride-hailing and street safety, bag-snatch theft, common scams, passport and rental cautions, and female-specific transport tips.',
    sourceTitle: 'Real Girl Review — Is Thailand Safe For Solo Female Travelers?',
    sourceUrl: 'https://www.realgirlreview.com/is-thailand-safe-for-solo-female-travelers/',
    lastReviewed: '2026-09-28',
  },
  {
    id: 'rev-ghana-face2face', countrySlug: 'ghana', lens: 'women', place: 'Ghana',
    summary: 'Interview with an African-American woman entrepreneur who relocated to Ghana: escaping U.S. systemic racism and gender bias, being valued for her craft, and business opportunities after the Year of Return.',
    sourceTitle: 'Face2Face Africa — Why this African-American woman relocated to Ghana',
    sourceUrl: 'https://face2faceafrica.com/article/we-just-saw-so-much-opportunities-why-this-african-american-woman-relocated-to-ghana',
    lastReviewed: '2026-09-28',
  },
  {
    id: 'rev-ghana-moguldom', countrySlug: 'ghana', lens: 'black-traveler', place: 'Ghana',
    summary: 'Balanced look at the roughly 1,500 Black Americans who have relocated to Ghana since the Year of Return: the pull of racial refuge and cultural reconnection alongside soaring property prices, land disputes, and local tensions.',
    sourceTitle: 'Moguldom — Black Americans Moving to Ghana: Economic Impact',
    sourceUrl: 'https://moguldom.com/462729/coming-home-to-ghana-black-american-migration-sparks-economic-strain/',
    lastReviewed: '2026-09-28',
  },
]

export function getGreenbookReviews(countrySlug: string) {
  return GREENBOOK_REVIEWS.filter((review) => review.countrySlug === countrySlug)
}

export type GreenbookThread = {
  id: string
  countrySlug: string
  author: string
  authorUrl: string
  summary: string
  sourceUrl: string
  postedAt: string
  engagement: string
}

/** Verified public Threads discussions connected to a destination. Grows as threads are verified; never fabricated. */
export const GREENBOOK_THREADS: GreenbookThread[] = [
  {
    id: 'thread-delyanne-portugal-costs',
    countrySlug: 'portugal',
    author: '@delyannethemoneycoach',
    authorUrl: 'https://www.threads.com/@delyannethemoneycoach',
    summary: 'An investing coach shares her mother\u2019s real monthly costs after moving to Oeiras, Portugal — rent, utilities, groceries, and health insurance totaling $2,875 — sparking 320+ comments on D7 visas, rent prices, and Black expat experiences.',
    sourceUrl: 'https://www.threads.com/@delyannethemoneycoach/post/DMKpvvRxHdA',
    postedAt: '2025-07-16',
    engagement: '3.6K likes · 320 comments',
  },
]

export function getGreenbookThreads(countrySlug: string) {
  return GREENBOOK_THREADS.filter((thread) => thread.countrySlug === countrySlug)
}

/** Green Book Global: the first Black traveler review website and mobile app (verified via public reporting). */
export const GREENBOOK_GLOBAL_URL = 'https://join.greenbookglobal.com/exclusive_free_trial_modern_day_green_book_copy2_copy2_copy'
