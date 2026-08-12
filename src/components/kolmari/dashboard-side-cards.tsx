import Link from 'next/link'
import type { CountryDetail } from '@/lib/countries'
import { regionList } from '@/lib/destinations-data'
import { DashboardDestinationPanel } from '@/components/kolmari/dashboard/destination-panel'

export type DestinationRow = {
  country: CountryDetail
  match: number | null
  imageSrc: string | null
}

function monthlyCost(country: CountryDetail): string | null {
  for (const region of regionList) {
    const estimate = region.countries.find((item) => item.slug === country.slug)?.monthlyCost
    if (estimate !== undefined) return `$${estimate.toLocaleString()}/mo`
  }
  return null
}

/**
 * Canonical Dashboard destination-match surface.
 *
 * It is intentionally presentation + navigation only. Saving, shortlisting, and
 * selecting a primary destination must use the canonical destination state model
 * rather than introducing card-local state.
 */
export function DashboardDestinationsCard({ rows, ranked }: { rows: DestinationRow[]; ranked: boolean }) {
  return (
    <section
      id="dashboard-destinations"
      className="rounded-[var(--radius-card)] border border-line bg-white p-4 shadow-tile sm:p-5"
      aria-labelledby="destinations-heading"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-gold-deep">Your matches</p>
          <h2 id="destinations-heading" className="mt-1 text-[18px] font-bold text-navy">Destinations</h2>
          <p className="mt-1 text-[12px] leading-5 text-muted">
            {ranked ? 'Your strongest current country matches, ranked from your Kolmari Profile.' : 'Explore destinations now; complete your Kolmari Profile to unlock ranked Match Scores.'}
          </p>
        </div>
        <Link href="/your-world" className="text-xs font-bold text-info hover:text-navy">Explore Your World</Link>
      </div>

      {rows.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {rows.map(({ country, match, imageSrc }, index) => (
            <DashboardDestinationPanel
              key={country.slug}
              rank={index + 1}
              data={{
                country,
                match,
                imageSrc,
                routeLabel: country.visaType || null,
                monthlyCost: monthlyCost(country),
              }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[14px] border border-dashed border-line-strong bg-canvas px-5 py-8 text-center">
          <p className="text-sm font-bold text-navy">No destination matches yet</p>
          <p className="mt-1 text-[12px] leading-5 text-muted">Complete your Kolmari Profile or explore Your World to begin.</p>
        </div>
      )}
    </section>
  )
}

/** The pathway saved on the plan. Shows an empty state rather than assuming a route. */
export function DashboardActivePathwayCard({ pathway, detail, countryName, countrySlug }: {
  pathway: string | null
  detail: string
  countryName: string | null
  countrySlug: string | null
}) {
  return (
    <section
      className="rounded-[var(--radius-card)] border border-line bg-white px-[17px] pb-[17px] pt-[15px] shadow-tile"
      aria-labelledby="active-pathway-heading"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gold-deep">Active pathway</p>
      <h2 id="active-pathway-heading" className="mt-1.5 text-[16px] font-bold text-navy">
        {pathway ?? 'No pathway selected'}
      </h2>
      <p className="mt-1.5 text-[12.5px] leading-[1.6] text-muted">{detail}</p>
      <div className="mt-3 flex gap-2">
        <Link
          href="/pathways"
          className="flex-1 rounded-[var(--radius-btn)] border border-line px-3 py-[9px] text-center text-[12.5px] font-semibold text-navy transition-[background-color,border-color] duration-150 hover:border-line-strong hover:bg-[#fbfcfe]"
        >
          {pathway ? 'View pathway' : 'Find a pathway'}
        </Link>
        {countryName && countrySlug && (
          <Link
            href={`/nextinations/${countrySlug}/v2/overview`}
            className="flex-1 rounded-[var(--radius-btn)] border border-line px-3 py-[9px] text-center text-[12.5px] font-semibold text-navy transition-[background-color,border-color] duration-150 hover:border-line-strong hover:bg-[#fbfcfe]"
          >
            {countryName}
          </Link>
        )}
      </div>
    </section>
  )
}
