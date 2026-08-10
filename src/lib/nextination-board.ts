'use client'

// Kolmari World planning board store.
// A saved destination is a pin that carries planning status + a note. Persisted
// in localStorage (same pattern as the existing saved-nextinations store) so the
// MVP needs no DB migration; a Neon-backed store can replace read/write later
// without changing the hook's shape.

import { useCallback, useEffect, useState } from 'react'
import type { WorldPlace } from './world-places'
import { COUNTRIES } from './countries'

const COUNTRY_SLUGS = new Set(COUNTRIES.map((c) => c.slug))

/** Country name → its country-workspace slug, or null when no workspace exists yet. */
export function countryWorkspaceSlug(country: string): string | null {
  const slug = country.toLowerCase().replace(/\s+/g, '-')
  return COUNTRY_SLUGS.has(slug) ? slug : null
}

export type NextinationStatus = 'considering' | 'researching' | 'shortlisted' | 'selected' | 'archived'

export const STATUS_ORDER: NextinationStatus[] = ['considering', 'researching', 'shortlisted', 'selected', 'archived']

export const STATUS_META: Record<NextinationStatus, { label: string; marker: string; dot: string; text: string; chip: string }> = {
  considering: { label: 'Considering', marker: 'outline', dot: 'border-2 border-gold bg-transparent', text: 'text-gold-deep', chip: 'bg-gold-soft/60 text-gold-deep' },
  researching: { label: 'Researching', marker: 'filled', dot: 'bg-gold border-2 border-white', text: 'text-gold-deep', chip: 'bg-warn-soft text-warn' },
  shortlisted: { label: 'Shortlisted', marker: 'starred', dot: 'bg-info border-2 border-white', text: 'text-info', chip: 'bg-info-soft text-info' },
  selected: { label: 'Selected', marker: 'check', dot: 'bg-ok border-2 border-white', text: 'text-ok', chip: 'bg-ok-soft text-ok' },
  archived: { label: 'Archived', marker: 'muted', dot: 'bg-muted-soft border-2 border-white', text: 'text-muted', chip: 'bg-line text-muted' },
}

export type SavedNextination = {
  id: string
  name: string
  country: string
  countryCode: string
  region: string
  lat: number
  lng: number
  status: NextinationStatus
  note: string
  createdAt: number
}

const STORAGE_KEY = 'kolmari:board'
const CHANGED_EVENT = 'kolmari:board-changed'

function read(): SavedNextination[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(raw)) return []
    return raw.filter((x): x is SavedNextination => x && typeof x.id === 'string' && typeof x.lat === 'number' && typeof x.lng === 'number')
  } catch {
    return []
  }
}

function write(items: SavedNextination[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event(CHANGED_EVENT))
}

export function useNextinationBoard() {
  const [items, setItems] = useState<SavedNextination[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const sync = () => {
      setItems(read())
      setReady(true)
    }
    sync()
    window.addEventListener('storage', sync)
    window.addEventListener(CHANGED_EVENT, sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(CHANGED_EVENT, sync)
    }
  }, [])

  const add = useCallback((place: WorldPlace, status: NextinationStatus = 'considering', note = '') => {
    const current = read()
    if (current.some((x) => x.id === place.id)) return
    write([
      ...current,
      { id: place.id, name: place.name, country: place.country, countryCode: place.countryCode, region: place.region, lat: place.lat, lng: place.lng, status, note, createdAt: Date.now() },
    ])
  }, [])

  const update = useCallback((id: string, patch: Partial<Pick<SavedNextination, 'status' | 'note'>>) => {
    write(read().map((x) => (x.id === id ? { ...x, ...patch } : x)))
  }, [])

  const remove = useCallback((id: string) => {
    write(read().filter((x) => x.id !== id))
  }, [])

  return { items, ready, add, update, remove }
}
