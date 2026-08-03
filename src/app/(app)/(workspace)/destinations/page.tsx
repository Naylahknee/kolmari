import { redirect } from 'next/navigation'

// Destinations was merged into Your World — matched countries now nest under the
// Your World nav item, so this index redirects (existing links keep working).
// The region map still lives at /destinations/regions/[region].
export default function DestinationsPage() {
  redirect('/your-world')
}
