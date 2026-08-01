import { redirect } from 'next/navigation'

export default async function CountriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>
}) {
  const { q } = await searchParams
  const query = Array.isArray(q) ? (q[0] ?? '') : (q ?? '')
  const target = query
    ? `/destinations&q=${encodeURIComponent(query)}`
    : '/destinations'
  redirect(target)
}
