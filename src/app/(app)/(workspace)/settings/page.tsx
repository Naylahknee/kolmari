import { AccountTabs } from '@/components/kolmari/account-tabs'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'

const VALID = ['profile', 'billing', 'notifications', 'help'] as const
type Tab = (typeof VALID)[number]

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await requireCurrentUser()
  const raw = (await searchParams).tab
  const tab: Tab = raw && (VALID as readonly string[]).includes(raw) ? (raw as Tab) : 'profile'
  return <AccountTabs email={user.email} initial={await getProfile(user.id)} initialTab={tab} />
}
