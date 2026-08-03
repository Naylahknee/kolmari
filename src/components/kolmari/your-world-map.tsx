import Link from 'next/link'
import { ArrowRight, MapPinned } from 'lucide-react'
import { REGION_MAP_LABELS, REGION_MAP_SHAPES, type RegionSlug } from '@/lib/destinations-data'
import { projectWorldCoordinate } from '@/lib/world-map'
import './your-world-map.css'

export type WorldPin = {
  slug: string
  name: string
  code: string
  lat: number
  lng: number
  score: number | null
}

const REGIONS: Array<{ slug: RegionSlug; label: string }> = [
  { slug: 'north-america', label: 'North America' },
  { slug: 'latin-america', label: 'Latin America' },
  { slug: 'europe', label: 'Europe' },
  { slug: 'africa', label: 'Africa' },
  { slug: 'asia', label: 'Asia' },
  { slug: 'oceania', label: 'Oceania' },
]

export function YourWorldMap({ pins }: { pins: WorldPin[] }) {
  return (
    <section className="your-world-map-container" aria-labelledby="your-world-map-title">
      <h2 id="your-world-map-title" className="sr-only">Your matched Destinations map</h2>
      <svg viewBox="0 0 1000 520" className="your-world-map-svg" role="img" aria-describedby="your-world-map-description">
        <desc id="your-world-map-description">
          An illustrated world map with links to six regions and markers for matched Destinations.
        </desc>
        <rect width="1000" height="520" rx="20" fill="#0D1B39" />
        <g className="your-world-map-grid" aria-hidden="true">
          <path d="M50 145 Q500 10 950 145" />
          <path d="M30 260 H970" />
          <path d="M50 375 Q500 510 950 375" />
          <ellipse cx="500" cy="260" rx="468" ry="228" />
        </g>

        {REGIONS.map(({ slug, label }) => {
          const [labelX, labelY] = REGION_MAP_LABELS[slug]
          return (
            <Link
              key={slug}
              href={`/destinations/regions/${slug}`}
              className="your-world-map-region"
              aria-label={`Explore ${label}`}
            >
              <path className="your-world-map-region__shape" d={REGION_MAP_SHAPES[slug]} />
              <text className="your-world-map-region__label" x={labelX} y={labelY} textAnchor="middle">
                {label}
              </text>
            </Link>
          )
        })}

        {pins.map((pin) => {
          const point = projectWorldCoordinate(pin)
          return (
            <Link
              key={pin.slug}
              href={`/nextinations/${pin.slug}/v2/overview`}
              className="your-world-map-marker"
              aria-label={`${pin.name}${pin.score !== null ? `, ${pin.score}% Match Score` : ''}`}
            >
              <g transform={`translate(${point.x} ${point.y})`}>
                <g className="your-world-map-marker__info" aria-hidden="true">
                  <rect x="-46" y="-48" width="92" height="28" rx="7" />
                  <text x="0" y="-31" textAnchor="middle">{pin.name}{pin.score !== null ? ` · ${pin.score}%` : ''}</text>
                </g>
                <circle className="your-world-map-marker__halo" r="16" />
                <circle className="your-world-map-marker__dot" r="12" />
                <text className="your-world-map-marker__code" x="0" y="3" textAnchor="middle">{pin.code}</text>
              </g>
            </Link>
          )
        })}
      </svg>

      {pins.length === 0 && (
        <div className="your-world-map-empty">
          <span className="grid size-9 place-items-center rounded-full bg-gold text-navy-deep" aria-hidden="true">
            <MapPinned size={17} />
          </span>
          <div>
            <p className="text-sm font-bold text-white">Plot your matched Destinations</p>
            <p className="text-xs text-white/65">Complete your Kolmari Profile to add personalized markers.</p>
          </div>
          <Link href="/profile-wizard" className="ml-auto inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white/10 px-3 text-xs font-bold text-white hover:bg-white/15">
            Complete profile <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  )
}
