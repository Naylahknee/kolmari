import { ProfileWizard } from '@/components/kolmari/profile-wizard'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'

export default async function ProfileWizardPage() {
  const user = await requireCurrentUser()
  return <ProfileWizard initial={await getProfile(user.id)} />
}
