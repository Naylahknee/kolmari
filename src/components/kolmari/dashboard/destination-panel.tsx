import Link from 'next/link'
import { ArrowUpRight, BadgeCheck, MapPin } from 'lucide-react'
import { HeroAutoGenerate } from '@/components/country-template/HeroAutoGenerate'
import type { CountryDetail } from '@/lib/countries'

export type DashboardDestinationPanelData = {
  country: CountryDetail
  match: number | null
  imageSrc: string | null
  routeLabel: string | null
  monthlyCost: string | null
}

/**
 * Canonical image-backed destination card for the Dashboard.
 *
 * Important behavior rules:
 * - The Dashboard never creates a unique AI image for a user.
 * - A country hero is generated once, stored once, and reused everywhere.
 * - When no stored/approved hero exists, HeroAutoGenerate asks the existing
 *   deduped country-hero pipeline to create one in the background while this
 *   card renders a branded fallback.
 * - The card is navigation only. It does not create another Saved/Shortlist/
 *   Primary-destination state system.
 */
export function DashboardDestinationPanel({ data, rank }: {
  data: DashboardDestinationPanelData
  rank: number
}) {
  const { country, match, imageSrc, routeLabel, monthlyCost } = data

  return (
    <article className="group relative min-h-[190px] overflow-hidden rounded-[16px] border border-line bg-navy shadow-tile">
      {!imageSrc ? <HeroAutoGenerate slug={country.slug} /> : null}

      {imageSrc ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.025]"
          style={{ backgroundImage: `url(${JSON.stringify(imageSrc).slice(1, -1)})` }}
          aria-hidden="true"
        />
      ) : (
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(208,175,92,.28),transparent_34%),linear-gradient(135deg,#0d1b39,#17305b_62%,#102845)]"
          aria-hidden="true"
        />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,27,57,.24)_0%,rgba(13,27,57,.82)_78%,rgba(13,27,57,.94)_100%)]" aria-hidden="true" />

      <Link
        href={`/nextinations/${country.slug}/v2/overview`}
        className="relative z-10 flex min-h-[190px] flex-col justify-between p-4 text-white outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
        aria-label={`Open ${country.name} destination overview`}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-navy-deep/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.09em] text-white backdrop-blur">
            <BadgeCheck size={12} className="text-gold" aria-hidden="true" />
            Match #{rank}
          </span>
          {match !== null ? (
            <span className="rounded-full bg-white px-2.5 py-1 text-[12px] font-extrabold text-navy shadow-sm">{match}%</span>
          ) : (
            <span className="rounded-full border border-white/20 bg-navy-deep/70 px-2.5 py-1 text-[10.5px] font-semibold text-white/85 backdrop-blur">Unscored</span>
          )}
        </div>

        <div>
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-white/72">
                <MapPin size={12} aria-hidden="true" /> {country.city}
              </p>
              <h3 className="mt-1 truncate font-display text-[21px] font-bold leading-tight text-white">{country.name}</h3>
            </div>
            <ArrowUpRight size={18} className="shrink-0 text-white/80 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </div>
          {(routeLabel || monthlyCost) ? (
            <p className="mt-2 truncate text-[11.5px] font-medium text-white/75">
              {[routeLabel, monthlyCost].filter(Boolean).join(' · ')}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  )
}
