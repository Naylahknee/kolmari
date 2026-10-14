/** Continent grouping for the Passport Index region filter (ISO 3166-1 alpha-2). */
export const PASSPORT_REGIONS = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'] as const
export type PassportRegion = (typeof PASSPORT_REGIONS)[number]

const GROUPS: Record<PassportRegion, string> = {
  Africa: 'DZ AO BJ BW BF BI CV CM CF TD KM CG CD CI DJ EG GQ ER SZ ET GA GM GH GN GW KE LS LR LY MG MW ML MR MU MA MZ NA NE NG RW ST SN SC SL SO ZA SS SD TZ TG TN UG ZM ZW EH',
  Asia: 'AF AM AZ BH BD BT BN KH CN CY GE HK IN ID IR IQ IL JP JO KZ KW KG LA LB MO MY MV MN MM NP KP OM PK PS PH QA SA SG KR LK SY TW TJ TH TL TR TM AE UZ VN YE',
  Europe: 'AL AD AT BY BE BA BG HR CZ DK EE FI FR DE GR HU IS IE IT XK LV LI LT LU MT MD MC ME NL MK NO PL PT RO RU SM RS SK SI ES SE CH UA GB VA',
  'North America': 'AG BS BB BZ CA CR CU DM DO SV GD GT HT HN JM MX NI PA KN LC VC TT US',
  'South America': 'AR BO BR CL CO EC GY PY PE SR UY VE',
  Oceania: 'AU FJ KI MH FM NR NZ PW PG WS SB TO TV VU',
}

const BY_CODE: Record<string, PassportRegion> = Object.fromEntries(
  (Object.entries(GROUPS) as [PassportRegion, string][]).flatMap(([region, codes]) => codes.split(' ').map((c) => [c, region])),
)

export function regionOf(code: string): PassportRegion | null {
  return BY_CODE[code.toUpperCase()] ?? null
}
