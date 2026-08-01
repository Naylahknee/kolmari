'use client'

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { Pencil } from 'lucide-react'
import {
  PLAN_STAGES,
  documentStep,
  journeyStageLabel,
  type JourneyStage,
  type NexitPlan,
} from '@/lib/plan-types'
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

function PlanDetailsPanel({ ctx, sectionRef, firstFieldRef }: {
  ctx: PlanCtx
  sectionRef: RefObject<HTMLElement | null>
  firstFieldRef: RefObject<HTMLSelectElement | null>
}) {
  const { plan, update, nextinations, pathways } = ctx
  return (
    <section ref={sectionRef} className="card-surface p-5 sm:p-6" aria-labelledby="plan-details-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="plan-details-heading" className="text-base font-bold text-navy">Plan details</h2>
          <p className="mt-1 text-xs text-muted">The core decisions that shape your move plan.</p>
        </div>
        <SaveChip status={ctx.saveStatus} onRetry={ctx.retry} />
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-semibold text-navy">
          Saved destination
          <select ref={firstFieldRef} className="field mt-2" value={plan.saved_nextination ?? ''} onChange={(e) => update('saved_nextination', e.target.value || null)}>
            <option value="">Not selected</option>
            {nextinations.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="block text-xs font-semibold text-navy">
          Selected pathway
          <select className="field mt-2" value={plan.selected_pathway ?? ''} onChange={(e) => update('selected_pathway', e.target.value || null)}>
            <option value="">Not selected</option>
            {pathways.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="block text-xs font-semibold text-navy">
          Target move date
          <input className="field mt-2" type="date" value={plan.target_move_date ?? ''} onChange={(e) => update('target_move_date', e.target.value || null)} />
        </label>
        <label className="block text-xs font-semibold text-navy">
          Household members
          <input className="field mt-2" type="number" min="1" max="20" value={plan.household_members ?? ''} onChange={(e) => update('household_members', e.target.value ? Math.max(1, Math.min(20, Number(e.target.value))) : null)} />
        </label>
      </div>
    </section>
  )
}

function VerticalMoveTimeline({ ctx }: { ctx: PlanCtx }) {
  const current = ctx.plan.journey_stage
  return (
    <aside className="card-surface p-5 lg:sticky lg:top-24 lg:self-start" aria-labelledby="move-timeline-heading">
      <h2 id="move-timeline-heading" className="text-base font-bold text-navy">Move Timeline</h2>
      <p className="mt-1 text-xs leading-5 text-muted">Select your current stage. Stages are checkpoints, not prescriptions.</p>
      <ol className="mt-4 space-y-2" aria-label="Move Timeline stages">
        {PLAN_STAGES.map((stage, index) => {
          const value = (index + 1) as JourneyStage
          const selected = value === current
          return (
            <li key={stage}>
              <button
                type="button"
                aria-current={selected ? 'step' : undefined}
                onClick={() => ctx.update('journey_stage', value)}
                className={[
                  'flex min-h-12 w-full items-center gap-3 rounded-[var(--radius-field)] px-3.5 py-2.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                  selected ? 'bg-[#F3C516] text-navy' : 'bg-canvas text-muted hover:bg-gold-soft/50 hover:text-navy',
                ].join(' ')}
              >
                <span className={['grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-extrabold', selected ? 'bg-navy text-white' : 'bg-white text-muted'].join(' ')}>{value}</span>
                <span className="text-sm font-bold">{stage}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </aside>
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
  const tabsRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLElement>(null)
  const detailsFirstRef = useRef<HTMLSelectElement>(null)

  const goToTab = useCallback((next: TabId) => {
    setTab(next)
    const url = next === 'overview' ? window.location.pathname : `${window.location.pathname}?tab=${next}`
    window.history.pushState(null, '', url)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const openDetails = useCallback(() => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => detailsFirstRef.current?.focus(), 350)
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
    plan, update, goToTab, openDetails, saveStatus, savedAtLabel, retry, nextinations, pathways,
  }

  const step = documentStep(plan)
  const summaryBits = [plan.selected_pathway, plan.target_move_date ? `Target ${plan.target_move_date}` : null, plan.household_members ? `${plan.household_members} household members` : null].filter(Boolean)
  const currentStage = journeyStageLabel(plan.journey_stage)

  return (
    <div className="mx-auto max-w-[1180px] pb-8">
      <header className="rounded-[var(--radius-card)] bg-navy px-5 py-5 text-white sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">Your Plan{plan.saved_nextination ? ` · ${plan.saved_nextination}` : ''}</p>
            <h1 className="font-display mt-1 text-3xl font-bold sm:text-4xl">My Plan</h1>
            <p className="mt-1 text-sm text-white/70">{summaryBits.length ? summaryBits.join(' · ') : 'Set your destination and pathway to build your plan.'}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/90">Move stage: {currentStage}</span>
              {step && <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/90">Document step: {step.name}</span>}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button type="button" onClick={openDetails} className="inline-flex items-center gap-1.5 rounded-[var(--radius-btn)] bg-gold px-3.5 py-2 text-xs font-bold text-navy transition hover:brightness-95">
              <Pencil size={13} aria-hidden="true" /> Edit plan details
            </button>
            <SaveChip status={saveStatus} onRetry={retry} className="!bg-white/10 !text-white/80" />
          </div>
        </div>
      </header>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(260px,.75fr)]">
        <PlanDetailsPanel ctx={ctx} sectionRef={detailsRef} firstFieldRef={detailsFirstRef} />
        <VerticalMoveTimeline ctx={ctx} />
      </div>

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
                onKeyDown={(e) => onTabKey(e, index)}
                onClick={() => goToTab(id)}
                className="k-tab"
              >
                {TAB_LABELS[id]}
                {count !== null && count > 0 && <span className="k-count">{count}</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div role="tabpanel" id={`plan-panel-${tab}`} aria-labelledby={`plan-tab-${tab}`} tabIndex={0} className="mt-4 focus:outline-none">
        {tab === 'overview' && <OverviewTab ctx={ctx} />}
        {tab === 'checklist' && <ChecklistTab ctx={ctx} />}
        {tab === 'documents' && <DocumentsTab ctx={ctx} />}
        {tab === 'budget' && <BudgetTab ctx={ctx} />}
        {tab === 'notes' && <NotesTab ctx={ctx} />}
      </div>
    </div>
  )
}
