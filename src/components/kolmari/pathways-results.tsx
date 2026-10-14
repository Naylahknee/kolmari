'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, ChevronDown, Compass, SlidersHorizontal } from 'lucide-react'
import type { RelocationProfile } from '@/lib/profile'
import { evaluatePathways, RESEARCH_DISCLAIMER, type PathwayEvaluation } from '@/lib/pathways'
import { INCOME_TYPES } from '@/lib/pathway-extras'
import { PathwaysExplorer } from './pathways-explorer'
import { PathwaysLesserRoutes } from './pathways-lesser-routes'

// The saved profile completion flag controls personalized display, not search access.
export function PathwaysResults({ profile, selectedPathway }: {
  profile: RelocationProfile
  selectedPathway: string | null
}) {
  const personalized = profile.wizard_status === 'completed'
  const [routeCategory, setRouteCategory] = useState('All')
  const [income, setIncome] = useState<number | null>(profile.monthly_income)
  const [savings, setSavings] = useState<number | null>(profile.savings)
  const [children, setChildren] = useState(profile.dependents ?? 0)
  const [incomeType, setIncomeType] = useState<string | null>(profile.income_type)
  const touched = income !== profile.monthly_income || savings !== profile.savings ||
    children !== (profile.dependents ?? 0) || incomeType !== profile.income_type

  function reset() {
    setIncome(profile.monthly_income); setSavings(profile.savings)
    setChildren(profile.dependents ?? 0); setIncomeType(profile.income_type)
  }

  const evaluated = useMemo<PathwayEvaluation[]>(() => {
    if (!personalized) {
      return evaluatePathways({
        ...profile, goals: [], monthly_income: null, savings: null,
        remote: null, dependents: null, income_type: null,
      }).map(p => ({ ...p, status: 'Missing Requirements' as const, requirementsMet: [], missingRequirements: [] }))
    }
    return evaluatePathways({ ...profile, monthly_income: income, savings, dependents: children, income_type: incomeType })
  }, [personalized, profile, income, savings, children, incomeType])

  const likely = personalized ? evaluated.filter(p => p.status === 'Strong Match').length : 0

  return (
    <div className="space-y-5">
      <header className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-tile sm:p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gold-deep">Kolmari · Pathways</p>
        <div className="mt-1 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-extrabold leading-tight text-navy sm:text-[32px]">
              {personalized ? 'Your relocation pathways' : 'Explore relocation pathways'}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              {personalized
                ? 'Explore routes against your Kolmari Profile. Review why each route may fit and what still needs to be verified.'
                : 'Search ways to live, work, study or settle abroad. Complete your profile to add personalized matching.'}
            </p>
          </div>
          <nav className="flex flex-wrap gap-2" aria-label="Related tools">
            <Link href="/passportindex" className="inline-flex min-h-10 items-center gap-1 rounded-[var(--radius-field)] border border-line px-3 text-xs font-bold text-navy hover:bg-canvas">
              Passport Index <ArrowRight size={13} aria-hidden="true" />
            </Link>
            <Link href="/my-plan" className="inline-flex min-h-10 items-center gap-1 rounded-[var(--radius-field)] bg-navy px-3 text-xs font-bold text-white hover:bg-navy-deep">
              My Plan <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </nav>
        </div>
        {personalized ? (
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-[var(--radius-field)] bg-canvas px-4 py-3 text-xs">
            <span className="inline-flex items-center gap-1.5 font-bold text-navy">
              <CheckCircle2 size={16} className="text-teal-deep" aria-hidden="true" /> Profile completed
            </span>
            <span className="text-muted"><strong className="text-navy">{likely}</strong> potential fits</span>
            <span className="text-muted"><strong className="text-navy">{evaluated.length - likely}</strong> routes to research</span>
            <Link href="/profile-wizard" className="ml-auto font-semibold text-navy underline-offset-2 hover:underline">Edit profile</Link>
          </div>
        ) : (
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-[var(--radius-field)] bg-gold-soft/45 px-4 py-3">
            <Compass size={18} className="shrink-0 text-gold-deep" aria-hidden="true" />
            <p className="min-w-0 flex-1 text-[13px] text-navy">
              You're browsing the research directory. No personalized match or eligibility score is being calculated yet.
            </p>
            <Link href="/profile-wizard" className="inline-flex min-h-10 items-center gap-1 rounded-[var(--radius-field)] bg-navy px-3 text-xs font-bold text-white hover:bg-navy-deep">
              Complete profile <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        )}
      </header>

      {personalized && (
        <details className="group rounded-[var(--radius-card)] border border-line bg-white shadow-tile">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 marker:hidden sm:px-5 [&::-webkit-details-marker]:hidden">
            <span className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-field)] bg-canvas text-navy">
                <SlidersHorizontal size={17} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-bold text-navy">Adjust matching assumptions</span>
                <span className="mt-1 block text-xs leading-5 text-muted">Try different circumstances without changing your saved profile.</span>
              </span>
            </span>
            <ChevronDown size={17} className="shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="grid gap-5 border-t border-line p-5 sm:grid-cols-2 xl:grid-cols-4">
            <label className="block">
              <span className="text-xs font-bold text-muted">Monthly income</span>
              <span className="mt-1 block text-xl font-extrabold text-navy">{income === null ? 'Not set' : `$${income.toLocaleString()}`}</span>
              <input type="range" min={0} max={15000} step={100} value={income ?? 0} onChange={e => setIncome(Number(e.target.value))} className="mt-3 w-full accent-[var(--color-gold)]" />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-muted">Savings available</span>
              <span className="mt-1 block text-xl font-extrabold text-navy">{savings === null ? 'Not set' : `$${savings.toLocaleString()}`}</span>
              <input type="range" min={0} max={200000} step={5000} value={savings ?? 0} onChange={e => setSavings(Number(e.target.value))} className="mt-3 w-full accent-[var(--color-gold)]" />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-muted">Children moving</span>
              <span className="mt-1 block text-xl font-extrabold text-navy">{children}</span>
              <input type="range" min={0} max={12} step={1} value={children} onChange={e => setChildren(Number(e.target.value))} className="mt-3 w-full accent-[var(--color-gold)]" />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-muted">How you earn</span>
              <select value={incomeType ?? ''} onChange={e => setIncomeType(e.target.value || null)} className="field mt-2">
                <option value="">Not set</option>
                {INCOME_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            {touched && (
              <div className="flex flex-wrap items-center gap-3 sm:col-span-2 xl:col-span-4">
                <span role="status" className="text-xs font-semibold text-warn">Showing unsaved matching assumptions.</span>
                <button type="button" onClick={reset} className="text-xs font-bold text-navy underline-offset-2 hover:underline">Reset to my profile</button>
              </div>
            )}
          </div>
        </details>
      )}

      <section id="pw-routes" className="scroll-mt-4" aria-label={personalized ? 'Personalized route explorer' : 'Searchable route directory'}>
        <PathwaysExplorer pathways={evaluated} planPathway={selectedPathway}
          category={routeCategory} onCategoryChange={setRouteCategory} personalized={personalized} />
      </section>

      <section className="rounded-[var(--radius-card)] border border-line bg-white shadow-tile" aria-label="Lesser-known routes">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold-deep">Beyond the usual routes</p>
            <h2 className="mt-1 text-lg font-bold text-navy">Discover lesser-known pathways</h2>
            <p className="mt-1 text-[13px] leading-6 text-muted">Optional research, separate from your personalized matches.</p>
          </div>
          <Link href="/my-plan" className="inline-flex items-center gap-1 text-xs font-bold text-navy hover:underline">
            Continue in My Plan <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <details className="group border-t border-line">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-bold text-navy marker:hidden [&::-webkit-details-marker]:hidden">
            Browse alternative route research
            <ChevronDown size={17} className="shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="px-5 pb-5"><PathwaysLesserRoutes /></div>
        </details>
      </section>

      <footer className="rounded-[var(--radius-card)] border border-line bg-canvas p-5 text-xs leading-6 text-muted" aria-label="Sources and research notes">
        <p className="font-bold text-navy">About these recommendations</p>
        <p className="mt-1">{RESEARCH_DISCLAIMER}</p>
        <p className="mt-2">Income and savings figures are approximate planning guides, not official thresholds. Confirm every requirement with the destination authority.</p>
      </footer>
    </div>
  )
}
