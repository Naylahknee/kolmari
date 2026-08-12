import Link from 'next/link'
import type { CountryDetail } from '@/lib/countries'
import { PATHWAYS } from '@/lib/pathways'
import { DashboardDestinationPanel } from '@/components/kolmari/dashboard/destination-panel'

export type DestinationRow = {
  country: CountryDetail
  match: number
  imageSrc: string | null
  focalPoint?: { x: number; y: number }
}

/**
 * Existing Dashboard Destinations parent panel.
 * This remains one Dashboard widget; the top matched countries are nested
 * visual cards inside it and Visa Options for the #1 match sit beneath the grid.
 */
export function DashboardDestinationsCard({ rows, profileComplete }: {
  rows: DestinationRow[]
  profileComplete: boolean
}) {
  const lead = rows[0]?.country ?? null
  const visaOptions = lead ? PATHWAYS.filter((pathway) => pathway.country === lead.name).slice(0, 3) : []

  return (
    <section
      id="dashboard-destinations"
      className="rounded-[var(--radius-card)] border border-line bg-white p-4 shadow-tile sm:p-5"
      aria-labelledby="destinations-heading"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="destinations-heading" className="text-[18px] font-bold text-navy">Destinations</h2>
        <Link href="/your-world" className="text-xs font-bold text-info hover:text-navy">Explore more</Link>
      </div>

      {rows.length > 0 ? (
        <>
          <div className="grid gap-[14px] [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
            {rows.map(({ country, match, imageSrc, focalPoint }, index) => (
              <DashboardDestinationPanel
                key={country.slug}
                rank={index + 1}
                data={{ country, match, imageSrc, focalPoint }}
              />
            ))}
          </div>

          {lead ? (
            <section className="mt-5 border-t border-line pt-4" aria-labelledby="dashboard-visa-options-heading">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 id="dashboard-visa-options-heading" className="text-[15px] font-bold text-navy">
                  Visa Options for {lead.name}
                </h3>
                <Link href="/pathways" className="text-xs font-bold text-info hover:text-navy">View all pathways</Link>
              </div>

              {visaOptions.length > 0 ? (
                <ul className="mt-3 divide-y divide-line rounded-[10px] border border-line bg-white">
                  {visaOptions.map((pathway) => (
                    <li key={pathway.id}>
                      <Link
                        href="/pathways"
                        className="block px-3 py-3 transition-colors duration-150 hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
                      >
                        <span className="block text-[12.5px] font-bold text-navy">{pathway.name}</span>
                        <span className="mt-0.5 block text-[10.5px] text-muted">{pathway.category}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 rounded-[10px] border border-dashed border-line-strong bg-canvas px-4 py-3 text-[12px] leading-5 text-muted">
                  No researched visa pathways are available for this country yet.
                </p>
              )}
            </section>
          ) : null}
        </>
      ) : (
        <div className="rounded-[14px] border border-dashed border-line-strong bg-canvas px-5 py-8 text-center">
          <p className="text-sm font-bold text-navy">{profileComplete ? 'No destination matches available' : 'Complete your Kolmari Profile to see your matches'}</p>
          <p className="mt-1 text-[12px] leading-5 text-muted">
            {profileComplete
              ? 'Kolmari does not have a valid ranked destination to show here yet.'
              : 'Your ranked country cards will appear here after your profile is complete.'}
          </p>
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
