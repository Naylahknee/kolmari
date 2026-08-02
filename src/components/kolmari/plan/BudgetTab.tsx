'use client'

import Link from 'next/link'
import {
  budgetCustomizedCount, budgetEffective, formatAmount, formatMonthYear,
  monthlyTotal, upfrontTotal, type BudgetLine,
} from '@/lib/plan-types'
import { SaveChip, type PlanCtx } from './shared'

export function BudgetTab({ ctx }: { ctx: PlanCtx }) {
  const { plan, update, saveStatus, retry } = ctx
  const monthly = monthlyTotal(plan)
  const upfront = upfrontTotal(plan)
  const customized = budgetCustomizedCount(plan)
  const eyebrow = [plan.saved_nextination, plan.household_members ? `Household of ${plan.household_members}` : null].filter(Boolean).join(' · ')

  function setOverride(id: string, raw: string) {
    const parsed = raw === '' ? null : Math.max(0, Math.min(100_000_000, Math.round(Number(raw))))
    const value = raw !== '' && Number.isNaN(parsed as number) ? null : parsed
    update('budget', plan.budget.map((line) => (
      line.id === id ? { ...line, userOverride: value, isCustom: value !== null } : line
    )))
  }

  const oneTime = plan.budget.filter((l) => l.chronologicalStage === 'ONE_TIME')
  const recurring = plan.budget.filter((l) => l.chronologicalStage === 'MONTHLY_RECURRING')

  return (
    <div className="space-y-6">
      <section className="card-surface flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6">
        <div>
          {eyebrow && <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{eyebrow}</p>}
          <h2 className="mt-1 text-xl font-bold text-navy">Move budget</h2>
          <p className="mt-1 text-sm text-muted">Split your plan into upfront arrival costs and ongoing monthly run-rate.</p>
        </div>
        <SaveChip status={saveStatus} onRetry={retry} />
      </section>

      <div className="grid gap-5 sm:grid-cols-3">
        <Stat label="Upfront move capital" value={upfront === null ? 'Not set' : `$${formatAmount(upfront)}`} hint="One-time arrival costs" />
        <Stat label="Monthly run-rate" value={monthly === null ? 'Not set' : `$${formatAmount(monthly)}`} hint="Ongoing living expenses" />
        <Stat label="Customized" value={`${customized} of ${plan.budget.length}`} hint="Categories you've adjusted" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.85fr)_minmax(260px,.85fr)]">
        <div className="space-y-5">
          <BudgetGroup title="One-time upfront arrival costs" hint="Visas, flights, deposits, and logistics." lines={oneTime} onEdit={setOverride} />
          <BudgetGroup title="Ongoing monthly run-rate" hint="Rent, food, transport, and recurring bills." lines={recurring} onEdit={setOverride} />
          <Link href="/cost-calculator" className="inline-flex min-h-9 items-center rounded-[var(--radius-btn)] border border-line px-3.5 text-xs font-bold text-navy hover:bg-canvas">Open Cost Calculator</Link>
        </div>

        <aside className="space-y-5">
          <section className="card-surface p-5">
            <p className="text-base font-bold text-navy">Plan context</p>
            <p className="mt-0.5 text-xs text-muted">The assumptions behind this budget.</p>
            <dl className="mt-3 space-y-2 text-sm">
              <ContextRow label="Destination" value={plan.saved_nextination} />
              <ContextRow label="City" value={plan.destination_city} />
              <ContextRow label="Household" value={plan.household_members ? `${plan.household_members} people` : null} />
              <ContextRow label="Target move" value={formatMonthYear(plan.target_move_date) || null} />
            </dl>
          </section>

          <section className="rounded-[var(--radius-card)] border border-teal/25 bg-teal-soft p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-teal-deep">Reality check</p>
            <p className="mt-3 text-sm font-semibold text-navy">Compare this estimate with local housing and healthcare research before deciding.</p>
            <Link href="/greenbook" className="mt-3 inline-flex min-h-9 items-center rounded-[var(--radius-btn)] border border-teal/40 bg-white px-3.5 text-xs font-bold text-teal-deep hover:bg-teal-soft">Review Greenbook costs</Link>
          </section>
        </aside>
      </div>
    </div>
  )
}

function BudgetGroup({ title, hint, lines, onEdit }: { title: string; hint: string; lines: BudgetLine[]; onEdit: (id: string, raw: string) => void }) {
  const total = lines.map(budgetEffective).filter((v): v is number => v !== null).reduce((a, b) => a + b, 0)
  return (
    <section className="card-surface p-5" aria-label={title}>
      <div className="flex items-center justify-between gap-3">
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
            </div>
            <div className="relative shrink-0">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted" aria-hidden="true">$</span>
              <input
                className="field h-11 w-32 pl-7 text-right font-semibold"
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

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="card-surface min-h-32 p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-navy">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
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
