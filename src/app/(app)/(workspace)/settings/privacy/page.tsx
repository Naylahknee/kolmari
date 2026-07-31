import { redirect } from 'next/navigation'

// Privacy & account management now lives inside the Profile tab of /settings.
// Keep this route as a redirect so existing links still work.
export default async function PrivacyAccountRoute() {
  redirect('/settings')
}
