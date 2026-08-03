import type { Metadata } from 'next'
import { YourWorld } from '@/components/kolmari/your-world'
import type { RecCard } from '@/components/kolmari/your-world'
import { YourWorldGated, type QuizMatch } from '@/components/kolmari/your-world-gated'
import type { WorldPin } from '@/components/kolmari/your-world-map'
import { requireCurrentUser } from '@/lib/auth'
import { COUNTRIES, DISCOVERABLE_COUNTRIES } from '@/lib/countries'
import { getCountryCenter } from '@/lib/country-geo'
import { getProfile, hasCompletedProfile, isPaid } from '@/lib/profile'
import { rankNextinations } from '@/lib/userProfile'

export const metadata: Metadata = {
  title: 'Your World | Kolmari',
  description: 'Your matched destinations plotted on the map, with a ranked shortlist built from your Kolmari Profile.',
}

// COUNTRIES uses 'Europe' | 'Americas'; the only Americas country is Mexico, so
// present it under the same 'Latin America' label the discoverable set uses.
const regionLabel = (region: 'Europe' | 'Americas') => (region === 'Europe' ? 'Europe' : 'Latin America')

export default async function YourWorldPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams
  const initialQuery = typeof params.q === 'string' ? params.q.slice(0, 100) : ''
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
  const complete = hasCompletedProfile(profile)
  const ranked = complete ? rankNextinations(profile) : []
  const paid = isPaid(profile)

  const pins: WorldPin[] = ranked.flatMap(({ country, match }) => {
    const center = getCountryCenter(country.slug)
    return center
      ? [{
          slug: country.slug,
          name: country.name,
          code: country.code,
          lat: center.lat,
          lng: center.lng,
          score: paid ? match.score : null,
        }]
      : []
  })

  // Free tier gets the browse-and-upsell view; scoring/filtering/saving are Pro.
  if (!paid) {
    const quizMatches: QuizMatch[] = ranked.map(({ country }) => ({
      slug: country.slug,
      name: country.name,
      code: country.code,
      region: regionLabel(country.region),
    }))
    return <YourWorldGated matches={quizMatches} pins={pins} />
  }

  // Matched (scored) cards, ranked by fit.
  const scoredCards: RecCard[] = ranked.map(({ country, match }) => ({
    slug: country.slug,
    name: country.name,
    code: country.code,
    city: country.city,
    region: regionLabel(country.region),
    cost: country.cost,
    route: country.visaType,
    score: match.score,
    incomeRequired: country.incomeRequired,
    blurb: match.reasons[0] ?? match.tradeoff,
    safety: country.safety === 'High' ? 'Very safe' : 'Safe',
    scored: true,
  }))

  // Everything else Kolmari covers, unscored — no fabricated Match Score.
  const scoredSlugs = new Set(COUNTRIES.map((c) => c.slug))
  const unscoredCards: RecCard[] = DISCOVERABLE_COUNTRIES.filter((c) => !scoredSlugs.has(c.slug)).map((c) => ({
    slug: c.slug,
    name: c.name,
    code: c.code,
    city: c.city,
    region: c.region,
    cost: null,
    route: null,
    score: null,
    incomeRequired: null,
    blurb: null,
    safety: null,
    scored: false,
  }))

  return <YourWorld key={initialQuery} pins={pins} cards={[...scoredCards, ...unscoredCards]} complete={complete} initialQuery={initialQuery} />
}
