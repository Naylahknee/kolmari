'use client'

import { useEffect, useState } from 'react'
import { COUNTRIES } from '@/lib/countries'

const STORAGE_KEY = 'nexit:saved-nextinations'
const CHANGED_EVENT = 'nexit:saved-nextinations-changed'

function readSaved(): string[] {
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(raw) ? raw.filter((s): s is string => typeof s === 'string') : []
  } catch {
    return []
  }
}

/**
 * Reactive hook that returns the list of saved Nextination slugs and the
 * matching country objects. Updates whenever the saved list changes in any tab.
 */
export function useSavedNextinations() {
  const [slugs, setSlugs] = useState<string[]>([])

  useEffect(() => {
    const sync = () => setSlugs(readSaved())
    sync()
    window.addEventListener('storage', sync)
    window.addEventListener(CHANGED_EVENT, sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(CHANGED_EVENT, sync)
    }
  }, [])

  const countries = COUNTRIES
    .filter((c) => slugs.includes(c.slug))
    .map((c) => ({ slug: c.slug, name: c.name, code: c.code }))

  return { slugs, countries }
}
