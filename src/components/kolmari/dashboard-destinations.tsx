import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { CountryDetail } from '@/lib/countries'

// Real country artwork where it exists, otherwise the region artwork. No
// fabricated imagery — every asset ships in the repo.
const COUNTRY_IMAGE: Record<string, string> = {
  portugal: '/images/countries/portugal.webp',
  spain: '/images/countries/spain.webp',
  greece: '/images/countries/greece.webp',
  estonia: '/images/countries/estonia.webp',
}
const REGION_IMAGE: Record<string, string> = {
  Europe: '/images/regions/europe.webp',
  Americas: '/images/regions/latin-america.webp',
}

export function destinationImage(country: CountryDetail) {
  return COUNTRY_IMAGE[country.slug] ?? REGION_IMAGE[country.region] ?? '/images/regions/europe.webp'
}

export type DestinationPanel = { country: CountryDetail; match: number | null }

/**
 * The user's potential destinations shown as panels (request: dashboard
 * destination panels like the reference). When the Profile is complete, panels
 * are ranked with a real Match Score; otherwise they are shown as neutral
 * "destinations to explore" with no rank number or score (no fabrication).
 */
export function DashboardDestinations({ panels, ranked }: { panels: DestinationPanel[]; ranked: boolean }) {
  return (
    <section aria-labelledby="destinations-heading">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="destinations-heading" className="text-xs font-bold uppercase tracking-widest text-muted">
          {ranked ? 'Your top destinations' : 'Destinations to explore'}
        </h2>
        <Link href="/nexitnation" className="text-xs font-bold text-gold-deep hover:text-navy">
          View all
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {panels.map(({ country, match }, index) => (
          <Link
            key={country.slug}
            href={`/nextinations/${country.slug}`}
            className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] border border-line shadow-tile transition hover:border-gold hover:shadow-card"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(13,27,57,0) 30%, rgba(13,27,57,0.82) 100%), url(${destinationImage(country)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {ranked && (
              <span className="absolute left-3 top-3 rounded-pill bg-white/90 px-2.5 py-1 text-xs font-extrabold text-navy shadow-tile">
                #{index + 1}
              </span>
            )}
            <div className="relative p-4 text-white">
              <p className="text-lg font-bold leading-tight">{country.name}</p>
              <p className="text-xs text-white/80">{country.city} · {country.region}</p>
              <div className="mt-2 flex items-center gap-2">
                {match !== null ? (
                  <span className="rounded-pill bg-gold px-2.5 py-1 text-xs font-bold text-navy-deep">{match}% Match Score</span>
                ) : (
                  <span className="rounded-pill border border-white/40 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white">
                    {country.visaType} route
                  </span>
                )}
                <ArrowRight size={15} className="text-gold opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
