import { createHash, randomInt, timingSafeEqual } from 'node:crypto'
import { getSql } from './db'
import { isDemoEmail } from './demo-identity'

// Real email verification for signups (Phase 3). Design: a 6-digit code emailed
// via Resend, entered on the verify screen. Security posture:
// - Codes are crypto-random; only a SHA-256 hash is stored, never the code.
// - Single active code per user, 15-minute expiry, dead after 5 wrong guesses.
// - 60-second cooldown between sends; per-IP rate limits on the API routes.
// - The whole flow is inert until RESEND_API_KEY is set, so nothing can lock
//   users out before the email service is configured.

const CODE_TTL_MS = 15 * 60 * 1000
const RESEND_COOLDOWN_MS = 60 * 1000
const MAX_ATTEMPTS = 5

export function isEmailVerificationEnabled(): boolean {
  return !!process.env.RESEND_API_KEY
}

let verificationTablesReady: Promise<void> | undefined
export function ensureVerificationTables() {
  return (verificationTablesReady ??= (async () => {
    const sql = getSql()
    await sql`
      CREATE TABLE IF NOT EXISTS email_verification_codes (
        user_id INTEGER PRIMARY KEY,
        code_hash TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        attempts INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE`
  })())
}

function hashCode(code: string): string {
  return createHash('sha256').update(code, 'utf8').digest('hex')
}

export async function getEmailVerified(userId: number): Promise<boolean> {
  const sql = getSql()
  await ensureVerificationTables()
  const rows = (await sql`SELECT email_verified FROM users WHERE id = ${userId} LIMIT 1`) as {
    email_verified: boolean
  }[]
  return rows[0]?.email_verified ?? false
}

export async function setEmailVerified(userId: number): Promise<void> {
  const sql = getSql()
  await ensureVerificationTables()
  await sql`UPDATE users SET email_verified = TRUE WHERE id = ${userId}`
  await sql`DELETE FROM email_verification_codes WHERE user_id = ${userId}`
}

/** True when this user must pass the verify screen (demo account is exempt). */
export async function verificationRequiredFor(userId: number, email: string): Promise<boolean> {
  if (!isEmailVerificationEnabled()) return false
  if (isDemoEmail(email)) return false
  return !(await getEmailVerified(userId))
}

/** Issues (or re-issues) a code. Returns null when the resend cooldown is active. */
export async function issueVerificationCode(userId: number): Promise<{ code: string } | null> {
  const sql = getSql()
  await ensureVerificationTables()
  const existing = (await sql`SELECT created_at FROM email_verification_codes WHERE user_id = ${userId} LIMIT 1`) as {
    created_at: string
  }[]
  if (existing[0] && Date.now() - Date.parse(existing[0].created_at) < RESEND_COOLDOWN_MS) {
    return null
  }
  const code = String(randomInt(100000, 1000000))
  const expiresAt = new Date(Date.now() + CODE_TTL_MS).toISOString()
  await sql`
    INSERT INTO email_verification_codes (user_id, code_hash, expires_at, attempts)
    VALUES (${userId}, ${hashCode(code)}, ${expiresAt}, 0)
    ON CONFLICT (user_id) DO UPDATE SET
      code_hash = EXCLUDED.code_hash,
      expires_at = EXCLUDED.expires_at,
      attempts = 0,
      created_at = NOW()
  `
  return { code }
}

export type CodeCheck = 'ok' | 'invalid' | 'expired' | 'too_many_attempts' | 'none'

export async function checkVerificationCode(userId: number, code: string): Promise<CodeCheck> {
  const sql = getSql()
  await ensureVerificationTables()
  const rows = (await sql`SELECT code_hash, expires_at, attempts FROM email_verification_codes WHERE user_id = ${userId} LIMIT 1`) as {
    code_hash: string
    expires_at: string
    attempts: number
  }[]
  const row = rows[0]
  if (!row) return 'none'
  if (row.attempts >= MAX_ATTEMPTS) return 'too_many_attempts'
  if (Date.parse(row.expires_at) <= Date.now()) {
    await sql`DELETE FROM email_verification_codes WHERE user_id = ${userId}`
    return 'expired'
  }
  const candidate = Buffer.from(hashCode(code.trim()), 'hex')
  const expected = Buffer.from(row.code_hash, 'hex')
  const match = candidate.length === expected.length && timingSafeEqual(candidate, expected)
  if (!match) {
    await sql`UPDATE email_verification_codes SET attempts = attempts + 1 WHERE user_id = ${userId}`
    return row.attempts + 1 >= MAX_ATTEMPTS ? 'too_many_attempts' : 'invalid'
  }
  return 'ok'
}

export async function sendVerificationEmail(to: string, code: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return false
  const from = process.env.RESEND_FROM_EMAIL || 'Kolmari <noreply@kolmari.com>'
  const html = `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
    <h2 style="color:#1b2a4a">Your Kolmari verification code</h2>
    <p>Enter this code to verify your email address:</p>
    <p style="font-size:32px;font-weight:800;letter-spacing:8px;color:#1b2a4a">${code}</p>
    <p style="color:#666;font-size:14px">This code expires in 15 minutes. If you did not create a Kolmari account, ignore this email.</p>
  </div>`
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        subject: 'Your Kolmari verification code',
        html,
        text: `Your Kolmari verification code is ${code}. It expires in 15 minutes.`,
      }),
    })
    return response.ok
  } catch {
    return false
  }
}
