'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  ArrowRight, BadgeDollarSign, BookOpenText, BriefcaseBusiness, Bus, CarFront,
  CheckCircle2, ChevronDown, CircleDollarSign, ClipboardCheck, Clock3, CloudSun,
  Coins, Compass, ExternalLink, Globe2, GraduationCap, Heart, HeartHandshake,
  HeartPulse, Home, Hospital, Landmark, Languages, Layers, Lightbulb, ListChecks,
  MapPinned, Route, ShieldCheck, ShoppingCart, Snowflake, Sparkles, Sun, SunMedium,
  TrainFront, Users, Utensils, WalletCards, Wifi,
} from 'lucide-react'
import { countryFlag } from '@/lib/countries'
import { getCountryCityOverviews } from '@/lib/country-workspace/country-cities'
import { getCountryTourismMedia } from '@/lib/country-workspace/country-tourism-media'
import { getCountryFacts } from '@/lib/country-workspace/country-facts'
import { IMPLEMENTED_TABS, type CountryTabId, type TabMeta } from '@/lib/country-workspace/tabs'
import type { CountryContent } from '@/lib/country-workspace/country-content'
import { CityMapImage } from './CityMapImage'
import { CountrySnapshotMap } from './CountrySnapshotMap'
import { CompareTab } from './tabs/CompareTab'
import { CostOfLivingTab } from './tabs/CostOfLivingTab'
import { HousingTab } from './tabs/HousingTab'
import { EmploymentTab } from './tabs/EmploymentTab'
import { HealthcareTab } from './tabs/HealthcareTab'
import { EducationTab } from './tabs/EducationTab'
import { TransportationTab } from './tabs/TransportationTab'
import { DailyLifeTab } from './tabs/DailyLifeTab'
import { LegalTaxesTab } from './tabs/LegalTaxesTab'
import { FamilyPetsTab } from './tabs/FamilyPetsTab'
import { GreenbookTab } from './tabs/GreenbookTab'
import { ResourcesTab } from './tabs/ResourcesTab'
import { EconomicProfileTab } from './tabs/EconomicProfileTab'

const SECTION_LABELS: Record<string, string> = {
  overview: 'Overview', 'economic-profile': 'Economic Profile', 'cost-of-living': 'Cost of Living',
  housing: 'Housing', pathways: 'Pathways', employment: 'Employment',
  healthcare: 'Healthcare', education: 'Education', transportation: 'Transportation',
  'legal-taxes': 'Legal & Taxes', 'daily-life': 'Daily Life', 'family-pets': 'Family & Pets',
  greenbook: 'Greenbook', resources: 'Resources', compare: 'Compare', 'why-you': 'Why You',
}

const PRIMARY_NAV: { label: string; target: CountryTabId; icon: typeof Globe2 }[] = [
  { label: 'Overview', target: 'overview', icon: Globe2 },
  { label: 'Move There', target: 'pathways', icon: Route },
  { label: 'Cost & Housing', target: 'cost-of-living', icon: Home },
  { label: 'Work & Study', target: 'employment', icon: BriefcaseBusiness },
  { label: 'Life & Family', target: 'daily-life', icon: HeartHandshake },
  { label: 'Safety & Community', target: 'greenbook', icon: ShieldCheck },
]

type CountrySummary = {
  slug: string; name: string; code: string; city: string; region: string
  visaType: string; incomeRequired: number; safety: string; cost: string; summary: string
}
type MatchData = { score: number; reasons: string[]; tradeoff: string }
type CompareEntry = { country: CountrySummary; match: MatchData | null }
type PathwayCardData = {
  id: string; name: string; country: string; category: string; status: string
  requirementsMet: string[]; missingRequirements: string[]; incomeThreshold: string
  officialSource: string; sourceLabel: string; lastVerified: string
}
type ReadinessBreakdown = { overall: number | null; profile: number; documents: number | null; research: number | null }

type Props = {
  country: CountrySummary
  match: MatchData | null
  readiness: ReadinessBreakdown | null
  tabs: TabMeta[]
  allTabs: TabMeta[]
  pathways: PathwayCardData[]
  content: CountryContent | null
  compareData: CompareEntry[]
  hasChildren: boolean
  studyInterest: boolean
  isFamily: boolean
  monthlyIncome: number | null
  fromQuiz: boolean
  initialSection: CountryTabId
  pathwayCount: number
}

function matchLabel(score: number) {
  if (score >= 85) return 'Excellent Match'
  if (score >= 70) return 'Strong Match'
  if (score >= 55) return 'Good Match'
  return 'Emerging Match'
}

const statusTone: Record<string, string> = {
  'Strong Match': 'bg-ok-soft text-ok',
  'Possible Match': 'bg-warn-soft text-warn',
  'Missing Requirements': 'bg-info-soft text-info',
}

function CountryHero({ country, match, fromQuiz, pathwayCount }: Pick<Props, 'country' | 'match' | 'fromQuiz' | 'pathwayCount'>) {
  const media = getCountryTourismMedia(country.slug)
  const [imageFailed, setImageFailed] = useState(false)

  // Membership badges derived from verified per-country facts — no blanket
  // "Schengen / EU / NATO" claims shown for countries where they are untrue.
  const facts = getCountryFacts(country.slug)
  const heroBadges = facts
    ? [
        facts.snapshot.find((f) => f.icon === 'schengen')?.value === 'Yes' ? 'Schengen Area' : null,
        facts.snapshot.find((f) => f.icon === 'eu')?.value === 'Member' ? 'EU Member' : null,
        facts.snapshot.find((f) => f.icon === 'currency')?.value ?? null,
      ].filter((b): b is string => Boolean(b))
    : []

  return (
    <section className="relative min-h-[500px] overflow-hidden rounded-[var(--radius-card)] bg-navy-deep text-white shadow-[var(--shadow-shell)]" aria-label={`${country.name} Destination overview`}>
      {media && !imageFailed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={media.imageSrc} alt={media.imageAlt} onError={() => setImageFailed(true)} className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,20,44,.97)_0%,rgba(13,27,57,.90)_42%,rgba(13,27,57,.60)_70%,rgba(13,27,57,.22)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-transparent to-navy-deep/20" />

      <div className="relative z-10 flex min-h-[500px] flex-col justify-end p-6 sm:p-8 lg:p-10">
        {fromQuiz && (
          <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-[var(--radius-pill)] border border-gold/30 bg-navy-deep/65 px-3 py-1.5 text-xs font-bold text-gold backdrop-blur-sm">
            <Sparkles size={14} /> Your top Destination from the Kolmari Match Quiz
          </p>
        )}
        <div className="max-w-3xl">
          <div className="flex items-center gap-4">
            {media && !imageFailed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={media.flagSrc} alt={media.flagAlt} className="h-12 w-auto rounded-md border border-white/35 shadow-sm sm:h-14" />
            ) : <span className="text-5xl" aria-hidden="true">{countryFlag(country.code)}</span>}
            <div>
              <h1 className="text-5xl font-bold leading-none text-white sm:text-6xl">{country.name}</h1>
              <p className="mt-3 text-base font-medium text-white/78">{country.city} · {country.region}</p>
            </div>
          </div>

          {heroBadges.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-white/85">
              {heroBadges.map((badge) => (
                <span key={badge} className="rounded-[var(--radius-pill)] border border-white/20 bg-navy-deep/45 px-3 py-1.5 backdrop-blur-sm">{badge}</span>
              ))}
            </div>
          )}

          {pathwayCount > 0 && <p className="mt-5 flex items-center gap-2 text-sm text-white/82"><Route size={15} className="text-gold" /><span><strong>{pathwayCount}</strong> Pathway{pathwayCount === 1 ? '' : 's'} available for {country.name}</span></p>}

          {match ? (
            <div className="mt-6 max-w-2xl rounded-[var(--radius-card)] border border-white/15 bg-navy-deep/72 p-5 backdrop-blur-md sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Kolmari Match</p>
              <div className="mt-1 flex items-end gap-3"><p className="text-5xl font-extrabold leading-none">{match.score}%</p><p className="pb-1 text-xl font-bold text-ok-soft">{matchLabel(match.score)}</p></div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/20" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={match.score}><div className="h-full rounded-full bg-gold" style={{ width: `${match.score}%` }} /></div>
              <p className="mt-4 text-sm leading-6 text-white/82">{country.name} aligns with your stated relocation goals, available pathways, and budget priorities.</p>
              <ul className="mt-4 space-y-2">{match.reasons.slice(0, 3).map((reason) => <li key={reason} className="flex gap-2 text-sm text-white/88"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-ok-soft" />{reason}</li>)}</ul>
              <p className="mt-4 border-t border-white/12 pt-3 text-sm text-white/72"><span className="font-semibold text-gold">Tradeoff:</span> {match.tradeoff}</p>
            </div>
          ) : <p className="mt-6 max-w-xl rounded-[var(--radius-card)] bg-navy-deep/70 p-4 text-sm text-white/80 backdrop-blur-sm">Complete your Kolmari Profile to see your personalized Kolmari Match for {country.name}.</p>}

          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/saved" className="inline-flex items-center gap-2 rounded-[var(--radius-field)] border border-white/20 bg-navy-deep/55 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm hover:bg-navy-deep/75"><Heart size={15} /> Save this country</Link>
            <Link href={`/nextinations/${country.slug}/compare`} className="inline-flex items-center gap-2 rounded-[var(--radius-field)] border border-white/20 bg-navy-deep/55 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm hover:bg-navy-deep/75"><Layers size={15} /> Compare</Link>
            <Link href="/nexit-plan" className="gold-button">Build Your Kolmari Plan <ArrowRight size={15} /></Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CountryWorkspace({ country, match, allTabs, pathways, content, compareData, hasChildren, studyInterest, isFamily, monthlyIncome, fromQuiz, initialSection, pathwayCount }: Omit<Props, 'tabs'> & { tabs?: TabMeta[] }) {
  const router = useRouter()
  const [mobileSectionOpen, setMobileSectionOpen] = useState(false)
  const activeLabel = SECTION_LABELS[initialSection] ?? initialSection
  const navigateTo = (id: CountryTabId) => { setMobileSectionOpen(false); router.push(`/nextinations/${country.slug}/${id}`) }

  return (
    <div className="space-y-5">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted"><Link href="/nextinations" className="hover:text-navy">My Destinations</Link><span>/</span><Link href={`/nextinations/${country.slug}/overview`} className="hover:text-navy">{country.name}</Link><span>/</span><span className="font-semibold text-navy">{activeLabel}</span></nav>
      <CountryHero country={country} match={match} fromQuiz={fromQuiz} pathwayCount={pathwayCount} />

      <div className="sticky top-0 z-20 -mx-1 overflow-x-auto border-y border-line bg-white/95 px-1 backdrop-blur">
        <nav className="flex min-w-max items-center gap-1 py-2" aria-label="Country section navigation">
          {PRIMARY_NAV.map(({ label, target, icon: Icon }) => {
            const active = initialSection === target || (label === 'Cost & Housing' && initialSection === 'housing') || (label === 'Work & Study' && initialSection === 'education') || (label === 'Life & Family' && ['healthcare', 'transportation', 'family-pets'].includes(initialSection)) || (label === 'Move There' && initialSection === 'legal-taxes')
            return <button key={label} type="button" onClick={() => navigateTo(target)} aria-current={active ? 'page' : undefined} className={`inline-flex items-center gap-2 rounded-[var(--radius-field)] px-4 py-2 text-sm font-semibold ${active ? 'bg-gold-soft/60 text-navy' : 'text-muted hover:bg-canvas hover:text-navy'}`}><Icon size={15} />{label}</button>
          })}
        </nav>
      </div>

      <div className="lg:hidden">
        <button type="button" onClick={() => setMobileSectionOpen((v) => !v)} aria-expanded={mobileSectionOpen} className="flex w-full items-center justify-between rounded-[var(--radius-card)] border border-line bg-white px-4 py-3 text-sm font-semibold text-navy"><span>More country sections</span><ChevronDown size={16} className={mobileSectionOpen ? 'rotate-180' : ''} /></button>
        {mobileSectionOpen && <div className="mt-1 rounded-[var(--radius-card)] border border-line bg-white p-2 shadow-[var(--shadow-shell)]"><nav className="grid grid-cols-2 gap-0.5">{allTabs.map((tab) => <button key={tab.id} type="button" onClick={() => navigateTo(tab.id)} className={`rounded-[var(--radius-sidebar-row)] px-3 py-2 text-left text-sm ${tab.id === initialSection ? 'bg-gold-soft/60 font-semibold text-navy' : 'text-muted hover:bg-canvas'}`}>{tab.label}</button>)}</nav></div>}
      </div>

      <div role="region" aria-label={activeLabel}><TabPanel id={initialSection} country={country} match={match} pathways={pathways} content={content} compareData={compareData} hasChildren={hasChildren} studyInterest={studyInterest} isFamily={isFamily} monthlyIncome={monthlyIncome} /></div>
    </div>
  )
}

type TabPanelProps = {
  id: CountryTabId; country: CountrySummary; match: MatchData | null; pathways: PathwayCardData[]; content: CountryContent | null
  compareData: CompareEntry[]; hasChildren: boolean; studyInterest: boolean; isFamily: boolean; monthlyIncome: number | null
}

const reasonIconTones = ['text-ok', 'text-[#E28A00]', 'text-[#6D4DD6]', 'text-info', 'text-ok', 'text-[#D97706]']
const reasonIconBackgrounds = ['bg-ok-soft', 'bg-[#FFF4D6]', 'bg-[#EEE9FF]', 'bg-info-soft', 'bg-ok-soft', 'bg-[#FFF0DC]']
const costIcons = [Home, Lightbulb, ShoppingCart, Bus, HeartPulse, Utensils]
const cityMetrics = [
  ['Population', Users], ['Average rent', Home], ['Walk score', MapPinned], ['Research status', ClipboardCheck],
] as const

function TabPanel({ id, country, match, pathways, content, compareData, hasChildren, studyInterest, isFamily, monthlyIncome }: TabPanelProps) {
  const countryPathways = pathways.filter((p) => p.country.toLowerCase() === country.name.toLowerCase())
  const displayPathways = countryPathways.length > 0 ? countryPathways : pathways

  if (!IMPLEMENTED_TABS.includes(id)) return <section className="card-surface p-8 text-center"><Compass className="mx-auto text-gold-deep" /><p className="mt-3 font-semibold text-navy">Research in progress</p><p className="mt-1 text-sm text-muted">We are still verifying this section for {country.name}.</p></section>

  if (id === 'overview') {
    const cities = getCountryCityOverviews(country.slug)
    const tourism = getCountryTourismMedia(country.slug)
    const costs = content?.costOfLiving.categories.slice(0, 6) ?? []
    const snapshotCenter = cities[0] ?? null
    const facts = getCountryFacts(country.slug)
    // Real, per-country reference facts (public country data) — never Portugal's
    // values shown for another country. Falls back to an honest "Researching"
    // state when a country has no verified facts dataset yet.
    const factIcons = [Landmark, Users, Coins, Languages, Landmark, Clock3, CarFront, ShieldCheck, Globe2, SunMedium] as const
    const factLabels = ['Capital', 'Population', 'Currency', 'Official Language', 'Government', 'Time Zone', 'Driving Side', 'Schengen Area', 'EU Member', 'Climate']
    const factRows = facts
      ? facts.snapshot.map((f, i) => [f.label === 'EU Membership' ? 'EU Member' : f.label, f.value, factIcons[i]] as const)
      : factLabels.map((label, i) => [label, label === 'Capital' ? country.city : 'Researching', factIcons[i]] as const)
    const winterTemp = facts?.climate.find((c) => c.icon === 'winter')?.value ?? 'Researching'
    const summerTemp = facts?.climate.find((c) => c.icon === 'summer')?.value ?? 'Researching'
    const timeDiff = facts?.climate.find((c) => c.icon === 'timeDifference')?.value ?? 'Researching'
    const moveReasons = [
      ['Affordable Living', 'Lower costs than many Western European countries.', BadgeDollarSign],
      ['Great Weather', content?.dailyLife.weather ?? 'Climate context is being verified.', Sun],
      ['Welcoming Community', content?.greenbook.communityFit ?? 'Community-fit research is available.', Users],
      ['Quality Healthcare', content?.healthcare.publicSystem ?? 'Healthcare details are available.', Hospital],
      ['Remote Work Friendly', content?.employment.remoteEnvironment ?? 'Remote-work conditions are being researched.', Wifi],
      ['Rich Culture', content?.dailyLife.culturalEtiquette ?? 'Culture and daily life context are available.', Landmark],
    ] as const

    return (
      <main className="space-y-5">
        <section className="card-surface p-5 sm:p-6">
          <SectionTitle number="1" title="Country Snapshot" />
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
            <dl className="grid grid-cols-1 gap-x-6 overflow-hidden rounded-[var(--radius-card)] border border-line bg-white px-4 sm:grid-cols-2">
              {factRows.map(([label, value, Icon]) => <div key={label} className="flex items-center gap-3 border-b border-line py-3 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0"><Icon size={18} strokeWidth={2.25} className="shrink-0 text-navy" /><div><dt className="text-[11px] text-muted">{label}</dt><dd className="text-sm font-bold text-navy">{value}</dd></div></div>)}
            </dl>
            <div>
              <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-canvas">
                {snapshotCenter ? <CountrySnapshotMap countryName={country.name} lat={snapshotCenter.lat} lng={snapshotCenter.lng} alt={`Country map showing ${country.name}`} /> : <div className="grid min-h-56 place-items-center text-muted">Country map unavailable</div>}
              </div>
              <div className="mt-3 grid grid-cols-3 divide-x divide-line overflow-hidden rounded-[var(--radius-field)] border border-line bg-white">
                {[['Average winter temperature', winterTemp, 'Winter avg', Snowflake], ['Average summer temperature', summerTemp, 'Summer avg', Sun], ['Time difference', timeDiff, 'Editorial estimate', Clock3]].map(([label, value, detail, Icon]) => <div key={String(label)} className="flex min-h-24 items-center gap-3 px-3 py-3 text-left"><Icon size={20} strokeWidth={2.25} className="shrink-0 text-gold-deep" /><div><p className="text-[10px] leading-4 text-muted">{String(label)}</p><p className="text-base font-bold text-navy">{String(value)}</p><p className="text-[10px] leading-4 text-muted">{String(detail)}</p></div></div>)}
              </div>
            </div>
          </div>
        </section>

        {cities.length > 0 && <section className="card-surface p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4"><SectionTitle number="2" title="Top Cities to Live" /><Link href={`/nextinations/${country.slug}/housing`} className="inline-flex items-center gap-1 text-xs font-bold text-info">View all cities <ArrowRight size={13} /></Link></div>
          <div className="mt-5 flex snap-x gap-3 overflow-x-auto pb-3">
            {cities.slice(0, 5).map((city, index) => {
              const cityCost = costs[index % Math.max(costs.length, 1)]
              const rentValue = cityCost ? `${cityCost.currency} ${cityCost.soloLow.toLocaleString()}–${cityCost.soloHigh.toLocaleString()}` : 'Researching'
              const metricValues = ['Researching', rentValue, 'Researching', city.researchStatus]
              return <article key={city.id} className="min-w-[220px] snap-start overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-tile transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-shell)]">
                <div className="relative"><CityMapImage cityName={city.cityName} countryName={country.name} lat={city.lat} lng={city.lng} alt={city.imageAlt} />{tourism && <div className="absolute left-2 top-2 rounded-md border border-white/70 bg-white/90 p-1.5 shadow">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={tourism.flagSrc} alt={tourism.flagAlt} className="h-4 w-auto" /></div>}</div>
                <div className="p-4"><h3 className="font-bold text-navy">{city.cityName}</h3>{city.region && <p className="mt-0.5 text-[11px] text-muted">{city.region}</p>}<div className="mt-4 space-y-2.5">{cityMetrics.map(([label, Icon], metricIndex) => <div key={label} className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-[11px] text-muted"><Icon size={13} strokeWidth={2.25} />{label}</span><span className={`text-[11px] font-semibold ${label === 'Research status' ? 'text-info' : 'text-navy'}`}>{metricValues[metricIndex]}</span></div>)}</div></div>
              </article>
            })}
          </div>
        </section>}

        <section className="card-surface p-5 sm:p-6">
          <SectionTitle number="3" title={`Why People Move to ${country.name}`} />
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{moveReasons.map(([title, body, Icon], index) => <article key={title} className="flex min-h-44 flex-col items-center rounded-[var(--radius-card)] border border-line bg-white p-4 text-center shadow-tile"><span className={`grid size-12 place-items-center rounded-full ${reasonIconBackgrounds[index]}`}><Icon size={28} strokeWidth={2.25} className={reasonIconTones[index]} /></span><h3 className="mt-3 text-sm font-bold text-navy">{title}</h3><p className="mt-2 line-clamp-4 text-[11px] leading-4 text-muted">{body}</p></article>)}</div>
        </section>

        <section className="card-surface p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4"><SectionTitle number="4" title="Cost of Living Snapshot" /><Link href={`/nextinations/${country.slug}/cost-of-living`} className="inline-flex items-center gap-1 text-xs font-bold text-info">View full analysis <ArrowRight size={13} /></Link></div>
          {costs.length ? <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">{costs.map((item, index) => { const Icon = costIcons[index] ?? CircleDollarSign; return <div key={item.label} className="min-h-32 rounded-[var(--radius-field)] border border-line bg-white p-4 shadow-tile"><Icon size={21} strokeWidth={2.25} className="text-gold-deep" /><p className="mt-3 text-[11px] font-semibold text-muted">{item.label}</p><p className="mt-1 text-sm font-bold text-navy">{item.currency} {item.soloLow.toLocaleString()}–{item.soloHigh.toLocaleString()}</p><p className="mt-1 text-[10px] text-muted">/month</p></div> })}</div> : <p className="mt-4 text-sm text-muted">Cost research is still being verified.</p>}
        </section>
      </main>
    )
  }

  if (id === 'why-you') return <section className="card-surface p-6"><h2 className="text-lg font-bold text-navy">Why {country.name} matches you</h2>{match ? <><div className="mt-4 flex flex-wrap gap-2">{match.reasons.map((reason) => <span key={reason} className="rounded-[var(--radius-pill)] bg-gold-soft/60 px-3 py-1.5 text-xs font-semibold text-navy">{reason}</span>)}</div><p className="mt-5 text-sm leading-6 text-muted">We surfaced {country.name} because of how your Kolmari Profile lines up with what this place asks for. <strong className="text-navy">Tradeoff:</strong> {match.tradeoff}</p></> : <p className="mt-3 text-sm text-muted">Complete your Kolmari Profile to see why {country.name} matches you.</p>}</section>
  if (id === 'economic-profile') return <EconomicProfileTab content={content?.economic ?? null} countryName={country.name} />
  if (id === 'cost-of-living') return <CostOfLivingTab content={content?.costOfLiving ?? null} countryName={country.name} monthlyIncome={monthlyIncome} isFamily={isFamily} />
  if (id === 'pathways') {
    if (!displayPathways.length) return <section className="card-surface p-8 text-center"><p className="font-semibold text-navy">No specific Pathways found</p><p className="mt-1 text-sm text-muted">We do not yet have specific Pathway data for {country.name}.</p></section>
    return <div className="grid gap-4 md:grid-cols-2">{displayPathways.map((p) => <article key={p.id} className="card-surface p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-navy">{p.name}</h3><p className="text-xs text-muted">{p.country} · {p.category}</p></div><span className={`rounded-[var(--radius-pill)] px-2.5 py-1 text-[11px] font-bold ${statusTone[p.status] ?? 'bg-canvas text-muted'}`}>{p.status}</span></div><p className="mt-3 text-xs text-muted">Income guide: {p.incomeThreshold}</p>{p.requirementsMet.length > 0 && <p className="mt-2 text-xs text-ok">✓ {p.requirementsMet.slice(0, 2).join(' · ')}</p>}{p.missingRequirements.length > 0 && <p className="mt-1 text-xs text-muted">Needs: {p.missingRequirements.slice(0, 2).join(' · ')}</p>}<a href={p.officialSource} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-gold-deep">{p.sourceLabel} <ExternalLink size={12} /></a></article>)}</div>
  }
  if (id === 'housing') return <HousingTab content={content?.housing ?? null} countryName={country.name} />
  if (id === 'employment') return <EmploymentTab content={content?.employment ?? null} countryName={country.name} />
  if (id === 'healthcare') return <HealthcareTab content={content?.healthcare ?? null} countryName={country.name} />
  if (id === 'education') return <EducationTab content={content?.education ?? null} countryName={country.name} hasChildren={hasChildren} studyInterest={studyInterest} />
  if (id === 'transportation') return <TransportationTab content={content?.transportation ?? null} countryName={country.name} />
  if (id === 'daily-life') return <DailyLifeTab content={content?.dailyLife ?? null} countryName={country.name} />
  if (id === 'legal-taxes') return <LegalTaxesTab content={content?.legalTaxes ?? null} countryName={country.name} />
  if (id === 'family-pets') return <FamilyPetsTab content={content?.familyPets ?? null} countryName={country.name} />
  if (id === 'greenbook') return <GreenbookTab content={content?.greenbook ?? null} countryName={country.name} />
  if (id === 'resources') return <ResourcesTab resources={content?.resources ?? []} countryName={country.name} />
  if (id === 'compare') return <CompareTab current={{ country, match }} others={compareData} />
  return <section className="card-surface p-8 text-center"><p className="font-semibold text-navy">Research in progress</p></section>
}

function SectionTitle({ number, title }: { number: string; title: string }) {
  return <div className="flex items-center gap-3"><span className="grid size-7 place-items-center rounded-full bg-navy-deep text-xs font-bold text-white">{number}</span><h2 className="text-xl font-bold text-navy">{title}</h2></div>
}
