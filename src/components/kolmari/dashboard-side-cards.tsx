import Link from 'next/link'
import type { CountryDetail } from '@/lib/countries'

export type DestinationRow = {
  country: CountryDetail
  match: number
  imageSrc: string | null
  focalPoint?: { x: number; y: number }
  /** Personalized one-line hook (top match reason), falling back to the country summary. */
  hook: string
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
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Link
          href="/pathways"
          className="flex-1 rounded-[var(--radius-btn)] border border-line px-3 py-[9px] text-center text-[12.5px] font-semibold text-navy transition-[background-color,border-color] duration-150 hover:border-line-strong hover:bg-[#fbfcfe]"
        >
          {pathway ? 'Review active pathway' : 'Find a pathway'}
        </Link>
        {countryName && countrySlug && (
          <Link
            href={`/nextinations/${countrySlug}/v2/overview`}
            className="flex-1 rounded-[var(--radius-btn)] border border-line px-3 py-[9px] text-center text-[12.5px] font-semibold text-navy transition-[background-color,border-color] duration-150 hover:border-line-strong hover:bg-[#fbfcfe]"
          >
            Open {countryName} guide
          </Link>
        )}
      </div>
    </section>
  )
}
