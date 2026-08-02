'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import {
  budgetEffective, formatAmount, formatMonthYear, type BudgetLine,
} from '@/lib/plan-types'
import { baselineGdp, baselineSource } from '@/lib/budget-baselines'
import { applyBudgetBenchmark, benchmarkCategoryTotal, getBudgetBenchmark } from '@/lib/budget-benchmarks'
import { SaveChip, type PlanCtx } from './shared'

// A custom entry this far below the baseline trips the reality-check warning.
const VARIANCE_THRESHOLD = 0.5

/** Sum of effective values for one chronological stage; null when no line carries a figure. */
function stageTotal(lines: BudgetLine[], stage: BudgetLine['chronologicalStage']): number | null {
  const values = lines
    .filter((line) => line.chronologicalStage === stage)
    .map(budgetEffective)
    .filter((value): value is number => value !== null)
  return values.length ? values.reduce((a, b) => a + b, 0) : null
}

export function BudgetTab({ ctx }: { ctx: PlanCtx }) {
  const { plan, update, saveStatus, retry, monthlyIncome } = ctx
  const benchmark = getBudgetBenchmark(plan.saved_nextination, plan.household_members)
  const calculatedBudget = useMemo(() => applyBudgetBenchmark(plan.budget, benchmark), [plan.budget, benchmark])
  const monthly = stageTotal(calculatedBudget, 'MONTHLY_RECURRING')
  const upfront = stageTotal(calculatedBudget, 'ONE_TIME')
  const customized = plan.budget.filter((line) => line.isCustom).length
  const eyebrow = [plan.saved_nextination, plan.household_members ? `Household of ${plan.household_members}` : null].filter(Boolean).join(' · ')
  const [benchmarkLine, setBenchmarkLine] = useState<BudgetLine | null>(null)

  const remaining = monthlyIncome === null || monthly === null ? null : monthlyIncome - monthly
  const verdict = getVerdict(monthlyIncome, monthly)

  function setOverride(id: string, raw: string) {
    const parsed = raw === '' ? null : Math.max(0, Math.min(100_000_000, Math.round(Number(raw))))
    const value = raw !== '' && Number.isNaN(parsed as number) ? null : parsed
    const target = plan.budget.find((line) => line.id === id)
    const benchmarkLine = benchmark?.categories.find((category) => category.category === target?.category)
    update('budget', plan.budget.map((line) => line.id === id ? {
      ...line,
      systemBaseline: benchmarkLine ? benchmarkCategoryTotal(benchmarkLine) : line.systemBaseline,
      systemBaselineKey: benchmark?.key ?? line.systemBaselineKey,
      userOverride: value,
      isCustom: value !== null,
      detailOverrides: null,
    } : line))
  }

  const oneTime = plan.budget.filter((l) => l.chronologicalStage === 'ONE_TIME')
  const recurring = plan.budget.filter((l) => l.chronologicalStage === 'MONTHLY_RECURRING')
  const gdp = baselineGdp(plan.saved_nextination)

  // Reality-check variance: a custom entry >=50% below its baseline is flagged.
  // Baselines are empty until cost data is added, so this stays inert for now.
  const flagged = plan.budget.filter((l) => (
    l.systemBaseline !== null && l.userOverride !== null && l.systemBaseline > 0
    && (l.systemBaseline - l.userOverride) / l.systemBaseline >= VARIANCE_THRESHOLD
  ))

  return (
    <div className="space-y-6">
      <section className="card-surface flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6">
        <div>
          {eyebrow && <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{eyebrow}</p>}
          <h2 className="mt-1 text-xl font-bold text-navy">Move budget</h2>
          <p className="mt-1 text-sm text-muted">Use local planning baselines as a starting point, then replace them with your own research.</p>
        </div>
        <SaveChip status={saveStatus} onRetry={retry} />
      </section>

      {!benchmark && (
        <section className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-card">
          <p className="font-semibold text-navy">No matching local baseline is available yet.</p>
          <p className="mt-1 text-sm text-muted">Portugal with a household of five is supported in this phase. Manual figures still autosave normally.</p>
        </section>
      )}

      <div className="grid gap-5 sm:grid-cols-3">
        <Stat label="Total upfront moving cash" value={upfront === null ? 'Not calculated' : `$${formatAmount(upfront)}`} hint="One-time arrival costs" />
        <Stat label="Monthly living budget" value={monthly === null ? 'Not calculated' : `$${formatAmount(monthly)}`} hint="Ongoing monthly run-rate" />
        <Stat label="Data verification state" value={`${customized} of ${plan.budget.length}`} hint="Rows verified with your own values" />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.85fr)_minmax(280px,.85fr)]">
        <div className="space-y-5">
          <BudgetGroup
            title="One-time arrival costs"
            hint="Visas, flights, deposits, and relocation logistics."
            lines={oneTime}
            onEdit={setOverride}
            onBenchmarks={setBenchmarkLine}
          />
          <BudgetGroup
            title="Ongoing monthly costs"
            hint="Housing, food, transport, healthcare, and other recurring costs."
            lines={recurring}
            onEdit={setOverride}
            onBenchmarks={setBenchmarkLine}
          />
          <Link href="/cost-calculator" className="inline-flex min-h-9 items-center rounded-[var(--radius-btn)] border border-line bg-white px-3.5 text-xs font-bold text-navy hover:bg-canvas">Open full Cost Calculator</Link>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-5">
          <section className="rounded-[var(--radius-card)] bg-navy-deep p-5 text-white shadow-card" aria-labelledby="plan-budget-outlook-heading">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold">Monthly outlook</p>
            <h3 id="plan-budget-outlook-heading" className="mt-2 text-xl font-bold text-white">{verdict.label}</h3>
            <p className="mt-1 text-sm leading-6 text-white/70">{verdict.detail}</p>
            <dl className="mt-5 space-y-3 border-t border-white/15 pt-4 text-sm">
              <OutlookRow label="Monthly income" value={monthlyIncome === null ? 'Not set' : `$${formatAmount(monthlyIncome)}`} />
              <OutlookRow label="Monthly costs" value={monthly === null ? 'Not calculated' : `$${formatAmount(monthly)}`} />
              <OutlookRow label={remaining !== null && remaining < 0 ? 'Monthly gap' : 'Monthly cushion'} value={remaining === null ? 'Not calculated' : `${remaining < 0 ? '−' : ''}$${formatAmount(Math.abs(remaining))}`} />
            </dl>
          </section>

          <section className="card-surface p-5">
            <p className="text-base font-bold text-navy">Plan context</p>
            <p className="mt-0.5 text-xs text-muted">The location and household assumptions behind this budget.</p>
            <dl className="mt-3 space-y-2 text-sm">
              <ContextRow label="Destination" value={plan.saved_nextination} />
              <ContextRow label="City" value={plan.destination_city} />
              <ContextRow label="Household" value={plan.household_members ? `${plan.household_members} people` : null} />
              <ContextRow label="Target move" value={formatMonthYear(plan.target_move_date) || null} />
            </dl>
            {gdp && (
              <div className="mt-3 border-t border-line pt-3">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-xs font-semibold text-muted">GDP per capita (PPP)</p>
                  <p className="text-sm font-bold text-navy">${formatAmount(gdp.value)}</p>
                </div>
                <p className="mt-1 text-[10px] leading-4 text-muted">{gdp.source}</p>
              </div>
            )}
          </section>

          {flagged.length > 0 ? (
            <section className="rounded-[var(--radius-card)] border border-warn/40 bg-warn-soft p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-warn">Reality check</p>
              <p className="mt-3 text-sm font-semibold text-navy">These estimates are well below typical local costs — double-check them:</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-navy">
                {flagged.map((l) => <li key={l.id}>{l.label}</li>)}
              </ul>
            </section>
          ) : (
            <section className="rounded-[var(--radius-card)] border border-teal/25 bg-teal-soft p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-teal-deep">Reality check</p>
              <p className="mt-3 text-sm font-semibold text-navy">Compare this estimate with local housing and healthcare research before deciding.</p>
              <Link href="/greenbook" className="mt-3 inline-flex min-h-9 items-center rounded-[var(--radius-btn)] border border-teal/40 bg-white px-3.5 text-xs font-bold text-teal-deep hover:bg-teal-soft">Review Greenbook costs</Link>
            </section>
          )}
        </aside>
      </div>

      {benchmarkLine && (
        <BenchmarkModal
          line={benchmarkLine}
          destination={plan.saved_nextination}
          source={baselineSource(plan.saved_nextination, benchmarkLine.category)}
          onClose={() => setBenchmarkLine(null)}
        />
      )}
    </div>
  )
}

function BudgetGroup({ title, hint, lines, onEdit, onBenchmarks }: {
  title: string; hint: string; lines: BudgetLine[]
  onEdit: (id: string, raw: string) => void
  onBenchmarks: (line: BudgetLine) => void
}) {
  const total = lines.map(budgetEffective).filter((v): v is number => v !== null).reduce((a, b) => a + b, 0)
  return (
    <section className="card-surface p-5" aria-label={title}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-navy">{title}</h3>
          <p className="mt-0.5 text-xs text-muted">{hint}</p>
        </div>
        <span className="shrink-0 text-sm font-bold text-navy">${formatAmount(total)}</span>
      </div>
      <div className="mt-4 divide-y divide-line">
        {lines.map((line) => (
          <div key={line.id} className="flex items-center justify-between gap-4 py-3.5">
            <div className="min-w-0">
              <p className="text-sm font-bold text-navy">{line.label}{line.isCustom && <span className="ml-2 rounded-full bg-gold-soft px-1.5 py-0.5 text-[10px] font-bold text-gold-deep">Custom</span>}</p>
              <button type="button" onClick={() => onBenchmarks(line)} className="mt-0.5 text-[11px] font-semibold text-gold-deep hover:underline">View local benchmarks</button>
            </div>
            <div className="relative shrink-0">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted" aria-hidden="true">$</span>
              <input
                className={`field h-11 w-32 pl-7 text-right ${line.isCustom ? 'font-bold text-navy' : 'font-semibold italic text-muted'}`}
                type="number"
                min="0"
                inputMode="numeric"
                value={line.userOverride ?? ''}
                onChange={(e) => onEdit(line.id, e.target.value)}
                aria-label={`${line.label} cost in USD`}
                placeholder={line.systemBaseline !== null ? String(line.systemBaseline) : '0'}
              />
            </div>
          </div>
        ))}
        {lines.length === 0 && <p className="py-4 text-sm text-muted">No categories in this group.</p>}
      </div>
    </section>
  )
}

function BenchmarkModal({ line, destination, source, onClose }: { line: BudgetLine; destination: string | null; source: string | null; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const hasBaseline = line.systemBaseline !== null

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-navy/40 p-4" role="dialog" aria-modal="true" aria-label={`${line.label} benchmarks`} onClick={onClose}>
      <div className="card-surface w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-navy">{line.label} · local benchmark</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-8 place-items-center rounded-full text-muted hover:bg-canvas hover:text-navy"><X size={16} /></button>
        </div>

        {hasBaseline ? (
          <>
            <p className="mt-4 text-3xl font-bold text-navy">${formatAmount(line.systemBaseline as number)}<span className="ml-1 text-sm font-semibold text-muted">{line.chronologicalStage === 'ONE_TIME' ? 'one-time' : '/ month'}</span></p>
            <p className="mt-1 text-xs text-muted">Typical baseline{destination ? ` for ${destination}` : ''} at your selected tier. Adjust the field to your own figure.</p>
            {source && <p className="mt-3 rounded-[var(--radius-field)] bg-canvas p-3 text-[11px] leading-5 text-muted"><span className="font-bold text-navy">Source: </span>{source}</p>}
          </>
        ) : (
          <p className="mt-4 text-sm text-muted">
            A sourced benchmark{destination ? ` for ${destination}` : ''} isn&rsquo;t available for this category yet. Research real figures and enter your own estimate.
          </p>
        )}

        <div className="mt-4 grid gap-2">
          <Link href="/cost-calculator" className="rounded-[var(--radius-btn)] border border-line-strong bg-white px-3.5 py-2.5 text-center text-xs font-bold text-navy hover:bg-canvas">Open Cost Calculator</Link>
          <Link href="/greenbook" className="rounded-[var(--radius-btn)] border border-line-strong bg-white px-3.5 py-2.5 text-center text-xs font-bold text-navy hover:bg-canvas">Research in Greenbook</Link>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <section className="card-surface min-h-32 p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-navy">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </section>
  )
}

function ContextRow({ label, value }: { label: string; value: string | null }) {
  return <div className="flex items-center justify-between gap-3"><dt className="text-muted">{label}</dt><dd className={`font-bold ${value ? 'text-navy' : 'text-muted'}`}>{value ?? 'Not set'}</dd></div>
}

function OutlookRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3"><dt className="text-white/65">{label}</dt><dd className="font-bold text-white">{value}</dd></div>
}

function getVerdict(income: number | null, monthly: number | null): { label: string; detail: string } {
  if (income === null) return { label: 'Income not set', detail: 'Add monthly income in your Kolmari Profile to compare it with this plan.' }
  if (monthly === null) return { label: 'Monthly plan incomplete', detail: 'Add at least one ongoing cost to calculate the current outlook.' }
  const remaining = income - monthly
  if (remaining < 0) return { label: 'Budget gap', detail: 'The current monthly plan is higher than the income in your Kolmari Profile.' }
  if (remaining < monthly * 0.1) return { label: 'Limited cushion', detail: 'The plan fits the entered income, but leaves little room for changing costs.' }
  return { label: 'Appears manageable', detail: 'The stored income is above the current monthly plan. Verify every baseline before deciding.' }
}
