import { SettingsTabs } from '@/components/kolmari/settings-tabs'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await requireCurrentUser()
  const tab = (await searchParams).tab === 'account' ? 'account' : 'general'
  return <SettingsTabs email={user.email} initial={await getProfile(user.id)} initialTab={tab} />
}
