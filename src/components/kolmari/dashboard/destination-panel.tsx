import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { CountryDetail } from '@/lib/countries'

export type DashboardDestinationPanelData = {
  country: CountryDetail
  match: number | null
  imageSrc: string | null
  routeLabel: string | null
  monthlyCost: string | null
}

/**
 * Nested matched-country card inside the Dashboard Destinations parent panel.
 *
 * Image authority:
 * - `imageSrc` must resolve a Dashboard-specific `dashboard_destination` asset.
 * - This component must NOT trigger or substitute the Country Page `hero` asset.
 * - Until the dedicated Dashboard generator is wired, a branded fallback is
 *   safer than silently using the wrong surface asset.
 */
export function DashboardDestinationPanel({ data, rank }: {
  data: DashboardDestinationPanelData
  rank: number
}) {
  const { country, match, imageSrc } = data

  return (
    <article className="group relative min-h-[190px] overflow-hidden rounded-[16px] border border-line bg-navy shadow-tile">
      {imageSrc ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          style={{ backgroundImage: `url(${JSON.stringify(imageSrc).slice(1, -1)})` }}
          aria-hidden="true"
        />
      ) : (
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(208,175,92,.28),transparent_34%),linear-gradient(135deg,#0d1b39,#17305b_62%,#102845)]"
          aria-hidden="true"
        />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,27,57,.20)_0%,rgba(13,27,57,.56)_58%,rgba(13,27,57,.90)_100%)]" aria-hidden="true" />

      <Link
        href={`/nextinations/${country.slug}/v2/overview`}
        className="relative z-10 flex min-h-[190px] flex-col justify-between p-4 text-white outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
        aria-label={`Open ${country.name} destination overview`}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="text-[15px] font-extrabold text-white drop-shadow-sm">#{rank}</span>
          {match !== null ? (
            <span className="rounded-full bg-white/92 px-2.5 py-1 text-[11.5px] font-extrabold text-navy shadow-sm">{match}%</span>
          ) : null}
        </div>

        <div className="flex items-end justify-between gap-3">
          <h3 className="min-w-0 truncate font-display text-[21px] font-bold leading-tight text-white">{country.name.toUpperCase()}</h3>
          <ArrowUpRight size={18} className="shrink-0 text-white/80 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
        </div>
      </Link>
    </article>
  )
}
