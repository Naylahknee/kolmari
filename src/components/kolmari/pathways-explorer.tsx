'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import {
  ArrowLeft, Bookmark, CheckCircle2, ChevronDown, ChevronRight, CircleAlert, ExternalLink, FileText, Search, X, XCircle,
} from 'lucide-react'
import type { PathwayEvaluation } from '@/lib/pathways'
import { summaryFor } from '@/lib/pathway-summary'
import { flagSrc } from '@/lib/flags'

// ─── Display status ─────────────────────────────────────────────────────
// Kolmari does not assert visa eligibility, so every label is a fit signal.
// Red is reserved for a documented unmet requirement (e.g. income below the
// planning guide). Unknown information is never treated as a failed
// requirement, so it stays amber.

type DisplayStatus = 'fit' | 'confirm' | 'not-met'
const UNMET_RE = /below the|does not meet|not eligible/i

function displayStatus(p: PathwayEvaluation): DisplayStatus {
  if (p.missingRequirements.some((m) => UNMET_RE.test(m))) return 'not-met'
  return p.status === 'Strong Match' ? 'fit' : 'confirm'
}

const STATUS_META: Record<DisplayStatus, { label: string; badge: string; Icon: typeof CheckCircle2 }> = {
  fit: { label: 'Potential fit', badge: 'bg-ok-soft text-ok', Icon: CheckCircle2 },
  confirm: { label: 'Needs confirmation', badge: 'bg-warn-soft text-[#8a6500]', Icon: CircleAlert },
  'not-met': { label: 'Requirement not met', badge: 'bg-[#fdeaee] text-[#b3243c]', Icon: XCircle },
}
const statusOrder = (p: PathwayEvaluation) => {
  const s = displayStatus(p)
  return s === 'fit' ? 0 : s === 'confirm' ? 1 : 2
}

type Filter = 'all' | 'fit' | 'info' | 'saved'
const TABS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All routes' },
  { id: 'fit', label: 'Potential fits' },
  { id: 'info', label: 'Needs information' },
  { id: 'saved', label: 'Saved' },
]

const SAVED_KEY = 'kolmari:saved-pathways'

function useSavedPathways() {
  const [saved, setSaved] = useState<string[]>([])
  useEffect(() => {
    try { setSaved(JSON.parse(localStorage.getItem(SAVED_KEY) ?? '[]')) } catch { /* ignore */ }
  }, [])
  const toggle = (id: string) => setSaved((prev) => {
    const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    try { localStorage.setItem(SAVED_KEY, JSON.stringify(next)) } catch { /* ignore */ }
    return next
  })
  return { saved, toggle }
}

function StatusBadge({ status, className = '' }: { status: DisplayStatus; className?: string }) {
  const meta = STATUS_META[status]
  const Icon = meta.Icon
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-pill px-2.5 py-1 text-[11.5px] font-bold ${meta.badge} ${className}`}>
      <Icon size={13} aria-hidden="true" />{meta.label}
    </span>
  )
}

function Flag({ code, size }: { code: string; size: number }) {
  if (!code) return <span className="shrink-0 rounded-pill bg-canvas" style={{ width: size, height: size }} aria-hidden="true" />
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={flagSrc(code)} alt="" width={size} height={size}
      className="shrink-0 rounded-pill object-cover ring-1 ring-line" style={{ width: size, height: size }} />
  )
}

function signalLine(p: PathwayEvaluation) {
  const met = p.requirementsMet.length, miss = p.missingRequirements.length
  if (!met && miss) return `${miss} detail${miss === 1 ? '' : 's'} to confirm`
  const sig = `${met} matching signal${met === 1 ? '' : 's'}`
  return miss ? `${sig} · ${miss} to confirm` : `${sig} · Ready to review`
}

// ─── Explorer ───────────────────────────────────────────────────────────

export function PathwaysExplorer({ pathways, planPathway }: {
  pathways: PathwayEvaluation[]
  planPathway: string | null
}) {
  const { saved, toggle } = useSavedPathways()
  const [filter, setFilter] = useState<Filter>('all')
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [compare, setCompare] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false) // small screens only
  const [panelOpen, setPanelOpen] = useState(true) // large screens: collapse via X
  const [planRoute, setPlanRoute] = useState(planPathway)

  const categories = useMemo(() => ['All', ...Array.from(new Set(pathways.map((p) => p.category)))], [pathways])

  // Search + category narrow the pool first; status tabs and counts apply on top.
  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase()
    return [...pathways]
      .filter((p) => category === 'All' || p.category === category)
      .filter((p) => !q || [p.name, summaryFor(p.id, p.name).shortName, p.country, p.category]
        .some((v) => v.toLowerCase().includes(q)))
      .sort((a, b) => statusOrder(a) - statusOrder(b))
  }, [pathways, category, query])
  const counts: Record<Filter, number> = {
    all: sorted.length,
    fit: sorted.filter((p) => displayStatus(p) === 'fit').length,
    info: sorted.filter((p) => displayStatus(p) !== 'fit').length,
    saved: sorted.filter((p) => saved.includes(p.id)).length,
  }
  const list = useMemo(() => {
    if (filter === 'fit') return sorted.filter((p) => displayStatus(p) === 'fit')
    if (filter === 'info') return sorted.filter((p) => displayStatus(p) !== 'fit')
    if (filter === 'saved') return sorted.filter((p) => saved.includes(p.id))
    return sorted
  }, [sorted, filter, saved])

  const [selectedId, setSelectedId] = useState<string | null>(sorted[0]?.id ?? null)
  const selected = list.find((p) => p.id === selectedId) ?? list[0] ?? null
  const index = selected ? list.findIndex((p) => p.id === selected.id) : -1

  function step(delta: number) {
    if (!list.length) return
    const next = list[(index + delta + list.length) % list.length]
    setSelectedId(next.id)
    document.getElementById(`pw-row-${next.id}`)?.focus()
  }
  function onListKey(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); step(1) }
    if (e.key === 'ArrowUp') { e.preventDefault(); step(-1) }
  }
  function open(id: string) {
    setSelectedId(id)
    setPanelOpen(true)
    setSheetOpen(true)
  }
  function closeSheet() {
    setSheetOpen(false)
    // Return focus to the row the detail was opened from.
    requestAnimationFrame(() => document.getElementById(`pw-row-${selectedId}`)?.focus())
  }

  // Escape closes the full-screen detail on small screens.
  useEffect(() => {
    if (!sheetOpen) return
    const onKey = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') closeSheet() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetOpen, selectedId])

  const savedRoutes = sorted.filter((p) => saved.includes(p.id))
  const canCompare = savedRoutes.length >= 2
  const needsInfo = counts.info

  function addToComparison(id: string) {
    const already = saved.includes(id)
    if (!already) toggle(id)
    const total = already ? saved.length : saved.length + 1
    if (total >= 2) setCompare(true)
    else setFilter('saved')
    setSheetOpen(false)
  }

  const showPanel = selected && !compare && panelOpen

  return (
    <div className={`grid overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-tile ${showPanel ? 'lg:grid-cols-[minmax(0,16fr)_minmax(0,9fr)]' : ''}`}>
      {/* List column (~64% on large screens) */}
      <div className="min-w-0 px-4 pb-4 pt-5 sm:px-6">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold-deep">Explore your options</p>
        <h2 className="mt-1 text-[24px] font-extrabold leading-tight tracking-[-0.02em] text-navy">Your potential visa routes</h2>
        <p className="mt-1 text-[13.5px] leading-[1.6] text-muted">See what fits your profile and what to confirm next.</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-[var(--radius-field)] border border-line bg-[#fbfcfe] px-3 py-2 focus-within:border-navy/40">
            <Search size={15} className="shrink-0 text-muted-soft" aria-hidden="true" />
            <span className="sr-only">Search routes</span>
            <input type="search" value={query} onChange={(e) => { setQuery(e.target.value); setCompare(false) }}
              placeholder="Search by country, route, or category"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-navy outline-none placeholder:text-muted-soft" />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="text-muted-soft hover:text-navy">
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </label>
        </div>

        <div className="-mx-1 mt-3 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
          <div className="flex w-max min-w-full gap-2">
            {categories.map((item) => {
              const active = category === item
              return (
                <button key={item} type="button" aria-pressed={active}
                  onClick={() => { setCategory(item); setCompare(false) }}
                  className={[
                    'shrink-0 rounded-pill border px-3 py-1.5 text-[12px] font-semibold transition-colors',
                    active ? 'border-navy bg-navy text-white' : 'border-line bg-white text-muted hover:border-navy/30 hover:text-navy',
                  ].join(' ')}>
                  {item}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div className="-mx-1 max-w-full overflow-x-auto px-1 [scrollbar-width:none]">
            <div className="flex w-max gap-5 border-b border-line" role="tablist" aria-label="Filter routes">
              {TABS.map((t) => {
                const active = filter === t.id && !compare
                return (
                  <button key={t.id} type="button" role="tab" aria-selected={active}
                    onClick={() => { setFilter(t.id); setCompare(false) }}
                    className={`whitespace-nowrap border-b-2 px-0.5 pb-2 pt-1 text-[13px] font-semibold transition-colors ${active ? 'border-navy text-navy' : 'border-transparent text-muted hover:text-navy'}`}>
                    {t.label} <span className={active ? 'text-muted' : 'text-muted-soft'}>({counts[t.id]})</span>
                  </button>
                )
              })}
            </div>
          </div>
          <button type="button" disabled={!canCompare && !compare} onClick={() => setCompare((v) => !v)}
            className="mb-1 inline-flex shrink-0 items-center gap-1.5 rounded-pill bg-gold px-3.5 py-2 text-[12.5px] font-bold text-navy-deep transition-opacity disabled:cursor-not-allowed disabled:bg-canvas disabled:text-muted-soft">
            {compare ? <><ArrowLeft size={14} aria-hidden="true" /> Back to list</> : `Compare saved (${savedRoutes.length})`}
          </button>
        </div>

        {compare ? (
          <CompareTable routes={savedRoutes} />
        ) : (
          <>
            <ul role="listbox" aria-label="Visa routes" onKeyDown={onListKey} className="mt-1 border-t border-[#eef1f5]">
              {list.map((p) => {
                const s = summaryFor(p.id, p.name)
                const status = displayStatus(p)
                const active = selected?.id === p.id
                const isSaved = saved.includes(p.id)
                return (
                  <li key={p.id} id={`pw-row-${p.id}`} role="option" aria-selected={active} tabIndex={active ? 0 : -1}
                    aria-label={`${s.shortName}, ${p.country}, ${STATUS_META[status].label}`}
                    onClick={() => open(p.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(p.id) } }}
                    className={`flex min-h-[104px] cursor-pointer items-center gap-3.5 border-b border-[#eef1f5] px-3 py-4 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold sm:gap-4 ${active ? 'bg-[#fff8e6] shadow-[inset_3px_0_0_var(--color-gold)]' : 'hover:bg-[#fbfcfe]'}`}>
                    <Flag code={s.code} size={44} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-muted-soft">{p.country}</p>
                      <p className="mt-0.5 text-[15.5px] font-bold leading-snug tracking-[-0.01em] text-navy">{s.shortName}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 md:hidden">
                        <StatusBadge status={status} />
                        <span className="text-[12px] text-muted">{signalLine(p)}</span>
                      </div>
                    </div>
                    <div className="hidden w-52 shrink-0 flex-col items-start gap-1 md:flex">
                      <StatusBadge status={status} />
                      <span className="text-[12px] leading-5 text-muted">{signalLine(p)}</span>
                    </div>
                    <button type="button" aria-label={isSaved ? `Remove ${s.shortName} from saved routes` : `Save ${s.shortName} to your saved routes`} aria-pressed={isSaved}
                      onClick={(e) => { e.stopPropagation(); toggle(p.id) }}
                      className="grid size-9 shrink-0 place-items-center rounded-pill text-navy hover:bg-canvas">
                      <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} aria-hidden="true" />
                    </button>
                    <ChevronRight size={16} className="shrink-0 text-muted-soft" aria-hidden="true" />
                  </li>
                )
              })}
            </ul>
            {list.length === 0 && (
              <div className="flex flex-wrap items-center gap-3 px-1 py-8 text-[13px] text-muted">
                <span>
                  {filter === 'saved' && !query && category === 'All'
                    ? 'No saved routes yet. Tap the bookmark on any route to keep it here.'
                    : 'No routes match these filters.'}
                </span>
                {(query || category !== 'All' || filter !== 'all') && (
                  <button type="button" onClick={() => { setQuery(''); setCategory('All'); setFilter('all') }}
                    className="font-bold text-gold-deep hover:underline">
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {needsInfo > 0 && (filter === 'all' || filter === 'info') && (
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[var(--radius-field)] bg-[#fff8dc] px-4 py-3.5">
                <FileText size={20} className="shrink-0 text-gold-deep" aria-hidden="true" />
                <p className="min-w-0 flex-1 text-[13px] text-navy">
                  <strong>Answer once, update every match.</strong>{' '}
                  <span className="text-muted">A few profile questions update {needsInfo} route{needsInfo === 1 ? '' : 's'} at once.</span>
                </p>
                <Link href="/profile-wizard" className="rounded-pill bg-gold px-4 py-2 text-[12.5px] font-bold text-navy-deep hover:brightness-95">
                  Complete missing details
                </Link>
              </div>
            )}
          </>
        )}
        <p className="mt-4 text-[11px] text-muted-soft">Matches help you explore. They do not confirm visa eligibility.</p>
      </div>

      {/* Detail panel: side column on lg+, full-screen sheet below lg */}
      {selected && !compare && (
        <aside
          aria-label="Route overview"
          className={`${sheetOpen ? 'fixed inset-0 z-50 flex' : 'hidden'} ${panelOpen ? 'lg:flex' : 'lg:hidden'} flex-col overflow-y-auto bg-white lg:static lg:z-auto lg:border-l lg:border-line`}>
          <RoutePanel
            key={selected.id}
            pathway={selected}
            position={index >= 0 ? `${index + 1} of ${list.length}` : ''}
            isSaved={saved.includes(selected.id)}
            planRoute={planRoute}
            onPlanSaved={setPlanRoute}
            onAddToComparison={() => addToComparison(selected.id)}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
            onClose={closeSheet}
            onCollapse={() => setPanelOpen(false)}
          />
        </aside>
      )}
    </div>
  )
}

// ─── Route detail panel ─────────────────────────────────────────────────

function RoutePanel({ pathway: p, position, isSaved, planRoute, onPlanSaved, onAddToComparison, onPrev, onNext, onClose, onCollapse }: {
  pathway: PathwayEvaluation
  position: string
  isSaved: boolean
  planRoute: string | null
  onPlanSaved: (value: string) => void
  onAddToComparison: () => void
  onPrev: () => void
  onNext: () => void
  onClose: () => void
  onCollapse: () => void
}) {
  const s = summaryFor(p.id, p.name)
  const status = displayStatus(p)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ money: true })
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'error'>('idle')
  const planValue = `${p.country} — ${p.name}`
  const isPlanRoute = planRoute === planValue

  const sections: { id: string; title: string; rows: [string, string][] }[] = [
    { id: 'money', title: 'Money and fees', rows: [['Income needed', p.incomeThreshold], ['Estimated fees', p.estimatedFees]] },
    { id: 'family', title: 'Bringing your family', rows: [['Dependents', p.dependentsAllowed]] },
    { id: 'processing', title: 'Processing information', rows: [['Timing', p.estimatedProcessingTime], ['Work rights', p.localWorkRights]] },
    { id: 'official', title: 'Official requirements', rows: p.baseRequirements.map((r, i) => [`${i + 1}`, r] as [string, string]) },
  ]

  async function saveRoute() {
    if (saveState === 'saving') return
    setSaveState('saving')
    try {
      const res = await fetch('/api/plan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected_pathway: planValue }),
      })
      if (!res.ok) throw new Error(`Plan save failed: ${res.status}`)
      onPlanSaved(planValue)
      setSaveState('idle')
    } catch {
      setSaveState('error')
    }
  }

  return (
    <div className="flex min-h-full flex-col p-7 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={onClose}
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-navy hover:text-gold-deep lg:hidden">
          <ArrowLeft size={16} aria-hidden="true" /> Back to routes
        </button>
        <p className="hidden text-[10.5px] font-bold uppercase tracking-[0.13em] text-muted-soft lg:block">
          Route overview{position ? ` · ${position}` : ''}
        </p>
        <button type="button" onClick={onCollapse} aria-label="Close route overview"
          className="hidden size-8 place-items-center rounded-pill text-muted hover:bg-canvas hover:text-navy lg:grid">
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <p className="mt-3 text-[10.5px] font-bold uppercase tracking-[0.13em] text-muted-soft lg:hidden">
        Route overview{position ? ` · ${position}` : ''}
      </p>

      <div className="mt-4 flex items-center gap-3.5">
        <Flag code={s.code} size={48} />
        <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-muted-soft">{p.country}</p>
      </div>
      <h3 className="mt-2 text-[22px] font-extrabold leading-tight tracking-[-0.01em] text-navy">{p.name}</h3>
      <div className="mt-2.5"><StatusBadge status={status} /></div>

      <div className="mt-5 border-t border-line pt-5">
        <h4 className="text-[13.5px] font-bold text-navy">Why this appeared for you</h4>
        {p.requirementsMet.length ? (
          <ul className="mt-2.5 space-y-1.5">
            {p.requirementsMet.map((m) => (
              <li key={m} className="flex gap-2 text-[12.5px] leading-5 text-muted">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-teal-deep" aria-hidden="true" /><span>{m}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[12.5px] leading-5 text-muted-soft">
            No profile signals point to this route yet. It appeared because it is part of the researched set.
          </p>
        )}
      </div>

      <div className="mt-5">
        <h4 className="text-[13.5px] font-bold text-navy">What to review next</h4>
        {p.missingRequirements.length ? (
          <ul className="mt-2.5 space-y-1.5">
            {p.missingRequirements.map((m) => (
              <li key={m} className="flex gap-2 text-[12.5px] leading-5 text-muted">
                <span className="mt-[7px] size-2 shrink-0 rounded-pill bg-warn" aria-hidden="true" /><span>{m}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[12.5px] leading-5 text-muted-soft">
            Nothing missing from your profile. Review the official requirements below before acting.
          </p>
        )}
      </div>

      <div className="mt-5 border-t border-line">
        {sections.map((sec) => {
          const open = !!openSections[sec.id]
          const regionId = `pw-sec-${p.id}-${sec.id}`
          return (
            <div key={sec.id} className="border-b border-line">
              <h4>
                <button type="button" onClick={() => setOpenSections((o) => ({ ...o, [sec.id]: !o[sec.id] }))}
                  aria-expanded={open} aria-controls={regionId}
                  className="flex w-full items-center justify-between py-3.5 text-left text-[13.5px] font-semibold text-navy">
                  {sec.title}
                  <ChevronDown size={15} aria-hidden="true" className={`shrink-0 text-muted transition-transform duration-[var(--duration-standard)] ${open ? 'rotate-180' : ''}`} />
                </button>
              </h4>
              {open && (
                <div id={regionId} role="region" aria-label={sec.title} className="pb-4">
                  <dl className="space-y-2.5">
                    {sec.rows.map(([k, v]) => (
                      <div key={k + v} className="grid grid-cols-[96px_1fr] gap-3">
                        <dt className="text-[11.5px] leading-5 text-muted-soft">{k}</dt>
                        <dd className="text-[12.5px] leading-5 text-navy">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  {sec.id === 'official' && p.officialSource && (
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[#f0f3f7] pt-3">
                      <a href={p.officialSource} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-gold-deep underline-offset-4 hover:underline">
                        <ExternalLink size={13} aria-hidden="true" />{p.sourceLabel ?? 'Official source'}
                      </a>
                      <span className="text-[10.5px] text-muted-soft">Verified {p.lastVerified}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-auto pt-6">
        <button type="button" onClick={saveRoute} disabled={saveState === 'saving'}
          className="w-full rounded-[var(--radius-field)] bg-navy py-3 text-[13.5px] font-bold text-white transition-colors hover:bg-navy-deep disabled:opacity-70">
          {saveState === 'saving' ? 'Saving…' : isPlanRoute ? 'Saved to your plan ✓' : 'Save route'}
        </button>
        {saveState === 'error' && (
          <p role="alert" className="mt-2 text-[12px] font-semibold text-[#b3243c]">
            Could not save to your plan. Check your connection and try again.
          </p>
        )}
        <button type="button" onClick={onAddToComparison}
          className="mt-3 w-full text-center text-[13px] font-semibold text-gold-deep hover:underline">
          {isSaved ? 'In your comparison set — view saved routes' : 'Add to comparison'}
        </button>
        <div className="mt-4 flex items-center justify-between border-t border-[#f0f3f7] pt-3">
          <button type="button" onClick={onPrev} className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-muted hover:text-navy">
            <ArrowLeft size={14} aria-hidden="true" /> Previous
          </button>
          <button type="button" onClick={onNext} className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-muted hover:text-navy">
            Next <ArrowLeft size={14} aria-hidden="true" className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Compare ────────────────────────────────────────────────────────────

function CompareTable({ routes }: { routes: PathwayEvaluation[] }) {
  const rows: [string, (p: PathwayEvaluation) => string][] = [
    ['Status', (p) => STATUS_META[displayStatus(p)].label],
    ['Income', (p) => summaryFor(p.id, p.name).keyFact],
    ['Fees', (p) => summaryFor(p.id, p.name).fees],
    ['Processing', (p) => summaryFor(p.id, p.name).processing],
    ['Family', (p) => summaryFor(p.id, p.name).family],
    ['To confirm', (p) => (p.missingRequirements.length ? `${p.missingRequirements.length} detail${p.missingRequirements.length === 1 ? '' : 's'}` : 'None')],
  ]
  return (
    <div className="mt-3 overflow-x-auto rounded-[var(--radius-field)] border border-line">
      <table className="w-full min-w-[520px] border-collapse text-left text-[13px]">
        <caption className="sr-only">Side-by-side comparison of saved routes</caption>
        <thead>
          <tr className="bg-canvas">
            <th scope="col" className="w-[130px] px-3.5 py-3"><span className="sr-only">Detail</span></th>
            {routes.map((p) => {
              const s = summaryFor(p.id, p.name)
              return (
                <th key={p.id} scope="col" className="px-3.5 py-3 align-bottom">
                  <span className="flex items-center gap-2">
                    <Flag code={s.code} size={22} />
                    <span>
                      <span className="block text-[9.5px] font-bold uppercase tracking-[0.11em] text-muted-soft">{p.country}</span>
                      <span className="block font-bold text-navy">{s.shortName}</span>
                    </span>
                  </span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, fn]) => (
            <tr key={label} className="border-t border-[#f0f3f7]">
              <th scope="row" className="bg-[#fbfcfe] px-3.5 py-2.5 font-semibold text-muted">{label}</th>
              {routes.map((p) => <td key={p.id} className="px-3.5 py-2.5 font-semibold text-navy">{fn(p)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
