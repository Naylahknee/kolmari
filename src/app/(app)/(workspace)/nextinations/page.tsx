import { redirect } from 'next/navigation'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'
import { rankNextinations } from '@/lib/userProfile'

// Entry point after the Kolmari Match Quiz: pick the top Nextination and open its
// workspace. If the profile isn't scorable yet, send the user to the wizard.
//
export default async function NextinationsIndexPage() {
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
  const ranked = rankNextinations(profile)
  if (!ranked.length) redirect('/profile-wizard')
  const countrySlug = ranked[0].country.slug
  redirect(`/nextinations/${countrySlug}/v2/overview?source=quiz`)
}
