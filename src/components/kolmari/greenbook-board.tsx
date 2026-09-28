'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Play } from 'lucide-react'
import {
  GREENBOOK_COUNTRIES,
  GREENBOOK_GLOBAL_URL,
  PUBLISHED_GREENBOOK_INSIGHTS,
  getGreenbookReviews,
  getGreenbookThreads,
  getGreenbookVideos,
  greenbookCountryMeta,
  type GreenbookCountryMeta,
  type GreenbookReview,
  type GreenbookThread,
  type GreenbookVideo,
  type ReviewLens,
  type VideoLens,
} from '@/lib/greenbook'
import { COUNTRIES, getDiscoverableCountry } from '@/lib/countries'

const LENS_LABEL: Record<VideoLens | ReviewLens, string> = {
  women: 'Women',
  'black-traveler': 'Black travelers',
  general: 'General',
}

function countryMeta(slug: string): GreenbookCountryMeta {
  const covered = GREENBOOK_COUNTRIES.find((c) => c.slug === slug)
  if (covered) return covered
  const detail = COUNTRIES.find((c) => c.slug === slug) ?? getDiscoverableCountry(slug)
  if (detail) return { slug, name: detail.name, code: detail.code }
  return greenbookCountryMeta(slug)
}

function hasCountryPage(slug: string) {
  return COUNTRIES.some((c) => c.slug === slug) || getDiscoverableCountry(slug) != null
}

function LensPill({ lens }: { lens: VideoLens | ReviewLens }) {
  const styles =
    lens === 'women'
      ? 'bg-teal-soft text-teal-deep'
      : lens === 'black-traveler'
        ? 'bg-navy text-white'
        : 'bg-canvas text-muted'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${styles}`}>
      {LENS_LABEL[lens]}
    </span>
  )
}

function VideoCard({ video }: { video: GreenbookVideo }) {
  const [playing, setPlaying] = useState(false)
  return (
    <article className="card-surface overflow-hidden">
      {playing ? (
        <div className="aspect-video w-full bg-navy-deep">
          <iframe
            className="size-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group relative block aspect-video w-full overflow-hidden bg-navy-deep text-left"
          aria-label={`Play video: ${video.title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="size-full object-cover transition group-hover:scale-[1.02]"
          />
          <span className="absolute inset-0 bg-navy-deep/25 transition group-hover:bg-navy-deep/10" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-14 place-items-center rounded-full bg-white/95 shadow-card transition group-hover:scale-105">
              <Play size={22} className="ml-0.5 text-navy" fill="currentColor" aria-hidden="true" />
            </span>
          </span>
          <span className="absolute bottom-2 right-2 rounded bg-navy-deep/80 px-1.5 py-0.5 text-[10px] font-bold text-white">YouTube</span>
        </button>
      )}
      <div className="p-4">
        <div className="mb-2"><LensPill lens={video.lens} /></div>
        <p className="text-sm font-bold leading-5 text-navy">{video.title}</p>
        {video.channel && <p className="mt-1 text-xs text-muted">{video.channel}</p>}
        <a
          href={video.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-teal-deep hover:underline"
        >
          Watch on YouTube <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </div>
    </article>
  )
}

function ReviewCard({ review }: { review: GreenbookReview }) {
  return (
    <article className="card-surface flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-navy">{review.place}</p>
          <div className="mt-1.5"><LensPill lens={review.lens} /></div>
        </div>
      </div>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted">{review.summary}</p>
      <a
        href={review.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-teal-deep hover:underline"
      >
        {review.sourceTitle} <ArrowUpRight size={12} aria-hidden="true" />
      </a>
      <p className="mt-1 text-[11px] text-muted">Last reviewed {review.lastReviewed}</p>
    </article>
  )
}

function ThreadCard({ thread }: { thread: GreenbookThread }) {
  return (
    <article className="card-surface flex flex-col p-5">
      <a
        href={thread.authorUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-bold text-navy hover:underline"
      >
        Thread hosted by {thread.author}
      </a>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted">{thread.summary}</p>
      <p className="mt-3 text-[11px] font-semibold text-muted">{thread.engagement} · Posted {thread.postedAt}</p>
      <a
        href={thread.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-teal-deep hover:underline"
      >
        Open the source thread <ArrowUpRight size={12} aria-hidden="true" />
      </a>
    </article>
  )
}

/** The full, interactive Greenbook board (Plus): videos, reviews, and threads per selected country. */
export function GreenbookBoard({ countries }: { countries: string[] }) {
  const metas = useMemo(() => countries.map(countryMeta), [countries])
  const [selected, setSelected] = useState<string[]>(countries)
  const [reviewLens, setReviewLens] = useState<'all' | ReviewLens>('all')
  const [insightLens, setInsightLens] = useState<'general' | 'community'>('general')

  const toggleCountry = (slug: string) =>
    setSelected((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]))

  const selectedMetas = metas.filter((m) => selected.includes(m.slug))
  const threads = selected.flatMap(getGreenbookThreads)

  return (
    <div className="mx-auto max-w-[1280px] pb-2">
      {/* Preview banner */}
      <div className="flex items-center gap-3 rounded-[var(--radius-card)] bg-navy-deep px-4 py-2.5">
        <span className="rounded bg-gold px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-navy-deep">Preview</span>
        <p className="text-xs font-semibold text-white/85">A working preview of Kolmari. The real product isn&apos;t launched yet.</p>
      </div>

      {/* Header */}
      <div className="mt-6">
        <Link href="/command-center" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-navy">
          <ArrowLeft size={14} aria-hidden="true" /> Back to dashboard
        </Link>
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[.18em] text-gold-deep">Greenbook</p>
        <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-navy sm:text-4xl">Research before you commit</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Your Greenbook pulls videos, community reviews, and real conversations for the countries in your match set.
          Pick a country below to filter everything on this page.
        </p>
      </div>

      {/* Country selector */}
      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by country">
        {metas.map((meta) => {
          const active = selected.includes(meta.slug)
          return (
            <button
              key={meta.slug}
              type="button"
              onClick={() => toggleCountry(meta.slug)}
              aria-pressed={active}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition ${
                active ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy hover:border-navy/30'
              }`}
            >
              {meta.code && (
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold ${active ? 'bg-gold text-navy-deep' : 'bg-gold-soft text-gold-deep'}`}>
                  {meta.code}
                </span>
              )}
              {meta.name}
            </button>
          )
        })}
      </div>

      {/* Matched-country research panel */}
      <section className="mt-6 rounded-[24px] bg-navy-deep p-6 sm:p-8" aria-label="Matched-country research">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-gold">Matched-country research</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-white">Passport Index for your matches</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Open the country page for every destination in your current match set. These links update from the
              matched-country list used by this page.
            </p>
          </div>
          <span className="rounded-full bg-gold px-3 py-1.5 text-xs font-extrabold text-navy-deep">
            {selectedMetas.length} {selectedMetas.length === 1 ? 'match' : 'matches'}
          </span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {selectedMetas.map((meta) => {
            const page = hasCountryPage(meta.slug)
            const card = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {meta.code && (
                      <span className="inline-block rounded bg-gold px-2 py-0.5 text-[11px] font-extrabold text-navy-deep">{meta.code}</span>
                    )}
                    <p className="mt-2 font-display text-lg font-bold text-white">{meta.name}</p>
                    <p className="mt-0.5 text-xs text-white/60">
                      {page ? 'Passport Index country page' : 'Full country page coming soon'}
                    </p>
                  </div>
                  {page && <ArrowUpRight size={18} className="shrink-0 text-gold" aria-hidden="true" />}
                </div>
              </>
            )
            const classes = 'rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-gold/40 hover:bg-white/10'
            return page ? (
              <Link key={meta.slug} href={`/nextinations/${meta.slug}/v2/overview`} className={classes}>
                {card}
              </Link>
            ) : (
              <div key={meta.slug} className={classes}>
                {card}
              </div>
            )
          })}
        </div>
      </section>

      {/* Videos */}
      <section className="mt-10" aria-label="Videos by country">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-teal-deep">From YouTube</p>
        <h2 className="mt-1 font-display text-2xl font-bold text-navy">Watch before you go</h2>
        <p className="mt-1 max-w-xl text-sm leading-5 text-muted">Videos about real moves, filmed by the people who made them.</p>
        {selectedMetas.map((meta) => {
          const videos = getGreenbookVideos(meta.slug)
          return (
            <div key={meta.slug} className="mt-6">
              <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-navy">
                {meta.code && <span className="rounded bg-gold-soft px-1.5 py-0.5 text-[10px] text-gold-deep">{meta.code}</span>}
                {meta.name}
              </h3>
              {videos.length > 0 ? (
                <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {videos.map((video) => <VideoCard key={video.id} video={video} />)}
                </div>
              ) : (
                <p className="mt-3 rounded-[var(--radius-card)] border border-dashed border-line-strong bg-white p-5 text-sm text-muted">
                  Videos for {meta.name} are being verified. We publish only real, watchable videos, never placeholders.
                </p>
              )}
            </div>
          )
        })}
      </section>

      {/* Reviews */}
      <section className="mt-10" aria-label="Community reviews">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-teal-deep">Community reviews</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-navy">What women and Black travelers report</h2>
            <p className="mt-1 max-w-xl text-sm leading-5 text-muted">
              Source-labeled reviews and guides from around the internet. Summaries are editorial; every card links to the original.
            </p>
          </div>
          <div className="flex rounded-full border border-line bg-white p-1 text-xs font-bold" role="tablist" aria-label="Review lens">
            {(['all', 'women', 'black-traveler'] as const).map((l) => (
              <button
                key={l}
                type="button"
                role="tab"
                aria-selected={reviewLens === l}
                onClick={() => setReviewLens(l)}
                className={`rounded-full px-3 py-1.5 transition ${reviewLens === l ? 'bg-navy text-white' : 'text-muted hover:text-navy'}`}
              >
                {l === 'all' ? 'All' : LENS_LABEL[l]}
              </button>
            ))}
          </div>
        </div>
        {selectedMetas.map((meta) => {
          const reviews = getGreenbookReviews(meta.slug).filter((r) => reviewLens === 'all' || r.lens === reviewLens)
          if (reviews.length === 0) return null
          return (
            <div key={meta.slug} className="mt-6">
              <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-navy">
                {meta.code && <span className="rounded bg-gold-soft px-1.5 py-0.5 text-[10px] text-gold-deep">{meta.code}</span>}
                {meta.name}
              </h3>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
              </div>
            </div>
          )
        })}
        {/* Green Book Global */}
        <article className="mt-6 rounded-[24px] bg-navy-deep p-6 sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-gold">Black traveler reviews</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-white">Green Book Global</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
            The first Black traveler review website and mobile app: community-generated Traveling While Black reviews
            that score destinations on candid experiences and hospitality.
          </p>
          <a href={GREENBOOK_GLOBAL_URL} target="_blank" rel="noopener noreferrer" className="gold-button mt-5 inline-flex">
            Explore Green Book Global <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </article>
      </section>

      {/* Threads */}
      {threads.length > 0 && (
        <section className="mt-10" aria-label="Relocation conversations">
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-teal-deep">From the internet</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-navy">Relocation conversations on Threads</h2>
          <p className="mt-1 max-w-xl text-sm leading-5 text-muted">
            Public posts connected to your matched destinations. Open the source thread for the full conversation and context.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {threads.map((thread) => <ThreadCard key={thread.id} thread={thread} />)}
          </div>
        </section>
      )}

      {/* Community Fit by destination (published insights) */}
      <section className="mt-10" aria-label="Community Fit by destination">
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
                aria-selected={insightLens === l}
                onClick={() => setInsightLens(l)}
                className={`rounded-full px-3 py-1.5 transition ${insightLens === l ? 'bg-navy text-white' : 'text-muted hover:text-navy'}`}
              >
                {l === 'general' ? 'General' : 'Black travelers'}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {PUBLISHED_GREENBOOK_INSIGHTS.map((it) => {
            const note = insightLens === 'general' ? it.summary : it.blackTravelerNote
            const title = countryMeta(it.countrySlug).name
            return (
              <article key={it.countrySlug} className="card-surface flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-navy">{title}</p>
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
                    Black-traveler context for {title} is being verified. We publish it only once it&apos;s community-validated, never borrowed from another country.
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

      {/* Bottom CTA */}
      <section className="mt-8 rounded-[var(--radius-card)] bg-[#1d3969] px-6 py-5 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
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
