'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react'
import { COUNTRIES, countryFlag } from '@/lib/countries'
import { SaveNextinationButton } from './saved-nextinations'

type ApiCountry = { id: number; name: string; visa_type: string; income_required: number; country_code: string | null }

/**
 * CountriesView — the country-directory panel used inside the unified Nexit World page.
 * Does NOT render its own page header; the parent page supplies that.
 */
export function CountriesView({ initialQuery = '', profileComplete }: { initialQuery?: string; profileComplete: boolean }) {
  const [countries, setCountries] = useState<ApiCountry[]>([])
  const [query, setQuery] = useState(initialQuery)
  const [region, setRegion] = useState('All')
  const [status, setStatus] = useState('Loading countries…')

  useEffect(() => {
    let active = true
    fetch('/api/countries')
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error ?? 'Unable to load countries.')
        if (active) { setCountries(data); setStatus('') }
      })
      .catch((reason) => {
        if (active) setStatus(reason instanceof Error ? reason.message : 'Unable to load countries.')
      })
    return () => { active = false }
  }, [])

  const filtered = countries.filter((country) => {
    const detail = COUNTRIES.find((item) => item.name === country.name)
    const matchesText = `${country.name} ${country.visa_type}`.toLowerCase().includes(query.toLowerCase())
    return matchesText && (region === 'All' || detail?.region === region)
  })

  return (
    <div className="space-y-6">
      {!profileComplete && (
        <div className="rounded-[var(--radius-card)] border border-gold/30 bg-gold-soft/50 p-4 text-sm font-semibold text-navy">
          Complete your Kolmari Profile to see personalized matches.{' '}
          <Link href="/profile-wizard" className="font-bold text-gold-deep underline">Start Wizard</Link>
        </div>
      )}

      {/* Search + filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex min-h-11 flex-1 items-center gap-3 rounded-[var(--radius-field)] border border-line bg-white px-4">
          <Search size={16} className="shrink-0 text-muted" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search countries"
            className="min-w-0 flex-1 text-sm outline-none placeholder:text-muted"
            placeholder="Search countries or visas…"
          />
        </label>
        <label className="flex min-h-11 items-center gap-2 rounded-[var(--radius-field)] border border-line bg-white px-4 text-sm font-semibold">
          <SlidersHorizontal size={15} aria-hidden="true" />
          <span className="sr-only">Region filter</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-transparent text-navy outline-none"
          >
            <option>All</option>
            <option>Europe</option>
            <option>Americas</option>
          </select>
        </label>
      </div>

      {/* States */}
      {status && <p className="text-sm text-muted">{status}</p>}
      {!status && !filtered.length && (
        <div className="card-surface p-8 text-center">
          <p className="font-extrabold text-navy">No matches found</p>
          <p className="mt-2 text-sm text-muted">Try a broader search or switch the region filter.</p>
        </div>
      )}

      {/* Country grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((country) => {
          const detail = COUNTRIES.find((item) => item.name === country.name)
          if (!detail) return null
          return (
            <article
              key={country.id}
              className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-tile transition-shadow hover:shadow-card"
            >
              {/* Card header */}
              <div className="relative flex h-32 items-end bg-gradient-to-br from-navy to-navy-deep p-4 text-white">
                <div className="absolute -right-4 -top-7 text-[104px] opacity-20" aria-hidden="true">
                  {countryFlag(detail.code)}
                </div>
                <span className="relative text-4xl" aria-hidden="true">{countryFlag(detail.code)}</span>
                <p className="relative ml-auto text-xs font-bold text-gold">{detail.region}</p>
              </div>

              {/* Card body */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-[15px] font-bold text-navy">{country.name}</h2>
                    <p className="text-[11px] text-muted">{detail.city}</p>
                  </div>
                  {/* Only show score when profile is complete and it has been calculated */}
                  {profileComplete && typeof detail.match === 'number' && (
                    <p className="shrink-0 text-[14px] font-bold text-gold-deep">
                      {detail.match}%
                      <span className="ml-1 text-[10px] font-medium text-muted">Match Score</span>
                    </p>
                  )}
                </div>
                <p className="mt-2 text-[12px] text-muted">{country.visa_type}</p>
                <div className="mt-3 flex items-center justify-between text-[12px]">
                  <span className="font-bold text-navy">${country.income_required.toLocaleString()}/mo</span>
                  <span className="text-muted">Cost {detail.cost}</span>
                </div>
                <div className="mt-4 grid gap-2">
                  <Link href={`/nextinations/${detail.slug}/overview`} className="gold-button w-full">
                    View Destination <ArrowRight size={16} />
                  </Link>
                  <SaveNextinationButton slug={detail.slug} className="w-full" />
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

/**
 * CountriesBrowser — standalone page version (used by the legacy /countries route).
 * Preserved for backward compatibility.
 */
export function CountriesBrowser({ initialQuery = '', profileComplete }: { initialQuery?: string; profileComplete: boolean }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Destination directory</p>
        <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">Research countries and Pathways.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Compare general Pathway and cost information. Personalized matches require a completed Kolmari Profile.
        </p>
      </div>
      <CountriesView initialQuery={initialQuery} profileComplete={profileComplete} />
    </div>
  )
}
