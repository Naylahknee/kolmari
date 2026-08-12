import Link from 'next/link'
import type { CountryDetail } from '@/lib/countries'

export type DashboardDestinationPanelData = {
  country: CountryDetail
  match: number
  imageSrc: string | null
  focalPoint?: { x: number; y: number }
}

/**
 * Nested matched-country card inside the existing Dashboard Destinations panel.
 * Visible content is intentionally limited to rank + country name. Match Score
 * stays available for accessibility but is not displayed in the card UI.
 */
export function DashboardDestinationPanel({ data, rank }: {
  data: DashboardDestinationPanelData
  rank: number
}) {
  const { country, match, imageSrc, focalPoint } = data
  const objectPosition = `${focalPoint?.x ?? 50}% ${focalPoint?.y ?? 50}%`

  return (
    <article className="group relative h-[160px] overflow-hidden rounded-[16px] border border-line bg-navy shadow-tile sm:h-[180px] lg:h-[190px]">
      {imageSrc ? (
        <div
          className="absolute inset-0 bg-cover transition-transform duration-200 group-hover:scale-[1.015] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          style={{ backgroundImage: `url(${JSON.stringify(imageSrc).slice(1, -1)})`, backgroundPosition: objectPosition }}
          aria-hidden="true"
        />
      ) : (
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(208,175,92,.24),transparent_34%),linear-gradient(135deg,#0d1b39,#17305b_62%,#102845)]"
          aria-hidden="true"
        />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(rgba(13,27,57,.55)_0%,rgba(13,27,57,.82)_100%)]" aria-hidden="true" />

      <Link
        href={`/nextinations/${country.slug}/v2/overview`}
        className="relative z-10 flex h-full flex-col justify-between p-4 text-white outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
        aria-label={`#${rank} ${country.name}, ${match}% match. Open ${country.name}.`}
      >
        <span className="text-[14px] font-extrabold text-white drop-shadow-sm">#{rank}</span>
        <h3 className="max-w-full font-display text-[21px] font-bold leading-tight text-white [overflow-wrap:anywhere]">
          {country.name.toUpperCase()}
        </h3>
      </Link>
    </article>
  )
}
