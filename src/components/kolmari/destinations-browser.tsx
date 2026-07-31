'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Heart, Lock, Search, Star } from 'lucide-react'

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

export function DestinationsBrowser({ rows, profileComplete }: { rows: DestRow[]; profileComplete: boolean }) {
  const [tab, setTab] = useState<'explore' | StatusKey>('explore')
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('')
  const [cost, setCost] = useState('')
  const [visa, setVisa] = useState('')
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [interested, setInterested] = useState<Set<string>>(new Set())
  const [visited, setVisited] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Load persisted status after mount — reading localStorage during render
    // would cause an SSR/client hydration mismatch.
    /* eslint-disable react-hooks/set-state-in-effect */
    setSaved(loadSet(STORAGE.saved))
    setInterested(loadSet(STORAGE.interested))
    setVisited(loadSet(STORAGE.visited))
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
    return rows.filter((r) => {
      if (statusSet && !statusSet.has(r.slug)) return false
      if (region && r.region !== region) return false
      if (cost && r.cost !== cost) return false
      if (visa && r.visaType !== visa) return false
      if (q && !`${r.name} ${r.city} ${r.region}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [rows, statusSet, region, cost, visa, query])

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Explore</p>
        <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">Destinations</h1>
        <p className="mt-1 text-sm text-muted">Every destination Kolmari covers. Save the ones you love and track your shortlist.</p>
      </div>

      {/* Tabs */}
      <div className="mt-5 flex gap-1 overflow-x-auto border-b border-line" role="tablist" aria-label="Destination lists">
        {TABS.map((t) => {
          const count = t.id === 'explore' ? rows.length : t.id === 'saved' ? saved.size : t.id === 'interested' ? interested.size : visited.size
          const active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={['-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition', active ? 'border-gold text-navy' : 'border-transparent text-muted hover:text-navy'].join(' ')}
            >
              {t.label} <span className="text-muted">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap gap-3">
        <div className="relative min-w-52 flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input className="field pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search destinations" aria-label="Search destinations" />
        </div>
        <select className="field w-auto" value={region} onChange={(e) => setRegion(e.target.value)} aria-label="Filter by region">
          <option value="">All regions</option>
          {regions.map((r) => <option key={r}>{r}</option>)}
        </select>
        <select className="field w-auto" value={visa} onChange={(e) => setVisa(e.target.value)} aria-label="Filter by visa type">
          <option value="">All visa types</option>
          {visas.map((v) => <option key={v}>{v}</option>)}
        </select>
        <select className="field w-auto" value={cost} onChange={(e) => setCost(e.target.value)} aria-label="Filter by cost of living">
          <option value="">Any cost</option>
          {costs.map((c) => <option key={c} value={c}>{c === '$' ? '$ — lower' : '$$ — moderate'}</option>)}
        </select>
      </div>

      {/* List */}
      <div className="mt-4 divide-y divide-line overflow-hidden rounded-card border border-line bg-white">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">
            {tab === 'explore'
              ? 'No destinations match your filters.'
              : `No ${tab} destinations yet. Tap the ${tab === 'interested' ? 'star' : tab === 'visited' ? 'star' : 'heart'} on any destination to add it here.`}
          </p>
        ) : (
          filtered.map((r) => (
            <Row
              key={r.slug}
              row={r}
              profileComplete={profileComplete}
              saved={saved.has(r.slug)}
              interested={interested.has(r.slug)}
              onSave={() => toggle('saved', r.slug)}
              onInterested={() => toggle('interested', r.slug)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function Row({
  row,
  profileComplete,
  saved,
  interested,
  onSave,
  onInterested,
}: {
  row: DestRow
  profileComplete: boolean
  saved: boolean
  interested: boolean
  onSave: () => void
  onInterested: () => void
}) {
  const fit = row.reason ?? (row.locked ? 'In your top matches — unlock the score with Plus' : `${row.region}`)
  return (
    <Link
      href={`/nextinations/${row.slug}/v2/overview`}
      className="flex items-center gap-3 px-3 py-3 transition hover:bg-gold-soft/20 sm:px-4"
    >
      <img
        src={`https://flagcdn.com/${row.code}.svg`}
        alt=""
        width={26}
        height={20}
        className="h-5 w-[26px] shrink-0 rounded-sm object-cover ring-1 ring-line"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-navy">{row.name}</p>
        <p className="truncate text-xs text-muted">{fit}</p>
      </div>

      <div className="hidden shrink-0 items-center sm:flex">
        {row.match !== null ? (
          <span className="rounded-pill bg-gold-soft px-2.5 py-1 text-xs font-bold text-gold-deep">{row.match}% match</span>
        ) : row.locked ? (
          <span className="inline-flex items-center gap-1 rounded-pill bg-canvas px-2.5 py-1 text-xs font-bold text-muted"><Lock size={11} /> Plus</span>
        ) : profileComplete ? null : (
          <span className="rounded-pill bg-canvas px-2.5 py-1 text-xs font-semibold text-muted">Take the quiz</span>
        )}
      </div>

      <button
        type="button"
        aria-label={saved ? `Remove ${row.name} from saved` : `Save ${row.name}`}
        aria-pressed={saved}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSave() }}
        className="grid size-8 shrink-0 place-items-center rounded-full text-muted hover:bg-canvas hover:text-danger"
      >
        <Heart size={16} className={saved ? 'fill-danger text-danger' : ''} />
      </button>
      <button
        type="button"
        aria-label={interested ? `Remove ${row.name} from interested` : `Mark ${row.name} interested`}
        aria-pressed={interested}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onInterested() }}
        className="grid size-8 shrink-0 place-items-center rounded-full text-muted hover:bg-canvas hover:text-gold-deep"
      >
        <Star size={16} className={interested ? 'fill-gold text-gold-deep' : ''} />
      </button>
      <ChevronRight size={16} className="shrink-0 text-muted" aria-hidden="true" />
    </Link>
  )
}
