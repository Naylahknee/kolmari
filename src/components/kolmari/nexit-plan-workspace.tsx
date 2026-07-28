'use client'

import Link from 'next/link'
import { useState } from 'react'
import { BookOpen, Check, FileText, LoaderCircle, Plus, Save, Sparkles, Trash2 } from 'lucide-react'
import type { NexitPlan, PlanBudget, PlanStage } from '@/lib/kolmari-plan'

const STAGES: PlanStage[] = ['Explore', 'Decide', 'Prepare', 'Apply', 'Move', 'Settle']
const DEFAULT_TASKS = [
  'Confirm passport validity',
  'Verify official Pathway requirements',
  'Build application document list',
  'Research housing areas',
  'Review healthcare coverage',
]
const BUDGET_LABELS: Record<keyof PlanBudget, string> = {
  housing: 'Housing',
  food: 'Food',
  transport: 'Transport',
  healthcare: 'Healthcare',
  other: 'Other',
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string | null
  options: string[]
  onChange: (value: string | null) => void
}) {
  return (
    <label className="block text-xs font-semibold text-navy">
      {label}
      <select className="field mt-2" value={value ?? ''} onChange={(event) => onChange(event.target.value || null)}>
        <option value="">Not selected</option>
        {options.map((item) => <option key={item}>{item}</option>)}
      </select>
    </label>
  )
}

export function NexitPlanWorkspace({
  initial,
  nextinations,
  pathways,
  profileHousehold,
  // defaultTab reserved for future use (Flutter Mode scroll-to-section)
}: {
  initial: NexitPlan
  nextinations: string[]
  pathways: string[]
  profileHousehold: number | null
  defaultTab?: 'checklist' | 'plan'
}) {
  const [plan, setPlan] = useState({ ...initial, household_members: initial.household_members ?? profileHousehold })
  const [task, setTask] = useState('')
  const [docItem, setDocItem] = useState('')
  const [activeList, setActiveList] = useState<'checklist' | 'documents'>('checklist')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const hasSavedPlan = initial.updated_at !== null
  const progressChecks = [
    Boolean(plan.saved_nextination),
    Boolean(plan.selected_pathway),
    Boolean(plan.target_move_date),
    plan.checklist.length > 0,
    Object.values(plan.budget).some((value) => value !== null),
    plan.documents.length > 0,
  ]
  const progressLabels = [
    'Destination chosen',
    'Pathway selected',
    'Target date set',
    'Checklist started',
    'Budget entered',
    'Documents listed',
  ]
  const completed = progressChecks.filter(Boolean).length
  const progress = !hasSavedPlan && !progressChecks.some(Boolean)
    ? null
    : Math.round(completed / progressChecks.length * 100)
  const nextStep = progressLabels[progressChecks.findIndex((item) => !item)] ?? 'Ready for Flutter Mode'

  function update<K extends keyof NexitPlan>(key: K, value: NexitPlan[K]) {
    setPlan((current) => ({ ...current, [key]: value }))
  }

  async function save(nextPlan = plan) {
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch('/api/plan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextPlan),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Unable to save your plan.')
      setPlan(result)
      setMessage('Your Move Plan is saved.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save your plan.')
    } finally {
      setSaving(false)
    }
  }

  async function enterMode() {
    const next = { ...plan, timeline_stage: 'Prepare' as const }
    setPlan(next)
    await save(next)
  }

  function addList(key: 'checklist' | 'documents', value: string, clear: () => void) {
    const clean = value.trim()
    if (!clean || plan[key].includes(clean)) return
    update(key, [...plan[key], clean])
    clear()
  }

  const listItems = plan[activeList]
  const listValue = activeList === 'checklist' ? task : docItem
  const setListValue = activeList === 'checklist' ? setTask : setDocItem

  return (
    <div className="mx-auto max-w-[1280px] pb-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-deep">Private workspace</p>
          <h1 className="font-display mt-1 text-3xl font-bold text-navy sm:text-4xl">Kolmari Plan</h1>
          <p className="mt-1 text-sm text-muted">Save decisions, evidence, dates, and preparation work in one place.</p>
        </div>
        <button type="button" disabled={saving} onClick={() => save()} className="gold-button">
          {saving ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
          {saving ? 'Saving…' : 'Save Kolmari Plan'}
        </button>
      </header>

      {message && <p role="status" className="mt-3 text-sm font-semibold text-muted">{message}</p>}

      <div className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <main className="space-y-5">
          <section className="card-surface p-5" aria-labelledby="plan-details-heading">
            <h2 id="plan-details-heading" className="text-sm font-bold text-navy">Plan details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Select label="Saved Destination" value={plan.saved_nextination} options={nextinations} onChange={(value) => update('saved_nextination', value)} />
              <Select label="Selected Pathway" value={plan.selected_pathway} options={pathways} onChange={(value) => update('selected_pathway', value)} />
              <label className="block text-xs font-semibold text-navy">
                Target move date
                <input className="field mt-2" type="date" value={plan.target_move_date ?? ''} onChange={(event) => update('target_move_date', event.target.value || null)} />
              </label>
              <label className="block text-xs font-semibold text-navy">
                Household members
                <input className="field mt-2" type="number" min="1" max="20" value={plan.household_members ?? ''} onChange={(event) => update('household_members', event.target.value ? Number(event.target.value) : null)} />
              </label>
            </div>
          </section>

          <section className="card-surface p-5" aria-labelledby="timeline-heading">
            <h2 id="timeline-heading" className="text-sm font-bold text-navy">Kolmari Timeline</h2>
            <p className="mt-1 text-xs text-muted">Select your current stage. Stages are checkpoints, not prescriptions.</p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {STAGES.map((stage, index) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => update('timeline_stage', stage)}
                  aria-pressed={plan.timeline_stage === stage}
                  className={[
                    'rounded-[var(--radius-field)] border px-2 py-3 text-xs font-semibold transition-colors',
                    plan.timeline_stage === stage
                      ? 'border-gold bg-gold text-navy'
                      : 'border-line bg-canvas text-muted hover:border-navy/20 hover:text-navy',
                  ].join(' ')}
                >
                  <span className="mb-1 block text-[10px] opacity-65">{index + 1}</span>
                  {stage}
                </button>
              ))}
            </div>
          </section>

          <section className="card-surface overflow-hidden" aria-label="Plan checklist and documents">
            <div className="flex border-b border-line px-5">
              {([
                ['checklist', 'Checklist', Check, plan.checklist.length],
                ['documents', 'Documents', FileText, plan.documents.length],
              ] as const).map(([key, label, Icon, count]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveList(key)}
                  className={[
                    'flex items-center gap-2 border-b-2 px-3 py-4 text-xs font-bold',
                    activeList === key ? 'border-gold text-navy' : 'border-transparent text-muted',
                  ].join(' ')}
                >
                  <Icon size={14} aria-hidden="true" />
                  {label}
                  <span className="rounded-full bg-canvas px-1.5 py-0.5 text-[10px]">{count}</span>
                </button>
              ))}
            </div>
            <div className="p-5">
              <div className="flex gap-2">
                <input
                  className="field"
                  value={listValue}
                  onChange={(event) => setListValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      addList(activeList, listValue, () => setListValue(''))
                    }
                  }}
                  placeholder={`Add ${activeList === 'checklist' ? 'checklist' : 'document'} item`}
                />
                <button
                  type="button"
                  onClick={() => addList(activeList, listValue, () => setListValue(''))}
                  aria-label={`Add ${activeList} item`}
                  className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-btn)] bg-navy text-white"
                >
                  <Plus size={17} />
                </button>
              </div>

              {activeList === 'checklist' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {DEFAULT_TASKS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        if (!plan.checklist.includes(item)) update('checklist', [...plan.checklist, item])
                      }}
                      className="rounded-[var(--radius-pill)] border border-line px-3 py-1.5 text-[11px] font-semibold text-muted hover:border-gold hover:text-navy"
                    >
                      + {item}
                    </button>
                  ))}
                </div>
              )}

              <ul className="mt-4 space-y-2">
                {listItems.map((item) => (
                  <li key={item} className="flex items-center justify-between gap-3 rounded-[var(--radius-field)] bg-canvas px-4 py-2.5 text-sm">
                    <span className="text-navy">{item}</span>
                    <button type="button" aria-label={`Remove ${item}`} onClick={() => update(activeList, listItems.filter((value) => value !== item))} className="text-muted hover:text-danger">
                      <Trash2 size={15} />
                    </button>
                  </li>
                ))}
                {!listItems.length && <li className="pt-1 text-xs text-muted">No items added yet.</li>}
              </ul>
            </div>
          </section>

          <section className="card-surface p-5" aria-labelledby="notes-heading">
            <h2 id="notes-heading" className="text-sm font-bold text-navy">Notes</h2>
            <p className="mt-1 text-xs text-muted">Record questions, decisions, and follow-ups.</p>
            <textarea
              className="field mt-4 min-h-32 py-3"
              value={plan.notes ?? ''}
              onChange={(event) => update('notes', event.target.value || null)}
              placeholder="Questions, decisions, and follow-ups…"
              aria-label="Plan notes"
            />
          </section>
        </main>

        <aside className="space-y-4">
          <section className="rounded-[var(--radius-card)] bg-navy p-5 text-white" aria-labelledby="readiness-heading">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">Kolmari Readiness</p>
            <h2 id="readiness-heading" className="font-display mt-2 text-2xl font-bold text-gold">
              {progress === null ? 'Not started' : `${progress}% ready`}
            </h2>
            <div className="mt-4 h-1 rounded-full bg-white/15">
              <div className="h-full rounded-full bg-gold transition-[width]" style={{ width: `${progress ?? 0}%` }} />
            </div>
            <p className="mt-2 text-[10px] font-semibold text-white/55">{completed} of {progressChecks.length} complete</p>
            <div className="my-4 h-px bg-white/15" />
            <ul className="space-y-2">
              {progressLabels.map((label, index) => (
                <li key={label} className="flex items-center gap-2 text-xs font-semibold text-white/80">
                  <span className={`grid size-4 place-items-center rounded-full border ${progressChecks[index] ? 'border-gold bg-gold text-navy' : 'border-white/35'}`}>
                    {progressChecks[index] && <Check size={10} strokeWidth={3} />}
                  </span>
                  {label}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[10px] font-bold text-gold">Next: {nextStep}</p>
          </section>

          <section className="card-surface p-5" aria-labelledby="budget-heading">
            <h2 id="budget-heading" className="text-sm font-bold text-navy">Budget</h2>
            <p className="mt-1 text-[10px] text-muted">Blank until you enter your own planning figures.</p>
            <div className="mt-4 space-y-2">
              {(Object.keys(BUDGET_LABELS) as (keyof PlanBudget)[]).map((key) => (
                <label key={key} className="flex items-center justify-between gap-3 text-xs font-medium text-muted">
                  {BUDGET_LABELS[key]}
                  <input
                    className="field h-9 w-24 px-2"
                    type="number"
                    min="0"
                    aria-label={`${BUDGET_LABELS[key]} budget`}
                    value={plan.budget[key] ?? ''}
                    onChange={(event) => update('budget', { ...plan.budget, [key]: event.target.value ? Number(event.target.value) : null })}
                  />
                </label>
              ))}
            </div>
            <Link href="/cost-calculator" className="mt-4 inline-flex text-xs font-bold text-gold-deep hover:underline">
              Open Cost Calculator
            </Link>
          </section>

          <article className="rounded-[var(--radius-card)] border border-teal/25 bg-teal-soft p-5">
            <div className="flex items-start gap-3">
              <BookOpen size={16} className="mt-0.5 shrink-0 text-teal-deep" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold text-teal-deep">Greenbook Insights</p>
                <p className="mt-1 text-[11px] leading-5 text-muted">Sourced neighborhood and lived-experience research to review before deciding.</p>
                <Link href="/greenbook" className="mt-2 inline-flex text-[11px] font-bold text-teal-deep hover:underline">Open Greenbook Insights</Link>
              </div>
            </div>
          </article>

          <article className="rounded-[var(--radius-card)] bg-navy p-5 text-white">
            <Sparkles size={16} className="text-gold" aria-hidden="true" />
            <h2 className="mt-3 text-sm font-bold">Ready to move from planning to doing?</h2>
            <button
              type="button"
              disabled={saving || !plan.saved_nextination || !plan.selected_pathway}
              onClick={enterMode}
              className="gold-button mt-4 w-full justify-center text-xs"
            >
              Enter Flutter Mode
            </button>
            <p className="mt-2 text-[10px] text-white/55">Choose a Destination and Pathway first.</p>
          </article>
        </aside>
      </div>
    </div>
  )
}
