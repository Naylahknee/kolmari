import type { Metadata } from 'next'
import { Suspense } from 'react'
import { requireCurrentUser } from '@/lib/auth'
import { PassportIndexTool } from '@/components/kolmari/passport-index-tool'

export const metadata: Metadata = {
  title: 'Passport Index | Kolmari',
  description: 'What your passport opens — visa-free entry, visa on arrival, eTA, eVisa, or apply-ahead visas for 199 destinations.',
}

/**
 * Passport Index — Kolmari's own passport power tool, built on the open
 * passport-index dataset (MIT, updated Feb 2026). Replaces the old placeholder.
 */
export default async function PassportIndexPage() {
  await requireCurrentUser()
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading passport data…</p>}>
      <PassportIndexTool />
    </Suspense>
  )
}
