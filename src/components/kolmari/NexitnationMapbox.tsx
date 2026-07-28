'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import mapboxgl from 'mapbox-gl'
import { ArrowRight, MapPinned } from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'
import './nexitnation-map.css'
import { regionList, type RegionSlug } from '@/lib/destinations-data'

type Props = {
  profile: { complete: boolean; matches: Record<RegionSlug, number> | null }
}

/** Accessible region list — always rendered below the map, keyboard and screen-reader accessible. */
function RegionGrid({ profile }: Props) {
  const router = useRouter()
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {regionList.map((region) => {
        const matchValue = profile.matches?.[region.slug]
        return (
          <button
            key={region.slug}
            type="button"
            onClick={() => router.push(`/nexitnation/${region.slug}`)}
            className="group relative min-h-28 overflow-hidden rounded-xl border border-line bg-navy-deep p-4 text-left shadow-tile transition hover:border-gold hover:shadow-card"
            style={{ backgroundImage: `linear-gradient(90deg, rgba(9,20,44,.96), rgba(9,20,44,.54)), url(${region.image})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
          >
            <span className="relative z-10">
              <strong className="block text-sm font-bold text-white">{region.name}</strong>
              <span className="mt-1 block text-xs text-white/70">
                {region.countryCount} countries
                {profile.complete && matchValue !== undefined
                  ? ` · Kolmari Match ${matchValue}%`
                  : profile.complete
                    ? ''
                    : ' · Complete your profile for match data'}
              </span>
            </span>
            <ArrowRight size={16} className="relative z-10 shrink-0 text-gold" aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}

/** No-token or map-error fallback — dark-surface region cards. */
function RegionFallback({ profile }: Props) {
  const router = useRouter()
  return (
    <section className="hero-grid rounded-[24px] bg-navy-deep p-6 text-white sm:p-8" aria-label="Kolmarination regions">
      <div className="max-w-md">
        <span className="grid size-12 place-items-center rounded-xl bg-gold text-navy" aria-hidden="true">
          <MapPinned size={22} />
        </span>
        <h2 className="mt-5 font-display text-2xl font-bold">Explore all regions below.</h2>
        <p className="mt-2 text-sm text-white/65">
          Select a region to open its full Destination guide. Set{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5">NEXT_PUBLIC_MAPBOX_TOKEN</code> to also unlock
          the live map.
        </p>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {regionList.map((region) => {
          const value = profile.matches?.[region.slug]
          return (
            <button
              key={region.slug}
              type="button"
              onClick={() => router.push(`/nexitnation/${region.slug}`)}
              className="relative min-h-28 overflow-hidden rounded-2xl border border-white/12 p-4 text-left transition hover:border-gold"
              style={{ backgroundImage: `linear-gradient(90deg, rgba(9,20,44,.96), rgba(9,20,44,.56)), url(${region.image})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
            >
              <span>
                <strong className="block text-sm">{region.name}</strong>
                <span className="text-xs text-white/60">
                  {region.countryCount} countries
                  {profile.complete && value !== undefined ? ` · Kolmari Match ${value}%` : ''}
                </span>
              </span>
              <ArrowRight size={16} className="text-gold" aria-hidden="true" />
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function NexitnationMapbox({ profile }: Props) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    if (!token || mapError || !containerRef.current || mapRef.current) return

    // Use light-v11: substantially fewer layers than streets-v12, lower
    // _setupPainter and _render cost per the performance trace.
    const map = new mapboxgl.Map({
      accessToken: token,
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 20],
      zoom: 1.5,
      projection: 'mercator',
      attributionControl: false,
    })
    mapRef.current = map

    map.on('load', () => {
      map.resize()

      // Add an accessible region badge marker at the geographic centre of each
      // region. Clicking routes to the region workspace. The badge uses the
      // `.custom-region-badge` styles defined in nexitnation-map.css.
      for (const region of regionList) {
        const matchValue = profile.matches?.[region.slug]

        const el = document.createElement('button')
        el.className = 'custom-region-badge'
        el.setAttribute('aria-label', `${region.name}, ${region.countryCount} countries`)
        el.type = 'button'

        const nameEl = document.createElement('span')
        nameEl.className = 'custom-region-badge__name'
        nameEl.textContent = region.name

        const countEl = document.createElement('span')
        countEl.className = 'custom-region-badge__count'
        countEl.textContent = `${region.countryCount} countries`

        el.appendChild(nameEl)
        el.appendChild(countEl)

        if (profile.complete && matchValue !== undefined) {
          const matchEl = document.createElement('span')
          matchEl.className = 'custom-region-badge__match'
          matchEl.textContent = `Kolmari Match ${matchValue}%`
          el.appendChild(matchEl)
        }

        el.addEventListener('click', () => {
          router.push(`/nexitnation/${region.slug}`)
        })

        const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat(region.center)
          .addTo(map)

        markersRef.current.push(marker)
      }
    })

    map.on('error', (event) => {
      const message = (event.error as Error | undefined)?.message ?? ''
      if (/access token|unauthorized|401/i.test(message)) setMapError(true)
    })

    return () => {
      // Remove all markers before removing the map to avoid memory leaks.
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []
      map.remove()
      mapRef.current = null
    }
    // token and mapError are the only values that should cause a
    // re-initialisation. router is stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, mapError])

  if (!token || mapError) {
    return (
      <>
        <RegionFallback profile={profile} />
        {process.env.NODE_ENV === 'development' && !token && (
          <p className="mt-3 rounded-lg border border-warn-soft bg-warn-soft px-4 py-3 text-xs font-semibold text-warn">
            Dev: <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> is not set — add it to <code>.env.local</code> to enable the map.
          </p>
        )}
      </>
    )
  }

  return (
    <div>
      <div className="nexit-mapbox" aria-hidden="true">
        <div ref={containerRef} className="absolute inset-0" />
      </div>
      {/* Non-map path: always rendered, keyboard and screen-reader accessible */}
      <section aria-label="Kolmarination regions">
        <h2 className="mt-8 text-lg font-bold text-navy">All regions</h2>
        <RegionGrid profile={profile} />
      </section>
    </div>
  )
}
