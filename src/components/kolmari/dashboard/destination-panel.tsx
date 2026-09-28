import type { CountryDetail } from '@/lib/countries'

export type DashboardDestinationPanelData = {
  country: CountryDetail
  match: number
  imageSrc: string | null
  focalPoint?: { x: number; y: number }
  /** Personalized one-line hook (top match reason), falling back to the country summary. */
  hook: string
}

function safetyLabel(safety: CountryDetail['safety']): string {
  return safety === 'High' ? 'Very safe' : 'Safe'
}

/**
 * Nested match card. Selecting it changes the visa-pathway preview inside the
 * existing Your Matches section; it never navigates away from Dashboard.
 *
 * Card design follows the approved match-card reference: destination imagery
 * under a navy gradient, name + region, fit badge, one-line hook, and a
 * three-stat row built only from researched country fields.
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
  const { country, match, imageSrc, focalPoint, hook } = data
  const objectPosition = `${focalPoint?.x ?? 50}% ${focalPoint?.y ?? 50}%`
  const fitLabel = match >= 80 ? 'Strong Fit' : 'Worth Exploring'
  const stats = [
    { label: 'Income guide', value: `$${country.incomeRequired.toLocaleString()}/mo` },
    { label: 'Route', value: country.visaType },
    { label: 'Safety', value: safetyLabel(country.safety) },
  ]

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-controls="dashboard-visa-options"
      aria-label={`#${rank} ${country.name}, ${match}% match, ${fitLabel}. Show visa options for ${country.name}.`}
      className={[
        'relative block min-h-[230px] w-full overflow-hidden rounded-[16px] border bg-navy p-5 text-left text-white shadow-tile transition-[border-color,box-shadow,transform] duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
        selected
          ? 'border-gold ring-2 ring-gold/30'
          : 'border-line hover:-translate-y-0.5 hover:border-gold/70 hover:shadow-card',
      ].join(' ')}
    >
      {imageSrc ? (
        <span
          className="absolute inset-0 bg-cover"
          style={{ backgroundImage: `url(${JSON.stringify(imageSrc).slice(1, -1)})`, backgroundPosition: objectPosition }}
          aria-hidden="true"
        />
      ) : (
        <span
          className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(208,175,92,.24),transparent_34%),linear-gradient(135deg,#0d1b39,#17305b_62%,#102845)]"
          aria-hidden="true"
        />
      )}
      <span className="absolute inset-0 bg-[linear-gradient(rgba(13,27,57,.55)_0%,rgba(13,27,57,.82)_100%)]" aria-hidden="true" />

      <span className="relative z-10 flex min-h-[190px] flex-col">
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="block font-display text-[21px] font-bold leading-tight [overflow-wrap:anywhere]">
              {country.name}
            </span>
            <span className="mt-0.5 block text-[12px] font-medium text-white/75">{country.region}</span>
          </span>
          <span className="flex flex-none flex-col items-end gap-1.5">
            <span className="whitespace-nowrap rounded-full bg-white/16 px-2.5 py-1 text-[10.5px] font-bold">
              {fitLabel}
            </span>
            {selected && (
              <span className="whitespace-nowrap rounded-full bg-gold px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-navy-deep">
                Viewing
              </span>
            )}
          </span>
        </span>

        <span className="mb-4 mt-3 block text-[12.5px] leading-[1.55] text-white/92">{hook}</span>

        <span className="mt-auto grid grid-cols-3 gap-3 border-t border-white/20 pt-3">
          {stats.map((stat) => (
            <span key={stat.label} className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-white/60">
                {stat.label}
              </span>
              <span className="mt-0.5 block truncate text-[13px] font-bold text-white" title={stat.value}>
                {stat.value}
              </span>
            </span>
          ))}
        </span>
      </span>
    </button>
  )
}
