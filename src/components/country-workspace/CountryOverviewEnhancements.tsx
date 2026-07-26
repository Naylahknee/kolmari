import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import type { RelocationProfile } from '@/lib/profile'
import { calculateNexitReadiness } from '@/lib/readiness'
import { getCountryCityOverviews } from '@/lib/country-workspace/country-cities'
import { getCountryTourismMedia } from '@/lib/country-workspace/country-tourism-media'
import { CityMapImage } from './CityMapImage'

export function CountryOverviewEnhancements({
  countrySlug,
  countryName,
  profile,
}: {
  countrySlug: string
  countryName: string
  profile: RelocationProfile
}) {
  const cities = getCountryCityOverviews(countrySlug)
  const tourismMedia = getCountryTourismMedia(countrySlug)
  const readiness = calculateNexitReadiness(profile)

  return (
    <div className="mt-5 space-y-5">
      {cities.length > 0 && (
        <section className="card-surface p-6" aria-labelledby="top-cities-heading">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">City research</p>
            <h2 id="top-cities-heading" className="mt-1 text-xl font-bold text-navy">Top Cities in {countryName}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Start with a concise set of cities already represented in Nexit&apos;s relocation-place dataset.
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cities.map((city) => (
              <article key={city.id} className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-tile">
                <div className="relative">
                  <CityMapImage
                    cityName={city.cityName}
                    countryName={countryName}
                    lat={city.lat}
                    lng={city.lng}
                    alt={city.imageAlt}
                  />
                  {tourismMedia && (
                    <div className="absolute left-3 top-3 rounded-md border border-white/70 bg-white/92 p-1.5 shadow-md" title={tourismMedia.flagAlt}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tourismMedia.flagSrc}
                        alt={tourismMedia.flagAlt}
                        className="h-5 w-auto rounded-[2px]"
                      />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-navy">{city.cityName}</h3>
                      {city.region && <p className="mt-0.5 text-xs text-muted">{city.region}</p>}
                    </div>
                    <span className="rounded-[var(--radius-pill)] bg-info-soft px-2.5 py-1 text-[10px] font-bold text-info">
                      {city.researchStatus}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">{city.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="card-surface p-6" aria-labelledby="readiness-heading">
        <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Planning status</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
          <h2 id="readiness-heading" className="text-xl font-bold text-navy">Nexit Readiness</h2>
          {readiness.overall !== null && (
            <p className="text-3xl font-extrabold leading-none text-navy">{readiness.overall}% complete</p>
          )}
        </div>

        {readiness.overall === null ? (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Complete your profile and begin your research to calculate Nexit Readiness. Documents and meaningful research activity are not yet assessed, so Nexit will not manufacture an overall percentage.
          </p>
        ) : (
          <div
            className="mt-5 h-4 overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-label="Overall Nexit Readiness"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={readiness.overall}
          >
            <div className="h-full rounded-full bg-gold" style={{ width: `${readiness.overall}%` }} />
          </div>
        )}

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[readiness.profile, readiness.documents, readiness.research].map((category) => (
            <div key={category.label} className="rounded-[var(--radius-field)] border border-line bg-canvas p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-navy">{category.label}</p>
                <p className="text-sm font-extrabold text-navy">
                  {category.score === null ? 'Not yet assessed' : `${category.score}%`}
                </p>
              </div>
              {category.score !== null && (
                <div
                  className="mt-3 h-2.5 overflow-hidden rounded-full bg-line"
                  role="progressbar"
                  aria-label={`${category.label} completion`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={category.score}
                >
                  <div className="h-full rounded-full bg-gold" style={{ width: `${category.score}%` }} />
                </div>
              )}
              <p className="mt-3 text-xs leading-5 text-muted">{category.detail}</p>
            </div>
          ))}
        </div>

        <Link href="/nexit-plan" className="gold-button mt-5">
          Continue building your Nexit Plan <ArrowRight size={16} />
        </Link>
      </section>

      {tourismMedia && (
        <section className="card-surface p-6" aria-labelledby="tourism-resource-heading">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Travel and tourism</p>
          <h2 id="tourism-resource-heading" className="mt-1 text-xl font-bold text-navy">Official {countryName} visitor information</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Use the official tourism authority for destination context, regional highlights, transportation information, and trip-planning resources. Tourism guidance is separate from immigration and residency requirements.
          </p>
          <a
            href={tourismMedia.tourismUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-gold-deep hover:text-navy"
          >
            Visit {tourismMedia.tourismLabel} <ExternalLink size={15} aria-hidden="true" />
          </a>
          <p className="mt-3 text-xs text-muted">{tourismMedia.attribution}</p>
        </section>
      )}
    </div>
  )
}
