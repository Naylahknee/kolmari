import 'server-only'

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
