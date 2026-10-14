// News & Guides feed content. Free for everyone.
//
// Rule, fee and threshold items MUST carry an official `source` and a `date`
// before they are published. Set `draft: true` to keep an item out of the feed.

export type NewsType = 'guide' | 'rules' | 'fees' | 'routes' | 'app' | 'events'

export type NewsItem = {
  id: string
  type: NewsType
  /** ISO date, used for sorting and display. */
  date: string
  title: string
  summary: string
  /** Full text shown in the pop-up. Guides open their own page instead. */
  body?: string
  /** Destination this item is about. Matched against the user's saved countries. */
  country?: string
  /** Primary action in the pop-up, or the guide page for guides. */
  cta?: { label: string; href: string }
  source?: { label: string; href: string }
  featured?: boolean
  draft?: boolean
}

export const NEWS_TYPE_LABEL: Record<NewsType, string> = {
  guide: 'Guide',
  rules: 'Visa & rules',
  fees: 'Fees & thresholds',
  routes: 'New routes',
  app: 'App update',
  events: 'Event',
}

export const NEWS_TYPE_STYLE: Record<NewsType, string> = {
  guide: 'bg-navy-deep text-gold',
  rules: 'bg-rose-100 text-rose-900',
  fees: 'bg-gold-soft text-navy',
  routes: 'bg-emerald-100 text-emerald-900',
  app: 'bg-sky-100 text-sky-900',
  events: 'bg-violet-100 text-violet-900',
}

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'guide-hidden-routes', type: 'guide', date: '2026-10-01', featured: true,
    title: '5 relocation routes most people never hear about',
    summary: 'None of these need a job offer or a large investment. Each one has a clear eligibility test you can check today.',
    cta: { label: 'Read the guide', href: '/news/hidden-routes' },
  },
  {
    id: 'app-passport-map', type: 'app', date: '2026-10-13',
    title: 'Passport Index now has a world map',
    summary: 'See entry requirements for your passport at a glance, and click a country for detail.',
    body: 'The Passport Index shows a world map colored by entry requirement. Click any country to see its rule, and use the new Region and Maximum stay filters.',
    cta: { label: 'Open Passport Index', href: '/passportindex' },
  },
  {
    id: 'app-compare-routes', type: 'app', date: '2026-10-12',
    title: 'Compare up to 3 lesser-known routes',
    summary: 'A new compare panel on Pathways puts routes side by side.',
    body: 'Add up to three lesser-known routes on Pathways and compare destination, type and who each route suits.',
    cta: { label: 'View on Pathways', href: '/pathways#pw-lesser' },
  },
  // Example shapes for editorial items. Fill in real details and a source, then remove `draft`.
  {
    id: 'example-rules', type: 'rules', date: '2026-10-09', country: 'Portugal', draft: true,
    title: 'Example: a visa rule change',
    summary: 'One sentence on what changed and who it affects.',
    body: 'Two or three sentences: what changed, from when, and what the reader should do.',
    cta: { label: 'Open Portugal in My Plan', href: '/my-plan' },
    source: { label: 'Official source', href: 'https://example.gov' },
  },
  {
    id: 'example-event', type: 'events', date: '2026-10-28', country: 'Portugal', draft: true,
    title: 'Example: Live Q&A',
    summary: 'Topic, length and format.',
    body: 'What the session covers and how to join.',
    cta: { label: 'Save my seat', href: '#' },
  },
]

export const publishedNews = () =>
  NEWS_ITEMS.filter((i) => !i.draft).sort((a, b) => b.date.localeCompare(a.date))

/* Read state lives on the device, like the visa status in Flutter Mode. */
export const NEWS_READ_KEY = 'kolmari:news-read'
export const NEWS_READ_EVENT = 'kolmari:news-read'

export function readNewsIds(): string[] {
  try {
    const raw = window.localStorage.getItem(NEWS_READ_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : []
  } catch {
    return []
  }
}

export function markNewsRead(ids: string[]) {
  try {
    const next = Array.from(new Set([...readNewsIds(), ...ids]))
    window.localStorage.setItem(NEWS_READ_KEY, JSON.stringify(next))
    window.dispatchEvent(new Event(NEWS_READ_EVENT))
  } catch { /* ignore */ }
}

export function unreadNewsCount(): number {
  const read = new Set(readNewsIds())
  return publishedNews().filter((i) => !read.has(i.id)).length
}

export function formatNewsDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
