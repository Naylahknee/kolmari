import 'server-only'

import { NextResponse } from 'next/server'

import { getProfile, saveProfile } from '@/lib/profile'
import { stripeMetadataOf, verifyWebhookSignature } from '@/lib/billing'

export const runtime = 'nodejs'

/**
 * Stripe webhook. Signature-verified with Web Crypto; no session cookie needed
 * because Stripe calls this server-to-server. Upgrades the user's plan when a
 * checkout completes and downgrades to free when a subscription is cancelled.
 */
export async function POST(request: Request) {
  const rawBody = await request.text()
  const event = await verifyWebhookSignature(rawBody, request.headers.get('stripe-signature'))
  if (!event) return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      if (session.payment_status === 'paid') {
        const { userId, plan } = stripeMetadataOf(session)
        if (userId && plan) {
          const profile = await getProfile(userId)
          profile.plan = plan
          await saveProfile(profile)
        }
      }
    } else if (event.type === 'customer.subscription.deleted') {
      const { userId } = stripeMetadataOf(event.data.object)
      if (userId) {
        const profile = await getProfile(userId)
        profile.plan = 'free'
        await saveProfile(profile)
      }
    }
  } catch (error) {
    console.error('Billing webhook failed', error)
    return NextResponse.json({ error: 'Webhook handling failed.' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
