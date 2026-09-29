import 'server-only'

import { timingSafeEqual } from 'crypto'

import type { PlanTier } from './plan-tiers'
import { absoluteUrl } from './site'

/**
 * Stripe billing over the REST API via fetch (Cloudflare Workers compatible;
 * the Node Stripe SDK is not used). Price IDs and keys come from worker env:
 *
 *   STRIPE_SECRET_KEY            sk_live_... / sk_test_...
 *   STRIPE_WEBHOOK_SECRET        whsec_...
 *   STRIPE_PRICE_PLUS_MONTHLY    price_...
 *   STRIPE_PRICE_PLUS_ANNUAL     price_...
 *   STRIPE_PRICE_NAVIGATOR_MONTHLY price_...
 *   STRIPE_PRICE_NAVIGATOR_ANNUAL  price_...
 *
 * The Kolmari user id travels in Stripe metadata (kolmari_user_id) on the
 * Checkout Session, the Customer, and the Subscription, so the webhook can
 * map events back to a user without any schema change.
 */

export type PaidTier = Extract<PlanTier, 'plus' | 'navigator'>
export type BillingInterval = 'month' | 'year'

const PRICE_ENV: Record<PaidTier, Record<BillingInterval, string>> = {
  plus: { month: 'STRIPE_PRICE_PLUS_MONTHLY', year: 'STRIPE_PRICE_PLUS_ANNUAL' },
  navigator: { month: 'STRIPE_PRICE_NAVIGATOR_MONTHLY', year: 'STRIPE_PRICE_NAVIGATOR_ANNUAL' },
}

export function stripeSecretKey(): string | null {
  return process.env.STRIPE_SECRET_KEY?.trim() || null
}

export function priceIdFor(tier: PaidTier, interval: BillingInterval): string | null {
  return process.env[PRICE_ENV[tier][interval]]?.trim() || null
}

export function isBillingConfigured(): boolean {
  return Boolean(stripeSecretKey())
}

type StripeError = { error?: { message?: string } }

async function stripeFetch(path: string, params: Record<string, string>): Promise<unknown> {
  const secret = stripeSecretKey()
  if (!secret) throw new Error('Stripe is not configured.')
  const res = await fetch(`https://api.stripe.com${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params),
  })
  const data = (await res.json().catch(() => ({}))) as StripeError & Record<string, unknown>
  if (!res.ok) {
    throw new Error(
      typeof data.error?.message === 'string' ? data.error.message : `Stripe request failed (${res.status}).`,
    )
  }
  return data
}

export type CheckoutSession = { id: string; url: string | null }

/** Create a subscription Checkout Session for the given tier/interval. */
export async function createCheckoutSession(
  userId: number,
  tier: PaidTier,
  interval: BillingInterval,
): Promise<CheckoutSession> {
  const price = priceIdFor(tier, interval)
  if (!price) throw new Error('That plan price is not configured yet.')
  const userRef = String(userId)
  const data = (await stripeFetch('/v1/checkout/sessions', {
    mode: 'subscription',
    'line_items[0][price]': price,
    'line_items[0][quantity]': '1',
    success_url: absoluteUrl('/settings?tab=billing&checkout=success'),
    cancel_url: absoluteUrl('/settings?tab=billing&checkout=cancelled'),
    client_reference_id: userRef,
    'metadata[kolmari_user_id]': userRef,
    'metadata[plan]': tier,
    'subscription_data[metadata][kolmari_user_id]': userRef,
    'subscription_data[metadata][plan]': tier,
  })) as CheckoutSession
  if (!data.url) throw new Error('Stripe did not return a checkout URL.')
  return data
}

/** Find the Stripe customer id for a Kolmari user via customer metadata. */
export async function findCustomerId(userId: number): Promise<string | null> {
  const secret = stripeSecretKey()
  if (!secret) return null
  const query = `metadata['kolmari_user_id']:'${String(userId)}'`
  const res = await fetch(`https://api.stripe.com/v1/customers/search?${new URLSearchParams({ query, limit: '1' })}`, {
    headers: { Authorization: `Bearer ${secret}` },
  })
  if (!res.ok) return null
  const data = (await res.json().catch(() => null)) as { data?: { id: string }[] } | null
  return data?.data?.[0]?.id ?? null
}

/** Create a Customer Portal session so paid users can manage/cancel. */
export async function createPortalSession(userId: number): Promise<{ url: string }> {
  const customer = await findCustomerId(userId)
  if (!customer) throw new Error('No subscription found for this account.')
  const data = (await stripeFetch('/v1/billing_portal/sessions', {
    customer,
    return_url: absoluteUrl('/settings?tab=billing'),
  })) as { url?: string }
  if (!data.url) throw new Error('Stripe did not return a portal URL.')
  return { url: data.url }
}

export type WebhookEvent = {
  id: string
  type: string
  data: { object: Record<string, unknown> }
}

const WEBHOOK_TOLERANCE_SECONDS = 300

/**
 * Verify a Stripe webhook signature with Web Crypto (no Node crypto needed).
 * Returns the parsed event, or null when the signature is invalid.
 */
export async function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  now = Date.now(),
): Promise<WebhookEvent | null> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
  if (!secret || !signatureHeader) return null

  const parts = Object.fromEntries(
    signatureHeader.split(',').map((part) => {
      const [k, v] = part.split('=')
      return [k, v]
    }),
  )
  const timestamp = parts.t
  const expectedHex = parts.v1
  if (!timestamp || !expectedHex || !/^[0-9a-fA-F]+$/.test(expectedHex)) return null
  if (Math.abs(now / 1000 - Number(timestamp)) > WEBHOOK_TOLERANCE_SECONDS) return null

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${rawBody}`))
  const actual = Buffer.from(signature)
  const expected = Buffer.from(expectedHex, 'hex')
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null

  try {
    return JSON.parse(rawBody) as WebhookEvent
  } catch {
    return null
  }
}

/** Extract the Kolmari user id + plan from a Stripe object's metadata. */
export function stripeMetadataOf(object: Record<string, unknown>): { userId: number | null; plan: PaidTier | null } {
  const metadata = (object.metadata ?? {}) as Record<string, unknown>
  const rawId = typeof metadata.kolmari_user_id === 'string' ? Number(metadata.kolmari_user_id) : NaN
  const userId = Number.isInteger(rawId) && rawId > 0 ? rawId : null
  const plan = metadata.plan === 'plus' || metadata.plan === 'navigator' ? metadata.plan : null
  return { userId, plan }
}
