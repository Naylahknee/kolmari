'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BellRing, Check, ChevronDown, Circle, LoaderCircle, Plus, Share2 } from 'lucide-react'
import type { RelocationProfile } from '@/lib/profile'
import type { NextAction } from '@/lib/plan-types'
import { FLUTTER_GROUPS as GROUPS } from '@/lib/flutter-plan'

// The visa/residency application journey — this is a real, sequential status,
// distinct from the move-readiness task checklist below.
const APP_STATUS = ['Not filed', 'Submitted', 'Biometrics', 'Decision pending', 'Approved'] as const
const APP_STATUS_KEY = 'kolmari:visa-application-status'

export type ProtocolItem = { id: string; text: string; state: 'done' | 'overdue' | 'open'; meta: string }

export function FlutterMode({ initial, destination, action, actionDue, protocolItems }: {
  initial: RelocationProfile
  destination: string | null
  action: NextAction | null
  actionDue: string | null
  protocolItems: ProtocolItem[]
}) {
  const [completed, setCompleted] = useState(initial.completed_tasks)
  const [saving, setSaving] = useState('')
  const [error, setError] = useState('')
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [statusIndex, setStatusIndex] = useState(0)

  const allTasks = useMemo(() => GROUPS.flatMap((group) => group.tasks), [])
  const completedSet = useMemo(() => new Set(completed), [completed])
  const completedCount = allTasks.filter((task) => completedSet.has(task)).length
  const readinessPct = allTasks.length ? Math.round((completedCount / allTasks.length) * 100) : 0
  const nextTasks = allTasks.filter((task) => !completedSet.has(task)).slice(0, 3)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(APP_STATUS_KEY)
      const i = raw ? APP_STATUS.indexOf(raw as (typeof APP_STATUS)[number]) : -1
      if (i >= 0) setStatusIndex(i)
    } catch { /* ignore */ }
  }, [])

  function setStatus(i: number) {
    setStatusIndex(i)
    try { window.localStorage.setItem(APP_STATUS_KEY, APP_STATUS[i]) } catch { /* ignore */ }
  }

  async function toggle(task: string) {
    const next = completedSet.has(task) ? completed.filter((item) => item !== task) : [...completed, task]
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
    <div className="mx-auto max-w-[1180px] space-y-5 pb-10">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-deep">Flutter Mode</p>
          <p className="mt-1 text-sm text-muted">{destination ? `Your move to ${destination}` : 'Your relocation execution workspace'}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="inline-flex min-h-9 items-center gap-2 rounded-[var(--radius-btn)] border border-line bg-white px-3 text-xs font-bold text-navy hover:bg-canvas"><Share2 size={14} aria-hidden="true" /> Share report</button>
          <Link href="/my-plan" className="inline-flex min-h-9 items-center gap-2 rounded-[var(--radius-btn)] bg-navy px-3 text-xs font-bold text-white hover:bg-navy-deep">Open My Plan <ArrowRight size={14} aria-hidden="true" /></Link>
        </div>
      </header>

      {error && <p role="alert" className="rounded-[var(--radius-card)] border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p>}

      {/* When there is an immediate priority the bar reads red (attention);
          with no urgent task it reads green (all clear). */}
      <section className={`rounded-[var(--radius-card)] border px-5 py-4 shadow-tile ${action ? 'border-danger/25 bg-[#fff7f7]' : 'border-ok/30 bg-[#f2fbf5]'}`} aria-labelledby="priority-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className={`grid size-10 shrink-0 place-items-center rounded-full text-white ${action ? 'bg-danger' : 'bg-ok'}`}>{action ? <BellRing size={18} aria-hidden="true" /> : <Check size={18} aria-hidden="true" />}</span>
            <div className="min-w-0"><p className={`text-[10px] font-extrabold uppercase tracking-[0.12em] ${action ? 'text-danger' : 'text-ok'}`}>{action ? 'Immediate priority' : 'All clear'}</p><h1 id="priority-heading" className="mt-1 text-lg font-extrabold text-navy">{action?.title ?? 'No urgent task right now'}</h1><p className="mt-1 text-sm text-muted">{action?.detail ?? 'Your plan has no current blocker or dated action.'}{actionDue ? ` · Due ${actionDue}` : ''}</p></div>
          </div>
          <Link href={action && action.tab !== 'overview' ? `/my-plan?tab=${action.tab}` : '/my-plan'} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-btn)] bg-navy px-4 text-sm font-bold text-white hover:bg-navy-deep">{action ? 'Take action' : 'Open My Plan'} <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-tile" aria-labelledby="readiness-heading">
        <div className="grid gap-6 lg:grid-cols-[150px_minmax(0,1fr)_280px] lg:items-center">
          <div className="mx-auto grid size-28 place-items-center rounded-full" style={{ background: `conic-gradient(var(--gold) ${readinessPct * 3.6}deg,#edf1f5 0deg)` }}><div className="grid size-20 place-items-center rounded-full bg-white text-center"><div><strong className="block text-2xl font-extrabold text-navy">{readinessPct}%</strong><span className="text-[9px] font-bold uppercase tracking-wider text-muted">Ready</span></div></div></div>
          <div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Overall move readiness</p><h2 id="readiness-heading" className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-navy">{readinessPct >= 85 ? "You're almost there." : readinessPct >= 50 ? 'Your move is taking shape.' : 'Build your move one task at a time.'}</h2><p className="mt-2 text-sm leading-6 text-muted">{completedCount} of {allTasks.length} tasks complete across all planning areas. Focus on the next unfinished category.</p></div>
          <div className="space-y-2">{GROUPS.slice(0, 5).map((group) => { const done = group.tasks.filter((task) => completedSet.has(task)).length; return <div key={group.title} className="flex items-center justify-between rounded-pill border border-line px-3 py-1.5 text-xs font-bold text-navy"><span>{group.title}</span><span>{done}/{group.tasks.length}</span></div> })}</div>
        </div>
      </section>

      <section className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-tile" aria-labelledby="application-heading">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Visa application status</p><h2 id="application-heading" className="mt-1 text-xl font-extrabold text-navy">Where are you in your visa application?</h2><p className="mt-1 text-sm text-muted">Track your residency/visa filing from submission to decision.</p></div><span className="rounded-pill bg-canvas px-3 py-1.5 text-xs font-bold text-muted">Saved on this device</span></div>
        <ol className="mt-7 grid gap-3 sm:grid-cols-5">{APP_STATUS.map((label, i) => { const done = i < statusIndex; const active = i === statusIndex; return <li key={label}><button type="button" onClick={() => setStatus(i)} aria-current={active ? 'step' : undefined} className="group flex w-full flex-col items-center text-center"><span className={`grid size-9 place-items-center rounded-full border-2 text-xs font-extrabold ${active ? 'border-gold bg-gold text-navy' : done ? 'border-navy bg-navy text-white' : 'border-line bg-white text-muted'}`}>{done ? <Check size={15} /> : i + 1}</span><span className={`mt-2 text-xs font-semibold ${active ? 'text-navy' : 'text-muted'}`}>{label}</span>{active && <span className="mt-1 text-[9px] font-extrabold uppercase tracking-wider text-gold-deep">You are here</span>}</button></li> })}</ol>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,.75fr)]">
        <section className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-tile" aria-labelledby="left-heading">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Move readiness</p><h2 id="left-heading" className="mt-1 text-xl font-extrabold text-navy">What’s left, at a glance</h2>
          <div className="mt-5 rounded-[var(--radius-card)] bg-navy-deep p-4 text-white"><div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gold"><span>Next up</span><span>{nextTasks.length} incomplete tasks</span></div><div className="mt-3 space-y-2">{nextTasks.length ? nextTasks.map((task) => <button key={task} type="button" onClick={() => toggle(task)} className="flex w-full items-center gap-3 rounded-[var(--radius-btn)] bg-white/7 px-3 py-3 text-left hover:bg-white/12"><Circle size={17} className="shrink-0 text-white/55" /><span className="min-w-0 flex-1 text-sm font-semibold">{task}</span><ArrowRight size={14} className="text-white/40" /></button>) : <p className="py-5 text-center text-sm text-white/70">All move-readiness tasks are complete.</p>}</div></div>
          <div className="mt-5 space-y-2">{GROUPS.map((group) => { const done = group.tasks.filter((task) => completedSet.has(task)).length; const groupPct = Math.round((done / group.tasks.length) * 100); const expanded = openGroup === group.title; return <div key={group.title} className="overflow-hidden rounded-[var(--radius-card)] border border-line"><button type="button" onClick={() => setOpenGroup(expanded ? null : group.title)} className="flex w-full items-center gap-3 bg-white px-4 py-3 text-left hover:bg-canvas"><span className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-extrabold ${done === group.tasks.length ? 'bg-navy text-white' : 'bg-gold-soft text-navy'}`}>{done === group.tasks.length ? <Check size={15} /> : group.tasks.length - done}</span><span className="min-w-0 flex-1"><span className="flex items-baseline gap-2"><strong className="text-sm text-navy">{group.title}</strong><span className="text-xs text-muted">{done}/{group.tasks.length}</span></span><span className="mt-2 block h-1.5 overflow-hidden rounded-pill bg-[#eef1f5]"><span className="block h-full rounded-pill bg-gold" style={{ width: `${groupPct}%` }} /></span></span><ChevronDown size={16} className={`text-muted transition-transform ${expanded ? 'rotate-180' : ''}`} /></button>{expanded && <div className="border-t border-line bg-canvas/55 p-3">{group.tasks.map((task) => <button key={task} type="button" onClick={() => toggle(task)} className="flex w-full items-center gap-3 rounded-[var(--radius-btn)] px-3 py-2.5 text-left hover:bg-white"><span className={`grid size-5 shrink-0 place-items-center rounded-full border ${completedSet.has(task) ? 'border-navy bg-navy text-white' : 'border-line bg-white text-transparent'}`}>{saving === task ? <LoaderCircle size={12} className="animate-spin text-navy" /> : <Check size={12} />}</span><span className={`text-sm ${completedSet.has(task) ? 'text-muted line-through' : 'font-semibold text-navy'}`}>{task}</span></button>)}</div>}</div> })}</div>
        </section>

        <section className="rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-tile" aria-labelledby="personal-heading">
          <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Personal tasks</p><h2 id="personal-heading" className="mt-1 text-xl font-extrabold text-navy">Personal checklist</h2></div><Link href="/my-plan?tab=checklist" className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-btn)] bg-navy px-3 text-xs font-bold text-white"><Plus size={13} /> Add task</Link></div>
          <div className="mt-4 divide-y divide-line">{protocolItems.length ? protocolItems.map((item) => <div key={item.id} className="flex items-start gap-3 py-3"><span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border ${item.state === 'done' ? 'border-navy bg-navy text-white' : 'border-line bg-white'}`}>{item.state === 'done' && <Check size={12} />}</span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-navy">{item.text}</span><span className="mt-1 block text-xs text-muted">{item.meta}</span></span></div>) : <p className="py-6 text-sm leading-6 text-muted">No personal tasks yet. Add the life details Kolmari cannot know for you.</p>}</div>
        </section>
      </div>
    </div>
  )
}
