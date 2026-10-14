'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Search } from 'lucide-react'
export type RouteListing = { id: string; name: string; country: string; category: string }

// Only name/country/category are supplied; paywalled facts are never sent here.
export function PathwaysDirectoryPreview({ routes, profileComplete }: { routes: RouteListing[]; profileComplete: boolean }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const categories = useMemo(() => ['All', ...Array.from(new Set(routes.map(r => r.category)))], [routes])
  const shown = useMemo(() => routes
    .filter(r => category === 'All' || r.category === category)
    .filter(r => !query.trim() || `${r.name} ${r.country} ${r.category}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name)),
    [routes, category, query])
  return (
    <section className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-tile">
      <header className="p-5 sm:p-7">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gold-deep">Kolmari · Pathways</p>
        <h1 className="mt-1 text-2xl font-extrabold text-navy sm:text-3xl">Explore relocation pathways</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Search routes by country or pathway type. Full requirements and personalized matching are available with Plus.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[var(--radius-field)] bg-canvas p-3">
          <p className="flex min-w-0 flex-1 items-center gap-2 text-xs text-navy">
            {profileComplete && <CheckCircle2 size={16} className="shrink-0 text-teal-deep" aria-hidden="true" />}
            {profileComplete
              ? 'Profile completed. Plus unlocks your personalized route recommendations.'
              : 'Browsing is available now. Finish your profile when you want tailored recommendations.'}
          </p>
          <Link href={profileComplete ? '/my-plan' : '/profile-wizard'} className="inline-flex min-h-10 items-center gap-1 rounded-[var(--radius-field)] bg-navy px-3 text-xs font-bold text-white hover:bg-navy-deep">
            {profileComplete ? 'My Plan' : 'Complete profile'} <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </header>
      <div className="border-t border-line p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
          <label className="flex min-w-0 items-center gap-2 rounded-[var(--radius-field)] border border-line px-3 py-2">
            <Search size={16} className="shrink-0 text-muted" aria-hidden="true" />
            <span className="sr-only">Search pathways</span>
            <input type="search" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search country, route or type" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          </label>
          <select aria-label="Pathway type" value={category} onChange={e => setCategory(e.target.value)} className="field">
            {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All pathway types' : c}</option>)}
          </select>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted">
          <span role="status">{shown.length} of {routes.length} routes</span>
          {(query || category !== 'All') && <button type="button" onClick={() => {setQuery('');setCategory('All')}} className="font-semibold text-navy hover:underline">Clear filters</button>}
        </div>
        <ul className="mt-3 divide-y divide-line rounded-[var(--radius-field)] border border-line">
          {shown.map(r => <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4">
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-navy">{r.name}</span>
              <span className="mt-0.5 block text-xs text-muted">{r.country} · {r.category}</span>
            </span>
            <span className="rounded-pill bg-canvas px-2.5 py-1 text-[11px] font-semibold text-muted">Research listing</span>
          </li>)}
          {shown.length === 0 && <li className="p-6 text-center text-sm text-muted">No routes match your filters.</li>}
        </ul>
      </div>
    </section>
  )
}
