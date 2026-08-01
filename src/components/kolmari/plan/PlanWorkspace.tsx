'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Pencil, X } from 'lucide-react'
import { documentStep, type NexitPlan } from '@/lib/plan-types'
import { PLAN_TABS, SaveChip, type PlanCtx, type SaveStatus, type TabId } from './shared'
import { OverviewTab } from './OverviewTab'
import { ChecklistTab } from './ChecklistTab'
import { DocumentsTab } from './DocumentsTab'
import { BudgetTab } from './BudgetTab'
import { NotesTab } from './NotesTab'

const TAB_LABELS: Record<TabId, string> = { overview: 'Overview', checklist: 'Checklist', documents: 'Documents', budget: 'Budget', notes: 'Notes' }

function formatTime(date: Date): string {
  let h = date.getHours()
  const m = date.getMinutes().toString().padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${m} ${ampm}`
}

// --- autosave state ---
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
      const res = await fetch('/api/plan', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(latest.current) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Save failed')
      // Do not overwrite local state — that would clobber in-flight typing.
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

function Select({ label, value, options, placeholder, onChange }: { label: string; value: string | null; options: string[]; placeholder: string; onChange: (v: string | null) => void }) {
  return (
    <label className="block text-xs font-semibold text-navy">
      {label}
      <select className="field mt-2" value={value ?? ''} onChange={(e) => onChange(e.target.value || null)}>
        <option value="">{placeholder}</option>
        {options.map((item) => <option key={item}>{item}</option>)}
      </select>
    </label>
  )
}

function PlanDetailsDialog({ ctx, onClose }: { ctx: PlanCtx; onClose: () => void }) {
  const { plan, update, nextinations, pathways } = ctx
  const firstRef = useRef<HTMLSelectElement>(null)
  useEffect(() => {
    firstRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-navy/40 p-4" role="dialog" aria-modal="true" aria-label="Edit plan details" onClick={onClose}>
      <div className="card-surface w-full max-w-lg p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-navy">Edit plan details</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-8 place-items-center rounded-full text-muted hover:bg-canvas hover:text-navy"><X size={16} /></button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-navy">
            Destination
            <select ref={firstRef} className="field mt-2" value={plan.saved_nextination ?? ''} onChange={(e) => update('saved_nextination', e.target.value || null)}>
              <option value="">Not selected</option>
              {nextinations.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <Select label="Pathway" value={plan.selected_pathway} options={pathways} placeholder="Not selected" onChange={(v) => update('selected_pathway', v)} />
          <label className="block text-xs font-semibold text-navy">
            Target move date
            <input className="field mt-2" type="date" value={plan.target_move_date ?? ''} onChange={(e) => update('target_move_date', e.target.value || null)} />
          </label>
          <label className="block text-xs font-semibold text-navy">
            Household members
            <input className="field mt-2" type="number" min="1" max="20" value={plan.household_members ?? ''} onChange={(e) => update('household_members', e.target.value ? Math.max(1, Math.min(20, Number(e.target.value))) : null)} />
          </label>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <SaveChip status={ctx.saveStatus} onRetry={ctx.retry} />
          <button type="button" onClick={onClose} className="gold-button">Done</button>
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
      const t = new URLSearchParams(window.location.search).get('tab')
      setTab(PLAN_TABS.includes(t as TabId) ? (t as TabId) : 'overview')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function onTabKey(event: React.KeyboardEvent, index: number) {
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: PLAN_TABS.length - 1 }
    if (!(event.key in keys)) return
    event.preventDefault()
    const nextIndex = (keys[event.key] + PLAN_TABS.length) % PLAN_TABS.length
    const nextTab = PLAN_TABS[nextIndex]
    goToTab(nextTab)
    ;(tabsRef.current?.querySelectorAll('[role="tab"]')[nextIndex] as HTMLElement | undefined)?.focus()
  }

  const ctx: PlanCtx = {
    plan, update, goToTab, openDetails: () => setDetailsOpen(true), saveStatus, savedAtLabel, retry, nextinations, pathways,
  }

  const step = documentStep(plan)
  const summaryBits = [plan.selected_pathway, plan.target_move_date ? `Target ${plan.target_move_date}` : null, plan.household_members ? `${plan.household_members} household members` : null].filter(Boolean)

  return (
    <div className="mx-auto max-w-[1180px] pb-8">
      {/* Persistent header */}
      <header className="rounded-[var(--radius-card)] bg-navy px-5 py-5 text-white sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">Your Plan{plan.saved_nextination ? ` · ${plan.saved_nextination}` : ''}</p>
            <h1 className="font-display mt-1 text-3xl font-bold sm:text-4xl">My Plan</h1>
            <p className="mt-1 text-sm text-white/70">{summaryBits.length ? summaryBits.join(' · ') : 'Set your destination and pathway to build your plan.'}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/90">Move stage: {plan.timeline_stage}</span>
              {step && <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/90">Document step: {step.name}</span>}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button type="button" onClick={() => setDetailsOpen(true)} className="inline-flex items-center gap-1.5 rounded-[var(--radius-btn)] bg-gold px-3.5 py-2 text-xs font-bold text-navy transition hover:brightness-95">
              <Pencil size={13} aria-hidden="true" /> Edit plan details
            </button>
            <SaveChip status={saveStatus} onRetry={retry} className="!bg-white/10 !text-white/80" />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="card-surface mt-4 px-2">
        <div ref={tabsRef} role="tablist" aria-label="My Plan sections" className="flex gap-1 overflow-x-auto">
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
                onKeyDown={(e) => onTabKey(e, index)}
                onClick={() => goToTab(id)}
                className={['relative whitespace-nowrap px-4 py-3.5 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold', active ? 'text-navy' : 'text-muted hover:text-navy'].join(' ')}
              >
                <span className="inline-flex items-center gap-2">
                  {TAB_LABELS[id]}
                  {count !== null && count > 0 && <span className="rounded-full bg-canvas px-1.5 py-0.5 text-[10px] font-bold text-navy">{count}</span>}
                </span>
                {active && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gold" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Panels */}
      <div role="tabpanel" id={`plan-panel-${tab}`} aria-labelledby={`plan-tab-${tab}`} tabIndex={0} className="mt-4 focus:outline-none">
        {tab === 'overview' && <OverviewTab ctx={ctx} />}
        {tab === 'checklist' && <ChecklistTab ctx={ctx} />}
        {tab === 'documents' && <DocumentsTab ctx={ctx} />}
        {tab === 'budget' && <BudgetTab ctx={ctx} />}
        {tab === 'notes' && <NotesTab ctx={ctx} />}
      </div>

      {detailsOpen && <PlanDetailsDialog ctx={ctx} onClose={() => setDetailsOpen(false)} />}
    </div>
  )
}
