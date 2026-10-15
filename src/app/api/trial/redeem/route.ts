import { timingSafeEqual } from 'crypto'
import { getRequestUser } from '@/lib/auth'
import { getProfile, saveProfile } from '@/lib/profile'
import { clientIp, isSameOrigin, rateLimit } from '@/lib/security'

/**
 * Free-trial code redemption for first users.
 *
 * Valid codes live in the TRIAL_CODES worker secret (comma-separated, so more
 * codes can be issued later without a deploy). A valid code moves the account
 * to the Plus plan. Codes are compared in constant time and never leave the
 * server: the secret is read here, not in any client bundle.
 */
function configuredCodes(): string[] {
  return (process.env.TRIAL_CODES ?? '')
    .split(',')
    .map((code) => code.trim())
    .filter(Boolean)
}

function codeMatches(input: string, expected: string): boolean {
  const a = Buffer.from(input)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Request blocked.' }, { status: 403 })

  // Cap code-guessing: 10 attempts per 15 minutes per IP.
  const ip = clientIp(request)
  const limit = rateLimit(`trial:${ip}`, 10, 15 * 60 * 1000)
  if (!limit.ok) {
    return Response.json(
      { error: 'Too many attempts. Please wait a few minutes and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Log in to redeem your trial code.' }, { status: 401 })

  const codes = configuredCodes()
  if (codes.length === 0) {
    return Response.json({ error: 'Trial codes are not set up yet. Please check back soon.' }, { status: 503 })
  }

  let raw: unknown
  try {
    raw = (await request.json())?.code
  } catch {
    raw = null
  }
  const input = typeof raw === 'string' ? raw.trim() : ''
  if (!input) return Response.json({ error: 'Enter your trial code.' }, { status: 400 })

  const valid = codes.some((expected) => codeMatches(input, expected))
  if (!valid) {
    return Response.json({ error: 'That code did not work. Check it and try again.' }, { status: 400 })
  }

  try {
    const profile = await getProfile(user.id)
    const wasFree = profile.plan === 'free'
    if (wasFree) {
      profile.plan = 'plus'
      await saveProfile(profile)
    }
    return Response.json({ ok: true, plan: wasFree ? 'plus' : profile.plan })
  } catch (error) {
    console.error('Trial redeem failed', error)
    return Response.json({ error: 'Could not apply your trial. Please try again.' }, { status: 500 })
  }
}
