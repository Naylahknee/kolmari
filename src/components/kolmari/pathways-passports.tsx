'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Search } from 'lucide-react'
import { PASSPORTS, PASSPORT_CODES, PASSPORT_META, decodeRequirement, REQUIREMENT_LABEL, type RequirementKind } from '@/lib/passport-index'
import { PASSPORT_COVERS, POPULAR_PASSPORT_CODES } from '@/lib/passport-covers'
import { PassportCover } from './passport-cover'

export function PathwaysPassports({ categories, category, onCategoryChange }: {
  categories: string[]
  category: string
  onCategoryChange: (category: string) => void
}) {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('All')
  const [destination, setDestination] = useState('')
  const [access, setAccess] = useState<RequirementKind | ''>('')
  const gallery = useRef<HTMLUListElement>(null)
  const passports = useMemo(() => POPULAR_PASSPORT_CODES.filter((code) => {
    const asset = PASSPORT_COVERS[code]
    const q = query.trim().toLowerCase()
    if (q && !asset.country.toLowerCase().includes(q) && code.toLowerCase() !== q) return false
    if (region !== 'All' && asset.region !== region) return false
    if (access && destination) {
      const rule = PASSPORTS[code]?.d[destination]
      return !!rule && decodeRequirement(rule).kind === access
    }
    return true
  }), [query, region, destination, access])
  const filtered = !!query || region !== 'All' || !!access
  return (
    <div id="pw-passports" className="min-w-0 scroll-mt-4 space-y-4">
      <header className="relative overflow-hidden rounded-[var(--radius-card)] bg-navy-deep p-5 text-white sm:p-7">
        {/* Existing approved illustration; kept subdued behind the search surface. */}
        <div className="pointer-events-none absolute inset-0 bg-[url('/images/journey-globe-pins.png')] bg-cover bg-center opacity-10" aria-hidden="true" />
        <div className="relative">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-gold">Kolmari Pathways</p>
          <h1 className="mt-2 text-[26px] font-bold leading-tight tracking-[-0.02em] sm:text-3xl">Explore passports</h1>
          <p className="mt-2 max-w-[68ch] text-[13.5px] leading-6 text-white/75">Discover where different passports can take you, compare visa access, and explore immigration opportunities around the world.</p>
          <form onSubmit={(event) => { event.preventDefault(); gallery.current?.scrollIntoView({ block: 'nearest' }) }} className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <label className="sm:col-span-2 xl:col-span-2">
              <span className="mb-1.5 block text-xs font-semibold text-white/75">Country or passport</span>
              <span className="flex items-center gap-2 rounded-[var(--radius-field)] bg-white px-3 py-2.5 text-navy focus-within:ring-2 focus-within:ring-gold">
                <Search size={16} aria-hidden="true" />
                <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search popular passports" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
              </span>
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-semibold text-white/75">Passport region</span>
              <select className="field" value={region} onChange={(event) => setRegion(event.target.value)}>
                <option value="All">All regions</option>
                {['Americas', 'Europe', 'Africa'].map((value) => <option key={value}>{value}</option>)}
              </select>
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-semibold text-white/75">Pathway type · routes below</span>
              <select className="field" value={category} onChange={(event) => onCategoryChange(event.target.value)}>
                {categories.map((value) => <option key={value} value={value}>{value === 'All' ? 'All pathway types' : value}</option>)}
              </select>
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-semibold text-white/75">Destination for access check</span>
              <select className="field" value={destination} onChange={(event) => { setDestination(event.target.value); if (!event.target.value) setAccess('') }}>
                <option value="">Choose a destination</option>
                {PASSPORT_CODES.map((code) => <option key={code} value={code}>{PASSPORTS[code].n}</option>)}
              </select>
            </label>
            <label>
              <span className="mb-1.5 block text-xs font-semibold text-white/75">Visa access to that destination</span>
              <select className="field disabled:opacity-60" value={access} disabled={!destination} onChange={(event) => setAccess(event.target.value as RequirementKind | '')}>
                <option value="">All access types</option>
                {Object.entries(REQUIREMENT_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <div className="flex items-end gap-3 sm:col-span-2">
              <button type="submit" className="inline-flex items-center gap-2 rounded-[var(--radius-btn)] bg-gold px-5 py-2.5 text-sm font-bold text-navy-deep">Search <ArrowRight size={16} aria-hidden="true" /></button>
              {(filtered || category !== 'All' || destination) && <button type="button" onClick={() => { setQuery(''); setRegion('All'); setDestination(''); setAccess(''); onCategoryChange('All') }} className="py-2.5 text-xs font-semibold text-white underline">Clear filters</button>}
            </div>
          </form>
          <p className="mt-3 text-[11px] leading-5 text-white/65">Passport nationality is separate from your destination. Entry-access data updated {PASSPORT_META.updated}; verify current rules with the destination authority. Pathway type filters the route list below.</p>
        </div>
      </header>
      <section className="min-w-0" aria-labelledby="pw-passports-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="pw-passports-heading" className="text-base font-bold text-navy">{filtered ? 'Passport search results' : 'Popular passports'}</h2>
          <Link href="/passportindex" className="inline-flex items-center gap-1 text-xs font-bold text-navy hover:underline">View all passports <ArrowRight size={14} aria-hidden="true" /></Link>
        </div>
        <ul ref={gallery} id="pw-passport-gallery" aria-label="Passport gallery" tabIndex={0} className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-[var(--radius-field)] pb-2 outline-none focus-visible:ring-2 focus-visible:ring-gold [scrollbar-width:thin]">
          {passports.map((code) => (
            <li key={code} className="min-w-0 shrink-0 basis-[120px] snap-start sm:basis-[132px] xl:flex-1">
              <Link href={`/passportindex?passport=${code}${destination ? `&focus=${destination}` : ''}`} aria-label={`Explore ${PASSPORT_COVERS[code].country} passport`} className="flex h-full flex-col items-center rounded-[var(--radius-card)] border border-line bg-white p-3 text-center shadow-tile transition-colors hover:border-navy/30 focus-visible:outline-2 focus-visible:outline-gold">
                <PassportCover code={code} className="w-[72px] sm:w-[80px]" />
                <span className="mt-3 text-xs font-bold leading-5 text-navy">{PASSPORT_COVERS[code].country}</span>
                <span className="mt-1 text-[10px] leading-4 text-muted">View entry access</span>
              </Link>
            </li>
          ))}
        </ul>
        {!passports.length && <p role="status" className="card-surface p-5 text-sm text-muted">No popular passports match these filters. Clear filters or open the complete passport directory.</p>}
        <div className="mt-1 flex items-center justify-between gap-3">
          <p role="status" className="text-[11px] text-muted-soft">{passports.length} of {POPULAR_PASSPORT_CODES.length} popular passports</p>
          <div className="flex gap-2">
            {[-1, 1].map((direction) => <button key={direction} type="button" aria-label={direction < 0 ? 'Scroll passports left' : 'Scroll passports right'} aria-controls="pw-passport-gallery" onClick={() => gallery.current?.scrollBy({ left: direction * gallery.current.clientWidth * 0.75, behavior: 'auto' })} className="grid size-8 place-items-center rounded-pill border border-line bg-white text-navy">{direction < 0 ? <ArrowLeft size={14} aria-hidden="true" /> : <ArrowRight size={14} aria-hidden="true" />}</button>)}
          </div>
        </div>
      </section>
    </div>
  )
}
