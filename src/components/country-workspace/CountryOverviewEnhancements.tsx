import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { RelocationProfile } from '@/lib/profile'
import { calculateNexitReadiness } from '@/lib/readiness'

export function CountryOverviewEnhancements({
  profile,
}: {
  countrySlug: string
  countryName: string
  profile: RelocationProfile
}) {
  const readiness = calculateNexitReadiness(profile)

  return (
    <div className="mt-5">
      <section className="card-surface p-6" aria-labelledby="readiness-heading">
        <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Planning status</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
          <h2 id="readiness-heading" className="text-xl font-bold text-navy">Kolmari Readiness</h2>
          {readiness.overall !== null && (
            <p className="text-3xl font-extrabold leading-none text-navy">{readiness.overall}% complete</p>
          )}
        </div>

        {readiness.overall === null ? (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Complete your profile and begin your research to calculate Kolmari Readiness. Documents and meaningful research activity are not yet assessed, so Kolmari will not manufacture an overall percentage.
          </p>
        ) : (
          <div
            className="mt-5 h-4 overflow-hidden rounded-full bg-line"
            role="progressbar"
            aria-label="Overall Kolmari Readiness"
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
          Continue building your Move Plan <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  )
}
