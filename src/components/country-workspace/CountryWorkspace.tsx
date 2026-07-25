'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  ArrowRight, BookOpenText, ChevronDown, Compass, ExternalLink,
  Heart, Layers, ListChecks, Route, Sparkles,
} from 'lucide-react'
import { countryFlag } from '@/lib/countries'
import { ScoreRing } from '@/components/nexit/rings'
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

// Label lookup for breadcrumb display
const SECTION_LABELS: Record<string, string> = {
  overview: 'Overview', 'economic-profile': 'Economic Profile', 'cost-of-living': 'Cost of Living',
  housing: 'Housing', pathways: 'Nexit Pathways', employment: 'Employment',
  healthcare: 'Healthcare', education: 'Education', transportation: 'Transportation',
  'legal-taxes': 'Legal & Taxes', 'daily-life': 'Daily Life', 'family-pets': 'Family & Pets',
  greenbook: 'Greenbook', resources: 'Resources', compare: 'Compare', 'why-you': 'Why You',
}

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

type Props = {
  country: CountrySummary
  match: MatchData | null
  readiness: number | null
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

// ─── Persistent country hero ─────────────────────────────────────────────────

function CountryHero({
  country, match, readiness, fromQuiz, pathwayCount,
}: Pick<Props, 'country' | 'match' | 'readiness' | 'fromQuiz' | 'pathwayCount'>) {
  return (
    <section className="overflow-hidden rounded-[var(--radius-card)] bg-navy-deep p-6 text-white sm:p-8" aria-label={`${country.name} Nextination overview`}>
      {fromQuiz && (
        <p className="mb-4 inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-gold-soft/20 px-3 py-1.5 text-xs font-bold text-gold">
          <Sparkles size={14} aria-hidden="true" /> Your top Nextination from the Nexit Match Quiz
        </p>
      )}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden="true">{countryFlag(country.code)}</span>
            <div>
              <h1 className="text-3xl font-bold leading-none text-white sm:text-4xl">{country.name}</h1>
              <p className="mt-1 text-sm text-white/60">{country.city} · {country.region}</p>
            </div>
          </div>

          {/* Pathway summary — real count only */}
          {pathwayCount > 0 && (
            <p className="mt-4 flex items-center gap-2 text-sm text-white/70">
              <Route size={14} className="shrink-0 text-gold" aria-hidden="true" />
              <span>
                <span className="font-semibold text-white">{pathwayCount}</span> Nexit Pathway{pathwayCount === 1 ? '' : 's'} available for {country.name}
              </span>
            </p>
          )}

          {match ? (
            <>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gold">{matchLabel(match.score)}</p>
              {match.reasons.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {match.reasons.map((reason) => (
                    <li key={reason} className="flex gap-2 text-sm text-white/85">
                      <span className="text-gold" aria-hidden="true">•</span>{reason}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-sm text-white/60">
                <span className="font-semibold text-white/80">Tradeoff:</span> {match.tradeoff}
              </p>
            </>
          ) : (
            <p className="mt-4 text-sm text-white/70">
              Complete your Nexit Profile to see your personalized Nexit Match for {country.name}.
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/saved" className="inline-flex items-center gap-2 rounded-[var(--radius-field)] bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/15">
              <Heart size={15} aria-hidden="true" /> Save as a Nextination
            </Link>
            <Link href={`/nextinations/${country.slug}/compare`} className="inline-flex items-center gap-2 rounded-[var(--radius-field)] bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/15">
              <Layers size={15} aria-hidden="true" /> Compare
            </Link>
            <Link href="/nexit-plan" className="gold-button">Build Your Nexit Plan <ArrowRight size={15} /></Link>
          </div>
        </div>
        {match && (
          <div className="shrink-0 rounded-[var(--radius-card)] bg-white/5 p-4 text-center">
            <ScoreRing value={match.score} label="Nexit Match" size={128} />
            {readiness !== null && (
              <p className="mt-2 text-xs text-white/60">
                Nexit Readiness <span className="font-bold text-white">{readiness}%</span>
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Main workspace ──────────────────────────────────────────────────────────

export function CountryWorkspace({
  country, match, readiness, allTabs,
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
      {/* Breadcrumb — per 04-LAYOUTS.md §20 */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted">
        <Link href="/nextinations" className="hover:text-navy">My Nextinations</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/nextinations/${country.slug}/overview`} className="hover:text-navy">{country.name}</Link>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-navy" aria-current="page">{activeLabel}</span>
      </nav>

      {/* Persistent country hero — stable across all sections */}
      <CountryHero
        country={country}
        match={match}
        readiness={readiness}
        fromQuiz={fromQuiz}
        pathwayCount={pathwayCount}
      />

      {/* Mobile section selector — sidebar handles desktop navigation */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileSectionOpen((v) => !v)}
          aria-expanded={mobileSectionOpen}
          className="flex w-full items-center justify-between rounded-[var(--radius-card)] border border-line bg-white px-4 py-3 text-sm font-semibold text-navy"
        >
          <span>{activeLabel}</span>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`text-muted transition-transform duration-[var(--duration-standard)] ${mobileSectionOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {mobileSectionOpen && (
          <div className="mt-1 overflow-hidden rounded-[var(--radius-card)] border border-line bg-white p-2 shadow-[var(--shadow-shell)]">
            <nav className="grid grid-cols-2 gap-0.5" aria-label="Country section navigation">
              {allTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => navigateTo(tab.id)}
                  aria-current={tab.id === initialSection ? 'page' : undefined}
                  className={[
                    'flex w-full items-center justify-between rounded-[var(--radius-sidebar-row)] px-3 py-2 text-left text-sm transition-colors',
                    tab.id === initialSection
                      ? 'bg-gold-soft/60 font-semibold text-navy'
                      : 'text-muted hover:bg-canvas hover:text-navy',
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

      {/* Active section content — full available width (04-LAYOUTS.md §17) */}
      <div role="region" aria-label={activeLabel}>
        <TabPanel
          id={initialSection}
          country={country}
          match={match}
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

// ─── Tab panel (section content) ─────────────────────────────────────────────

type TabPanelProps = {
  id: CountryTabId
  country: CountrySummary
  match: MatchData | null
  pathways: PathwayCardData[]
  content: CountryContent | null
  compareData: CompareEntry[]
  hasChildren: boolean
  studyInterest: boolean
  isFamily: boolean
  monthlyIncome: number | null
}

function TabPanel({ id, country, match, pathways, content, compareData, hasChildren, studyInterest, isFamily, monthlyIncome }: TabPanelProps) {
  const countryPathways = pathways.filter((p) => p.country.toLowerCase() === country.name.toLowerCase())
  const displayPathways = countryPathways.length > 0 ? countryPathways : pathways

  if (!IMPLEMENTED_TABS.includes(id)) {
    return (
      <section className="card-surface p-8 text-center">
        <Compass className="mx-auto text-gold-deep" aria-hidden="true" />
        <p className="mt-3 font-semibold text-navy">Research in progress</p>
        <p className="mt-1 text-sm text-muted">
          We are still verifying this section for {country.name}. Check the Resources section for official links in the meantime.
        </p>
      </section>
    )
  }

  if (id === 'overview') {
    return (
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="card-surface p-6">
          <h2 className="text-lg font-bold text-navy">Overview</h2>
          <p className="mt-3 text-sm leading-6 text-muted">{country.summary}</p>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <Fact label="Region" value={country.region} />
            <Fact label="Common base city" value={country.city} />
            <Fact label="Typical income guide" value={`$${country.incomeRequired.toLocaleString()}/mo`} />
            <Fact label="Relative cost" value={country.cost} />
            <Fact label="Safety signal" value={country.safety} />
            <Fact label="Common route" value={country.visaType} />
          </dl>
        </section>
        <section className="card-surface p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Recommended first actions</p>
          <div className="mt-4 space-y-2">
            <Link href="/pathways" className="flex items-center justify-between rounded-[var(--radius-field)] bg-canvas p-4 text-sm font-semibold text-navy hover:bg-gold-soft/40">
              <span className="flex items-center gap-2"><ListChecks size={15} aria-hidden="true" /> Review your Nexit Pathways</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link href="/cost-calculator" className="flex items-center justify-between rounded-[var(--radius-field)] bg-canvas p-4 text-sm font-semibold text-navy hover:bg-gold-soft/40">
              <span className="flex items-center gap-2"><ListChecks size={15} aria-hidden="true" /> Build your Cost Snapshot</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link href="/nexit-plan" className="flex items-center justify-between rounded-[var(--radius-field)] bg-canvas p-4 text-sm font-semibold text-navy hover:bg-gold-soft/40">
              <span className="flex items-center gap-2"><BookOpenText size={15} aria-hidden="true" /> Start your Nexit Plan</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </section>
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
              {match.reasons.map((reason) => (
                <span key={reason} className="rounded-[var(--radius-pill)] bg-gold-soft/60 px-3 py-1.5 text-xs font-semibold text-navy">
                  {reason}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-muted">
              We surfaced {country.name} because of how your Nexit Profile lines up with what this place asks for — the factors above weigh budget compatibility, your preferred regions, and available Pathways.{' '}
              <span className="font-semibold text-navy">Tradeoff:</span> {match.tradeoff}
            </p>
            <p className="mt-4 text-xs text-muted">
              This explanation is generated from your profile answers. It is planning guidance, not a guarantee.
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-muted">
            Complete your Nexit Profile to see why {country.name} matches you.
          </p>
        )}
      </section>
    )
  }

  if (id === 'economic-profile') {
    return <EconomicProfileTab content={content?.economic ?? null} countryName={country.name} />
  }

  if (id === 'cost-of-living') {
    return (
      <CostOfLivingTab
        content={content?.costOfLiving ?? null}
        countryName={country.name}
        monthlyIncome={monthlyIncome}
        isFamily={isFamily}
      />
    )
  }

  if (id === 'pathways') {
    if (!displayPathways.length) {
      return (
        <section className="card-surface p-8 text-center">
          <p className="font-semibold text-navy">No specific Pathways found</p>
          <p className="mt-1 text-sm text-muted">
            We don&apos;t yet have specific Pathway data for {country.name}. Check the Resources section for official immigration links.
          </p>
        </section>
      )
    }
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {displayPathways.map((p) => (
          <article key={p.id} className="card-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-navy">{p.name}</h3>
                <p className="text-xs text-muted">{p.country} · {p.category}</p>
              </div>
              <span className={`shrink-0 rounded-[var(--radius-pill)] px-2.5 py-1 text-[11px] font-bold ${statusTone[p.status] ?? 'bg-canvas text-muted'}`}>
                {p.status}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted">Income guide: {p.incomeThreshold}</p>
            {p.requirementsMet.length > 0 && (
              <p className="mt-2 text-xs text-ok">✓ {p.requirementsMet.slice(0, 2).join(' · ')}</p>
            )}
            {p.missingRequirements.length > 0 && (
              <p className="mt-1 text-xs text-muted">Needs: {p.missingRequirements.slice(0, 2).join(' · ')}</p>
            )}
            <a
              href={p.officialSource}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-gold-deep"
            >
              {p.sourceLabel} <ExternalLink size={12} aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
    )
  }

  if (id === 'housing') return <HousingTab content={content?.housing ?? null} countryName={country.name} />
  if (id === 'employment') return <EmploymentTab content={content?.employment ?? null} countryName={country.name} />
  if (id === 'healthcare') return <HealthcareTab content={content?.healthcare ?? null} countryName={country.name} />
  if (id === 'education') {
    return <EducationTab content={content?.education ?? null} countryName={country.name} hasChildren={hasChildren} studyInterest={studyInterest} />
  }
  if (id === 'transportation') return <TransportationTab content={content?.transportation ?? null} countryName={country.name} />
  if (id === 'legal-taxes') return <LegalTaxesTab content={content?.legalTaxes ?? null} countryName={country.name} />
  if (id === 'daily-life') return <DailyLifeTab content={content?.dailyLife ?? null} countryName={country.name} />
  if (id === 'family-pets') return <FamilyPetsTab content={content?.familyPets ?? null} countryName={country.name} />
  if (id === 'greenbook') return <GreenbookTab content={content?.greenbook ?? null} countryName={country.name} />
  if (id === 'resources') return <ResourcesTab resources={content?.resources ?? []} countryName={country.name} />
  if (id === 'compare') return <CompareTab current={{ country, match }} others={compareData} />

  return (
    <section className="card-surface p-8 text-center">
      <Compass className="mx-auto text-gold-deep" aria-hidden="true" />
      <p className="mt-3 font-semibold text-navy">Research in progress</p>
      <p className="mt-1 text-sm text-muted">We are still verifying this section for {country.name}.</p>
    </section>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-field)] bg-canvas p-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 font-semibold text-navy">{value}</dd>
    </div>
  )
}
