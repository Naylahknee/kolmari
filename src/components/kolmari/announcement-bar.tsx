/* Reusable full-width announcement slot that sits above the workspace header.
   It is intentionally empty by default — drop launch, promo, or status copy
   into ANNOUNCEMENT below (optionally with a link) and the bar appears. Leave
   it null and nothing renders, so the header stays flush. */

import Link from 'next/link'

type Announcement = { text: string; href?: string; linkLabel?: string }

// Empty reusable slot. Set to an object to publish a message across the app.
const ANNOUNCEMENT: Announcement | null = null

export function AnnouncementBar() {
  if (!ANNOUNCEMENT) return null
  const { text, href, linkLabel } = ANNOUNCEMENT
  return (
    <div className="announce" role="region" aria-label="Announcement">
      <span className="announce-text">{text}</span>
      {href && (
        <Link className="announce-link" href={href}>
          {linkLabel ?? 'Learn more'}
        </Link>
      )}
    </div>
  )
}
