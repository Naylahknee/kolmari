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

function frame(pins: WorldPin[]): {
  lng: number
  lat: number
  zoom?: number
  minLng?: number
  maxLng?: number
  minLat?: number
  maxLat?: number
  isSingle?: boolean
} {
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
    <div className="rounded-[16px] border border-line bg-[#C9E3F2] p-5 sm:p-6">
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
      style: 'mapbox://styles/mamamissionnay/cmscbpz5y006c01rdf0jbaxbj',
      center: [0, 20],
      zoom: 1.5,
      projection: 'mercator',
      attributionControl: true,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
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

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
    })

    map.on('error', (event) => {
      const message = (event.error as Error | undefined)?.message ?? ''
      if (/access token|unauthorized|401/i.test(message)) setMapError(true)
    })

    return () => {
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, mapError, pins])

  if (!token || mapError) {
    return <MapFallback pins={pins} />
  }

  return (
    <div className="your-world-map-container" role="region" aria-label="Your matched destinations map">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  )
}
