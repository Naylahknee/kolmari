import { redirect } from 'next/navigation'

// Compatibility route retained for old quiz links. Quiz completion now returns
// users to the Dashboard, where their ranked results are surfaced without
// forcing them directly into a country page.
export default function NextinationsIndexPage() {
  redirect('/dashboard')
}
