import { notFound } from 'next/navigation'
import { COUNTRIES, getDiscoverableCountry, type CountryDetail } from '@/lib/countries'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile, isPaid } from '@/lib/profile'
import { rankNextinations } from '@/lib/userProfile'
import { getCountryCenter } from '@/lib/country-geo'
import { getCountryData } from '@/lib/country-data'
import { SimpleCountryView } from '@/components/country-template/SimpleCountryView'
import { CountryTemplate } from '@/components/country-template/CountryTemplate'
import { TAB_SLUGS, type TabSlug } from '@/components/country-template/TabBar'
import { OverviewTab } from '@/components/country-template/tabs/OverviewTab'
import { DataOverviewTab } from '@/components/country-template/tabs/DataOverviewTab'
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

const TAB_LABEL: Record<TabSlug, string> = {
  'overview': 'Overview',
  'move-there': 'Move There',
  'cost-housing': 'Cost & Housing',
  'work-study': 'Work & Study',
  'healthcare': 'Healthcare',
  'family-schools': 'Family & Schools',
  'lifestyle-community': 'Lifestyle & Community',
  'tax-money': 'Tax & Money',
}

export async function generateMetadata({ params }: Props) {
  const { countrySlug, section } = await params
  const country = COUNTRIES.find((c) => c.slug === countrySlug) ?? getDiscoverableCountry(countrySlug)
  if (!country) return { title: 'Destination Not Found | Kolmari' }
  const label = section.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return { title: `${country.name} — ${label} | Kolmari` }
}

/** Honest "being verified" panel shown for deeper tabs of countries whose
 *  detailed dataset is not yet bound (everything except Portugal). Keeps the
 *  rich frame without borrowing another country's figures. */
function ResearchingTab({ name, label }: { name: string; label: string }) {
  return (
    <section className="card-surface p-8 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">{label}</p>
      <h2 className="mt-2 text-xl font-bold text-navy">{label} for {name} is being verified</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
        We only publish figures for this section once they are confirmed from official sources. Portugal is
        fully verified today; more destinations are being added.
      </p>
    </section>
  )
}

export default async function CountryV2Page({ params, searchParams }: Props) {
  const { countrySlug, section } = await params
  const detail: CountryDetail | undefined = COUNTRIES.find((c) => c.slug === countrySlug)
  const discoverableCountry = getDiscoverableCountry(countrySlug)
  const record = detail ?? discoverableCountry
  if (!record) notFound()

  const active = (TAB_SLUGS.includes(section as TabSlug) ? section : 'overview') as TabSlug

  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)

  const center = getCountryCenter(countrySlug)
  const templateCountry = {
    slug: record.slug,
    name: record.name,
    code: record.code,
    city: record.city,
    region: record.region,
  }

  // FREE plan: the simple, non-expanded view for any country — info, short
  // summary, basic visa info, and a small real map.
  if (!isPaid(profile)) {
    return (
      <SimpleCountryView
        country={templateCountry}
        center={center}
        visaType={detail?.visaType}
        incomeRequired={detail?.incomeRequired}
        summary={detail?.summary}
      />
    )
  }

  // PAID plan: the rich, Portugal-style page for any country.
  const source = (await searchParams).source
  const fromQuiz = source === 'quiz'

  // Real Match Score from the user's profile ranking (null when unscored /
  // profile incomplete) — the right rail renders this instead of a placeholder.
  const ranked = rankNextinations(profile)
  const rankIdx = ranked.findIndex((r) => r.country.slug === countrySlug)
  const matchInfo = rankIdx >= 0
    ? { score: ranked[rankIdx].match.score, rank: rankIdx + 1, total: ranked.length, reasons: ranked[rankIdx].match.reasons }
    : null

  // Verified relocation figures for the hero panels (honest empties when unset).
  const cd = await getCountryData(countrySlug)
  const heroData = {
    primaryVisaRoute: cd.primary_visa_route,
    monthlyCostUsd: cd.monthly_cost_usd,
    timeToResidency: cd.time_to_residency,
    pathToCitizenship: cd.path_to_citizenship,
    sources: cd.sources,
  }

  // Portugal is the only fully verified dataset — it renders the approved rich
  // tabs. Every other country renders the same rich frame with honest,
  // data-driven content.
  if (countrySlug === 'portugal') {
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
      <CountryTemplate slug={countrySlug} active={active} fromQuiz={fromQuiz} country={templateCountry} center={center} match={matchInfo} data={heroData} rich>
        {tab}
      </CountryTemplate>
    )
  }

  const body = active === 'overview'
    ? (
      <DataOverviewTab
        country={templateCountry}
        visaType={detail?.visaType}
        incomeRequired={detail?.incomeRequired}
        summary={detail?.summary}
      />
    )
    : <ResearchingTab name={record.name} label={TAB_LABEL[active]} />

  return (
    <CountryTemplate
      slug={countrySlug}
      active={active}
      fromQuiz={fromQuiz}
      country={templateCountry}
      center={center}
      visaType={detail?.visaType}
      match={matchInfo}
      data={heroData}
    >
      {body}
    </CountryTemplate>
  )
}
