import Link from 'next/link'
import { flagSrc } from '@/lib/flags'
import { HeroAutoGenerate } from './HeroAutoGenerate'
import { focalToObjectPosition } from '@/lib/country-visuals/schema'

export type HeroArtwork = { src: string; focalPoint: { x: number; y: number } }
export type HeroStatusChip = { label: string; tone?: 'gold' | 'good' | 'muted' }

type HeroCountry = { slug: string; name: string; code: string; city: string; region: string }
type LatLng = { lat: number; lng: number }

export type CountryHeroData = {
  primaryVisaRoute: string | null
  monthlyCostUsd: number | null
  timeToResidency: string | null
  pathToCitizenship: string | null
  sources: Record<string, string>
}

function HeroBackdrop({ code, artwork }: { code: string; artwork?: HeroArtwork | null }) {
  const flag = code ? flagSrc(code) : null
  if (artwork) {
    return (
      <div
        className="hero-bg hero-bg-artwork"
        aria-hidden="true"
        style={{ backgroundImage: `url("${artwork.src}")`, backgroundPosition: focalToObjectPosition(artwork.focalPoint) }}
      />
    )
  }
  return flag
    ? <div className="hero-bg hero-bg-flag" aria-hidden="true" style={{ backgroundImage: `url("${flag}")` }} />
    : <div className="hero-bg hero-bg-empty" aria-hidden="true" />
}

/** Shared hero for every locked and unlocked country page. Preserve the
 * existing country background and show only the country name over it. */
export function CountryHero({
  country,
  heroArtwork = null,
}: {
  go: (s: string) => void
  fromQuiz?: boolean
  country: HeroCountry
  center?: LatLng | null
  visaType?: string
  rich?: boolean
  data?: CountryHeroData | null
  heroArtwork?: HeroArtwork | null
  statusChips?: HeroStatusChip[]
  paid?: boolean
}) {
  return (
    <section className="country-hero-wrap">
      <div className="hero">
        <HeroBackdrop code={country.code} artwork={heroArtwork} />
        {!heroArtwork && <HeroAutoGenerate slug={country.slug} />}
        <div className="hero-scrim" aria-hidden="true" />
        <Link href="/your-world" className="hero-back-pill">← All destinations</Link>
        <div className="hero-body">
          <h1 className="hero-name">{country.name}</h1>
        </div>
      </div>
    </section>
  )
}
