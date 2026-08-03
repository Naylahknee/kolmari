'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { LogOut, Settings as SettingsIcon, ShieldCheck } from 'lucide-react'
import { BRAND } from '@/config/brand'
import { PRODUCT_COPY } from '@/config/product-copy'
import { UnitsControl } from './client/UnitsControl'

const pageNames: Record<string, string> = {
  '/dashboard': PRODUCT_COPY.dashboard,
  '/your-world': 'Your World',
  '/destinations': 'Destinations',
  '/nexitnation': 'Destinations',
  '/saved': 'Saved',
  '/countries': 'Saved',
  '/pathways': PRODUCT_COPY.pathways,
  '/my-plan': PRODUCT_COPY.plan,
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
  const router = useRouter()

  // Global search: routes to the Destinations browser with the query, which
  // seeds its own search field from ?q.
  const [query, setQuery] = useState('')
  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    const term = query.trim()
    router.push(term ? `/your-world?q=${encodeURIComponent(term)}` : '/your-world')
  }

  // Real account name for the profile pill avatar — never a placeholder name.
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    let cancelled = false
    fetch('/api/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const name = typeof data?.display_name === 'string' ? data.display_name.trim() : ''
        if (cancelled) return
        if (name) setDisplayName(name)
        if (data?.isAdmin === true) setIsAdmin(true)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])
  const initials = displayName ? displayName.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase() : null
  const firstName = displayName ? displayName.split(/\s+/)[0] : null

  // Account menu (Settings + Sign out) anchored under the profile pill.
  const [menuOpen, setMenuOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [menuOpen])

  async function signOut() {
    setSigningOut(true)
    try {
      await fetch('/api/logout', { method: 'POST' })
    } catch {
      // Fall through to redirect regardless — the session cookie clear is best-effort.
    }
    window.location.href = '/login'
  }

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

        {!country && (
          <form className="tb-search" role="search" onSubmit={onSearch}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" width="16" height="16" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations, pathways, and more"
              aria-label="Search destinations, pathways, and more"
            />
          </form>
        )}

        <div className="tb-right">
          {country && <UnitsControl />}
          <button type="button" className="tb-bell" aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" width="18" height="18"><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 01-3.4 0" /></svg>
          </button>
          <div className="profile-menu" ref={menuRef}>
            <button
              type="button"
              className="profile-pill"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Account menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="profile-avatar">
                {initials ?? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" width="14" height="14" aria-hidden="true"><circle cx="12" cy="8" r="3.4" /><path d="M5.5 20a6.5 6.5 0 0113 0" /></svg>
                )}
              </span>
              {firstName && <span className="profile-name">{firstName}</span>}
            </button>
            {menuOpen && (
              <div className="profile-dropdown" role="menu">
                {displayName && <p className="profile-dropdown-name">{displayName}</p>}
                {isAdmin && (
                  <Link className="profile-dropdown-item" href="/admin" role="menuitem" onClick={() => setMenuOpen(false)}>
                    <ShieldCheck size={15} aria-hidden="true" /> Admin
                  </Link>
                )}
                <Link className="profile-dropdown-item" href="/settings" role="menuitem" onClick={() => setMenuOpen(false)}>
                  <SettingsIcon size={15} aria-hidden="true" /> Settings
                </Link>
                <button type="button" className="profile-dropdown-item profile-dropdown-signout" role="menuitem" onClick={signOut} disabled={signingOut}>
                  <LogOut size={15} aria-hidden="true" /> {signingOut ? 'Signing out…' : 'Sign out'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
