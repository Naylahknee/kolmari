'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { CountryPreview } from '@/lib/destinations-data'

/**
 * Card-top artwork for region pages: the country's own photo when one exists,
 * otherwise a large centered flag on navy. Replaces the gold country-outline
 * artwork per owner direction (2026-09-28).
 */
export function RegionCountryArt({ country, regionImage }: { country: CountryPreview; regionImage: string }) {
  const [flagFailed, setFlagFailed] = useState(false)
  const hasPhoto = country.image !== regionImage

  return (
    <div className="relative flex h-40 items-center justify-center overflow-hidden bg-navy-deep">
      {hasPhoto ? (
        <Image
          src={country.image}
          alt={`${country.name} photography`}
          fill
          sizes="(min-width: 1280px) 320px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      ) : !flagFailed ? (
        <img
          src={`https://flagcdn.com/w320/${country.code.toLowerCase()}.png`}
          alt={`${country.name} flag`}
          className="h-20 w-auto rounded-md object-cover shadow-lg"
          onError={() => setFlagFailed(true)}
        />
      ) : (
        <span className="text-5xl font-extrabold tracking-wide text-gold/80">{country.code}</span>
      )}
      <span className="absolute bottom-3 left-3 rounded-[var(--radius-pill)] bg-navy-deep/85 px-3 py-1 text-[10px] font-bold text-white">
        {country.city} · {country.code}
      </span>
    </div>
  )
}
