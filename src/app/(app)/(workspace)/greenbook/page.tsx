'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, BookOpen, MapPin } from 'lucide-react'
import { GREENBOOK_ENTRIES } from '@/lib/greenbook'

export default function GreenbookPage() {
  const [activeTag, setActiveTag] = useState('All')
  const tags = useMemo(() => {
    const counts = new Map<string, number>()
    GREENBOOK_ENTRIES.forEach((entry) => entry.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)))
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [])
  const entries = activeTag === 'All'
    ? GREENBOOK_ENTRIES
    : GREENBOOK_ENTRIES.filter((entry) => entry.tags.includes(activeTag))

  return (
    <div className="mx-auto max-w-[1280px] pb-2">
      <div className="border-t-2 border-teal pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-teal-deep">Community context</p>
        <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-navy sm:text-4xl">Greenbook Insights</h1>
        <p className="mt-1 max-w-xl text-sm leading-5 text-muted">
          Practical prompts for researching daily life, neighborhoods, documents, and Community Fit before committing to a Nextination.
        </p>
      </div>

      <section className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-[var(--radius-card)] border border-line bg-white px-4 py-3 text-xs" aria-label="Source key">
        <span className="mr-1 text-[10px] font-bold uppercase tracking-[.16em] text-muted">Source key</span>
        <span className="inline-flex items-center gap-2 font-semibold text-navy"><i className="size-2 rounded-full bg-teal" />Editorial context</span>
        <span className="inline-flex items-center gap-2 font-semibold text-navy"><i className="size-2 rounded-full bg-ok" />Verified resource</span>
        <span className="inline-flex items-center gap-2 font-semibold text-navy"><i className="size-2 rounded-full bg-gold" />Community-reported</span>
      </section>

      <nav className="mt-5 flex flex-wrap gap-2" aria-label="Filter Greenbook insights">
        <button
          type="button"
          onClick={() => setActiveTag('All')}
          className={`rounded-full border px-4 py-2 text-xs font-bold transition ${activeTag === 'All' ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy hover:border-navy/30'}`}
        >
          All <span className="opacity-60">{GREENBOOK_ENTRIES.length}</span>
        </button>
        {tags.map(([tag, count]) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${activeTag === tag ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy hover:border-navy/30'}`}
          >
            {tag} <span className="opacity-60">{count}</span>
          </button>
        ))}
      </nav>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {entries.map((entry) => (
          <article key={entry.id} className="card-surface flex min-h-48 flex-col p-5">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-teal-deep" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-navy">{entry.location}</p>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-canvas px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-muted">
                    <i className="size-1.5 rounded-full bg-teal" />Editorial
                  </span>
                </div>
                <p className="text-xs text-teal-deep">{entry.context}</p>
              </div>
            </div>
            <p className="mt-4 flex-1 text-sm leading-6 text-muted">{entry.note}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className="rounded-full bg-teal-soft px-2.5 py-1 text-[11px] font-semibold text-teal-deep"
                >
                  {tag}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>

      <section className="mt-6 rounded-[var(--radius-card)] border border-dashed border-line-strong bg-white p-6" aria-label="Community-reported experiences">
        <p className="font-display text-lg font-bold text-navy">Community-reported experiences</p>
        <p className="mt-1 max-w-2xl text-sm leading-5 text-muted">
          Verified member stories are not yet available. Every submission will be labeled Editorial context, Verified resource, or Community-reported experience before it is published, using the key above.
        </p>
      </section>

      <section className="mt-6 rounded-[var(--radius-card)] bg-[#1d3969] px-6 py-5 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-start gap-4">
          <BookOpen size={20} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
          <div>
            <h2 className="font-display text-xl font-bold">Apply context to a specific Nextination</h2>
            <p className="mt-1 text-xs text-white/75">Review country details alongside official sources before making a decision.</p>
          </div>
        </div>
        <Link href="/countries" className="gold-button mt-5 shrink-0 sm:mt-0">
          Compare Nextinations <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  )
}
