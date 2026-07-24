'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import mapboxgl from 'mapbox-gl'
import { ArrowRight, MapPinned } from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'
import './nexitnation-map.css'
import { regionList, type RegionSlug } from '@/lib/nexitnation-data'

type Props = {
  profile: { complete: boolean; matches: Record<RegionSlug, number> | null }
}

/** Accessible region list — always rendered, whether the map loads or not. */
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
            className="flex items-center justify-between rounded-xl border border-line bg-white p-4 text-left shadow-tile transition hover:border-navy hover:shadow-card"
          >
            <span>
              <strong className="block text-sm font-bold text-navy">{region.name}</strong>
              <span className="mt-0.5 block text-xs text-muted">
                {region.countryCount} countries
                {profile.complete && matchValue !== undefined
                  ? ` · Nexit Match ${matchValue}%`
                  : profile.complete
                    ? ''
                    : ' · Complete your profile for match data'}
              </span>
            </span>
            <ArrowRight size={16} className="shrink-0 text-gold-deep" aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}

export function NexitnationMapbox({ profile }: Props) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    if (!token || mapError || !containerRef.current || mapRef.current) return

    const map = new mapboxgl.Map({
      accessToken: token,
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [0, 20],
      zoom: 1.5,
      projection: 'mercator',
      attributionControl: false,
    })
    mapRef.current = map

    map.on('load', () => {
      map.resize()
    })

    map.on('error', (event) => {
      const message = (event.error as Error | undefined)?.message ?? ''
      if (/access token|unauthorized|401/i.test(message)) setMapError(true)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [token, mapError, router])

  if (!token || mapError) {
    return (
      <section className="hero-grid rounded-[24px] bg-navy-deep p-6 text-white sm:p-8" aria-label="Nexitnation regions">
        <div className="max-w-md">
          <span className="grid size-12 place-items-center rounded-xl bg-gold text-navy" aria-hidden="true">
            <MapPinned size={22} />
          </span>
          <h2 className="mt-5 font-display text-2xl font-bold">Explore all regions below.</h2>
          <p className="mt-2 text-sm text-white/65">
            Select a region to open its full Nextination guide. Set{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5">NEXT_PUBLIC_MAPBOX_TOKEN</code> to also unlock the live map.
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
                className="flex items-center justify-between rounded-2xl border border-white/12 bg-white/8 p-4 text-left transition hover:border-gold hover:bg-white/12"
              >
                <span>
                  <strong className="block text-sm">{region.name}</strong>
                  <span className="text-xs text-white/60">
                    {region.countryCount} countries
                    {profile.complete && value !== undefined ? ` · Nexit Match ${value}%` : ''}
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

  return (
    <div>
      <div className="nexit-mapbox">
        <div
          ref={containerRef}
          className="absolute inset-0"
          aria-label="Interactive Mapbox map of Nexitnation regions"
        />
      </div>
      {/* Non-map path: always available, not dependent on pointer interaction */}
      <section aria-label="Nexitnation regions">
        <h2 className="mt-8 text-lg font-bold text-navy">All regions</h2>
        <RegionGrid profile={profile} />
      </section>
    </div>
  )
}
