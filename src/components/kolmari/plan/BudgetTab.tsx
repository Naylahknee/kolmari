'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { BarChart3 } from 'lucide-react'
import {
  applyBudgetBenchmark,
  benchmarkCategoryTotal,
  getBudgetBenchmark,
  type BudgetBenchmark,
} from '@/lib/budget-benchmarks'
import { budgetEffective, formatAmount, formatMonthYear, type BudgetLine, type BudgetStage } from '@/lib/plan-types'
import { BudgetBenchmarkDialog } from '../budget-benchmark-dialog'
import { SaveChip, type PlanCtx } from './shared'

function stageTotal(lines: BudgetLine[], stage: BudgetStage): number | null {
  const values = lines
    .filter((line) => line.chronologicalStage === stage)
    .map(budgetEffective)
    .filter((value): value is number => value !== null)
  return values.length ? values.reduce((sum, value) => sum + value, 0) : null
}

export function BudgetTab({ ctx }: { ctx: PlanCtx }) {
  const { plan, update, saveStatus, retry, monthlyIncome } = ctx
  const benchmark = getBudgetBenchmark(plan.saved_nextination, plan.household_members)
  const calculatedBudget = useMemo(() => applyBudgetBenchmark(plan.budget, benchmark), [plan.budget, benchmark])
  const monthly = stageTotal(calculatedBudget, 'MONTHLY_RECURRING')
  const upfront = stageTotal(calculatedBudget, 'ONE_TIME')
  const customized = plan.budget.filter((line) => line.isCustom).length
  const eyebrow = [plan.saved_nextination, plan.household_members ? `Household of ${plan.household_members}` : null].filter(Boolean).join(' · ')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const oneTime = calculatedBudget.filter((line) => line.chronologicalStage === 'ONE_TIME')
  const recurring = calculatedBudget.filter((line) => line.chronologicalStage === 'MONTHLY_RECURRING')
  const verdict = getVerdict(monthlyIncome, monthly)
  const remaining = monthlyIncome === null || monthly === null ? null : monthlyIncome - monthly

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

  function saveDetails(category: string, details: Record<string, number>) {
    const total = Object.values(details).reduce((sum, value) => sum + value, 0)
    const benchmarkLine = benchmark?.categories.find((item) => item.category === category)
    update('budget', plan.budget.map((line) => line.category === category ? {
      ...line,
      systemBaseline: benchmarkLine ? benchmarkCategoryTotal(benchmarkLine) : line.systemBaseline,
      systemBaselineKey: benchmark?.key ?? line.systemBaselineKey,
      userOverride: total,
      isCustom: true,
      detailOverrides: details,
    } : line))
  }

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
            benchmark={benchmark}
            onEdit={setOverride}
            onOpenBenchmark={setActiveCategory}
          />
          <BudgetGroup
            title="Ongoing monthly costs"
            hint="Housing, food, transport, healthcare, and other recurring costs."
            lines={recurring}
            benchmark={benchmark}
            onEdit={setOverride}
            onOpenBenchmark={setActiveCategory}
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
          </section>

          <section className="card-surface p-5">
            <p className="text-base font-bold text-navy">Assumptions log</p>
            {benchmark ? (
              <>
                <p className="mt-1 text-xs text-muted">{benchmark.sourceLabel} · Reviewed {benchmark.lastReviewed}</p>
                <ul className="mt-3 space-y-2 text-xs leading-5 text-muted">
                  {benchmark.assumptions.map((assumption) => <li key={assumption}>• {assumption}</li>)}
                </ul>
              </>
            ) : (
              <p className="mt-2 text-sm leading-6 text-muted">No system assumptions are being applied. Totals come from your entries.</p>
            )}
          </section>

          <section className="rounded-[var(--radius-card)] border border-teal/25 bg-teal-soft p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-teal-deep">Reality check</p>
            <p className="mt-3 text-sm font-semibold text-navy">Compare this estimate with local housing and healthcare research before deciding.</p>
            <Link href="/greenbook" className="mt-3 inline-flex min-h-9 items-center rounded-[var(--radius-btn)] border border-teal/40 bg-white px-3.5 text-xs font-bold text-teal-deep hover:bg-teal-soft">Review Greenbook costs</Link>
          </section>
        </aside>
      </div>

      {benchmark && activeCategory && (
        <BudgetBenchmarkDialog
          benchmark={benchmark}
          lines={calculatedBudget}
          initialCategory={activeCategory}
          onClose={() => setActiveCategory(null)}
          onSave={saveDetails}
        />
      )}
    </div>
  )
}

function BudgetGroup({
  title,
  hint,
  lines,
  benchmark,
  onEdit,
  onOpenBenchmark,
}: {
  title: string
  hint: string
  lines: BudgetLine[]
  benchmark: BudgetBenchmark | null
  onEdit: (id: string, raw: string) => void
  onOpenBenchmark: (category: string) => void
}) {
  const total = lines.map(budgetEffective).filter((value): value is number => value !== null).reduce((sum, value) => sum + value, 0)
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
        {lines.map((line) => {
          const hasBenchmark = benchmark?.categories.some((category) => category.category === line.category)
          return (
            <div key={line.id} className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_150px] sm:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-navy">{line.label}</p>
                  {line.isCustom && <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[10px] font-bold text-gold-deep">Custom</span>}
                </div>
                <p className="mt-1 text-xs text-muted">
                  {line.isCustom ? 'Using your planning value.' : line.systemBaseline !== null ? 'Using the local planning baseline.' : 'Enter your own researched amount.'}
                </p>
                {hasBenchmark ? (
                  <button type="button" onClick={() => onOpenBenchmark(line.category)} className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-gold-deep hover:underline">
                    <BarChart3 size={14} aria-hidden="true" /> View local benchmarks
                  </button>
                ) : (
                  <span className="mt-2 inline-flex text-xs font-semibold text-muted">Local benchmark unavailable</span>
                )}
              </div>
              <span className="relative block">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted" aria-hidden="true">$</span>
                <input
                  className={`field h-11 w-full pl-7 text-right font-semibold placeholder:italic ${line.isCustom ? '!border-gold !bg-gold-soft/30' : 'placeholder:text-muted'}`}
                  type="number"
                  min="0"
                  max="100000000"
                  inputMode="decimal"
                  value={line.userOverride ?? ''}
                  onChange={(event) => onEdit(line.id, event.target.value)}
                  aria-label={`${line.label} cost in USD`}
                  placeholder={line.systemBaseline !== null ? String(line.systemBaseline) : 'Enter amount'}
                />
              </span>
            </div>
          )
        })}
        {lines.length === 0 && <p className="py-4 text-sm text-muted">No categories in this group.</p>}
      </div>
    </section>
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
