'use client'

// Phase 2 of the My Plan overhaul: an instant, offline-friendly localStorage
// cache that COMPLEMENTS the canonical Neon store (the plan still autosaves to
// the server via PUT /api/plan). It holds fast-access working state — the active
// country/city and the manual overrides, custom tasks, and document metadata
// that later phases (4–6) layer on top of the plan.

import { useEffect, useRef, useState } from 'react'

const NS = 'kolmari:workspace:'

function readCache<T>(key: string, fallback: T): T {
  // SSR-safe: never touch localStorage during server render.
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(NS + key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

/**
 * SSR-safe localStorage-backed state with a 1s debounced write.
 * Returns [value, setValue, hydrated]. Reads happen after mount to avoid an
 * SSR/client hydration mismatch; writes are debounced and wrapped in try/catch.
 */
export function useLocalStorageState<T>(
  key: string,
  initial: T,
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(initial)
  const [hydrated, setHydrated] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Load persisted value after mount (avoids an SSR/client hydration mismatch).
    /* eslint-disable react-hooks/set-state-in-effect */
    setValue((current) => readCache(key, current))
    setHydrated(true)
    /* eslint-enable react-hooks/set-state-in-effect */
    // Runs once per mount; `key` is stable per hook instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Only commit after hydration so we never overwrite stored data with the
    // initial value on first paint.
    if (!hydrated || typeof window === 'undefined') return
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(NS + key, JSON.stringify(value))
      } catch {
        /* ignore quota / disabled storage */
      }
    }, 1000)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [key, value, hydrated])

  return [value, setValue, hydrated]
}

export type WorkspaceOverrides = Record<string, number | null>
export type WorkspaceDocumentMeta = Record<string, { note?: string; expirationDate?: string | null }>

/** Composed workspace cache with the five scopes the overhaul tracks. */
export function useLocalStorageWorkspace() {
  const [country, setCountry, countryReady] = useLocalStorageState<string | null>('country', null)
  const [city, setCity] = useLocalStorageState<string | null>('city', null)
  const [userOverrides, setUserOverrides] = useLocalStorageState<WorkspaceOverrides>('user_overrides', {})
  const [customTasks, setCustomTasks] = useLocalStorageState<string[]>('custom_tasks', [])
  const [documentMetadata, setDocumentMetadata] = useLocalStorageState<WorkspaceDocumentMeta>('document_metadata', {})

  return {
    hydrated: countryReady,
    country, setCountry,
    city, setCity,
    userOverrides, setUserOverrides,
    customTasks, setCustomTasks,
    documentMetadata, setDocumentMetadata,
  }
}
