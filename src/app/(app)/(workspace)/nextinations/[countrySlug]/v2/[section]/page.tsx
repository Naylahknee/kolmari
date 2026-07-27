import { notFound } from 'next/navigation'
import { COUNTRIES, getDiscoverableCountry } from '@/lib/countries'
import { CountryResearchPage } from '@/components/nexit/CountryResearchPage'
import { CountryResearchShell } from '@/components/country-template/CountryResearchShell'
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
  if (!country) return { title: 'Nextination Not Found | Nexit' }
  const label = section.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return { title: `${country.name} \u2014 ${label} | Nexit` }
}

export default async function CountryV2Page({ params, searchParams }: Props) {
  const { countrySlug, section } = await params
  const country = COUNTRIES.find((c) => c.slug === countrySlug)
  const discoverableCountry = getDiscoverableCountry(countrySlug)
  if (!country && !discoverableCountry) notFound()
  if (discoverableCountry && countrySlug !== 'portugal')
    return (
      <CountryResearchShell>
        <CountryResearchPage country={discoverableCountry} />
      </CountryResearchShell>
    )

  const active = (TAB_SLUGS.includes(section as TabSlug) ? section : 'overview') as TabSlug
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
