'use client'

import { MapPin } from 'lucide-react'

/**
 * City map tile for country workspace city cards. Currently a static
 * placeholder (pin + city name); the retired Mapbox-token static-image branch
 * was removed (Sep 2026) since no token was ever configured. If live city
 * maps are wanted later, reuse the CountryVectorMap stack, not Mapbox.
 */

type Props = {
  cityName: string
  countryName: string
  lat: number
  lng: number
  alt: string
}

export function CityMapImage({ cityName, countryName, lat, lng }: Props) {
  void lat
  void lng
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
