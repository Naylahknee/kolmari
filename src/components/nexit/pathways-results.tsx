'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, CheckCircle2, ChevronDown, ExternalLink, FileWarning, Route } from 'lucide-react'
import type { RelocationProfile } from '@/lib/profile'
import {
  evaluatePathways,
  PATHWAYS,
  RESEARCH_DISCLAIMER,
  type PathwayEvaluation,
  type PathwayMatchStatus,
} from '@/lib/pathways'

// ─── Status badge ────────────────────────────────────────────────────────────

const STATUS_TONE: Record<PathwayMatchStatus, string> = {
  'Strong Match':          'bg-ok-soft text-ok',
  'Possible Match':        'bg-gold-soft text-gold-deep',
  'Missing Requirements':  'bg-canvas text-muted',
}

const STATUS_LABELS: Record<PathwayMatchStatus, string> = {
  'Strong Match':          'Likely fit',
  'Possible Match':        'Possible fit',
  'Missing Requirements':  'More information needed',
}

function StatusBadge({ status }: { status: PathwayMatchStatus }) {
  return (
    <span className={`inline-block rounded-[var(--radius-pill)] px-2.5 py-1 text-[11px] font-bold ${STATUS_TONE[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}

// ─── Top match compact card ───────────────────────────────────────────────────

function TopMatchCard({ pathway }: { pathway: PathwayEvaluation }) {
  return (
    <article className="rounded-[var(--radius-card)] border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gold-deep">{pathway.category}</p>
          <h3 className="mt-1 font-semibold text-navy">{pathway.name}</h3>
          <p className="text-xs text-muted">{pathway.country}</p>
        </div>
        <StatusBadge status={pathway.status} />
      </div>
      <p className="mt-3 text-xs text-muted">Income guide: {pathway.incomeThreshold}</p>
      {pathway.requirementsMet.length > 0 && (
        <p className="mt-1 text-xs text-ok">
          ✓ {pathway.requirementsMet.slice(0, 2).join(' · ')}
        </p>
      )}
    </article>
  )
}

// ─── Accordion pathway card ───────────────────────────────────────────────────

function PathwayAccordionItem({ pathway, defaultOpen = false }: { pathway: PathwayEvaluation; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const headingId = `pathway-heading-${pathway.id}`
  const panelId   = `pathway-panel-${pathway.id}`

  return (
    <div className="border-b border-line last:border-b-0">
      <button
        type="button"
        id={headingId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-canvas"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gold-deep">{pathway.category}</span>
            <StatusBadge status={pathway.status} />
          </div>
          <p className="mt-0.5 font-semibold text-navy">{pathway.name}</p>
          <p className="text-xs text-muted">{pathway.country}</p>
        </div>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className={`shrink-0 text-muted transition-transform duration-[var(--duration-standard)] ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div id={panelId} role="region" aria-labelledby={headingId} className="px-5 pb-6 pt-1">
          {/* Requirements */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Requirements met</p>
              {pathway.requirementsMet.length > 0 ? (
                <ul className="mt-2 space-y-1.5 text-sm">
                  {pathway.requirementsMet.map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-ok" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted">Complete your Nexit Profile to compare your profile against this Pathway.</p>
              )}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Missing or unconfirmed</p>
              {pathway.missingRequirements.length > 0 ? (
                <ul className="mt-2 space-y-1.5 text-sm">
                  {pathway.missingRequirements.map((item) => (
                    <li key={item} className="flex gap-2">
                      <FileWarning size={15} className="mt-0.5 shrink-0 text-gold-deep" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted">No profile gaps identified. Official requirements still apply.</p>
              )}
            </div>
          </div>

          {/* Details */}
          <dl className="mt-5 grid gap-3 border-t border-line pt-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-bold text-muted">Income guide</dt>
              <dd className="mt-0.5 text-navy">{pathway.incomeThreshold}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-muted">Dependents</dt>
              <dd className="mt-0.5 text-navy">{pathway.dependentsAllowed}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-muted">Local work rights</dt>
              <dd className="mt-0.5 text-navy">{pathway.localWorkRights}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-muted">Estimated fees</dt>
              <dd className="mt-0.5 text-navy">{pathway.estimatedFees}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-muted">Estimated processing</dt>
              <dd className="mt-0.5 text-navy">{pathway.estimatedProcessingTime}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-muted">Last verified</dt>
              <dd className="mt-0.5 text-navy">{pathway.lastVerified}</dd>
            </div>
          </dl>

          {/* Official source */}
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <a
              href={pathway.officialSource}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-deep"
            >
              <ExternalLink size={13} aria-hidden="true" />
              {pathway.sourceLabel}
            </a>
          </div>

          {/* Disclaimer */}
          <p className="mt-3 rounded-[var(--radius-field)] bg-canvas px-4 py-3 text-xs leading-5 text-muted">
            {RESEARCH_DISCLAIMER}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Category filter pill ─────────────────────────────────────────────────────

function CategoryPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-[var(--radius-pill)] border px-3.5 py-1.5 text-xs font-bold transition-colors',
        active
          ? 'border-navy bg-navy text-white'
          : 'border-line bg-white text-muted hover:border-navy/30 hover:text-navy',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

const ALL_CATEGORIES = 'All'

export function PathwaysResults({ profile }: { profile: RelocationProfile }) {
  const complete = profile.wizard_status === 'completed'

  const evaluated: PathwayEvaluation[] = complete
    ? evaluatePathways(profile)
    : PATHWAYS.map((p) => ({ ...p, status: 'Missing Requirements' as const, requirementsMet: [], missingRequirements: [] }))

  const categories = [ALL_CATEGORIES, ...Array.from(new Set(PATHWAYS.map((p) => p.category)))]
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES)

  const topMatches = complete
    ? evaluated.filter((p) => p.status === 'Strong Match').slice(0, 3)
    : []

  const filtered = activeCategory === ALL_CATEGORIES
    ? evaluated
    : evaluated.filter((p) => p.category === activeCategory)

  // Open the first Strong Match by default; otherwise open the first item
  const defaultOpenId = filtered.find((p) => p.status === 'Strong Match')?.id ?? filtered[0]?.id

  return (
    <div>
      {/* Page header */}
      <header className="rounded-[20px] bg-navy-deep p-7 text-white sm:p-10">
        <div className="flex items-center gap-3">
          <Route size={22} className="text-gold" aria-hidden="true" />
          <p className="text-sm font-bold text-gold">Nexit Pathways</p>
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Research the routes that fit your facts.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
          Your Nexit Profile supplies the inputs. This page organizes official Pathway research. It does not determine your eligibility or guarantee any outcome.
        </p>
        {!complete && (
          <div className="mt-6 rounded-[var(--radius-card)] border border-gold/30 bg-white/8 p-5">
            <p className="font-semibold">Complete your Nexit Profile to see personalized Pathway signals.</p>
            <p className="mt-1 text-sm text-white/70">
              Until then, all Pathways show as needing more information — no match is assumed.
            </p>
            <Link href="/profile-wizard" className="gold-button mt-4 inline-flex items-center gap-2">
              Start Nexit Profile Wizard <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </header>

      {/* Personalized summary — top 3 compact matches */}
      {topMatches.length > 0 && (
        <section className="mt-8" aria-labelledby="top-matches-heading">
          <h2 id="top-matches-heading" className="text-xs font-bold uppercase tracking-widest text-gold-deep">
            Your strongest signals
          </h2>
          <p className="mt-1 text-sm text-muted">
            Based on your Nexit Profile. Official requirements still control eligibility.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topMatches.map((p) => <TopMatchCard key={p.id} pathway={p} />)}
          </div>
        </section>
      )}

      {/* Category filters */}
      <section className="mt-8" aria-label="Filter Pathways by category">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>
      </section>

      {/* Accordion directory */}
      <section className="mt-6" aria-labelledby="all-pathways-heading">
        <h2 id="all-pathways-heading" className="mb-4 font-semibold text-navy">
          {activeCategory === ALL_CATEGORIES ? 'Explore all Pathways' : `${activeCategory} Pathways`}
        </h2>
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white">
          {filtered.length > 0 ? (
            filtered.map((p) => (
              <PathwayAccordionItem key={p.id} pathway={p} defaultOpen={p.id === defaultOpenId} />
            ))
          ) : (
            <p className="px-5 py-8 text-sm text-muted">No Pathways found for this category.</p>
          )}
        </div>
      </section>

      {/* Sources and disclaimer */}
      <section className="mt-8 rounded-[var(--radius-card)] border border-line bg-canvas p-6 text-sm text-muted" aria-label="Sources and disclaimer">
        <p className="font-semibold text-navy">Sources and research notes</p>
        <p className="mt-2 leading-6">{RESEARCH_DISCLAIMER}</p>
        <p className="mt-3 leading-6">
          Income and savings figures shown are approximate planning guides in USD equivalent — not official government thresholds. Confirm every requirement directly with the linked government authority.
        </p>
      </section>
    </div>
  )
}
