'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { geoNaturalEarth1, geoPath, geoGraticule10 } from 'd3-geo'
import { feature } from 'topojson-client'
import countries110m from 'world-atlas/countries-110m.json'
import type { WorldPin } from './your-world-map'

/**
 * Canonical Your World map (Sep 2026): a Natural Earth SVG world map that is
 * always visible, needs no Mapbox token, and highlights matched countries.
 *
 * Gold fill = quiz-ranked match. White fill = country the user picked in the
 * Profile Wizard ("First destinations to compare"). Every highlighted country
 * is clickable and routes to its country page. Countries too small to appear
 * in the 110m dataset (Malta) get a star pin at their centroid instead.
 */

const W = 1000
const H = 420

// world-atlas uses ISO 3166 numeric ids on each country feature.
const ISO2_TO_NE_ID: Record<string, string> = {
  AL: '008', AU: '036', BG: '100', BZ: '084', CA: '124', CR: '188', DE: '276',
  EC: '218', EE: '233', ES: '724', FR: '250', GB: '826', GE: '268', GR: '300',
  IE: '372', IT: '380', JP: '392', KH: '116', KR: '410', MT: '470', MX: '484',
  NL: '528', NZ: '554', PA: '591', PH: '608', PT: '620', PY: '600', RO: '642',
  SI: '705', TH: '764', UY: '858',
}

type CountryFeature = {
  type: 'Feature'
  id?: string
  properties: { name: string }
  geometry: object | null
}

const topo = countries110m as { objects: { countries: object } }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ALL_COUNTRIES = (feature as (topology: any, obj: any) => { features: CountryFeature[] })(topo, topo.objects.countries).features

const projection = geoNaturalEarth1().fitExtent(
  [
    [8, 8],
    [W - 8, H - 8],
  ],
  { type: 'Sphere' },
)
const path = geoPath(projection)
const SPHERE = path({ type: 'Sphere' }) ?? ''
const GRID = path(geoGraticule10()) ?? ''

function starPath(cx: number, cy: number, r: number): string {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2
    const rad = i % 2 === 0 ? r : r * 0.42
    pts.push(`${i === 0 ? 'M' : 'L'}${(cx + rad * Math.cos(angle)).toFixed(1)},${(cy + rad * Math.sin(angle)).toFixed(1)}`)
  }
  return `${pts.join(' ')} Z`
}

export function WorldSvgMap({ pins }: { pins: WorldPin[] }) {
  const byNeId = useMemo(() => new Map(ALL_COUNTRIES.map((f) => [String(f.id), f])), [])

  const highlighted = useMemo(() => {
    return pins
      .map((pin) => {
        const neId = ISO2_TO_NE_ID[pin.code]
        const feature = neId ? byNeId.get(neId) : undefined
        return { pin, feature }
      })
      .filter((h) => h.feature?.geometry)
  }, [pins, byNeId])

  // Pins whose country polygon is missing from the 110m dataset (e.g. Malta)
  // still get a star marker projected from their lat/lng.
  const orphanPins = useMemo(
    () => pins.filter((pin) => {
      const neId = ISO2_TO_NE_ID[pin.code]
      return !neId || !byNeId.get(neId)?.geometry
    }),
    [pins, byNeId],
  )

  const neIdToPin = useMemo(() => {
    const m = new Map<string, WorldPin>()
    for (const { pin, feature: feat } of highlighted) m.set(String(feat!.id), pin)
    return m
  }, [highlighted])

  return (
    <div className="overflow-hidden rounded-[12px]" style={{ background: '#102142' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="auto"
        className="block"
        role="img"
        aria-label={`World map highlighting ${pins.map((p) => p.name).join(', ')}`}
      >
        <path d={SPHERE} fill="#122a52" />
        <path d={GRID} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={0.6} />

        {ALL_COUNTRIES.map((f) => {
          const id = String(f.id)
          const pin = neIdToPin.get(id)
          const isHi = Boolean(pin)
          const inner = (
            <path
              d={path(f as unknown as Parameters<typeof path>[0]) ?? ''}
              fill={isHi ? (pin?.kind === 'selected' ? 'rgba(255,255,255,.55)' : 'rgba(243,197,22,.5)') : 'rgba(255,255,255,.10)'}
              stroke={isHi ? '#f3c516' : 'rgba(13,27,57,.55)'}
              strokeWidth={isHi ? 1.2 : 0.5}
              style={isHi ? { cursor: 'pointer' } : undefined}
            >
              <title>{`${f.properties.name}${pin?.score != null ? ` — ${pin.score}% match` : ''}`}</title>
            </path>
          )
          return isHi && pin ? (
            <Link key={id} href={`/nextinations/${pin.slug}/v2/overview`} aria-label={`Open ${pin.name}`} style={{ cursor: 'pointer' }}>
              {inner}
            </Link>
          ) : (
            <g key={id}>{inner}</g>
          )
        })}

        {highlighted.map(({ pin, feature }) => {
          const [x, y] = path.centroid(feature as unknown as Parameters<typeof path>[0])
          const gold = pin.kind === 'match'
          return (
            <Link key={`pin-${pin.slug}`} href={`/nextinations/${pin.slug}/v2/overview`} aria-label={`Open ${pin.name}`}>
              <path
                d={starPath(x, y, 9)}
                fill={gold ? '#f3c516' : '#ffffff'}
                stroke="#0d1b39"
                strokeWidth={1.4}
                style={{ cursor: 'pointer' }}
              >
                <title>{pin.name}</title>
              </path>
            </Link>
          )
        })}

        {orphanPins.map((pin) => {
          const projected = projection([pin.lng, pin.lat])
          if (!projected) return null
          const [x, y] = projected
          const gold = pin.kind === 'match'
          return (
            <Link key={`pin-${pin.slug}`} href={`/nextinations/${pin.slug}/v2/overview`} aria-label={`Open ${pin.name}`}>
              <path
                d={starPath(x, y, 9)}
                fill={gold ? '#f3c516' : '#ffffff'}
                stroke="#0d1b39"
                strokeWidth={1.4}
                style={{ cursor: 'pointer' }}
              >
                <title>{pin.name}</title>
              </path>
            </Link>
          )
        })}
      </svg>
      <p className="flex items-center gap-4 px-4 py-2.5 text-[11px] font-semibold text-white/60">
        <span className="inline-flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-[3px] bg-[#f3c516]" /> Matched</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block size-2.5 rounded-[3px] bg-white" /> Your picks</span>
        <span className="ml-auto hidden sm:inline">Click a highlighted country to open it</span>
      </p>
    </div>
  )
}
