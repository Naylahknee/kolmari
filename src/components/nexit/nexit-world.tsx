'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import mapboxgl from 'mapbox-gl'
import { ArrowRight, Globe2, LayoutGrid, MapPinned } from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'
import './nexitnation-map.css'
import { regionList, type RegionSlug } from '@/lib/nexitnation-data'
import { CountriesView } from './countries-browser'

type View = 'map' | 'countries'

type Props = {
  profileComplete: boolean
  regionMatches: Record<RegionSlug, number> | null
  initialView: View
  initialQuery: string
}

// ─── Region badge helpers ────────────────────────────────────────────────────

function createBadgeElement(
  region: { slug: RegionSlug; name: string; countryCount: number },
  matchValue: number | undefined,
  profileComplete: boolean,
  onNavigate: (slug: RegionSlug) => void,
): HTMLButtonElement {
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

  // Only show Nexit Match when profile is complete and value is real
  if (profileComplete && matchValue !== undefined) {
    const matchEl = document.createElement('span')
    matchEl.className = 'custom-region-badge__match'
    matchEl.textContent = `Nexit Match ${matchValue}%`
    el.appendChild(matchEl)
  }

  el.addEventListener('click', () => onNavigate(region.slug))
  return el
}

// ─── Map panel ───────────────────────────────────────────────────────────────

function MapPanel({ profileComplete, regionMatches }: { profileComplete: boolean; regionMatches: Record<RegionSlug, number> | null }) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const [mapError, setMapError] = useState(false)

  const navigateToRegion = useCallback((slug: RegionSlug) => {
    router.push(`/nexitnation/${slug}`)
  }, [router])

  useEffect(() => {
    if (!token || mapError || !containerRef.current || mapRef.current) return

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
      for (const region of regionList) {
        const matchValue = regionMatches?.[region.slug]
        const el = createBadgeElement(region, matchValue, profileComplete, navigateToRegion)
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
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, mapError])

  if (!token || mapError) {
    return (
      <section className="rounded-[24px] bg-navy-deep p-6 text-white sm:p-8" aria-label="Nexitnation regions">
        <div className="flex items-start gap-4">
          <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-gold text-navy" aria-hidden="true">
            <MapPinned size={18} />
          </span>
          <div>
            <p className="font-bold">Interactive map unavailable.</p>
            <p className="mt-1 text-sm text-white/65">
              Set{' '}
              <code className="rounded bg-white/10 px-1 py-0.5 text-xs">NEXT_PUBLIC_MAPBOX_TOKEN</code>
              {' '}to enable the live map. All regions are still accessible below.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="nexit-mapbox" aria-hidden="true">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  )
}

// ─── Accessible region grid (always shown under the map) ─────────────────────

function RegionGrid({ profileComplete, regionMatches }: { profileComplete: boolean; regionMatches: Record<RegionSlug, number> | null }) {
  const router = useRouter()
  return (
    <section aria-label="All regions">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">All regions</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {regionList.map((region) => {
          const matchValue = regionMatches?.[region.slug]
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
                  {profileComplete && matchValue !== undefined
                    ? ` · Nexit Match ${matchValue}%`
                    : !profileComplete
                      ? ' · Complete your profile for match data'
                      : ''}
                </span>
              </span>
              <ArrowRight size={16} className="shrink-0 text-gold-deep" aria-hidden="true" />
            </button>
          )
        })}
      </div>
    </section>
  )
}

// ─── Unified Nexit World workspace ───────────────────────────────────────────

export function NexitWorldWorkspace({ profileComplete, regionMatches, initialView, initialQuery }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [view, setView] = useState<View>(initialView)

  // Keep URL state in sync with view selection
  function switchView(next: View) {
    setView(next)
    const params = new URLSearchParams(searchParams.toString())
    params.set('view', next)
    router.replace(`/nexitnation?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="space-y-6">
      {/* View switcher — accessible segmented control */}
      <div
        role="tablist"
        aria-label="Discovery view"
        className="inline-flex rounded-[var(--radius-field)] border border-line bg-white p-1"
      >
        <button
          role="tab"
          type="button"
          aria-selected={view === 'map'}
          aria-controls="panel-map"
          id="tab-map"
          onClick={() => switchView('map')}
          className={[
            'flex items-center gap-2 rounded-[calc(var(--radius-field)-2px)] px-4 py-2 text-sm font-semibold transition-colors',
            view === 'map'
              ? 'bg-navy text-white shadow-sm'
              : 'text-muted hover:text-navy',
          ].join(' ')}
        >
          <Globe2 size={15} aria-hidden="true" />
          Map
        </button>
        <button
          role="tab"
          type="button"
          aria-selected={view === 'countries'}
          aria-controls="panel-countries"
          id="tab-countries"
          onClick={() => switchView('countries')}
          className={[
            'flex items-center gap-2 rounded-[calc(var(--radius-field)-2px)] px-4 py-2 text-sm font-semibold transition-colors',
            view === 'countries'
              ? 'bg-navy text-white shadow-sm'
              : 'text-muted hover:text-navy',
          ].join(' ')}
        >
          <LayoutGrid size={15} aria-hidden="true" />
          Countries
        </button>
      </div>

      {/* Map view */}
      <div
        id="panel-map"
        role="tabpanel"
        aria-labelledby="tab-map"
        hidden={view !== 'map'}
        className="space-y-6"
      >
        <MapPanel profileComplete={profileComplete} regionMatches={regionMatches} />
        <RegionGrid profileComplete={profileComplete} regionMatches={regionMatches} />
      </div>

      {/* Countries view */}
      <div
        id="panel-countries"
        role="tabpanel"
        aria-labelledby="tab-countries"
        hidden={view !== 'countries'}
      >
        <CountriesView initialQuery={initialQuery} profileComplete={profileComplete} />
      </div>
    </div>
  )
}
