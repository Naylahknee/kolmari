'use client'

import { useEffect, useState } from 'react'
import { Check, ChevronDown, Circle, LoaderCircle } from 'lucide-react'
import type { RelocationProfile } from '@/lib/profile'

const groups = [
  { title: 'Before you go', tasks: ['Passport valid', 'Research Pathways', 'Request official records', 'Arrange travel insurance'] },
  { title: 'Documents', tasks: ['Prepare visa application', 'Make certified copies', 'Store digital document backups'] },
  { title: 'Finances', tasks: ['Build a three-month emergency fund', 'Open international bank account', 'Notify current bank'] },
  { title: 'Housing', tasks: ['Research neighborhoods', 'Book initial accommodation', 'Plan utilities and internet'] },
  // ── The Waiting Room: the non-visa move logistics competitors go quiet on ──
  { title: 'Shipping & customs', tasks: ['Make an itemized inventory of belongings (many countries require it for duty-free clearance)', 'Get international shipping or moving quotes', 'Decide what to ship vs. replace on arrival', 'Insure your shipment'] },
  { title: 'Winding down in the US', tasks: ['Cancel or transfer US utilities and subscriptions', 'Set up mail forwarding', 'Notify your bank and the IRS of your move', 'Plan your goodbyes'] },
  { title: 'Arrival day', tasks: ['Map your airport → first accommodation route', 'Get a local SIM or eSIM', 'Register your local address', 'Locate the nearest pharmacy and clinic'] },
]

const APP_STATUS = ['Not filed', 'Submitted', 'Biometrics', 'Decision pending', 'Approved'] as const
const APP_STATUS_KEY = 'kolmari:app-status'

export function MoveChecklist({ initial }: { initial: RelocationProfile }) {
  const [completed, setCompleted] = useState(initial.completed_tasks)
  const [saving, setSaving] = useState('')
  const [error, setError] = useState('')
  const [open, setOpen] = useState(groups.map((group) => group.title))
  const [statusIndex, setStatusIndex] = useState(0)
  const allTasks = groups.flatMap((group) => group.tasks)
  const pct = allTasks.length ? Math.round((completed.length / allTasks.length) * 100) : 0

  useEffect(() => {
    // Self-reported application status is client-only for now.
    try {
      const raw = window.localStorage.getItem(APP_STATUS_KEY)
      const i = raw ? APP_STATUS.indexOf(raw as (typeof APP_STATUS)[number]) : -1
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      if (i >= 0) setStatusIndex(i)
    } catch {
      /* ignore */
    }
  }, [])

  function setStatus(i: number) {
    setStatusIndex(i)
    try {
      window.localStorage.setItem(APP_STATUS_KEY, APP_STATUS[i])
    } catch {
      /* ignore */
    }
  }

  async function toggle(task: string) {
    const next = completed.includes(task) ? completed.filter((item) => item !== task) : [...completed, task]
    const previous = completed
    setCompleted(next)
    setSaving(task)
    setError('')
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed_tasks: next }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Unable to save this task.')
    } catch (reason) {
      setCompleted(previous)
      setError(reason instanceof Error ? reason.message : 'Unable to save this task.')
    } finally {
      setSaving('')
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Flutter Mode</p>
        <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">The Waiting Room</h1>
        <p className="mt-3 text-muted">
          The hardest part is the gap between committing and arriving — the wait. This is where you flex your wings:
          track your application, work the move logistics, and take care of yourself. Progress saves automatically.
        </p>
      </div>

      {error ? (
        <p role="alert" className="mt-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p>
      ) : null}

      {/* Application status — self-reported */}
      <section className="card-surface mt-7 p-5 sm:p-7" aria-labelledby="app-status-heading">
        <p id="app-status-heading" className="text-sm font-bold text-navy">Application status</p>
        <p className="mt-1 text-xs text-muted">Tap where you are. This is your own tracker — Kolmari never marks it for you.</p>
        <ol className="mt-4 flex flex-wrap gap-2">
          {APP_STATUS.map((label, i) => {
            const done = i < statusIndex
            const active = i === statusIndex
            return (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => setStatus(i)}
                  aria-current={active ? 'step' : undefined}
                  className={[
                    'rounded-pill border px-3 py-1.5 text-xs font-bold transition',
                    active ? 'border-gold bg-gold text-navy-deep' : done ? 'border-ok/40 bg-ok/10 text-ok' : 'border-line bg-white text-muted hover:border-gold/40',
                  ].join(' ')}
                >
                  {done ? <Check size={12} className="mr-1 inline" /> : null}
                  {label}
                </button>
              </li>
            )
          })}
        </ol>
      </section>

      {/* Move Readiness meter */}
      <section className="card-surface mt-5 p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold">Move Readiness</p>
            <p className="mt-1 text-xs text-muted">{completed.length} of {allTasks.length} complete</p>
          </div>
          <strong className="text-2xl">{pct}%</strong>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${pct}%` }} />
        </div>
      </section>

      {/* Emotional check-in */}
      <section className="mt-5 rounded-[var(--radius-card)] border border-gold/30 bg-gold-soft/30 p-5 sm:p-6">
        <p className="text-sm font-bold text-navy">A moment for the wait</p>
        <p className="mt-1 text-sm leading-6 text-navy/80">
          Waiting is its own kind of work. What&rsquo;s one thing you&rsquo;re looking forward to, and one thing you&rsquo;re nervous
          about? Naming both is how you carry them. There&rsquo;s no wrong answer, and nothing to submit — just a pause.
        </p>
      </section>

      {/* Checklists */}
      <div className="mt-5 space-y-4">
        {groups.map((group) => {
          const expanded = open.includes(group.title)
          const count = group.tasks.filter((task) => completed.includes(task)).length
          return (
            <section key={group.title} className="card-surface overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(expanded ? open.filter((item) => item !== group.title) : [...open, group.title])}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span>
                  <strong>{group.title}</strong>
                  <small className="ml-3 text-muted">{count}/{group.tasks.length}</small>
                </span>
                <ChevronDown size={18} className={`transition ${expanded ? 'rotate-180' : ''}`} />
              </button>
              {expanded ? (
                <div className="border-t border-line px-5 py-2">
                  {group.tasks.map((task) => {
                    const done = completed.includes(task)
                    return (
                      <button
                        key={task}
                        type="button"
                        onClick={() => toggle(task)}
                        disabled={saving === task}
                        className="flex min-h-14 w-full items-center gap-3 border-b border-line/70 text-left text-sm last:border-0 disabled:cursor-wait"
                      >
                        <span className={`grid size-6 shrink-0 place-items-center rounded-full border ${done ? 'border-ok bg-ok text-white' : 'border-line text-muted'}`}>
                          {saving === task ? <LoaderCircle size={14} className="animate-spin" /> : done ? <Check size={14} /> : <Circle size={10} />}
                        </span>
                        <span className={done ? 'text-muted line-through' : 'font-semibold'}>{task}</span>
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </section>
          )
        })}
      </div>
    </div>
  )
}
