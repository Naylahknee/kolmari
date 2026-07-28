'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import mapboxgl from 'mapbox-gl'
import { ArrowRight, KeyRound, MapPinned } from 'lucide-react'
import type { NexitRegion, RegionSlug } from '@/lib/regionData'

type MapboxMapProps = {
  regions: NexitRegion[]
  activeSlug: RegionSlug
}

export function MapboxMap({ regions, activeSlug }: MapboxMapProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [mapError, setMapError] = useState(false)
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const activeRegion = regions.find((region) => region.slug === activeSlug) ?? regions[0]

  useEffect(() => {
    if (!token || mapError || !containerRef.current || mapRef.current || !activeRegion) return

    const map = new mapboxgl.Map({
      accessToken: token,
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/standard',
      center: activeRegion.coordinates,
      zoom: activeRegion.zoom,
      projection: 'globe',
      attributionControl: false,
      cooperativeGestures: true,
    })

    mapRef.current = map
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')

    map.on('style.load', () => {
      map.setFog({ color: '#dce8f4', 'high-color': '#8eb7d8', 'horizon-blend': 0.08 })
    })

    map.on('error', (event) => {
      const message = (event.error as Error | undefined)?.message ?? ''
      if (/access token|unauthorized|401/i.test(message)) setMapError(true)
    })

    const markers = regions.map((region) => {
      const markerButton = document.createElement('button')
      markerButton.type = 'button'
      markerButton.className = 'nexit-map-marker'
      markerButton.dataset.active = String(region.slug === activeSlug)
      markerButton.setAttribute('aria-label', `Explore ${region.name}`)

      const dot = document.createElement('span')
      dot.className = 'nexit-map-marker__dot'
      dot.setAttribute('aria-hidden', 'true')

      const label = document.createElement('span')
      label.className = 'nexit-map-marker__label'
      label.textContent = region.shortName

      markerButton.append(dot, label)
      markerButton.addEventListener('click', () => router.push(`/nexitnation/${region.slug}`))

      const popup = new mapboxgl.Popup({ closeButton: false, offset: 22, className: 'nexit-map-popup' })
        .setText(`${region.name}: ${region.eyebrow}`)

      return new mapboxgl.Marker({ element: markerButton, anchor: 'bottom' })
        .setLngLat(region.coordinates)
        .setPopup(popup)
        .addTo(map)
    })

    return () => {
      markers.forEach((marker) => marker.remove())
      map.remove()
      mapRef.current = null
    }
  }, [activeRegion, activeSlug, mapError, regions, router, token])

  if (!token || mapError) {
    return (
      <div className="hero-grid relative flex min-h-[520px] flex-col overflow-hidden rounded-[22px] bg-navy-deep p-6 text-white sm:p-8">
        <div className="absolute -right-20 -top-20 size-72 rounded-full border-[52px] border-white/5" />
        <div className="relative max-w-md">
          <span className="grid size-12 place-items-center rounded-xl bg-gold text-navy"><KeyRound size={22} /></span>
          <p className="mt-6 text-xs font-extrabold uppercase tracking-[.2em] text-gold">Map preview is ready</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Add your Mapbox token to unlock the live globe.</h2>
          <p className="mt-3 text-sm leading-6 text-white/65">The regions still work below, so you can test every route before connecting the map.</p>
        </div>

        <div className="relative mt-auto grid gap-3 pt-10 sm:grid-cols-2">
          {regions.map((region) => (
            <button
              key={region.slug}
              type="button"
              onClick={() => router.push(`/nexitnation/${region.slug}`)}
              className={`group flex items-center justify-between rounded-2xl border p-4 text-left transition ${region.slug === activeSlug ? 'border-gold bg-gold text-navy' : 'border-white/12 bg-white/8 hover:bg-white/12'}`}
            >
              <span><MapPinned size={18} /><strong className="mt-2 block text-sm">{region.name}</strong></span>
              <ArrowRight size={17} className="transition group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-[22px] bg-[#dce8f4]">
      <div ref={containerRef} className="absolute inset-0" aria-label="Interactive map of Nexitnation regions" />
      <div className="pointer-events-none absolute left-4 top-4 max-w-56 rounded-xl bg-navy-deep/90 p-3 text-xs leading-5 text-white shadow-xl backdrop-blur">
        Select a gold marker to open its regional plan.
      </div>
    </div>
  )
}
