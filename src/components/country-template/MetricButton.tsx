/**
 * MetricButton — the one hero metric panel.
 *
 * Every country hero panel renders through this component so the markup and the
 * `.metrics .metric` styling that targets it stay bundled together. Nothing else
 * should hand-write a `.metric` panel: if the structure changes it changes here,
 * once, and every Destination picks it up identically.
 *
 * Two states, one shape:
 *  - a verified figure renders a clickable <button> with the arrow affordance;
 *  - an unverified figure renders a non-interactive <div> reading "Being
 *    verified", because Kolmari never shows a number it cannot source.
 * Both carry the same classes, so both resolve to the same typography.
 */

/** The arrow affordance every clickable hero metric panel carries. */
const MetricArrow = (
  <svg className="m-go" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export type MetricButtonProps = {
  /** Uppercase panel label, e.g. "Cost vs your budget". */
  label: string
  /** Small line-art icon shown beside the label. */
  icon: React.ReactNode
  /** The large figure. Null renders the honest "being verified" state. */
  value: React.ReactNode | null
  /** Small trailing unit beside the figure, e.g. "/ mo", "years". */
  unit?: React.ReactNode
  /** Supporting note beneath the figure — source, caveat or comparison. */
  note?: React.ReactNode
  /** Opens the tab that explains this figure. */
  onOpen?: () => void
  /** Accessible name for the panel, describing where it leads. */
  openLabel?: string
}

export function MetricButton({ label, icon, value, unit, note, onOpen, openLabel }: MetricButtonProps) {
  if (value == null) {
    return (
      <div className="metric" aria-disabled="true">
        <span className="m-l">{icon} {label}</span>
        <span className="m-v m-v-pending">Being verified</span>
        <span className="m-n">Pending an official source</span>
      </div>
    )
  }
  return (
    <button className="metric" onClick={onOpen} aria-label={openLabel ?? label}>
      {MetricArrow}
      <span className="m-l">{icon} {label}</span>
      <span className="m-v">{value}{unit ? <> <small>{unit}</small></> : null}</span>
      {note ? <span className="m-n">{note}</span> : null}
    </button>
  )
}
