import raw from './data.json'

export type PassportCode = string

export interface PassportEntry {
  /** Country name */
  n: string
  /** Mobility score: destinations reachable visa-free or with visa on arrival */
  s: number
  /** Dense world rank */
  r: number
  /** Destination ISO-2 -> encoded requirement */
  d: Record<string, string>
}

export interface PassportIndexMeta {
  updated: string
  source: string
  sourceUrl: string
  license: string
  note: string
  scoreDef: string
}

const data = raw as { meta: PassportIndexMeta; passports: Record<string, PassportEntry> }

export const PASSPORT_META = data.meta
export const PASSPORTS = data.passports
export const PASSPORT_CODES = Object.keys(data.passports).sort((a, b) =>
  data.passports[a].n.localeCompare(data.passports[b].n),
)

export type RequirementKind = 'visa-free' | 'visa-on-arrival' | 'eta' | 'e-visa' | 'visa-required' | 'no-admission'

export interface Requirement {
  kind: RequirementKind
  days: number | null
}

/** Decode compact values like "VF90", "VOA", "ETA180", "EV", "VR", "NA". */
export function decodeRequirement(code: string): Requirement {
  const m = /^([A-Z]+)(\d+)?$/.exec(code)
  const kind = m?.[1] ?? ''
  const days = m?.[2] ? parseInt(m[2], 10) : null
  switch (kind) {
    case 'VF': return { kind: 'visa-free', days }
    case 'VOA': return { kind: 'visa-on-arrival', days }
    case 'ETA': return { kind: 'eta', days }
    case 'EV': return { kind: 'e-visa', days }
    case 'NA': return { kind: 'no-admission', days }
    default: return { kind: 'visa-required', days }
  }
}

export const REQUIREMENT_LABEL: Record<RequirementKind, string> = {
  'visa-free': 'Visa-free',
  'visa-on-arrival': 'Visa on arrival',
  'eta': 'eTA required',
  'e-visa': 'eVisa required',
  'visa-required': 'Visa required',
  'no-admission': 'No admission',
}

export function requirementSummary(req: Requirement): string {
  const base = REQUIREMENT_LABEL[req.kind]
  if (req.days && (req.kind === 'visa-free' || req.kind === 'eta')) return `${base} · ${req.days} days`
  return base
}

/** Passports sorted by mobility score, then name. */
export function rankedPassports(): { code: string; entry: PassportEntry }[] {
  return Object.entries(PASSPORTS)
    .map(([code, entry]) => ({ code, entry }))
    .sort((a, b) => b.entry.s - a.entry.s || a.entry.n.localeCompare(b.entry.n))
}

/** Category counts for one passport. */
export function categoryCounts(entry: PassportEntry): Record<RequirementKind, number> {
  const counts: Record<RequirementKind, number> = {
    'visa-free': 0, 'visa-on-arrival': 0, eta: 0, 'e-visa': 0, 'visa-required': 0, 'no-admission': 0,
  }
  for (const code of Object.values(entry.d)) counts[decodeRequirement(code).kind] += 1
  return counts
}
