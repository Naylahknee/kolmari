'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react'
import { MapPinned } from 'lucide-react'

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

function LocatorFallback({ countryName, cityName, lat, lng }: Pick<Props, 'countryName' | 'cityName' | 'lat' | 'lng'>) {
  const x = Math.max(5, Math.min(95, ((lng + 180) / 360) * 100))
  const y = Math.max(8, Math.min(92, ((90 - lat) / 180) * 100))

  return (
    <div
      role="img"
      aria-label={`Locator showing ${cityName ?? countryName} in ${countryName}`}
      className="relative aspect-[16/9] min-h-40 w-full overflow-hidden bg-[#cfe6f5]"
    >
      <svg viewBox="0 0 800 450" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <rect width="800" height="450" fill="#cfe6f5" />
        {[100, 200, 300, 400, 500, 600, 700].map((line) => (
          <line key={`v-${line}`} x1={line} y1="0" x2={line} y2="450" stroke="#a8cade" strokeWidth="1" opacity=".5" />
        ))}
        {[75, 150, 225, 300, 375].map((line) => (
          <line key={`h-${line}`} x1="0" y1={line} x2="800" y2={line} stroke="#a8cade" strokeWidth="1" opacity=".5" />
        ))}
        <ellipse cx="400" cy="225" rx="330" ry="178" fill="none" stroke="#7ba7c7" strokeWidth="3" />
        <ellipse cx="400" cy="225" rx="165" ry="178" fill="none" stroke="#9dc1d7" strokeWidth="1.5" />
        <line x1="70" y1="225" x2="730" y2="225" stroke="#9dc1d7" strokeWidth="1.5" />
      </svg>
      <span
        className="absolute grid size-8 -translate-x-1/2 -translate-y-full place-items-center rounded-full bg-gold text-navy shadow-lg ring-2 ring-white"
        style={{ left: `${x}%`, top: `${y}%` }}
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
          <LocatorFallback countryName={countryName} cityName={cityName} lat={lat} lng={lng} />
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
