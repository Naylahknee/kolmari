'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import {
  NEWS_READ_EVENT, NEWS_TYPE_LABEL, NEWS_TYPE_STYLE, formatNewsDate, markNewsRead, publishedNews, readNewsIds,
  type NewsItem, type NewsType,
} from '@/lib/news'

const FILTERS: (NewsType | 'all')[] = ['all', 'guide', 'rules', 'fees', 'routes', 'app', 'events']

export function NewsFeed({ savedDestination }: { savedDestination: string | null }) {
  const items = useMemo(() => publishedNews(), [])
  const [filter, setFilter] = useState<NewsType | 'all'>('all')
  const [read, setRead] = useState<Set<string>>(new Set())
  const [open, setOpen] = useState<NewsItem | null>(null)
  const [saved, setSaved] = useState<string[]>(savedDestination ? [savedDestination] : [])

  useEffect(() => {
    const sync = () => setRead(new Set(readNewsIds()))
    sync()
    window.addEventListener(NEWS_READ_EVENT, sync)
    return () => window.removeEventListener(NEWS_READ_EVENT, sync)
  }, [])

  // Saved countries = the plan's destination plus the user's Your World matches.
  useEffect(() => {
    let cancelled = false
    fetch('/api/matches')
      .then((res) => (res.ok ? res.json() : { matches: [] }))
      .then((data) => {
        if (cancelled || !Array.isArray(data.matches)) return
        const names = data.matches.map((m: { name?: string }) => m.name).filter(Boolean) as string[]
        setSaved((prev) => Array.from(new Set([...prev, ...names])))
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const isMine = (i: NewsItem) => !!i.country && saved.includes(i.country)
  const featured = items.find((i) => i.featured)
  const list = items.filter((i) => i !== featured && (filter === 'all' || i.type === filter))
  const mine = list.filter(isMine)
  const rest = list.filter((i) => !isMine(i))
  const showFeatured = featured && (filter === 'all' || filter === featured.type)

  const openItem = (i: NewsItem) => { markNewsRead([i.id]); setOpen(i) }

  return (
    <div className="mx-auto max-w-[980px] space-y-5 pb-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold-deep">Connect</p>
          <h1 className="mt-1 text-[26px] font-bold tracking-[-0.02em] text-navy">News &amp; Guides</h1>
          <p className="mt-1.5 max-w-[62ch] text-[13.5px] leading-[1.6] text-muted">Rule and fee changes, new routes, guides, events and app updates. Items for your saved countries are marked.</p>
        </div>
        <button type="button" onClick={() => markNewsRead(items.map((i) => i.id))} className="shrink-0 whitespace-nowrap rounded-[var(--radius-btn)] border border-line bg-white px-3.5 py-2 text-xs font-bold text-navy hover:bg-canvas">Mark all as read</button>
      </header>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
        {FILTERS.map((f) => (
          <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}
            className={`whitespace-nowrap rounded-pill border px-3.5 py-1.5 text-xs font-semibold transition ${filter === f ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy hover:bg-canvas'}`}>
            {f === 'all' ? 'All' : NEWS_TYPE_LABEL[f]}
          </button>
        ))}
      </div>

      {showFeatured && featured && (
        <Link href={featured.cta?.href ?? '/news'} onClick={() => markNewsRead([featured.id])}
          className="flex flex-wrap items-center gap-5 rounded-[18px] bg-navy-deep px-6 py-6 text-white hover:bg-navy-card"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.07) 1px, transparent 1.4px)', backgroundSize: '22px 22px' }}>
          <div className="min-w-0 flex-1 basis-[360px] space-y-2">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">
              {NEWS_TYPE_LABEL[featured.type]} · For U.S. citizens
              {!read.has(featured.id) && <span className="size-1.5 rounded-full bg-gold" aria-label="Unread" />}
            </p>
            <p className="max-w-[26ch] text-2xl font-bold leading-tight tracking-[-0.015em]">{featured.title}</p>
            <p className="max-w-[56ch] text-[13.5px] leading-relaxed text-[#c8d3e6]">{featured.summary}</p>
          </div>
          <span className="shrink-0 rounded-[10px] bg-gold px-4 py-2.5 text-[13px] font-bold text-navy-deep">{featured.cta?.label ?? 'Read'} →</span>
        </Link>
      )}

      {mine.length > 0 && (
        <section className="space-y-2.5" aria-labelledby="news-mine">
          <h2 id="news-mine" className="text-[13px] font-bold text-navy">For your saved countries <span className="font-medium text-muted">{saved.join(' · ')}</span></h2>
          <NewsList items={mine} read={read} highlight onOpen={openItem} />
        </section>
      )}

      <section className="space-y-2.5" aria-labelledby="news-rest">
        <h2 id="news-rest" className="text-[13px] font-bold text-navy">{mine.length ? 'Everything else' : 'Latest'}</h2>
        {rest.length ? <NewsList items={rest} read={read} onOpen={openItem} /> : (
          <p className="rounded-[var(--radius-card)] border border-line bg-white px-4 py-8 text-center text-sm text-muted">Nothing here yet.</p>
        )}
      </section>

      {open && <NewsDialog item={open} mine={isMine(open)} onClose={() => setOpen(null)} />}
    </div>
  )
}

function NewsList({ items, read, highlight = false, onOpen }: { items: NewsItem[]; read: Set<string>; highlight?: boolean; onOpen: (i: NewsItem) => void }) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-tile">
      {items.map((i) => (
        <li key={i.id}>
          <button type="button" onClick={() => onOpen(i)}
            className={`grid w-full grid-cols-[10px_minmax(0,1fr)_auto] items-start gap-3.5 px-4 py-4 text-left transition ${highlight ? 'bg-[#fffdf4] hover:bg-gold-soft/50' : 'hover:bg-canvas'}`}>
            <span className={`mt-1.5 size-2 rounded-full ${read.has(i.id) ? 'bg-transparent' : 'bg-gold-deep'}`} aria-label={read.has(i.id) ? undefined : 'Unread'} />
            <span className="min-w-0 space-y-1.5">
              <span className="flex flex-wrap items-center gap-2">
                <span className={`rounded-pill px-2.5 py-0.5 text-[11px] font-bold ${NEWS_TYPE_STYLE[i.type]}`}>{NEWS_TYPE_LABEL[i.type]}</span>
                {i.country && (highlight
                  ? <span className="rounded-pill bg-gold-soft px-2.5 py-0.5 text-[11px] font-bold text-navy">{i.country}</span>
                  : <span className="text-[11px] font-semibold text-muted">{i.country}</span>)}
              </span>
              <span className="block text-[14.5px] font-bold leading-snug text-navy">{i.title}</span>
              <span className="block text-[12.5px] leading-relaxed text-muted">{i.summary}</span>
            </span>
            <span className="whitespace-nowrap text-xs text-muted-soft">{formatNewsDate(i.date)}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

function NewsDialog({ item, mine, onClose }: { item: NewsItem; mine: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const el = dialog.current
    el?.showModal()
    return () => { el?.close(); previous?.focus() }
  }, [])
  return (
    <dialog ref={dialog} aria-labelledby="news-dialog-title" onCancel={onClose}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      className="m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-[520px] overflow-y-auto rounded-[16px] border border-line bg-white p-6 text-navy shadow-drawer backdrop:bg-navy-deep/55">
      <div className="flex items-start justify-between gap-3">
        <span className="flex flex-wrap items-center gap-2">
          <span className={`rounded-pill px-2.5 py-0.5 text-[11px] font-bold ${NEWS_TYPE_STYLE[item.type]}`}>{NEWS_TYPE_LABEL[item.type]}</span>
          {item.country && <span className={`rounded-pill px-2.5 py-0.5 text-[11px] font-bold ${mine ? 'bg-gold-soft text-navy' : 'bg-canvas text-muted'}`}>{item.country}</span>}
          <span className="text-xs text-muted-soft">{formatNewsDate(item.date)}</span>
        </span>
        <button type="button" onClick={onClose} aria-label="Close" className="grid size-8 shrink-0 place-items-center rounded-pill bg-canvas hover:bg-line"><X size={16} aria-hidden="true" /></button>
      </div>
      <h2 id="news-dialog-title" className="mt-3 text-[19px] font-bold leading-snug tracking-[-0.01em]">{item.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">{item.body ?? item.summary}</p>
      {mine && <p className="mt-3 rounded-[var(--radius-field)] border border-gold/40 bg-gold-soft/60 px-3.5 py-2.5 text-[13px]">{item.country} is one of your saved countries.</p>}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {item.cta && <Link href={item.cta.href} onClick={onClose} className="inline-flex items-center gap-1.5 rounded-[var(--radius-btn)] bg-navy px-4 py-2.5 text-[13px] font-bold text-white hover:bg-navy-deep">{item.cta.label} <ArrowRight size={14} aria-hidden="true" /></Link>}
        {item.source && <a href={item.source.href} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap text-[12.5px] font-bold text-navy hover:text-gold-deep">{item.source.label} →</a>}
      </div>
    </dialog>
  )
}
