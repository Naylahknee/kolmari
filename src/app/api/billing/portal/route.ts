import 'server-only'

import { NextResponse } from 'next/server'

import { getRequestUser } from '@/lib/auth'
import { isSameOrigin } from '@/lib/security'
import { createPortalSession, isBillingConfigured } from '@/lib/billing'

export const runtime = 'nodejs'

/**
 * Open Stripe's Customer Portal so paid users can update their card or cancel.
 * The customer is found via the kolmari_user_id metadata set at checkout.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Request blocked.' }, { status: 403 })
  const user = await getRequestUser(request)
  if (!user) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 })
  if (!isBillingConfigured()) {
    return NextResponse.json({ error: 'Billing is not set up yet. Please check back soon.' }, { status: 503 })
  }

  try {
    const session = await createPortalSession(user.id)
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Portal failed', error)
    const message = error instanceof Error ? error.message : 'Could not open billing settings.'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
