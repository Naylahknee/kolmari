'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Heart, Lock, Search, SlidersHorizontal } from 'lucide-react'
import type { WorldPin } from './your-world-map'
import { WorldMatchMap } from './world-match-map'
import { WorldStories } from './world-stories'
import { PanelIcon, safetyLabelForLevel, safetyScoreColor } from '@/components/kolmari/panel-icons'
import { attributeIconsFor, getCountryAttributes } from '@/lib/country-attributes'

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

// Saved-destination hearts share the browse page's storage so a save in one
// place shows up in the other.
const SAVED_KEY = 'kolmari:saved-nextinations'
const SAVED_EVENT = 'kolmari:saved-nextinations-changed'

function readSavedSlugs(): string[] {
  try {
    const raw = JSON.parse(window.localStorage.getItem(SAVED_KEY) ?? '[]')
    return Array.isArray(raw) ? raw.filter((s): s is string => typeof s === 'string') : []
  } catch {
    return []
  }
}

function toggleSavedSlug(slug: string, currentlySaved: boolean) {
  const current = readSavedSlugs()
  const next = currentlySaved ? current.filter((s) => s !== slug) : [...new Set([...current, slug])]
  window.localStorage.setItem(SAVED_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(SAVED_EVENT))
}

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
  const [savedSlugs, setSavedSlugs] = useState<string[]>([])

  useEffect(() => {
    const sync = () => setSavedSlugs(readSavedSlugs())
    sync()
    window.addEventListener('storage', sync)
    window.addEventListener(SAVED_EVENT, sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(SAVED_EVENT, sync)
    }
  }, [])

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
            {filtered.map((c) => {
              const isSaved = savedSlugs.includes(c.slug)
              return (
                <RecommendedCard
                  key={c.slug}
                  card={c}
                  isSaved={isSaved}
                  onToggleSave={() => toggleSavedSlug(c.slug, isSaved)}
                />
              )
            })}
          </div>
        ) : (
          <p className="mt-6 p-8 text-center text-sm text-muted">No destinations match your filters.</p>
        )}
      </div>

      {/* Stories & expert guidance (ported from the demo World page) */}
      <WorldStories countries={cards.filter((c) => c.scored).map((c) => ({ slug: c.slug, name: c.name }))} />
    </div>
  )
}

function RecommendedCard({
  card,
  isSaved,
  onToggleSave,
}: {
  card: RecCard
  isSaved: boolean
  onToggleSave: () => void
}) {
  const router = useRouter()
  const attrs = getCountryAttributes(card.slug)
  const safetyScore = attrs?.safetyScore ?? null
  const attrIcons = attributeIconsFor(card.slug, card.cost)

  return (
    <article
      onClick={() => router.push(`/nextinations/${card.slug}/v2/overview`)}
      className="group flex cursor-pointer flex-col rounded-[16px] border border-line bg-white p-4 shadow-tile transition hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-card"
    >
      <div className="flex items-start gap-3">
        <span
          className="relative grid size-12 flex-none place-items-center overflow-hidden rounded-[12px] bg-navy text-[12px] font-extrabold tracking-wide text-gold"
          aria-hidden="true"
        >
          {card.code}
          <img
            src={`/flags-png/${card.code.toLowerCase()}.png`}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(event) => { event.currentTarget.style.display = 'none' }}
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[17px] font-extrabold text-navy">{card.name}</p>
          <p className="text-[12px] font-semibold text-muted">{card.region}</p>
        </div>
        <button
          type="button"
          aria-label={isSaved ? `Remove ${card.name} from saved` : `Save ${card.name}`}
          aria-pressed={isSaved}
          onClick={(event) => { event.stopPropagation(); onToggleSave() }}
          className="grid size-9 flex-none place-items-center rounded-full transition hover:bg-canvas"
        >
          <Heart size={18} className={isSaved ? 'fill-[#e11d48] text-[#e11d48]' : 'text-muted'} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {card.cost && <span className="text-[15px] font-extrabold text-gold-deep">{card.cost}</span>}
        {card.cost && <span className="text-muted" aria-hidden="true">·</span>}
        {safetyScore !== null ? (
          <span className="text-[13px] font-semibold text-muted">
            <strong className="font-extrabold" style={{ color: safetyScoreColor(safetyScore) }}>
              {safetyScore}/100
            </strong>{' '}
            safety
          </span>
        ) : attrs ? (
          <span className="text-[13px] font-semibold text-muted">{safetyLabelForLevel(attrs.advisoryLevel)}</span>
        ) : (
          <span className="text-[13px] font-semibold text-muted">Safety data coming soon</span>
        )}
        <span className="ml-auto">
          {card.score !== null ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#e6f4f1] px-3 py-1 text-[12px] font-extrabold text-[#147a74]">
              <Lock size={11} aria-hidden="true" /> {card.score}% match
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eef1f5] px-3 py-1 text-[12px] font-extrabold text-muted">
              <Lock size={11} aria-hidden="true" /> Locked
            </span>
          )}
        </span>
      </div>

      {attrIcons.length > 0 && (
        <>
          <div className="my-3 border-t border-line" aria-hidden="true" />
          <div className="flex items-center justify-between px-1" role="list" aria-label={`${card.name} highlights`}>
            {attrIcons.map((icon) => (
              <span key={icon.name} role="listitem">
                <PanelIcon name={icon.name} label={icon.label} className="size-6" />
              </span>
            ))}
          </div>
        </>
      )}
    </article>
  )
}
