import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getRequestUser } from '@/lib/auth'
import { saveGeneratedAsset } from '@/lib/country-assets'

export const runtime = 'nodejs'

// Same allowlist gate as the generator route (KOLMARI_ADMIN_EMAILS).
function isAllowedAdmin(email: string) {
  const configured = process.env.KOLMARI_ADMIN_EMAILS
    ?.split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
  if (!configured?.length) return process.env.NODE_ENV !== 'production'
  return configured.includes(email.toLowerCase())
}

const slug = z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const saveSchema = z.discriminatedUnion('assetType', [
  z.object({ assetType: z.literal('hero'), countrySlug: slug, imageDataUrl: z.string().min(1) }),
  z.object({ assetType: z.literal('city'), countrySlug: slug, citySlug: slug, imageDataUrl: z.string().min(1) }),
])

// Persist an approved generated image to Neon so the country page can serve it
// from /api/country-asset without a redeploy. Admin-only; the image bytes come
// straight from the generator preview (a data: URL).
export async function POST(request: Request) {
  const user = await getRequestUser(request)
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  if (!isAllowedAdmin(user.email)) {
    return NextResponse.json({ error: 'You do not have permission to save country artwork.' }, { status: 403 })
  }

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: 'The request body must be valid JSON.' }, { status: 400 })
  }

  const parsed = saveSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please provide a valid asset to save.', issues: parsed.error.flatten() }, { status: 400 })
  }

  // data:image/webp;base64,XXXX  →  contentType + base64 payload
  const match = /^data:(image\/[a-z+.-]+);base64,(.+)$/i.exec(parsed.data.imageDataUrl)
  if (!match) {
    return NextResponse.json({ error: 'Expected a base64 image data URL.' }, { status: 400 })
  }
  const [, contentType, base64] = match

  try {
    await saveGeneratedAsset({
      countrySlug: parsed.data.countrySlug,
      assetType: parsed.data.assetType,
      citySlug: parsed.data.assetType === 'city' ? parsed.data.citySlug : undefined,
      base64,
      contentType,
    })
  } catch (caught) {
    console.error('Saving generated asset failed', caught instanceof Error ? caught.name : 'unknown')
    return NextResponse.json({ error: 'Could not save the image. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
