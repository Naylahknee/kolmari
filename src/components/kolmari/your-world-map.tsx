'use client'

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react'
import Link from 'next/link'
import { MapPinned } from 'lucide-react'

export type WorldPin = {
  slug: string
  name: string
  code: string
  lat: number
  lng: number
  score: number | null
}

// Logical size the static image is requested at. Overlay pins are positioned
// as percentages of this box, so the projection below must use the same size.
const W = 960
const H = 480
const TILE = 512

// Web Mercator (matches Mapbox's static projection) so our own clickable pins
// land exactly on the rendered basemap.
function mercY(latDeg: number) {
  const lat = (Math.max(-85, Math.min(85, latDeg)) * Math.PI) / 180
  return (1 - Math.log(Math.tan(Math.PI / 4 + lat / 2)) / Math.PI) / 2
}
function projectX(lng: number, zoom: number) {
  return TILE * Math.pow(2, zoom) * (lng / 360 + 0.5)
}
function projectY(lat: number, zoom: number) {
  return TILE * Math.pow(2, zoom) * mercY(lat)
}

function frame(pins: WorldPin[]) {
  if (pins.length === 0) return { lng: 0, lat: 20, zoom: 1.3 }
  const lngs = pins.map((p) => p.lng)
  const lats = pins.map((p) => p.lat)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const lng = (minLng + maxLng) / 2
  const lat = (minLat + maxLat) / 2
  if (pins.length === 1) return { lng, lat, zoom: 3.4 }
  const lngSpan = Math.max((maxLng - minLng) / 360, 0.01)
  const latSpan = Math.max(Math.abs(mercY(minLat) - mercY(maxLat)), 0.01)
  const zoomX = Math.log2((W * 0.78) / (TILE * lngSpan))
  const zoomY = Math.log2((H * 0.78) / (TILE * latSpan))
  return { lng, lat, zoom: Math.max(0.6, Math.min(4.2, Math.min(zoomX, zoomY))) }
}

export function YourWorldMap({ pins }: { pins: WorldPin[] }) {
  const [failed, setFailed] = useState(false)
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const view = frame(pins)
  const cx = projectX(view.lng, view.zoom)
  const cy = projectY(view.lat, view.zoom)

  const placed = pins.map((p) => ({
    ...p,
    left: ((W / 2 + (projectX(p.lng, view.zoom) - cx)) / W) * 100,
    top: ((H / 2 + (projectY(p.lat, view.zoom) - cy)) / H) * 100,
  }))

  // No token (or the image failed): a calm navy panel listing the pins as
  // clickable gold chips — the map is an enhancement, never the only path in.
  if (!token || failed) {
    return (
      <div className="rounded-[16px] border border-white/10 bg-[#0D1B39] p-5 sm:p-6">
        <div className="flex items-center gap-2 text-white/80">
          <MapPinned size={18} className="text-gold" aria-hidden="true" />
          <p className="text-sm font-semibold">
            {pins.length > 0 ? 'Your matched destinations' : 'Your world map'}
          </p>
        </div>
        {pins.length === 0 ? (
          <p className="mt-2 text-sm text-white/55">
            Complete your Kolmari Profile to plot your matched destinations here.
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {pins.map((p) => (
              <Link
                key={p.slug}
                href={`/nextinations/${p.slug}/v2/overview`}
                className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white transition hover:border-gold hover:bg-white/10"
              >
                <span className="grid size-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-navy">
                  {p.code}
                </span>
                {p.name}
                {p.score !== null && <span className="text-xs text-gold">{p.score}%</span>}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  const src = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${view.lng},${view.lat},${view.zoom.toFixed(2)},0/${W}x${H}@2x?access_token=${encodeURIComponent(token)}&attribution=false&logo=false`

  return (
    <div className="relative overflow-hidden rounded-[16px] border border-[#0D1B39]/15 bg-[#0D1B39]" style={{ aspectRatio: `${W} / ${H}` }}>
      <img src={src} alt="Map of your matched destinations" onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-cover" />
      {placed.map((p) => (
        <Link
          key={p.slug}
          href={`/nextinations/${p.slug}/v2/overview`}
          aria-label={`${p.name}${p.score !== null ? `, ${p.score}% fit` : ''}`}
          title={`${p.name}${p.score !== null ? ` · ${p.score}% fit` : ''}`}
          className="group absolute z-10 -translate-x-1/2 -translate-y-full"
          style={{ left: `${p.left}%`, top: `${p.top}%` }}
        >
          <span className="flex flex-col items-center">
            <span className="rounded-full bg-navy px-2 py-0.5 text-[10px] font-bold text-white opacity-0 shadow-card transition group-hover:opacity-100">
              {p.name}
            </span>
            <span className="mt-0.5 grid size-6 place-items-center rounded-full border-2 border-white bg-gold text-[9px] font-bold text-navy shadow-card transition group-hover:scale-110">
              {p.code}
            </span>
          </span>
        </Link>
      ))}
      <p className="absolute bottom-1 right-1.5 rounded bg-white/85 px-1.5 py-0.5 text-[9px] text-navy">© Mapbox © OpenStreetMap</p>
    </div>
  )
}
