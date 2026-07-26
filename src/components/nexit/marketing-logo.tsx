import Image from 'next/image'
import Link from 'next/link'

export function MarketingLogo({ compact = false }: { compact?: boolean }) {
  const size = compact ? 32 : 40

  return (
    <Link href="/" aria-label="Nexit home" className="inline-flex shrink-0 items-center">
      <Image
        src="/brand/nexit-butterfly.png"
        alt="Nexit"
        width={size}
        height={size}
        priority
        style={{ width: size, height: size }}
      />
    </Link>
  )
}
