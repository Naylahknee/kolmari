import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'
import { COUNTRIES } from '@/lib/countries'
import { calculateCountryMatch, calculateReadiness, rankNextinations } from '@/lib/userProfile'
import { evaluatePathways } from '@/lib/pathways'
import { ALL_TABS_ORDERED, buildTabContext, rankTabs } from '@/lib/country-workspace/tabs'
import { getCountryContent } from '@/lib/country-workspace/country-content'
import { CountryWorkspace } from '@/components/country-workspace/CountryWorkspace'

type PageProps = {
  params: Promise<{ countrySlug: string }>
  searchParams: Promise<{ source?: string | string[] }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { countrySlug } = await params
  const country = COUNTRIES.find((item) => item.slug === countrySlug)
  if (!country) return { title: 'Nextination Not Found | Nexit' }
  return { title: `${country.name} Nextination Workspace | Nexit`, description: `Your personalized ${country.name} relocation workspace — cost, Pathways, healthcare, Greenbook, and more.` }
}

export default async function CountryWorkspacePage({ params, searchParams }: PageProps) {
  const { countrySlug } = await params
  const country = COUNTRIES.find((item) => item.slug === countrySlug)
  if (!country) notFound()

  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
  const source = (await searchParams).source

  const tabContext = buildTabContext(profile)
  const match = calculateCountryMatch(profile, country)
  const readiness = calculateReadiness(profile)
  const tabs = rankTabs(tabContext, true)
  const pathways = evaluatePathways(profile).map((p) => ({
    id: p.id, name: p.name, country: p.country, category: p.category, status: p.status,
    requirementsMet: p.requirementsMet, missingRequirements: p.missingRequirements,
    incomeThreshold: p.incomeThreshold, officialSource: p.officialSource, sourceLabel: p.sourceLabel, lastVerified: p.lastVerified,
  }))

  const content = getCountryContent(country.slug)

  // Build compare data: all other countries with their match scores
  const ranked = rankNextinations(profile)
  const compareData = COUNTRIES
    .filter((c) => c.slug !== country.slug)
    .map((c) => {
      const ranked_entry = ranked.find((r) => r.country.slug === c.slug)
      return {
        country: { slug: c.slug, name: c.name, code: c.code, city: c.city, region: c.region, visaType: c.visaType, incomeRequired: c.incomeRequired, safety: c.safety, cost: c.cost, summary: c.summary },
        match: ranked_entry?.match ?? null,
      }
    })

  return (
    <CountryWorkspace
      country={{
        slug: country.slug, name: country.name, code: country.code, city: country.city, region: country.region,
        visaType: country.visaType, incomeRequired: country.incomeRequired, safety: country.safety, cost: country.cost, summary: country.summary,
      }}
      match={match}
      readiness={readiness}
      tabs={tabs}
      allTabs={ALL_TABS_ORDERED}
      pathways={pathways}
      content={content}
      compareData={compareData}
      hasChildren={tabContext.hasDependents || tabContext.familyHousehold}
      studyInterest={tabContext.studyInterest}
      isFamily={tabContext.familyHousehold}
      monthlyIncome={profile.monthly_income}
      fromQuiz={source === 'quiz'}
    />
  )
}
