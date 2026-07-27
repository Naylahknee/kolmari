import { redirect } from 'next/navigation'

/* /nextinations/[slug]/v2 -> /v2/overview, mirroring the existing index hop
   so deep links always carry a section. */
export default async function V2IndexPage({
  params, searchParams,
}: {
  params: Promise<{ countrySlug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { countrySlug } = await params
  const sp = await searchParams
  const source = sp.source ? `?source=${sp.source}` : ''
  redirect(`/nextinations/${countrySlug}/v2/overview${source}`)
}
