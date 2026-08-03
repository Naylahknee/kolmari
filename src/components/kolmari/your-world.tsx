'use client'

import { flagSrc } from '@/lib/flags'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Coins, Heart, Search, ShieldCheck, SlidersHorizontal, Stamp } from 'lucide-react'
import { YourWorldMap, type WorldPin } from './your-world-map'
import { CountryOutline } from '@/components/country-template/CountryOutline'
import { getApprovedHero } from '@/lib/country-visuals/data'
import { focalToObjectPosition } from '@/lib/country-visuals/schema'

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
        <p className="mt-1 text-sm text-muted">Your matched destinations on the map, and a ranked shortlist built from your Kolmari Profile.</p>
      </div>

      {/* Sticky search + filter toolbar */}
      <div className="sticky top-[56px] z-40 -mx-1 mt-4 px-1 py-1">
        <div className="rounded-[12px] border-[0.8px] border-[#E7EBF1] bg-white px-3.5 py-3 shadow-tile">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your destinations"
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

      {/* Map */}
      <div className="mt-4">
        <YourWorldMap pins={pins} />
      </div>

      {/* Explore More — matched + discoverable destinations in one visual grid */}
      <div className="mt-8">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-lg font-bold text-navy">Explore More</h2>
          <Link href="/destinations" className="inline-flex items-center gap-1 text-xs font-bold text-gold-deep">Browse all <ArrowRight size={13} aria-hidden="true" /></Link>
        </div>

        {!complete && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-card border border-gold/25 bg-gold-soft/30 p-4">
            <p className="text-sm text-navy">Complete your Kolmari Profile to rank these by Match Score.</p>
            <Link href="/profile-wizard" className="gold-button">Start Wizard <ArrowRight size={15} /></Link>
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c) => <DestinationCard key={c.slug} card={c} />)}
          </div>
        ) : (
          <p className="mt-6 p-8 text-center text-sm text-muted">No destinations match your filters.</p>
        )}
      </div>
    </div>
  )
}

/** Fit label for the card badge, derived from the real Match Score. */
function fitBadge(score: number | null): string {
  if (score === null) return 'Explore'
  if (score >= 70) return 'Strong Fit'
  if (score >= 50) return 'Good Fit'
  return 'Possible Fit'
}

/** Card artwork: approved flag-map artwork when committed, else the country's
 *  real flag with its silhouette as a shadow — matching the country-page hero. */
function CardArt({ card }: { card: RecCard }) {
  const hero = getApprovedHero(card.slug)
  return (
    <div className="relative aspect-[16/10] overflow-hidden" style={{ background: '#0f2247' }}>
      {hero ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={hero.src} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: focalToObjectPosition(hero.focalPoint) }} loading="lazy" />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={flagSrc(card.code)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <span className="absolute right-[5%] top-1/2 h-[74%] w-[38%] -translate-y-1/2" style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,.3))' }}>
            <CountryOutline code={card.code} fill="rgba(0,0,0,0.3)" style={{ width: '100%', height: '100%' }} />
          </span>
        </>
      )}
      {/* Legibility scrim for the overlaid badge + name */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(8,18,40,.82) 0%,rgba(8,18,40,.12) 46%,rgba(8,18,40,.28) 100%)' }} />
      <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-navy shadow-sm">{fitBadge(card.score)}</span>
      <span className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full bg-black/25 text-white backdrop-blur-sm"><Heart size={16} aria-hidden="true" /></span>
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="text-lg font-extrabold leading-tight text-white drop-shadow">{card.name}</p>
        <p className="text-[11px] font-semibold text-white/85">{card.city} · {card.region}</p>
      </div>
    </div>
  )
}

function FooterChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-1 py-2.5 text-center">
      <span className="text-gold-deep">{icon}</span>
      <span className="w-full truncate text-[10.5px] font-semibold text-navy">{label}</span>
    </div>
  )
}

function DestinationCard({ card }: { card: RecCard }) {
  return (
    <Link
      href={`/nextinations/${card.slug}/v2/overview`}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-white shadow-tile transition hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-card"
    >
      <CardArt card={card} />
      <div className="grid grid-cols-3 divide-x divide-line border-t border-line">
        <FooterChip icon={<Stamp size={15} aria-hidden="true" />} label={card.route ?? (card.scored ? 'Route TBD' : 'Not scored')} />
        <FooterChip icon={<Coins size={15} aria-hidden="true" />} label={card.cost ? costLabel[card.cost] ?? card.cost : '—'} />
        <FooterChip icon={<ShieldCheck size={15} aria-hidden="true" />} label={card.safety ?? '—'} />
      </div>
    </Link>
  )
}
