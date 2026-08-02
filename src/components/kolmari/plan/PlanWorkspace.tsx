'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Download, Pencil, Printer, X } from 'lucide-react'
import { LIFESTYLE_TIERS, budgetEffective, documentStep, formatMonthYear, journeyStageLabel, type LifestyleTier, type NexitPlan } from '@/lib/plan-types'
import { applyBaselines, baselinesDiffer } from '@/lib/budget-baselines'
import { useLocalStorageState, useLocalStorageWorkspace } from '@/hooks/useLocalStorageWorkspace'
import { PLAN_TABS, SaveChip, type PlanCtx, type SaveStatus, type TabId } from './shared'
import { OverviewTab } from './OverviewTab'
import { ChecklistTab } from './ChecklistTab'
import { DocumentsTab } from './DocumentsTab'
import { BudgetTab } from './BudgetTab'
import { NotesTab } from './NotesTab'

const TAB_LABELS: Record<TabId, string> = {
  overview: 'Overview',
  checklist: 'Checklist',
  documents: 'Documents',
  budget: 'Budget',
  notes: 'Notes',
}

function formatTime(date: Date): string {
  let h = date.getHours()
  const m = date.getMinutes().toString().padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${m} ${ampm}`
}

function usePlanState(initial: NexitPlan) {
  const [plan, setPlan] = useState(initial)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const dirty = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latest = useRef(plan)
  useEffect(() => { latest.current = plan })

  const flush = useCallback(async () => {
    setSaveStatus('saving')
    try {
      const res = await fetch('/api/plan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(latest.current),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Save failed')
      setSaveStatus('saved')
      setSavedAt(new Date())
    } catch {
      setSaveStatus('error')
    }
  }, [])

  useEffect(() => {
    if (!dirty.current) return
    setSaveStatus('saving')
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(flush, 900)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [plan, flush])

  const update = useCallback(<K extends keyof NexitPlan>(key: K, value: NexitPlan[K]) => {
    dirty.current = true
    setPlan((current) => ({ ...current, [key]: value }))
  }, [])

  const savedAtLabel = savedAt ? `Updated today at ${formatTime(savedAt)}` : null
  return { plan, update, saveStatus, savedAtLabel, retry: flush }
}

function Select({ label, value, options, placeholder, onChange }: {
  label: string
  value: string | null
  options: string[]
  placeholder: string
  onChange: (value: string | null) => void
}) {
  return (
    <label className="block text-xs font-semibold text-navy">
      {label}
      <select className="field mt-2" value={value ?? ''} onChange={(event) => onChange(event.target.value || null)}>
        <option value="">{placeholder}</option>
        {options.map((item) => <option key={item}>{item}</option>)}
      </select>
    </label>
  )
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`
}
// Export the live plan to a CSV the browser downloads (module scope so
// `document` is the global, not the shadowing documentStep() variable below).
function exportPlanCsv(plan: NexitPlan) {
  const rows: string[][] = [['Section', 'Item', 'Detail']]
  rows.push(['Plan', 'Destination', plan.saved_nextination ?? ''])
  rows.push(['Plan', 'City', plan.destination_city ?? ''])
  rows.push(['Plan', 'Pathway', plan.selected_pathway ?? ''])
  rows.push(['Plan', 'Target move', plan.target_move_date ?? ''])
  rows.push(['Plan', 'Household', plan.household_members?.toString() ?? ''])
  rows.push(['Plan', 'Move stage', plan.timeline_stage])
  for (const c of plan.checklist) rows.push(['Checklist', c.text, [c.done ? 'Done' : 'Open', c.stage, c.due ? `due ${c.due}` : ''].filter(Boolean).join(' · ')])
  for (const d of plan.documents) rows.push(['Document', d.name, [d.status, d.expirationDate ? `expires ${d.expirationDate}` : ''].filter(Boolean).join(' · ')])
  for (const b of plan.budget) {
    const v = budgetEffective(b)
    if (v !== null) rows.push(['Budget', b.label, `${b.chronologicalStage === 'ONE_TIME' ? 'one-time' : 'monthly'} · $${v}`])
  }
  const csv = rows.map((r) => r.map(csvCell).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Expat_Relocation_Report_${(plan.destination_city || plan.saved_nextination || 'Plan').replace(/[^a-z0-9]+/gi, '_')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function PlanDetailsDialog({ ctx, tier, setTier, onClose }: { ctx: PlanCtx; tier: LifestyleTier; setTier: (t: LifestyleTier) => void; onClose: () => void }) {
  const { plan, update, nextinations, pathways } = ctx
  const firstRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    firstRef.current?.focus()
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-navy/40 p-4" role="dialog" aria-modal="true" aria-label="Edit plan details" onClick={onClose}>
      <div className="card-surface w-full max-w-lg p-5" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-navy">Edit plan details</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-8 place-items-center rounded-full text-muted hover:bg-canvas hover:text-navy">
            <X size={16} />
          </button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-navy">
            Destination
            <select ref={firstRef} className="field mt-2" value={plan.saved_nextination ?? ''} onChange={(event) => update('saved_nextination', event.target.value || null)}>
              <option value="">Not selected</option>
              {nextinations.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="block text-xs font-semibold text-navy">
            City
            <input className="field mt-2" value={plan.destination_city ?? ''} onChange={(event) => update('destination_city', event.target.value || null)} placeholder="e.g. Lisbon" />
          </label>
          <Select label="Pathway" value={plan.selected_pathway} options={pathways} placeholder="Not selected" onChange={(value) => update('selected_pathway', value)} />
          <label className="block text-xs font-semibold text-navy">
            Target move date
            <input className="field mt-2" type="date" value={plan.target_move_date ?? ''} onChange={(event) => update('target_move_date', event.target.value || null)} />
          </label>
          <label className="block text-xs font-semibold text-navy">
            Household members
            <input className="field mt-2" type="number" min="1" max="20" value={plan.household_members ?? ''} onChange={(event) => update('household_members', event.target.value ? Math.max(1, Math.min(20, Number(event.target.value))) : null)} />
          </label>
          <label className="block text-xs font-semibold text-navy">
            Lifestyle tier
            <select className="field mt-2" value={tier} onChange={(event) => setTier(event.target.value as LifestyleTier)}>
              {LIFESTYLE_TIERS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <SaveChip status={ctx.saveStatus} onRetry={ctx.retry} />
          <button type="button" onClick={onClose} className="gold-button !min-h-9 !px-4 text-xs">Done</button>
        </div>
      </div>
    </div>
  )
}

export function PlanWorkspace({ initial, nextinations, pathways, profileHousehold, initialTab }: {
  initial: NexitPlan
  nextinations: string[]
  pathways: string[]
  profileHousehold: number | null
  initialTab: TabId
}) {
  const seeded: NexitPlan = { ...initial, household_members: initial.household_members ?? profileHousehold }
  const { plan, update, saveStatus, savedAtLabel, retry } = usePlanState(seeded)

  // Instant localStorage cache (complements the canonical server autosave):
  // mirror the active location so tabs can hydrate it without a round-trip.
  const { setCountry, setCity } = useLocalStorageWorkspace()
  useEffect(() => { setCountry(plan.saved_nextination) }, [plan.saved_nextination, setCountry])
  useEffect(() => { setCity(plan.destination_city) }, [plan.destination_city, setCity])
  // Lifestyle tier preference (drives baseline arrays once cost data exists).
  const [tier, setTier] = useLocalStorageState<LifestyleTier>('lifestyle_tier', 'Standard')

  // Keep each budget line's systemBaseline in sync with the destination + tier
  // from the sourced baselines table. Converges (differ→false after applying)
  // and no-ops for destinations without baseline data.
  useEffect(() => {
    if (baselinesDiffer(plan.budget, plan.saved_nextination, tier)) {
      update('budget', applyBaselines(plan.budget, plan.saved_nextination, tier))
    }
  }, [plan.budget, plan.saved_nextination, tier, update])

  const [tab, setTab] = useState<TabId>(initialTab)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)

  const goToTab = useCallback((next: TabId) => {
    setTab(next)
    const url = next === 'overview' ? window.location.pathname : `${window.location.pathname}?tab=${next}`
    window.history.pushState(null, '', url)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const onPop = () => {
      const value = new URLSearchParams(window.location.search).get('tab')
      setTab(PLAN_TABS.includes(value as TabId) ? (value as TabId) : 'overview')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function onTabKey(event: React.KeyboardEvent, index: number) {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: PLAN_TABS.length - 1,
    }
    if (!(event.key in keys)) return
    event.preventDefault()
    const nextIndex = (keys[event.key] + PLAN_TABS.length) % PLAN_TABS.length
    const nextTab = PLAN_TABS[nextIndex]
    goToTab(nextTab)
    ;(tabsRef.current?.querySelectorAll('[role="tab"]')[nextIndex] as HTMLElement | undefined)?.focus()
  }

  const ctx: PlanCtx = {
    plan,
    update,
    goToTab,
    openDetails: () => setDetailsOpen(true),
    saveStatus,
    savedAtLabel,
    retry,
    nextinations,
    pathways,
  }

  const document = documentStep(plan)
  const pathway = plan.selected_pathway?.includes(' — ')
    ? plan.selected_pathway.split(' — ').slice(1).join(' — ')
    : plan.selected_pathway
  const summaryBits = [
    pathway,
    plan.target_move_date ? `Target ${formatMonthYear(plan.target_move_date)}` : null,
    plan.household_members ? `${plan.household_members} household members` : null,
  ].filter(Boolean)
  const currentStage = journeyStageLabel(plan.journey_stage)

  return (
    <div className="mx-auto max-w-[1180px] pb-8">
      <header className="rounded-[var(--radius-card)] bg-navy-deep px-5 py-6 text-white shadow-shell sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold">
              Your Plan{plan.saved_nextination ? ` · ${plan.saved_nextination}` : ''}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.02em] text-white">My Plan</h1>
            <p className="mt-2 text-sm text-white/75 sm:text-base">
              {summaryBits.length ? summaryBits.join(' · ') : 'Set your destination and pathway to build your plan.'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-navy-card px-3 py-1.5 text-xs font-bold text-white">Move stage: {currentStage}</span>
              {document && <span className="rounded-full bg-navy-card px-3 py-1.5 text-xs font-bold text-white">Document step: {document.name}</span>}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 pt-1">
            <button type="button" onClick={() => setDetailsOpen(true)} className="gold-button text-sm">
              <Pencil size={14} aria-hidden="true" /> Edit plan details
            </button>
            <div className="no-print flex gap-2">
              <button type="button" onClick={() => exportPlanCsv(plan)} className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-btn)] border border-white/25 bg-white/10 px-3 text-xs font-bold text-white hover:bg-white/20">
                <Download size={13} aria-hidden="true" /> CSV
              </button>
              <button type="button" onClick={() => window.print()} className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-btn)] border border-white/25 bg-white/10 px-3 text-xs font-bold text-white hover:bg-white/20">
                <Printer size={13} aria-hidden="true" /> Print
              </button>
            </div>
            <SaveChip status={saveStatus} onRetry={retry} className="!bg-white/10 !text-white/75" />
          </div>
        </div>
      </header>

      <div className="k-tabbar mt-4">
        <div ref={tabsRef} role="tablist" aria-label="My Plan sections" className="k-tabs">
          {PLAN_TABS.map((id, index) => {
            const active = tab === id
            const count = id === 'documents' ? plan.documents.length : null
            return (
              <button
                key={id}
                role="tab"
                id={`plan-tab-${id}`}
                aria-selected={active}
                aria-controls={`plan-panel-${id}`}
                tabIndex={active ? 0 : -1}
                onKeyDown={(event) => onTabKey(event, index)}
                onClick={() => goToTab(id)}
                className="k-tab"
              >
                <span className="inline-flex items-center gap-2">
                  {TAB_LABELS[id]}
                  {count !== null && count > 0 && (
                    <span className="k-count">
                      {count}
                    </span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div role="tabpanel" id={`plan-panel-${tab}`} aria-labelledby={`plan-tab-${tab}`} tabIndex={0} className="mt-6 focus:outline-none">
        {tab === 'overview' && <OverviewTab ctx={ctx} />}
        {tab === 'checklist' && <ChecklistTab ctx={ctx} />}
        {tab === 'documents' && <DocumentsTab ctx={ctx} />}
        {tab === 'budget' && <BudgetTab ctx={ctx} />}
        {tab === 'notes' && <NotesTab ctx={ctx} />}
      </div>

      {detailsOpen && <PlanDetailsDialog ctx={ctx} tier={tier} setTier={setTier} onClose={() => setDetailsOpen(false)} />}
    </div>
  )
}
