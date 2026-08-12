import { getGeneratedAsset } from '@/lib/country-assets'
import type { GeneratedAssetType } from '@/lib/country-visuals/schema'

export const runtime = 'nodejs'

// Public serve endpoint for approved generated country visuals.
//   /api/country-asset?slug=portugal&type=hero
//   /api/country-asset?slug=portugal&type=dashboard_destination
//   /api/country-asset?slug=portugal&type=city&city=lisbon
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const type = searchParams.get('type')
  const city = searchParams.get('city') ?? ''

  const allowed = new Set<GeneratedAssetType>(['hero', 'city', 'dashboard_destination'])
  if (!slug || !type || !allowed.has(type as GeneratedAssetType)) {
    return new Response('Bad request', { status: 400 })
  }

  const assetType = type as GeneratedAssetType
  let asset: { base64: string; contentType: string } | null = null
  try {
    asset = await getGeneratedAsset(slug, assetType, assetType === 'city' ? city : '')
  } catch {
    return new Response('Unavailable', { status: 503 })
  }
  if (!asset) return new Response('Not found', { status: 404 })

  const bytes = Buffer.from(asset.base64, 'base64')
  return new Response(bytes, {
    headers: {
      'Content-Type': asset.contentType,
      'Cache-Control': 'public, max-age=300, s-maxage=86400',
    },
  })
}
