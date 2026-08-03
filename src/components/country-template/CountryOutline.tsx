import { COUNTRY_SHAPES } from '@/lib/country-shapes'

// Renders a country's outline (from COUNTRY_SHAPES, which stores paths in a
// shared world coordinate space) as a self-contained, centered SVG by computing
// the path's bounding box for the viewBox. Returns null when no shape exists.
export function CountryOutline({ code, fill = 'rgba(255,255,255,0.9)', className, style }: {
  code: string
  fill?: string
  className?: string
  style?: React.CSSProperties
}) {
  const d = COUNTRY_SHAPES[code.toUpperCase()]
  if (!d) return null

  // Every command in these paths is M/L/Z, so all numbers are x,y pairs in order.
  const nums = (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = nums[i], y = nums[i + 1]
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  if (!Number.isFinite(minX)) return null
  const pad = Math.max((maxX - minX), (maxY - minY)) * 0.06
  const viewBox = `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`

  return (
    <svg viewBox={viewBox} className={className} style={style} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <path d={d} fill={fill} />
    </svg>
  )
}
