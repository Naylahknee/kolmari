import 'server-only'

import { getSql } from './db'
import type { SessionUser } from './auth'

/**
 * Admin allowlist.
 *
 * Emails are read from the ADMIN_EMAILS environment variable (comma-separated),
 * never committed to the repo — this repository is public, so an owner's email
 * must not live in source. Admin accounts are promoted to the top plan when
 * their profile loads, which opens every gate for them without touching any
 * gate logic or any real user's stored data. Leave ADMIN_EMAILS unset in
 * production and no account is treated as admin.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const allow = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
  return allow.includes(email.trim().toLowerCase())
}

/**
 * True when the given session user is an admin: either an allowlisted email or
 * the first registered account (the owner), matching the promotion rule in
 * getProfile. Requires a DB read only for the first-user check.
 */
export async function isAdminUser(user: SessionUser | null | undefined): Promise<boolean> {
  if (!user) return false
  if (isAdminEmail(user.email)) return true
  const rows = (await getSql()`SELECT MIN(id) AS min_id FROM users`) as { min_id: number | null }[]
  return rows[0]?.min_id === user.id
}
