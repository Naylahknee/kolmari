'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import {
  READINESS_LABELS, budgetEnteredCount, budgetTotal, docCounts, docProgress,
  formatAmount, formatMonthYear, formatShortDate, nextBestAction, readinessChecks,
} from '@/lib/plan-types'
import { ProgressBar, type PlanCtx } from './shared'

export function OverviewTab({ ctx }: { ctx: PlanCtx }) {
  const { plan, goToTab, openDetails } = ctx
  const checks = readinessChecks(plan)
  const completed = checks.filter(Boolean).length
  const readinessPct = Math.round((completed / checks.length) * 100)
  const firstUnmet = READINESS_LABELS[checks.findIndex((c) => !c)]
  const action = nextBestAction(plan)
  const counts = docCounts(plan)
  const progress = docProgress(plan)
  const total = budgetTotal(plan)
  const enteredCats = budgetEnteredCount(plan)
  const canFlutter = Boolean(plan.saved_nextination && plan.selected_pathway)

  return (
    <div className="space-y-4">
      {/* A + B: Next best action + readiness */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <section className="card-surface p-5" aria-labelledby="nba-heading">
          <div className="flex items-start justify-between gap-3">
            <p id="nba-heading" className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Next best action</p>
            {action.dueDate && <span className="rounded-full bg-gold-soft px-2.5 py-1 text-[11px] font-bold text-gold-deep">Due {formatShortDate(action.dueDate)}</span>}
          </div>
          <h2 className="mt-2 text-xl font-bold text-navy">{action.title}</h2>
          <p className="mt-1 text-sm text-muted">{action.detail}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {!action.caughtUp && (
              <button type="button" onClick={() => (action.tab === 'overview' ? openDetails() : goToTab(action.tab))} className="gold-button">
                {action.tab === 'overview' ? 'Set it up' : 'Continue task'} <ArrowRight size={15} aria-hidden="true" />
              </button>
            )}
            {action.dueDate && <button type="button" onClick={() => goToTab(action.tab)} className="rounded-[var(--radius-btn)] border border-line px-3.5 py-2 text-xs font-bold text-navy hover:bg-canvas">View deadline</button>}
          </div>
        </section>

        <section className="card-surface p-5" aria-labelledby="readiness-heading">
          <p id="readiness-heading" className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Move readiness</p>
          <div className="mt-2 flex items-baseline justify-between gap-2">
            <span className="text-lg font-bold text-navy">{completed} of {checks.length} milestones</span>
            <span className="text-sm font-bold text-muted">{readinessPct}%</span>
          </div>
          <ProgressBar value={readinessPct} className="mt-3" />
          <p className="mt-3 text-xs text-muted">{firstUnmet ? `${firstUnmet} is your next milestone.` : 'All readiness milestones complete.'}</p>
        </section>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <section className="card-surface flex flex-col p-5" aria-labelledby="essentials-heading">
          <h2 id="essentials-heading" className="text-base font-bold text-navy">Plan essentials</h2>
          <p className="mt-0.5 text-xs text-muted">The decisions guiding this move.</p>
          <dl className="mt-3 flex-1 space-y-2 text-sm">
            <Row label="Destination" value={plan.saved_nextination} />
            <Row label="Pathway" value={plan.selected_pathway} />
            <Row label="Target" value={formatMonthYear(plan.target_move_date) || null} />
          </dl>
          <button type="button" onClick={openDetails} className="mt-4 inline-flex w-fit rounded-[var(--radius-btn)] border border-line px-3.5 py-2 text-xs font-bold text-navy hover:bg-canvas">Edit essentials</button>
        </section>

        <section className="card-surface flex flex-col p-5" aria-labelledby="docready-heading">
          <h2 id="docready-heading" className="text-base font-bold text-navy">Document readiness</h2>
          <p className="mt-0.5 text-xs text-muted">Visa document preparation.</p>
          {progress === null ? (
            <div className="mt-3 flex-1">
              <p className="text-sm text-muted">No documents listed yet.</p>
            </div>
          ) : (
            <div className="mt-3 flex-1">
              <p className="text-2xl font-bold text-navy">{progress}%</p>
              <ProgressBar value={progress} className="mt-2" />
              <p className="mt-2 text-xs text-muted">{counts.ready} ready · {counts.in_progress + counts.needs_review} in progress · {counts.not_started} not started</p>
            </div>
          )}
          <button type="button" onClick={() => goToTab('documents')} className="mt-4 inline-flex w-fit rounded-[var(--radius-btn)] border border-line px-3.5 py-2 text-xs font-bold text-navy hover:bg-canvas">{progress === null ? 'List documents' : 'Open document workspace'}</button>
        </section>

        <section className="card-surface flex flex-col p-5" aria-labelledby="budget-summary-heading">
          <h2 id="budget-summary-heading" className="text-base font-bold text-navy">Budget</h2>
          <p className="mt-0.5 text-xs text-muted">Your working cost estimate.</p>
          <div className="mt-3 flex-1">
            {total === null ? (
              <p className="text-sm text-muted">No budget entered yet.</p>
            ) : (
              <>
                <p className="text-2xl font-bold text-navy">{formatAmount(total)}</p>
                <p className="mt-1 text-xs text-muted">Estimated monthly budget</p>
                <span className="mt-2 inline-flex rounded-full bg-teal-soft px-2.5 py-1 text-[11px] font-bold text-teal-deep">{enteredCats} of 5 categories</span>
              </>
            )}
          </div>
          <button type="button" onClick={() => goToTab('budget')} className="mt-4 inline-flex w-fit rounded-[var(--radius-btn)] border border-line px-3.5 py-2 text-xs font-bold text-navy hover:bg-canvas">{total === null ? 'Build move budget' : 'Edit budget'}</button>
        </section>
      </div>

      {/* E: Greenbook insight */}
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-card)] border border-teal/25 bg-teal-soft p-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-teal-deep">Greenbook insight</p>
          <p className="mt-1 text-sm font-semibold text-navy">Review lived-experience research alongside official requirements before deciding.</p>
        </div>
        <Link href="/greenbook" className="shrink-0 rounded-[var(--radius-btn)] border border-teal/40 bg-white px-3.5 py-2 text-xs font-bold text-teal-deep hover:bg-teal-soft">Open insights</Link>
      </section>

      {/* F: Flutter Mode (contextual) */}
      {canFlutter ? (
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-card)] bg-navy p-4 text-white">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-gold" aria-hidden="true" />
            <p className="text-sm font-bold">Ready to move from planning to doing?</p>
          </div>
          <Link href="/flutter" className="gold-button">Enter Flutter Mode <ArrowRight size={15} aria-hidden="true" /></Link>
        </section>
      ) : (
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-card)] border border-line bg-canvas p-4">
          <p className="text-sm text-muted">Choose a destination and pathway to unlock Flutter Mode.</p>
          <button type="button" onClick={openDetails} className="rounded-[var(--radius-btn)] border border-line bg-white px-3.5 py-2 text-xs font-bold text-navy hover:bg-canvas">Edit plan details</button>
        </section>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line pb-2 last:border-0 last:pb-0">
      <dt className="text-muted">{label}</dt>
      <dd className={`font-bold ${value ? 'text-navy' : 'text-muted'}`}>{value ?? 'Not set'}</dd>
    </div>
  )
}
