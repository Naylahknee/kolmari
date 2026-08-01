'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, BookOpen, MapPin } from 'lucide-react'
import { GREENBOOK_ENTRIES, PUBLISHED_GREENBOOK_INSIGHTS } from '@/lib/greenbook'

const titleCase = (slug: string) => slug.charAt(0).toUpperCase() + slug.slice(1)

/** The full, interactive Greenbook Insights board (Plus). */
export function GreenbookBoard() {
  const [activeTag, setActiveTag] = useState('All')
  const [lens, setLens] = useState<'general' | 'community'>('general')
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
          Practical prompts for researching daily life, neighborhoods, documents, and Community Fit before committing to a Destination.
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

      <section className="mt-8" aria-label="Community Fit by destination">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-teal-deep">Community Fit</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-navy">By destination</h2>
            <p className="mt-1 max-w-xl text-sm leading-5 text-muted">Hand-curated, source-labeled context. Choose the lens that fits you.</p>
          </div>
          <div className="flex rounded-full border border-line bg-white p-1 text-xs font-bold" role="tablist" aria-label="Insight lens">
            {(['general', 'community'] as const).map((l) => (
              <button
                key={l}
                type="button"
                role="tab"
                aria-selected={lens === l}
                onClick={() => setLens(l)}
                className={`rounded-full px-3 py-1.5 transition ${lens === l ? 'bg-navy text-white' : 'text-muted hover:text-navy'}`}
              >
                {l === 'general' ? 'General' : 'Black travelers'}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {PUBLISHED_GREENBOOK_INSIGHTS.map((it) => {
            const note = lens === 'general' ? it.summary : it.blackTravelerNote
            return (
              <article key={it.countrySlug} className="card-surface flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-navy">{titleCase(it.countrySlug)}</p>
                    <p className="text-xs font-semibold text-teal-deep">{it.communityFit}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ok/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-ok">
                    <i className="size-1.5 rounded-full bg-ok" />Verified resource
                  </span>
                </div>
                {note ? (
                  <p className="mt-3 text-sm leading-6 text-muted">{note}</p>
                ) : (
                  <p className="mt-3 rounded-[var(--radius-field)] bg-canvas px-3 py-2 text-sm text-muted">
                    Black-traveler context for {titleCase(it.countrySlug)} is being verified — we publish it only once it&rsquo;s community-validated, never borrowed from another country.
                  </p>
                )}
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div><p className="font-bold text-navy">Best areas</p><p className="mt-0.5 text-muted">{it.bestAreas.join(', ')}</p></div>
                  <div><p className="font-bold text-navy">Watch areas</p><p className="mt-0.5 text-muted">{it.watchAreas.join(', ')}</p></div>
                </div>
                <a href={it.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-teal-deep hover:underline">
                  {it.sourceTitle} <ArrowRight size={12} />
                </a>
                <p className="mt-1 text-[11px] text-muted">Last reviewed {it.lastReviewed}</p>
              </article>
            )
          })}
        </div>
      </section>

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
            <h2 className="font-display text-xl font-bold">Apply context to a specific Destination</h2>
            <p className="mt-1 text-xs text-white/75">Review country details alongside official sources before making a decision.</p>
          </div>
        </div>
        <Link href="/destinations" className="gold-button mt-5 shrink-0 sm:mt-0">
          Compare Destinations <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  )
}
