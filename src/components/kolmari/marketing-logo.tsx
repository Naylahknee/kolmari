import Image from 'next/image'
import Link from 'next/link'

/**
 * Marketing logo lockup: the Kolmari butterfly mark (from the on-disk favicon
 * asset) inside a navy tile, plus the "Kolmari" wordmark text. `tone` sets the
 * text color for the surface it sits on ('dark' text on light surfaces,
 * 'light' text on dark surfaces).
 */
export function MarketingLogo({ compact = false, tone = 'dark', href = '/' }: { compact?: boolean; tone?: 'dark' | 'light'; href?: string }) {
  const mark = compact ? 28 : 34
  return (
    <Link href={href} aria-label="Kolmari home" className="inline-flex shrink-0 items-center gap-2.5">
      {/* Transparent butterfly mark — no background tile. */}
      <Image
        src="/brand/favicon-512.png"
        alt=""
        width={mark}
        height={mark}
        priority
        className="object-contain"
        style={{ width: mark, height: mark }}
      />
      <span className={`font-extrabold tracking-tight ${compact ? 'text-base' : 'text-lg'} ${tone === 'light' ? 'text-white' : 'text-navy'}`}>
        Kolmari
      </span>
    </Link>
  )
}
