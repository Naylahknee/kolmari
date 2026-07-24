'use client'

import Link from 'next/link'
import { useRef, useState, type KeyboardEvent } from 'react'
import {
  ArrowRight, BookOpenText, Compass, ExternalLink, Heart, Layers,
  ListChecks, Sparkles,
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

export function CountryWorkspace({
  country, match, readiness, tabs, allTabs,
  pathways, content, compareData, hasChildren, studyInterest, isFamily, monthlyIncome, fromQuiz,
}: Props) {
  const [personalized, setPersonalized] = useState(true)
  const shown = personalized ? tabs : allTabs
  const [active, setActive] = useState<CountryTabId>(shown[0]?.id ?? 'overview')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>, index: number) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const delta = event.key === 'ArrowRight' ? 1 : -1
    const next = (index + delta + shown.length) % shown.length
    setActive(shown[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <div>
      {fromQuiz ? (
        <p className="mb-4 inline-flex items-center gap-2 rounded-pill bg-gold-soft px-3 py-1.5 text-xs font-bold text-gold-deep">
          <Sparkles size={14} /> Your top Nextination from the Nexit Match Quiz
        </p>
      ) : null}

      {/* Hero */}
      <section className="overflow-hidden rounded-card bg-navy-deep p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="text-4xl" aria-hidden>{countryFlag(country.code)}</span>
              <div>
                <h1 className="font-display text-4xl font-bold leading-none">{country.name}</h1>
                <p className="mt-1 text-sm text-white/60">{country.city} · {country.region}</p>
              </div>
            </div>
            {match ? (
              <>
                <p className="mt-5 text-sm font-bold uppercase tracking-[.16em] text-gold">{matchLabel(match.score)}</p>
                {match.reasons.length ? (
                  <ul className="mt-3 space-y-1.5">
                    {match.reasons.map((reason) => (
                      <li key={reason} className="flex gap-2 text-sm text-white/85">
                        <span className="text-gold">•</span>{reason}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-3 text-sm text-white/60">
                  <span className="font-bold text-white/80">Tradeoff:</span> {match.tradeoff}
                </p>
              </>
            ) : (
              <p className="mt-5 text-sm text-white/70">
                Complete your Nexit Profile to see your personalized Nexit Match for {country.name}.
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/saved" className="inline-flex items-center gap-2 rounded-field bg-white/10 px-4 py-2.5 text-sm font-bold hover:bg-white/15">
                <Heart size={16} /> Save as a Nextination
              </Link>
              <Link href="/countries" className="inline-flex items-center gap-2 rounded-field bg-white/10 px-4 py-2.5 text-sm font-bold hover:bg-white/15">
                <Layers size={16} /> Compare
              </Link>
              <Link href="/nexit-plan" className="gold-button">Build Your Nexit Plan <ArrowRight size={16} /></Link>
            </div>
          </div>
          {match ? (
            <div className="shrink-0 rounded-card bg-white/5 p-4 text-center">
              <ScoreRing value={match.score} label="Nexit Match" size={132} />
              {readiness !== null ? (
                <p className="mt-2 text-xs text-white/60">
                  Nexit Readiness <span className="font-bold text-white">{readiness}%</span>
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      {/* Adaptive tab bar */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Country sections"
          className="flex gap-1.5 overflow-x-auto pb-1"
          onKeyDown={(e) => {
            const i = shown.findIndex((t) => t.id === active)
            if (i >= 0) onKeyDown(e, i)
          }}
        >
          {shown.map((tab, index) => {
            const selected = tab.id === active
            return (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[index] = el }}
                role="tab"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.id)}
                className={`shrink-0 rounded-pill px-3.5 py-2 text-sm font-bold transition ${
                  selected ? 'bg-gold text-navy' : 'bg-white text-muted hover:text-navy'
                } border border-line`}
              >
                {tab.shortLabel}
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={() => setPersonalized((v) => !v)}
          className="shrink-0 text-xs font-bold text-gold-deep"
        >
          {personalized ? 'All sections' : 'Personalized for you'}
        </button>
      </div>

      {/* Active panel */}
      <div role="tabpanel" className="mt-5">
        <TabPanel
          id={active}
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
  // Filter pathways to only those for this country
  const countryPathways = pathways.filter((p) => p.country.toLowerCase() === country.name.toLowerCase())
  // Fall back to all pathways when the country has none specifically defined (covers Germany, Ireland, etc.)
  const displayPathways = countryPathways.length > 0 ? countryPathways : pathways
  if (!IMPLEMENTED_TABS.includes(id)) {
    return (
      <section className="card-surface p-8 text-center">
        <Compass className="mx-auto text-gold-deep" />
        <p className="mt-3 font-extrabold text-navy">Research in progress</p>
        <p className="mt-1 text-sm text-muted">
          We are still verifying this section for {country.name}. Check the Resources tab for official links in the meantime.
        </p>
      </section>
    )
  }

  if (id === 'overview') {
    return (
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="card-surface p-6">
          <h2 className="font-display text-2xl font-bold text-navy">Overview</h2>
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
          <p className="text-xs font-bold uppercase tracking-[.16em] text-gold-deep">Recommended first actions</p>
          <div className="mt-4 space-y-2">
            <Link href="/pathways" className="flex items-center justify-between rounded-xl bg-canvas p-4 text-sm font-bold text-navy hover:bg-gold-soft/50">
              <span className="flex items-center gap-2"><ListChecks size={16} /> Review your Nexit Pathways</span>
              <ArrowRight size={15} />
            </Link>
            <Link href="/cost-calculator" className="flex items-center justify-between rounded-xl bg-canvas p-4 text-sm font-bold text-navy hover:bg-gold-soft/50">
              <span className="flex items-center gap-2"><ListChecks size={16} /> Build your Cost Snapshot</span>
              <ArrowRight size={15} />
            </Link>
            <Link href="/nexit-plan" className="flex items-center justify-between rounded-xl bg-canvas p-4 text-sm font-bold text-navy hover:bg-gold-soft/50">
              <span className="flex items-center gap-2"><BookOpenText size={16} /> Start your Nexit Plan</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    )
  }

  if (id === 'why-you') {
    return (
      <section className="card-surface p-6">
        <h2 className="font-display text-2xl font-bold text-navy">Why {country.name} matches you</h2>
        {match ? (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {match.reasons.map((reason) => (
                <span key={reason} className="rounded-pill bg-gold-soft/60 px-3 py-1.5 text-xs font-bold text-navy">
                  {reason}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-muted">
              We surfaced {country.name} because of how your Nexit Profile lines up with what this place asks for — the
              factors above weigh budget compatibility, your preferred regions, and available Pathways.{' '}
              <span className="font-semibold text-navy">Tradeoff:</span> {match.tradeoff}
            </p>
            <p className="mt-4 text-xs text-muted">
              This explanation is generated from your quiz answers. It is planning guidance, not a guarantee.
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
          <p className="font-extrabold text-navy">No specific pathways found</p>
          <p className="mt-1 text-sm text-muted">
            We don&apos;t yet have specific pathway data for {country.name}. Check the Resources tab for official immigration links.
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
                <h3 className="font-extrabold text-navy">{p.name}</h3>
                <p className="text-xs text-muted">{p.country} · {p.category}</p>
              </div>
              <span className={`shrink-0 rounded-pill px-2.5 py-1 text-[11px] font-bold ${statusTone[p.status] ?? 'bg-canvas text-muted'}`}>
                {p.status}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted">Income guide: {p.incomeThreshold}</p>
            {p.requirementsMet.length ? (
              <p className="mt-2 text-xs text-ok">✓ {p.requirementsMet.slice(0, 2).join(' · ')}</p>
            ) : null}
            {p.missingRequirements.length ? (
              <p className="mt-1 text-xs text-muted">Needs: {p.missingRequirements.slice(0, 2).join(' · ')}</p>
            ) : null}
            <a
              href={p.officialSource}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-gold-deep"
            >
              {p.sourceLabel} <ExternalLink size={12} />
            </a>
          </article>
        ))}
      </div>
    )
  }

  if (id === 'housing') {
    return <HousingTab content={content?.housing ?? null} countryName={country.name} />
  }

  if (id === 'employment') {
    return <EmploymentTab content={content?.employment ?? null} countryName={country.name} />
  }

  if (id === 'healthcare') {
    return <HealthcareTab content={content?.healthcare ?? null} countryName={country.name} />
  }

  if (id === 'education') {
    return (
      <EducationTab
        content={content?.education ?? null}
        countryName={country.name}
        hasChildren={hasChildren}
        studyInterest={studyInterest}
      />
    )
  }

  if (id === 'transportation') {
    return <TransportationTab content={content?.transportation ?? null} countryName={country.name} />
  }

  if (id === 'legal-taxes') {
    return <LegalTaxesTab content={content?.legalTaxes ?? null} countryName={country.name} />
  }

  if (id === 'daily-life') {
    return <DailyLifeTab content={content?.dailyLife ?? null} countryName={country.name} />
  }

  if (id === 'family-pets') {
    return <FamilyPetsTab content={content?.familyPets ?? null} countryName={country.name} />
  }

  if (id === 'greenbook') {
    return <GreenbookTab content={content?.greenbook ?? null} countryName={country.name} />
  }

  if (id === 'resources') {
    return <ResourcesTab resources={content?.resources ?? []} countryName={country.name} />
  }

  if (id === 'compare') {
    return (
      <CompareTab
        current={{ country, match }}
        others={compareData}
      />
    )
  }

  // Fallback (should not be reached when IMPLEMENTED_TABS is kept in sync)
  return (
    <section className="card-surface p-8 text-center">
      <Compass className="mx-auto text-gold-deep" />
      <p className="mt-3 font-extrabold text-navy">Research in progress</p>
      <p className="mt-1 text-sm text-muted">
        We are still verifying this section for {country.name}.
      </p>
    </section>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-canvas p-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 font-bold text-navy">{value}</dd>
    </div>
  )
}
