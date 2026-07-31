'use client'

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react'
import { MapPinned } from 'lucide-react'

type Props = {
  countryName: string
  lat: number
  lng: number
  alt: string
}

export function CountrySnapshotMap({ countryName, lat, lng, alt }: Props) {
  const [failed, setFailed] = useState(false)
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  if (!token || failed) {
    // Intentional static placeholder (not a broken "unavailable" box) — the
    // interactive map is an enhancement, not load-bearing, and only renders
    // when a Mapbox token is configured.
    return (
      <div
        role="img"
        aria-label={countryName}
        className="flex aspect-[16/9] min-h-40 w-full flex-col items-center justify-center gap-2 bg-[#cfe6f5] px-6 text-center"
      >
        <MapPinned size={26} className="text-navy/45" aria-hidden="true" />
        <span className="text-sm font-semibold text-navy/70">{countryName}</span>
      </div>
    )
  }

  const marker = `pin-s+F8C21A(${lng},${lat})`
  const camera = `${lng},${lat},5,0`
  const src = `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${marker}/${camera}/900x520@2x?access_token=${encodeURIComponent(token)}`

  return (
    <div className="relative aspect-[16/9] min-h-56 overflow-hidden bg-canvas">
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
