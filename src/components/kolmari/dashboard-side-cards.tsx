import Link from 'next/link'
import type { CountryDetail } from '@/lib/countries'
import { regionList } from '@/lib/destinations-data'

export type DestinationRow = { country: CountryDetail; match: number | null }

function monthlyCost(country: CountryDetail): string | null {
  for (const region of regionList) {
    const estimate = region.countries.find((item) => item.slug === country.slug)?.monthlyCost
    if (estimate !== undefined) return `$${estimate.toLocaleString()}/mo`
  }
  return null
}

/** Compact saved/recommended destination list. Match Score is shown only when one has been calculated. */
export function DashboardDestinationsCard({ rows, ranked }: { rows: DestinationRow[]; ranked: boolean }) {
  return (
    <section
      id="dashboard-destinations"
      className="rounded-[var(--radius-card)] border border-line bg-white px-[17px] pb-[17px] pt-[15px] shadow-tile"
      aria-labelledby="destinations-heading"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id="destinations-heading" className="text-[15px] font-bold text-navy">Destinations</h2>
        <Link href="/your-world" className="text-xs font-bold text-info hover:text-navy">Explore more</Link>
      </div>

      {rows.length ? (
        <div className="flex flex-col gap-2">
          {rows.map(({ country, match }) => {
            const cost = monthlyCost(country)
            return (
              <Link
                key={country.slug}
                href={`/nextinations/${country.slug}`}
                className="flex w-full items-center gap-[11px] rounded-[10px] border border-line p-[10px_11px] transition-[background-color,border-color] duration-150 hover:border-gold hover:bg-[#fdfbf3]"
              >
                <span
                  className="grid h-6 w-[34px] flex-none place-items-center rounded-[4px] bg-navy text-[10.5px] font-bold text-gold"
                  aria-hidden="true"
                >
                  {country.code}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold text-navy">{country.name}</span>
                  <span className="block truncate text-[10.5px] text-muted-soft">
                    {country.visaType}{cost ? ` · ${cost}` : ''}
                  </span>
                </span>
                {match !== null ? (
                  <span className="flex-none text-[13px] font-bold text-ok">{match}%</span>
                ) : (
                  <span className="flex-none text-[10.5px] font-semibold text-muted-soft">No score yet</span>
                )}
              </Link>
            )
          })}
        </div>
      ) : (
        <p className="text-[12.5px] leading-6 text-muted">
          No destinations saved yet. Explore the map to add one.
        </p>
      )}

      {!ranked && rows.length > 0 && (
        <p className="mt-3 text-[10.5px] text-muted-soft">
          Complete your Kolmari Profile to see a Match Score for these.
        </p>
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
            href={`/nextinations/${countrySlug}`}
            className="flex-1 rounded-[var(--radius-btn)] border border-line px-3 py-[9px] text-center text-[12.5px] font-semibold text-navy transition-[background-color,border-color] duration-150 hover:border-line-strong hover:bg-[#fbfcfe]"
          >
            {countryName}
          </Link>
        )}
      </div>
    </section>
  )
}
