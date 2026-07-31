import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Coming soon — Kolmari',
  description: 'Kolmari is launching free. Paid plans and Kolmari Concierge are on the way.',
}

// Honest coming-soon state for features that are not purchasable yet. Kolmari is
// launching free-tier only (no payment provider wired), so every "upgrade" /
// paid CTA routes here instead of into a dead-end checkout. `?feature=` tailors
// the copy; anything unknown falls back to the general Plus message.
const COPY: Record<string, { heading: string; body: string }> = {
  plus: {
    heading: 'Kolmari Plus is coming soon',
    body: 'The full research experience — verified visa requirements and thresholds, cost breakdowns, your Match Score, and a step-by-step Kolmari Plan — is on the way. Kolmari is launching free while we finish it, so nothing is behind a paywall yet.',
  },
  concierge: {
    heading: 'Kolmari Concierge is coming soon',
    body: 'A guided plan review with a relocation expert — community and guidance, not legal advice. We are setting up expert matching and booking now, so it is not available to purchase yet.',
  },
}

export default async function ComingSoonPage({
  searchParams,
}: {
  searchParams: Promise<{ feature?: string }>
}) {
  const feature = (await searchParams).feature
  const copy = (feature && COPY[feature]) || COPY.plus

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
      <span className="inline-flex items-center gap-1.5 rounded-pill bg-gold-soft px-3 py-1 text-xs font-bold uppercase tracking-widest text-gold-deep">
        <Sparkles size={13} aria-hidden="true" /> Coming soon
      </span>
      <h1 className="mt-4 text-3xl font-extrabold text-navy sm:text-4xl">{copy.heading}</h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-muted">{copy.body}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/dashboard" className="gold-button">
          Back to Dashboard
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-btn)] border border-line bg-white px-5 text-sm font-bold text-navy"
        >
          <ArrowLeft size={15} /> Back home
        </Link>
      </div>
    </main>
  )
}
