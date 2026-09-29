'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, Heart, Lock, Search, X } from 'lucide-react'
import { PanelIcon, safetyLabelForLevel, safetyScoreColor } from '@/components/kolmari/panel-icons'
import { attributeIconsFor, getCountryAttributes } from '@/lib/country-attributes'

export type ExplorerRegion = 'Europe' | 'Asia' | 'North America' | 'Latin America' | 'Oceania'

export type ExplorerCountry = {
  slug: string
  name: string
  code: string
  city: string
  region: ExplorerRegion
  researched: boolean
  visaType: string | null
  incomeRequired: number | null
  safetyLabel: string | null
  cost: '$' | '$$' | null
  summary: string | null
}

type DestinationsExplorerProps = {
  countries: ExplorerCountry[]
  imageSrcs: Record<string, string>
  matchScores: Record<string, number>
  paid: boolean
  planLabel: string
}

const savedStorageKey = 'kolmari:saved-nextinations'
const savedChangedEvent = 'kolmari:saved-nextinations-changed'

function readSaved(): string[] {
  try {
    const saved = JSON.parse(window.localStorage.getItem(savedStorageKey) ?? '[]')
    return Array.isArray(saved) ? saved.filter((slug): slug is string => typeof slug === 'string') : []
  } catch {
    return []
  }
}

function toggleSaved(slug: string, currentlySaved: boolean) {
  const current = readSaved()
  const next = currentlySaved ? current.filter((item) => item !== slug) : [...new Set([...current, slug])]
  window.localStorage.setItem(savedStorageKey, JSON.stringify(next))
  window.dispatchEvent(new Event(savedChangedEvent))
}

function formatIncome(monthly: number) {
  return `From $${monthly.toLocaleString('en-US')}/mo`
}

const costLabel: Record<string, string> = { $: 'Lower cost', $$: 'Moderate cost' }

function CountryPhoto({ country, imageSrc, className }: { country: ExplorerCountry; imageSrc: string | null; className: string }) {
  const [flagFailed, setFlagFailed] = useState(false)
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-navy via-[#1d3a5f] to-[#0e1c33] ${className}`}>
      {imageSrc ? (
        <img src={imageSrc} alt={`${country.name} photo`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          {!flagFailed && (
            <img
              src={`https://flagcdn.com/w160/${country.code.toLowerCase()}.png`}
              alt=""
              loading="lazy"
              className="h-16 w-24 rounded-md object-cover shadow-lg"
              onError={() => setFlagFailed(true)}
            />
          )}
          {flagFailed && <span className="text-4xl font-extrabold tracking-wide text-gold/80">{country.code}</span>}
        </div>
      )}
    </div>
  )
}

function SelectFilter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="relative inline-flex">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 cursor-pointer appearance-none rounded-xl border border-line bg-white py-2.5 pl-4 pr-10 text-sm font-semibold text-navy transition hover:border-gold/60 focus:border-gold focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
    </label>
  )
}

export function DestinationsExplorer({ countries, imageSrcs, matchScores, paid, planLabel }: DestinationsExplorerProps) {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('all')
  const [pathway, setPathway] = useState('all')
  const [affordability, setAffordability] = useState('all')
  const [safety, setSafety] = useState('all')
  const [sort, setSort] = useState('az')
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const [saved, setSaved] = useState<string[]>([])

  useEffect(() => {
    const sync = () => setSaved(readSaved())
    sync()
    window.addEventListener('storage', sync)
    window.addEventListener(savedChangedEvent, sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(savedChangedEvent, sync)
    }
  }, [])

  useEffect(() => {
    if (!activeSlug) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveSlug(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [activeSlug])

  const regionOptions = useMemo(() => {
    const order: ExplorerRegion[] = ['Europe', 'Latin America', 'North America', 'Asia', 'Oceania']
    const present = new Set(countries.map((country) => country.region))
    return order.filter((regionOption) => present.has(regionOption))
  }, [countries])

  const pathwayOptions = useMemo(() => {
    const values = new Set<string>()
    countries.forEach((country) => { if (country.visaType) values.add(country.visaType) })
    return [...values].sort()
  }, [countries])

  const affordabilityOptions = useMemo(() => {
    const values = new Set<string>()
    countries.forEach((country) => { if (country.cost) values.add(country.cost) })
    return [...values].sort()
  }, [countries])

  const safetyOptions = useMemo(() => {
    const values = new Set<string>()
    countries.forEach((country) => { if (country.safetyLabel) values.add(country.safetyLabel) })
    return [...values].sort()
  }, [countries])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    const list = countries.filter((country) => {
      if (query && !country.name.toLowerCase().includes(query) && !country.city.toLowerCase().includes(query)) return false
      if (region !== 'all' && country.region !== region) return false
      if (pathway !== 'all' && country.visaType !== pathway) return false
      if (affordability !== 'all' && country.cost !== affordability) return false
      if (safety !== 'all' && country.safetyLabel !== safety) return false
      return true
    })
    return list.sort((a, b) => (sort === 'za' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)))
  }, [countries, search, region, pathway, affordability, safety, sort])

  const filtersActive = search.trim() !== '' || region !== 'all' || pathway !== 'all' || affordability !== 'all' || safety !== 'all' || sort !== 'az'

  function clearFilters() {
    setSearch('')
    setRegion('all')
    setPathway('all')
    setAffordability('all')
    setSafety('all')
    setSort('az')
  }

  const active = activeSlug ? countries.find((country) => country.slug === activeSlug) ?? null : null
  const activeSaved = active ? saved.includes(active.slug) : false
  const activeMatch = active ? matchScores[active.slug] : undefined

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
      <header className="flex flex-wrap items-start justify-between gap-4 pt-8">
        <div>
          <h1 className="text-3xl font-extrabold text-navy sm:text-4xl">More places to explore</h1>
          <p className="mt-2 text-sm text-muted sm:text-base">Discover what each country offers. Unlock your personal match with Plus.</p>
        </div>
        <span className="inline-flex items-center rounded-full border border-line bg-white px-4 py-1.5 text-sm font-bold text-navy">{planLabel}</span>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="relative min-w-52 flex-1 sm:max-w-xs">
          <span className="sr-only">Search countries</span>
          <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search countries"
            className="min-h-11 w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-navy placeholder:font-normal placeholder:text-muted focus:border-gold focus:outline-none"
          />
        </label>
        <SelectFilter label="Region" value={region} onChange={setRegion} options={[{ value: 'all', label: 'Region' }, ...regionOptions.map((option) => ({ value: option, label: option }))]} />
        <SelectFilter label="Pathway" value={pathway} onChange={setPathway} options={[{ value: 'all', label: 'Pathway' }, ...pathwayOptions.map((option) => ({ value: option, label: option }))]} />
        <SelectFilter label="Affordability" value={affordability} onChange={setAffordability} options={[{ value: 'all', label: 'Affordability' }, ...affordabilityOptions.map((option) => ({ value: option, label: `${option} · ${costLabel[option] ?? ''}` }))]} />
        <SelectFilter label="Sort" value={sort} onChange={setSort} options={[{ value: 'az', label: 'A-Z' }, { value: 'za', label: 'Z-A' }]} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-muted">Filter by</span>
        <SelectFilter label="Visa pathway" value={pathway} onChange={setPathway} options={[{ value: 'all', label: 'Visa pathway' }, ...pathwayOptions.map((option) => ({ value: option, label: option }))]} />
        <SelectFilter label="Cost" value={affordability} onChange={setAffordability} options={[{ value: 'all', label: 'Cost' }, ...affordabilityOptions.map((option) => ({ value: option, label: `${option} · ${costLabel[option] ?? ''}` }))]} />
        <SelectFilter label="Safety" value={safety} onChange={setSafety} options={[{ value: 'all', label: 'Safety' }, ...safetyOptions.map((option) => ({ value: option, label: option }))]} />
        {filtersActive && (
          <button type="button" onClick={clearFilters} className="text-sm font-bold text-teal-deep underline-offset-4 hover:underline">
            Clear filters
          </button>
        )}
      </div>

      <p className="mt-6 text-sm font-semibold text-muted" aria-live="polite">
        {filtered.length === 1 ? '1 place' : `${filtered.length} places`}
      </p>

      {filtered.length === 0 ? (
        <div className="card-surface mt-4 p-10 text-center">
          <p className="text-lg font-extrabold text-navy">No places match those filters</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">Try widening the search or clearing a filter to see more of what Kolmari has researched.</p>
          <button type="button" onClick={clearFilters} className="gold-button mt-6">Clear filters</button>
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((country) => {
            const isSaved = saved.includes(country.slug)
            const score = matchScores[country.slug]
            const attrs = getCountryAttributes(country.slug)
            const attrIcons = attributeIconsFor(country.slug, country.cost)
            return (
              <article
                key={country.slug}
                className="card-surface group cursor-pointer overflow-hidden p-0 transition hover:-translate-y-0.5 hover:shadow-card"
                onClick={() => setActiveSlug(country.slug)}
              >
                <div className="relative">
                  <CountryPhoto country={country} imageSrc={imageSrcs[country.slug] ?? null} className="h-44 w-full" />
                  <button
                    type="button"
                    aria-label={isSaved ? `Remove ${country.name} from saved` : `Save ${country.name}`}
                    aria-pressed={isSaved}
                    onClick={(event) => { event.stopPropagation(); toggleSaved(country.slug, isSaved) }}
                    className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/95 shadow-sm transition hover:scale-105"
                  >
                    <Heart size={18} className={isSaved ? 'fill-gold-deep text-gold-deep' : 'text-navy'} />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-navy/85 to-transparent p-4 pt-10">
                    <h2 className="text-xl font-extrabold text-white">{country.name}</h2>
                    {country.researched && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-navy">
                        {paid && score !== undefined ? (
                          <>{score}% match</>
                        ) : (
                          <><Lock size={12} aria-hidden="true" /> Match %</>
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <div className="px-4 py-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-navy">
                      {country.cost ? (
                        <>
                          <span className="text-gold-deep">{country.cost}</span>
                          <span className="text-muted"> · </span>
                        </>
                      ) : null}
                      {attrs && attrs.safetyScore !== null ? (
                        <>
                          <strong className="font-extrabold" style={{ color: safetyScoreColor(attrs.safetyScore) }}>
                            {attrs.safetyScore}/100
                          </strong>{' '}
                          <span className="font-semibold text-muted">safety</span>
                        </>
                      ) : attrs ? (
                        <span className="font-semibold text-muted">{safetyLabelForLevel(attrs.advisoryLevel)}</span>
                      ) : country.researched && country.safetyLabel ? (
                        <span className="font-semibold text-muted">{country.safetyLabel}</span>
                      ) : (
                        <span className="font-semibold text-muted">Research in progress</span>
                      )}
                    </p>
                  </div>
                  {attrIcons.length > 0 && (
                    <div
                      className="mt-2.5 flex items-center justify-between border-t border-line px-1 pt-2.5"
                      role="list"
                      aria-label={`${country.name} highlights`}
                    >
                      {attrIcons.map((icon) => (
                        <span key={icon.name} role="listitem">
                          <PanelIcon name={icon.name} label={icon.label} className="size-6" />
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {active && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={`${active.name} details`}>
          <button type="button" aria-label="Close details" onClick={() => setActiveSlug(null)} className="absolute inset-0 bg-navy/50" />
          <div className="relative flex h-full w-full flex-col overflow-y-auto bg-white shadow-2xl sm:max-w-md">
            <button
              type="button"
              onClick={() => setActiveSlug(null)}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white/95 text-navy shadow-sm transition hover:scale-105"
            >
              <X size={20} />
            </button>
            <CountryPhoto country={active} imageSrc={imageSrcs[active.slug] ?? null} className="h-56 w-full flex-none" />

            <div className="flex-1 px-6 pb-8">
              <div className="flex items-center gap-4">
                <span className="relative grid size-16 flex-none -translate-y-8 place-items-center overflow-hidden rounded-2xl border-4 border-white bg-navy text-xs font-extrabold text-gold shadow-md" aria-hidden="true">
                  {active.code}
                  <img
                    src={`https://flagcdn.com/w160/${active.code.toLowerCase()}.png`}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(event) => { event.currentTarget.style.display = 'none' }}
                  />
                </span>
                <div className="-ml-1">
                  <h2 className="text-2xl font-extrabold text-navy">{active.name}</h2>
                  <p className="text-sm font-semibold text-muted">{active.city} · {active.region}</p>
                </div>
              </div>

              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  aria-pressed={activeSaved}
                  onClick={() => toggleSaved(active.slug, activeSaved)}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-bold text-navy transition hover:border-gold"
                >
                  <Heart size={16} className={activeSaved ? 'fill-gold-deep text-gold-deep' : ''} />
                  {activeSaved ? 'Saved' : 'Save'}
                </button>
                <button
                  type="button"
                  aria-pressed={activeSaved}
                  onClick={() => toggleSaved(active.slug, activeSaved)}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-bold text-navy transition hover:border-gold"
                >
                  <Heart size={16} className={activeSaved ? 'fill-teal-deep text-teal-deep' : ''} />
                  {activeSaved ? 'Added' : 'Interested'}
                </button>
              </div>

              <section className="mt-7 border-t border-line pt-6">
                <h3 className="text-lg font-extrabold text-navy">Why explore {active.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {active.researched && active.summary ? active.summary : 'Research in progress. This country is on Kolmari\'s research list, but the full profile is not published yet.'}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-canvas px-3.5 py-1.5 text-xs font-bold text-navy">{active.city}</span>
                  <span className="rounded-full bg-canvas px-3.5 py-1.5 text-xs font-bold text-navy">{active.region}</span>
                  {active.researched && active.visaType && (
                    <span className="rounded-full bg-canvas px-3.5 py-1.5 text-xs font-bold text-navy">{active.visaType} visa</span>
                  )}
                  {active.researched && active.incomeRequired !== null && (
                    <span className="rounded-full bg-canvas px-3.5 py-1.5 text-xs font-bold text-navy">{formatIncome(active.incomeRequired)}</span>
                  )}
                </div>
              </section>

              <section className="card-surface mt-6 grid grid-cols-2 divide-x divide-line p-0">
                <div className="p-5 text-center">
                  <p className="text-2xl font-extrabold text-navy">{active.researched && active.cost ? active.cost : '—'}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted">Cost</p>
                </div>
                <div className="p-5 text-center">
                  <p className="text-2xl font-extrabold text-navy">{active.researched && active.safetyLabel ? active.safetyLabel : '—'}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted">Safety</p>
                </div>
              </section>

              <section className="card-surface mt-6 p-6">
                <h3 className="text-lg font-extrabold text-navy">See your {active.name} match</h3>
                {paid && activeMatch !== undefined ? (
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Your Match Score for {active.name} is <strong className="text-navy">{activeMatch}%</strong>, based on your Kolmari Profile answers.
                  </p>
                ) : paid ? (
                  <p className="mt-2 text-sm leading-6 text-muted">Match scores arrive with the full research. This profile is still being written.</p>
                ) : (
                  <>
                    <p className="mt-2 text-sm leading-6 text-muted">Unlock personalized visa, budget and safety signals.</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-bold text-navy">
                        <Lock size={15} aria-hidden="true" /> Match %
                      </span>
                      <Link href="/coming-soon?feature=plus" className="gold-button">Unlock with Kolmari Plus</Link>
                    </div>
                  </>
                )}
              </section>

              <div className="mt-6 text-center">
                <Link href={`/nextinations/${active.slug}/v2/overview`} className="text-sm font-bold text-teal-deep underline-offset-4 hover:underline">
                  Continue with free country overview
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
