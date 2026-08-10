import type { Metadata } from 'next'

import { EnergyPortal } from '@/components/kolmari/energy/energy-portal'
import { requireCurrentUser } from '@/lib/auth'

export const metadata: Metadata = { title: 'Energy Portal | Kolmari' }

export default async function EnergyPortalPage() {
  await requireCurrentUser()
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      <EnergyPortal />
    </main>
  )
}
