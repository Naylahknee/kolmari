import { getAnnouncement } from '@/lib/admin-data'

// Public read for the site-wide announcement bar (no auth — it renders app-wide).
export async function GET() {
  try {
    return Response.json({ announcement: await getAnnouncement() })
  } catch (error) {
    console.error('Announcement load failed', error)
    return Response.json({ announcement: null })
  }
}
