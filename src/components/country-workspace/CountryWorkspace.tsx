'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  ArrowRight, BookOpenText, ChevronDown, Compass, ExternalLink,
  Heart, Layers, ListChecks, Route, Sparkles, Globe2, Home, BriefcaseBusiness,
  GraduationCap, HeartHandshake, ShieldCheck, CheckCircle2,
} from 'lucide-react'
import { countryFlag } from '@/lib/countries'
import { getCountryTourismMedia } from '@/lib/country-workspace/country-tourism-media'
import { IMPLEMENTED_TABS, type CountryTabId, type TabMeta } from '@/lib/country-workspace/tabs'
import type { CountryContent } from '@/lib/country-workspace/country-content'
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
  housing: 'Housing', pathways: 'Nexit Pathways', employment: 'Employment',
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

type ReadinessBreakdown = {
  overall: number | null
  profile: number
  documents: number | null
  research: number | null
}

type Props = {
  country: CountrySummary
  match: MatchData | null
  readiness: ReadinessBreakdown
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

function CountryHero({
  country, match, fromQuiz, pathwayCount,
}: Pick<Props, 'country' | 'match' | 'fromQuiz' | 'pathwayCount'>) {
  const media = getCountryTourismMedia(country.slug)
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <section
      className="relative min-h-[500px] overflow-hidden rounded-[var(--radius-card)] bg-navy-deep text-white shadow-[var(--shadow-shell)]"
      aria-label={`${country.name} Nextination overview`}
    >
      {media && !imageFailed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={media.imageSrc}
          alt={media.imageAlt}
          onError={() => setImageFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,20,44,.97)_0%,rgba(13,27,57,.90)_42%,rgba(13,27,57,.62)_72%,rgba(13,27,57,.38)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-transparent to-navy-deep/25" />

      <div className="relative z-10 flex min-h-[500px] flex-col justify-end p-6 sm:p-8 lg:p-10">
        {fromQuiz && (
          <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-[var(--radius-pill)] border border-gold/30 bg-navy-deep/65 px-3 py-1.5 text-xs font-bold text-gold backdrop-blur-sm">
            <Sparkles size={14} aria-hidden="true" /> Your top Nextination from the Nexit Match Quiz
          </p>
        )}

        <div className="max-w-3xl">
          <div className="flex items-center gap-4">
            {media && !imageFailed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={media.flagSrc} alt={media.flagAlt} className="h-12 w-auto rounded-md border border-white/35 shadow-sm sm:h-14" />
            ) : (
              <span className="text-5xl" aria-hidden="true">{countryFlag(country.code)}</span>
            )}
            <div>
              <h1 className="text-5xl font-bold leading-none text-white sm:text-6xl">{country.name}</h1>
              <p className="mt-3 text-base font-medium text-white/78">{country.city} · {country.region}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-white/85">
            <span className="rounded-[var(--radius-pill)] border border-white/20 bg-navy-deep/45 px-3 py-1.5 backdrop-blur-sm">Schengen Area</span>
            <span className="rounded-[var(--radius-pill)] border border-white/20 bg-navy-deep/45 px-3 py-1.5 backdrop-blur-sm">EU Member</span>
            <span className="rounded-[var(--radius-pill)] border border-white/20 bg-navy-deep/45 px-3 py-1.5 backdrop-blur-sm">NATO Member</span>
          </div>

          {pathwayCount > 0 && (
            <p className="mt-5 flex items-center gap-2 text-sm text-white/82">
              <Route size={15} className="shrink-0 text-gold" aria-hidden="true" />
              <span><span className="font-bold text-white">{pathwayCount}</span> Nexit Pathway{pathwayCount === 1 ? '' : 's'} available for {country.name}</span>
            </p>
          )}

          {match ? (
            <div className="mt-6 max-w-2xl rounded-[var(--radius-card)] border border-white/15 bg-navy-deep/72 p-5 backdrop-blur-md sm:p-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Nexit Match</p>
                  <div className="mt-1 flex items-end gap-3">
                    <p className="text-5xl font-extrabold leading-none text-white">{match.score}%</p>
                    <p className="pb-1 text-xl font-bold text-ok-soft">{matchLabel(match.score)}</p>
                  </div>
                </div>
              </div>
              <div
                className="mt-4 h-3 overflow-hidden rounded-full bg-white/20"
                role="progressbar"
                aria-label={`${country.name} Nexit Match`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={match.score}
              >
                <div className="h-full rounded-full bg-gold" style={{ width: `${match.score}%` }} />
              </div>
              <p className="mt-4 text-sm leading-6 text-white/82">
                {country.name} aligns with your stated relocation goals, available pathways, and budget priorities.
              </p>
              {match.reasons.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {match.reasons.slice(0, 3).map((reason) => (
                    <li key={reason} className="flex gap-2 text-sm leading-5 text-white/88">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-ok-soft" aria-hidden="true" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-4 border-t border-white/12 pt-3 text-sm leading-6 text-white/72">
                <span className="font-semibold text-gold">Tradeoff:</span> {match.tradeoff}
              </p>
            </div>
          ) : (
            <p className="mt-6 max-w-xl rounded-[var(--radius-card)] bg-navy-deep/70 p-4 text-sm text-white/80 backdrop-blur-sm">
              Complete your Nexit Profile to see your personalized Nexit Match for {country.name}.
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/saved" className="inline-flex items-center gap-2 rounded-[var(--radius-field)] border border-white/20 bg-navy-deep/55 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm hover:bg-navy-deep/75">
              <Heart size={15} aria-hidden="true" /> Save this country
            </Link>
            <Link href={`/nextinations/${country.slug}/compare`} className="inline-flex items-center gap-2 rounded-[var(--radius-field)] border border-white/20 bg-navy-deep/55 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm hover:bg-navy-deep/75">
              <Layers size={15} aria-hidden="true" /> Compare
            </Link>
            <Link href="/nexit-plan" className="gold-button">Build My Nexit Plan <ArrowRight size={15} /></Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CountryWorkspace({
  country, match, allTabs,
  pathways, content, compareData, hasChildren, studyInterest, isFamily, monthlyIncome,
  fromQuiz, initialSection, pathwayCount,
}: Omit<Props, 'tabs'> & { tabs?: TabMeta[] }) {
  const router = useRouter()
  const [mobileSectionOpen, setMobileSectionOpen] = useState(false)
  const activeLabel = SECTION_LABELS[initialSection] ?? initialSection

  function navigateTo(id: CountryTabId) {
    setMobileSectionOpen(false)
    router.push(`/nextinations/${country.slug}/${id}`)
  }

  return (
    <div className="space-y-5">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted">
        <Link href="/nextinations" className="hover:text-navy">My Nextinations</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/nextinations/${country.slug}/overview`} className="hover:text-navy">{country.name}</Link>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-navy" aria-current="page">{activeLabel}</span>
      </nav>

      <CountryHero country={country} match={match} fromQuiz={fromQuiz} pathwayCount={pathwayCount} />

      <div className="sticky top-0 z-20 -mx-1 overflow-x-auto border-y border-line bg-white/95 px-1 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <nav className="flex min-w-max items-center gap-1 py-2" aria-label="Country section navigation">
          {PRIMARY_NAV.map(({ label, target, icon: Icon }) => {
            const isActive = initialSection === target || (label === 'Cost & Housing' && initialSection === 'housing') || (label === 'Work & Study' && initialSection === 'education') || (label === 'Life & Family' && ['healthcare', 'transportation', 'family-pets'].includes(initialSection)) || (label === 'Move There' && initialSection === 'legal-taxes')
            return (
              <button
                key={label}
                type="button"
                onClick={() => navigateTo(target)}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center gap-2 rounded-[var(--radius-field)] px-4 py-2 text-sm font-semibold transition-colors ${isActive ? 'bg-gold-soft/60 text-navy' : 'text-muted hover:bg-canvas hover:text-navy'}`}
              >
                <Icon size={15} aria-hidden="true" /> {label}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileSectionOpen((v) => !v)}
          aria-expanded={mobileSectionOpen}
          className="flex w-full items-center justify-between rounded-[var(--radius-card)] border border-line bg-white px-4 py-3 text-sm font-semibold text-navy"
        >
          <span>More country sections</span>
          <ChevronDown size={16} aria-hidden="true" className={`text-muted transition-transform duration-[var(--duration-standard)] ${mobileSectionOpen ? 'rotate-180' : ''}`} />
        </button>
        {mobileSectionOpen && (
          <div className="mt-1 overflow-hidden rounded-[var(--radius-card)] border border-line bg-white p-2 shadow-[var(--shadow-shell)]">
            <nav className="grid grid-cols-2 gap-0.5" aria-label="All country sections">
              {allTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => navigateTo(tab.id)}
                  aria-current={tab.id === initialSection ? 'page' : undefined}
                  className={[
                    'flex w-full items-center justify-between rounded-[var(--radius-sidebar-row)] px-3 py-2 text-left text-sm transition-colors',
                    tab.id === initialSection ? 'bg-gold-soft/60 font-semibold text-navy' : 'text-muted hover:bg-canvas hover:text-navy',
                  ].join(' ')}
                >
                  <span>{tab.label}</span>
                  {tab.id === initialSection && <span className="size-1.5 shrink-0 rounded-full bg-gold-deep" aria-hidden="true" />}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      <div role="region" aria-label={activeLabel}>
        <TabPanel
          id={initialSection}
          country={country}
          match={match}
          readiness={readiness}
          pathways={pathways}
          content={content}
          compareData={compareData}
          hasChildren={hasChildren}
          studyInterest={studyInterest}
          isFamily={isFamily}
          monthlyIncome={monthlyIncome}
        />
      </div>
    </div>
  )
}

type TabPanelProps = {
  id: CountryTabId
  country: CountrySummary
  match: MatchData | null
  readiness: ReadinessBreakdown
  pathways: PathwayCardData[]
  content: CountryContent | null
  compareData: CompareEntry[]
  hasChildren: boolean
  studyInterest: boolean
  isFamily: boolean
  monthlyIncome: number | null
}

function TabPanel({ id, country, match, readiness, pathways, content, compareData, hasChildren, studyInterest, isFamily, monthlyIncome }: TabPanelProps) {
  const countryPathways = pathways.filter((p) => p.country.toLowerCase() === country.name.toLowerCase())
  const displayPathways = countryPathways.length > 0 ? countryPathways : pathways

  if (!IMPLEMENTED_TABS.includes(id)) {
    return (
      <section className="card-surface p-8 text-center">
        <Compass className="mx-auto text-gold-deep" aria-hidden="true" />
        <p className="mt-3 font-semibold text-navy">Research in progress</p>
        <p className="mt-1 text-sm text-muted">We are still verifying this section for {country.name}. Check the Resources section for official links in the meantime.</p>
      </section>
    )
  }

  if (id === 'overview') {
    const topCosts = content?.costOfLiving.categories.slice(0, 6) ?? []
    const officialResources = content?.resources.filter((r) => r.type === 'official').slice(0, 4) ?? []
    return (
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <section className="card-surface p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-7 place-items-center rounded-full bg-navy-deep text-sm font-bold text-white">1</span>
              <h2 className="text-xl font-bold text-navy">Country Snapshot</h2>
            </div>
            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_.9fr]">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <Fact label="Capital" value={country.city} />
                <Fact label="Region" value={country.region} />
                <Fact label="Typical income guide" value={`$${country.incomeRequired.toLocaleString()}/mo`} />
                <Fact label="Relative cost" value={country.cost} />
                <Fact label="Safety signal" value={country.safety} />
                <Fact label="Common route" value={country.visaType} />
              </dl>
              <div className="rounded-[var(--radius-card)] border border-line bg-canvas p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Country overview</p>
                <p className="mt-3 text-sm leading-6 text-muted">{country.summary}</p>
              </div>
            </div>
          </section>

          <section className="card-surface p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-full bg-navy-deep text-sm font-bold text-white">2</span>
                <h2 className="text-xl font-bold text-navy">Why People Move to {country.name}</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {[
                ['Affordable Living', content?.costOfLiving.disclaimer ?? 'Country-level cost context and city differences are included in Nexit research.'],
                ['Great Weather', content?.dailyLife.weather ?? 'Climate details are being verified.'],
                ['Welcoming Communities', content?.greenbook.communityFit ?? 'Community-fit research is available in Safety & Community.'],
                ['Quality Healthcare', content?.healthcare.publicSystem ?? 'Healthcare system details are available in Life & Family.'],
                ['Remote Work Friendly', content?.employment.remoteEnvironment ?? 'Remote-work conditions are being researched.'],
                ['Rich Culture', content?.dailyLife.culturalEtiquette ?? 'Culture and daily-life context are available in Life & Family.'],
              ].map(([title, body]) => (
                <article key={title} className="rounded-[var(--radius-card)] border border-line bg-canvas p-4">
                  <h3 className="font-bold text-navy">{title}</h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted">{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="card-surface p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-full bg-navy-deep text-sm font-bold text-white">3</span>
                <h2 className="text-xl font-bold text-navy">Cost of Living Snapshot</h2>
              </div>
              <Link href={`/nextinations/${country.slug}/cost-of-living`} className="text-sm font-bold text-gold-deep">View full analysis <ArrowRight size={14} className="inline" /></Link>
            </div>
            {topCosts.length > 0 ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {topCosts.map((item) => (
                  <div key={item.label} className="rounded-[var(--radius-card)] border border-line bg-white p-4 shadow-tile">
                    <p className="text-xs font-semibold text-muted">{item.label}</p>
                    <p className="mt-1 font-bold text-navy">{item.currency} {item.soloLow.toLocaleString()}–{item.soloHigh.toLocaleString()}</p>
                    <p className="mt-1 text-[11px] text-muted">Typical monthly planning range</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted">Cost research is still being verified for {country.name}.</p>
            )}
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          {match && (
            <section className="card-surface p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Nexit Match</p>
              <div className="mt-2 flex items-end gap-3">
                <p className="text-4xl font-extrabold text-navy">{match.score}%</p>
                <p className="pb-1 font-bold text-ok">{matchLabel(match.score)}</p>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-label="Nexit Match summary" aria-valuemin={0} aria-valuemax={100} aria-valuenow={match.score}>
                <div className="h-full rounded-full bg-gold" style={{ width: `${match.score}%` }} />
              </div>
              <ul className="mt-4 space-y-2">
                {match.reasons.slice(0, 3).map((reason) => <li key={reason} className="flex gap-2 text-xs leading-5 text-muted"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-ok" />{reason}</li>)}
              </ul>
              <p className="mt-4 text-xs leading-5 text-muted"><span className="font-semibold text-navy">Tradeoff:</span> {match.tradeoff}</p>
              <Link href={`/nextinations/${country.slug}/why-you`} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-gold-deep">View full match breakdown <ArrowRight size={12} /></Link>
            </section>
          )}

          <section className="card-surface p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Key Country Indicators</p>
            <div className="mt-4 space-y-3 text-sm">
              {[['Cost of Living', country.cost], ['Healthcare System', content?.healthcare.publicSystem ? 'Available' : 'Researching'], ['English Availability', content?.employment.languageExpectation ? 'Context available' : 'Researching'], ['Internet Quality', content?.dailyLife.internet ? 'Context available' : 'Researching'], ['Public Transportation', content?.transportation.publicTransit ? 'Context available' : 'Researching'], ['Family Suitability', hasChildren ? 'Relevant to your profile' : 'General context'], ['Safety', country.safety]].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0">
                  <span className="text-muted">{label}</span><span className="text-right font-semibold text-navy">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card-surface p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Official Resources</p>
            <div className="mt-3 space-y-2">
              {officialResources.length > 0 ? officialResources.map((resource) => (
                <a key={resource.url} href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-[var(--radius-field)] px-2 py-2 text-sm font-semibold text-info hover:bg-canvas">
                  <span>{resource.title}</span><ExternalLink size={14} aria-hidden="true" />
                </a>
              )) : <p className="text-sm text-muted">Official links are being verified.</p>}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-gold/35 bg-gold-soft/55 p-5 shadow-tile">
            <p className="font-bold text-navy">Planning to move to {country.name}?</p>
            <p className="mt-2 text-sm leading-6 text-muted">View your {country.name} readiness and continue your relocation plan.</p>
            <Link href="/nexit-plan" className="gold-button mt-4">Go to My Nexit Plan <ArrowRight size={15} /></Link>
          </section>
        </aside>
      </div>
    )
  }

  if (id === 'why-you') {
    return (
      <section className="card-surface p-6">
        <h2 className="text-lg font-bold text-navy">Why {country.name} matches you</h2>
        {match ? (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {match.reasons.map((reason) => <span key={reason} className="rounded-[var(--radius-pill)] bg-gold-soft/60 px-3 py-1.5 text-xs font-semibold text-navy">{reason}</span>)}
            </div>
            <p className="mt-5 text-sm leading-6 text-muted">We surfaced {country.name} because of how your Nexit Profile lines up with what this place asks for — the factors above weigh budget compatibility, your preferred regions, and available Pathways. <span className="font-semibold text-navy">Tradeoff:</span> {match.tradeoff}</p>
            <p className="mt-4 text-xs text-muted">This explanation is generated from your profile answers. It is planning guidance, not a guarantee.</p>
          </>
        ) : <p className="mt-3 text-sm text-muted">Complete your Nexit Profile to see why {country.name} matches you.</p>}
      </section>
    )
  }

  if (id === 'economic-profile') return <EconomicProfileTab content={content?.economic ?? null} countryName={country.name} />
  if (id === 'cost-of-living') return <CostOfLivingTab content={content?.costOfLiving ?? null} countryName={country.name} monthlyIncome={monthlyIncome} isFamily={isFamily} />

  if (id === 'pathways') {
    if (!displayPathways.length) return <section className="card-surface p-8 text-center"><p className="font-semibold text-navy">No specific Pathways found</p><p className="mt-1 text-sm text-muted">We don&apos;t yet have specific Pathway data for {country.name}. Check the Resources section for official immigration links.</p></section>
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {displayPathways.map((p) => (
          <article key={p.id} className="card-surface p-5">
            <div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-navy">{p.name}</h3><p className="text-xs text-muted">{p.country} · {p.category}</p></div><span className={`shrink-0 rounded-[var(--radius-pill)] px-2.5 py-1 text-[11px] font-bold ${statusTone[p.status] ?? 'bg-canvas text-muted'}`}>{p.status}</span></div>
            <p className="mt-3 text-xs text-muted">Income guide: {p.incomeThreshold}</p>
            {p.requirementsMet.length > 0 && <p className="mt-2 text-xs text-ok">✓ {p.requirementsMet.slice(0, 2).join(' · ')}</p>}
            {p.missingRequirements.length > 0 && <p className="mt-1 text-xs text-muted">Needs: {p.missingRequirements.slice(0, 2).join(' · ')}</p>}
            <a href={p.officialSource} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-gold-deep">{p.sourceLabel} <ExternalLink size={12} aria-hidden="true" /></a>
          </article>
        ))}
      </div>
    )
  }

  if (id === 'housing') return <HousingTab content={content?.housing ?? null} countryName={country.name} />
  if (id === 'employment') return <EmploymentTab content={content?.employment ?? null} countryName={country.name} />
  if (id === 'healthcare') return <HealthcareTab content={content?.healthcare ?? null} countryName={country.name} />
  if (id === 'education') return <EducationTab content={content?.education ?? null} countryName={country.name} hasChildren={hasChildren} studyInterest={studyInterest} />
  if (id === 'transportation') return <TransportationTab content={content?.transportation ?? null} countryName={country.name} />
  if (id === 'legal-taxes') return <LegalTaxesTab content={content?.legalTaxes ?? null} countryName={country.name} />
  if (id === 'daily-life') return <DailyLifeTab content={content?.dailyLife ?? null} countryName={country.name} />
  if (id === 'family-pets') return <FamilyPetsTab content={content?.familyPets ?? null} countryName={country.name} />
  if (id === 'greenbook') return <GreenbookTab content={content?.greenbook ?? null} countryName={country.name} />
  if (id === 'resources') return <ResourcesTab resources={content?.resources ?? []} countryName={country.name} />
  if (id === 'compare') return <CompareTab current={{ country, match }} others={compareData} />

  return <section className="card-surface p-8 text-center"><Compass className="mx-auto text-gold-deep" aria-hidden="true" /><p className="mt-3 font-semibold text-navy">Research in progress</p><p className="mt-1 text-sm text-muted">We are still verifying this section for {country.name}.</p></section>
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[var(--radius-field)] bg-canvas p-3"><dt className="text-xs text-muted">{label}</dt><dd className="mt-0.5 font-semibold text-navy">{value}</dd></div>
}

function ReadinessMetric({ label, value, unavailableLabel = 'Unavailable' }: { label: string; value: number | null; unavailableLabel?: string }) {
  return (
    <div className="rounded-[var(--radius-field)] bg-canvas p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-navy">{label}</p>
        <p className="text-sm font-bold text-navy">{value === null ? unavailableLabel : `${value}%`}</p>
      </div>
      {value !== null ? (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
          <div className="h-full rounded-full bg-gold" style={{ width: `${value}%` }} />
        </div>
      ) : null}
    </div>
  )
}
