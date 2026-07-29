import Link from 'next/link'
import { Zap } from 'lucide-react'

/**
 * KlubHeader — page header for the Kolmari Klub community page.
 * Server-safe: no client state.
 */
export function KlubHeader() {
  return (
    <header>
      <p className="text-xs font-bold uppercase tracking-widest text-teal-deep">Community</p>
      <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">Kolmari Klub</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
        Connect with people planning real international moves, share practical notes, and build your move plan with better context.
      </p>
    </header>
  )
}

/**
 * KlubEmptyState — honest state shown until community features are ready.
 */
export function KlubEmptyState() {
  return (
    <section className="mt-6 overflow-hidden rounded-[var(--radius-card)] border border-line bg-white p-7">
      <Zap size={28} className="text-teal" aria-hidden="true" />
      <h2 className="mt-4 text-lg font-bold text-navy">Kolmari Klub is coming.</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        Moderated member discussions, destination-specific conversations, and verified relocation notes are in development.
        Until moderation and verification are ready, Kolmari clearly labels editorial planning prompts and sourced insights.
      </p>
      <p className="mt-4 text-sm leading-6 text-muted">
        In the meantime, use Greenbook Insights for sourced planning context and the Destinations map to explore places.
      </p>
      <Link
        href="/signup?next=%2Fcommunity"
        className="gold-button mt-6 inline-flex items-center gap-2"
      >
        Join the waitlist
      </Link>
    </section>
  )
}
