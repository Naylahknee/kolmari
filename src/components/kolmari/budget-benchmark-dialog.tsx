'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Calculator, X } from 'lucide-react'
import {
  effectiveDetailValues,
  type BudgetBenchmark,
  type BudgetCategoryBenchmark,
} from '@/lib/budget-benchmarks'
import type { BudgetLine } from '@/lib/plan-types'

function cleanMoney(value: string): number {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return 0
  return Math.max(0, Math.min(100_000_000, Math.round(amount)))
}

export function BudgetBenchmarkDialog({
  benchmark,
  lines,
  initialCategory,
  onClose,
  onSave,
}: {
  benchmark: BudgetBenchmark
  lines: BudgetLine[]
  initialCategory: string
  onClose: () => void
  onSave: (category: string, details: Record<string, number>) => void
}) {
  const categories = benchmark.categories
  const [selectedId, setSelectedId] = useState(initialCategory)
  const [drafts, setDrafts] = useState<Record<string, Record<string, number>>>(() => (
    Object.fromEntries(categories.map((category) => {
      const line = lines.find((item) => item.category === category.category)
      return [category.category, effectiveDetailValues(line ?? fallbackLine(category), category)]
    }))
  ))
  const panelRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  const selected = categories.find((category) => category.category === selectedId) ?? categories[0]
  const selectedDraft = drafts[selected.category] ?? {}
  const total = Object.values(selectedDraft).reduce((sum, amount) => sum + amount, 0)

  const grouped = useMemo(() => ({
    oneTime: categories.filter((category) => category.stage === 'ONE_TIME'),
    monthly: categories.filter((category) => category.stage === 'MONTHLY_RECURRING'),
  }), [categories])

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => firstInputRef.current?.focus())

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      )).filter((element) => !element.hasAttribute('hidden'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus()
    }
  }, [onClose])

  function updateDetail(id: string, raw: string) {
    setDrafts((current) => ({
      ...current,
      [selected.category]: { ...current[selected.category], [id]: cleanMoney(raw) },
    }))
  }

  function selectCategory(category: BudgetCategoryBenchmark) {
    setSelectedId(category.category)
    requestAnimationFrame(() => firstInputRef.current?.focus())
  }

  return (
    <div
      className="fixed inset-0 z-[140] grid place-items-center overflow-y-auto bg-navy-deep/65 p-3 sm:p-5"
      role="presentation"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="benchmark-dialog-title"
        aria-describedby="benchmark-dialog-description"
        className="card-surface my-auto flex max-h-[min(760px,calc(100vh-2rem))] w-full max-w-4xl flex-col overflow-hidden"
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-deep">Local planning benchmarks</p>
            <h2 id="benchmark-dialog-title" className="mt-1 text-xl font-bold text-navy">
              {benchmark.destination} cost details
            </h2>
            <p id="benchmark-dialog-description" className="mt-1 text-xs text-muted">
              Household of {benchmark.householdMembers} · {benchmark.sourceLabel} · Reviewed {benchmark.lastReviewed}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close benchmark details" className="grid size-10 shrink-0 place-items-center rounded-full text-muted hover:bg-canvas hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 md:grid-cols-[210px_minmax(0,1fr)]">
          <nav aria-label="Budget categories" className="overflow-x-auto border-b border-line bg-canvas p-3 md:overflow-y-auto md:border-b-0 md:border-r">
            <div className="flex min-w-max gap-2 md:block md:min-w-0 md:space-y-4">
              <CategoryGroup title="One-time" categories={grouped.oneTime} selected={selected.category} onSelect={selectCategory} />
              <CategoryGroup title="Monthly" categories={grouped.monthly} selected={selected.category} onSelect={selectCategory} />
            </div>
          </nav>

          <div className="min-h-0 overflow-y-auto px-5 py-5 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-navy">{selected.label}</h3>
                <p className="mt-1 text-sm text-muted">Adjust the detailed planning values, then sync the total to this category.</p>
              </div>
              <span className="hidden rounded-full bg-gold-soft px-3 py-1 text-xs font-bold text-gold-deep sm:inline-flex">
                Baseline ${selected.details.reduce((sum, detail) => sum + detail.amount, 0).toLocaleString()}
              </span>
            </div>

            <div className="mt-5 divide-y divide-line border-y border-line">
              {selected.details.map((detail, index) => (
                <label key={detail.id} className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_150px] sm:items-center">
                  <span>
                    <span className="block text-sm font-bold text-navy">{detail.label}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-muted">{detail.note}</span>
                  </span>
                  <span className="relative block">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-semibold text-muted" aria-hidden="true">$</span>
                    <input
                      ref={index === 0 ? firstInputRef : undefined}
                      type="number"
                      min="0"
                      max="100000000"
                      inputMode="decimal"
                      value={selectedDraft[detail.id] ?? 0}
                      onChange={(event) => updateDetail(detail.id, event.target.value)}
                      aria-label={`${detail.label} amount`}
                      className="field h-11 w-full pl-7 text-right font-semibold"
                    />
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-white px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-navy">
            <Calculator size={17} className="text-gold-deep" aria-hidden="true" />
            <span className="font-semibold">{selected.label} total:</span>
            <strong>${total.toLocaleString()}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="inline-flex min-h-10 items-center rounded-[var(--radius-btn)] border border-line bg-white px-4 text-sm font-bold text-navy hover:bg-canvas">Cancel</button>
            <button type="button" onClick={() => { onSave(selected.category, selectedDraft); onClose() }} className="gold-button !min-h-10 text-sm">
              Save &amp; sync changes
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

function CategoryGroup({
  title,
  categories,
  selected,
  onSelect,
}: {
  title: string
  categories: BudgetCategoryBenchmark[]
  selected: string
  onSelect: (category: BudgetCategoryBenchmark) => void
}) {
  return (
    <div className="md:space-y-1">
      <p className="hidden px-2 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted md:block">{title}</p>
      <div className="flex gap-2 md:block md:space-y-1">
        {categories.map((category) => (
          <button
            key={category.category}
            type="button"
            onClick={() => onSelect(category)}
            aria-current={selected === category.category ? 'page' : undefined}
            className={`min-h-10 whitespace-nowrap rounded-[var(--radius-btn)] px-3 text-left text-xs font-bold transition-colors md:w-full ${
              selected === category.category ? 'bg-navy-deep text-white' : 'bg-white text-navy hover:bg-gold-soft'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function fallbackLine(category: BudgetCategoryBenchmark): BudgetLine {
  return {
    id: category.category,
    category: category.category,
    label: category.label,
    chronologicalStage: category.stage,
    systemBaseline: null,
    systemBaselineKey: null,
    userOverride: null,
    isCustom: false,
    detailOverrides: null,
  }
}
