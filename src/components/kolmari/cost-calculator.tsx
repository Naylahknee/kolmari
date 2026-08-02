'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { BarChart3, Download, LoaderCircle, RefreshCcw, Save } from 'lucide-react'
import {
  applyBudgetBenchmark,
  benchmarkCategoryTotal,
  getBudgetBenchmark,
  type BudgetBenchmark,
} from '@/lib/budget-benchmarks'
import {
  budgetEffective,
  formatAmount,
  type BudgetLine,
  type BudgetStage,
  type NexitPlan,
} from '@/lib/plan-types'
import { BudgetBenchmarkDialog } from './budget-benchmark-dialog'
import { BudgetDonut, BUDGET_COLORS, type BudgetSlice } from './rings'

function parseMoney(value: string, maximum = 100_000_000): number | null {
  if (value === '') return null
  const amount = Number(value)
  if (!Number.isFinite(amount)) return null
  return Math.min(maximum, Math.max(0, Math.round(amount)))
}

function stageTotal(lines: BudgetLine[], stage: BudgetStage): number | null {
  const amounts = lines
    .filter((line) => line.chronologicalStage === stage)
    .map(budgetEffective)
    .filter((value): value is number => value !== null)
  return amounts.length ? amounts.reduce((sum, value) => sum + value, 0) : null
}

export function CostCalculator({
  initialPlan,
  income,
  profileComplete,
  profileHousehold,
}: {
  initialPlan: NexitPlan
  income: number | null
  profileComplete: boolean
  profileHousehold: number | null
}) {
  const household = initialPlan.household_members ?? profileHousehold
  const benchmark = getBudgetBenchmark(initialPlan.saved_nextination, household)
  const [monthlyIncome, setMonthlyIncome] = useState<number | null>(income)
  const [budget, setBudget] = useState<BudgetLine[]>(initialPlan.budget)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [saving, setSaving] = useState<'idle' | 'income' | 'budget'>('idle')
  const [message, setMessage] = useState('')

  const calculatedBudget = useMemo(() => applyBudgetBenchmark(budget, benchmark), [budget, benchmark])
  const oneTime = calculatedBudget.filter((line) => line.chronologicalStage === 'ONE_TIME')
  const recurring = calculatedBudget.filter((line) => line.chronologicalStage === 'MONTHLY_RECURRING')
  const upfront = stageTotal(calculatedBudget, 'ONE_TIME')
  const monthly = stageTotal(calculatedBudget, 'MONTHLY_RECURRING')
  const customized = budget.filter((line) => line.isCustom).length
  const remaining = monthlyIncome === null || monthly === null ? null : monthlyIncome - monthly
  const verdict = getVerdict(monthlyIncome, monthly)

  const slices: BudgetSlice[] = recurring
    .map((line, index) => ({
      label: line.label,
      amount: budgetEffective(line) ?? 0,
      color: BUDGET_COLORS[index % BUDGET_COLORS.length],
    }))
    .filter((slice) => slice.amount > 0)

  function updateLine(id: string, raw: string) {
    const value = parseMoney(raw)
    setBudget((current) => current.map((line) => line.id === id ? {
      ...line,
      userOverride: value,
      isCustom: value !== null,
      detailOverrides: null,
    } : line))
  }

  function saveDetails(category: string, details: Record<string, number>) {
    const total = Object.values(details).reduce((sum, value) => sum + value, 0)
    const baselineCategory = benchmark?.categories.find((item) => item.category === category)
    setBudget((current) => current.map((line) => line.category === category ? {
      ...line,
      systemBaseline: baselineCategory ? benchmarkCategoryTotal(baselineCategory) : line.systemBaseline,
      systemBaselineKey: benchmark?.key ?? line.systemBaselineKey,
      userOverride: total,
      isCustom: true,
      detailOverrides: details,
    } : line))
    setMessage(`${baselineCategory?.label ?? category} updated. Save to sync it with My Plan.`)
  }

  function resetCustomValues() {
    setBudget((current) => current.map((line) => ({
      ...line,
      userOverride: null,
      isCustom: false,
      detailOverrides: null,
    })))
    setMessage(benchmark ? 'Custom values cleared. Local planning baselines remain.' : 'Entered values cleared.')
  }

  async function saveIncome() {
    if (monthlyIncome === null || !profileComplete) return
    setSaving('income')
    setMessage('')
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthly_income: monthlyIncome }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Unable to save your income.')
      setMessage('Monthly income saved to your Kolmari Profile.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save your income.')
    } finally {
      setSaving('idle')
    }
  }

  async function saveBudget() {
    setSaving('budget')
    setMessage('')
    try {
      const synced = applyBudgetBenchmark(budget, benchmark)
      const response = await fetch('/api/plan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget: synced }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Unable to save your budget.')
      setBudget(synced)
      setMessage('Budget saved to My Plan.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save your budget.')
    } finally {
      setSaving('idle')
    }
  }

  function download() {
    const lines = [
      'Kolmari cost plan',
      `Destination,${initialPlan.saved_nextination ?? ''}`,
      `Household members,${household ?? ''}`,
      `Monthly income,${monthlyIncome ?? ''}`,
      `Benchmark source,${benchmark?.sourceLabel ?? 'None'}`,
      'Phase,Category,Baseline,Custom,Effective',
      ...calculatedBudget.map((line) => [
        line.chronologicalStage,
        line.label,
        line.systemBaseline ?? '',
        line.userOverride ?? '',
        budgetEffective(line) ?? '',
      ].join(',')),
      `Total upfront,,,${upfront ?? ''}`,
      `Monthly run-rate,,,${monthly ?? ''}`,
      `Monthly remaining,,,${remaining ?? ''}`,
    ]
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'kolmari-cost-plan.csv'
    anchor.click()
    URL.revokeObjectURL(url)
    setMessage('Cost plan exported.')
  }

  return (
    <div className="mx-auto max-w-[1236px] space-y-6 pb-4">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Planning tool</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.02em] text-navy sm:text-4xl">Cost Calculator</h1>
          <p className="mt-1 text-sm text-muted">Start with a local planning baseline, then replace it with the numbers that fit your move.</p>
          <p className="mt-2 text-xs font-semibold text-navy">
            {initialPlan.saved_nextination ?? 'No Destination selected'}
            {household ? ` · Household of ${household}` : ' · Household not set'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={resetCustomValues} className="inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-btn)] border border-line bg-white px-4 text-sm font-bold text-navy hover:bg-canvas">
            <RefreshCcw size={15} aria-hidden="true" /> Reset custom values
          </button>
          <button type="button" onClick={download} className="inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-btn)] border border-line bg-white px-4 text-sm font-bold text-navy hover:bg-canvas">
            <Download size={15} aria-hidden="true" /> Export
          </button>
          <button type="button" onClick={saveBudget} disabled={saving !== 'idle'} className="gold-button !min-h-10 text-sm">
            {saving === 'budget' ? <LoaderCircle size={15} className="animate-spin" aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}
            {saving === 'budget' ? 'Saving…' : 'Save to My Plan'}
          </button>
        </div>
      </header>

      {!profileComplete && (
        <section className="rounded-[var(--radius-card)] border border-gold/30 bg-gold-soft/50 p-5">
          <p className="font-semibold text-navy">Complete your Kolmari Profile to save monthly income.</p>
          <p className="mt-1 text-sm text-muted">You can still research and export a cost plan without completing it.</p>
          <Link href="/profile-wizard" className="mt-2 inline-flex text-sm font-bold text-gold-deep hover:underline">Complete your Kolmari Profile</Link>
        </section>
      )}

      {!benchmark && (
        <section className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-card">
          <p className="font-semibold text-navy">No matching local baseline is available yet.</p>
          <p className="mt-1 text-sm text-muted">Portugal with a household of five is supported in this phase. Your manual entries will still calculate and save normally.</p>
        </section>
      )}

      <div className="grid gap-5 sm:grid-cols-3">
        <MetricCard label="Total upfront moving cash" value={upfront === null ? 'Not calculated' : `$${formatAmount(upfront)}`} hint="One-time arrival costs" />
        <MetricCard label="Monthly living budget" value={monthly === null ? 'Not calculated' : `$${formatAmount(monthly)}`} hint="Ongoing monthly run-rate" />
        <MetricCard label="Data verification state" value={`${customized} of ${budget.length}`} hint="Rows verified with your own values" />
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="space-y-5">
          <CostGroup
            title="One-time arrival costs"
            hint="What you may need before or during the move."
            lines={oneTime}
            benchmark={benchmark}
            onEdit={updateLine}
            onOpenBenchmark={setActiveCategory}
          />
          <CostGroup
            title="Ongoing monthly costs"
            hint="What the household expects to spend each month after arrival."
            lines={recurring}
            benchmark={benchmark}
            onEdit={updateLine}
            onOpenBenchmark={setActiveCategory}
          />
        </main>

        <aside className="space-y-5 xl:sticky xl:top-5">
          <section className="rounded-[var(--radius-card)] bg-navy-deep p-5 text-white shadow-card" aria-labelledby="outlook-heading">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold">Monthly outlook</p>
            <h2 id="outlook-heading" className="mt-2 text-xl font-bold text-white">{verdict.label}</h2>
            <p className="mt-1 text-sm leading-6 text-white/70">{verdict.detail}</p>

            <label className="mt-5 block text-xs font-bold text-white/80">
              Monthly post-tax income
              <span className="relative mt-2 block">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center font-semibold text-white/60" aria-hidden="true">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="1000000"
                  value={monthlyIncome ?? ''}
                  onChange={(event) => setMonthlyIncome(parseMoney(event.target.value, 1_000_000))}
                  placeholder="Enter income"
                  className="field !border-white/20 !bg-white !pl-7 text-navy"
                />
              </span>
            </label>
            {profileComplete && (
              <button type="button" onClick={saveIncome} disabled={saving !== 'idle' || monthlyIncome === null} className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-gold disabled:opacity-50">
                {saving === 'income' ? <LoaderCircle size={14} className="animate-spin" aria-hidden="true" /> : <Save size={14} aria-hidden="true" />}
                {saving === 'income' ? 'Saving…' : 'Save income to Profile'}
              </button>
            )}

            <dl className="mt-5 space-y-3 border-t border-white/15 pt-4 text-sm">
              <OutlookRow label="Monthly cost" value={monthly === null ? 'Not calculated' : `$${formatAmount(monthly)}`} />
              <OutlookRow label={remaining !== null && remaining < 0 ? 'Monthly gap' : 'Monthly cushion'} value={remaining === null ? 'Not calculated' : `${remaining < 0 ? '−' : ''}$${formatAmount(Math.abs(remaining))}`} />
            </dl>
          </section>

          <section className="card-surface p-5" aria-labelledby="assumptions-heading">
            <h2 id="assumptions-heading" className="text-base font-bold text-navy">Assumptions log</h2>
            {benchmark ? (
              <>
                <p className="mt-1 text-xs text-muted">{benchmark.sourceLabel} · Reviewed {benchmark.lastReviewed}</p>
                <ul className="mt-4 space-y-2 text-xs leading-5 text-muted">
                  {benchmark.assumptions.map((assumption) => <li key={assumption}>• {assumption}</li>)}
                </ul>
              </>
            ) : (
              <p className="mt-2 text-sm leading-6 text-muted">No system assumptions are being applied. Every calculated value comes from your entries.</p>
            )}
          </section>

          {slices.length > 0 && monthly !== null && (
            <section className="card-surface p-5" aria-labelledby="monthly-breakdown-heading">
              <h2 id="monthly-breakdown-heading" className="text-base font-bold text-navy">Monthly breakdown</h2>
              <div className="mt-4"><BudgetDonut slices={slices} total={monthly} size={116} /></div>
            </section>
          )}
        </aside>
      </div>

      <p className="text-xs leading-5 text-muted">Local benchmarks are planning references, not quotes or guarantees. Verify costs with current local sources before deciding.</p>
      {message && <p role="status" aria-live="polite" className="text-sm font-semibold text-navy">{message}</p>}

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

function CostGroup({
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
    <section className="card-surface p-5 sm:p-6" aria-label={title}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-navy">{title}</h2>
          <p className="mt-1 text-sm text-muted">{hint}</p>
        </div>
        <span className="shrink-0 text-base font-bold text-navy">${formatAmount(total)}</span>
      </div>
      <div className="mt-4 divide-y divide-line">
        {lines.map((line) => {
          const categoryBenchmark = benchmark?.categories.find((item) => item.category === line.category)
          return (
            <div key={line.id} className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_170px] sm:items-center">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-navy">{line.label}</p>
                  {line.isCustom && <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[10px] font-bold text-gold-deep">Custom</span>}
                </div>
                <p className="mt-1 text-xs text-muted">
                  {line.isCustom ? 'Using your verified planning value.' : line.systemBaseline !== null ? `Using ${benchmark?.destination ?? 'local'} planning baseline.` : 'Enter your own researched amount.'}
                </p>
                {categoryBenchmark ? (
                  <button type="button" onClick={() => onOpenBenchmark(line.category)} className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-gold-deep hover:underline">
                    <BarChart3 size={14} aria-hidden="true" /> View local benchmarks
                  </button>
                ) : (
                  <span className="mt-2 inline-flex text-xs font-semibold text-muted">Local benchmark unavailable</span>
                )}
              </div>
              <span className="relative block">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-semibold text-muted" aria-hidden="true">$</span>
                <input
                  type="number"
                  min="0"
                  max="100000000"
                  inputMode="decimal"
                  value={line.userOverride ?? ''}
                  placeholder={line.systemBaseline !== null ? String(line.systemBaseline) : 'Enter amount'}
                  onChange={(event) => onEdit(line.id, event.target.value)}
                  aria-label={`${line.label} cost in USD`}
                  className={`field h-11 w-full pl-7 text-right font-semibold placeholder:italic ${line.isCustom ? '!border-gold !bg-gold-soft/30' : 'placeholder:text-muted'}`}
                />
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <section className="card-surface min-h-32 p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-navy">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </section>
  )
}

function OutlookRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3"><dt className="text-white/65">{label}</dt><dd className="font-bold text-white">{value}</dd></div>
}

function getVerdict(income: number | null, monthly: number | null): { label: string; detail: string } {
  if (income === null) return { label: 'Add income to compare', detail: 'The outlook will compare monthly income with the current monthly cost plan.' }
  if (monthly === null) return { label: 'Add monthly costs', detail: 'The outlook needs at least one ongoing expense before it can compare the plan.' }
  const remaining = income - monthly
  if (remaining < 0) return { label: 'Budget gap', detail: 'The current monthly plan is higher than the income entered.' }
  if (remaining < monthly * 0.1) return { label: 'Limited cushion', detail: 'The plan fits the entered income, but leaves little room for changing costs.' }
  return { label: 'Appears manageable', detail: 'The entered income is above the current monthly plan. Verify the assumptions before deciding.' }
}
