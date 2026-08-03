'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

/* Self-heal trigger. Rendered by the country hero only when there is no saved
 * hero image. On mount it asks the server (once) to ensure this country's hero
 * exists; the request is deduped and capped server-side, so it is safe to fire
 * on every uncovered view. When the server reports it generated one, we refresh
 * the route so the new hero swaps in without a full reload. Renders nothing. */
export function HeroAutoGenerate({ slug }: { slug: string }) {
  const router = useRouter()
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/internal/country-hero/ensure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug }),
        })
        const data = (await res.json().catch(() => null)) as { status?: string } | null
        if (!cancelled && data?.status === 'generated') router.refresh()
      } catch {
        // Background best-effort; the composite fallback stays on screen.
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug, router])

  return null
}
