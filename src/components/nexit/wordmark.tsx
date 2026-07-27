import Image from 'next/image'
import Link from 'next/link'

/**
 * Wordmark — uses the approved NexitWordMark.svg from public/brand/.
 *
 * The SVG carries transparent background and works on both dark surfaces
 * (sidebar, hero) and light surfaces (auth, cards, mobile header).
 *
 * Do not recreate the wordmark in CSS or with a standard font.
 * Brand asset rule: use only the owner-supplied files in public/brand/.
 */
export function Wordmark({
  compact = false,
  href = '/',
}: {
  /** @deprecated The SVG works on all surfaces — this prop is kept for call-site compatibility only */
  dark?: boolean
  compact?: boolean
  href?: string
}) {
  const h = compact ? 28 : 32
  const w = compact ? 96 : 112
  return (
    <Link href={href} aria-label="Kolmari home" className="inline-flex shrink-0 items-center">
      <Image
        src="/brand/NexitWordMark.svg"
        alt="Kolmari"
        width={w}
        height={h}
        style={{ width: 'auto', height: h }}
        priority
      />
    </Link>
  )
}
