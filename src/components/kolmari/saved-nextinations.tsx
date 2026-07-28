'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Heart } from 'lucide-react'
import { COUNTRIES, countryFlag } from '@/lib/countries'

const storageKey = 'nexit:saved-nextinations'
const changedEvent = 'nexit:saved-nextinations-changed'

function readSaved() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) ?? '[]')
    return Array.isArray(saved) ? saved.filter((slug): slug is string => typeof slug === 'string') : []
  } catch {
    return []
  }
}

function writeSaved(slugs: string[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(slugs))
  window.dispatchEvent(new Event(changedEvent))
}

export function SaveNextinationButton({ slug, className = '' }: { slug: string; className?: string }) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const sync = () => setSaved(readSaved().includes(slug))
    sync()
    window.addEventListener('storage', sync)
    window.addEventListener(changedEvent, sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(changedEvent, sync)
    }
  }, [slug])

  function toggle() {
    const current = readSaved()
    writeSaved(saved ? current.filter((item) => item !== slug) : [...new Set([...current, slug])])
  }

  return (
    <button type="button" onClick={toggle} aria-pressed={saved} className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-bold text-navy transition hover:border-gold ${className}`}>
      <Heart size={17} fill={saved ? 'currentColor' : 'none'} className={saved ? 'text-gold-deep' : ''} />
      {saved ? 'Saved' : 'Save Destination'}
    </button>
  )
}

export function SavedNextinations() {
  const [slugs, setSlugs] = useState<string[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const sync = () => {
      setSlugs(readSaved())
      setReady(true)
    }
    sync()
    window.addEventListener('storage', sync)
    window.addEventListener(changedEvent, sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(changedEvent, sync)
    }
  }, [])

  const countries = COUNTRIES.filter((country) => slugs.includes(country.slug))

  if (!ready) return <div className="card-surface mt-7 h-40 animate-pulse" aria-label="Loading saved destinations" />

  if (!countries.length) {
    return (
      <section className="card-surface mt-7 p-8 text-center sm:p-12">
        <Heart className="mx-auto text-gold-deep" size={30} />
        <h2 className="mt-4 text-xl font-extrabold">No saved Destinations yet</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">Save countries while comparing them, then return here to keep your shortlist in one place.</p>
        <Link href="/countries" className="gold-button mt-6">Compare Destinations <ArrowRight size={16} /></Link>
      </section>
    )
  }

  return (
    <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {countries.map((country) => (
        <article key={country.slug} className="card-surface p-5">
          <div className="flex items-start justify-between gap-4">
            <div><span className="text-4xl" aria-hidden>{countryFlag(country.code)}</span><h2 className="mt-3 text-xl font-extrabold">{country.name}</h2><p className="text-sm text-muted">{country.city}</p></div>
            <strong className="text-sm text-muted">Saved for research</strong>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">{country.summary}</p>
          <div className="mt-5 grid gap-2">
            <Link href={`/nextinations/${country.slug}`} className="gold-button w-full">Explore This Destination <ArrowRight size={16} /></Link>
            <SaveNextinationButton slug={country.slug} className="w-full" />
          </div>
        </article>
      ))}
    </div>
  )
}
