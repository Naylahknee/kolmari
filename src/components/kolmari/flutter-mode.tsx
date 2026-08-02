'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Check, ChevronDown, Circle, LoaderCircle, Share2, SquarePen, Star } from 'lucide-react'
import type { RelocationProfile } from '@/lib/profile'
import type { NextAction } from '@/lib/plan-types'

// ─── The Waiting Room ───────────────────────────────────────────────────
//
// Flutter Mode is the doing phase: the plan is decided, and the work is
// crossing requirements off. These groups are the move logistics that sit
// either side of the visa itself — generic to any international move, so no
// country-specific procedure is asserted here.

const GROUPS = [
  { title: 'Before you go', tasks: ['Passport valid', 'Research Pathways', 'Request official records', 'Arrange travel insurance'] },
  { title: 'Documents', tasks: ['Prepare visa application', 'Make certified copies', 'Store digital document backups'] },
  { title: 'Finances', tasks: ['Build a three-month emergency fund', 'Open international bank account', 'Notify current bank'] },
  { title: 'Housing', tasks: ['Research neighborhoods', 'Book initial accommodation', 'Plan utilities and internet'] },
  { title: 'Shipping & customs', tasks: ['Make an itemized inventory of belongings (many countries require it for duty-free clearance)', 'Get international shipping or moving quotes', 'Decide what to ship vs. replace on arrival', 'Insure your shipment'] },
  { title: 'Winding down at home', tasks: ['Cancel or transfer utilities and subscriptions', 'Set up mail forwarding', 'Notify your bank and tax authority of your move', 'Plan your goodbyes'] },
  { title: 'Arrival day', tasks: ['Map your airport → first accommodation route', 'Get a local SIM or eSIM', 'Register your local address', 'Locate the nearest pharmacy and clinic'] },
]

const APP_STATUS = ['Not filed', 'Submitted', 'Biometrics', 'Decision pending', 'Approved'] as const
const APP_STATUS_KEY = 'kolmari:app-status'

export type ReadinessBar = { label: string; pct: number | null; detail: string }
export type ProtocolItem = { id: string; text: string; state: 'done' | 'overdue' | 'open'; meta: string }
export type SavedDestination = { slug: string; name: string; code: string; region: string; match: number | null; note: string }
export type GreenbookSpot = { city: string; communityFit: string; note: string; sourceTitle: string; sourceUrl: string; lastReviewed: string } | null

const PROTOCOL_TONE: Record<ProtocolItem['state'], string> = {
  done: 'bg-teal-soft text-teal-deep',
  overdue: 'bg-[#fdeaee] text-[#b3243c]',
  open: 'bg-gold-soft text-warn',
}
const PROTOCOL_LABEL: Record<ProtocolItem['state'], string> = {
  done: 'Complete', overdue: 'Overdue', open: 'In progress',
}

export function FlutterMode({
  initial, destination, readinessPct, readinessDone, readinessTotal, bars, action, actionDue,
  protocolItems, protocolDone, greenbook, destinations,
}: {
  initial: RelocationProfile
  destination: string | null
  readinessPct: number
  readinessDone: number
  readinessTotal: number
  bars: ReadinessBar[]
  action: NextAction | null
  actionDue: string | null
  protocolItems: ProtocolItem[]
  protocolDone: number
  greenbook: GreenbookSpot
  destinations: SavedDestination[]
}) {
  const [completed, setCompleted] = useState(initial.completed_tasks)
  const [saving, setSaving] = useState('')
  const [error, setError] = useState('')
  const [open, setOpen] = useState<string[]>([GROUPS[0].title])
  const [statusIndex, setStatusIndex] = useState(0)

  const allTasks = GROUPS.flatMap((group) => group.tasks)
  const pct = allTasks.length ? Math.round((completed.length / allTasks.length) * 100) : 0

  useEffect(() => {
    // Self-reported application status — Kolmari never sets this for the user.
    try {
      const raw = window.localStorage.getItem(APP_STATUS_KEY)
      const i = raw ? APP_STATUS.indexOf(raw as (typeof APP_STATUS)[number]) : -1
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      if (i >= 0) setStatusIndex(i)
    } catch { /* ignore */ }
  }, [])

  function setStatus(i: number) {
    setStatusIndex(i)
    try { window.localStorage.setItem(APP_STATUS_KEY, APP_STATUS[i]) } catch { /* ignore */ }
  }

  async function toggle(task: string) {
    const next = completed.includes(task) ? completed.filter((item) => item !== task) : [...completed, task]
    const previous = completed
    setCompleted(next); setSaving(task); setError('')
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed_tasks: next }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Unable to save this task.')
    } catch (reason) {
      setCompleted(previous)
      setError(reason instanceof Error ? reason.message : 'Unable to save this task.')
    } finally { setSaving('') }
  }

  return (
    <div className="space-y-4">
      {/* Header — says plainly what fluttering is */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold-deep">Plan</p>
          <h1 className="mt-1 text-[26px] font-bold tracking-[-0.02em] text-navy">Flutter Mode</h1>
          <p className="mt-1.5 max-w-[70ch] text-[13.5px] leading-[1.62] text-muted">
            Fluttering is the doing phase. The decision is made{destination ? ` — you are moving to ${destination}` : ''};
            now you work the list, cross requirements off, and wait well. Progress saves as you go.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-btn)] border border-line bg-white px-3 text-[12.5px] font-semibold text-navy hover:bg-canvas">
            <Share2 size={13} aria-hidden="true" /> Share report
          </button>
          <Link href="/my-plan" className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-btn)] bg-navy px-3 text-[12.5px] font-bold text-white hover:bg-navy-deep">
            <SquarePen size={13} aria-hidden="true" /> Edit timeline
          </Link>
        </div>
      </header>

      {error && (
        <p role="alert" className="rounded-[var(--radius-card)] border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">{error}</p>
      )}

      {/* Readiness · Immediate priority · Application status */}
      <div className="grid items-stretch gap-4 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        <section className="rounded-[var(--radius-card)] border border-line bg-white px-5 pb-5 pt-[18px] shadow-tile" aria-labelledby="readiness-heading">
          <p id="readiness-heading" className="text-center text-[10px] font-bold uppercase tracking-[0.12em] text-gold-deep">Kolmari Readiness</p>
          <div className="mt-3 flex justify-center">
            <ReadinessDial pct={readinessPct} done={readinessDone} total={readinessTotal} />
          </div>
          <div className="mt-4 space-y-2.5 border-t border-[#f0f3f7] pt-3.5">
            {bars.map((bar) => (
              <div key={bar.label}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[12px] font-semibold text-navy">{bar.label}</span>
                  <span className="text-[12px] font-bold text-muted">{bar.pct === null ? 'Not started' : `${bar.pct}%`}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-pill bg-[#eef1f6]">
                  <div className="h-full rounded-pill bg-gold" style={{ width: `${bar.pct ?? 0}%` }} />
                </div>
                <p className="mt-0.5 text-[10.5px] text-muted-soft">{bar.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="flex flex-col rounded-[var(--radius-card)] px-5 py-5 text-white shadow-shell"
          style={{ background: 'linear-gradient(135deg,#0d1b39 0%,#17305b 58%,#1b3f68 100%)' }}
          aria-labelledby="priority-heading"
        >
          <span className="w-fit rounded-pill bg-gold px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.1em] text-navy-deep">
            Immediate priority
          </span>
          <h2 id="priority-heading" className="mt-3 text-[19px] font-bold leading-tight tracking-[-0.015em]">
            {action?.title ?? 'Nothing outstanding'}
          </h2>
          <p className="mt-2 text-[12.8px] leading-[1.6] text-white/75">
            {action?.detail ?? 'No open deadline on your plan right now.'}
          </p>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-white/50">Deadline</p>
              <p className="mt-0.5 text-[13px] font-bold">{actionDue ?? 'None set'}</p>
            </div>
            <Link
              href={action && action.tab !== 'overview' ? `/my-plan?tab=${action.tab}` : '/my-plan'}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-btn)] bg-gold px-3.5 text-[12.5px] font-bold text-navy-deep hover:bg-[#e0b40c]"
            >
              Open My Plan <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>

      <div className="grid items-stretch gap-4 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        <section className="rounded-[var(--radius-card)] border border-line bg-white px-5 pb-5 pt-[18px] shadow-tile" aria-labelledby="app-status-heading">
          <h2 id="app-status-heading" className="text-[15px] font-bold text-navy">Application status</h2>
          <p className="mt-0.5 text-[11.5px] text-muted">Tap where you are. This is your own tracker — Kolmari never marks it for you.</p>
          <ol className="mt-3 flex flex-wrap gap-2">
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
                      'rounded-pill border px-2.5 py-1 text-[11.5px] font-semibold transition-colors',
                      active ? 'border-gold bg-gold text-navy-deep' : done ? 'border-ok/40 bg-ok/10 text-ok' : 'border-line bg-white text-muted hover:border-gold/40',
                    ].join(' ')}
                  >
                    {done && <Check size={11} className="mr-1 inline" aria-hidden="true" />}{label}
                  </button>
                </li>
              )
            })}
          </ol>
        </section>

        {/* Move readiness across the Waiting Room list */}
        <section className="flex flex-col justify-center rounded-[var(--radius-card)] border border-line bg-white px-5 py-4 shadow-tile">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[15px] font-bold text-navy">Move readiness</p>
            <p className="mt-0.5 text-[11.5px] text-muted">{completed.length} of {allTasks.length} complete</p>
          </div>
          <strong className="text-[22px] font-extrabold text-navy">{pct}%</strong>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-pill bg-[#eef1f6]">
          <div className="h-full rounded-pill bg-gold transition-[width]" style={{ width: `${pct}%` }} />
        </div>
        </section>
      </div>

      {/* Protocol checklist · Greenbook Intelligence */}
      <div className="grid items-start gap-4 [grid-template-columns:repeat(auto-fit,minmax(340px,1fr))]">
        <section className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-tile" aria-labelledby="protocol-heading">
          <div className="flex items-baseline justify-between gap-3 border-b border-line px-5 pb-3 pt-[15px]">
            <h2 id="protocol-heading" className="text-[15px] font-bold text-navy">Kolmari Protocol Checklist</h2>
            <span className="text-[11px] text-muted-soft">
              {protocolItems.length ? `${protocolDone} of ${protocolItems.length} completed` : 'No tasks yet'}
            </span>
          </div>
          {protocolItems.length ? (
            <ul>
              {protocolItems.map((item) => (
                <li key={item.id} className="flex items-start gap-3 border-b border-[#f0f3f7] px-5 py-3 last:border-b-0">
                  <span className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-pill ${item.state === 'done' ? 'bg-teal text-white' : 'border-2 border-line-strong'}`} aria-hidden="true">
                    {item.state === 'done' && <Check size={10} strokeWidth={3} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.8px] font-semibold leading-[1.4] text-navy">{item.text}</span>
                    <span className="mt-0.5 block text-[11px] text-muted-soft">{item.meta}</span>
                  </span>
                  <span className={`shrink-0 rounded-pill px-2 py-0.5 text-[9.5px] font-bold ${PROTOCOL_TONE[item.state]}`}>
                    {PROTOCOL_LABEL[item.state]}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-5 text-[12.5px] leading-6 text-muted">
              Your plan checklist is empty. <Link href="/my-plan?tab=checklist" className="font-bold text-gold-deep">Add your first task</Link>.
            </p>
          )}
        </section>

        <section className="rounded-[var(--radius-card)] border border-line bg-white px-5 pb-5 pt-[15px] shadow-tile" aria-labelledby="greenbook-heading">
          <div className="flex items-center gap-2">
            <Star size={15} className="text-gold-deep" aria-hidden="true" />
            <h2 id="greenbook-heading" className="text-[15px] font-bold text-navy">Greenbook Insights</h2>
          </div>
          {greenbook ? (
            <>
              <p className="mt-3 text-[13px] font-bold text-navy">Community Fit: {greenbook.communityFit}</p>
              <p className="mt-1.5 text-[12.5px] leading-[1.65] text-muted">{greenbook.note}</p>
              <p className="mt-3 border-t border-[#f0f3f7] pt-2.5 text-[10.5px] text-muted-soft">
                {greenbook.city} · reviewed {greenbook.lastReviewed} ·{' '}
                <a href={greenbook.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-gold-deep underline-offset-4 hover:underline">
                  {greenbook.sourceTitle}
                </a>
              </p>
              <Link href="/greenbook" className="mt-3 inline-flex min-h-9 w-full items-center justify-center rounded-[var(--radius-btn)] border border-line text-[12.5px] font-semibold text-navy hover:bg-canvas">
                View all Greenbook Insights
              </Link>
            </>
          ) : (
            <p className="mt-3 text-[12.5px] leading-6 text-muted">
              {destination
                ? `No Greenbook Insight has been published for ${destination} yet.`
                : 'Choose a destination on your plan to see its Greenbook Insight.'}{' '}
              <Link href="/greenbook" className="font-bold text-gold-deep">Open Greenbook</Link>
            </p>
          )}
        </section>
      </div>

      {/* A moment for the wait */}
      <section className="rounded-[var(--radius-card)] border border-gold/30 bg-gold-soft/30 px-5 py-4">
        <p className="text-[13px] font-bold text-navy">A moment for the wait</p>
        <p className="mt-1 text-[12.5px] leading-[1.65] text-navy/80">
          Waiting is its own kind of work. What&rsquo;s one thing you&rsquo;re looking forward to, and one thing you&rsquo;re
          nervous about? Naming both is how you carry them. There&rsquo;s no wrong answer, and nothing to submit — just a pause.
        </p>
      </section>

      {/* The Waiting Room */}
      <section aria-labelledby="waiting-room-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id="waiting-room-heading" className="text-[16px] font-bold tracking-[-0.01em] text-navy">The Waiting Room</h2>
          <span className="text-[11.5px] text-muted-soft">The move logistics either side of the visa</span>
        </div>
        <div className="mt-3 space-y-2.5">
          {GROUPS.map((group) => {
            const expanded = open.includes(group.title)
            const count = group.tasks.filter((task) => completed.includes(task)).length
            return (
              <section key={group.title} className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-tile">
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? open.filter((item) => item !== group.title) : [...open, group.title])}
                  aria-expanded={expanded}
                  className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left"
                >
                  <span className="flex items-baseline gap-2.5">
                    <strong className="text-[13.5px] font-bold text-navy">{group.title}</strong>
                    <small className="text-[11.5px] text-muted-soft">{count}/{group.tasks.length}</small>
                  </span>
                  <ChevronDown size={16} aria-hidden="true" className={`shrink-0 text-muted transition-transform duration-[var(--duration-standard)] ${expanded ? 'rotate-180' : ''}`} />
                </button>
                {expanded && (
                  <div className="border-t border-line px-5">
                    {group.tasks.map((task) => {
                      const done = completed.includes(task)
                      return (
                        <button
                          key={task}
                          type="button"
                          onClick={() => toggle(task)}
                          disabled={saving === task}
                          className="flex min-h-12 w-full items-center gap-3 border-b border-line/70 py-2 text-left text-[12.8px] last:border-0 disabled:cursor-wait"
                        >
                          <span className={`grid size-5 shrink-0 place-items-center rounded-pill border ${done ? 'border-teal bg-teal text-white' : 'border-line-strong text-muted'}`}>
                            {saving === task ? <LoaderCircle size={12} className="animate-spin" /> : done ? <Check size={12} strokeWidth={3} /> : <Circle size={8} />}
                          </span>
                          <span className={done ? 'text-muted-soft line-through' : 'font-semibold text-navy'}>{task}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </section>

      {/* Saved destinations */}
      <section aria-labelledby="saved-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id="saved-heading" className="text-[16px] font-bold tracking-[-0.01em] text-navy">Saved Destinations</h2>
          <Link href="/destinations" className="text-[12px] font-bold text-info hover:text-navy">Browse all</Link>
        </div>
        {destinations.length ? (
          <div className="mt-3 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
            {destinations.map((item) => (
              <Link
                key={item.slug}
                href={`/nextinations/${item.slug}`}
                className="rounded-[var(--radius-card)] border border-line bg-white px-4 pb-4 pt-3.5 shadow-tile transition-[border-color,background-color] duration-150 hover:border-gold hover:bg-[#fdfbf3]"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="grid h-6 w-[34px] flex-none place-items-center rounded-[4px] bg-navy text-[10.5px] font-bold text-gold" aria-hidden="true">{item.code}</span>
                  {item.match !== null && <span className="text-[12.5px] font-bold text-ok">{item.match}% Match</span>}
                </div>
                <p className="mt-2 text-[14px] font-bold text-navy">{item.name}</p>
                <p className="text-[11px] text-muted-soft">{item.region}</p>
                <p className="mt-2 line-clamp-3 text-[11.5px] leading-[1.55] text-muted">{item.note}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-[var(--radius-card)] border border-line bg-white px-5 py-4 text-[12.5px] text-muted">
            No destinations saved yet. <Link href="/your-world" className="font-bold text-gold-deep">Explore Your World</Link>.
          </p>
        )}
      </section>
    </div>
  )
}

/** Readiness dial. The figure is the share of setup milestones the plan actually records. */
function ReadinessDial({ pct, done, total }: { pct: number; done: number; total: number }) {
  const size = 132, stroke = 11
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${pct}% ready — ${done} of ${total} milestones recorded`}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#eef1f6" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke="var(--color-gold)" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={`${(circumference * pct) / 100} ${circumference}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="46%" dominantBaseline="central" textAnchor="middle" fontSize={26} fontWeight={800} fill="var(--color-navy)">{pct}%</text>
      <text x="50%" y="63%" dominantBaseline="central" textAnchor="middle" fontSize={10} fill="var(--color-muted-soft)">{done} of {total} set</text>
    </svg>
  )
}
