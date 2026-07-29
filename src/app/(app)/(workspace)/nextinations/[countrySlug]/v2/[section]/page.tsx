import { notFound } from 'next/navigation'
import { COUNTRIES, getDiscoverableCountry } from '@/lib/countries'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'
import { getCountryCenter } from '@/lib/country-geo'
import { CountryResearchTemplate } from '@/components/country-template/CountryResearchTemplate'
import { CountryTemplate } from '@/components/country-template/CountryTemplate'
import { TAB_SLUGS, type TabSlug } from '@/components/country-template/TabBar'
import { OverviewTab } from '@/components/country-template/tabs/OverviewTab'
import { MoveThereTab } from '@/components/country-template/tabs/MoveThereTab'
import { CostHousingTab } from '@/components/country-template/tabs/CostHousingTab'
import { WorkStudyTab } from '@/components/country-template/tabs/WorkStudyTab'
import { HealthcareTab } from '@/components/country-template/tabs/HealthcareTab'
import { FamilySchoolsTab } from '@/components/country-template/tabs/FamilySchoolsTab'
import { LifestyleTab } from '@/components/country-template/tabs/LifestyleTab'
import { TaxMoneyTab } from '@/components/country-template/tabs/TaxMoneyTab'

type Props = {
  params: Promise<{ countrySlug: string; section: string }>
  searchParams: Promise<{ source?: string | string[] }>
}

export async function generateMetadata({ params }: Props) {
  const { countrySlug, section } = await params
  const country = COUNTRIES.find((c) => c.slug === countrySlug) ?? getDiscoverableCountry(countrySlug)
  if (!country) return { title: 'Destination Not Found | Kolmari' }
  const label = section.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return { title: `${country.name} \u2014 ${label} | Kolmari` }
}

export default async function CountryV2Page({ params, searchParams }: Props) {
  const { countrySlug, section } = await params
  const country = COUNTRIES.find((c) => c.slug === countrySlug)
  const discoverableCountry = getDiscoverableCountry(countrySlug)
  const record = country ?? discoverableCountry
  if (!record) notFound()

  const active = (TAB_SLUGS.includes(section as TabSlug) ? section : 'overview') as TabSlug

  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)

  // Portugal is the only country with a fully verified dataset, so it renders
  // the rich template. Every other country uses the SAME template frame but
  // with a real map, honest research content, and a free/paid gated expanded view.
  if (countrySlug !== 'portugal') {
    return (
      <CountryResearchTemplate
        country={record}
        active={active}
        center={getCountryCenter(countrySlug)}
        plan={profile.plan}
      />
    )
  }

  const source = (await searchParams).source
  const fromQuiz = source === 'quiz'

  const tab = {
    'overview': <OverviewTab slug={countrySlug} />,
    'move-there': <MoveThereTab />,
    'cost-housing': <CostHousingTab slug={countrySlug} />,
    'work-study': <WorkStudyTab slug={countrySlug} />,
    'healthcare': <HealthcareTab slug={countrySlug} />,
    'family-schools': <FamilySchoolsTab slug={countrySlug} />,
    'lifestyle-community': <LifestyleTab slug={countrySlug} />,
    'tax-money': <TaxMoneyTab slug={countrySlug} />,
  }[active]

  return (
    <CountryTemplate slug={countrySlug} active={active} fromQuiz={fromQuiz}>
      {tab}
    </CountryTemplate>
  )
}
