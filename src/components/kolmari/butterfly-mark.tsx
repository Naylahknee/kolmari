/* The Kolmari butterfly mark as an inline SVG so it can toggle between an
 * outline (relocation plan < 75% complete) and a filled silhouette (>= 75%),
 * always in the brand gold. Inline fill/stroke so the sidebar `.ic` class
 * (fill:none / stroke:currentColor) can't override it. */
export function ButterflyMark({ filled = false, className, gold = 'var(--gold, #f3c516)' }: {
  filled?: boolean
  className?: string
  gold?: string
}) {
  const wingFill = filled ? gold : 'none'
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      {/* Wings — outline or filled */}
      <g style={{ fill: wingFill, stroke: gold, strokeWidth: 2.2, strokeLinejoin: 'round' }}>
        {/* upper-left wing */}
        <path d="M22.4 20C18.5 12.5 10.5 8.5 6.4 11c-3.4 2.1-3.1 8 .2 12.2 3.2 4.1 10.6 5.6 16 1.9z" />
        {/* upper-right wing */}
        <path d="M25.6 20C29.5 12.5 37.5 8.5 41.6 11c3.4 2.1 3.1 8-.2 12.2-3.2 4.1-10.6 5.6-16 1.9z" />
        {/* lower-left wing */}
        <path d="M22.6 25.5C18 24 9.5 25.8 6.9 30.4c-2.3 4.1 1 8.6 5.7 9 5.1.4 10.8-3.8 12.4-9.6z" />
        {/* lower-right wing */}
        <path d="M25.4 25.5C30 24 38.5 25.8 41.1 30.4c2.3 4.1-1 8.6-5.7 9-5.1.4-10.8-3.8-12.4-9.6z" />
      </g>
      {/* Body — always filled */}
      <path d="M24 17.4c-1.1 0-2 .9-2 2v13.2c0 1.1.9 2 2 2s2-.9 2-2V19.4c0-1.1-.9-2-2-2z" style={{ fill: gold }} />
      {/* Antennae — always stroked, with round tips */}
      <g style={{ fill: 'none', stroke: gold, strokeWidth: 1.8, strokeLinecap: 'round' }}>
        <path d="M24 18c-1.2-3-3.4-5-6.2-6" />
        <path d="M24 18c1.2-3 3.4-5 6.2-6" />
      </g>
      <circle cx="17.4" cy="11.6" r="1.7" style={{ fill: gold }} />
      <circle cx="30.6" cy="11.6" r="1.7" style={{ fill: gold }} />
    </svg>
  )
}
