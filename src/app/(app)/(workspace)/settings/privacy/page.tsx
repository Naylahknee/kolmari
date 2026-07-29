import { redirect } from 'next/navigation'

// Privacy & Account now lives as a tab inside /settings rather than a separate
// page. Keep this route as a redirect so existing links still work.
export default async function PrivacyAccountRoute() {
  redirect('/settings?tab=account')
}
