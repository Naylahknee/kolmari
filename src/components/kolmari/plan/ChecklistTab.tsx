'use client'

import { useState } from 'react'
import { ArrowRight, Check, Plus } from 'lucide-react'
import { PLAN_STAGES, formatShortDate, newId, type ChecklistItem, type PlanStage } from '@/lib/plan-types'
import { ProgressBar, type PlanCtx } from './shared'

const SUGGESTED = ['Confirm passport validity', 'Verify official Pathway requirements', 'Research housing areas', 'Review healthcare coverage', 'Compare neighborhoods']
const STAGE_DESC: Record<PlanStage, string> = {
  Explore: 'Research destinations and possibilities.',
  Assess: 'Compare your profile with real requirements.',
  Shortlist: 'Narrow the destinations and pathways worth pursuing.',
  Decide: 'Commit to a destination and pathway.',
  Prepare: 'Finish research, documents, and cost planning before applying.',
  Apply: 'Submit your application and required records.',
  Move: 'Handle logistics for the move itself.',
  'Settle In': 'Get established after you arrive.',
}

export function ChecklistTab({ ctx }: { ctx: PlanCtx }) {
  const { plan, update, goToTab } = ctx
  const items = plan.checklist
  const [text, setText] = useState('')
  const [stage, setStage] = useState<PlanStage>(plan.timeline_stage)
  const [filter, setFilter] = useState<'All' | PlanStage>('All')
  const [editingId, setEditingId] = useState<string | null>(null)

  const doneCount = items.filter((i) => i.done).length
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0

  function setItems(next: ChecklistItem[]) { update('checklist', next) }
  function add(value: string, atStage: PlanStage) {
    const clean = value.trim()
    if (!clean || items.some((i) => i.text.toLowerCase() === clean.toLowerCase())) return
    setItems([...items, { id: newId('c'), text: clean, done: false, stage: atStage, due: null }])
  }
  function patch(id: string, changes: Partial<ChecklistItem>) { setItems(items.map((i) => (i.id === id ? { ...i, ...changes } : i))) }
  function remove(id: string) {
    const item = items.find((i) => i.id === id)
    if (item && !window.confirm(`Delete “${item.text}”?`)) return
    setItems(items.filter((i) => i.id !== id))
    setEditingId(null)
  }

  const rank = (s: PlanStage | null) => (s ? PLAN_STAGES.indexOf(s) : 99)
  const visible = items
    .filter((i) => filter === 'All' || i.stage === filter)
    .sort((a, b) => Number(a.done) - Number(b.done) || rank(a.stage) - rank(b.stage))

  const stageStats = PLAN_STAGES.map((s) => {
    const inStage = items.filter((i) => i.stage === s)
    return { stage: s, total: inStage.length, done: inStage.filter((i) => i.done).length }
  }).filter((s) => s.total > 0)
  const upcoming = items.filter((i) => i.due && !i.done).sort((a, b) => (a.due ?? '').localeCompare(b.due ?? '')).slice(0, 4)

  return (
    <div className="space-y-6">
      {/* Header band */}
      <section className="flex flex-wrap items-center justify-between gap-5 rounded-[18px] border border-[#D8D9DC] bg-[#F3F3F4] p-5 sm:p-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{plan.timeline_stage} stage</p>
          <h2 className="mt-1 text-xl font-bold text-navy">Move checklist</h2>
          <p className="mt-1 text-sm text-muted">General relocation tasks only. Required visa records stay in Documents.</p>
        </div>
        <div className="w-full max-w-[310px]">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-navy">{doneCount} of {items.length} complete</span>
            <span className="text-xs font-bold text-muted">{pct}%</span>
          </div>
          <ProgressBar value={pct} className="mt-2" />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.85fr)_minmax(260px,.85fr)]">
        <div>
          <section className="rounded-[18px] border border-[#D8D9DC] bg-[#F3F3F4] p-5" aria-label="Add and manage checklist tasks">
            <p className="text-sm font-bold text-navy">Add a move task</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <input
                className="field min-w-[180px] flex-1"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(text, stage); setText('') } }}
                placeholder="Add a move task"
                aria-label="New task"
              />
              <select className="field w-auto" value={stage} onChange={(e) => setStage(e.target.value as PlanStage)} aria-label="Task stage">
                {PLAN_STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <button type="button" onClick={() => { add(text, stage); setText('') }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[11px] bg-[#111111] px-5 text-sm font-semibold text-white transition hover:bg-black"><Plus size={15} aria-hidden="true" /> Add task</button>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Filter by stage">
              {(['All', ...PLAN_STAGES] as const).map((f) => (
                <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f} className={['rounded-full px-3 py-1.5 text-xs font-bold transition', filter === f ? 'bg-navy text-white' : 'border border-line text-muted hover:text-navy'].join(' ')}>{f}</button>
              ))}
            </div>

            <ul className="mt-4 divide-y divide-line">
              {visible.length === 0 ? (
                <li className="py-6 text-center text-sm text-muted">{items.length ? 'No tasks in this stage.' : 'No tasks yet — add your first move task above.'}</li>
              ) : visible.map((item) => (
                <li key={item.id} className="py-3">
                  <div className="flex items-center gap-3">
                    <button type="button" role="checkbox" aria-checked={item.done} aria-label={`Mark “${item.text}” ${item.done ? 'incomplete' : 'complete'}`} onClick={() => patch(item.id, { done: !item.done })} className={`grid size-5 shrink-0 place-items-center rounded border ${item.done ? 'border-navy bg-navy text-white' : 'border-line'}`}>
                      {item.done && <Check size={12} strokeWidth={3} />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold ${item.done ? 'text-muted line-through' : 'text-navy'}`}>{item.text}</p>
                      <p className="text-xs text-muted">{item.stage ?? 'Any stage'}{item.done ? '' : item.due ? ` · Due ${formatShortDate(item.due)}` : ''}</p>
                    </div>
                    <button type="button" onClick={() => setEditingId(editingId === item.id ? null : item.id)} className="shrink-0 rounded-[var(--radius-btn)] border border-line px-3 py-1.5 text-xs font-bold text-navy hover:bg-canvas">Edit</button>
                  </div>
                  {editingId === item.id && (
                    <div className="mt-3 grid gap-2 rounded-[var(--radius-field)] bg-canvas p-3 sm:grid-cols-[1fr_auto_auto]">
                      <input className="field" value={item.text} onChange={(e) => patch(item.id, { text: e.target.value })} aria-label="Task title" />
                      <select className="field w-auto" value={item.stage ?? ''} onChange={(e) => patch(item.id, { stage: (e.target.value || null) as PlanStage | null })} aria-label="Stage">
                        <option value="">Any stage</option>
                        {PLAN_STAGES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      <input className="field w-auto" type="date" value={item.due ?? ''} onChange={(e) => patch(item.id, { due: e.target.value || null })} aria-label="Due date" />
                      <button type="button" onClick={() => remove(item.id)} className="text-xs font-bold text-danger hover:underline sm:col-span-3 sm:justify-self-start">Delete task</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-[18px] border border-[#D8D9DC] bg-[#F3F3F4] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Current stage</p>
            <h3 className="mt-1 text-lg font-bold text-navy">{plan.timeline_stage}</h3>
            <p className="mt-1 text-xs text-muted">{STAGE_DESC[plan.timeline_stage]}</p>
            <dl className="mt-3 space-y-2 text-sm">
              {stageStats.length === 0 ? <p className="text-xs text-muted">Add tasks to see stage progress.</p> : stageStats.map((s) => (
                <div key={s.stage} className="flex items-center justify-between">
                  <dt className="text-muted">{s.stage}</dt>
                  <dd className="font-bold text-navy">{s.done === s.total ? 'Complete' : `${s.done} of ${s.total}`}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-[18px] border border-[#D8D9DC] bg-[#F3F3F4] p-5">
            <p className="text-base font-bold text-navy">Upcoming</p>
            <p className="mt-0.5 text-xs text-muted">The next checklist deadlines.</p>
            <ul className="mt-3 space-y-2 text-sm">
              {upcoming.length === 0 ? <li className="text-xs text-muted">No checklist deadlines yet. Add a due date when you edit a task.</li> : upcoming.map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate font-semibold text-navy">{i.text}</span>
                  <span className="shrink-0 text-xs font-bold text-gold-deep">{formatShortDate(i.due)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[18px] border border-[#D8D9DC] bg-[#F3F3F4] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Visa records</p>
            <p className="mt-1 text-sm font-semibold text-navy">Apostilles, translations, and uploads belong in Documents — not this checklist.</p>
            <button type="button" onClick={() => goToTab('documents')} className="mt-3 inline-flex items-center gap-1 rounded-[11px] border border-[#D8D9DC] bg-white px-3.5 py-2 text-xs font-bold text-navy hover:bg-[#F8F8F8]">Open Documents <ArrowRight size={13} aria-hidden="true" /></button>
          </section>
        </aside>
      </div>

      <section className="rounded-[18px] border border-[#D8D9DC] bg-[#F3F3F4] p-5">
        <p className="text-base font-bold text-navy">Suggested next tasks</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTED.filter((s) => !items.some((i) => i.text.toLowerCase() === s.toLowerCase())).map((s) => (
            <button key={s} type="button" onClick={() => add(s, plan.timeline_stage)} className="rounded-[11px] border border-[#D8D9DC] bg-white px-3 py-2 text-xs font-medium text-navy hover:bg-[#F8F8F8]">+ {s}</button>
          ))}
        </div>
      </section>
    </div>
  )
}
