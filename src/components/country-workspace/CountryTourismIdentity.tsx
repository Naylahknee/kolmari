'use client'

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import type { CountryTourismMedia } from '@/lib/country-workspace/country-tourism-media'

export function CountryTourismIdentity({ media }: { media: CountryTourismMedia }) {
  const [flagFailed, setFlagFailed] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <section className="card-surface overflow-hidden" aria-labelledby="country-identity-heading">
      <div className="grid lg:grid-cols-[1.35fr_.65fr]">
        <div className="relative min-h-64 bg-canvas">
          {imageFailed ? (
            <div className="flex h-full min-h-64 items-center justify-center px-6 text-center text-sm font-semibold text-muted">
              Official tourism image temporarily unavailable for {media.countryName}.
            </div>
          ) : (
            <img
              src={media.imageSrc}
              alt={media.imageAlt}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full min-h-64 w-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8">
          <div className="flex items-center gap-4">
            {flagFailed ? (
              <div className="grid h-14 w-20 place-items-center rounded border border-line bg-canvas text-xs font-bold text-muted">
                {media.countryCode}
              </div>
            ) : (
              <img
                src={media.flagSrc}
                alt={media.flagAlt}
                width={80}
                height={54}
                onError={() => setFlagFailed(true)}
                className="h-auto w-20 rounded border border-line object-contain"
              />
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Country identity</p>
              <h2 id="country-identity-heading" className="mt-1 text-2xl font-bold text-navy">{media.countryName}</h2>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-muted">{media.attribution}</p>
          <a
            href={media.tourismUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-gold-deep"
          >
            View official tourism information on {media.tourismLabel}
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
