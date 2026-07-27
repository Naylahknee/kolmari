import Link from 'next/link'
import { ArrowRight, BookOpen, MapPin } from 'lucide-react'
import { GREENBOOK_ENTRIES } from '@/lib/greenbook'

export default function GreenbookPage() {
  return (
    <div>
      {/* Page header */}
      <p className="text-xs font-bold uppercase tracking-widest text-teal-deep">Community context</p>
      <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">Greenbook Insights</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
        Practical prompts for researching daily life, neighborhoods, documents, and Community Fit before committing to a Destination.
      </p>

      {/* Provenance legend */}
      <div className="mt-5 flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-canvas px-3 py-1.5 text-xs font-semibold text-muted">
          <span className="size-2 rounded-full bg-teal" aria-hidden="true" /> Editorial context
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-canvas px-3 py-1.5 text-xs font-semibold text-muted">
          <span className="size-2 rounded-full bg-ok" aria-hidden="true" /> Verified resource
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-canvas px-3 py-1.5 text-xs font-semibold text-muted">
          <span className="size-2 rounded-full bg-gold-deep" aria-hidden="true" /> Community-reported experience
        </span>
      </div>

      {/* Planning prompts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {GREENBOOK_ENTRIES.map((entry) => (
          <article key={entry.id} className="card-surface p-6">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-[var(--radius-field)] bg-teal-soft text-teal-deep" aria-hidden="true">
                <MapPin size={16} />
              </span>
              <div>
                <p className="font-semibold text-navy">{entry.location}</p>
                <p className="text-xs text-teal-deep">{entry.context}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">{entry.note}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span key={tag} className="rounded-[var(--radius-pill)] bg-teal-soft px-2.5 py-1 text-xs font-semibold text-teal-deep">
                  {tag}
                </span>
              ))}
            </div>
            {/* Provenance label — every Greenbook item must be labeled */}
            <p className="mt-4 border-t border-line pt-3 text-xs text-muted">
              <span className="font-semibold">Editorial context</span> · {entry.sourceLabel}. Planning guidance only — not a verified member testimonial.
            </p>
          </article>
        ))}
      </div>

      {/* Empty state — community content not yet available */}
      <section className="mt-6 rounded-[var(--radius-card)] border border-line bg-canvas p-6" aria-label="Community-reported experiences">
        <p className="font-semibold text-navy">Community-reported experiences</p>
        <p className="mt-1 text-sm text-muted">
          Verified member stories are not yet available. Kolmari will clearly label each submission as Editorial context, Verified resource, or Community-reported experience before publishing.
        </p>
      </section>

      {/* CTA */}
      <section className="mt-6 rounded-[var(--radius-card)] bg-navy p-7 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <BookOpen className="text-gold" aria-hidden="true" />
          <h2 className="mt-3 text-xl font-bold">Apply context to a specific Destination</h2>
          <p className="mt-2 text-sm text-white/70">Review country details alongside official sources before making a decision.</p>
        </div>
        <Link href="/nexitnation?view=countries" className="gold-button mt-5 shrink-0 sm:mt-0">
          Compare Destinations <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  )
}
