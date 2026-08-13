import { notFound } from 'next/navigation'
import { COUNTRIES, getDiscoverableCountry, type CountryDetail } from '@/lib/countries'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile, isPaid } from '@/lib/profile'
import { rankNextinations } from '@/lib/userProfile'
import { getCountryCenter } from '@/lib/country-geo'
import { getCountryData } from '@/lib/country-data'
import { getApprovedHero } from '@/lib/country-visuals/data'
import { getGeneratedHeroVersion } from '@/lib/country-assets'
import { PersonalizedCountrySummary } from '@/components/country-template/PersonalizedCountrySummary'
import { LockedTab } from '@/components/country-template/LockedTab'
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

const LOCKED_TITLE: Record<TabSlug, string> = {
  'overview': 'Your personalized overview',
  'move-there': 'Your route in, and what it will take',
  'cost-housing': 'What it will actually cost you',
  'work-study': 'Working and studying on your terms',
  'healthcare': 'Healthcare for your household',
  'family-schools': 'Schools and family logistics',
  'lifestyle-community': 'Daily life and where you would belong',
  'tax-money': 'Tax and money, against your numbers',
}

const TAB_SECTIONS: Record<TabSlug, string[]> = {
  'overview': [],
  'move-there': ['Ways In', 'Visa Pathways', 'Short-Stay and Long-Stay Options', 'Temporary Residency, Permanent Residency, and Citizenship', 'Entry and Immigration Requirements', 'Required Documents', 'Processing Times', 'Relocation Steps and Requirements', 'Lesser-known routes most people miss'],
  'cost-housing': ['Cost of Living', 'Housing Market', 'Renting vs Buying', 'Neighborhood Costs', 'Utilities and Internet', 'Upfront Move Costs'],
  'work-study': ['Work Rights', 'Remote Work and Employers of Record', 'Local Job Market', 'Starting a Business', 'Credential Recognition', 'Study Options'],
  'healthcare': ['Public Healthcare Access', 'Private Insurance', 'Costs and Coverage', 'Prescriptions and Pharmacies', 'Specialist and Emergency Care'],
  'family-schools': ['Schooling Options', 'International Schools', 'Enrolment and Documents', 'Childcare', 'Family Reunification'],
  'lifestyle-community': ['Daily Life', 'Community and Belonging', 'Language Reality', 'Climate and Seasons', 'Safety', 'Getting Around'],
  'tax-money': ['Tax Residency', 'Income Tax', 'Banking', 'Moving Money', 'Double Taxation', 'Social Security'],
}

function ResearchingTab({ name, label }: { name: string; label: string }) {
  return (
    <section className="card-surface p-8 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">{label}</p>
      <h2 className="mt-2 text-xl font-bold text-navy">{label} for {name} is being verified</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">We only publish figures for this section once they are confirmed from official sources. Portugal is fully verified today; more destinations are being added.</p>
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
  const paid = isPaid(profile)
  const center = getCountryCenter(countrySlug)
  const templateCountry = { slug: record.slug, name: record.name, code: record.code, city: record.city, region: record.region }

  // Every country, matched or not, now uses CountryTemplate. This guarantees the
  // same unlocked layout and the same blurred gated treatment across the entire
  // country catalogue instead of sending some free countries to SimpleCountryView.
  const freeRanked = !paid ? rankNextinations(profile) : []
  const source = (await searchParams).source
  const fromQuiz = source === 'quiz'
  const ranked = paid ? rankNextinations(profile) : freeRanked
  const rankIdx = ranked.findIndex((r) => r.country.slug === countrySlug)
  const rankedMatch = rankIdx >= 0 ? ranked[rankIdx].match : null
  const matchInfo = rankIdx >= 0 && rankedMatch
    ? { score: rankedMatch.score, rank: rankIdx + 1, total: ranked.length, reasons: rankedMatch.reasons, tradeoff: rankedMatch.tradeoff }
    : null

  const heroVersion = await getGeneratedHeroVersion(countrySlug)
  const heroArtwork = heroVersion
    ? { src: `/api/country-asset?slug=${countrySlug}&type=hero&v=${heroVersion}`, focalPoint: { x: 50, y: 50 } }
    : getApprovedHero(countrySlug)

  const cd = await getCountryData(countrySlug)
  const heroData = {
    primaryVisaRoute: cd.primary_visa_route,
    monthlyCostUsd: cd.monthly_cost_usd,
    timeToResidency: cd.time_to_residency,
    pathToCitizenship: cd.path_to_citizenship,
    sources: cd.sources,
  }

  const statusChips: Array<{ label: string; tone?: 'gold' | 'good' | 'muted' }> = []
  if (matchInfo) statusChips.push({ label: `Matched · #${matchInfo.rank} of ${matchInfo.total}`, tone: 'gold' })
  const routeLabel = cd.primary_visa_route ?? detail?.visaType
  if (routeLabel) statusChips.push({ label: `Route: ${routeLabel}`, tone: 'good' })
  statusChips.push(cd.last_verified ? { label: 'Data verified', tone: 'good' } : { label: 'Data being verified', tone: 'muted' })

  const overviewPrefix = active === 'overview' && paid && matchInfo && rankedMatch ? (
    <PersonalizedCountrySummary
      countrySlug={countrySlug}
      summary={`${record.name} is your #${matchInfo.rank} match of ${matchInfo.total}.`}
      explanation={rankedMatch.reasons.join(' ') || rankedMatch.tradeoff}
      reasons={rankedMatch.reasons}
      overallFit={matchInfo.score}
      blockingIssue={detail?.visaType ? { label: 'Route identified', detail: `Primary route: ${detail.visaType}` } : { label: 'Visa pathway', detail: 'No qualifying route confirmed for your profile yet' }}
      outcome={{ label: 'Naturalization', value: cd.path_to_citizenship ?? 'Being verified', detail: cd.path_to_citizenship ? undefined : 'Shown once confirmed from official sources' }}
      callouts={rankedMatch.tradeoff ? [{ title: 'Honest tradeoff', body: rankedMatch.tradeoff }] : []}
      rank={matchInfo.rank}
      totalRanked={matchInfo.total}
      categoryScores={[]}
      defaultOpen={matchInfo.rank === 1}
    />
  ) : null

  if (countrySlug === 'portugal') {
    const locked = <LockedTab countryName={record.name} tabLabel={TAB_LABEL[active]} title={LOCKED_TITLE[active]} sections={TAB_SECTIONS[active]} />
    const tab = !paid
      ? (active === 'overview' ? <OverviewTab slug={countrySlug} freeTier /> : locked)
      : {
        'overview': <>{overviewPrefix}<OverviewTab slug={countrySlug} /></>,
        'move-there': <MoveThereTab />,
        'cost-housing': <CostHousingTab slug={countrySlug} />,
        'work-study': <WorkStudyTab slug={countrySlug} />,
        'healthcare': <HealthcareTab slug={countrySlug} />,
        'family-schools': <FamilySchoolsTab slug={countrySlug} />,
        'lifestyle-community': <LifestyleTab slug={countrySlug} />,
        'tax-money': <TaxMoneyTab slug={countrySlug} />,
      }[active]

    return <CountryTemplate slug={countrySlug} active={active} fromQuiz={fromQuiz} country={templateCountry} center={center} match={matchInfo} data={heroData} heroArtwork={heroArtwork} statusChips={statusChips} paid={paid} rich>{tab}</CountryTemplate>
  }

  const body = !paid && active !== 'overview'
    ? <LockedTab countryName={record.name} tabLabel={TAB_LABEL[active]} title={LOCKED_TITLE[active]} sections={TAB_SECTIONS[active]} />
    : active === 'overview'
      ? <>{overviewPrefix}<DataOverviewTab country={templateCountry} visaType={detail?.visaType} incomeRequired={detail?.incomeRequired} summary={detail?.summary} /></>
      : <ResearchingTab name={record.name} label={TAB_LABEL[active]} />

  return (
    <CountryTemplate slug={countrySlug} active={active} fromQuiz={fromQuiz} country={templateCountry} center={center} visaType={detail?.visaType} match={matchInfo} data={heroData} heroArtwork={heroArtwork} statusChips={statusChips} paid={paid}>
      {body}
    </CountryTemplate>
  )
}
