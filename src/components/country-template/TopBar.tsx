'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BRAND } from '@/config/brand'
import { PRODUCT_COPY } from '@/config/product-copy'
import { UnitsControl } from './client/UnitsControl'

const pageNames: Record<string, string> = {
  '/dashboard': PRODUCT_COPY.dashboard,
  '/nexitnation': PRODUCT_COPY.world,
  '/saved': PRODUCT_COPY.destinations,
  '/countries': PRODUCT_COPY.destinations,
  '/pathways': PRODUCT_COPY.pathways,
  '/nexit-plan': PRODUCT_COPY.plan,
  '/checklist': PRODUCT_COPY.flutterMode,
  '/community': PRODUCT_COPY.kolmariKlub,
  '/cost-calculator': PRODUCT_COPY.costCalculator,
  '/greenbook': PRODUCT_COPY.greenbook,
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
          <button className="icon-btn" type="button" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          </button>
          <button className="icon-btn" type="button" onClick={onToggleRail} aria-label="Toggle sidebar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></svg>
          </button>
        </div>
      </div>

      <div className="topbar-zone-b">
        <button className="page-title-button" type="button">
          <span>{country ?? pageName}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M6 9l6 6 6-6" /></svg>
          {country && <span className="page-section">{section}</span>}
        </button>

        <div className="tb-right">
          {country && <UnitsControl />}
          {country && (
            <button className="header-pill" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
              Compare
            </button>
          )}
          {country && (
            <button className="header-ghost" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M20.8 5.6a5.5 5.5 0 00-7.8 0L12 6.6l-1-1a5.5 5.5 0 00-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 000-7.8z" /></svg>
              Save
            </button>
          )}
          <button className="icon-btn" type="button" aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17"><path d="M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
          </button>
          <button className="icon-btn" type="button" aria-label="Help">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="17" height="17"><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.7 2.7 0 115 1.4c-.8 1.1-2.5 1.3-2.5 3.1M12 17h.01" /></svg>
          </button>
          <button className="icon-btn" type="button" aria-label="More options">
            <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17"><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></svg>
          </button>
        </div>
      </div>
    </header>
  )
}
