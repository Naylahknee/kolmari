import type { Metadata } from 'next'
import { requireCurrentUser } from '@/lib/auth'
import { AstrocartographyShell } from '@/components/kolmari/astrocartography/astro-shell'

export const metadata: Metadata = { title: 'Astrocartography | Kolmari' }

// Scaffold only (owner-approved). The interaction shell is here; the actual
// relocation-line calculation is intentionally NOT implemented — real
// astrocartography lines require an ephemeris (planetary positions for a birth
// date/time/place) from a data source that has not been chosen yet. Per the
// data-integrity rules, we never fabricate planetary line positions, so the
// results area shows an honest "being built" state instead of invented lines.
export default async function AstrocartographyPage() {
  await requireCurrentUser()
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
      <AstrocartographyShell />
    </main>
  )
}
