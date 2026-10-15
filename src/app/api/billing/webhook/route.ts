import 'server-only'

import { NextResponse } from 'next/server'

import { getProfile, saveProfile } from '@/lib/profile'
import { getSubscription, planTierForSubscription, stripeMetadataOf, verifyWebhookSignature } from '@/lib/billing'

export const runtime = 'nodejs'

// Subscription statuses that mean the customer is no longer entitled to a
// paid plan. Everything else (active, trialing) keeps the price-mapped tier;
// an unrecognized status leaves the plan untouched.
const INACTIVE_SUBSCRIPTION_STATUSES = new Set([
  'canceled',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'unpaid',
])

/**
 * Stripe webhook. Signature-verified with Web Crypto; no session cookie needed
 * because Stripe calls this server-to-server.
 *
 * Handled events:
 * - checkout.session.completed: new paid subscription -> set the plan.
 * - customer.subscription.updated: portal upgrades/downgrades change the
 *   price (metadata is stale, so the plan is mapped from the price id);
 *   lapsed/cancelled statuses drop the plan back to free.
 * - invoice.payment_failed: a failed renewal drops the plan to free so a
 *   lapsed card cannot keep premium access. A later successful payment fires
 *   customer.subscription.updated (active), which restores the plan.
 * - customer.subscription.deleted: subscription gone -> free.
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
    } else if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object
      const { userId, plan: metadataPlan } = stripeMetadataOf(subscription)
      // Portal upgrades/downgrades change the price but not the metadata, so
      // the price id is authoritative; metadata is the fallback.
      const plan = planTierForSubscription(subscription) ?? metadataPlan
      const status = typeof subscription.status === 'string' ? subscription.status : ''
      if (userId) {
        const profile = await getProfile(userId)
        if (INACTIVE_SUBSCRIPTION_STATUSES.has(status)) {
          profile.plan = 'free'
          await saveProfile(profile)
        } else if (plan) {
          profile.plan = plan
          await saveProfile(profile)
        }
      }
    } else if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object
      const subscriptionRef = invoice.subscription as unknown
      const subscriptionId =
        typeof subscriptionRef === 'string'
          ? subscriptionRef
          : subscriptionRef && typeof subscriptionRef === 'object' &&
              typeof (subscriptionRef as { id?: unknown }).id === 'string'
            ? (subscriptionRef as { id: string }).id
            : null
      let userId: number | null = null
      try {
        // Invoices do not reliably carry our metadata, so resolve the user
        // from the subscription itself.
        userId = subscriptionId
          ? stripeMetadataOf(await getSubscription(subscriptionId)).userId
          : stripeMetadataOf(invoice).userId
      } catch (error) {
        console.error('Billing webhook: could not resolve failed-invoice user', error)
      }
      if (userId) {
        const profile = await getProfile(userId)
        profile.plan = 'free'
        await saveProfile(profile)
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
