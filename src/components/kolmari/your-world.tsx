'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Heart, Search, SlidersHorizontal, X } from 'lucide-react'
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
type FeatureKind = 'climate' | 'landscape' | 'infrastructure' | 'safety' | 'internet'

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
  const [selectedSlug, setSelectedSlug] = useState<string | null>(cards[0]?.slug ?? null)
  const [detailOpen, setDetailOpen] = useState(false)

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

  useEffect(() => {
    if (!filtered.length) return
    if (!selectedSlug || !filtered.some((card) => card.slug === selectedSlug)) setSelectedSlug(filtered[0].slug)
  }, [filtered, selectedSlug])

  const selected = filtered.find((card) => card.slug === selectedSlug) ?? filtered[0] ?? null
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

  function openCountry(card: RecCard) {
    setSelectedSlug(card.slug)
    if (window.matchMedia('(max-width: 1199px)').matches) setDetailOpen(true)
  }

  return (
    <div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Explore</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-navy sm:text-4xl">Your World</h1>
        <p className="mt-1 text-sm text-muted">Browse the map or the directory. Select a country to preview its details; your matches are ranked from your Kolmari Profile.</p>
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
          <div className="mt-4 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((card) => (
                <CountryPanel
                  key={card.slug}
                  card={card}
                  saved={saved.includes(card.slug)}
                  selected={selected?.slug === card.slug}
                  onToggleSave={() => toggleSaved(card.slug)}
                  onOpen={() => openCountry(card)}
                />
              ))}
            </div>
            {selected ? (
              <div className="hidden xl:block">
                <div className="sticky top-[122px]">
                  <CountryDetailPanel card={selected} saved={saved.includes(selected.slug)} onToggleSave={() => toggleSaved(selected.slug)} />
                </div>
              </div>
            ) : null}
          </div>
        ) : <p className="mt-6 p-8 text-center text-sm text-muted">No destinations match your filters.</p>}
      </div>

      {detailOpen && selected ? (
        <div className="fixed inset-0 z-[90] bg-navy-deep/35 p-3 backdrop-blur-[2px] xl:hidden" role="presentation" onClick={() => setDetailOpen(false)}>
          <div className="ml-auto h-full max-w-[420px] overflow-y-auto" role="dialog" aria-modal="true" aria-label={`${selected.name} details`} onClick={(event) => event.stopPropagation()}>
            <CountryDetailPanel card={selected} saved={saved.includes(selected.slug)} onToggleSave={() => toggleSaved(selected.slug)} onClose={() => setDetailOpen(false)} />
          </div>
        </div>
      ) : null}

      <WorldStories />
    </div>
  )
}

function FeatureIcon({ kind, label }: { kind: FeatureKind; label: string }) {
  return (
    <span title={label} aria-label={label} className="grid size-8 place-items-center">
      {kind === 'climate' ? (
        <svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="4.4" fill="#f3c516"/><path d="M12 2.6v2.3M12 19.1v2.3M2.6 12h2.3M19.1 12h2.3M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7" stroke="#f3c516" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
      ) : null}
      {kind === 'landscape' ? (
        <svg viewBox="0 0 24 24" width="22" height="22"><circle cx="17" cy="6.2" r="2.8" fill="#f3c516"/><path d="M2.5 15c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0" stroke="#3a5a94" strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M2.5 19.5c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0" stroke="#9fb0cc" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
      ) : null}
      {kind === 'infrastructure' ? (
        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 20V10h5v10z" fill="#3a5a94"/><path d="M10.5 20V4.5h6V20z" fill="#17305b"/><path d="M18 20v-8h3.5v8z" fill="#9fb0cc"/><path d="M6.5 12.8h.01M6.5 15.8h.01M13.5 7.5h.01M13.5 10.5h.01M13.5 13.5h.01" stroke="#f3c516" strokeWidth="2" strokeLinecap="round"/></svg>
      ) : null}
      {kind === 'safety' ? (
        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 2.8l7.2 2.9v5.5c0 4.7-3.1 7.8-7.2 9.5-4.1-1.7-7.2-4.8-7.2-9.5V5.7z" fill="#1f9d94"/><path d="M9 12l2.1 2.1 4-4.2" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
      ) : null}
      {kind === 'internet' ? (
        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M2.8 9a14.6 14.6 0 0118.4 0" stroke="#17305b" strokeWidth="2.2" fill="none" strokeLinecap="round"/><path d="M5.8 12.6a10 10 0 0112.4 0" stroke="#17305b" strokeWidth="2.2" fill="none" strokeLinecap="round"/><path d="M8.8 16.1a5.6 5.6 0 016.4 0" stroke="#17305b" strokeWidth="2.2" fill="none" strokeLinecap="round"/><path d="M12 19.6h.01" stroke="#17305b" strokeWidth="2.6" fill="none" strokeLinecap="round"/></svg>
      ) : null}
    </span>
  )
}

function CostCoins({ card }: { card: RecCard }) {
  const tier = card.incomeRequired === null ? 0 : card.incomeRequired < 2200 ? 1 : card.incomeRequired <= 3500 ? 2 : 3
  return (
    <span className="flex items-center gap-0.5" title={tier ? 'Relative planning cost' : 'Cost data pending'}>
      {[1, 2, 3].map((index) => (
        <svg key={index} viewBox="0 0 24 24" width="15" height="15" className={index <= tier ? 'opacity-100' : 'opacity-25'}>
          <circle cx="12" cy="12" r="8.4" fill={index <= tier ? '#f3c516' : '#c3ccda'} stroke={index <= tier ? '#b8890a' : '#a9b4c4'} strokeWidth="1.4" />
          <path d="M12 7.6v8.8M14 9.6c-.5-.7-1.3-1-2.2-1-1.2 0-2 .6-2 1.5 0 2.2 4.4 1 4.4 3.3 0 1-.9 1.6-2.2 1.6-1 0-1.8-.4-2.3-1.1" stroke={index <= tier ? '#8a6606' : '#8d99aa'} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      ))}
    </span>
  )
}

function CountryPanel({ card, saved, selected, onToggleSave, onOpen }: { card: RecCard; saved: boolean; selected: boolean; onToggleSave: () => void; onOpen: () => void }) {
  return (
    <article className={`group relative min-h-[188px] overflow-hidden rounded-[14px] border bg-white shadow-tile transition hover:-translate-y-0.5 hover:shadow-card ${selected ? 'border-navy ring-1 ring-navy/10' : 'border-line hover:border-gold/40'}`}>
      <img src={`/flags-png/${card.code.toLowerCase()}.png`} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-[0.09]" />
      <div className="absolute inset-0 bg-white/88" />

      <button type="button" onClick={onOpen} className="relative z-10 block w-full p-[18px] pb-0 text-left" aria-label={`Preview ${card.name}`}>
        <div className="flex items-start gap-3">
          <img src={`/flags-png/${card.code.toLowerCase()}.png`} alt="" width="40" height="28" className="mt-0.5 h-7 w-10 rounded-[4px] border border-line object-cover shadow-sm" />
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-[18px] font-bold leading-tight text-navy">{card.name}</h3>
            <p className="mt-0.5 text-xs text-muted">{card.city} · {card.region}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <CostCoins card={card} />
          <span className="size-[3px] rounded-full bg-[#c3ccda]" />
          <span className="text-[13px] font-bold text-teal-700">{card.safety ?? 'Safety pending'}</span>
          <span className={`ml-auto rounded-full border px-2.5 py-1 text-[11px] font-bold ${card.score !== null ? 'border-teal-600/25 bg-teal-50 text-teal-700' : 'border-line bg-canvas text-muted'}`}>
            {card.score !== null ? `${card.score}% match` : 'Match pending'}
          </span>
        </div>
      </button>

      <button type="button" onClick={(event) => { event.stopPropagation(); onToggleSave() }} aria-pressed={saved} aria-label={saved ? `Remove ${card.name} from saved countries` : `Save ${card.name}`} className={`absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-lg bg-transparent transition ${saved ? 'text-[#f0637a]' : 'text-[#9aa7ba] hover:text-navy'}`}>
        <Heart size={20} fill={saved ? 'currentColor' : 'none'} />
      </button>

      <div className="relative z-10 mt-3 flex items-center gap-2.5 border-t border-[#eef1f6] px-[18px] py-3" aria-label={`${card.name} country features`}>
        <FeatureIcon kind="climate" label="Climate" />
        <FeatureIcon kind="landscape" label="Environment" />
        <FeatureIcon kind="infrastructure" label="Infrastructure" />
        <FeatureIcon kind="safety" label="Safety" />
        <FeatureIcon kind="internet" label="Internet" />
      </div>
    </article>
  )
}

function CountryDetailPanel({ card, saved, onToggleSave, onClose }: { card: RecCard; saved: boolean; onToggleSave: () => void; onClose?: () => void }) {
  return (
    <aside className="overflow-hidden rounded-[18px] border border-line bg-white shadow-card">
      <div className="relative h-[170px] overflow-hidden bg-[#e9edf3]">
        <img src={`/api/country-asset?slug=${card.slug}&type=dashboard_destination`} alt={`${card.name} destination`} className="h-full w-full object-cover" onError={(event) => { const target = event.currentTarget; target.onerror = null; target.src = `/flags-png/${card.code.toLowerCase()}.png`; target.className = 'h-full w-full object-cover opacity-80' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/30 to-transparent" />
        {onClose ? <button type="button" onClick={onClose} className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-navy shadow-sm" aria-label="Close country details"><X size={18} /></button> : null}
      </div>

      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="grid size-[74px] shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-white p-2 shadow-sm">
            <img src={`/flags-png/${card.code.toLowerCase()}.png`} alt={`${card.name} flag`} className="max-h-full max-w-full object-contain" />
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <h3 className="font-display text-2xl font-bold text-navy">{card.name}</h3>
            <p className="mt-1 text-sm text-muted">{card.city} · {card.region}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={onToggleSave} aria-pressed={saved} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold ${saved ? 'border-[#f0637a]/35 bg-[#fff4f6] text-[#d94b64]' : 'border-line bg-white text-navy'}`}><Heart size={15} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}</button>
              <Link href={`/nextinations/${card.slug}/v2/overview`} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-xs font-bold text-navy">View country <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>

        <div className="my-5 border-t border-line" />

        <h4 className="text-base font-bold text-navy">Why explore {card.name}</h4>
        <p className="mt-2 text-sm leading-6 text-muted">{card.blurb ?? `Open the ${card.name} country overview for the researched planning details currently available in Kolmari.`}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-lg border border-line bg-canvas px-3 py-2 text-xs text-navy">{card.region}</span>
          {card.route ? <span className="rounded-lg border border-line bg-canvas px-3 py-2 text-xs text-navy">{card.route}</span> : null}
          <span className="rounded-lg border border-line bg-canvas px-3 py-2 text-xs text-navy">{card.city}</span>
        </div>

        <div className="mt-5 grid grid-cols-2 divide-x divide-line rounded-xl border border-line bg-white py-4 text-center">
          <div><div className="flex justify-center"><CostCoins card={card} /></div><p className="mt-1 text-xs text-muted">Cost</p></div>
          <div><p className="text-xl font-extrabold text-navy">{card.safety ?? '—'}</p><p className="mt-1 text-xs text-muted">Safety</p></div>
        </div>

        <div className="mt-5 rounded-xl border border-line bg-canvas p-4">
          <p className="text-sm font-bold text-navy">Your {card.name} match</p>
          <p className="mt-1 text-xs leading-5 text-muted">Based on the relocation profile information currently available.</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className={`rounded-full border px-3 py-1.5 text-xs font-bold ${card.score !== null ? 'border-teal-600/25 bg-teal-50 text-teal-700' : 'border-line bg-white text-muted'}`}>{card.score !== null ? `${card.score}% match` : 'Match pending'}</span>
            <Link href={`/nextinations/${card.slug}/v2/overview`} className="rounded-lg bg-navy px-3 py-2 text-xs font-bold text-white">Open overview</Link>
          </div>
        </div>
      </div>
    </aside>
  )
}
