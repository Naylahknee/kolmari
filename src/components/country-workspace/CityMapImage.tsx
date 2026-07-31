'use client'

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react'
import { MapPin } from 'lucide-react'

type Props = {
  cityName: string
  countryName: string
  lat: number
  lng: number
  alt: string
}

export function CityMapImage({ cityName, countryName, lat, lng, alt }: Props) {
  const [failed, setFailed] = useState(false)
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  if (!token || failed) {
    // Intentional static placeholder rather than a broken "unavailable" box.
    return (
      <div
        role="img"
        aria-label={`${cityName}, ${countryName}`}
        className="flex aspect-[12/7] items-center justify-center gap-1.5 bg-[#cfe6f5] px-4 text-center"
      >
        <MapPin size={15} className="text-navy/45" aria-hidden="true" />
        <span className="text-xs font-semibold text-navy/70">{cityName}</span>
      </div>
    )
  }

  const marker = `pin-s+F3C516(${lng},${lat})`
  const camera = `${lng},${lat},10,0`
  const src = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${marker}/${camera}/720x420@2x?access_token=${encodeURIComponent(token)}`

  return (
    <div className="relative aspect-[12/7] overflow-hidden bg-canvas">
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
