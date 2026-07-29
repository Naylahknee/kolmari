'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Globe2, LayoutGrid } from 'lucide-react'
import { type RegionSlug } from '@/lib/destinations-data'
import { CountriesView } from './countries-browser'

type View = 'map' | 'countries'

type Props = {
  profileComplete: boolean
  regionMatches: Record<RegionSlug, number> | null
  initialView: View
  initialQuery: string
}

// ─── Lazy-loaded Mapbox canvas ────────────────────────────────────────────────
// Imported with ssr:false so the heavy Mapbox GL bundle is code-split and the
// component is only evaluated in the browser. The dynamic import also means
// the map never touches a hidden container (zero-dimension on first mount
// when `hidden` attr is present).

const MapboxCanvas = dynamic(
  () => import('./NexitnationMapbox').then((m) => m.NexitnationMapbox),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center rounded-[24px] border border-gold/20 bg-navy-deep"
        style={{ height: 560 }}
        role="status"
        aria-label="Map loading"
      >
        <div className="flex flex-col items-center gap-3 text-white/60">
          <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-gold" aria-hidden="true" />
          <span className="text-sm">Loading map…</span>
        </div>
      </div>
    ),
  },
)

// ─── Unified Destinations workspace ──────────────────────────────────────────

export function NexitWorldWorkspace({ profileComplete, regionMatches, initialView, initialQuery }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [view, setView] = useState<View>(initialView)
  // Once the map tab has been shown, keep it mounted so Mapbox never
  // re-initialises against a zero-dimension container.
  const [mapEverShown, setMapEverShown] = useState(initialView === 'map')

  // Keep URL state in sync with view selection
  function switchView(next: View) {
    if (next === 'map') setMapEverShown(true)
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

      {/* Map view — use CSS visibility instead of `hidden` so the container
          retains its dimensions after first mount. Mapbox needs a non-zero
          bounding rect at initialisation time; `hidden` collapses the
          container to 0×0, causing a permanently blank canvas. */}
      {mapEverShown && (
        <div
          id="panel-map"
          role="tabpanel"
          aria-labelledby="tab-map"
          className="space-y-6"
          style={view !== 'map' ? { position: 'absolute', visibility: 'hidden', pointerEvents: 'none' } : undefined}
        >
          <MapboxCanvas profile={{ complete: profileComplete, matches: regionMatches }} />
        </div>
      )}

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
