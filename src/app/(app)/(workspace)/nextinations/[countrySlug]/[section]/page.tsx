import { redirect } from 'next/navigation'

const TEMPLATE_SECTIONS: Record<string, string> = {
  overview: 'overview',
  'why-you': 'overview',
  'economic-profile': 'overview',
  'cost-of-living': 'cost-housing',
  pathways: 'move-there',
  housing: 'cost-housing',
  employment: 'work-study',
  healthcare: 'healthcare',
  education: 'family-schools',
  transportation: 'lifestyle-community',
  'legal-taxes': 'tax-money',
  'daily-life': 'lifestyle-community',
  'family-pets': 'family-schools',
  greenbook: 'lifestyle-community',
  resources: 'overview',
  compare: 'overview',
}

export default async function LegacyCountrySectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ countrySlug: string; section: string }>
  searchParams: Promise<{ source?: string | string[] }>
}) {
  const { countrySlug, section } = await params
  const source = (await searchParams).source
  const sourceValue = Array.isArray(source) ? source[0] : source
  const query = sourceValue ? `?source=${encodeURIComponent(sourceValue)}` : ''
  const templateSection = TEMPLATE_SECTIONS[section] ?? 'overview'

  redirect(`/nextinations/${countrySlug}/v2/${templateSection}${query}`)
}
