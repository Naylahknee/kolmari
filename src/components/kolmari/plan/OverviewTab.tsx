'use client'

import Link from 'next/link'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import {
  PLAN_STAGES,
  READINESS_LABELS,
  budgetEnteredCount,
  budgetTotal,
  docCounts,
  docProgress,
  formatAmount,
  formatMonthYear,
  formatShortDate,
  nextBestAction,
  readinessChecks,
  type JourneyStage,
} from '@/lib/plan-types'
import { ProgressBar, type PlanCtx } from './shared'

export function OverviewTab({ ctx }: { ctx: PlanCtx }) {
  const { plan, goToTab, openDetails } = ctx
  const checks = readinessChecks(plan)
  const completed = checks.filter(Boolean).length
  const readinessPct = Math.round((completed / checks.length) * 100)
  const firstUnmet = READINESS_LABELS[checks.findIndex((check) => !check)]
  const action = nextBestAction(plan)
  const counts = docCounts(plan)
  const progress = docProgress(plan)
  const total = budgetTotal(plan)
  const enteredCats = budgetEnteredCount(plan)
  const canFlutter = Boolean(plan.saved_nextination && plan.selected_pathway)
  const pathway = plan.selected_pathway?.includes(' — ')
    ? plan.selected_pathway.split(' — ').slice(1).join(' — ')
    : plan.selected_pathway

  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.9fr)_minmax(280px,1fr)]">
        <section className="card-surface p-5 sm:p-6" aria-labelledby="nba-heading">
          <div className="flex items-start justify-between gap-3">
            <p id="nba-heading" className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Next best action</p>
            {action.dueDate && (
              <span className="shrink-0 rounded-full bg-gold-soft px-3 py-1.5 text-xs font-bold text-gold-deep">
                Due {formatShortDate(action.dueDate)}
              </span>
            )}
          </div>
          <h2 className="mt-3 text-xl font-bold tracking-[-0.01em] text-navy sm:text-2xl">{action.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-base">{action.detail}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {!action.caughtUp && (
              <button
                type="button"
                onClick={() => (action.tab === 'overview' ? openDetails() : goToTab(action.tab))}
                className="gold-button text-sm"
              >
                {action.tab === 'overview' ? 'Set it up' : 'Continue task'} <ArrowRight size={15} aria-hidden="true" />
              </button>
            )}
            {action.dueDate && (
              <button type="button" onClick={() => goToTab(action.tab)} className="min-h-11 rounded-[var(--radius-btn)] border border-line-strong bg-white px-5 text-sm font-bold text-navy hover:bg-canvas">
                View deadline
              </button>
            )}
          </div>
        </section>

        <section className="card-surface p-5 sm:p-6" aria-labelledby="readiness-heading">
          <p id="readiness-heading" className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Kolmari Readiness</p>
          <div className="mt-5 flex items-baseline justify-between gap-3">
            <span className="text-lg font-bold text-navy">{completed} of {checks.length} milestones</span>
            <span className="text-sm font-bold text-muted">{readinessPct}%</span>
          </div>
          <ProgressBar value={readinessPct} className="mt-3" />
          <p className="mt-4 text-sm leading-6 text-muted">
            {firstUnmet ? `${firstUnmet} is your next milestone.` : 'All readiness milestones complete.'}
          </p>
        </section>
      </div>

      <MoveJourney ctx={ctx} />

      <div className="grid gap-5 md:grid-cols-3">
        <section className="card-surface flex min-h-[230px] flex-col p-5 sm:p-6" aria-labelledby="essentials-heading">
          <h2 id="essentials-heading" className="text-xl font-bold text-navy">Plan essentials</h2>
          <div className="mt-5 flex-1">
            <p className="text-xl font-bold text-navy">{plan.saved_nextination ?? 'Destination not set'}</p>
            <p className="mt-3 text-sm text-muted">{pathway ?? 'Pathway not set'}</p>
            <p className="mt-3 text-sm text-muted">{formatMonthYear(plan.target_move_date) || 'Target date not set'}</p>
          </div>
          <button type="button" onClick={openDetails} className="mt-5 inline-flex min-h-9 w-fit items-center rounded-[var(--radius-btn)] border border-line-strong bg-white px-3.5 text-xs font-bold text-navy hover:bg-canvas">
            Edit details
          </button>
        </section>

        <section className="card-surface flex min-h-[230px] flex-col p-5 sm:p-6" aria-labelledby="docready-heading">
          <h2 id="docready-heading" className="text-xl font-bold text-navy">Document readiness</h2>
          <div className="mt-5 flex-1">
            {progress === null ? (
              <p className="text-sm text-muted">No documents listed yet.</p>
            ) : (
              <>
                <p className="text-xl font-bold text-navy">{progress}% complete</p>
                <p className="mt-3 text-sm text-muted">
                  {counts.ready} ready · {counts.in_progress + counts.needs_review} in progress
                </p>
                <ProgressBar value={progress} className="mt-5" />
              </>
            )}
          </div>
          <button type="button" onClick={() => goToTab('documents')} className="mt-5 inline-flex min-h-9 w-fit items-center rounded-[var(--radius-btn)] border border-line-strong bg-white px-3.5 text-xs font-bold text-navy hover:bg-canvas">
            {progress === null ? 'List documents' : 'Open Documents'}
          </button>
        </section>

        <section className="card-surface flex min-h-[230px] flex-col p-5 sm:p-6" aria-labelledby="budget-summary-heading">
          <h2 id="budget-summary-heading" className="text-xl font-bold text-navy">Budget</h2>
          <div className="mt-5 flex-1">
            {total === null ? (
              <p className="text-sm text-muted">No budget entered yet.</p>
            ) : (
              <>
                <p className="text-xl font-bold text-navy">${formatAmount(total)} monthly</p>
                <p className="mt-3 text-sm text-muted">{enteredCats} of 5 categories</p>
              </>
            )}
          </div>
          <button type="button" onClick={() => goToTab('budget')} className="mt-5 inline-flex min-h-9 w-fit items-center rounded-[var(--radius-btn)] border border-line-strong bg-white px-3.5 text-xs font-bold text-navy hover:bg-canvas">
            {total === null ? 'Build move budget' : 'Edit budget'}
          </button>
        </section>
      </div>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-card)] border border-teal/25 bg-teal-soft p-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-teal-deep">Greenbook insight</p>
          <p className="mt-1 text-sm font-semibold text-navy">Review lived-experience research alongside official requirements before deciding.</p>
        </div>
        <Link href="/greenbook" className="shrink-0 rounded-[var(--radius-btn)] border border-teal/40 bg-white px-4 py-2.5 text-xs font-bold text-teal-deep hover:bg-teal-soft">Open insights</Link>
      </section>

      {canFlutter ? (
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-card)] bg-navy-deep p-4 text-white">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-gold" aria-hidden="true" />
            <p className="text-sm font-bold">Ready to move from planning to doing?</p>
          </div>
          <Link href="/flutter" className="inline-flex min-h-9 items-center gap-2 rounded-[var(--radius-btn)] border border-white/30 bg-white px-4 text-xs font-bold text-navy hover:bg-canvas">Enter Flutter Mode <ArrowRight size={15} aria-hidden="true" /></Link>
        </section>
      ) : (
        <section className="card-surface flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-sm text-muted">Choose a destination and pathway to unlock Flutter Mode.</p>
          <button type="button" onClick={openDetails} className="min-h-9 rounded-[var(--radius-btn)] border border-line-strong bg-white px-4 text-xs font-bold text-navy hover:bg-canvas">Edit plan details</button>
        </section>
      )}
    </div>
  )
}

function MoveJourney({ ctx }: { ctx: PlanCtx }) {
  const current = ctx.plan.journey_stage - 1
  return (
    <section className="card-surface p-5 sm:p-6" aria-labelledby="move-journey-heading">
      <h2 id="move-journey-heading" className="text-xl font-bold text-navy">Kolmari Timeline</h2>
      <p className="mt-1 text-sm text-muted">Your high-level relocation path.</p>
      <div className="mt-8 overflow-x-auto pb-2">
        <ol className="flex min-w-[820px] items-start" aria-label="Move journey stages">
          {PLAN_STAGES.map((stage, index) => {
            const done = index < current
            const active = index === current
            const value = (index + 1) as JourneyStage
            return (
              <li key={stage} className="flex flex-1 flex-col items-center text-center last:flex-none">
                <div className="flex w-full items-center">
                  <span className={`h-0.5 flex-1 bg-line ${index === 0 ? 'opacity-0' : ''}`} aria-hidden="true" />
                  <button
                    type="button"
                    onClick={() => ctx.update('journey_stage', value)}
                    aria-current={active ? 'step' : undefined}
                    aria-label={`${stage}${active ? ' (current)' : ''}`}
                    className={[
                      'relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-2 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
                      done ? 'border-ok bg-ok text-white'
                        : active ? 'border-gold bg-gold text-navy'
                        : 'border-line-strong bg-white text-muted',
                    ].join(' ')}
                  >
                    {done ? <Check size={15} strokeWidth={3} aria-hidden="true" /> : value}
                  </button>
                  <span className={`h-0.5 flex-1 bg-line ${index === PLAN_STAGES.length - 1 ? 'opacity-0' : ''}`} aria-hidden="true" />
                </div>
                <span className={`mt-3 px-1 text-xs ${active ? 'font-bold text-navy' : 'font-medium text-muted'}`}>{stage}</span>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
