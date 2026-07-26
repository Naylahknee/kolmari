import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'
import { COUNTRIES } from '@/lib/countries'
import { calculateCountryMatch, rankNextinations } from '@/lib/userProfile'
import { evaluatePathways } from '@/lib/pathways'
import { ALL_TABS_ORDERED, buildTabContext, rankTabs, type CountryTabId } from '@/lib/country-workspace/tabs'
import { getCountryContent } from '@/lib/country-workspace/country-content'
import { CountryWorkspace } from '@/components/country-workspace/CountryWorkspace'
import { CountryOverviewEnhancements } from '@/components/country-workspace/CountryOverviewEnhancements'

type PageProps = {
  params: Promise<{ countrySlug: string; section: string }>
  searchParams: Promise<{ source?: string | string[] }>
}

const VALID_SECTIONS: CountryTabId[] = [
  'overview', 'why-you', 'economic-profile', 'cost-of-living', 'pathways',
  'housing', 'employment', 'healthcare', 'education', 'transportation',
  'legal-taxes', 'daily-life', 'family-pets', 'greenbook', 'resources', 'compare',
]

const PORTUGAL_TEMPLATE_SECTIONS: Partial<Record<CountryTabId, string>> = {
  overview: 'overview',
  pathways: 'move-there',
  'cost-of-living': 'cost-housing',
  housing: 'cost-housing',
  employment: 'work-study',
  healthcare: 'healthcare',
  education: 'family-schools',
  'family-pets': 'family-schools',
  'daily-life': 'lifestyle-community',
  greenbook: 'lifestyle-community',
  'legal-taxes': 'tax-money',
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { countrySlug, section } = await params
  const country = COUNTRIES.find((item) => item.slug === countrySlug)
  if (!country) return { title: 'Nextination Not Found | Nexit' }
  const sectionLabel = section.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    title: `${country.name} — ${sectionLabel} | Nexit`,
    description: `${country.name} ${sectionLabel} — your personalized relocation research workspace.`,
  }
}

export default async function CountryWorkspaceSectionPage({ params, searchParams }: PageProps) {
  const { countrySlug, section } = await params
  const country = COUNTRIES.find((item) => item.slug === countrySlug)
  if (!country) notFound()

  const sectionId = (VALID_SECTIONS.includes(section as CountryTabId) ? section : 'overview') as CountryTabId
  if (countrySlug === 'portugal') {
    const templateSection = PORTUGAL_TEMPLATE_SECTIONS[sectionId] ?? 'overview'
    const source = (await searchParams).source
    const query = source ? `?source=${source}` : ''
    redirect(`/nextinations/portugal/v2/${templateSection}${query}`)
  }

  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
  const source = (await searchParams).source

  const tabContext = buildTabContext(profile)
  const match = calculateCountryMatch(profile, country)
  const tabs = rankTabs(tabContext, true)
  const pathways = evaluatePathways(profile).map((p) => ({
    id: p.id, name: p.name, country: p.country, category: p.category, status: p.status,
    requirementsMet: p.requirementsMet, missingRequirements: p.missingRequirements,
    incomeThreshold: p.incomeThreshold, officialSource: p.officialSource, sourceLabel: p.sourceLabel, lastVerified: p.lastVerified,
  }))

  const content = getCountryContent(country.slug)

  const ranked = rankNextinations(profile)
  const compareData = COUNTRIES
    .filter((c) => c.slug !== country.slug)
    .map((c) => {
      const rankedEntry = ranked.find((r) => r.country.slug === c.slug)
      return {
        country: { slug: c.slug, name: c.name, code: c.code, city: c.city, region: c.region, visaType: c.visaType, incomeRequired: c.incomeRequired, safety: c.safety, cost: c.cost, summary: c.summary },
        match: rankedEntry?.match ?? null,
      }
    })

  const countryPathways = pathways.filter((p) => p.country.toLowerCase() === country.name.toLowerCase())
  const pathwayCount = countryPathways.length

  return (
    <>
      <CountryWorkspace
        country={{
          slug: country.slug, name: country.name, code: country.code, city: country.city, region: country.region,
          visaType: country.visaType, incomeRequired: country.incomeRequired, safety: country.safety, cost: country.cost, summary: country.summary,
        }}
        match={match}
        readiness={null}
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
        initialSection={sectionId}
        pathwayCount={pathwayCount}
      />

      {sectionId === 'overview' && (
        <CountryOverviewEnhancements
          countrySlug={country.slug}
          countryName={country.name}
          profile={profile}
        />
      )}
    </>
  )
}
