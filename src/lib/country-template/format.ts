export type Currency = 'EUR' | 'USD'
export type TempUnit = 'C' | 'F'

/** Replace with a daily FX feed before this is user-visible. */
export const FX = 1.08

export const fmtNum = (v: number, dec = 0) =>
  v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })

export function fmtMoney(eur: number, currency: Currency, dec?: number) {
  const d = dec ?? (Math.abs(eur) < 10 && eur % 1 !== 0 ? 2 : 0)
  return currency === 'EUR' ? `EUR ${fmtNum(eur, d)}` : `$${fmtNum(eur * FX, d)}`
}

export const c2f = (c: number) => (c * 9) / 5 + 32

export function fmtTemp(c: number, unit: TempUnit, hi?: number) {
  const v = (x: number) => Math.round(unit === 'C' ? x : c2f(x))
  return `${v(c)}${hi !== undefined ? `\u2013${v(hi)}` : ''}\u00B0${unit}`
}
