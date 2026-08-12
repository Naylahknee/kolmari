'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Heart, Search, SlidersHorizontal } from 'lucide-react'
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

const pillClass = 'h-9 rounded-full border-[0.8px] border-[#E7EBF1] bg-white px-3 text-[12px] font-semibold text-[#42536E] transition focus:outline-none focus:ring-2 focus:ring-gold/30'
const SAVED_KEY = 'kolmari:saved-nextinations'
const SAVED_EVENT = 'kolmari:saved-nextinations-changed'

type SortMode = 'az' | 'match' | 'cost' | 'safety'

function Filters({
  region, setRegion, budget, setBudget, visa, setVisa, household, setHousehold, healthcare, setHealthcare, regions, visas, stacked,
}: {
  region: string; setRegion: (value: string) => void
  budget: string; setBudget: (value: string) => void
  visa: string; setVisa: (value: string) => void
  household: string; setHousehold: (value: string) => void
  healthcare: string; setHealthcare: (value: string) => void
  regions: string[]
  visas: string[]
  stacked?: boolean
}) {
  const box = stacked ? 'w-full' : ''
  return (
    <>
      <select aria-label="Filter by region" className={`${pillClass} ${box} ${region ? 'border-gold text-navy' : ''}`} value={region} onChange={(event) => setRegion(event.target.value)}>
        <option value="">Region</option>
        {regions.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <select aria-label="Filter by monthly budget" className={`${pillClass} ${box} ${budget ? 'border-gold text-navy' : ''}`} value={budget} onChange={(event) => setBudget(event.target.value)}>
        <option value="">Monthly budget</option>
        {BUDGET_BANDS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
      <select aria-label="Filter by visa route" className={`${pillClass} ${box} ${visa ? 'border-gold text-navy' : ''}`} value={visa} onChange={(event) => setVisa(event.target.value)}>
        <option value="">Visa route</option>
        {visas.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <select aria-label="Filter by household" className={`${pillClass} ${box} ${household ? 'border-gold text-navy' : ''}`} value={household} onChange={(event) => setHousehold(event.target.value)}>
        <option value="">Household</option>
        <option value="solo">Solo</option>
        <option value="couple">Couple</option>
        <option value="family">Family</option>
      </select>
      <select aria-label="Filter by healthcare" className={`${pillClass} ${box} ${healthcare ? 'border-gold text-navy' : ''}`} value={healthcare} onChange={(event) => setHealthcare(event.target.value)}>
        <option value="">Healthcare</option>
        <option value="profile">Matched to my profile</option>
        <option value="overview">Country overview available</option>
      </select>
    </>
  )
}

function readSaved(): string[] {
  try {
    const raw = JSON.parse(window.localStorage.getItem(SAVED_KEY) ?? '[]')
    return Array.isArray(raw) ? raw.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

function writeSaved(slugs: string[]) {
  window.localStorage.setItem(SAVED_KEY, JSON.stringify(slugs))
  window.dispatchEvent(new Event(SAVED_EVENT))
}

export function YourWorld({ pins, cards, complete, initialQuery = '' }: { pins: WorldPin[]; cards: RecCard[]; complete: boolean; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)
  const [region, setRegion] = useState('')
  const [budget, setBudget] = useState('')
  const [visa, setVisa] = useState('')
  const [household, setHousehold] = useState('')
  const [healthcare, setHealthcare] = useState('')
  const [sort, setSort] = useState<SortMode>('az')
  const [open, setOpen] = useState(false)
  const [saved, setSaved] = useState<string[]>([])

  useEffect(() => {
    const sync = () => setSaved(readSaved())
    sync()
    window.addEventListener('storage', sync)
    window.addEventListener(SAVED_EVENT, sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(SAVED_EVENT, sync)
    }
  }, [])

  const regions = useMemo(() => [...new Set(cards.map((card) => card.region))].sort(), [cards])
  const visas = useMemo(() => [...new Set(cards.map((card) => card.route).filter((value): value is string => Boolean(value)))].sort(), [cards])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const band = BUDGET_BANDS.find((item) => item.id === budget)
    const rows = cards.filter((card) => {
      if (region && card.region !== region) return false
      if (visa && card.route !== visa) return false
      if (band && (card.incomeRequired === null || !band.test(card.incomeRequired))) return false
      if (healthcare === 'profile' && !card.scored) return false
      if (q && !`${card.name} ${card.city} ${card.region} ${card.route ?? ''}`.toLowerCase().includes(q)) return false

      // The controls are intentionally enabled now. Country-specific household
      // and healthcare metrics arrive in the separate country-data phase, so
      // valid selections are retained without inventing unsupported scores.
      if (household && !['solo', 'couple', 'family'].includes(household)) return false
      return true
    })

    return rows.sort((a, b) => {
      if (sort === 'match') return (b.score ?? -1) - (a.score ?? -1) || a.name.localeCompare(b.name)
      if (sort === 'cost') return (a.incomeRequired ?? Number.MAX_SAFE_INTEGER) - (b.incomeRequired ?? Number.MAX_SAFE_INTEGER) || a.name.localeCompare(b.name)
      if (sort === 'safety') {
        const rank = (value: string | null) => value === 'Very safe' ? 2 : value === 'Safe' ? 1 : 0
        return rank(b.safety) - rank(a.safety) || a.name.localeCompare(b.name)
      }
      return a.name.localeCompare(b.name)
    })
  }, [cards, query, region, visa, budget, household, healthcare, sort])

  const activeCount = [region, budget, visa, household, healthcare].filter(Boolean).length

  function clearFilters() {
    setRegion('')
    setBudget('')
    setVisa('')
    setHousehold('')
    setHealthcare('')
    setQuery('')
  }

  function toggleSaved(slug: string) {
    const current = readSaved()
    writeSaved(current.includes(slug) ? current.filter((item) => item !== slug) : [...new Set([...current, slug])])
  }

  return (
    <div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Explore</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-navy sm:text-4xl">Your World</h1>
        <p className="mt-1 text-sm text-muted">Browse the map or the directory. Selecting a country opens its details; your matches are pinned and ranked from your Kolmari Profile.</p>
      </div>

      <div className="mt-4"><WorldMatchMap pins={pins} /></div>

      <div className="sticky top-[56px] z-40 -mx-1 mt-6 px-1 py-1">
        <div className="rounded-[12px] border-[0.8px] border-[#E7EBF1] bg-white px-3.5 py-3 shadow-tile">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search countries" aria-label="Search destinations" className="h-[38px] w-full rounded-[8px] border-[0.8px] border-[#E7EBF1] bg-[#FBFCFE] pl-9 pr-3 text-sm text-navy placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/30" />
            </div>
            <div className="hidden flex-wrap items-center gap-2 xl:flex">
              <Filters region={region} setRegion={setRegion} budget={budget} setBudget={setBudget} visa={visa} setVisa={setVisa} household={household} setHousehold={setHousehold} healthcare={healthcare} setHealthcare={setHealthcare} regions={regions} visas={visas} />
            </div>
            <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border-[0.8px] px-3 text-[12px] font-semibold xl:hidden ${activeCount ? 'border-gold text-navy' : 'border-[#E7EBF1] text-[#42536E]'}`}>
              <SlidersHorizontal size={14} aria-hidden="true" /> Filters{activeCount ? ` · ${activeCount}` : ''}
            </button>
          </div>
          {open ? <div className="mt-3 grid gap-2 xl:hidden"><Filters region={region} setRegion={setRegion} budget={budget} setBudget={setBudget} visa={visa} setVisa={setVisa} household={household} setHousehold={setHousehold} healthcare={healthcare} setHealthcare={setHealthcare} regions={regions} visas={visas} stacked /></div> : null}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-navy">More places to explore</h2>
            <p className="mt-0.5 text-xs text-muted">Discover every country currently available in Kolmari.</p>
          </div>
          <Link href="/destinations" className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-gold-deep">Browse all <ArrowRight size={13} aria-hidden="true" /></Link>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-bold text-muted">Sort by</span>
          {([
            ['match', 'Match'],
            ['az', 'A–Z'],
            ['cost', 'Cost'],
            ['safety', 'Green Book / Safety'],
          ] as Array<[SortMode, string]>).map(([id, label]) => (
            <button key={id} type="button" onClick={() => setSort(id)} className={`${pillClass} ${sort === id ? 'border-gold bg-gold-soft/40 text-navy' : ''}`}>{label}</button>
          ))}
          {activeCount > 0 || query ? <button type="button" onClick={clearFilters} className="ml-1 text-xs font-bold text-muted hover:text-navy">Clear filters</button> : null}
        </div>

        {!complete ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-card border border-gold/25 bg-gold-soft/30 p-4">
            <p className="text-sm text-navy">Complete your Kolmari Profile to unlock Match sorting.</p>
            <Link href="/profile-wizard" className="gold-button">Start Wizard <ArrowRight size={15} /></Link>
          </div>
        ) : null}

        {filtered.length > 0 ? (
          <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((card) => <CountryPanel key={card.slug} card={card} saved={saved.includes(card.slug)} onToggleSave={() => toggleSaved(card.slug)} />)}
          </div>
        ) : <p className="mt-6 p-8 text-center text-sm text-muted">No destinations match your filters.</p>}
      </div>

      <WorldStories />
    </div>
  )
}

function FeatureIcon({ kind, label }: { kind: 'climate' | 'safety' | 'infrastructure' | 'internet' | 'cost'; label: string }) {
  const common = { width: 24, height: 24, viewBox: '0 0 24 24' }
  return (
    <span title={label} aria-label={label} className="grid size-8 place-items-center text-navy">
      {kind === 'climate' ? <svg {...common}><circle cx="12" cy="12" r="4.4" fill="#f3c516"/><path d="M12 2.6v2.3M12 19.1v2.3M2.6 12h2.3M19.1 12h2.3M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7" stroke="#f3c516" strokeWidth="2" strokeLinecap="round" fill="none"/></svg> : null}
      {kind === 'safety' ? <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 2.8v5.4c0 4.6-3 7.6-7 9.3-4-1.7-7-4.7-7-9.3V5.8z"/><path d="M9.2 12l2 2 3.8-4"/></svg> : null}
      {kind === 'infrastructure' ? <svg {...common}><path d="M4 20V10h5v10z" fill="#3a5a94"/><path d="M10.5 20V4.5h6V20z" fill="#17305b"/><path d="M18 20v-8h3.5v8z" fill="#9fb0cc"/><path d="M6.5 12.8h.01M6.5 15.8h.01M13.5 7.5h.01M13.5 10.5h.01M13.5 13.5h.01" stroke="#f3c516" strokeWidth="2" strokeLinecap="round"/></svg> : null}
      {kind === 'internet' ? <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2.8 9a14.6 14.6 0 0118.4 0"/><path d="M5.8 12.6a10 10 0 0112.4 0"/><path d="M8.8 16.1a5.6 5.6 0 016.4 0"/><path d="M12 19.6h.01" strokeWidth="2.6"/></svg> : null}
      {kind === 'cost' ? <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="7" width="18" height="11" rx="2"/><circle cx="12" cy="12.5" r="2.6"/><path d="M6.4 10.2h.01M17.6 14.8h.01"/></svg> : null}
    </span>
  )
}

function CountryPanel({ card, saved, onToggleSave }: { card: RecCard; saved: boolean; onToggleSave: () => void }) {
  return (
    <article className="group relative overflow-hidden rounded-[14px] border border-line bg-white shadow-tile transition hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-card">
      <Link href={`/nextinations/${card.slug}/v2/overview`} className="relative block h-[210px] overflow-hidden bg-[#e9edf3]">
        <img
          src={`/api/country-asset?slug=${card.slug}&type=dashboard_destination`}
          alt={`${card.name} destination`}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          onError={(event) => {
            const target = event.currentTarget
            target.onerror = null
            target.src = `/flags-png/${card.code.toLowerCase()}.png`
            target.className = 'h-full w-full object-cover opacity-80'
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-deep/95 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-end justify-between gap-3">
            <div><h3 className="font-display text-xl font-bold">{card.name}</h3><p className="text-xs text-white/75">{card.city} · {card.region}</p></div>
            {card.score !== null ? <strong className="text-lg text-gold">{card.score}%</strong> : null}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-white/85">
            <span>{card.cost ?? '—'}</span><span>·</span><span>{card.safety ?? 'Safety pending'}</span>
            {card.score === null ? <span className="ml-auto rounded-full bg-white/15 px-2 py-0.5 text-[10px]">Explore</span> : null}
          </div>
        </div>
      </Link>

      <button type="button" onClick={onToggleSave} aria-pressed={saved} aria-label={saved ? `Remove ${card.name} from saved countries` : `Save ${card.name}`} className={`absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full border shadow-sm transition ${saved ? 'border-gold bg-gold-soft text-gold-deep' : 'border-white/70 bg-white/90 text-navy hover:border-gold'}`}>
        <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
      </button>

      <div className="flex items-center gap-2 border-t border-line px-4 py-3" aria-label={`${card.name} country features`}>
        <FeatureIcon kind="climate" label="Climate" />
        <FeatureIcon kind="safety" label="Safety" />
        <FeatureIcon kind="infrastructure" label="Infrastructure" />
        <FeatureIcon kind="internet" label="Internet" />
        <FeatureIcon kind="cost" label="Cost of living" />
      </div>
    </article>
  )
}
