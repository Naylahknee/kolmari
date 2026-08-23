/**
 * Demo account identity — a dependency-free leaf module.
 *
 * Kept separate from demo.ts (which seeds the account and therefore imports
 * profile.ts) so that admin.ts, profile.ts and admin-data.ts can identify the
 * demo account without creating an import cycle. Same reason plan-tiers.ts is
 * split out of profile.ts.
 */

export const DEMO_EMAIL = 'demo@kolmari.app'

export function isDemoEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return email.trim().toLowerCase() === DEMO_EMAIL
}

/** The demo door only exists when a code has been configured. */
export function isDemoEnabled(): boolean {
  return Boolean(process.env.DEMO_ACCESS_CODE)
}

/**
 * Compare in constant time. A plain `===` short-circuits on the first differing
 * character, so response timing would leak the code one character at a time.
 */
export function checkDemoCode(input: string | null | undefined): boolean {
  const expected = process.env.DEMO_ACCESS_CODE
  if (!expected || typeof input !== 'string') return false
  const a = new TextEncoder().encode(input)
  const b = new TextEncoder().encode(expected)
  // Fold the length difference into the result rather than returning early.
  let diff = a.length ^ b.length
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    diff |= (a[i] ?? 0) ^ (b[i] ?? 0)
  }
  return diff === 0
}
