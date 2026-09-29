import 'server-only'

import { NextResponse } from 'next/server'

import { getRequestUser } from '@/lib/auth'
import { isSameOrigin } from '@/lib/security'
import {
  createCheckoutSession,
  isBillingConfigured,
  type BillingInterval,
  type PaidTier,
} from '@/lib/billing'

export const runtime = 'nodejs'

/**
 * Start a Stripe Checkout Session for a paid tier. The user is sent to
 * Stripe's hosted checkout; the webhook upgrades their plan on success.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Request blocked.' }, { status: 403 })
  const user = await getRequestUser(request)
  if (!user) return NextResponse.json({ error: 'Please sign in to upgrade.' }, { status: 401 })
  if (!isBillingConfigured()) {
    return NextResponse.json({ error: 'Paid checkout is not set up yet. Please check back soon.' }, { status: 503 })
  }

  const body = (await request.json().catch(() => null)) as { tier?: unknown; interval?: unknown } | null
  const tier = body?.tier
  const interval = body?.interval ?? 'month'
  if (tier !== 'plus' && tier !== 'navigator') {
    return NextResponse.json({ error: 'Choose a plan to continue.' }, { status: 400 })
  }
  if (interval !== 'month' && interval !== 'year') {
    return NextResponse.json({ error: 'Choose monthly or annual billing.' }, { status: 400 })
  }

  try {
    const session = await createCheckoutSession(user.id, tier as PaidTier, interval as BillingInterval)
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout failed', error)
    return NextResponse.json({ error: 'Could not start checkout. Please try again.' }, { status: 502 })
  }
}
