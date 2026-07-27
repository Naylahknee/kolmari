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
    a.download = 'nexit-cost-research.csv'
    a.click()
    URL.revokeObjectURL(url)
    setMessage('Cost research exported.')
  }

  const hasGap = remaining !== null && remaining < 0

  return (
    <div className="space-y-6">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Planning tool</p>
          <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">Cost Calculator</h1>
          <p className="mt-1 text-sm text-muted">Enter your own figures. Nexit does not preload a sample budget.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-btn)] border border-line bg-white px-4 text-sm font-semibold text-navy hover:bg-canvas"
          >
            <RefreshCcw size={15} aria-hidden="true" /> Clear
          </button>
          <button
            type="button"
            onClick={download}
            disabled={monthlyIncome === null && !amounts.length}
            className="gold-button !min-h-11"
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
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {/* Income */}
        <section className="card-surface p-6" aria-labelledby="income-heading">
          <h2 id="income-heading" className="text-xs font-bold uppercase tracking-widest text-muted">Monthly income</h2>
          <div className="relative mt-3">
            <span className="absolute inset-y-0 left-4 flex items-center text-muted" aria-hidden="true">$</span>
            <input
              aria-label="Monthly income"
              className="field pl-8 text-xl font-bold"
              type="number"
              min="0"
              max="1000000"
              step="100"
              value={monthlyIncome ?? ''}
              placeholder="Not entered"
              onChange={(e) => setMonthlyIncome(e.target.value ? Math.max(0, Number(e.target.value)) : null)}
            />
          </div>
          {profileComplete && (
            <button
              type="button"
              onClick={saveIncome}
              disabled={saving || monthlyIncome === null}
              className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-[var(--radius-btn)] bg-navy px-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? <LoaderCircle size={15} className="animate-spin" aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}
              {saving ? 'Saving…' : 'Save to Nexit Profile'}
            </button>
          )}
        </section>

        {/* Total expenses */}
        <section className="card-surface p-6" aria-labelledby="total-heading">
          <h2 id="total-heading" className="text-xs font-bold uppercase tracking-widest text-muted">Entered expenses</h2>
          <p className="mt-3 text-3xl font-bold text-navy">
            {amounts.length ? `$${total.toLocaleString()}` : <span className="text-muted text-xl">Not entered</span>}
          </p>
          <p className="mt-1 text-xs text-muted">Sum of categories below</p>
        </section>

        {/* Gap / cushion */}
        <section
          className={`rounded-[var(--radius-card)] p-6 ${hasGap ? 'bg-danger text-white' : 'bg-navy text-white'}`}
          aria-labelledby="remaining-heading"
        >
          <h2 id="remaining-heading" className="text-xs font-bold uppercase tracking-widest opacity-70">
            {hasGap ? 'Budget gap' : 'After entered expenses'}
          </h2>
          <p className="mt-3 text-3xl font-bold">
            {remaining === null
              ? <span className="text-xl opacity-70">Not calculated</span>
              : `${remaining < 0 ? '−' : ''}$${Math.abs(remaining).toLocaleString()}`}
          </p>
          {hasGap && (
            <p className="mt-1 text-xs opacity-70">Expenses exceed entered income</p>
          )}
        </section>
      </div>

      {/* ── Inputs + donut ──────────────────────────────────────────────── */}
      <div className="grid gap-5 xl:grid-cols-[1fr_.7fr]">

        {/* Expense inputs */}
        <section className="card-surface p-6" aria-labelledby="expenses-heading">
          <h2 id="expenses-heading" className="font-semibold text-navy">Monthly expenses</h2>
          <p className="mt-1 text-sm text-muted">Enter your own research figures. Leave a category blank if it does not apply.</p>
          <div className="mt-6 space-y-4">
            {(Object.keys(budget) as (keyof Budget)[]).map((key) => (
              <label key={key} className="grid gap-1.5 sm:grid-cols-[1fr_180px] sm:items-center">
                <span className="text-sm font-semibold capitalize text-navy">{key}</span>
                <span className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-muted" aria-hidden="true">$</span>
                  <input
                    aria-label={`${key} expense`}
                    className="field pl-8"
                    type="number"
                    min="0"
                    max="100000"
                    value={budget[key] ?? ''}
                    placeholder="Not entered"
                    onChange={(e) => setBudget({ ...budget, [key]: e.target.value ? Math.max(0, Number(e.target.value)) : null })}
                  />
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Donut chart */}
        {slices.length > 0 ? (
          <section className="card-surface p-6" aria-labelledby="snapshot-heading">
            <h2 id="snapshot-heading" className="text-xs font-bold uppercase tracking-widest text-gold-deep">Nexit Cost Snapshot</h2>
            <p className="mt-1 font-semibold text-navy">Monthly breakdown</p>
            <div className="mt-5">
              <BudgetDonut slices={slices} total={total} />
            </div>
          </section>
        ) : (
          <section className="card-surface flex items-center justify-center p-6 text-center" aria-label="Cost snapshot">
            <div>
              <Calculator size={28} className="mx-auto text-gold-deep" aria-hidden="true" />
              <p className="mt-3 font-semibold text-navy">No entries yet</p>
              <p className="mt-1 text-sm text-muted">Add expenses to see your monthly breakdown.</p>
            </div>
          </section>
        )}
      </div>

      {/* Methodology note */}
      <section className="rounded-[var(--radius-card)] border border-line bg-canvas p-5 text-sm text-muted" aria-label="Methodology">
        <p className="font-semibold text-navy">Research notes</p>
        <p className="mt-1 leading-6">
          All figures are your own research estimates. Nexit does not preload any sample budget, average cost, or typical-spend assumption. Verify costs directly through official sources and local contacts before making financial decisions.
        </p>
      </section>

      {/* Status message */}
      {message && (
        <p role="status" className="text-sm font-semibold text-muted">{message}</p>
      )}
    </div>
  )
}
