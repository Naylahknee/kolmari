import { redirect } from 'next/navigation'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'
import { rankNextinations } from '@/lib/userProfile'

// Entry point after the Nexit Match Quiz: pick the top Nextination and open its
// workspace. If the profile isn't scorable yet, send the user to the wizard.
//
// NEXT_PUBLIC_COUNTRY_TEMPLATE=v2 lands new users on the new country template.
// Unset or any other value keeps the existing sixteen-tab workspace, so this is
// reversible with an environment variable and no deploy.
const TEMPLATE_PATH = process.env.NEXT_PUBLIC_COUNTRY_TEMPLATE === 'v2' ? '/v2/overview' : ''

export default async function NextinationsIndexPage() {
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
  const ranked = rankNextinations(profile)
  if (!ranked.length) redirect('/profile-wizard')
  redirect(`/nextinations/${ranked[0].country.slug}${TEMPLATE_PATH}?source=quiz`)
}
