'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, FileText, LoaderCircle, NotebookTabs, Plus, Save, Sparkles, Trash2 } from 'lucide-react'
import type { NexitPlan, PlanBudget, PlanStage } from '@/lib/nexit-plan'

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

// ─── Sub-components ──────────────────────────────────────────────────────────

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
    <label className="block text-sm font-semibold text-navy">
      {label}
      <select
        className="field mt-2"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">Not selected</option>
        {options.map((item) => <option key={item}>{item}</option>)}
      </select>
    </label>
  )
}

function ListEditor({
  title,
  icon,
  items,
  value,
  setValue,
  onAdd,
  onRemove,
  suggestions = [],
  onSuggestion,
}: {
  title: string
  icon: React.ReactNode
  items: string[]
  value: string
  setValue: (v: string) => void
  onAdd: () => void
  onRemove: (item: string) => void
  suggestions?: string[]
  onSuggestion?: (item: string) => void
}) {
  return (
    <section className="card-surface p-6" aria-labelledby={`list-heading-${title}`}>
      <div className="flex items-center gap-2">
        <span className="text-gold-deep" aria-hidden="true">{icon}</span>
        <h2 id={`list-heading-${title}`} className="font-semibold text-navy">{title}</h2>
      </div>
      <div className="mt-4 flex gap-2">
        <input
          className="field"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAdd() } }}
          placeholder={`Add ${title.toLowerCase()} item`}
          aria-label={`Add ${title.toLowerCase()} item`}
        />
        <button
          type="button"
          onClick={onAdd}
          aria-label={`Add to ${title}`}
          className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-btn)] bg-navy text-white"
        >
          <Plus size={17} />
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onSuggestion?.(item)}
              className="rounded-[var(--radius-pill)] bg-canvas px-3 py-1.5 text-xs font-semibold text-muted hover:bg-gold-soft/40 hover:text-navy"
            >
              + {item}
            </button>
          ))}
        </div>
      )}
      <ul className="mt-5 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center justify-between gap-3 rounded-[var(--radius-field)] bg-canvas px-4 py-3 text-sm"
          >
            <span className="text-navy">{item}</span>
            <button
              type="button"
              aria-label={`Remove ${item}`}
              onClick={() => onRemove(item)}
              className="text-muted hover:text-danger"
            >
              <Trash2 size={15} />
            </button>
          </li>
        ))}
        {!items.length && (
          <li className="text-sm text-muted">No items added yet.</li>
        )}
      </ul>
    </section>
  )
}

// ─── Main workspace ──────────────────────────────────────────────────────────

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
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const hasSavedPlan = initial.updated_at !== null
  const progressChecks = [
    Boolean(plan.saved_nextination),
    Boolean(plan.selected_pathway),
    Boolean(plan.target_move_date),
    plan.checklist.length > 0,
    Object.values(plan.budget).some((v) => v !== null),
    plan.documents.length > 0,
  ]
  const progress = !hasSavedPlan && !progressChecks.some(Boolean)
    ? null
    : Math.round(progressChecks.filter(Boolean).length / progressChecks.length * 100)

  function update<K extends keyof NexitPlan>(key: K, value: NexitPlan[K]) {
    setPlan((cur) => ({ ...cur, [key]: value }))
  }

  async function save(nextPlan = plan) {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/plan', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nextPlan) })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error ?? 'Unable to save your plan.')
      setPlan(result)
      setMessage('Your Move Plan is saved.')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to save your plan.')
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

  return (
    <div className="space-y-6">

      {/* ── Plan header ──────────────────────────────────────────────────── */}
      <header className="rounded-[20px] bg-navy-deep p-7 text-white sm:p-9">
        <div className="flex items-center gap-3">
          <NotebookTabs size={20} className="text-gold" aria-hidden="true" />
          <p className="text-sm font-bold text-gold">Private workspace</p>
        </div>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">My Plan</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              Save decisions, evidence, dates, and preparation work in one place.
            </p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-white/12 bg-white/8 px-5 py-4 text-right">
            <p className="text-xs font-semibold text-white/55">Move Readiness</p>
            <p className="mt-1 text-2xl font-bold text-gold">
              {progress === null ? 'Not started' : `${progress}%`}
            </p>
          </div>
        </div>
      </header>

      {/* ── Plan details ─────────────────────────────────────────────────── */}
      <section className="card-surface p-6" aria-labelledby="plan-details-heading">
        <h2 id="plan-details-heading" className="font-semibold text-navy">Plan details</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Select
            label="Saved Destination"
            value={plan.saved_nextination}
            options={nextinations}
            onChange={(v) => update('saved_nextination', v)}
          />
          <Select
            label="Selected Pathway"
            value={plan.selected_pathway}
            options={pathways}
            onChange={(v) => update('selected_pathway', v)}
          />
          <label className="block text-sm font-semibold text-navy">
            Target move date
            <input
              className="field mt-2"
              type="date"
              value={plan.target_move_date ?? ''}
              onChange={(e) => update('target_move_date', e.target.value || null)}
            />
          </label>
          <label className="block text-sm font-semibold text-navy">
            Household members
            <input
              className="field mt-2"
              type="number"
              min="1"
              max="20"
              value={plan.household_members ?? ''}
              onChange={(e) => update('household_members', e.target.value ? Number(e.target.value) : null)}
            />
          </label>
        </div>
      </section>

      {/* ── Nexit Timeline ───────────────────────────────────────────────── */}
      <section className="card-surface p-6" aria-labelledby="timeline-heading">
        <h2 id="timeline-heading" className="font-semibold text-navy">Move Timeline</h2>
        <p className="mt-1 text-sm text-muted">Select your current stage. Stages are checkpoints, not prescriptions.</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {STAGES.map((stage, index) => (
            <button
              key={stage}
              type="button"
              onClick={() => update('timeline_stage', stage)}
              aria-pressed={plan.timeline_stage === stage}
              className={[
                'rounded-[var(--radius-field)] border px-3 py-4 text-sm font-semibold transition-colors',
                plan.timeline_stage === stage
                  ? 'border-gold bg-gold text-navy'
                  : 'border-line bg-canvas text-muted hover:border-navy/20 hover:text-navy',
              ].join(' ')}
            >
              <span className="block text-xs opacity-65">{index + 1}</span>
              {stage}
            </button>
          ))}
        </div>
      </section>

      {/* ── Checklist and Documents ──────────────────────────────────────── */}
      <div className="grid gap-5 xl:grid-cols-2">
        <ListEditor
          title="Checklist"
          icon={<Check size={17} />}
          items={plan.checklist}
          value={task}
          setValue={setTask}
          onAdd={() => addList('checklist', task, () => setTask(''))}
          onRemove={(item) => update('checklist', plan.checklist.filter((v) => v !== item))}
          suggestions={DEFAULT_TASKS}
          onSuggestion={(item) => { if (!plan.checklist.includes(item)) update('checklist', [...plan.checklist, item]) }}
        />
        <ListEditor
          title="Documents"
          icon={<FileText size={17} />}
          items={plan.documents}
          value={docItem}
          setValue={setDocItem}
          onAdd={() => addList('documents', docItem, () => setDocItem(''))}
          onRemove={(item) => update('documents', plan.documents.filter((v) => v !== item))}
        />
      </div>

      {/* ── Budget and Notes ─────────────────────────────────────────────── */}
      <div className="grid gap-5 xl:grid-cols-2">
        <section className="card-surface p-6" aria-labelledby="budget-heading">
          <h2 id="budget-heading" className="font-semibold text-navy">Budget</h2>
          <p className="mt-1 text-sm text-muted">Blank until you enter your own planning figures.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {(Object.keys(BUDGET_LABELS) as (keyof PlanBudget)[]).map((key) => (
              <label key={key} className="block text-sm font-semibold text-navy">
                {BUDGET_LABELS[key]}
                <input
                  className="field mt-2"
                  type="number"
                  min="0"
                  value={plan.budget[key] ?? ''}
                  onChange={(e) => update('budget', { ...plan.budget, [key]: e.target.value ? Number(e.target.value) : null })}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="card-surface p-6" aria-labelledby="notes-heading">
          <h2 id="notes-heading" className="font-semibold text-navy">Notes</h2>
          <p className="mt-1 text-sm text-muted">Record questions, decisions, and follow-ups.</p>
          <textarea
            className="field mt-4 min-h-44 py-3"
            value={plan.notes ?? ''}
            onChange={(e) => update('notes', e.target.value || null)}
            placeholder="Questions, decisions, and follow-ups…"
            aria-label="Plan notes"
          />
        </section>
      </div>

      {/* ── Greenbook + Flutter Mode ──────────────────────────────────────── */}
      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-[var(--radius-card)] bg-teal-soft p-6">
          <p className="font-semibold text-teal-deep">Greenbook Insights</p>
          <h2 className="mt-1 text-lg font-bold text-navy">Add community context to your plan.</h2>
          <p className="mt-2 text-sm text-muted">
            Review sourced neighborhood and lived-experience research before making decisions.
          </p>
          <Link href="/greenbook" className="mt-4 inline-flex text-sm font-bold text-teal-deep hover:underline">
            Open Greenbook Insights
          </Link>
        </article>
        <article className="rounded-[var(--radius-card)] bg-navy p-6 text-white">
          <Sparkles className="text-gold" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-bold">Ready to move from planning to doing?</h2>
          <button
            type="button"
            disabled={saving || !plan.saved_nextination || !plan.selected_pathway}
            onClick={enterMode}
            className="gold-button mt-5"
          >
            Enter Flutter Mode
          </button>
          <p className="mt-2 text-xs text-white/55">Choose a Destination and Pathway first.</p>
        </article>
      </div>

      {/* ── Sticky save bar ──────────────────────────────────────────────── */}
      <div className="sticky bottom-4 flex flex-wrap items-center justify-end gap-4 rounded-[var(--radius-card)] border border-line bg-white/95 p-4 shadow-[var(--shadow-shell)] backdrop-blur">
        <p role="status" className="mr-auto text-sm font-semibold text-muted">{message}</p>
        <button
          type="button"
          disabled={saving}
          onClick={() => save()}
          className="gold-button"
        >
          {saving ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
          {saving ? 'Saving…' : 'Save My Plan'}
        </button>
      </div>
    </div>
  )
}
