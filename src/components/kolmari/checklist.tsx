'use client'

import { useState } from 'react'
import { Check, ChevronDown, Circle, LoaderCircle } from 'lucide-react'
import type { RelocationProfile } from '@/lib/profile'

const groups = [
  { title: 'Before you go', tasks: ['Passport valid', 'Research Pathways', 'Request official records', 'Arrange travel insurance'] },
  { title: 'Documents', tasks: ['Prepare visa application', 'Make certified copies', 'Store digital document backups'] },
  { title: 'Finances', tasks: ['Build a three-month emergency fund', 'Open international bank account', 'Notify current bank'] },
  { title: 'Housing', tasks: ['Research neighborhoods', 'Book initial accommodation', 'Plan utilities and internet'] },
  { title: 'After you arrive', tasks: ['Register local address', 'Get a local SIM', 'Schedule residence appointment'] },
]

export function MoveChecklist({ initial }: { initial: RelocationProfile }) {
  const [completed, setCompleted] = useState(initial.completed_tasks)
  const [saving, setSaving] = useState('')
  const [error, setError] = useState('')
  const [open, setOpen] = useState(groups.map((group) => group.title))
  const allTasks = groups.flatMap((group) => group.tasks)

  async function toggle(task: string) {
    const next = completed.includes(task) ? completed.filter((item) => item !== task) : [...completed, task]
    const previous = completed
    setCompleted(next)
    setSaving(task)
    setError('')
    try {
      const response = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ completed_tasks: next }) })
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
    <div className="mx-auto max-w-4xl"><div><p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Flutter Mode</p><h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">Kolmari Tracker</h1><p className="mt-3 text-muted">Complete your Move Plan one verified step at a time. Progress saves automatically.</p></div>{error ? <p role="alert" className="mt-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p> : null}<section className="card-surface mt-7 p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="text-sm font-bold">Kolmari Readiness</p><p className="mt-1 text-xs text-muted">{completed.length} of {allTasks.length} complete</p></div><strong className="text-2xl">{Math.round(completed.length / allTasks.length * 100)}%</strong></div><div className="mt-4 h-2.5 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-gold transition-all" style={{ width: `${completed.length / allTasks.length * 100}%` }} /></div></section><div className="mt-5 space-y-4">{groups.map((group) => { const expanded = open.includes(group.title); const count = group.tasks.filter((task) => completed.includes(task)).length; return <section key={group.title} className="card-surface overflow-hidden"><button type="button" onClick={() => setOpen(expanded ? open.filter((item) => item !== group.title) : [...open, group.title])} className="flex w-full items-center justify-between p-5 text-left"><span><strong>{group.title}</strong><small className="ml-3 text-muted">{count}/{group.tasks.length}</small></span><ChevronDown size={18} className={`transition ${expanded ? 'rotate-180' : ''}`} /></button>{expanded ? <div className="border-t border-line px-5 py-2">{group.tasks.map((task) => { const done = completed.includes(task); return <button key={task} type="button" onClick={() => toggle(task)} disabled={saving === task} className="flex min-h-14 w-full items-center gap-3 border-b border-line/70 text-left text-sm last:border-0 disabled:cursor-wait"><span className={`grid size-6 shrink-0 place-items-center rounded-full border ${done ? 'border-ok bg-ok text-white' : 'border-line text-muted'}`}>{saving === task ? <LoaderCircle size={14} className="animate-spin" /> : done ? <Check size={14} /> : <Circle size={10} />}</span><span className={done ? 'text-muted line-through' : 'font-semibold'}>{task}</span></button>})}</div> : null}</section> })}</div></div>
  )
}

