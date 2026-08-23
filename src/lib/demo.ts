import 'server-only'

import { hash } from 'bcryptjs'
import { getSql } from './db'
import { DEMO_EMAIL } from './demo-identity'
import { emptyProfile, saveProfile, type RelocationProfile } from './profile'

export { DEMO_EMAIL, isDemoEmail, isDemoEnabled, checkDemoCode } from './demo-identity'

/**
 * Shared demo account.
 *
 * One account behind a hand-out code, so people can try Kolmari without
 * signing up. Two rules govern it:
 *
 *  1. The code lives ONLY in DEMO_ACCESS_CODE. This repository is public, so a
 *     credential must never appear in source — the same reason ADMIN_EMAILS is
 *     an environment variable (see admin.ts). Unset means the demo is off.
 *  2. The demo account is never an admin. That is enforced in admin.ts against
 *     isDemoEmail below, not by remembering to keep this address out of
 *     ADMIN_EMAILS — see the note there.
 *
 * Note the account is on the top PLAN tier (`navigator`) so every paid feature
 * is visible. Plan tier and admin are separate concerns: one is what a
 * subscriber can see, the other is who can administer the site.
 */

/**
 * The persona the demo starts from. Kolmari's value is the personalization, so
 * an unseeded demo would redirect to the wizard and show empty states
 * everywhere. These fields are the ones rankNextinations() actually reads
 * (display_name, goals, monthly_income, occupation, preferred_regions,
 * priority, remote, timeline) plus enough household detail for the plan to
 * look real. Adjust freely — nothing below is logic.
 */
export const DEMO_PERSONA: Partial<RelocationProfile> = {
  plan: 'navigator',
  wizard_status: 'completed',
  display_name: 'Demo',
  citizenship: 'United States',
  current_country: 'United States',
  monthly_income: 5000,
  annual_income: 60000,
  income_type: 'Remote employment',
  remote: true,
  occupation: 'Product designer',
  education: "Bachelor's degree",
  savings: 40000,
  household_type: 'Couple',
  family_size: 2,
  spouse: true,
  dependents: 0,
  preferred_regions: ['Europe'],
  preferred_region: 'Europe',
  timeline: '6-12 months',
  priority: 'Affordability',
  goals: ['Remote Work'],
  climate: 'Mild',
  onboarding_completed: true,
  dashboard_onboarding_completed: true,
  wizard_completed: true,
}

type UserRow = { id: number; email: string }

/**
 * Create the demo user if missing, then reset its profile to DEMO_PERSONA.
 * Called on every code entry so each demo starts clean instead of inheriting
 * whatever the last visitor did. Idempotent.
 *
 * The stored password is a bcrypt hash of a random string that is never
 * returned or logged, so the account cannot be reached through the normal
 * sign-in form — the code is the only door.
 */
export async function ensureDemoAccount(): Promise<UserRow> {
  const sql = getSql()
  const existing = (await sql`SELECT id, email FROM users WHERE email = ${DEMO_EMAIL} LIMIT 1`) as UserRow[]

  let user = existing[0]
  if (!user) {
    const unusable = await hash(crypto.randomUUID() + crypto.randomUUID(), 12)
    const inserted = (await sql`
      INSERT INTO users (email, password)
      VALUES (${DEMO_EMAIL}, ${unusable})
      ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
      RETURNING id, email
    `) as UserRow[]
    user = inserted[0]
  }

  await saveProfile({ ...emptyProfile(user.id), ...DEMO_PERSONA } as RelocationProfile)
  return user
}
