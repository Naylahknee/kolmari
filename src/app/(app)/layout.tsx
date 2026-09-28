import { redirect } from 'next/navigation'
import { requireCurrentUser } from '@/lib/auth'
import { verificationRequiredFor } from '@/lib/verification'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await requireCurrentUser()
  // Real email verification gate: unverified users cannot reach any app page
  // until they pass the verify screen. Inert until RESEND_API_KEY is set, and
  // the demo account is always exempt.
  if (await verificationRequiredFor(user.id, user.email)) redirect('/verify-email')
  return children
}
