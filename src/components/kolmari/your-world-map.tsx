'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import mapboxgl from 'mapbox-gl'
import { MapPinned } from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'
import './your-world-map.css'

export type WorldPin = {
  slug: string
  name: string
  code: string
  lat: number
  lng: number
  score: number | null
}

const W = 960
const H = 480
const TILE = 512
const MAX_LOAD_ATTEMPTS = 3
const LOAD_TIMEOUT_MS = 12_000

type MapLoadStatus = 'loading' | 'ready' | 'failed'

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
  if (pins.length === 1) return { lng, lat, zoom: 3.4, isSingle: true }
  return { minLng, maxLng, minLat, maxLat, lng, lat, isSingle: false }
}

function MapFallback({ pins }: { pins: WorldPin[] }) {
  return (
    <div className="rounded-[16px] border border-line bg-[#CFE6F5] p-5 sm:p-6">
      <div className="flex items-center gap-2 text-navy/80">
        <MapPinned size={18} className="text-gold" aria-hidden="true" />
        <p className="text-sm font-semibold">
          {pins.length > 0 ? 'Your matched destinations' : 'Your world map'}
        </p>
      </div>
      {pins.length === 0 ? (
        <p className="mt-2 text-sm text-navy/55">
          Complete your Kolmari Profile to plot your matched destinations here.
        </p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {pins.map((p) => (
            <Link
              key={p.slug}
              href={`/nextinations/${p.slug}/v2/overview`}
              className="inline-flex items-center gap-2 rounded-full border border-navy/20 bg-white/40 px-3 py-1.5 text-sm font-semibold text-navy transition hover:border-navy hover:bg-white"
            >
              <span className="grid size-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-navy">
                {p.code}
              </span>
              {p.name}
              {p.score !== null && <span className="text-xs text-gold-deep">{p.score}%</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function YourWorldMap({ pins }: { pins: WorldPin[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    if (!token || mapError || !containerRef.current || mapRef.current) return

    const map = new mapboxgl.Map({
      accessToken: token,
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 20],
      zoom: 1.5,
      projection: 'mercator',
      attributionControl: true,
    })
    mapRef.current = map

    map.on('load', () => {
      map.resize()

      // Add markers for each pin
      for (const pin of pins) {
        const el = document.createElement('button')
        el.className = 'your-world-map-marker'
        el.type = 'button'
        el.setAttribute('aria-label', `${pin.name}${pin.score !== null ? `, ${pin.score}% fit` : ''}`)

        const codeEl = document.createElement('span')
        codeEl.className = 'your-world-map-marker__code'
        codeEl.textContent = pin.code
        el.appendChild(codeEl)

        const infoEl = document.createElement('div')
        infoEl.className = 'your-world-map-marker__info'
        const nameEl = document.createElement('span')
        nameEl.className = 'your-world-map-marker__name'
        nameEl.textContent = pin.name
        infoEl.appendChild(nameEl)
        if (pin.score !== null) {
          const scoreEl = document.createElement('span')
          scoreEl.className = 'your-world-map-marker__score'
          scoreEl.textContent = `${pin.score}%`
          infoEl.appendChild(scoreEl)
        }
        el.appendChild(infoEl)

        el.addEventListener('click', () => {
          window.location.href = `/nextinations/${pin.slug}/v2/overview`
        })

        const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([pin.lng, pin.lat])
          .addTo(map)

        markersRef.current.push(marker)
      }

      // Fit camera to pins
      const view = frame(pins)
      if (view.isSingle !== false) {
        map.flyTo({ center: [view.lng, view.lat], zoom: view.zoom })
      } else if (
        view.minLng !== undefined &&
        view.maxLng !== undefined &&
        view.minLat !== undefined &&
        view.maxLat !== undefined
      ) {
        map.fitBounds(
          [
            [view.minLng, view.minLat],
            [view.maxLng, view.maxLat],
          ],
          { padding: 40, maxZoom: 4.2 }
        )
      }
      return current + 1
    })

    map.on('error', (event) => {
      const message = (event.error as Error | undefined)?.message ?? ''
      if (/access token|unauthorized|401/i.test(message)) setMapError(true)
    })

  useEffect(() => {
    if (!token || loadStatus !== 'loading') return
    const timeout = window.setTimeout(retryLoad, LOAD_TIMEOUT_MS)
    return () => window.clearTimeout(timeout)
  }, [loadAttempt, loadStatus, retryCycle, retryLoad, token])

  // The map surface uses the approved light locator-blue canvas. This keeps the
  // loading and fallback states visually consistent with other Kolmari map panels
  // instead of flashing a dark navy block before the basemap appears.
  if (!token || loadStatus === 'failed') {
    return (
      <div className="rounded-[16px] border border-line bg-[#CFE6F5] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-navy/80">
            <MapPinned size={18} className="text-gold-deep" aria-hidden="true" />
            <p className="text-sm font-semibold">
              {pins.length > 0 ? 'Your matched destinations' : 'Your world map'}
            </p>
          </div>
          {token && (
            <button
              type="button"
              onClick={restartLoad}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-navy/20 px-3 text-xs font-bold text-navy transition hover:border-gold-deep hover:text-gold-deep"
            >
              <RefreshCw size={13} aria-hidden="true" /> Retry map
            </button>
          )}
        </div>
        {token && (
          <p className="mt-2 text-sm text-navy/60">
            The map image could not be reached. Your destination links are still available below.
          </p>
        )}
        {pins.length === 0 ? (
          <p className="mt-2 text-sm text-navy/60">
            Complete your Kolmari Profile to plot your matched destinations here.
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {pins.map((p) => (
              <Link
                key={p.slug}
                href={`/nextinations/${p.slug}/v2/overview`}
                className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white/70 px-3 py-1.5 text-sm font-semibold text-navy transition hover:border-gold-deep hover:bg-white"
              >
                <span className="grid size-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-navy">
                  {p.code}
                </span>
                {p.name}
                {p.score !== null && <span className="text-xs text-gold-deep">{p.score}%</span>}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  const zoomPrecision = Math.min(10, 2 + retryCycle * MAX_LOAD_ATTEMPTS + loadAttempt)
  const src = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${view.lng},${view.lat},${view.zoom.toFixed(zoomPrecision)},0/${W}x${H}@2x?access_token=${encodeURIComponent(token)}&attribution=false&logo=false`

  return (
    <div className="relative overflow-hidden rounded-[16px] border border-line bg-[#CFE6F5]" style={{ aspectRatio: `${W} / ${H}` }}>
      <img
        key={src}
        src={src}
        alt="Map of your matched destinations"
        onLoad={() => setLoadStatus('ready')}
        onError={retryLoad}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${loadStatus === 'ready' ? 'opacity-100' : 'opacity-0'}`}
      />
      {loadStatus === 'loading' && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-[#CFE6F5] text-navy" role="status" aria-live="polite">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <LoaderCircle size={17} className="animate-spin text-gold-deep" aria-hidden="true" /> Loading your world…
          </span>
        </div>
      )}
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
