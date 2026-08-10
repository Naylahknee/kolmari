'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react'
import type { WorldPin } from './your-world-map'
import { WorldMatchMap } from './world-match-map'
import { WorldStories } from './world-stories'

export type RecCard = {
  slug: string
  name: string
  code: string
  city: string
  region: string
  cost: string | null
  route: string | null
  score: number | null
  incomeRequired: number | null
  blurb: string | null
  safety: string | null
  scored: boolean
}

const BUDGET_BANDS = [
  { id: 'low', label: 'Under $2,000', test: (n: number) => n < 2000 },
  { id: 'mid', label: '$2,000 – $3,500', test: (n: number) => n >= 2000 && n <= 3500 },
  { id: 'high', label: 'Over $3,500', test: (n: number) => n > 3500 },
]

const costLabel: Record<string, string> = { $: 'Lower cost', $$: 'Moderate cost' }

// Pill-styled control matching the approved toolbar spec.
const pillClass =
  'h-9 rounded-full border-[0.8px] border-[#E7EBF1] bg-transparent px-3 text-[12px] font-semibold text-[#42536E] transition focus:outline-none focus:ring-2 focus:ring-gold/30'

function Filters({
  region, setRegion, budget, setBudget, visa, setVisa, regions, visas, stacked,
}: {
  region: string; setRegion: (v: string) => void
  budget: string; setBudget: (v: string) => void
  visa: string; setVisa: (v: string) => void
  regions: string[]; visas: string[]
  stacked?: boolean
}) {
  const box = stacked ? 'w-full' : ''
  return (
    <>
      <select aria-label="Filter by region" className={`${pillClass} ${box} ${region ? 'border-gold text-navy' : ''}`} value={region} onChange={(e) => setRegion(e.target.value)}>
        <option value="">Region</option>
        {regions.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <select aria-label="Filter by monthly budget" className={`${pillClass} ${box} ${budget ? 'border-gold text-navy' : ''}`} value={budget} onChange={(e) => setBudget(e.target.value)}>
        <option value="">Monthly budget</option>
        {BUDGET_BANDS.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
      </select>
      <select aria-label="Filter by visa route" className={`${pillClass} ${box} ${visa ? 'border-gold text-navy' : ''}`} value={visa} onChange={(e) => setVisa(e.target.value)}>
        <option value="">Visa route</option>
        {visas.map((v) => <option key={v} value={v}>{v}</option>)}
      </select>
      {/* Household and Healthcare filtering needs data Kolmari does not track yet —
          shown for continuity but disabled rather than faked. */}
      <button type="button" disabled title="Coming soon — household matching isn't tracked yet" className={`${pillClass} ${box} cursor-not-allowed opacity-45`}>Household</button>
      <button type="button" disabled title="Coming soon — healthcare matching isn't tracked yet" className={`${pillClass} ${box} cursor-not-allowed opacity-45`}>Healthcare</button>
    </>
  )
}

export function YourWorld({ pins, cards, complete, initialQuery = '' }: { pins: WorldPin[]; cards: RecCard[]; complete: boolean; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)
  const [region, setRegion] = useState('')
  const [budget, setBudget] = useState('')
  const [visa, setVisa] = useState('')
  const [open, setOpen] = useState(false)

  const regions = useMemo(() => [...new Set(cards.map((c) => c.region))].sort(), [cards])
  const visas = useMemo(() => [...new Set(cards.map((c) => c.route).filter((v): v is string => Boolean(v)))].sort(), [cards])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const band = BUDGET_BANDS.find((b) => b.id === budget)
    return cards.filter((c) => {
      if (region && c.region !== region) return false
      if (visa && c.route !== visa) return false
      if (band) {
        if (c.incomeRequired === null) return false
        if (!band.test(c.incomeRequired)) return false
      }
      if (q && !`${c.name} ${c.city} ${c.region}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [cards, query, region, visa, budget])

  const activeCount = [region, budget, visa].filter(Boolean).length

  return (
    <div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Explore</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-navy sm:text-4xl">Your World</h1>
        <p className="mt-1 text-sm text-muted">Browse the map or the directory. Selecting a country opens its details; your matches are pinned and ranked from your Kolmari Profile.</p>
      </div>

      {/* Matched destinations map (ported from the demo World page) */}
      <div className="mt-4">
        <WorldMatchMap pins={pins} />
      </div>

      {/* Sticky search + filter toolbar — sits between the map and the shortlist */}
      <div className="sticky top-[56px] z-40 -mx-1 mt-6 px-1 py-1">
        <div className="rounded-[12px] border-[0.8px] border-[#E7EBF1] bg-white px-3.5 py-3 shadow-tile">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search countries, cities, or visa routes"
                aria-label="Search destinations"
                className="h-[38px] w-full rounded-[8px] border-[0.8px] border-[#E7EBF1] bg-[#FBFCFE] pl-9 pr-3 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </div>
            {/* Inline pills on wide screens */}
            <div className="hidden flex-wrap items-center gap-2 lg:flex">
              <Filters region={region} setRegion={setRegion} budget={budget} setBudget={setBudget} visa={visa} setVisa={setVisa} regions={regions} visas={visas} />
            </div>
            {/* Collapsed control below lg */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border-[0.8px] px-3 text-[12px] font-semibold lg:hidden ${activeCount ? 'border-gold text-navy' : 'border-[#E7EBF1] text-[#42536E]'}`}
            >
              <SlidersHorizontal size={14} aria-hidden="true" /> Filters{activeCount ? ` · ${activeCount}` : ''}
            </button>
          </div>
          {open && (
            <div className="mt-3 grid gap-2 lg:hidden">
              <Filters region={region} setRegion={setRegion} budget={budget} setBudget={setBudget} visa={visa} setVisa={setVisa} regions={regions} visas={visas} stacked />
            </div>
          )}
        </div>
      </div>

      {/* Recommended for you — matched + discoverable destinations in one grid */}
      <div className="mt-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-navy">Recommended for you</h2>
            <p className="mt-0.5 text-xs text-muted">Ranked against your household, income, and move date.</p>
          </div>
          <Link href="/destinations" className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-gold-deep">Browse all <ArrowRight size={13} aria-hidden="true" /></Link>
        </div>

        {!complete && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-card border border-gold/25 bg-gold-soft/30 p-4">
            <p className="text-sm text-navy">Complete your Kolmari Profile to rank these by Match Score.</p>
            <Link href="/profile-wizard" className="gold-button">Start Wizard <ArrowRight size={15} /></Link>
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="mt-4 grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(258px, 1fr))' }}>
            {filtered.map((c) => <RecommendedCard key={c.slug} card={c} />)}
          </div>
        ) : (
          <p className="mt-6 p-8 text-center text-sm text-muted">No destinations match your filters.</p>
        )}
      </div>

      {/* Stories & expert guidance (ported from the demo World page) */}
      <WorldStories />
    </div>
  )
}

/** Match-percentage color, mirroring the demo's thresholds. */
function matchColor(score: number): string {
  if (score >= 80) return '#1f7a4d'
  if (score >= 70) return '#b8890a'
  return '#8090a8'
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="truncate text-[9.5px] font-bold uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-0.5 truncate text-[12.5px] font-bold text-navy">{value}</p>
    </div>
  )
}

function RecommendedCard({ card }: { card: RecCard }) {
  const cost = card.cost ? costLabel[card.cost] ?? card.cost : '—'
  return (
    <Link
      href={`/nextinations/${card.slug}/v2/overview`}
      className="group flex flex-col rounded-card border border-line bg-white p-4 shadow-tile transition hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-card"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="grid size-9 place-items-center rounded-[10px] bg-navy text-[11px] font-extrabold tracking-wide text-gold">{card.code}</span>
        {card.score !== null ? (
          <span className="text-sm font-bold" style={{ color: matchColor(card.score) }}>{card.score}%</span>
        ) : (
          <span className="rounded-full bg-[#f1f4f8] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">Explore</span>
        )}
      </div>

      <p className="mt-2.5 text-[15px] font-bold text-navy">{card.name}</p>
      <p className="text-[11.5px] font-semibold text-muted">{card.city} · {card.region}</p>

      {card.blurb && <p className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-[#5a6a83]">{card.blurb}</p>}

      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3">
        <Stat label="Cost" value={cost} />
        <Stat label="Route" value={card.route ?? '—'} />
        <Stat label="Safety" value={card.safety ?? '—'} />
      </div>

      <p
        className="mt-3 text-[10.5px] font-bold uppercase tracking-wider"
        style={{ color: card.scored ? '#147a74' : '#8090a8' }}
      >
        {card.scored ? 'Ranked for your profile' : 'Preview · not yet scored'}
      </p>
    </Link>
  )
}
