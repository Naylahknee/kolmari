import type { CountryDetail } from '@/lib/countries'

export type DashboardDestinationPanelData = {
  country: CountryDetail
  match: number
  imageSrc: string | null
  focalPoint?: { x: number; y: number }
}

/**
 * Nested match card. Selecting it changes the visa-pathway preview inside the
 * existing Destinations parent panel; it never navigates away from Dashboard.
 */
export function DashboardDestinationPanel({
  data,
  rank,
  selected,
  onSelect,
}: {
  data: DashboardDestinationPanelData
  rank: number
  selected: boolean
  onSelect: () => void
}) {
  const { country, match, imageSrc, focalPoint } = data
  const objectPosition = `${focalPoint?.x ?? 50}% ${focalPoint?.y ?? 50}%`

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-controls="dashboard-visa-options"
      aria-label={`#${rank} ${country.name}, ${match}% match. Show visa options for ${country.name}.`}
      className={[
        'relative h-[160px] w-full overflow-hidden rounded-[16px] border bg-navy text-left shadow-tile transition-[border-color,box-shadow,transform] duration-150 sm:h-[180px] lg:h-[190px]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
        selected
          ? 'border-gold ring-2 ring-gold/25'
          : 'border-line hover:-translate-y-0.5 hover:border-gold/70 hover:shadow-card',
      ].join(' ')}
    >
      {imageSrc ? (
        <div
          className="absolute inset-0 bg-cover"
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
      <div className="relative z-10 flex h-full flex-col justify-between p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <span className="text-[14px] font-extrabold text-white drop-shadow-sm">#{rank}</span>
          {selected && (
            <span className="rounded-full bg-gold px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-navy-deep">
              Viewing
            </span>
          )}
        </div>
        <h3 className="max-w-full font-display text-[21px] font-bold leading-tight text-white [overflow-wrap:anywhere]">
          {country.name.toUpperCase()}
        </h3>
      </div>
    </button>
  )
}
