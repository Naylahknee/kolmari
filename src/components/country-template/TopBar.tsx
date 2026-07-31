'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BRAND } from '@/config/brand'
import { PRODUCT_COPY } from '@/config/product-copy'
import { UnitsControl } from './client/UnitsControl'

const pageNames: Record<string, string> = {
  '/dashboard': PRODUCT_COPY.dashboard,
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
        </div>
      </div>
    </header>
  )
}
