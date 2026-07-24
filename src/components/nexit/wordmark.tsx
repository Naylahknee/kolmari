import Image from 'next/image'
import Link from 'next/link'

/**
 * Wordmark — uses the approved NexitWordMark.svg for dark surfaces (sidebar, hero)
 * and the nexit-wordmark-master-light.png for light surfaces (auth, cards).
 *
 * Do not recreate the wordmark in CSS or with a standard font.
 * Brand asset rule: use only the owner-supplied files in public/brand/.
 */
export function Wordmark({
  dark = false,
  compact = false,
  href = '/',
}: {
  dark?: boolean
  compact?: boolean
  href?: string
}) {
  const h = compact ? 28 : 32
  // Dark surface (sidebar, hero): NexitWordMark.svg — white/gold on transparent
  // Light surface (auth, cards): nexit-wordmark-master-light.png — navy/gold on transparent
  const src = dark ? '/brand/NexitWordMark.svg' : '/brand/nexit-wordmark-master-light.png'
  const w = compact ? 96 : 112
  return (
    <Link href={href} aria-label="Nexit home" className="inline-flex shrink-0 items-center">
      <Image src={src} alt="Nexit" width={w} height={h} style={{ width: 'auto', height: h }} priority />
    </Link>
  )
}
