import Image from 'next/image'
import Link from 'next/link'

/**
 * Marketing logo lockup: the Kolmari butterfly mark (from the on-disk favicon
 * asset) inside a navy tile, plus the "Kolmari" wordmark text. `tone` sets the
 * text color for the surface it sits on ('dark' text on light surfaces,
 * 'light' text on dark surfaces).
 */
export function MarketingLogo({ compact = false, tone = 'dark' }: { compact?: boolean; tone?: 'dark' | 'light' }) {
  const mark = compact ? 28 : 34
  const inner = Math.round(mark * 0.72)
  return (
    <Link href="/" aria-label="Kolmari home" className="inline-flex shrink-0 items-center gap-2.5">
      <span
        className="grid shrink-0 place-items-center rounded-[9px] bg-navy-deep"
        style={{ width: mark, height: mark }}
      >
        <Image
          src="/brand/favicon-512.png"
          alt=""
          width={inner}
          height={inner}
          priority
          className="object-contain"
          style={{ width: inner, height: inner }}
        />
      </span>
      <span className={`font-extrabold tracking-tight ${compact ? 'text-base' : 'text-lg'} ${tone === 'light' ? 'text-white' : 'text-navy'}`}>
        Kolmari
      </span>
    </Link>
  )
}
