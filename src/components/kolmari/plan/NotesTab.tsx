'use client'

import { useRef } from 'react'
import { formatMonthYear, type PlanStage } from '@/lib/plan-types'
import { SaveChip, type PlanCtx } from './shared'

const PROMPTS = [
  { label: 'Decision', prefix: '[DECISION]: ' },
  { label: 'Question', prefix: '[QUESTION]: ' },
  { label: 'Follow-up', prefix: '[FOLLOW-UP]: ' },
  { label: 'Research finding', prefix: '[RESEARCH]: ' },
]

// Prompts adapt to the user's active move stage to guide research.
const STAGE_PROMPTS: Record<PlanStage, string[]> = {
  Explore: ['What timeline risks could delay this move?', 'Which regions fit our budget and lifestyle?'],
  Assess: ['Do we meet the pathway requirements?', 'What evidence still needs gathering?'],
  Shortlist: ['Which neighborhoods match our budget floor?', 'What are the trade-offs between our top options?'],
  Decide: ['What would make this decision final?', 'Which pathway gives us the best odds?'],
  Prepare: ['Which documents need an apostille or translation?', 'Is the budget realistic for our household?'],
  Apply: ['Have we compiled all required background checks?', 'Are translation and apostille timelines accounted for?'],
  Move: ['What must be booked or shipped, and when?', 'What needs to happen this month?'],
  'Settle In': ['What must we register locally first?', 'What is still unresolved after arriving?'],
}

export function NotesTab({ ctx }: { ctx: PlanCtx }) {
  const { plan, update, saveStatus, savedAtLabel, retry } = ctx
  const ref = useRef<HTMLTextAreaElement>(null)

  function insert(prefix: string) {
    const current = plan.notes ?? ''
    const next = current ? `${current.replace(/\s+$/, '')}\n${prefix}` : prefix
    update('notes', next)
    // Return focus to the notebook so the user can keep typing after the prompt.
    requestAnimationFrame(() => {
      const el = ref.current
      if (el) { el.focus(); el.setSelectionRange(next.length, next.length) }
    })
  }

  return (
    <div className="space-y-6">
      <section className="card-surface flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Private workspace</p>
          <h2 className="mt-1 text-xl font-bold text-navy">Notes and decisions</h2>
          <p className="mt-1 text-sm text-muted">Keep questions, research findings, and follow-ups connected to this plan.</p>
        </div>
        <SaveChip status={saveStatus} onRetry={retry} />
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.85fr)_minmax(260px,.85fr)]">
        <section className="card-surface flex min-h-[620px] flex-col p-5" aria-label="Plan notebook">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-navy">Plan notebook</h3>
              <p className="mt-0.5 text-xs text-muted">One flexible space for planning notes.</p>
            </div>
            {savedAtLabel && <span className="shrink-0 text-xs text-muted">{savedAtLabel}</span>}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {PROMPTS.map((p) => (
              <button key={p.label} type="button" onClick={() => insert(p.prefix)} className="rounded-[var(--radius-btn)] border border-line px-3 py-1.5 text-xs font-bold text-navy hover:border-gold hover:bg-canvas">+ {p.label}</button>
            ))}
          </div>
          <textarea
            ref={ref}
            className="field mt-4 min-h-[380px] flex-1 bg-white px-4 py-4 leading-6"
            value={plan.notes ?? ''}
            onChange={(e) => update('notes', e.target.value || null)}
            placeholder="Record questions, decisions, research findings, and follow-ups…"
            aria-label="Plan notes"
          />
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs text-muted">Autosaves while you type.</p>
            <button type="button" onClick={() => ref.current?.blur()} className="gold-button !min-h-9 !px-4 text-xs">Done editing</button>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="card-surface p-5">
            <p className="text-base font-bold text-navy">Plan context</p>
            <p className="mt-0.5 text-xs text-muted">Keep notes anchored to the plan.</p>
            <dl className="mt-3 space-y-2 text-sm">
              <Ctx label="Destination" value={plan.saved_nextination} />
              <Ctx label="Pathway" value={plan.selected_pathway} />
              <Ctx label="Move stage" value={plan.timeline_stage} />
              <Ctx label="Target" value={formatMonthYear(plan.target_move_date) || null} />
            </dl>
          </section>

          <section className="card-surface p-5">
            <p className="text-base font-bold text-navy">Prompts for your {plan.timeline_stage} stage</p>
            <p className="mt-0.5 text-xs text-muted">Questions that move this stage forward.</p>
            <ul className="mt-3 divide-y divide-line">
              {STAGE_PROMPTS[plan.timeline_stage].map((prompt) => (
                <li key={prompt}>
                  <button type="button" onClick={() => insert(`${prompt} `)} className="w-full py-3 text-left text-sm font-bold text-navy hover:text-gold-deep">{prompt}</button>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[var(--radius-card)] border border-info/25 bg-info-soft p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-info">Private to your workspace</p>
            <p className="mt-1 text-sm font-semibold text-navy">Notes are planning context — not community posts.</p>
          </section>
        </aside>
      </div>
    </div>
  )
}

function Ctx({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className={`font-bold ${value ? 'text-navy' : 'text-muted'}`}>{value ?? 'Not set'}</dd>
    </div>
  )
}
