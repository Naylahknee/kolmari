// Pure ephemeris engine for the Energy Portal.
//
// Ported verbatim in behaviour from public/energy.html. Uses Meeus,
// "Astronomical Algorithms" 2nd ed. for Sun/Moon and the JPL approximate
// Keplerian planetary elements (valid 1800-2050). Sign-level accuracy.
//
// No DOM references. All functions are pure.

export const SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
] as const

export type Sign = (typeof SIGNS)[number]

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water'

// Keyed by string so callers can index with a plain string sign without a cast.
export const ELEMENT: Record<string, Element> = {
  Aries: 'Fire',
  Leo: 'Fire',
  Sagittarius: 'Fire',
  Taurus: 'Earth',
  Virgo: 'Earth',
  Capricorn: 'Earth',
  Gemini: 'Air',
  Libra: 'Air',
  Aquarius: 'Air',
  Cancer: 'Water',
  Scorpio: 'Water',
  Pisces: 'Water',
}

export interface Placement {
  lon?: number
  sign: string
  degIn?: number
  house: number
}

export interface AscPoint {
  lon?: number
  sign: string
  degIn?: number
}

export interface McPoint {
  lon?: number
  sign: string
}

export interface Chart {
  placements: Record<string, Placement>
  asc: AscPoint
  mc: McPoint
  computed: boolean
  houseOverrides?: Record<number, string>
}

// Values a user can supply on the "Big Three" path.
export interface BigThreeInput {
  sun: string
  moon: string
  rising: string
  mars?: string
  venus?: string
  jupiter?: string
  mc?: string
  h2?: string
  h6?: string
  h10?: string
  nn?: string
}

const D2R = Math.PI / 180
const R2D = 180 / Math.PI
const norm360 = (d: number): number => ((d % 360) + 360) % 360

export function julianDay(y: number, m: number, d: number, utHours: number): number {
  let yy = y
  let mm = m
  if (mm <= 2) {
    yy -= 1
    mm += 12
  }
  const A = Math.floor(yy / 100)
  const B = 2 - A + Math.floor(A / 4)
  return (
    Math.floor(365.25 * (yy + 4716)) +
    Math.floor(30.6001 * (mm + 1)) +
    d +
    B -
    1524.5 +
    utHours / 24
  )
}

export function obliquity(T: number): number {
  return 23.43929111 - 0.0130041667 * T - 1.6667e-7 * T * T + 5.02778e-7 * T * T * T
}

/* ---- Sun (Meeus ch. 25) ---- */
export function sunLongitude(JD: number): number {
  const T = (JD - 2451545.0) / 36525
  const L0 = norm360(280.46646 + 36000.76983 * T + 0.0003032 * T * T)
  const M = norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T)
  const Mr = M * D2R
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mr) +
    0.000289 * Math.sin(3 * Mr)
  const trueLon = L0 + C
  const omega = 125.04 - 1934.136 * T
  return norm360(trueLon - 0.00569 - 0.00478 * Math.sin(omega * D2R))
}

// [coeff(1e-6 deg), d, m, mp, f]
type MoonTerm = readonly [number, number, number, number, number]

const MOON_TERMS: readonly MoonTerm[] = [
  [6288774, 0, 0, 1, 0],
  [1274027, 2, 0, -1, 0],
  [658314, 2, 0, 0, 0],
  [213618, 0, 0, 2, 0],
  [-185116, 0, 1, 0, 0],
  [-114332, 0, 0, 0, 2],
  [58793, 2, 0, -2, 0],
  [57066, 2, -1, -1, 0],
  [53322, 2, 0, 1, 0],
  [45758, 2, -1, 0, 0],
  [-40923, 0, 1, -1, 0],
  [-34720, 1, 0, 0, 0],
  [-30383, 0, 1, 1, 0],
  [15327, 2, 0, 0, -2],
  [-12528, 0, 0, 1, 2],
  [10980, 0, 0, 1, -2],
  [10675, 4, 0, -1, 0],
  [10034, 0, 0, 3, 0],
  [8548, 4, 0, -2, 0],
  [-7888, 2, 1, -1, 0],
  [-6766, 2, 1, 0, 0],
  [-5163, 1, 0, -1, 0],
  [4987, 1, 1, 0, 0],
  [4036, 2, -1, 1, 0],
  [3994, 2, 0, 2, 0],
  [3861, 4, 0, 0, 0],
  [3665, 2, 0, -3, 0],
  [-2689, 0, 1, -2, 0],
  [-2602, 2, 0, -1, 2],
  [2390, 2, -1, -2, 0],
  [-2348, 1, 0, 1, 0],
  [2236, 2, -2, 0, 0],
]

/* ---- Moon (Meeus ch. 47, principal longitude terms) ---- */
export function moonLongitude(JD: number): number {
  const T = (JD - 2451545.0) / 36525
  const Lp = norm360(
    218.3164477 +
      481267.88123421 * T -
      0.0015786 * T * T +
      (T * T * T) / 538841 -
      (T * T * T * T) / 65194000,
  )
  const D = norm360(
    297.8501921 +
      445267.1114034 * T -
      0.0018819 * T * T +
      (T * T * T) / 545868 -
      (T * T * T * T) / 113065000,
  )
  const M = norm360(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + (T * T * T) / 24490000)
  const Mp = norm360(
    134.9633964 +
      477198.8675055 * T +
      0.0087414 * T * T +
      (T * T * T) / 69699 -
      (T * T * T * T) / 14712000,
  )
  const F = norm360(
    93.272095 +
      483202.0175233 * T -
      0.0036539 * T * T -
      (T * T * T) / 3526000 +
      (T * T * T * T) / 863310000,
  )
  const E = 1 - 0.002516 * T - 0.0000074 * T * T
  let sum = 0
  for (const [c, cd, cm, cmp, cf] of MOON_TERMS) {
    let coeff = c
    if (Math.abs(cm) === 1) coeff *= E
    if (Math.abs(cm) === 2) coeff *= E * E
    sum += coeff * Math.sin((cd * D + cm * M + cmp * Mp + cf * F) * D2R)
  }
  return norm360(Lp + sum * 1e-6)
}

/* ---- Planets: JPL approximate Keplerian elements, 1800-2050 ---- */
// [a, e, I, L, longPeri, longNode] + per-century rates
type Sextet = readonly [number, number, number, number, number, number]
interface JplEntry {
  el: Sextet
  rt: Sextet
}

const JPL: Record<string, JplEntry> = {
  Mercury: {
    el: [0.38709927, 0.20563593, 7.00497902, 252.2503235, 77.45779628, 48.33076593],
    rt: [0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081],
  },
  Venus: {
    el: [0.72333566, 0.00677672, 3.39467605, 181.9790995, 131.60246718, 76.67984255],
    rt: [0.0000039, -0.00004107, -0.0007889, 58517.81538729, 0.00268329, -0.27769418],
  },
  Earth: {
    el: [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0.0],
    rt: [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0.0],
  },
  Mars: {
    el: [1.52371034, 0.0933941, 1.84969142, -4.55343205, -23.94362959, 49.55953891],
    rt: [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343],
  },
  Jupiter: {
    el: [5.202887, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909],
    rt: [-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106],
  },
  Saturn: {
    el: [9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448],
    rt: [-0.0012506, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794],
  },
  Uranus: {
    el: [19.18916464, 0.04725744, 0.77263783, 313.23810451, 170.9542763, 74.01692503],
    rt: [-0.00196176, -0.00004397, -0.00242939, 428.48202785, 0.40805281, 0.04240589],
  },
  Neptune: {
    el: [30.06992276, 0.00859048, 1.77004347, -55.12002969, 44.96476227, 131.78422574],
    rt: [0.00026291, 0.00005105, 0.00035372, 218.45945325, -0.32241464, -0.00508664],
  },
  Pluto: {
    el: [39.48211675, 0.2488273, 17.14001206, 238.92903833, 224.06891629, 110.30393684],
    rt: [-0.00031596, 0.0000517, 0.00004818, 145.20780515, -0.04062942, -0.01183482],
  },
}

function heliocentric(name: string, T: number): [number, number, number] {
  const p = JPL[name]
  const a = p.el[0] + p.rt[0] * T
  const e = p.el[1] + p.rt[1] * T
  const I = (p.el[2] + p.rt[2] * T) * D2R
  const L = p.el[3] + p.rt[3] * T
  const w_ = p.el[4] + p.rt[4] * T // longitude of perihelion
  const O = (p.el[5] + p.rt[5] * T) * D2R
  const w = w_ * D2R - O // argument of perihelion
  let M = norm360(L - w_)
  if (M > 180) M -= 360
  const Mr = M * D2R
  // Solve Kepler
  let E = Mr + e * Math.sin(Mr)
  for (let i = 0; i < 8; i++) {
    const dE = (Mr - (E - e * Math.sin(E))) / (1 - e * Math.cos(E))
    E += dE
    if (Math.abs(dE) < 1e-8) break
  }
  const xp = a * (Math.cos(E) - e)
  const yp = a * Math.sqrt(1 - e * e) * Math.sin(E)
  // Rotate to J2000 ecliptic
  const cw = Math.cos(w)
  const sw = Math.sin(w)
  const cO = Math.cos(O)
  const sO = Math.sin(O)
  const cI = Math.cos(I)
  const sI = Math.sin(I)
  const x = (cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp
  const y = (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp
  const z = sw * sI * xp + cw * sI * yp
  return [x, y, z]
}

export function planetLongitude(name: string, JD: number): number {
  const T = (JD - 2451545.0) / 36525
  const ph = heliocentric(name, T)
  const eh = heliocentric('Earth', T)
  const gx = ph[0] - eh[0]
  const gy = ph[1] - eh[1]
  return norm360(Math.atan2(gy, gx) * R2D)
}

/* ---- Sidereal time and Ascendant ---- */
export function gmstDeg(JD: number): number {
  const T = (JD - 2451545.0) / 36525
  return norm360(
    280.46061837 +
      360.98564736629 * (JD - 2451545.0) +
      0.000387933 * T * T -
      (T * T * T) / 38710000,
  )
}

// Robust ascendant: scan the ecliptic for the point crossing the eastern
// horizon. No quadrant bugs, works at all latitudes short of polar extremes.
export function ascendantLongitude(JD: number, latDeg: number, lonDeg: number): number {
  const eps = obliquity((JD - 2451545) / 36525) * D2R
  const lst = norm360(gmstDeg(JD) + lonDeg)
  const phi = latDeg * D2R
  function altAndEast(lam: number): { alt: number; east: boolean } {
    const l = lam * D2R
    const dec = Math.asin(Math.sin(eps) * Math.sin(l))
    const ra = Math.atan2(Math.cos(eps) * Math.sin(l), Math.cos(l)) * R2D
    let H = norm360(lst - ra)
    if (H > 180) H -= 360 // H in (-180,180]
    const alt =
      Math.asin(
        Math.sin(phi) * Math.sin(dec) +
          Math.cos(phi) * Math.cos(dec) * Math.cos(H * D2R),
      ) * R2D
    return { alt, east: H < 0 }
  }
  let best: { lam: number; absAlt: number } | null = null
  for (let lam = 0; lam < 360; lam += 0.5) {
    const r = altAndEast(lam)
    if (r.east && (best === null || Math.abs(r.alt) < best.absAlt)) {
      best = { lam, absAlt: Math.abs(r.alt) }
    }
  }
  // best is always set: the eastern half of the ecliptic guarantees a hit.
  const seed = best ?? { lam: 0, absAlt: Infinity }
  // refine
  const lo = seed.lam - 0.6
  const hi = seed.lam + 0.6
  let bestLam = seed.lam
  let bestAbs = seed.absAlt
  for (let lam = lo; lam <= hi; lam += 0.01) {
    const r = altAndEast(norm360(lam))
    if (r.east && Math.abs(r.alt) < bestAbs) {
      bestAbs = Math.abs(r.alt)
      bestLam = norm360(lam)
    }
  }
  return bestLam
}

export function midheavenLongitude(JD: number, lonDeg: number): number {
  const eps = obliquity((JD - 2451545) / 36525) * D2R
  const ramc = norm360(gmstDeg(JD) + lonDeg) * D2R
  const mc = Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(eps)) * R2D
  return norm360(mc)
}

export function signOf(lon: number): string {
  return SIGNS[Math.floor(norm360(lon) / 30)]
}

export function degInSign(lon: number): number {
  return norm360(lon) % 30
}

export function computeChart(
  y: number,
  m: number,
  d: number,
  hh: number,
  mm: number,
  tzOffset: number,
  lat: number,
  lon: number,
): Chart {
  const utHours = hh + mm / 60 - tzOffset
  const JD = julianDay(y, m, d, utHours)
  const rawLon: Record<string, number> = {
    Sun: sunLongitude(JD),
    Moon: moonLongitude(JD),
    Mercury: planetLongitude('Mercury', JD),
    Venus: planetLongitude('Venus', JD),
    Mars: planetLongitude('Mars', JD),
    Jupiter: planetLongitude('Jupiter', JD),
    Saturn: planetLongitude('Saturn', JD),
    Uranus: planetLongitude('Uranus', JD),
    Neptune: planetLongitude('Neptune', JD),
    Pluto: planetLongitude('Pluto', JD),
  }
  const placements: Record<string, Placement> = {}
  for (const k in rawLon) {
    const lonK = rawLon[k]
    placements[k] = {
      lon: lonK,
      sign: signOf(lonK),
      degIn: degInSign(lonK),
      house: 0,
    }
  }
  const ascLon = ascendantLongitude(JD, lat, lon)
  const mcLon = midheavenLongitude(JD, lon)
  const ascSign = signOf(ascLon)
  const ascIdx = SIGNS.indexOf(ascSign as Sign)
  for (const k in placements) {
    placements[k].house = ((SIGNS.indexOf(placements[k].sign as Sign) - ascIdx + 12) % 12) + 1
  }
  return {
    placements,
    asc: { lon: ascLon, sign: ascSign, degIn: degInSign(ascLon) },
    mc: { lon: mcLon, sign: signOf(mcLon) },
    computed: true,
  }
}

export function chartFromBigThree(v: BigThreeInput): Chart {
  const ascIdx = SIGNS.indexOf(v.rising as Sign)
  const houseOf = (sign: string): number => ((SIGNS.indexOf(sign as Sign) - ascIdx + 12) % 12) + 1
  const placements: Record<string, Placement> = {
    Sun: { sign: v.sun, house: houseOf(v.sun) },
    Moon: { sign: v.moon, house: houseOf(v.moon) },
  }
  if (v.mars) placements.Mars = { sign: v.mars, house: houseOf(v.mars) }
  if (v.venus) placements.Venus = { sign: v.venus, house: houseOf(v.venus) }
  if (v.jupiter) placements.Jupiter = { sign: v.jupiter, house: houseOf(v.jupiter) }

  const houseOverrides: Record<number, string> = {}
  const chart: Chart = {
    placements,
    asc: { sign: v.rising },
    mc: { sign: v.mc || SIGNS[(ascIdx + 9) % 12] },
    computed: false,
    houseOverrides,
  }
  if (v.h2) houseOverrides[2] = v.h2
  if (v.h6) houseOverrides[6] = v.h6
  if (v.h10) houseOverrides[10] = v.h10
  if (v.nn) placements.NorthNode = { sign: v.nn, house: houseOf(v.nn) }
  // If house signs were given directly, re-place planets against them
  if (Object.keys(houseOverrides).length) {
    for (const k in placements) {
      for (const hn in houseOverrides) {
        if (placements[k].sign === houseOverrides[hn]) placements[k].house = parseInt(hn, 10)
      }
    }
  }
  return chart
}
