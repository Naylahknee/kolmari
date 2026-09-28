'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown, MapPinned } from 'lucide-react'
import type { WorldPin } from './your-world-map'
import { WorldSvgMap } from './world-svg-map'

// Re-exported so callers that already import WorldMatchMap can take the pin type
// from the same module (your-world-gated.tsx does).
export type { WorldPin }

/**
 * "Matched destinations" map. Renders the Natural Earth SVG world map, which is
 * always visible, highlights each matched country, and lets users click a
 * highlighted country to open its country page. Gold highlights are
 * quiz-ranked matches; white highlights are countries the user picked in the
 * Profile Wizard. Clickable country pills appear beneath the map, and the map
 * itself needs no Mapbox token.
 */

function PinPills({ label, pins }: { label: string; pins: WorldPin[] }) {
  return (
    <div>
      <p className="text-[10.5px] font-bold uppercase tracking-widest text-white/45">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {pins.map((pin) => (
          <Link
            key={pin.slug}
            href={`/nextinations/${pin.slug}/v2/overview`}
            className="group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] py-1.5 pl-1.5 pr-3 transition hover:border-gold/50 hover:bg-white/[0.1]"
          >
            <span className="grid size-6 place-items-center rounded-full bg-navy text-[9.5px] font-extrabold tracking-wide text-gold">{pin.code}</span>
            <span className="text-[12.5px] font-semibold text-white">{pin.name}</span>
            {pin.score !== null && <span className="text-[12px] font-bold text-gold">{pin.score}%</span>}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function WorldMatchMap({ pins }: { pins: WorldPin[] }) {
  const [open, setOpen] = useState(true)
  const matches = pins.filter((p) => p.kind === 'match')
  const selected = pins.filter((p) => p.kind === 'selected')
  const count = pins.length

  if (count === 0) {
    return (
      <section className="overflow-hidden rounded-card" style={{ background: '#0d1b39' }}>
        <div className="flex flex-wrap items-center gap-3 p-5">
          <span className="grid size-9 place-items-center rounded-full bg-gold text-navy-deep" aria-hidden="true">
            <MapPinned size={17} />
          </span>
          <div>
            <p className="text-sm font-bold text-white">Plot your matched destinations</p>
            <p className="text-xs text-white/65">Complete your Kolmari Profile to pin personalized matches.</p>
          </div>
          <Link href="/profile-wizard" className="ml-auto inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white/10 px-3 text-xs font-bold text-white hover:bg-white/15">
            Complete profile <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-card" style={{ background: '#0d1b39' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold text-white">Matched destinations</p>
          <p className="mt-0.5 text-xs text-white/60">Matches are highlighted in gold. Countries you picked are highlighted in white.</p>
        </div>
        <span className="shrink-0 text-xs font-bold text-gold">
          {matches.length} {matches.length === 1 ? 'match' : 'matches'}
          {selected.length > 0 && ` · ${selected.length} selected`}
        </span>
        <ChevronDown size={18} className={`shrink-0 text-white/60 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div className="px-5 pb-5">
          <WorldSvgMap pins={pins} />
          <div className="mt-4 space-y-4">
            {matches.length > 0 && <PinPills label="Open a match" pins={matches} />}
            {selected.length > 0 && <PinPills label="Your picks" pins={selected} />}
          </div>
        </div>
      )}
    </section>
  )
}
