'use client'

/* eslint-disable @next/next/no-img-element */

import { flagSrc } from '@/lib/flags'
import { useState } from 'react'
import { Building2 } from 'lucide-react'
import { focalToObjectPosition } from '@/lib/country-visuals/schema'

/* City-card image with the Kolmari fallback hierarchy:
 *   approved city photo → country flag → neutral city placeholder.
 * The country hero image is deliberately NOT a fallback here — a city card must
 * never borrow the country-level artwork. */
export function CityCardImage({
  imageSrc,
  cityName,
  countryName,
  countryCode,
  focalPoint,
  className,
}: {
  imageSrc: string
  cityName: string
  countryName?: string
  countryCode?: string
  focalPoint?: { x: number; y: number }
  className?: string
}) {
  const [stage, setStage] = useState<'image' | 'flag' | 'placeholder'>('image')

  if (stage === 'image') {
    return (
      <img
        src={imageSrc}
        alt={`${cityName}${countryName ? `, ${countryName}` : ''}`}
        loading="lazy"
        className={className}
        style={{ objectPosition: focalToObjectPosition(focalPoint) }}
        onError={() => setStage(countryCode ? 'flag' : 'placeholder')}
      />
    )
  }

  if (stage === 'flag' && countryCode) {
    return (
      <span className="city-img-fallback city-img-flag" role="img" aria-label={`${cityName}${countryName ? `, ${countryName}` : ''}`}>
        <img
          src={flagSrc(countryCode)}
          alt=""
          onError={() => setStage('placeholder')}
        />
      </span>
    )
  }

  return (
    <span className="city-img-fallback city-img-placeholder" role="img" aria-label={`${cityName}${countryName ? `, ${countryName}` : ''}`}>
      <Building2 size={22} aria-hidden="true" />
      <span className="city-img-name">{cityName}</span>
    </span>
  )
}
