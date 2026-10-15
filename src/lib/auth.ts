import 'server-only'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { SESSION_COOKIE, TOKEN_AUDIENCE, TOKEN_ISSUER } from './auth-constants'
import { getSql } from './db'

export { SESSION_COOKIE } from './auth-constants'

export type SessionUser = { id: number; email: string }

// ── Global session revocation ("sign out of all devices") ──────────────────
// Stateless JWTs cannot be enumerated, so revocation is a per-user cutoff
// timestamp: any token issued at or before `sessions_revoked_at` is rejected.
// The column defaults to NULL (no revocation), so existing sessions are
// unaffected until the user actually uses "sign out of all devices" or
// changes their password. Fail-open: if the DB is unreachable, sessions are
// allowed rather than locking every user out.

let revocationColumnReady: Promise<void> | null = null

async function ensureRevocationColumn() {
  if (!revocationColumnReady) {
    revocationColumnReady = (async () => {
      const sql = getSql()
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS sessions_revoked_at TIMESTAMPTZ`
    })().catch((error) => {
      revocationColumnReady = null
      throw error
    })
  }
  await revocationColumnReady
}

async function sessionsRevokedAtMs(userId: number): Promise<number | null> {
  try {
    await ensureRevocationColumn()
    const sql = getSql()
    const rows = (await sql`SELECT sessions_revoked_at FROM users WHERE id = ${userId} LIMIT 1`) as {
      sessions_revoked_at?: string | null
    }[]
    // No user row (deleted account): revoke everything. A DB error (missing
    // table/column, unreachable database) fails open to null instead, so auth
    // never locks every user out.
    if (!rows[0]) return Date.now()
    const raw = rows[0].sessions_revoked_at
    return raw ? Date.parse(raw) : null
  } catch {
    return null
  }
}

async function isTokenRevoked(payload: JWTPayload, userId: number): Promise<boolean> {
  const issuedAtMs = typeof payload.iat === 'number' ? payload.iat * 1000 : null
  if (issuedAtMs === null) return false
  const revokedAtMs = await sessionsRevokedAtMs(userId)
  if (revokedAtMs === null) return false
  // 1s grace so a token minted in the same second as the revocation click
  // (e.g. an immediate re-login) is not rejected.
  return issuedAtMs < revokedAtMs - 1000
}

/**
 * Invalidate every session for the user. Called by "sign out of all devices"
 * and by password changes/resets. Never throws — revocation is best-effort
 * and the caller's cookie is always cleared regardless.
 */
export async function revokeAllSessions(userId: number): Promise<void> {
  try {
    await ensureRevocationColumn()
    const sql = getSql()
    await sql`UPDATE users SET sessions_revoked_at = NOW() WHERE id = ${userId}`
  } catch (error) {
    console.error('Failed to revoke sessions', error)
  }
}

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) throw new Error('JWT_SECRET must be at least 32 characters')
  return new TextEncoder().encode(secret)
}

export async function createToken(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(TOKEN_ISSUER)
    .setAudience(TOKEN_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret())
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret(), {
    algorithms: ['HS256'],
    issuer: TOKEN_ISSUER,
    audience: TOKEN_AUDIENCE,
  })
  return payload
}

function toSessionUser(payload: JWTPayload): SessionUser | null {
  const id = Number(payload.sub)
  const email = typeof payload.email === 'string' ? payload.email : ''
  return Number.isInteger(id) && id > 0 && email ? { id, email } : null
}

export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null
  try {
    const payload = await verifyToken(token)
    const user = toSessionUser(payload)
    if (!user) return null
    if (await isTokenRevoked(payload, user.id)) return null
    return user
  } catch {
    return null
  }
}

export async function requireCurrentUser() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

export async function getRequestUser(request: Request) {
  const authorization = request.headers.get('authorization')
  const bearer = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined
  const cookieToken = request.headers.get('cookie')?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1)
  const token = bearer ?? cookieToken
  if (!token) return null
  try {
    const payload = await verifyToken(token)
    const user = toSessionUser(payload)
    if (!user) return null
    if (await isTokenRevoked(payload, user.id)) return null
    return user
  } catch {
    return null
  }
}
