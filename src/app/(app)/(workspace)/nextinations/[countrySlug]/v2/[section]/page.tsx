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
import { SimpleCountryView } from '@/components/country-template/SimpleCountryView'
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

/**
 * What each tab actually contains. Shown (titles only) on the locked card so a
 * free account can see what Kolmari Pro adds without the research itself.
 */
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
  'move-there': [
    'Ways In', 'Visa Pathways', 'Short-Stay and Long-Stay Options',
    'Temporary Residency, Permanent Residency, and Citizenship', 'Entry and Immigration Requirements',
    'Required Documents', 'Processing Times', 'Relocation Steps and Requirements',
    'Lesser-known routes most people miss',
  ],
  'cost-housing': [
    'Cost of Living', 'Housing Market', 'Renting vs Buying', 'Neighborhood Costs',
    'Utilities and Internet', 'Upfront Move Costs',
  ],
  'work-study': [
    'Work Rights', 'Remote Work and Employers of Record', 'Local Job Market',
    'Starting a Business', 'Credential Recognition', 'Study Options',
  ],
  'healthcare': [
    'Public Healthcare Access', 'Private Insurance', 'Costs and Coverage',
    'Prescriptions and Pharmacies', 'Specialist and Emergency Care',
  ],
  'family-schools': [
    'Schooling Options', 'International Schools', 'Enrolment and Documents',
    'Childcare', 'Family Reunification',
  ],
  'lifestyle-community': [
    'Daily Life', 'Community and Belonging', 'Language Reality',
    'Climate and Seasons', 'Safety', 'Getting Around',
  ],
  'tax-money': [
    'Tax Residency', 'Income Tax', 'Banking', 'Moving Money',
    'Double Taxation', 'Social Security',
  ],
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

  const paid = isPaid(profile)

  // FREE plan, country NOT matched to this user: the simple, non-expanded view.
  // A matched destination keeps the full frame below so the user can see what
  // their match actually bought them.
  const freeRanked = !paid ? rankNextinations(profile) : []
  const freeMatchIdx = freeRanked.findIndex((r) => r.country.slug === countrySlug)
  if (!paid && freeMatchIdx < 0) {
    return (
      <SimpleCountryView
        country={templateCountry}
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
  const ranked = paid ? rankNextinations(profile) : freeRanked
  const rankIdx = paid ? ranked.findIndex((r) => r.country.slug === countrySlug) : freeMatchIdx
  const rankedMatch = rankIdx >= 0 ? ranked[rankIdx].match : null
  const matchInfo = rankIdx >= 0
    ? { score: rankedMatch!.score, rank: rankIdx + 1, total: ranked.length, reasons: rankedMatch!.reasons }
    : null

  // Hero artwork resolution: a saved generated hero (Neon, served from
  // /api/country-asset) wins → then committed /public artwork → then the
  // branded gradient + outline fallback inside CountryHero.
  const heroVersion = await getGeneratedHeroVersion(countrySlug)
  const heroArtwork = heroVersion
    ? { src: `/api/country-asset?slug=${countrySlug}&type=hero&v=${heroVersion}`, focalPoint: { x: 50, y: 50 } }
    : getApprovedHero(countrySlug)

  // Verified relocation figures for the hero panels (honest empties when unset).
  const cd = await getCountryData(countrySlug)
  const heroData = {
    primaryVisaRoute: cd.primary_visa_route,
    monthlyCostUsd: cd.monthly_cost_usd,
    timeToResidency: cd.time_to_residency,
    pathToCitizenship: cd.path_to_citizenship,
    sources: cd.sources,
  }

  // Required hero status indicators (Country Design System) — real data only.
  const statusChips: Array<{ label: string; tone?: 'gold' | 'good' | 'muted' }> = []
  if (matchInfo) statusChips.push({ label: `Matched · #${matchInfo.rank} of ${matchInfo.total}`, tone: 'gold' })
  const routeLabel = cd.primary_visa_route ?? detail?.visaType
  if (routeLabel) statusChips.push({ label: `Route: ${routeLabel}`, tone: 'good' })
  statusChips.push(cd.last_verified ? { label: 'Data verified', tone: 'good' } : { label: 'Data being verified', tone: 'muted' })

  // Personalized Summary (Country Design System): shown only on the Overview tab
  // when we have real, calculated Match Score data — never fabricated, never an
  // empty placeholder. Expanded by default for the user's #1 match.
  const overviewPrefix = active === 'overview' && matchInfo && rankedMatch ? (
    <PersonalizedCountrySummary
      countrySlug={countrySlug}
      summary={`${record.name} is your #${matchInfo.rank} match of ${matchInfo.total}.`}
      explanation={rankedMatch.reasons.join(' ') || rankedMatch.tradeoff}
      reasons={rankedMatch.reasons}
      overallFit={matchInfo.score}
      blockingIssue={detail?.visaType
        ? { label: 'Route identified', detail: `Primary route: ${detail.visaType}` }
        : { label: 'Visa pathway', detail: 'No qualifying route confirmed for your profile yet' }}
      outcome={{
        label: 'Naturalization',
        value: cd.path_to_citizenship ?? 'Being verified',
        detail: cd.path_to_citizenship ? undefined : 'Shown once confirmed from official sources',
      }}
      callouts={rankedMatch.tradeoff ? [{ title: 'Honest tradeoff', body: rankedMatch.tradeoff }] : []}
      rank={matchInfo.rank}
      totalRanked={matchInfo.total}
      categoryScores={[]}
      defaultOpen={matchInfo.rank === 1}
    />
  ) : null

  // Portugal is the only fully verified dataset — it renders the approved rich
  // tabs. Every other country renders the same rich frame with honest,
  // data-driven content.
  if (countrySlug === 'portugal') {
    // Free + matched: Overview keeps section 1 and the personalization teaser;
    // every other tab is locked. Mirrors the demo's richOverview / lockedTab split.
    const locked = (
      <LockedTab
        countryName={record.name}
        tabLabel={TAB_LABEL[active]}
        title={LOCKED_TITLE[active]}
        sections={TAB_SECTIONS[active]}
      />
    )
    const tab = !paid
      ? (active === 'overview'
        ? <>{overviewPrefix}<OverviewTab slug={countrySlug} freeTier /></>
        : locked)
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

    return (
      <CountryTemplate slug={countrySlug} active={active} fromQuiz={fromQuiz} country={templateCountry} center={center} match={matchInfo} data={heroData} heroArtwork={heroArtwork} statusChips={statusChips} paid={paid} rich>
        {tab}
      </CountryTemplate>
    )
  }

  const body = !paid && active !== 'overview'
    ? (
      <LockedTab
        countryName={record.name}
        tabLabel={TAB_LABEL[active]}
        title={LOCKED_TITLE[active]}
        sections={TAB_SECTIONS[active]}
      />
    )
    : active === 'overview'
    ? (
      <>
        {overviewPrefix}
        <DataOverviewTab
          country={templateCountry}
          visaType={detail?.visaType}
          incomeRequired={detail?.incomeRequired}
          summary={detail?.summary}
        />
      </>
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
      heroArtwork={heroArtwork}
      statusChips={statusChips}
      paid={paid}
    >
      {body}
    </CountryTemplate>
  )
}
