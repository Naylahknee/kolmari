import { COUNTRY_SHAPES } from '@/lib/country-shapes'

/* Bounding-box centre of a shape path, used to sit the capital pin on the
   country. Paths only use absolute M/L/Z commands, so every number is one
   coordinate of an x,y pair. */
function shapeCenter(d: string) {
  const nums = d.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? []
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = nums[i], y = nums[i + 1]
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  if (!Number.isFinite(minX)) return { cx: 120, cy: 60 }
  return { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 }
}

/* Country card artwork that mirrors the Portugal Nextination hero: a warm
   navy-to-earth wash, a faint diamond-grid brand pattern, a low-opacity white
   country silhouette, and a gold butterfly location pin marking the featured
   city. The sub-label shows the country (not "capital"), because the featured
   city is not always the national capital. */
export function CountryShapePanel({ code, country, city }: { code: string; country: string; city: string }) {
  const shape = COUNTRY_SHAPES[code]
  const { cx, cy } = shape ? shapeCenter(shape) : { cx: 120, cy: 60 }

  // Keep the pin and its label inside the frame.
  const pinX = Math.min(Math.max(cx, 34), 176)
  const pinY = Math.min(Math.max(cy, 40), 96)
  const anchorEnd = pinX > 150
  const labelX = anchorEnd ? pinX - 15 : pinX + 15

  const uid = code.toLowerCase()

  return (
    <div className="relative h-40 overflow-hidden bg-navy-deep">
      <svg viewBox="0 0 240 120" className="h-full w-full" role="img" aria-label={`${country} — ${city}`}>
        <defs>
          <linearGradient id={`sp-wash-${uid}`} x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0%" stopColor="#122a52" />
            <stop offset="45%" stopColor="#1b3f68" />
            <stop offset="100%" stopColor="#7d4636" />
          </linearGradient>
          <radialGradient id={`sp-gold-${uid}`} cx="76%" cy="8%" r="62%">
            <stop offset="0%" stopColor="#f0c86a" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#f0c86a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`sp-scrim-${uid}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#0d1b39" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#0d1b39" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#0d1b39" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id={`sp-pin-${uid}`}>
            <stop offset="0%" stopColor="#f3c516" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#f3c516" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#f3c516" stopOpacity="0" />
          </radialGradient>
          <pattern id={`sp-grid-${uid}`} width="15" height="15" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="0.6">
              <path d="M7.5 1 L14 7.5 L7.5 14 L1 7.5 Z" />
              <circle cx="7.5" cy="7.5" r="2.4" />
            </g>
          </pattern>
        </defs>

        <rect width="240" height="120" fill={`url(#sp-wash-${uid})`} />
        <rect width="240" height="120" fill={`url(#sp-gold-${uid})`} />
        <rect width="240" height="120" fill={`url(#sp-grid-${uid})`} />
        <rect width="240" height="120" fill={`url(#sp-scrim-${uid})`} />

        {shape && <path d={shape} fill="#ffffff" fillOpacity="0.09" />}

        {/* Capital-style location pin: gold glow, navy teardrop with gold edge,
            and the gold butterfly mark. */}
        <g transform={`translate(${pinX} ${pinY}) scale(0.5)`}>
          <circle cx="0" cy="-22" r="40" fill={`url(#sp-pin-${uid})`} />
          <ellipse cx="0" cy="2" rx="9" ry="2.6" fill="#000000" opacity="0.28" />
          <path d="M0 0 L-13.13 -18.86 A16 16 0 1 1 13.13 -18.86 Z" fill="#0d1b39" stroke="#f3c516" strokeWidth="2.4" strokeLinejoin="round" />
          <image href="/brand/favicon-48.png" x="-11.5" y="-39.5" width="23" height="23" preserveAspectRatio="xMidYMid meet" />
        </g>

        <text x={labelX} y={pinY - 4} textAnchor={anchorEnd ? 'end' : 'start'} fill="#f3c516" fillOpacity="0.9" fontSize="12" fontWeight="700" fontFamily="Geist, system-ui, sans-serif">{city}</text>
        <text x={labelX} y={pinY + 8} textAnchor={anchorEnd ? 'end' : 'start'} fill="#ffffff" fillOpacity="0.5" fontSize="8" letterSpacing="1.2" fontFamily="Geist, system-ui, sans-serif">{country.toUpperCase()}</text>
      </svg>
    </div>
  )
}
