'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { MapPinned } from 'lucide-react'
import { geoGraticule10, geoMercator, geoPath } from 'd3-geo'
import { getCountryFeature, getWorldFeatures } from '@/lib/world-geo'

type Fallback = 'flag' | 'locator'

type Props = {
  countryName: string
  lat: number
  lng: number
  alt: string
  countryCode?: string
  cityName?: string
  /** Flags are the default failure for cards and grids. Use locator only when geography is the job. */
  fallback?: Fallback
}

function FlagFallback({ countryName, countryCode, cityName }: Pick<Props, 'countryName' | 'countryCode' | 'cityName'>) {
  return (
    <div
      role="img"
      aria-label={`${countryName}${cityName ? `, ${cityName}` : ''}`}
      className="flex aspect-[16/9] min-h-40 w-full flex-col items-center justify-center gap-3 bg-navy-deep px-6 text-center"
    >
      {countryCode ? (
        <img
          src={`/flags/${countryCode.toLowerCase()}.svg`}
          alt=""
          className="h-auto w-16 rounded-sm border border-white/20 shadow-lg"
          onError={(event) => { event.currentTarget.style.display = 'none' }}
        />
      ) : null}
      <span className="text-base font-bold text-white">{countryName}</span>
      {cityName ? <span className="text-xs font-semibold text-white/65">{cityName}</span> : null}
    </div>
  )
}

function LocatorFallback({ countryName, countryCode, cityName, lat, lng }: Pick<Props, 'countryName' | 'countryCode' | 'cityName' | 'lat' | 'lng'>) {
  const clipId = useId()
  const map = useMemo(() => {
    const W = 800
    const H = 450
    const PAD = 30
    const target = getCountryFeature(countryCode)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dOf = (proj: (o: any) => string | null) => (obj: any): string => proj(obj) ?? ''

    if (target?.geometry) {
      const [[bx0, by0], [bx1, by1]] = geoPath().bounds(target as never)
      const cx = (bx0 + bx1) / 2
      const cy = (by0 + by1) / 2
      const hw = Math.max(((bx1 - bx0) / 2) * 1.5, 7)
      const hh = Math.max(((by1 - by0) / 2) * 1.5, 7)
      const x0 = Math.max(-180, cx - hw)
      const x1 = Math.min(180, cx + hw)
      const y0 = Math.max(-90, cy - hh)
      const y1 = Math.min(90, cy + hh)
      const bbox = {
        type: 'Polygon',
        coordinates: [[[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]],
      } as never
      const proj = geoMercator().fitExtent([[PAD, PAD], [W - PAD, H - PAD]], bbox)
      const d = dOf(geoPath(proj))
      return {
        land: getWorldFeatures().map((f) => d(f)).filter(Boolean),
        lines: [] as string[],
        target: d(target),
        pin: (proj([lng, lat]) ?? [W / 2, H / 2]) as [number, number],
      }
    }

    // No polygon in the dataset (e.g. Malta): zoom to a regional graticule.
    const x0 = Math.max(-180, lng - 14)
    const x1 = Math.min(180, lng + 14)
    const y0 = Math.max(-90, lat - 10)
    const y1 = Math.min(90, lat + 10)
    const bbox = {
      type: 'Polygon',
      coordinates: [[[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]],
    } as never
    const proj = geoMercator().fitExtent([[PAD, PAD], [W - PAD, H - PAD]], bbox)
    const d = dOf(geoPath(proj))
    return {
      land: [] as string[],
      lines: [d(geoGraticule10())].filter(Boolean),
      target: '',
      pin: (proj([lng, lat]) ?? [W / 2, H / 2]) as [number, number],
    }
  }, [countryCode, lat, lng])

  const [pinX, pinY] = map.pin

  return (
    <div
      role="img"
      aria-label={`Map of ${countryName}${cityName ? `, ${cityName} marked` : ''}`}
      className="relative aspect-[16/9] min-h-40 w-full overflow-hidden bg-[#cfe6f5]"
    >
      <svg viewBox="0 0 800 450" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <clipPath id={clipId}>
            <rect width="800" height="450" />
          </clipPath>
        </defs>
        <rect width="800" height="450" fill="#cfe6f5" />
        <g clipPath={`url(#${clipId})`}>
          {map.land.map((d, i) => (
            <path key={i} d={d} fill="#e4eef6" stroke="#a8cade" strokeWidth="0.8" />
          ))}
          {map.lines.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#9dc1d7" strokeWidth="1.2" />
          ))}
          {map.target && <path d={map.target} fill="#17456e" stroke="#ffffff" strokeWidth="1.6" />}
        </g>
      </svg>
      <span
        className="absolute grid size-8 -translate-x-1/2 -translate-y-full place-items-center rounded-full bg-gold text-navy shadow-lg ring-2 ring-white"
        style={{ left: `${(pinX / 800) * 100}%`, top: `${(pinY / 450) * 100}%` }}
        aria-hidden="true"
      >
        <MapPinned size={18} />
      </span>
      <div className="absolute bottom-4 left-4 rounded-card bg-white/92 px-3 py-2 shadow-card backdrop-blur-sm">
        <p className="text-sm font-bold text-navy">{cityName ?? countryName}</p>
        <p className="text-[11px] font-semibold text-muted">{countryName} · {Math.abs(lat).toFixed(1)}°{lat >= 0 ? 'N' : 'S'}, {Math.abs(lng).toFixed(1)}°{lng >= 0 ? 'E' : 'W'}</p>
      </div>
    </div>
  )
}

export function CountrySnapshotMap({
  countryName,
  lat,
  lng,
  alt,
  countryCode,
  cityName,
  fallback = 'flag',
}: Props) {
  const [failed, setFailed] = useState(false)
  const [heroSurface, setHeroSurface] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  // The existing country hero owns the `.hero-map` wrapper. Detecting it here
  // keeps that surface on the locator contract without changing its verified
  // content layout. All other callers retain the safer flag default.
  useEffect(() => {
    setHeroSurface(Boolean(rootRef.current?.closest('.hero-map')))
  }, [])

  const resolvedFallback: Fallback = heroSurface ? 'locator' : fallback

  if (!token || failed) {
    return (
      <div ref={rootRef} className="h-full w-full">
        {resolvedFallback === 'locator' ? (
          <LocatorFallback countryName={countryName} countryCode={countryCode} cityName={cityName} lat={lat} lng={lng} />
        ) : (
          <FlagFallback countryName={countryName} countryCode={countryCode} cityName={cityName} />
        )}
      </div>
    )
  }

  const marker = `pin-s+F8C21A(${lng},${lat})`
  const camera = `${lng},${lat},5,0`
  const src = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${marker}/${camera}/900x520@2x?access_token=${encodeURIComponent(token)}`

  return (
    <div ref={rootRef} className="relative aspect-[16/9] min-h-56 overflow-hidden bg-canvas">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
      <p className="absolute bottom-1 right-1 rounded bg-white/90 px-1.5 py-0.5 text-[9px] text-navy">
        © Mapbox © OpenStreetMap
      </p>
    </div>
  )
}
