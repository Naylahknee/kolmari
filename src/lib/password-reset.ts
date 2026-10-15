import { createHash, randomInt, timingSafeEqual } from 'node:crypto'
import { getSql } from './db'
import { isDemoEmail } from './demo-identity'

// Code-based password reset, mirroring the email-verification design in
// ./verification.ts. The request endpoint never reveals whether an email has
// an account: it always answers { ok: true }.
// - Codes are crypto-random; only a SHA-256 hash is stored, never the code.
// - Single active code per user, 15-minute expiry, dead after 5 wrong guesses.
// - 60-second cooldown between sends; per-IP rate limits on the API routes.
// - A successful reset revokes every session (see revokeAllSessions).
// - Inert until RESEND_API_KEY is set, like verification.

const CODE_TTL_MS = 15 * 60 * 1000
const RESEND_COOLDOWN_MS = 60 * 1000
const MAX_ATTEMPTS = 5

export function isPasswordResetEnabled(): boolean {
  return !!process.env.RESEND_API_KEY
}

let resetTablesReady: Promise<void> | null = null
export function ensurePasswordResetTables() {
  if (!resetTablesReady) {
    resetTablesReady = (async () => {
      const sql = getSql()
      await sql`
        CREATE TABLE IF NOT EXISTS password_reset_codes (
          user_id INTEGER PRIMARY KEY,
          code_hash TEXT NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL,
          attempts INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
    })().catch((error) => {
      resetTablesReady = null
      throw error
    })
  }
  return resetTablesReady
}

function hashCode(code: string): string {
  return createHash('sha256').update(code, 'utf8').digest('hex')
}

/** Issues (or re-issues) a code. Returns null when the resend cooldown is active. */
export async function issuePasswordResetCode(userId: number): Promise<{ code: string } | null> {
  const sql = getSql()
  await ensurePasswordResetTables()
  const existing = (await sql`SELECT created_at FROM password_reset_codes WHERE user_id = ${userId} LIMIT 1`) as {
    created_at: string
  }[]
  if (existing[0] && Date.now() - Date.parse(existing[0].created_at) < RESEND_COOLDOWN_MS) {
    return null
  }
  const code = String(randomInt(100000, 1000000))
  const expiresAt = new Date(Date.now() + CODE_TTL_MS).toISOString()
  await sql`
    INSERT INTO password_reset_codes (user_id, code_hash, expires_at, attempts)
    VALUES (${userId}, ${hashCode(code)}, ${expiresAt}, 0)
    ON CONFLICT (user_id) DO UPDATE SET
      code_hash = EXCLUDED.code_hash,
      expires_at = EXCLUDED.expires_at,
      attempts = 0,
      created_at = NOW()
  `
  return { code }
}

export type ResetCodeCheck = 'ok' | 'invalid' | 'expired' | 'too_many_attempts' | 'none'

export async function checkPasswordResetCode(userId: number, code: string): Promise<ResetCodeCheck> {
  const sql = getSql()
  await ensurePasswordResetTables()
  const rows = (await sql`SELECT code_hash, expires_at, attempts FROM password_reset_codes WHERE user_id = ${userId} LIMIT 1`) as {
    code_hash: string
    expires_at: string
    attempts: number
  }[]
  const row = rows[0]
  if (!row) return 'none'
  if (row.attempts >= MAX_ATTEMPTS) return 'too_many_attempts'
  if (Date.parse(row.expires_at) <= Date.now()) {
    await sql`DELETE FROM password_reset_codes WHERE user_id = ${userId}`
    return 'expired'
  }
  const candidate = Buffer.from(hashCode(code.trim()), 'hex')
  const expected = Buffer.from(row.code_hash, 'hex')
  const match = candidate.length === expected.length && timingSafeEqual(candidate, expected)
  if (!match) {
    await sql`UPDATE password_reset_codes SET attempts = attempts + 1 WHERE user_id = ${userId}`
    return row.attempts + 1 >= MAX_ATTEMPTS ? 'too_many_attempts' : 'invalid'
  }
  return 'ok'
}

export async function clearPasswordResetCode(userId: number): Promise<void> {
  const sql = getSql()
  await ensurePasswordResetTables()
  await sql`DELETE FROM password_reset_codes WHERE user_id = ${userId}`
}

export async function sendPasswordResetEmail(to: string, code: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return false
  const from = process.env.RESEND_FROM_EMAIL || 'Kolmari <noreply@kolmari.com>'
  const html = `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
    <h2 style="color:#1b2a4a">Reset your Kolmari password</h2>
    <p>Enter this code to choose a new password:</p>
    <p style="font-size:32px;font-weight:800;letter-spacing:8px;color:#1b2a4a">${code}</p>
    <p style="color:#666;font-size:14px">This code expires in 15 minutes. If you did not ask to reset your password, ignore this email — your password stays the same.</p>
  </div>`
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        subject: 'Reset your Kolmari password',
        html,
        text: `Your Kolmari password-reset code is ${code}. It expires in 15 minutes. If you did not ask for this, ignore this email.`,
      }),
    })
    return response.ok
  } catch {
    return false
  }
}

/** The demo account can never receive a reset code (shared account). */
export function resetAllowedForEmail(email: string): boolean {
  return !isDemoEmail(email)
}
