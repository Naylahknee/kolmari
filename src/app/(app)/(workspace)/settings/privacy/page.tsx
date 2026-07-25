import { requireCurrentUser } from '@/lib/auth'
import { PrivacyAccountPage } from '@/components/nexit/privacy-account-page'

export const metadata = { title: 'Privacy & Account — Nexit' }

export default async function PrivacyAccountRoute() {
  const user = await requireCurrentUser()
  return <PrivacyAccountPage email={user.email} />
}
