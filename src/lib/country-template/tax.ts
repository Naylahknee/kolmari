/** Portuguese IRS bands. Indexed annually: move these into the country record. */
export const IRS_BANDS: [number, number][] = [
  [8059, 0.13], [12160, 0.165], [17233, 0.22], [22306, 0.25], [28400, 0.32],
  [41629, 0.355], [44987, 0.435], [83696, 0.45], [Infinity, 0.48],
]

export type EarnerType = 'employee' | 'self' | 'passive'

export function calcIrs(income: number, bands = IRS_BANDS): number {
  let tax = 0, prev = 0
  for (const [cap, rate] of bands) {
    if (income <= prev) break
    tax += (Math.min(income, cap) - prev) * rate
    prev = cap
  }
  if (income > 80_000) tax += (Math.min(income, 250_000) - 80_000) * 0.025
  if (income > 250_000) tax += (income - 250_000) * 0.05
  return tax
}

export const SS_RATE: Record<EarnerType, number> = { employee: 0.11, self: 0.1498, passive: 0 }

export function estimate(income: number, mode: EarnerType, ifici: boolean) {
  const flat = ifici && mode !== 'passive'
  const irs = flat ? income * 0.2 : calcIrs(income)
  const ss = income * SS_RATE[mode]
  return { irs, ss, net: income - irs - ss, effective: irs / income, flat }
}
