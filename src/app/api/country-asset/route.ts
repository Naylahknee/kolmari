import { getGeneratedAsset } from '@/lib/country-assets'

export const runtime = 'nodejs'

// Public serve endpoint for saved generated visuals (hero + city). Returns the
// stored bytes with an image content type, or 404 when nothing is saved so the
// caller's fallback (composite hero / flag) takes over. No admin gate — these
// are approved, public country images.
//   /api/country-asset?slug=portugal&type=hero
//   /api/country-asset?slug=portugal&type=city&city=lisbon
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const type = searchParams.get('type')
  const city = searchParams.get('city') ?? ''

  if (!slug || (type !== 'hero' && type !== 'city')) {
    return new Response('Bad request', { status: 400 })
  }

  let asset: { base64: string; contentType: string } | null = null
  try {
    asset = await getGeneratedAsset(slug, type, type === 'city' ? city : '')
  } catch {
    return new Response('Unavailable', { status: 503 })
  }
  if (!asset) return new Response('Not found', { status: 404 })

  const bytes = Buffer.from(asset.base64, 'base64')
  return new Response(bytes, {
    headers: {
      'Content-Type': asset.contentType,
      // Versioned by the ?v= stamp the caller adds, so it's safe to cache hard.
      'Cache-Control': 'public, max-age=300, s-maxage=86400',
    },
  })
}
