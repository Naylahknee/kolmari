import { feature } from 'topojson-client'
import countries110m from 'world-atlas/countries-110m.json'

/**
 * Shared Natural Earth helpers (Sep 2026). The matched-destinations map and
 * the country snapshot locator both draw from the `world-atlas` 110m dataset
 * so maps render with no Mapbox token dependency.
 */

// world-atlas uses ISO 3166 numeric ids on each country feature.
export const ISO2_TO_NE_ID: Record<string, string> = {
  AL: '008', AU: '036', BG: '100', BZ: '084', CA: '124', CR: '188', DE: '276',
  EC: '218', EE: '233', ES: '724', FR: '250', GB: '826', GE: '268', GR: '300',
  IE: '372', IT: '380', JP: '392', KH: '116', KR: '410', MT: '470', MX: '484',
  NL: '528', NZ: '554', PA: '591', PH: '608', PT: '620', PY: '600', RO: '642',
  SI: '705', TH: '764', UY: '858',
}

export type WorldCountryFeature = {
  type: 'Feature'
  id?: string
  properties: { name: string }
  geometry: object | null
}

const topo = countries110m as { objects: { countries: object } }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ALL: WorldCountryFeature[] = (feature as (topology: any, obj: any) => { features: WorldCountryFeature[] })(topo, topo.objects.countries).features

const BY_NE_ID = new Map(ALL.map((f) => [String(f.id), f]))

/** All 110m country features (for context layers). */
export function getWorldFeatures(): WorldCountryFeature[] {
  return ALL
}

/** The 110m feature for an ISO2 country code, or undefined when the dataset omits it (e.g. Malta). */
export function getCountryFeature(iso2: string | undefined): WorldCountryFeature | undefined {
  if (!iso2) return undefined
  const f = BY_NE_ID.get(ISO2_TO_NE_ID[iso2.toUpperCase()])
  return f?.geometry ? f : undefined
}
