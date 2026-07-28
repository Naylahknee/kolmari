import { ExternalLink } from 'lucide-react'

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

export function PassportIndexLink({
  countrySlug,
  countryName,
  variant = 'compact',
}: {
  countrySlug?: string
  countryName?: string
  variant?: 'compact' | 'banner'
}) {
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

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} on Passport Index (opens in a new tab)`}
      className="mt-3 flex items-center gap-3 rounded-xl bg-navy-deep p-3 text-white transition hover:bg-navy"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gold/15 text-gold"><PassportGlyph className="size-[18px]" /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-extrabold">Passport power and visa-free access</span>
        <span className="mt-0.5 block text-[10px] text-white/55">Research on Passport Index</span>
      </span>
      <ExternalLink size={15} className="shrink-0 text-gold" />
    </a>
  )
}
