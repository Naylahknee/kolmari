'use client'

import Link from 'next/link'
import { BUDGET_KEYS, BUDGET_META, budgetEnteredCount, budgetTotal, formatAmount, formatMonthYear } from '@/lib/plan-types'
import { ProgressBar, SaveChip, type PlanCtx } from './shared'

export function BudgetTab({ ctx }: { ctx: PlanCtx }) {
  const { plan, update, saveStatus, retry } = ctx
  const total = budgetTotal(plan)
  const entered = budgetEnteredCount(plan)
  const healthPct = Math.round((entered / BUDGET_KEYS.length) * 100)
  const eyebrow = [plan.saved_nextination, plan.household_members ? `Household of ${plan.household_members}` : null].filter(Boolean).join(' · ')

  function setValue(key: (typeof BUDGET_KEYS)[number], raw: string) {
    const num = raw === '' ? null : Math.max(0, Math.min(100_000_000, Math.round(Number(raw))))
    update('budget', { ...plan.budget, [key]: Number.isNaN(num as number) ? null : num })
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-start justify-between gap-4 rounded-[18px] border border-[#D8D9DC] bg-[#F3F3F4] p-5 sm:p-6">
        <div>
          {eyebrow && <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{eyebrow}</p>}
          <h2 className="mt-1 text-xl font-bold text-navy">Move budget</h2>
          <p className="mt-1 text-sm text-muted">Build a realistic monthly estimate using your own planning figures.</p>
        </div>
        <SaveChip status={saveStatus} onRetry={retry} />
      </section>

      <div className="grid gap-5 sm:grid-cols-3">
        <Stat label="Estimated monthly budget" value={total === null ? 'Not set' : `$${formatAmount(total)}`} />
        <Stat label="Categories entered" value={`${entered} of ${BUDGET_KEYS.length}`} />
        <Stat label="Currency" value="USD" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.85fr)_minmax(260px,.85fr)]">
        <section className="rounded-[18px] border border-[#D8D9DC] bg-[#F3F3F4] p-5" aria-label="Monthly budget categories">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-navy">Monthly categories</h3>
              <p className="mt-0.5 text-xs text-muted">Update the numbers below to test your plan.</p>
            </div>
            <Link href="/cost-calculator" className="shrink-0 rounded-[var(--radius-btn)] border border-line px-3.5 py-2 text-xs font-bold text-navy hover:bg-canvas">Open Cost Calculator</Link>
          </div>
          <div className="mt-4 divide-y divide-line">
            {BUDGET_KEYS.map((key) => (
              <div key={key} className="flex items-center justify-between gap-4 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-navy">{BUDGET_META[key].label}</p>
                  <p className="text-xs text-muted">{BUDGET_META[key].hint}</p>
                </div>
                <div className="relative shrink-0">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted" aria-hidden="true">$</span>
                  <input
                    className="field h-11 w-32 pl-7 text-right font-semibold"
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={plan.budget[key] ?? ''}
                    onChange={(e) => setValue(key, e.target.value)}
                    aria-label={`${BUDGET_META[key].label} monthly cost in USD`}
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-[18px] border border-[#D8D9DC] bg-[#F3F3F4] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Budget health</p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-sm font-bold text-navy">{entered} categor{entered === 1 ? 'y' : 'ies'} entered</span>
              <span className="text-xs font-bold text-muted">{healthPct}%</span>
            </div>
            <ProgressBar value={healthPct} className="mt-3" />
            <p className="mt-3 text-xs text-muted">A complete estimate makes move readiness more accurate.</p>
          </section>

          <section className="rounded-[18px] border border-[#D8D9DC] bg-[#F3F3F4] p-5">
            <p className="text-base font-bold text-navy">Plan context</p>
            <p className="mt-0.5 text-xs text-muted">The assumptions behind this budget.</p>
            <dl className="mt-3 space-y-2 text-sm">
              <ContextRow label="Destination" value={plan.saved_nextination} />
              <ContextRow label="Household" value={plan.household_members ? `${plan.household_members} people` : null} />
              <ContextRow label="Target move" value={formatMonthYear(plan.target_move_date) || null} />
            </dl>
          </section>

          <section className="rounded-[18px] border border-[#D8D9DC] bg-[#F3F3F4] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Reality check</p>
            <p className="mt-3 text-sm font-semibold text-navy">Compare this estimate with local cost research.</p>
            <Link href="/greenbook" className="mt-3 inline-flex rounded-[11px] border border-[#D8D9DC] bg-white px-3.5 py-2 text-xs font-bold text-navy hover:bg-[#F8F8F8]">Review Greenbook costs</Link>
          </section>
        </aside>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-h-32 rounded-[18px] border border-[#D8D9DC] bg-[#F3F3F4] p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-navy">{value}</p>
    </div>
  )
}

function ContextRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className={`font-bold ${value ? 'text-navy' : 'text-muted'}`}>{value ?? 'Not set'}</dd>
    </div>
  )
}
