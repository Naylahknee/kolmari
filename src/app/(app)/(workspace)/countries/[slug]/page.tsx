import { notFound, redirect } from 'next/navigation'
import { COUNTRIES } from '@/lib/countries'

// Legacy single-page country template. Every country now uses the unified
// Portugal-style template at /nextinations/[slug]/v2, so this compatibility
// route redirects there instead of rendering a second, different design.
export default async function CountryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const country = COUNTRIES.find((item) => item.slug === slug)
  if (!country) notFound()
  redirect(`/nextinations/${country.slug}/v2/overview`)
}
