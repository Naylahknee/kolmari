import Link from 'next/link'
import { ArrowRight, Check, Lock } from 'lucide-react'

/**
 * Consistent "Plus feature" gate for information-heavy pages. Free users see
 * this in place of (or above) the full content, with an honest summary of
 * what Plus unlocks and a single Upgrade CTA. Mirrors the country-page lock
 * treatment (SimpleCountryView) so the whole app upsells the same way.
 *
 * `preview` optionally renders a limited teaser above the gate (e.g. the list
 * of Pathway names) so free users still see what exists — just not the
 * expanded detail.
 */
export function PlusGate({
  eyebrow,
  title,
  description,
  bullets,
  preview,
}: {
  eyebrow: string
  title: string
  description: string
  bullets: string[]
  preview?: React.ReactNode
}) {
  return (
    <div className="space-y-5">
      {preview}
      <section className="relative overflow-hidden rounded-card border border-gold/40 bg-gold-soft/30 p-6 sm:p-8">
        <span className="inline-flex items-center gap-1.5 rounded-pill bg-white px-2.5 py-1 text-xs font-bold text-gold-deep">
          <Lock size={13} aria-hidden="true" /> Plus feature
        </span>
        <p className="mt-3 text-xs font-bold uppercase tracking-widest text-gold-deep">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-bold text-navy sm:text-2xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-navy/80">{description}</p>
        {bullets.length > 0 && (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-navy/85">
                <Check size={16} className="mt-0.5 shrink-0 text-gold-deep" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/coming-soon?feature=plus" className="gold-button">
            Build My Kolmari Plan <ArrowRight size={15} />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 items-center rounded-[var(--radius-btn)] border border-line bg-white px-5 text-sm font-bold text-navy"
          >
            Back to Dashboard
          </Link>
        </div>
      </section>
    </div>
  )
}
