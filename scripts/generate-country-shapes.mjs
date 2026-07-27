import fs from 'node:fs'

const source = JSON.parse(fs.readFileSync('public/data/countries-110m.geojson', 'utf8'))
const codes = new Set(['PT', 'ES', 'GR', 'EE', 'GH', 'ZA', 'KE', 'MU', 'TH', 'MY', 'JP', 'ID', 'CA', 'MX', 'CR', 'CO', 'PA', 'NZ', 'AU'])
const fallbackShapes = {
  // Mauritius is below Natural Earth's 1:110m minimum feature size.
  MU: 'M128 19 C139 24 148 35 151 48 C154 61 150 76 141 89 C134 99 121 103 109 98 C96 92 87 80 87 66 C87 52 94 40 104 30 C111 23 120 18 128 19 Z',
}

function ringsOf(geometry) {
  if (geometry.type === 'Polygon') return geometry.coordinates
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.flat()
  return []
}

function createPath(geometry) {
  const rings = ringsOf(geometry)
  const points = rings.flat()
  const xs = points.map(([x]) => x)
  const ys = points.map(([, y]) => y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const width = Math.max(1, maxX - minX)
  const height = Math.max(1, maxY - minY)
  const scale = Math.min(196 / width, 82 / height)
  const offsetX = (240 - width * scale) / 2
  const offsetY = (120 - height * scale) / 2
  return rings.map((ring) => ring.map(([longitude, latitude], index) => {
    const x = offsetX + (longitude - minX) * scale
    const y = offsetY + (maxY - latitude) * scale
    return `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ') + ' Z').join(' ')
}

const entries = source.features
  .filter((feature) => codes.has(feature.properties.ISO_A2))
  .sort((a, b) => a.properties.ISO_A2.localeCompare(b.properties.ISO_A2))
  .map((feature) => `  ${JSON.stringify(feature.properties.ISO_A2)}: ${JSON.stringify(createPath(feature.geometry))},`)

for (const [code, path] of Object.entries(fallbackShapes)) {
  if (!entries.some((entry) => entry.startsWith(`  "${code}"`))) {
    entries.push(`  ${JSON.stringify(code)}: ${JSON.stringify(path)},`)
  }
}
entries.sort()

const output = `// Generated from Natural Earth 1:110m admin-0 country boundaries.\n// Mauritius uses a simplified local outline because it is below the dataset's minimum feature size.\n// Regenerate with: node scripts/generate-country-shapes.mjs\nexport const COUNTRY_SHAPES: Record<string, string> = {\n${entries.join('\n')}\n}\n`
fs.writeFileSync('src/lib/country-shapes.ts', output)
