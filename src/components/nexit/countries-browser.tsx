'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react'
import { COUNTRIES, countryFlag } from '@/lib/countries'
import { SaveNextinationButton } from './saved-nextinations'

type ApiCountry = { id: number; name: string; visa_type: string; income_required: number; country_code: string | null }

export function CountriesBrowser({ initialQuery = '', profileComplete }: { initialQuery?: string; profileComplete: boolean }) {
  const [countries, setCountries] = useState<ApiCountry[]>([])
  const [query, setQuery] = useState(initialQuery)
  const [region, setRegion] = useState('All')
  const [status, setStatus] = useState('Loading your country options…')

  useEffect(() => {
    let active = true
    fetch('/api/countries').then(async (response) => {
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Unable to load countries.')
      if (active) { setCountries(data); setStatus('') }
    }).catch((reason) => { if (active) setStatus(reason instanceof Error ? reason.message : 'Unable to load countries.') })
    return () => { active = false }
  }, [])

  const filtered = countries.filter((country) => {
    const detail = COUNTRIES.find((item) => item.name === country.name)
    const matchesText = `${country.name} ${country.visa_type}`.toLowerCase().includes(query.toLowerCase())
    return matchesText && (region === 'All' || detail?.region === region)
  })

  return (
    <div>
      <div><p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Nextination directory</p><h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">Research countries and Pathways.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Compare general Pathway and cost information. Personalized matches require a completed Nexit Profile.</p></div>
      {!profileComplete ? <div className="mt-5 rounded-card border border-gold/30 bg-gold-soft/50 p-4 text-sm font-bold">Complete your Nexit Profile to see personalized matches. <Link href="/profile-wizard" className="ml-2 text-gold-deep underline">Start Wizard</Link></div> : null}
      <div className="card-surface mt-7 flex flex-col gap-3 p-4 sm:flex-row"><label className="flex min-h-12 flex-1 items-center gap-3 rounded-xl border border-line px-4"><Search size={18} className="text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search countries" className="min-w-0 flex-1 outline-none" placeholder="Search countries or visas…" /></label><label className="flex min-h-12 items-center gap-2 rounded-xl border border-line px-4 text-sm font-bold"><SlidersHorizontal size={17} /><span className="sr-only">Region</span><select value={region} onChange={(event) => setRegion(event.target.value)} className="bg-white outline-none"><option>All</option><option>Europe</option><option>Americas</option></select></label></div>
      {status ? <p className="mt-7 text-sm text-muted">{status}</p> : null}
      {!status && !filtered.length ? <div className="card-surface mt-7 p-8 text-center"><p className="font-extrabold">No matches found</p><p className="mt-2 text-sm text-muted">Try a broader search or switch the region filter.</p></div> : null}
      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((country) => {
        const detail = COUNTRIES.find((item) => item.name === country.name)
        if (!detail) return null
        return <article key={country.id} className="overflow-hidden rounded-tile border border-line bg-white shadow-tile transition-shadow hover:shadow-card"><div className="relative flex h-32 items-end bg-gradient-to-br from-navy to-navy-deep p-4 text-white"><div className="absolute -right-4 -top-7 text-[104px] opacity-20" aria-hidden>{countryFlag(detail.code)}</div><span className="relative text-4xl" aria-hidden>{countryFlag(detail.code)}</span><p className="relative ml-auto text-xs font-bold text-gold">{detail.region}</p></div><div className="p-4"><div className="flex items-start justify-between gap-2"><div><h2 className="font-sans text-[15px] font-bold text-navy">{country.name}</h2><p className="text-[11px] text-muted-soft">{detail.city}</p></div>{profileComplete ? <p className="shrink-0 font-sans text-[14px] font-bold text-gold-deep">{detail.match}%<span className="ml-1 text-[10px] font-medium text-muted-soft">Nexit Score</span></p> : null}</div><p className="mt-2 font-sans text-[12px] font-medium text-muted">{country.visa_type}</p><div className="mt-3 flex items-center justify-between text-[12px]"><span className="font-bold text-navy">${country.income_required.toLocaleString()}/mo</span><span className="text-muted-soft">Cost {detail.cost}</span></div><div className="mt-4 grid gap-2"><Link href={`/countries/${detail.slug}`} className="gold-button w-full">View Nextination <ArrowRight size={16} /></Link><SaveNextinationButton slug={detail.slug} className="w-full" /></div></div></article>
      })}</div>
    </div>
  )
}
