/* Full-width announcement slot above the workspace header. Content is managed
   by admins in /admin and stored in site_settings; the bar renders nothing when
   no announcement is published, so the header stays flush. */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Announcement = { text: string; href?: string | null; linkLabel?: string | null }

export function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/announcement')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const a = data?.announcement
        if (!cancelled && a && typeof a.text === 'string' && a.text.trim()) setAnnouncement(a)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  if (!announcement) return null
  const { text, href, linkLabel } = announcement
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
