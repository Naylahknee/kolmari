'use client'

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from 'react'
import { ChevronDown, Play } from 'lucide-react'
import { getGreenbookVideos } from '@/lib/greenbook'

type VideoType = 'expert' | 'moving' | 'living'

type Story = {
  id: string
  type: VideoType
  label: string
  country: string
  title: string
  meta: string
  description: string
}

// Ported from the demo World page's `relocationVideos`.
const STORIES: Story[] = [
  { id: 'zGEY0P2-L18', type: 'expert', label: 'Expert Guidance', country: 'Worldwide', title: 'So You Want to Move Abroad?', meta: 'Planning · Black women abroad', description: 'Practical coaching and perspective for women considering a move, sabbatical, or longer life overseas.' },
  { id: 'QHcQPrrO3dk', type: 'expert', label: 'Expert Guidance', country: 'Worldwide', title: 'How to Move Abroad With Kids', meta: 'Family relocation · Children', description: 'Family-centered guidance for preparing children and supporting them through an international transition.' },
  { id: 'UupO6Su1fvM', type: 'expert', label: 'Expert Guidance', country: 'Colombia', title: 'Colombia Relocation Tour', meta: 'Relocation support · Colombia', description: 'A practical look at full-service relocation support and the questions to ask before choosing Colombia.' },
  { id: 'clru0yHZI9o', type: 'moving', label: 'Moving Abroad', country: 'Worldwide', title: 'We Moved Our Family Abroad', meta: 'Family journey · Lessons learned', description: 'A family shares the unexpected moments and practical lessons from making an international move with children.' },
  { id: '3jCn6y5t1so', type: 'moving', label: 'Moving Abroad', country: 'Worldwide', title: 'What We Regret Not Doing Before Moving', meta: 'Family of six · Before the move', description: 'A candid breakdown of what one family wishes they had handled differently before leaving home.' },
  { id: 'WiCW7HACb8Q', type: 'moving', label: 'Moving Abroad', country: 'Portugal', title: 'How Does My Daughter Feel About the Move?', meta: 'Portugal · Family relationships', description: 'A mother and daughter discuss the emotional and practical impact of preparing for a move to Portugal.' },
  { id: 'aa2lL6BGQ3c', type: 'living', label: 'Living Abroad', country: 'Portugal', title: 'We Retired Early in Portugal', meta: 'Black family · Life after the move', description: 'A family shares an inside look at the home and daily life they built after relocating to Portugal.' },
  { id: '6-eewHcvv7w', type: 'living', label: 'Living Abroad', country: 'Panama', title: 'Aisha Moved to Panama', meta: 'Healthcare · Community', description: 'A firsthand conversation about settling in Panama City, finding community, and navigating healthcare.' },
  { id: 'Ef2rwOO_IOQ', type: 'living', label: 'Living Abroad', country: 'Ghana', title: 'How We Moved to Ghana With Family', meta: 'Family · Ghana', description: 'A mother of two explains how her family moved from the United Kingdom to Ghana and what the move required.' },
]

const TABS: Array<{ key: VideoType; label: string }> = [
  { key: 'expert', label: 'Expert Guidance' },
  { key: 'moving', label: 'Moving Abroad' },
  { key: 'living', label: 'Living Abroad' },
]

const BADGE: Record<VideoType, string> = {
  expert: 'bg-[#fbeeb6] text-[#7a5c05]',
  moving: 'bg-[#e3ebf7] text-[#2c4778]',
  living: 'bg-[#dff5f2] text-[#147a74]',
}

const LENS_BADGE: Record<string, string> = {
  Women: 'bg-[#dff5f2] text-[#147a74]',
  'Black travelers': 'bg-navy text-white',
  General: 'bg-[#eef1f5] text-muted',
}

export type StoryCountry = { slug: string; name: string }

type VideoItem = {
  id: string
  badge: string
  badgeClass: string
  country: string
  title: string
  meta: string
  description?: string
}

const LENS_LABEL: Record<string, string> = {
  women: 'Women',
  'black-traveler': 'Black travelers',
  general: 'General',
}

/** Videos for one matched country: demo stories tagged with it plus Kolmari's verified per-country video library. */
function videosForCountry(country: StoryCountry): VideoItem[] {
  const needle = country.name.toLowerCase()
  const seen = new Set<string>()
  const items: VideoItem[] = []
  for (const s of STORIES) {
    if (s.country.toLowerCase() !== needle || seen.has(s.id)) continue
    seen.add(s.id)
    items.push({
      id: s.id,
      badge: s.label,
      badgeClass: BADGE[s.type],
      country: s.country,
      title: s.title,
      meta: s.meta,
      description: s.description,
    })
  }
  for (const v of getGreenbookVideos(country.slug)) {
    if (seen.has(v.id)) continue
    seen.add(v.id)
    const label = LENS_LABEL[v.lens] ?? 'General'
    items.push({
      id: v.id,
      badge: label,
      badgeClass: LENS_BADGE[label] ?? LENS_BADGE.General,
      country: country.name,
      title: v.title,
      meta: v.channel ?? 'YouTube',
    })
  }
  return items
}

function VideoCard({ video }: { video: VideoItem }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-[11px] border border-line bg-white transition hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-card"
    >
      <span className="relative block aspect-video overflow-hidden bg-[#eef1f6]">
        <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
        <span className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,27,57,.42), rgba(13,27,57,0) 55%)' }} />
        <span className="absolute bottom-2.5 left-3 grid size-[34px] place-items-center rounded-full bg-gold text-navy-deep shadow-lg">
          <Play size={16} fill="currentColor" aria-hidden="true" />
        </span>
      </span>
      <span className="flex flex-1 flex-col gap-1.5 px-3.5 pb-3.5 pt-3">
        <span className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2 py-1 text-[9.5px] font-bold uppercase tracking-wider ${video.badgeClass}`}>{video.badge}</span>
          <span className="text-[10.5px] text-muted">{video.country}</span>
        </span>
        <span className="text-sm font-bold leading-snug text-navy">{video.title}</span>
        <span className="text-[11px] font-semibold text-muted">{video.meta}</span>
        {video.description && <span className="text-[11.5px] leading-relaxed text-muted">{video.description}</span>}
      </span>
    </a>
  )
}

function LegacyTabs() {
  const [type, setType] = useState<VideoType>('expert')
  const visible = STORIES.filter((s) => s.type === type)
  return (
    <>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Story categories">
        {TABS.map((tab) => {
          const active = tab.key === type
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setType(tab.key)}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-[11.5px] font-bold transition ${active ? 'border-navy bg-navy text-white' : 'border-line bg-white text-[#5a6a83] hover:border-gold/50'}`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      <div className="mt-4 grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
        {visible.map((s) => (
          <VideoCard
            key={s.id}
            video={{ id: s.id, badge: s.label, badgeClass: BADGE[s.type], country: s.country, title: s.title, meta: s.meta, description: s.description }}
          />
        ))}
      </div>
    </>
  )
}

function CountryTabs({ countries }: { countries: StoryCountry[] }) {
  const [selected, setSelected] = useState(countries[0]!.slug)
  const country = countries.find((c) => c.slug === selected) ?? countries[0]!
  const videos = useMemo(() => videosForCountry(country), [country])

  return (
    <>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter videos by country">
        {countries.map((c) => {
          const active = c.slug === selected
          return (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelected(c.slug)}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-[11.5px] font-bold transition ${active ? 'border-navy bg-navy text-white' : 'border-line bg-white text-[#5a6a83] hover:border-gold/50'}`}
            >
              {c.name}
            </button>
          )
        })}
      </div>
      {videos.length > 0 ? (
        <div className="mt-4 grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
          {videos.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>
      ) : (
        <p className="mt-4 rounded-[var(--radius-card)] border border-dashed border-line-strong bg-canvas p-5 text-sm text-muted">
          Videos for {country.name} are being verified. We publish only real, watchable videos, never placeholders.
        </p>
      )}
    </>
  )
}

export function WorldStories({ countries = [] }: { countries?: StoryCountry[] }) {
  const [open, setOpen] = useState(true)
  const hasCountries = countries.length > 0

  return (
    <section className="mt-8 overflow-hidden rounded-card border border-line bg-white shadow-tile">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center gap-3 px-5 py-4 text-left">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Stories &amp; expert guidance</p>
          <p className="mt-1 text-[15px] font-bold text-navy">Real moves. Real people. Practical help.</p>
          <p className="mt-0.5 text-xs text-muted">
            {hasCountries
              ? 'Videos about your matched destinations, filmed by the people who made the move.'
              : 'Advice from relocation professionals and families who have already made the move.'}
          </p>
        </div>
        <ChevronDown size={18} className={`shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div className="px-5 pb-5">
          {hasCountries ? <CountryTabs countries={countries} /> : <LegacyTabs />}

          <p className="mt-3 text-[10.5px] leading-relaxed text-[#aab4c4]">
            Videos are hosted on YouTube by their respective creators and open in a new tab.
          </p>
        </div>
      )}
    </section>
  )
}
