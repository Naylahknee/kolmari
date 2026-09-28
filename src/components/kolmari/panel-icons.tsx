/**
 * File-based Kolmari panel icons.
 *
 * Source: public/icons/ — the Kolmari icon set added September 2026.
 * These are the official attribute icons for country panels (climate,
 * landscape, cost, safety, internet). Rendered as plain <img> tags so the
 * original artwork files stay untouched.
 *
 * Usage: <PanelIcon name="sunny" label="Sunny climate" className="size-6" />
 */

export type PanelIconName =
  | 'beach'
  | 'big-city'
  | 'budget-friendly'
  | 'capital'
  | 'climate'
  | 'cold'
  | 'cost-budget'
  | 'cost-moderate'
  | 'cost-premium'
  | 'desert'
  | 'driving'
  | 'fast-internet-tag'
  | 'forest'
  | 'generally-safe'
  | 'government'
  | 'hot'
  | 'internet-average'
  | 'internet-basic'
  | 'internet-fast'
  | 'island'
  | 'mountains'
  | 'overcast'
  | 'partly-cloudy'
  | 'passport'
  | 'population'
  | 'rainy'
  | 'snowy'
  | 'spoken-language'
  | 'stormy'
  | 'sunny'
  | 'time-zone'
  | 'use-caution'
  | 'very-safe'
  | 'winter'

export function PanelIcon({
  name,
  label,
  className = 'size-6',
}: {
  name: PanelIconName
  label?: string
  className?: string
}) {
  return (
    <img
      src={`/icons/filled/${name}.svg`}
      alt={label ?? ''}
      aria-hidden={label ? undefined : true}
      title={label}
      loading="lazy"
      className={className}
    />
  )
}

/** Safety score color, mirroring the panel design thresholds. */
export function safetyScoreColor(score: number): string {
  if (score >= 80) return '#147a74'
  if (score >= 60) return '#b8890a'
  return '#b0433a'
}

/** Safety shield icon for a State Department advisory level (1-4). */
export function safetyIconForLevel(level: number): PanelIconName {
  if (level <= 1) return 'very-safe'
  if (level === 2) return 'generally-safe'
  return 'use-caution'
}

/** Safety label for a State Department advisory level. */
export function safetyLabelForLevel(level: number): string {
  if (level <= 1) return 'Very safe'
  if (level === 2) return 'Safe'
  return 'Use caution'
}

/** Internet tier icon from fixed-broadband median Mbps (Speedtest Global Index). */
export function internetIconForMbps(mbps: number | null): PanelIconName {
  if (mbps === null) return 'internet-average'
  if (mbps >= 100) return 'internet-fast'
  if (mbps >= 30) return 'internet-average'
  return 'internet-basic'
}

/** Cost-tier icon from a $ / $$ / $$$ / $$$$ band. */
export function costIconForBand(band: string | null): PanelIconName {
  if (band === '$') return 'cost-budget'
  if (band === '$$$' || band === '$$$$') return 'cost-premium'
  return 'cost-moderate'
}
