'use client'

import { useState } from 'react'
import { FileText, Users } from 'lucide-react'
import { PASSPORT_COVERS } from '@/lib/passport-covers'

export function PassportCover({ code, country, className = '', mobility = false }: {
  code: string
  country?: string
  className?: string
  mobility?: boolean
}) {
  const asset = PASSPORT_COVERS[code.toUpperCase()]
  const [failedSource, setFailedSource] = useState<string | null>(null)
  const [loadedSource, setLoadedSource] = useState<string | null>(null)
  const name = country ?? asset?.country ?? 'Country'
  const available = asset && failedSource !== asset.src
  const Icon = mobility ? Users : FileText
  return (
    <span className={`relative inline-flex aspect-[5/7] shrink-0 items-center justify-center overflow-hidden rounded-[5px] bg-canvas ${className}`}>
      {!available || loadedSource !== asset.src ? (
        <span className="absolute inset-0 grid place-items-center text-muted-soft" role={available ? undefined : 'img'} aria-label={available ? undefined : mobility ? `${name} family mobility` : `${name}: passport cover unavailable`}>
          <Icon size={24} aria-hidden="true" />
        </span>
      ) : null}
      {available && (
        // Local source photographs retain their proportions; metadata and license credits live in the mapping.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asset.src} alt={`Official ${name} passport front cover`} width={250} height={350}
          loading="lazy" decoding="async" onLoad={() => setLoadedSource(asset.src)} onError={() => setFailedSource(asset.src)}
          className={`relative h-full w-full object-contain ${loadedSource === asset.src ? '' : 'opacity-0'}`} />
      )}
    </span>
  )
}

export function PassportCoverCredits() {
  return (
    <details className="mt-4 text-xs text-muted">
      <summary className="cursor-pointer font-semibold text-navy">Passport image sources and licenses</summary>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {Object.values(PASSPORT_COVERS).map((asset) => (
          <li key={asset.code}>
            <a href={asset.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-navy underline">{asset.country}</a>
            {' · '}{asset.author}{' · '}
            <a href={asset.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">{asset.license}</a>
            <p className="mt-1">{asset.changes} Image source checked {asset.sourceChecked}; this is not an entry-rule verification date.</p>
          </li>
        ))}
      </ul>
    </details>
  )
}
