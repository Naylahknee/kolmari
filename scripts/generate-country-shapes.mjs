import fs from 'node:fs'

const source = JSON.parse(fs.readFileSync('public/data/countries-110m.geojson', 'utf8'))
const codes = new Set(['AL', 'AU', 'BG', 'BZ', 'CA', 'CO', 'CR', 'DE', 'EC', 'EE', 'ES', 'FR', 'GB', 'GE', 'GH', 'GR', 'ID', 'IE', 'IL', 'IT', 'JP', 'KE', 'KH', 'KR', 'MT', 'MU', 'MX', 'MY', 'NL', 'NZ', 'PA', 'PH', 'PT', 'PY', 'RO', 'SI', 'TH', 'UY', 'ZA'])
const fallbackShapes = {
  // Mauritius is below Natural Earth's 1:110m minimum feature size.
  MU: 'M128 19 C139 24 148 35 151 48 C154 61 150 76 141 89 C134 99 121 103 109 98 C96 92 87 80 87 66 C87 52 94 40 104 30 C111 23 120 18 128 19 Z',
  // Malta is also below the dataset's minimum feature size.
  MT: 'M91 57 L106 44 L130 45 L148 55 L145 72 L124 82 L101 77 Z M157 76 L166 72 L173 78 L168 87 L159 85 Z',
}

// Capital cities (name and WGS84 lat/lng). Each capital is projected through
// the same per-country fit transform as the country silhouette, so the pin
// always lands on the drawn shape. Countries without an entry fall back to the
// shape centroid at render time.
const capitals = {
  AL: { name: 'Tirana', lat: 41.3275, lng: 19.8189 },
  AU: { name: 'Canberra', lat: -35.2809, lng: 149.1300 },
  BG: { name: 'Sofia', lat: 42.6977, lng: 23.3219 },
  BZ: { name: 'Belmopan', lat: 17.2514, lng: -88.7705 },
  CA: { name: 'Ottawa', lat: 45.4215, lng: -75.6972 },
  CO: { name: 'Bogotá', lat: 4.7110, lng: -74.0721 },
  CR: { name: 'San José', lat: 9.9281, lng: -84.0907 },
  DE: { name: 'Berlin', lat: 52.5200, lng: 13.4050 },
  EC: { name: 'Quito', lat: -0.1807, lng: -78.4678 },
  EE: { name: 'Tallinn', lat: 59.4370, lng: 24.7536 },
  ES: { name: 'Madrid', lat: 40.4168, lng: -3.7038 },
  FR: { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  GB: { name: 'London', lat: 51.5074, lng: -0.1278 },
  GE: { name: 'Tbilisi', lat: 41.7151, lng: 44.8271 },
  GH: { name: 'Accra', lat: 5.6037, lng: -0.1870 },
  GR: { name: 'Athens', lat: 37.9838, lng: 23.7275 },
  ID: { name: 'Jakarta', lat: -6.2088, lng: 106.8456 },
  IE: { name: 'Dublin', lat: 53.3498, lng: -6.2603 },
  IL: { name: 'Jerusalem', lat: 31.7683, lng: 35.2137 },
  IT: { name: 'Rome', lat: 41.9028, lng: 12.4964 },
  JP: { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  KE: { name: 'Nairobi', lat: -1.2921, lng: 36.8219 },
  KH: { name: 'Phnom Penh', lat: 11.5564, lng: 104.9282 },
  KR: { name: 'Seoul', lat: 37.5665, lng: 126.9780 },
  MX: { name: 'Mexico City', lat: 19.4326, lng: -99.1332 },
  MY: { name: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869 },
  NL: { name: 'Amsterdam', lat: 52.3676, lng: 4.9041 },
  NZ: { name: 'Wellington', lat: -41.2865, lng: 174.7762 },
  PA: { name: 'Panama City', lat: 8.9824, lng: -79.5199 },
  PH: { name: 'Manila', lat: 14.5995, lng: 120.9842 },
  PT: { name: 'Lisbon', lat: 38.7223, lng: -9.1393 },
  PY: { name: 'Asunción', lat: -25.2637, lng: -57.5759 },
  RO: { name: 'Bucharest', lat: 44.4268, lng: 26.1025 },
  SI: { name: 'Ljubljana', lat: 46.0569, lng: 14.5058 },
  TH: { name: 'Bangkok', lat: 13.7563, lng: 100.5018 },
  UY: { name: 'Montevideo', lat: -34.9011, lng: -56.1645 },
  ZA: { name: 'Pretoria', lat: -25.7479, lng: 28.2293 },
}

// Capitals for hand-drawn fallback shapes, positioned directly in the
// 240x120 viewBox because those outlines are not projected from the geojson.
const fallbackCapitals = {
  MU: { name: 'Port Louis', x: 112, y: 58 },
  MT: { name: 'Valletta', x: 122, y: 62 },
}

function ringsOf(geometry) {
  if (geometry.type === 'Polygon') return geometry.coordinates
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.flat()
  return []
}

function transformOf(geometry) {
  const points = ringsOf(geometry).flat()
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
  return { minX, maxY, scale, offsetX, offsetY }
}

function project({ minX, maxY, scale, offsetX, offsetY }, longitude, latitude) {
  return {
    x: offsetX + (longitude - minX) * scale,
    y: offsetY + (maxY - latitude) * scale,
  }
}

function createPath(geometry) {
  const t = transformOf(geometry)
  return ringsOf(geometry).map((ring) => ring.map(([longitude, latitude], index) => {
    const { x, y } = project(t, longitude, latitude)
    return `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ') + ' Z').join(' ')
}

const selected = source.features
  .map((feature) => ({
    feature,
    code: codes.has(feature.properties.ISO_A2) ? feature.properties.ISO_A2 : feature.properties.ISO_A2_EH,
  }))
  .filter(({ code }) => codes.has(code))
  .sort((a, b) => a.code.localeCompare(b.code))

const shapeEntries = selected.map(({ feature, code }) => `  ${JSON.stringify(code)}: ${JSON.stringify(createPath(feature.geometry))},`)

const capitalEntries = []
for (const { feature, code } of selected) {
  const capital = capitals[code]
  if (!capital) continue
  const { x, y } = project(transformOf(feature.geometry), capital.lng, capital.lat)
  capitalEntries.push(`  ${JSON.stringify(code)}: { name: ${JSON.stringify(capital.name)}, x: ${x.toFixed(1)}, y: ${y.toFixed(1)} },`)
}

for (const [code, path] of Object.entries(fallbackShapes)) {
  if (!shapeEntries.some((entry) => entry.startsWith(`  "${code}"`))) {
    shapeEntries.push(`  ${JSON.stringify(code)}: ${JSON.stringify(path)},`)
  }
}
for (const [code, capital] of Object.entries(fallbackCapitals)) {
  if (!capitalEntries.some((entry) => entry.startsWith(`  "${code}"`))) {
    capitalEntries.push(`  ${JSON.stringify(code)}: { name: ${JSON.stringify(capital.name)}, x: ${capital.x.toFixed(1)}, y: ${capital.y.toFixed(1)} },`)
  }
}
shapeEntries.sort()
capitalEntries.sort()

const shapeOutput = `// Generated from Natural Earth 1:110m admin-0 country boundaries.\n// Mauritius uses a simplified local outline because it is below the dataset's minimum feature size.\n// Regenerate with: node scripts/generate-country-shapes.mjs\nexport const COUNTRY_SHAPES: Record<string, string> = {\n${shapeEntries.join('\n')}\n}\n`
fs.writeFileSync('src/lib/country-shapes.ts', shapeOutput)

const capitalOutput = `// Generated from Natural Earth 1:110m admin-0 country boundaries.\n// Each capital is projected through the same per-country fit transform as the\n// matching COUNTRY_SHAPES outline, so a pin at (x, y) lands on the drawn shape.\n// Regenerate with: node scripts/generate-country-shapes.mjs\nexport type CountryCapital = { name: string; x: number; y: number }\nexport const COUNTRY_CAPITALS: Record<string, CountryCapital> = {\n${capitalEntries.join('\n')}\n}\n`
fs.writeFileSync('src/lib/country-capitals.ts', capitalOutput)
