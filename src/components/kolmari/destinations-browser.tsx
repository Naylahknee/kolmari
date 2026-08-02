'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Bookmark, Grid2x2, Heart, List, Lock, Search } from 'lucide-react'

export type DestRow = {
  slug: string
  name: string
  code: string // lowercase 2-letter for flagcdn
  city: string
  region: string
  visaType: string
  cost: string
  match: number | null
  reason: string | null
  locked: boolean
}

type StatusKey = 'saved' | 'interested' | 'visited'
const STORAGE: Record<StatusKey, string> = {
  saved: 'kolmari:saved',
  interested: 'kolmari:interested',
  visited: 'kolmari:visited',
}

function loadSet(key: string): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = window.localStorage.getItem(key)
    return new Set(raw ? (JSON.parse(raw) as string[]) : [])
  } catch {
    return new Set()
  }
}

const TABS: { id: 'explore' | StatusKey; label: string }[] = [
  { id: 'explore', label: 'Explore' },
  { id: 'saved', label: 'Saved' },
  { id: 'interested', label: 'Interested' },
  { id: 'visited', label: 'Visited' },
]

// Qualitative fit headline derived from the real Match Score (never invented).
function fitHeadline(match: number | null): string {
  if (match === null) return 'Not yet scored'
  if (match >= 55) return 'Strong regional fit'
  if (match >= 45) return 'Good fit overall'
  if (match >= 35) return 'Moderate alignment'
  return 'Lower alignment'
}

const costLabel = (cost: string) => (cost === '$' ? 'Low' : cost === '$$' ? 'Moderate' : cost)

export function DestinationsBrowser({ rows, profileComplete }: { rows: DestRow[]; profileComplete: boolean }) {
  const [tab, setTab] = useState<'explore' | StatusKey>('explore')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'best' | 'name'>('best')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  // Applied filters vs. the draft edited in the sidebar (committed via Apply).
  const [region, setRegion] = useState('')
  const [visa, setVisa] = useState('')
  const [cost, setCost] = useState('')
  const [draftRegion, setDraftRegion] = useState('')
  const [draftVisa, setDraftVisa] = useState('')
  const [draftCost, setDraftCost] = useState('')

  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [interested, setInterested] = useState<Set<string>>(new Set())
  const [visited, setVisited] = useState<Set<string>>(new Set())

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setSaved(loadSet(STORAGE.saved))
    setInterested(loadSet(STORAGE.interested))
    setVisited(loadSet(STORAGE.visited))
    const q = new URLSearchParams(window.location.search).get('q')
    if (q) setQuery(q)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  function toggle(key: StatusKey, slug: string) {
    const map = { saved: [saved, setSaved], interested: [interested, setInterested], visited: [visited, setVisited] } as const
    const [set, setter] = map[key]
    const next = new Set(set)
    if (next.has(slug)) next.delete(slug)
    else next.add(slug)
    setter(next)
    try {
      window.localStorage.setItem(STORAGE[key], JSON.stringify([...next]))
    } catch {
      /* ignore quota / disabled storage */
    }
  }

  const regions = useMemo(() => [...new Set(rows.map((r) => r.region))].sort(), [rows])
  const visas = useMemo(() => [...new Set(rows.map((r) => r.visaType).filter(Boolean))].sort(), [rows])
  const costs = useMemo(() => [...new Set(rows.map((r) => r.cost).filter(Boolean))].sort(), [rows])

  const statusSet = tab === 'explore' ? null : tab === 'saved' ? saved : tab === 'interested' ? interested : visited

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = rows.filter((r) => {
      if (statusSet && !statusSet.has(r.slug)) return false
      if (region && r.region !== region) return false
      if (cost && r.cost !== cost) return false
      if (visa && r.visaType !== visa) return false
      if (q && !`${r.name} ${r.city} ${r.region}`.toLowerCase().includes(q)) return false
      return true
    })
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    else list.sort((a, b) => (b.match ?? -1) - (a.match ?? -1))
    return list
  }, [rows, statusSet, region, cost, visa, query, sort])

  function applyFilters() {
    setRegion(draftRegion)
    setVisa(draftVisa)
    setCost(draftCost)
  }
  function clearFilters() {
    setDraftRegion(''); setDraftVisa(''); setDraftCost('')
    setRegion(''); setVisa(''); setCost('')
  }

  const header = (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Explore</p>
      <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">Destinations</h1>
      <p className="mt-1 text-sm text-muted">Every destination Kolmari covers. Save the ones you love and track your shortlist.</p>
    </div>
  )

  if (!profileComplete) {
    return (
      <div>
        {header}
        <section className="card-surface mt-5 p-6 text-center sm:p-8" aria-labelledby="destinations-empty-heading">
          <div className="mx-auto grid size-11 place-items-center rounded-full bg-gold-soft text-gold-deep" aria-hidden="true">
            <Search size={20} />
          </div>
          <h2 id="destinations-empty-heading" className="mt-4 text-lg font-bold text-navy">Your matches will appear here</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
            Once you complete your profile, we&rsquo;ll match you to destinations here.
          </p>
          <Link href="/profile-wizard" className="gold-button mt-5">Complete your profile</Link>
        </section>
      </div>
    )
  }

  return (
    <div>
      {header}

      {/* Status tabs */}
      <div className="k-tabbar mt-5">
        <div className="k-tabs" role="tablist" aria-label="Destination lists">
          {TABS.map((t) => {
            const count = t.id === 'explore' ? rows.length : t.id === 'saved' ? saved.size : t.id === 'interested' ? interested.size : visited.size
            return (
              <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className="k-tab">
                {t.label} <span className="k-count">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[248px_minmax(0,1fr)]">
        {/* Filter sidebar */}
        <aside className="card-surface h-fit p-5">
          <p className="text-base font-bold text-navy">Filter destinations</p>
          <div className="mt-4 space-y-4">
            <FilterField label="Region">
              <select className="field" value={draftRegion} onChange={(e) => setDraftRegion(e.target.value)} aria-label="Filter by region">
                <option value="">All regions</option>
                {regions.map((r) => <option key={r}>{r}</option>)}
              </select>
            </FilterField>
            <FilterField label="Visa pathway">
              <select className="field" value={draftVisa} onChange={(e) => setDraftVisa(e.target.value)} aria-label="Filter by visa pathway">
                <option value="">All visa types</option>
                {visas.map((v) => <option key={v}>{v}</option>)}
              </select>
            </FilterField>
            <FilterField label="Cost of living">
              <select className="field" value={draftCost} onChange={(e) => setDraftCost(e.target.value)} aria-label="Filter by cost of living">
                <option value="">Any cost</option>
                {costs.map((c) => <option key={c} value={c}>{c === '$' ? '$ — Low' : '$$ — Moderate'}</option>)}
              </select>
            </FilterField>
            {/* Not yet tracked — shown for continuity, disabled rather than faked. */}
            <FilterField label="Travel advisory">
              <select className="field cursor-not-allowed opacity-50" disabled title="Coming soon — advisory data isn't tracked yet" aria-label="Filter by travel advisory (coming soon)">
                <option>All advisory levels</option>
              </select>
            </FilterField>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">Programs</p>
              <label className="mt-2 flex cursor-not-allowed items-center gap-2 text-sm text-muted opacity-50" title="Coming soon — program data isn't tracked yet">
                <input type="checkbox" disabled className="size-4 rounded border-line-strong" /> Fulbright
              </label>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <button type="button" onClick={clearFilters} className="w-full rounded-[var(--radius-btn)] border border-line px-3.5 py-2.5 text-sm font-bold text-navy hover:bg-canvas">Clear filters</button>
            <button type="button" onClick={applyFilters} className="gold-button w-full">Apply filters</button>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-0 flex-1">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input className="field pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search destinations" aria-label="Search destinations" />
            </div>
            <span className="shrink-0 text-sm text-muted">{filtered.length} destination{filtered.length === 1 ? '' : 's'}</span>
            <select className="field w-auto shrink-0" value={sort} onChange={(e) => setSort(e.target.value as 'best' | 'name')} aria-label="Sort destinations">
              <option value="best">Sort: Best match</option>
              <option value="name">Sort: Name (A–Z)</option>
            </select>
            <div className="flex shrink-0 overflow-hidden rounded-[var(--radius-btn)] border border-line" role="group" aria-label="View mode">
              <button type="button" onClick={() => setView('grid')} aria-pressed={view === 'grid'} aria-label="Grid view" className={`grid size-10 place-items-center ${view === 'grid' ? 'bg-gold-soft text-navy' : 'bg-white text-muted hover:bg-canvas'}`}><Grid2x2 size={16} /></button>
              <button type="button" onClick={() => setView('list')} aria-pressed={view === 'list'} aria-label="List view" className={`grid size-10 place-items-center border-l border-line ${view === 'list' ? 'bg-gold-soft text-navy' : 'bg-white text-muted hover:bg-canvas'}`}><List size={16} /></button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="mt-6 p-8 text-center text-sm text-muted">
              {tab === 'explore' ? 'No destinations match your filters.' : `No ${tab} destinations yet. Tap Save or Interested on any destination to add it here.`}
            </p>
          ) : (
            <div className={`mt-4 ${view === 'grid' ? 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-3'}`}>
              {filtered.map((r) => (
                <Card
                  key={r.slug}
                  row={r}
                  view={view}
                  saved={saved.has(r.slug)}
                  interested={interested.has(r.slug)}
                  onSave={() => toggle('saved', r.slug)}
                  onInterested={() => toggle('interested', r.slug)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">{label}</p>
      {children}
    </div>
  )
}

function Card({ row, view, saved, interested, onSave, onInterested }: {
  row: DestRow; view: 'grid' | 'list'
  saved: boolean; interested: boolean
  onSave: () => void; onInterested: () => void
}) {
  const flag = `https://flagcdn.com/${row.code}.svg`
  const badge = row.match !== null
    ? <span className="rounded-pill bg-gold-soft px-2.5 py-1 text-xs font-bold text-gold-deep">{row.match}% match</span>
    : row.locked
      ? <span className="inline-flex items-center gap-1 rounded-pill bg-white/90 px-2.5 py-1 text-xs font-bold text-muted"><Lock size={11} /> Plus</span>
      : null

  const chips = (
    <div className="flex flex-wrap gap-1.5">
      {row.visaType && <Chip tone="warn">Visa: {row.visaType}</Chip>}
      {row.cost && <Chip tone="info">Cost: {costLabel(row.cost)}</Chip>}
    </div>
  )

  const actions = (
    <div className="flex items-center gap-2">
      <button type="button" onClick={onSave} aria-pressed={saved} className={`inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-btn)] border px-3 text-xs font-bold transition ${saved ? 'border-gold bg-gold-soft text-navy' : 'border-line text-navy hover:bg-canvas'}`}>
        <Bookmark size={14} className={saved ? 'fill-gold-deep text-gold-deep' : ''} /> Save
      </button>
      <button type="button" onClick={onInterested} aria-pressed={interested} className={`inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-btn)] border px-3 text-xs font-bold transition ${interested ? 'border-danger/40 bg-danger/10 text-danger' : 'border-line text-navy hover:bg-canvas'}`}>
        <Heart size={14} className={interested ? 'fill-danger text-danger' : ''} /> Interested
      </button>
      <Link href={`/nextinations/${row.slug}/v2/overview`} className="inline-flex min-h-9 flex-1 items-center justify-center rounded-[var(--radius-btn)] bg-navy px-3 text-xs font-bold text-white hover:bg-navy-deep">
        Explore destination
      </Link>
    </div>
  )

  if (view === 'list') {
    return (
      <div className="card-surface flex flex-wrap items-center gap-4 p-4">
        <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-[var(--radius-tile)] ring-1 ring-line">
          <img src={flag} alt="" className="h-full w-full object-cover" loading="lazy" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-bold text-navy">{row.name}</p>
            {badge}
          </div>
          <p className="truncate text-xs text-muted">{fitHeadline(row.match)}{row.reason ? ` · ${row.reason}` : ''}</p>
        </div>
        <div className="hidden sm:block">{chips}</div>
        <Link href={`/nextinations/${row.slug}/v2/overview`} className="inline-flex min-h-9 shrink-0 items-center rounded-[var(--radius-btn)] bg-navy px-3.5 text-xs font-bold text-white hover:bg-navy-deep">Explore</Link>
      </div>
    )
  }

  return (
    <div className="card-surface flex flex-col overflow-hidden">
      <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-navy to-navy-deep">
        <img src={flag} alt={`Flag of ${row.name}`} className="h-12 w-[64px] rounded-sm object-cover shadow-card ring-1 ring-white/30" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} />
        {badge && <span className="absolute right-2.5 top-2.5">{badge}</span>}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-[8px] ring-1 ring-line">
            <img src={flag} alt="" className="h-full w-full object-cover" loading="lazy" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-navy">{row.name}</p>
            <p className="truncate text-xs text-muted">{row.region}</p>
          </div>
        </div>
        <p className="mt-3 text-sm font-semibold text-navy">{fitHeadline(row.match)}.</p>
        {row.reason && <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted">{row.reason}</p>}
        <div className="mt-3">{chips}</div>
        <div className="mt-4 flex-1" />
        {actions}
      </div>
    </div>
  )
}

function Chip({ tone, children }: { tone: 'warn' | 'info'; children: React.ReactNode }) {
  const cls = tone === 'warn'
    ? 'bg-warn-soft text-warn'
    : 'bg-info-soft text-info'
  return <span className={`inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[11px] font-bold ${cls}`}>{children}</span>
}
