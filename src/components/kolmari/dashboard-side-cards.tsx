import Link from 'next/link'
import type { CountryDetail } from '@/lib/countries'
import { regionList } from '@/lib/destinations-data'
import { PATHWAYS } from '@/lib/pathways'
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
 * The existing white Dashboard Destinations card is the parent panel.
 * Matched country cards are nested inside it; the visa-options preview belongs
 * below the nested grid in the same parent panel.
 */
export function DashboardDestinationsCard({ rows, ranked }: { rows: DestinationRow[]; ranked: boolean }) {
  const lead = rows[0]?.country ?? null
  const visaOptions = lead ? PATHWAYS.filter((pathway) => pathway.country === lead.name) : []

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

      {rows.length ? (
        <>
          <div className="grid gap-[14px] [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
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

          {lead ? (
            <div className="mt-5 border-t border-line pt-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gold-deep">Pathways</p>
                  <h3 className="mt-1 text-[15px] font-bold text-navy">Visa Options for {lead.name}</h3>
                </div>
                <Link href="/pathways" className="text-xs font-bold text-info hover:text-navy">View all pathways</Link>
              </div>

              {visaOptions.length ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {visaOptions.slice(0, 4).map((pathway) => (
                    <Link
                      key={pathway.id}
                      href="/pathways"
                      className="rounded-[10px] border border-line bg-canvas px-3 py-3 transition-[background-color,border-color] duration-150 hover:border-gold hover:bg-gold-soft/20"
                    >
                      <p className="text-[12.5px] font-bold text-navy">{pathway.name}</p>
                      <p className="mt-1 text-[10.5px] leading-4 text-muted">{pathway.category}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-3 rounded-[10px] border border-dashed border-line-strong bg-canvas px-4 py-3 text-[12px] leading-5 text-muted">
                  Visa options for {lead.name} are still being verified.
                </p>
              )}
            </div>
          ) : null}

          {!ranked ? (
            <p className="mt-3 text-[10.5px] text-muted-soft">Complete your Kolmari Profile to see ranked Match Scores.</p>
          ) : null}
        </>
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
