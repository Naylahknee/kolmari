import { notFound } from 'next/navigation'
import { COUNTRIES, getDiscoverableCountry } from '@/lib/countries'
import { getCountryFacts } from '@/lib/country-workspace/country-facts'
import { CountryResearchPage } from '@/components/nexit/CountryResearchPage'
import { CountryTemplate } from '@/components/country-template/CountryTemplate'
import { CountryHero } from '@/components/country-template/CountryHero'
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

export default async function CountryV2Page({ params }: Props) {
  const { countrySlug, section } = await params
  const country = COUNTRIES.find((c) => c.slug === countrySlug)
  const discoverableCountry = getDiscoverableCountry(countrySlug)
  if (!country && !discoverableCountry) notFound()
  // Countries with a full dataset render the tabbed CountryTemplate; discoverable-only
  // Nextinations (no full dataset yet) render the lightweight research page.
  if (!country && discoverableCountry) return <CountryResearchPage country={discoverableCountry} />
  if (!country) notFound()

  const active = (TAB_SLUGS.includes(section as TabSlug) ? section : 'overview') as TabSlug
  const facts = getCountryFacts(countrySlug)

  const tab = {
    'overview': <OverviewTab slug={countrySlug} />,
    'move-there': <MoveThereTab slug={countrySlug} />,
    'cost-housing': <CostHousingTab slug={countrySlug} />,
    'work-study': <WorkStudyTab slug={countrySlug} />,
    'healthcare': <HealthcareTab slug={countrySlug} />,
    'family-schools': <FamilySchoolsTab slug={countrySlug} />,
    'lifestyle-community': <LifestyleTab slug={countrySlug} />,
    'tax-money': <TaxMoneyTab slug={countrySlug} />,
  }[active]

  return (
    <CountryTemplate slug={countrySlug} active={active} hero={<CountryHero slug={countrySlug} country={country} facts={facts} />}>
      {tab}
    </CountryTemplate>
  )
}
