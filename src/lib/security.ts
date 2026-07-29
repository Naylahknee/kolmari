import 'server-only'

/**
 * Lightweight, dependency-free security helpers for the auth and account
 * route handlers.
 *
 * Notes on the runtime: this app is deployed on Cloudflare Workers via
 * OpenNext. The in-memory rate limiter below is best-effort — its state lives
 * in the module scope of a single Worker isolate and is not shared across
 * isolates or persisted. It meaningfully slows a single attacker hitting one
 * isolate, but it is NOT a substitute for a durable limiter (Cloudflare KV,
 * Durable Objects, or Rate Limiting rules) for production-grade protection.
 * It is intentionally cheap and self-contained so it adds defense-in-depth
 * without new infrastructure.
 */

// ── Origin / CSRF protection ────────────────────────────────────────────────

/**
 * Verify that a state-changing request originated from the same site.
 *
 * The session cookie is `SameSite=Lax`, which already blocks most cross-site
 * cookie delivery, but Lax still allows top-level POST navigations in some
 * flows. Checking the `Origin` (falling back to `Referer`) host against the
 * request host closes the gap for form-style CSRF without needing a token.
 *
 * Returns `true` when the request is same-origin (or when the client sent no
 * Origin/Referer at all, e.g. a same-origin `fetch` in some browsers or a
 * non-browser API client using a bearer token — those are handled by auth).
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const host = request.headers.get('host')
  if (!host) return false

  const source = origin ?? referer
  // No Origin/Referer: allow. Browsers attach Origin to cross-site POSTs, so
  // the dangerous case (a cross-site form/script POST) will have a mismatching
  // Origin and be rejected below. Legitimate bearer-token API clients that omit
  // these headers still pass here and are gated by authentication.
  if (!source) return true

  try {
    return new URL(source).host === host
  } catch {
    return false
  }
}

// ── Best-effort in-memory rate limiter ──────────────────────────────────────

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

// Opportunistic cleanup bound so the map cannot grow without limit inside a
// long-lived isolate.
const MAX_BUCKETS = 10_000

export type RateLimitResult = {
  ok: boolean
  remaining: number
  retryAfterSeconds: number
}

/**
 * Fixed-window rate limit. Returns `ok: false` once `limit` is exceeded within
 * `windowMs`. Caller supplies a stable key (e.g. `login:<ip>`).
 */
export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): RateLimitResult {
  if (buckets.size > MAX_BUCKETS) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k)
  }

  const existing = buckets.get(key)
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 }
  }

  existing.count += 1
  if (existing.count > limit) {
    return { ok: false, remaining: 0, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) }
  }
  return { ok: true, remaining: limit - existing.count, retryAfterSeconds: 0 }
}

/**
 * Best-effort client IP from Cloudflare / proxy headers. Falls back to a
 * constant so the limiter still applies a shared bucket when no IP is present
 * (fail-closed toward throttling rather than disabling the limit entirely).
 */
export function clientIp(request: Request): string {
  const cf = request.headers.get('cf-connecting-ip')
  if (cf) return cf.trim()
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  const real = request.headers.get('x-real-ip')
  if (real) return real.trim()
  return 'unknown'
}
