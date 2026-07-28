'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Calculator, Download, LoaderCircle, RefreshCcw, Save } from 'lucide-react'
import { BudgetDonut, BUDGET_COLORS, type BudgetSlice } from './rings'

type Budget = {
  housing: number | null
  food: number | null
  transport: number | null
  healthcare: number | null
  other: number | null
}

const BLANK_BUDGET: Budget = { housing: null, food: null, transport: null, healthcare: null, other: null }

const BUDGET_LABELS: Record<keyof Budget, string> = {
  housing: 'Housing',
  food: 'Food',
  transport: 'Transport',
  healthcare: 'Healthcare',
  other: 'Other',
}

function parseMoney(value: string, maximum: number) {
  if (value === '') return null
  const amount = Number(value)
  if (!Number.isFinite(amount)) return null
  return Math.min(maximum, Math.max(0, amount))
}

function MoneyInput({
  label,
  value,
  maximum,
  step = 1,
  prominent = false,
  onChange,
}: {
  label: string
  value: number | null
  maximum: number
  step?: number
  prominent?: boolean
  onChange: (value: number | null) => void
}) {
  return (
    <span className="relative block">
      <span className="pointer-events-none absolute inset-y-0 left-4 z-10 flex items-center font-semibold text-muted" aria-hidden="true">$</span>
      <input
        aria-label={label}
        className={`field placeholder:text-muted-soft ${prominent ? '!h-12 text-xl font-bold' : '!h-11'}`}
        style={{ paddingLeft: '2.25rem' }}
        type="number"
        inputMode="decimal"
        min="0"
        max={maximum}
        step={step}
        value={value ?? ''}
        placeholder="0"
        onChange={(event) => onChange(parseMoney(event.target.value, maximum))}
      />
    </span>
  )
}

export function CostCalculator({
  income,
  profileComplete,
}: {
  income: number | null
  profileComplete: boolean
}) {
  const [monthlyIncome, setMonthlyIncome] = useState<number | null>(income)
  const [budget, setBudget] = useState<Budget>(BLANK_BUDGET)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const amounts = Object.values(budget).filter((v): v is number => v !== null)
  const total = amounts.reduce((sum, v) => sum + v, 0)
  const remaining = monthlyIncome === null || !amounts.length ? null : monthlyIncome - total

  const slices: BudgetSlice[] = (Object.keys(BUDGET_LABELS) as (keyof Budget)[])
    .map((key, index) => ({
      label: BUDGET_LABELS[key],
      amount: budget[key] ?? 0,
      color: BUDGET_COLORS[index % BUDGET_COLORS.length],
    }))
    .filter((slice) => slice.amount > 0)

  function reset() {
    setMonthlyIncome(income)
    setBudget(BLANK_BUDGET)
    setMessage('Calculator cleared.')
  }

  async function saveIncome() {
    if (monthlyIncome === null || !profileComplete) return
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthly_income: monthlyIncome }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error ?? 'Unable to save your income.')
      setMessage('Monthly income saved to your Kolmari Profile.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to save your income.')
    } finally {
      setSaving(false)
    }
  }

  function download() {
    if (monthlyIncome === null && !amounts.length) return
    const lines = [
      'Kolmari monthly cost research',
      `Monthly income,${monthlyIncome ?? ''}`,
      ...Object.entries(budget).map(([key, val]) => `${key},${val ?? ''}`),
      `Total entered expenses,${total}`,
      `Remaining,${remaining ?? ''}`,
    ]
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'kolmari-cost-research.csv'
    a.click()
    URL.revokeObjectURL(url)
    setMessage('Cost research exported.')
  }

  const hasGap = remaining !== null && remaining < 0

  return (
    <div className="mx-auto max-w-[1280px] space-y-6 pb-2">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Planning tool</p>
          <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-navy sm:text-4xl">Cost Calculator</h1>
          <p className="mt-1 text-sm text-muted">Enter your own figures. Kolmari does not preload a sample budget.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-btn)] border border-line bg-white px-4 text-sm font-semibold text-navy hover:bg-canvas"
          >
            <RefreshCcw size={15} aria-hidden="true" /> Clear
          </button>
          <button
            type="button"
            onClick={download}
            disabled={monthlyIncome === null && !amounts.length}
            className="gold-button !h-10"
          >
            <Download size={15} aria-hidden="true" /> Export
          </button>
        </div>
      </div>

      {/* Profile incomplete notice */}
      {!profileComplete && (
        <div className="rounded-[var(--radius-card)] border border-gold/30 bg-gold-soft/50 p-5">
          <p className="font-semibold text-navy">Complete your Kolmari Profile to save personalized cost inputs.</p>
          <p className="mt-1 text-sm text-muted">You may still use this calculator for unsaved general research.</p>
          <Link href="/profile-wizard" className="mt-2 inline-flex text-sm font-bold text-gold-deep hover:underline">
            Start Wizard
          </Link>
        </div>
      )}

      {/* ── Summary (visible first per calculator tool template) ────────── */}
      <div className="grid overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-card sm:grid-cols-2 xl:grid-cols-3">
        {/* Income */}
        <section className="min-h-36 border-b border-line p-5 sm:border-r xl:border-b-0" aria-labelledby="income-heading">
          <h2 id="income-heading" className="text-xs font-bold uppercase tracking-widest text-muted">Monthly income</h2>
          <div className="mt-3">
            <MoneyInput
              label="Monthly income"
              value={monthlyIncome}
              maximum={1_000_000}
              step={100}
              prominent
              onChange={setMonthlyIncome}
            />
          </div>
          {profileComplete && (
            <button
              type="button"
              onClick={saveIncome}
              disabled={saving || monthlyIncome === null}
              className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-gold-deep disabled:opacity-60"
            >
              {saving ? <LoaderCircle size={15} className="animate-spin" aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}
              {saving ? 'Saving…' : 'Save to Kolmari Profile'}
            </button>
          )}
        </section>

        {/* Total expenses */}
        <section className="min-h-36 border-b border-line p-5 xl:border-b-0 xl:border-r" aria-labelledby="total-heading">
          <h2 id="total-heading" className="text-xs font-bold uppercase tracking-widest text-muted">Entered expenses</h2>
          <p className="mt-4 text-2xl font-bold text-navy">
            {amounts.length ? `$${total.toLocaleString()}` : <span className="text-muted text-xl">Not entered</span>}
          </p>
          <p className="mt-1 text-xs text-muted">Sum of categories below</p>
        </section>

        {/* Gap / cushion */}
        <section
          className={`min-h-36 p-5 ${hasGap ? 'bg-danger text-white' : 'bg-[#1d3969] text-white'}`}
          aria-labelledby="remaining-heading"
        >
          <h2 id="remaining-heading" className="text-xs font-bold uppercase tracking-widest opacity-70">
            {hasGap ? 'Budget gap' : 'After entered expenses'}
          </h2>
          <p className="mt-4 text-2xl font-bold">
            {remaining === null
              ? <span className="text-xl opacity-70">Not calculated</span>
              : `${remaining < 0 ? '−' : ''}$${Math.abs(remaining).toLocaleString()}`}
          </p>
          {hasGap && (
            <p className="mt-1 text-xs opacity-70">Expenses exceed entered income</p>
          )}
          {remaining === null && (
            <p className="mt-1 text-xs opacity-80">Enter income and at least one expense</p>
          )}
        </section>
      </div>

      {/* ── Inputs + donut ──────────────────────────────────────────────── */}
      <div className="grid gap-5 xl:grid-cols-[1.08fr_.92fr]">

        {/* Expense inputs */}
        <section className="card-surface p-6" aria-labelledby="expenses-heading">
          <h2 id="expenses-heading" className="font-semibold text-navy">Monthly expenses</h2>
          <p className="mt-1 text-sm text-muted">Enter your own research figures. Leave a category blank if it does not apply.</p>
          <div className="mt-5 divide-y divide-line">
            {(Object.keys(budget) as (keyof Budget)[]).map((key) => (
              <label key={key} className="grid gap-3 py-3 sm:grid-cols-[1fr_140px] sm:items-center">
                <span>
                  <span className="block text-sm font-semibold capitalize text-navy">{key}</span>
                  <span className="mt-2 block h-1 overflow-hidden rounded-full bg-canvas">
                    <span
                      className="block h-full rounded-full bg-gold transition-[width]"
                      style={{ width: total > 0 ? `${Math.min(100, ((budget[key] ?? 0) / total) * 100)}%` : '0%' }}
                    />
                  </span>
                </span>
                <MoneyInput
                  label={`${BUDGET_LABELS[key]} expense`}
                  value={budget[key]}
                  maximum={100_000}
                  onChange={(value) => setBudget((current) => ({ ...current, [key]: value }))}
                />
              </label>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-line pt-4 text-sm font-bold text-navy">
            <span>Total</span>
            <span>{amounts.length ? `$${total.toLocaleString()}` : '–'}</span>
          </div>
        </section>

        {/* Donut chart */}
        {slices.length > 0 ? (
          <section className="card-surface p-6" aria-labelledby="snapshot-heading">
            <h2 id="snapshot-heading" className="text-xs font-bold uppercase tracking-widest text-gold-deep">Cost Snapshot</h2>
            <p className="mt-1 font-semibold text-navy">Monthly breakdown</p>
            <div className="mt-5">
              <BudgetDonut slices={slices} total={total} />
            </div>
          </section>
        ) : (
          <section className="card-surface flex min-h-[420px] flex-col p-6" aria-label="Cost snapshot">
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Cost Snapshot</p>
              <p className="mt-1 font-semibold text-navy">Monthly breakdown</p>
            </div>
            <div className="flex flex-1 items-center justify-center text-center">
            <div>
              <Calculator size={28} className="mx-auto text-gold-deep" aria-hidden="true" />
              <p className="mt-3 font-semibold text-navy">No entries yet</p>
              <p className="mx-auto mt-1 max-w-52 text-sm leading-5 text-muted">Add one expense to see the breakdown. It updates as you go, so you do not need every category.</p>
            </div>
            </div>
          </section>
        )}
      </div>

      {/* Methodology note */}
      <p className="text-xs text-muted" aria-label="Methodology">
        Figures are your own planning estimates. Kolmari does not verify them and they are not official cost data.
      </p>

      {/* Status message */}
      {message && (
        <p role="status" className="text-sm font-semibold text-muted">{message}</p>
      )}
    </div>
  )
}
