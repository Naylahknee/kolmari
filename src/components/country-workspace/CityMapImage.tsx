'use client'

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react'

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
    return (
      <div
        role="img"
        aria-label={`${cityName}, ${countryName} map image unavailable`}
        className="flex aspect-[12/7] items-center justify-center bg-canvas px-5 text-center text-sm font-semibold text-muted"
      >
        Map image unavailable for {cityName}
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
