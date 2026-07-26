'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, Check, Plus, Search, Star, Trash2, X } from 'lucide-react'
import { CONTINENT_PATHS, WORLD_VIEWBOX } from '@/lib/world-continents'
import { searchPlaces, flagEmoji, type WorldPlace } from '@/lib/world-places'
import { countryWorkspaceSlug, STATUS_META, STATUS_ORDER, useNextinationBoard, type NextinationStatus, type SavedNextination } from '@/lib/nextination-board'

function toPercent(lat: number, lng: number) {
  return { left: ((lng + 180) / 360) * 100, top: ((90 - lat) / 180) * 100 }
}

function workspaceSlug(place: SavedNextination): string | null {
  return countryWorkspaceSlug(place.country)
}

export function NexitWorldBoard() {
  const { items, ready, add, update, remove } = useNextinationBoard()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = items.find((x) => x.id === selectedId) ?? null

  const counts = useMemo(() => ({
    total: items.length,
    researching: items.filter((x) => x.status === 'researching').length,
    shortlisted: items.filter((x) => x.status === 'shortlisted').length,
  }), [items])

  function handleAdd(place: WorldPlace) {
    add(place)
    setSelectedId(place.id)
  }

  return (
    <div className="space-y-5">
      {/* Header + Add destination (top) */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Nexit World</p>
          <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">My Nextinations</h1>
          <p className="mt-1 text-sm text-muted">
            {ready ? `${counts.total} saved · ${counts.researching} researching · ${counts.shortlisted} shortlisted` : 'Loading your board…'}
          </p>
        </div>
        <div className="w-full lg:max-w-sm">
          <AddDestination onAdd={handleAdd} existingIds={new Set(items.map((x) => x.id))} />
        </div>
      </div>

      {/* Full-width map */}
      <section aria-label="World map of your Nextinations" className="card-surface overflow-hidden p-3">
        <div className="relative w-full overflow-hidden rounded-[var(--radius-card)] bg-navy-deep" style={{ aspectRatio: '2 / 1' }}>
          <svg viewBox={`0 0 ${WORLD_VIEWBOX.width} ${WORLD_VIEWBOX.height}`} className="absolute inset-0 h-full w-full" role="img" aria-label="World map" preserveAspectRatio="xMidYMid slice">
            <rect width={WORLD_VIEWBOX.width} height={WORLD_VIEWBOX.height} fill="#0d1b39" />
            {CONTINENT_PATHS.map((d, i) => (
              <path key={i} d={d} fill="#1c3161" stroke="#2a4570" strokeWidth={0.4} />
            ))}
          </svg>
          {/* Pins */}
          {items.map((item) => {
            const pos = toPercent(item.lat, item.lng)
            const meta = STATUS_META[item.status]
            const active = item.id === selectedId
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                aria-label={`${item.name}, ${meta.label}`}
                aria-pressed={active}
                className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                style={{ left: `${pos.left}%`, top: `${pos.top}%` }}
              >
                <span className={`block rounded-full transition ${meta.dot} ${active ? 'size-[18px] ring-4 ring-white/40' : 'size-3.5 hover:scale-125'}`} />
                {active ? <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-pill bg-white px-2 py-0.5 text-[10px] font-bold text-navy shadow-card">{item.name}</span> : null}
              </button>
            )
          })}
          {ready && items.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <p className="max-w-xs text-sm text-white/70">Search for a city or country above and save it to start building your relocation board.</p>
            </div>
          ) : null}
        </div>

        {/* Destination tray */}
        {items.length > 0 ? (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {items.map((item) => {
              const meta = STATUS_META[item.status]
              return (
                <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={`flex shrink-0 items-center gap-2 rounded-pill border px-3 py-1.5 text-xs font-bold transition ${item.id === selectedId ? 'border-gold bg-gold-soft/60 text-navy' : 'border-line bg-white text-muted hover:text-navy'}`}>
                  <span aria-hidden>{flagEmoji(item.countryCode)}</span>
                  {item.name}
                  <span className={`rounded-pill px-1.5 py-0.5 text-[10px] ${meta.chip}`}>{meta.label}</span>
                </button>
              )
            })}
          </div>
        ) : null}
      </section>

      {/* Selected destination — below the map */}
      {selected ? (
        <DetailPanel key={selected.id} item={selected} onStatus={(s) => update(selected.id, { status: s })} onNote={(n) => update(selected.id, { note: n })} onRemove={() => { remove(selected.id); setSelectedId(null) }} onClose={() => setSelectedId(null)} />
      ) : null}
    </div>
  )
}

function AddDestination({ onAdd, existingIds }: { onAdd: (p: WorldPlace) => void; existingIds: Set<string> }) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => searchPlaces(query), [query])
  return (
    <div className="relative">
      <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Add a destination</p>
      <label className="relative mt-2 flex items-center gap-2 rounded-[var(--radius-field)] border border-line-strong bg-white px-3 shadow-card">
        <Search size={16} className="text-muted" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a city, country, or region" aria-label="Search for a destination" className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none" />
        {query ? <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={15} className="text-muted" /></button> : null}
      </label>
      {query && results.length > 0 ? (
        <ul className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 divide-y divide-line overflow-y-auto rounded-[var(--radius-field)] border border-line bg-white shadow-[var(--shadow-shell)]">
          {results.map((p) => {
            const added = existingIds.has(p.id)
            return (
              <li key={p.id}>
                <button type="button" disabled={added} onClick={() => { onAdd(p); setQuery('') }} className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm transition hover:bg-canvas disabled:opacity-50">
                  <span className="flex items-center gap-2"><span aria-hidden>{flagEmoji(p.countryCode)}</span><span><span className="font-semibold text-navy">{p.name}</span>{p.kind === 'city' ? <span className="text-xs text-muted"> · {p.country}</span> : null}</span></span>
                  {added ? <span className="text-xs font-bold text-ok">Saved</span> : <Plus size={16} className="text-gold-deep" />}
                </button>
              </li>
            )
          })}
        </ul>
      ) : query && results.length === 0 ? (
        <p className="absolute left-0 right-0 top-full z-30 mt-2 rounded-[var(--radius-field)] border border-line bg-white p-3 text-xs text-muted shadow-[var(--shadow-shell)]">No matches yet — try a country or major city.</p>
      ) : null}
    </div>
  )
}

function DetailPanel({ item, onStatus, onNote, onRemove, onClose }: {
  item: SavedNextination
  onStatus: (s: NextinationStatus) => void
  onNote: (n: string) => void
  onRemove: () => void
  onClose: () => void
}) {
  const slug = workspaceSlug(item)
  return (
    <section className="card-surface p-5 sm:p-6" aria-label={`Selected Nextination: ${item.name}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Selected Nextination</p>
          <h2 className="mt-1 flex items-center gap-2 text-xl font-bold text-navy"><span aria-hidden>{flagEmoji(item.countryCode)}</span>{item.name}</h2>
          <p className="text-sm text-muted">{item.country} · {item.region}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close panel" className="text-muted hover:text-navy"><X size={18} /></button>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold text-muted">Status</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {STATUS_ORDER.map((s) => {
              const meta = STATUS_META[s]
              const active = item.status === s
              return (
                <button key={s} type="button" onClick={() => onStatus(s)} aria-pressed={active} className={`inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-bold transition ${active ? meta.chip : 'bg-canvas text-muted hover:text-navy'}`}>
                  {s === 'shortlisted' ? <Star size={11} /> : s === 'selected' ? <Check size={11} /> : null}
                  {meta.label}
                </button>
              )
            })}
          </div>

          <dl className="mt-4 space-y-2 rounded-[var(--radius-field)] bg-canvas p-3 text-sm">
            <Row label="Visa" value={slug ? 'See Pathways' : 'Research needed'} />
            <Row label="Estimated cost" value="Not reviewed" />
            <Row label="Safety research" value="In progress" />
            <Row label="Healthcare" value="Not reviewed" />
          </dl>

          <div className="mt-4 rounded-[var(--radius-field)] border border-line bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Passport research</p>
            <p className="mt-2 text-sm leading-6 text-muted">Review visa-free access and passport rankings through Passport Index.</p>
            <a href="https://www.passportindex.org/" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-navy hover:text-gold-deep">
              Explore Passport Index <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div>
          <label className="block">
            <span className="text-xs font-bold text-muted">Personal note</span>
            <textarea
              defaultValue={item.note}
              onBlur={(e) => onNote(e.target.value)}
              placeholder="e.g. Good visa option and international schools."
              rows={6}
              className="mt-1.5 w-full rounded-[var(--radius-field)] border border-line-strong bg-white p-3 text-sm outline-none focus:border-gold-deep"
            />
          </label>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {slug ? <Link href={`/nextinations/${slug}`} className="gold-button w-full">Open profile <ArrowRight size={15} /></Link> : null}
            <Link href="/nexit-plan" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-btn)] border border-line bg-white text-sm font-bold text-navy transition hover:border-gold">Move to planning</Link>
            <button type="button" onClick={onRemove} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-btn)] text-sm font-bold text-danger transition hover:bg-danger/10 sm:col-span-2"><Trash2 size={15} /> Remove</button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3"><dt className="text-muted">{label}</dt><dd className="font-semibold text-navy">{value}</dd></div>
}
