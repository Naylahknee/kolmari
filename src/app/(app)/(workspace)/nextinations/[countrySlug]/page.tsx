import { redirect } from 'next/navigation'

// /nextinations/[countrySlug] → redirect to /overview as the default section.
// This preserves deep-link compatibility: the workspace always has a section in the URL.
export default async function CountryWorkspaceIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ countrySlug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { countrySlug } = await params
  const sp = await searchParams
  const source = sp.source ? `?source=${sp.source}` : ''
  redirect(`/nextinations/${countrySlug}/overview${source}`)
}
