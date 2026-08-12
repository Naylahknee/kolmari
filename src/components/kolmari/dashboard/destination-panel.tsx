import type { CountryDetail } from '@/lib/countries'

export type DashboardDestinationPanelData = {
  country: CountryDetail
  match: number
  imageSrc: string | null
  focalPoint?: { x: number; y: number }
}

/** Nested match card. This is an information surface, not navigation. */
export function DashboardDestinationPanel({ data, rank }: { data: DashboardDestinationPanelData; rank: number }) {
  const { country, match, imageSrc, focalPoint } = data
  const objectPosition = `${focalPoint?.x ?? 50}% ${focalPoint?.y ?? 50}%`
  return (
    <article
      className="relative h-[160px] overflow-hidden rounded-[16px] border border-line bg-navy shadow-tile sm:h-[180px] lg:h-[190px]"
      aria-label={`#${rank} ${country.name}, ${match}% match`}
    >
      {imageSrc ? (
        <div className="absolute inset-0 bg-cover" style={{ backgroundImage: `url(${JSON.stringify(imageSrc).slice(1, -1)})`, backgroundPosition: objectPosition }} aria-hidden="true" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(208,175,92,.24),transparent_34%),linear-gradient(135deg,#0d1b39,#17305b_62%,#102845)]" aria-hidden="true" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(13,27,57,.55)_0%,rgba(13,27,57,.82)_100%)]" aria-hidden="true" />
      <div className="relative z-10 flex h-full flex-col justify-between p-4 text-white">
        <span className="text-[14px] font-extrabold text-white drop-shadow-sm">#{rank}</span>
        <h3 className="max-w-full font-display text-[21px] font-bold leading-tight text-white [overflow-wrap:anywhere]">{country.name.toUpperCase()}</h3>
      </div>
    </article>
  )
}
