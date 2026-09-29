'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, X } from 'lucide-react'

const PASSPORT_INDEX_BASE = 'https://www.passportindex.org/'

function passportIndexUrl(countrySlug?: string) {
  if (!countrySlug) return PASSPORT_INDEX_BASE
  return `${PASSPORT_INDEX_BASE}passport/${encodeURIComponent(countrySlug)}/`
}

function PassportGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <circle cx="12" cy="10" r="2.6" />
      <path d="M8.5 17c.6-2 2-3 3.5-3s2.9 1 3.5 3" />
    </svg>
  )
}

function PassportLightbox({
  open,
  onClose,
  url,
  countryName,
}: {
  open: boolean
  onClose: () => void
  url: string
  countryName?: string
}) {
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  const title = countryName ? `${countryName} passport research` : 'Passport research'

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close passport research" onClick={onClose} className="absolute inset-0 cursor-default bg-navy/60 backdrop-blur-[2px]" />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-card bg-white shadow-2xl">
        <div className="flex items-start gap-4 border-b border-line bg-navy-deep p-6 text-white">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold">
            <PassportGlyph className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-extrabold">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-white/70">
              Passport power shapes your move: where you can enter visa-free, where you need a visa in advance, and how strong your backup options are.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 flex-none place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-navy">What to check on Passport Index</h3>
          <ul className="mt-3 space-y-2.5 text-sm leading-6 text-muted">
            <li className="flex gap-2.5"><span className="mt-2 size-1.5 flex-none rounded-full bg-gold-deep" aria-hidden="true" />Mobility score and world rank for the passport you hold.</li>
            <li className="flex gap-2.5"><span className="mt-2 size-1.5 flex-none rounded-full bg-gold-deep" aria-hidden="true" />How many countries are visa-free or visa-on-arrival.</li>
            <li className="flex gap-2.5"><span className="mt-2 size-1.5 flex-none rounded-full bg-gold-deep" aria-hidden="true" />Which of your target countries require a visa in advance.</li>
          </ul>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="gold-button mt-6 w-full"
          >
            Open Passport Index <ExternalLink size={15} aria-hidden="true" />
          </a>
          <p className="mt-3 text-center text-[11px] text-muted-soft">External service · Kolmari is not affiliated with Passport Index.</p>
        </div>
      </div>
    </div>
  )
}

export function PassportIndexLink({
  countrySlug,
  countryName,
  variant = 'compact',
  lightbox = false,
}: {
  countrySlug?: string
  countryName?: string
  variant?: 'compact' | 'banner'
  /** When true, opens a Kolmari lightbox instead of a new tab. */
  lightbox?: boolean
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const href = passportIndexUrl(countrySlug)
  const label = countryName ? `${countryName} passport data` : 'Passport Index research'

  if (variant === 'banner') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${label} on Passport Index (opens in a new tab)`}
        className="group flex flex-col gap-5 rounded-card border border-white/10 bg-gradient-to-r from-navy-deep to-[#1c3a6e] p-6 text-white shadow-card transition hover:border-gold/45 sm:flex-row sm:items-center"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold"><PassportGlyph className="size-6" /></span>
        <span className="flex-1">
          <span className="block text-sm font-extrabold">Passport Index — external research</span>
          <span className="mt-1 block text-sm leading-6 text-white/70">
            Review passport strength, mobility rankings, and visa-free access directly on Passport Index.
          </span>
          <span className="mt-2 block text-[11px] text-white/45">External service · Kolmari is not affiliated with Passport Index.</span>
        </span>
        <span className="inline-flex min-h-11 items-center justify-center gap-2 rounded-field bg-gold px-4 text-sm font-extrabold text-navy transition group-hover:bg-[#ffd83d]">
          Open Passport Index <ExternalLink size={15} />
        </span>
      </a>
    )
  }

  const buttonClassName =
    'flex w-full items-center gap-3 rounded-xl bg-navy-deep p-3 text-left text-white transition hover:bg-navy'

  const buttonInner = (
    <>
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold"><PassportGlyph className="size-[18px]" /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-extrabold">Passport power and visa-free access</span>
        <span className="mt-0.5 block text-[10px] text-white/55">Research on Passport Index</span>
      </span>
      <ExternalLink size={15} className="shrink-0 text-gold" />
    </>
  )

  if (lightbox) {
    return (
      <>
        <button
          type="button"
          aria-label={`${label} (opens research panel)`}
          aria-haspopup="dialog"
          onClick={(event) => {
            event.stopPropagation()
            setLightboxOpen(true)
          }}
          className={buttonClassName}
        >
          {buttonInner}
        </button>
        <PassportLightbox open={lightboxOpen} onClose={() => setLightboxOpen(false)} url={href} countryName={countryName} />
      </>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} on Passport Index (opens in a new tab)`}
      className={buttonClassName}
    >
      {buttonInner}
    </a>
  )
}
