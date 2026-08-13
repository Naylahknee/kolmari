'use client'

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown, MapPinned } from 'lucide-react'
import type { WorldPin } from './your-world-map'

// Re-exported so callers that already import WorldMatchMap can take the pin type
// from the same module (your-world-gated.tsx does).
export type { WorldPin }

/**
 * "Matched destinations" map — a static Mapbox image ported from the demo's
 * World page. Each matched country is dropped as a gold star pin on a dark map,
 * with an "Open a match" pill row beneath it. Uses the Mapbox Static Images API
 * so there is no client GL bundle to load; falls back to a dark placeholder when
 * no token is configured or the image fails.
 */
function buildMapUrl(pins: WorldPin[], token: string): string {
  const geo = {
    type: 'FeatureCollection',
    features: pins.map((p) => ({
      type: 'Feature',
      properties: { 'marker-color': '#f3c516', 'marker-size': 'large', 'marker-symbol': 'star' },
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
    })),
  }
  const overlay = `geojson(${encodeURIComponent(JSON.stringify(geo))})`
  // A single point makes /auto/ zoom in too far, so frame it at a fixed low zoom.
  const camera = pins.length === 1 ? `${pins[0].lng},${pins[0].lat},3.1,0` : 'auto'
  const padding = pins.length === 1 ? '' : 'padding=70&'
  return `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${overlay}/${camera}/1000x360@2x?${padding}access_token=${encodeURIComponent(token)}`
}

function MatchPills({ pins }: { pins: WorldPin[] }) {
  return (
    <div className="mt-4">
      <p className="text-[10.5px] font-bold uppercase tracking-widest text-white/45">Open a match</p>
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
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const [imgFailed, setImgFailed] = useState(false)
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

  const mapUrl = token ? buildMapUrl(pins, token) : null

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
          <p className="mt-0.5 text-xs text-white/60">Your profile matches are highlighted in gold and pinned automatically.</p>
        </div>
        <span className="shrink-0 text-xs font-bold text-gold">{count} {count === 1 ? 'match' : 'matches'}</span>
        <ChevronDown size={18} className={`shrink-0 text-white/60 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div className="px-5 pb-5">
          {mapUrl && !imgFailed ? (
            <img
              src={mapUrl}
              alt={`Map highlighting ${pins.map((p) => p.name).join(', ')} with location pins`}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="block w-full rounded-[12px] object-cover"
              style={{ aspectRatio: '1000 / 360', minHeight: 220, background: '#102142' }}
            />
          ) : (
            <div
              role="img"
              aria-label={`Matched destinations: ${pins.map((p) => p.name).join(', ')}`}
              className="grid w-full place-items-center rounded-[12px] text-center"
              style={{ aspectRatio: '1000 / 360', minHeight: 220, background: '#102142' }}
            >
              <div className="px-6">
                <MapPinned size={22} className="mx-auto text-gold" aria-hidden="true" />
                <p className="mt-2 text-sm font-semibold text-white">{count} matched {count === 1 ? 'destination' : 'destinations'}</p>
                <p className="mt-1 text-xs text-white/55">Open a match below to explore it.</p>
              </div>
            </div>
          )}
          <MatchPills pins={pins} />
        </div>
      )}
    </section>
  )
}
