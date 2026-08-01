'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BRAND } from '@/config/brand'
import { PRODUCT_COPY } from '@/config/product-copy'
import { UnitsControl } from './client/UnitsControl'

const pageNames: Record<string, string> = {
  '/dashboard': PRODUCT_COPY.dashboard,
  '/your-world': 'Your World',
  '/nexitnation': PRODUCT_COPY.world,
  '/saved': 'Saved',
  '/countries': 'Saved',
  '/pathways': PRODUCT_COPY.pathways,
  '/nexit-plan': PRODUCT_COPY.plan,
  '/flutter': PRODUCT_COPY.flutterMode,
  '/checklist': PRODUCT_COPY.flutterMode,
  '/community': PRODUCT_COPY.kolmariKlub,
  '/cost-calculator': PRODUCT_COPY.costCalculator,
  '/greenbook': PRODUCT_COPY.greenbook,
  '/passportindex': 'PassportIndex',
  '/documents': PRODUCT_COPY.documents,
  '/settings': PRODUCT_COPY.settings,
  '/profile-wizard': 'Profile',
}

const titleCase = (value: string) =>
  value.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ')

export function TopBar({ onToggleRail }: { onToggleRail: () => void }) {
  const pathname = usePathname()
  const countryMatch = pathname.match(/^\/nextinations\/([^/]+)\/v2(?:\/([^/]+))?/)
  const country = countryMatch ? titleCase(countryMatch[1]) : null
  const section = countryMatch?.[2] ? titleCase(countryMatch[2]) : 'Overview'
  const pageName =
    Object.entries(pageNames).find(([route]) => pathname === route || pathname.startsWith(`${route}/`))?.[1] ??
    BRAND.name

  return (
    <header className="topbar">
      <div className="topbar-zone-a">
        <Link
          className="mark"
          href="/dashboard"
          aria-label={`${BRAND.name} home`}
          onClick={(event) => {
            if (document.body.classList.contains('rail-collapsed')) {
              event.preventDefault()
              onToggleRail()
            }
          }}
        >
          <img className="mark-bf" src="/brand/favicon-48.png" alt="" width="26" height="26" />
          <span className="mark-word">Kolmari</span>
        </Link>
        <div className="zone-a-actions">
          <button className="icon-btn" type="button" onClick={onToggleRail} aria-label="Toggle sidebar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></svg>
          </button>
        </div>
      </div>

      <div className="topbar-zone-b">
        <div className="page-title-button">
          <span>{country ?? pageName}</span>
          {country && <span className="page-section">{section}</span>}
        </div>

        <div className="tb-right">
          {country && <UnitsControl />}
          <button type="button" className="tb-bell" aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" width="18" height="18"><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 01-3.4 0" /></svg>
          </button>
          <Link className="profile-pill" href="/settings" aria-label="Profile and settings">
            <span className="profile-avatar" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" width="15" height="15"><circle cx="12" cy="8" r="3.4" /><path d="M5.5 20a6.5 6.5 0 0113 0" /></svg>
            </span>
            <span className="profile-chev" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="12" height="12"><path d="M6 9l6 6 6-6" /></svg>
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
