'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, CheckCircle2, ChevronDown, ExternalLink, Info, Route } from 'lucide-react'
import type { RelocationProfile } from '@/lib/profile'
import { RESEARCH_DISCLAIMER } from '@/lib/pathways'

export type Fit = 'likely' | 'possible' | 'unknown'

export type Pathway = {
  id: string
  category: string
  title: string
  country: string
  countryCode: string
  fit: Fit
  incomeGuide?: string
  dependents?: string
  workRights?: string
  fees?: string
  processing?: string
  lastVerified?: string
  sourceUrl?: string
  sourceLabel?: string
  met: string[]
  missing: string[]
}

const FIT_LABELS: Record<Fit, string> = {
  likely: 'Likely fit',
  possible: 'Possible fit',
  unknown: 'More information needed',
}

const FIT_TONES: Record<Fit, string> = {
  likely: 'bg-teal-soft text-teal-deep',
  possible: 'bg-gold-soft text-warn',
  unknown: 'bg-canvas text-muted',
}

const GROUPS: Array<{ fit: Fit; description: string }> = [
  { fit: 'likely', description: 'Your profile shows the strongest alignment with these routes. Official requirements still apply.' },
  { fit: 'possible', description: 'Your profile has relevant signals, with important details still to verify.' },
  { fit: 'unknown', description: 'More profile information or official research is needed before comparing these routes.' },
]

function FitBadge({ fit }: { fit: Fit }) {
  return <span className={`shrink-0 rounded-[var(--radius-pill)] px-2.5 py-1 text-[11px] font-bold ${FIT_TONES[fit]}`}>{FIT_LABELS[fit]}</span>
}

function CountryLabel({ code, country }: { code: string; country: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold text-muted">
      <span className="rounded-[var(--radius-field)] border border-line bg-canvas px-2 py-1 font-bold text-navy">{code}</span>
      {country}
    </span>
  )
}

function StrongSignalCard({ pathway }: { pathway: Pathway }) {
  return (
    <article className="card-surface min-w-0 p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-deep">{pathway.category}</p>
        <FitBadge fit={pathway.fit} />
      </div>
      <h3 className="mt-3 line-clamp-2 min-h-12 text-base font-bold leading-6 text-navy">{pathway.title}</h3>
      <div className="mt-3"><CountryLabel code={pathway.countryCode} country={pathway.country} /></div>
      <p className="mt-3 text-xs text-muted">{pathway.met.length} met, {pathway.missing.length} to confirm</p>
    </article>
  )
}

function PathwayRow({ pathway, defaultOpen }: { pathway: Pathway; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const headingId = `pathway-heading-${pathway.id}`
  const panelId = `pathway-panel-${pathway.id}`
  const facts = [
    ['Income guide', pathway.incomeGuide],
    ['Dependents', pathway.dependents],
    ['Local work rights', pathway.workRights],
    ['Estimated fees', pathway.fees],
    ['Estimated processing', pathway.processing],
    ['Last verified', pathway.lastVerified],
  ].filter((fact): fact is [string, string] => Boolean(fact[1]))

  return (
    <article className="card-surface overflow-hidden">
      <h3>
        <button
          type="button"
          id={headingId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((current) => !current)}
          className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-canvas focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-gold/50"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-deep">{pathway.category}</span>
              <FitBadge fit={pathway.fit} />
            </div>
            <p className="mt-2 line-clamp-2 text-base font-bold leading-6 text-navy">{pathway.title}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
              <CountryLabel code={pathway.countryCode} country={pathway.country} />
              {pathway.processing && <span className="text-xs text-muted">{pathway.processing}</span>}
              <span className="text-xs font-semibold text-muted">{pathway.met.length} met, {pathway.missing.length} to confirm</span>
            </div>
          </div>
          <ChevronDown size={19} aria-hidden="true" className={`shrink-0 text-muted transition-transform duration-[var(--duration-standard)] ${open ? 'rotate-180' : ''}`} />
        </button>
      </h3>

      {open && (
        <div id={panelId} role="region" aria-labelledby={headingId} className="border-t border-line px-5 pb-6 pt-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-teal-deep">Requirements met</h4>
              {pathway.met.length ? (
                <ul className="mt-3 space-y-2 text-sm text-navy">
                  {pathway.met.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-teal-deep" aria-hidden="true" /><span>{item}</span></li>)}
                </ul>
              ) : <p className="mt-3 text-sm text-muted">No profile requirements confirmed yet.</p>}
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-warn">Missing or unconfirmed</h4>
              {pathway.missing.length ? (
                <ul className="mt-3 space-y-2 text-sm text-navy">
                  {pathway.missing.map((item) => <li key={item} className="flex gap-2"><Info size={16} className="mt-0.5 shrink-0 text-warn" aria-hidden="true" /><span>{item}</span></li>)}
                </ul>
              ) : <p className="mt-3 text-sm text-muted">No profile gaps identified.</p>}
            </div>
          </div>

          {facts.length > 0 && (
            <dl className="mt-6 grid gap-x-8 gap-y-4 border-t border-line pt-5 text-sm sm:grid-cols-2">
              {facts.map(([label, value]) => <div key={label}><dt className="text-xs font-bold text-muted">{label}</dt><dd className="mt-1 leading-6 text-navy">{value}</dd></div>)}
            </dl>
          )}

          {pathway.sourceUrl && (
            <a href={pathway.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-[var(--radius-field)] text-xs font-bold text-gold-deep underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-gold/50">
              <ExternalLink size={14} aria-hidden="true" />
              {pathway.sourceLabel ?? 'Official source'}
            </a>
          )}
        </div>
      )}
    </article>
  )
}

function CategoryChip({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        'shrink-0 rounded-[var(--radius-pill)] border px-3.5 py-2 text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gold/50',
        active ? 'border-navy bg-navy text-white' : 'border-line bg-white text-muted hover:border-navy/30 hover:text-navy',
      ].join(' ')}
    >
      {label} <span className={active ? 'text-white/70' : 'text-muted-soft'}>{count}</span>
    </button>
  )
}

const ALL_CATEGORIES = 'All'

export function PathwaysResults({ profile, pathways }: { profile: RelocationProfile; pathways: Pathway[] }) {
  const complete = profile.wizard_status === 'completed'
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES)
  const categories = [ALL_CATEGORIES, ...Array.from(new Set(pathways.map((pathway) => pathway.category)))]
  const filtered = activeCategory === ALL_CATEGORIES ? pathways : pathways.filter((pathway) => pathway.category === activeCategory)
  const strongest = pathways.filter((pathway) => pathway.fit === 'likely').slice(0, 3)
  const firstLikelyId = filtered.find((pathway) => pathway.fit === 'likely')?.id
  const categoryCount = (category: string) => category === ALL_CATEGORIES ? pathways.length : pathways.filter((pathway) => pathway.category === category).length

  return (
    <div>
      <header className="rounded-[20px] bg-navy-deep p-7 text-white sm:p-10">
        <div className="flex items-center gap-3"><Route size={22} className="text-gold" aria-hidden="true" /><p className="text-sm font-bold text-gold">Pathways</p></div>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Research the routes that fit your facts.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">Your Profile supplies the inputs. This page organizes official Pathway research. It does not determine your eligibility or guarantee any outcome.</p>
        {!complete && (
          <div className="mt-6 rounded-[var(--radius-card)] border border-gold/30 bg-white/8 p-5">
            <p className="font-semibold">Complete your Profile to see personalized Pathway signals.</p>
            <p className="mt-1 text-sm text-white/70">Until then, all Pathways show as needing more information—no match is assumed.</p>
            <Link href="/profile-wizard" className="gold-button mt-4 inline-flex items-center gap-2">Start Profile Wizard <ArrowRight size={16} /></Link>
          </div>
        )}
      </header>

      {strongest.length > 0 && (
        <section className="mt-8" aria-labelledby="top-matches-heading">
          <h2 id="top-matches-heading" className="text-xs font-bold uppercase tracking-[0.14em] text-gold-deep">Your strongest signals</h2>
          <p className="mt-1 text-sm text-muted">Based on your Profile. Official requirements still control eligibility.</p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{strongest.map((pathway) => <StrongSignalCard key={pathway.id} pathway={pathway} />)}</div>
        </section>
      )}

      <section className="mt-8" aria-label="Filter Pathways by category">
        <div className="-mx-1 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
          <div className="flex w-max min-w-full gap-2">
            {categories.map((category) => <CategoryChip key={category} label={category} count={categoryCount(category)} active={activeCategory === category} onClick={() => setActiveCategory(category)} />)}
          </div>
        </div>
      </section>

      <section className="mt-6" aria-labelledby="all-pathways-heading">
        <h2 id="all-pathways-heading" className="text-lg font-bold text-navy">{activeCategory === ALL_CATEGORIES ? 'Explore all Pathways' : `${activeCategory} Pathways`}</h2>
        {filtered.length > 0 ? (
          <div className="mt-5 space-y-8">
            {GROUPS.map((group) => {
              const items = filtered.filter((pathway) => pathway.fit === group.fit)
              if (!items.length) return null
              return (
                <section key={group.fit} aria-labelledby={`pathway-group-${group.fit}`}>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 id={`pathway-group-${group.fit}`} className="text-base font-bold text-navy">{FIT_LABELS[group.fit]}</h3>
                    <span className="rounded-[var(--radius-pill)] bg-canvas px-2 py-0.5 text-xs font-bold text-muted">{items.length}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{group.description}</p>
                  <div className="mt-3 space-y-3">{items.map((pathway) => <PathwayRow key={pathway.id} pathway={pathway} defaultOpen={pathway.id === firstLikelyId} />)}</div>
                </section>
              )
            })}
          </div>
        ) : <div className="card-surface mt-5 p-8 text-sm text-muted">No Pathways found for this category.</div>}
      </section>

      <section className="mt-8 rounded-[var(--radius-card)] border border-line bg-canvas p-6 text-sm text-muted" aria-label="Sources and research notes">
        <h2 className="font-bold text-navy">Sources and research notes</h2>
        <p className="mt-2 leading-6">{RESEARCH_DISCLAIMER}</p>
        <p className="mt-3 leading-6">Income and savings figures shown are approximate planning guides in USD equivalent—not official government thresholds. Confirm every requirement directly with the linked government authority.</p>
      </section>
    </div>
  )
}
