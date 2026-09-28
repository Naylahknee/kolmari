import { requireCurrentUser } from '@/lib/auth'
import { COUNTRIES, DISCOVERABLE_COUNTRIES, type CountryDetail } from '@/lib/countries'
import { getProfile, hasCompletedProfile, isPaid } from '@/lib/profile'
import { rankNextinations } from '@/lib/userProfile'
import { getGeneratedDashboardDestinationVersion } from '@/lib/country-assets'
import { DestinationsExplorer, type ExplorerCountry, type ExplorerRegion } from '@/components/kolmari/destinations-explorer'

function toRegion(country: Pick<CountryDetail, 'region'>): ExplorerRegion {
  return country.region === 'Americas' ? 'Latin America' : 'Europe'
}

function toExplorerResearched(country: CountryDetail): ExplorerCountry {
  return {
    slug: country.slug,
    name: country.name,
    code: country.code,
    city: country.city,
    region: toRegion(country),
    researched: true,
    visaType: country.visaType,
    incomeRequired: country.incomeRequired,
    safetyLabel: country.safety === 'High' ? 'Very safe' : 'Safe',
    cost: country.cost,
    summary: country.summary,
  }
}

export default async function DestinationsPage() {
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
  const paid = isPaid(profile)

  const countries: ExplorerCountry[] = []
  const seen = new Set<string>()
  for (const country of COUNTRIES) {
    countries.push(toExplorerResearched(country))
    seen.add(country.slug)
  }
  for (const country of DISCOVERABLE_COUNTRIES) {
    if (seen.has(country.slug)) continue
    seen.add(country.slug)
    countries.push({
      slug: country.slug,
      name: country.name,
      code: country.code,
      city: country.city,
      region: country.region,
      researched: false,
      visaType: null,
      incomeRequired: null,
      safetyLabel: null,
      cost: null,
      summary: null,
    })
  }

  const matchScores: Record<string, number> = {}
  if (paid && hasCompletedProfile(profile)) {
    for (const item of rankNextinations(profile)) {
      matchScores[item.country.slug] = item.match.score
    }
  }

  const imageSrcs: Record<string, string> = {}
  await Promise.all(
    COUNTRIES.map(async (country) => {
      const version = await getGeneratedDashboardDestinationVersion(country.slug)
      if (version) {
        imageSrcs[country.slug] = `/api/country-asset?slug=${country.slug}&type=dashboard_destination&v=${version}`
      }
    }),
  )

  const planLabel = profile.plan === 'plus' ? 'Plus' : profile.plan === 'navigator' ? 'Navigator' : 'Free plan'

  return (
    <DestinationsExplorer
      countries={countries}
      imageSrcs={imageSrcs}
      matchScores={matchScores}
      paid={paid}
      planLabel={planLabel}
    />
  )
}
