'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  BookOpen,
  Calculator,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileText,
  Globe2,
  LayoutDashboard,
  LogOut,
  Menu,
  NotebookTabs,
  Route,
  Settings,
  Sparkles,
  UserRound,
  X,
  Zap,
} from 'lucide-react'
import { Wordmark } from './wordmark'
import { countryWorkspaceSlug, useNextinationBoard } from '@/lib/nextination-board'
import { countryFlag } from '@/lib/countries'
import { regionList } from '@/lib/destinations-data'
import type { WizardStatus } from '@/lib/profile'

// A saved-destination row for the sidebar tree. `slug` is the country-workspace
// slug when one exists (collapsible sections), or null for a city/country with
// no workspace yet (plain link to the board).
type SavedItem = { id: string; name: string; code: string; slug: string | null }

// ─── Sidebar structure ───────────────────────────────────────────────────────

// EXPLORE group (Destinations is rendered inline with collapsible regions)
const NAV_EXPLORE_SAVED = [
  { href: '/saved', label: 'Saved', icon: Compass },
] as const

// PLAN group
const NAV_PLAN = [
  { href: '/pathways',   label: 'Pathways',     icon: Route },
  { href: '/nexit-plan', label: 'My Plan',       icon: NotebookTabs },
  { href: '/flutter',    label: 'Flutter Mode',  icon: Zap },
  { href: '/documents',  label: 'Documents',     icon: FileText },
] as const

// CONNECT group
const NAV_CONNECT = [
  { href: '/community', label: 'Kolmari Klub', icon: Sparkles },
] as const

// TOOLS group
const NAV_TOOLS = [
  { href: '/cost-calculator', label: 'Cost Calculator', icon: Calculator },
  { href: '/greenbook',       label: 'Greenbook',       icon: BookOpen },
] as const

// Bottom ungrouped items
const NAV_BOTTOM = [
  { href: '/settings',       label: 'Settings', icon: Settings },
  { href: '/profile-wizard', label: 'Profile',  icon: UserRound },
] as const

// Country section labels (matches tab IDs in tabs.ts)
const COUNTRY_SECTIONS = [
  { id: 'overview',           label: 'Overview' },
  { id: 'why-you',            label: 'Why This Matches You' },
  { id: 'economic-profile',   label: 'Economic Profile' },
  { id: 'cost-of-living',     label: 'Cost of Living' },
  { id: 'pathways',           label: 'Pathways' },
  { id: 'healthcare',         label: 'Healthcare' },
  { id: 'greenbook',          label: 'Greenbook' },
  { id: 'housing',            label: 'Housing' },
  { id: 'legal-taxes',        label: 'Legal & Taxes' },
  { id: 'employment',         label: 'Employment' },
  { id: 'transportation',     label: 'Transportation' },
  { id: 'daily-life',         label: 'Daily Life' },
  { id: 'education',          label: 'Education' },
  { id: 'family-pets',        label: 'Family & Pets' },
  { id: 'resources',          label: 'Resources' },
  { id: 'compare',            label: 'Compare' },
] as const

// ─── Persistence keys ────────────────────────────────────────────────────────
// Read old key for backward compat; write new key going forward.
const COLLAPSE_KEY = 'kolmari:sidebar-collapsed'
const COLLAPSE_KEY_LEGACY = 'nexit:sidebar-collapsed'

function readCollapsed() {
  try {
    const newVal = window.localStorage.getItem(COLLAPSE_KEY)
    if (newVal !== null) return newVal === 'true'
    // Compatibility: fall back to legacy key
    return window.localStorage.getItem(COLLAPSE_KEY_LEGACY) === 'true'
  } catch { return false }
}
function writeCollapsed(v: boolean) {
  try {
    window.localStorage.setItem(COLLAPSE_KEY, String(v))
    // Remove legacy key once written
    window.localStorage.removeItem(COLLAPSE_KEY_LEGACY)
  } catch { /* noop */ }
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

// ─── Desktop sidebar nav item ────────────────────────────────────────────────

function SidebarItem({
  href, label, icon: Icon, active, collapsed,
}: {
  href: string; label: string; icon: typeof Globe2; active: boolean; collapsed: boolean
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      aria-current={active ? 'page' : undefined}
      className={[
        'flex items-center gap-3 rounded-[var(--radius-sidebar-row)] px-3 py-2 text-sm font-medium transition-colors',
        collapsed ? 'justify-center px-2' : '',
        active
          ? 'bg-gold-soft/25 text-white font-semibold'
          : 'text-[#9fb0cc] hover:bg-white/5 hover:text-white',
      ].join(' ')}
    >
      <Icon size={16} aria-hidden="true" className="shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}

// ─── Country sub-tree item ────────────────────────────────────────────────────

function CountryTreeItem({
  countrySlug, countryName, countryCode, open, onToggle, pathname, collapsed,
}: {
  countrySlug: string; countryName: string; countryCode: string
  open: boolean; onToggle: () => void; pathname: string; collapsed: boolean
}) {
  const isCountryActive = pathname.startsWith(`/nextinations/${countrySlug}`)
  const activeSection = isCountryActive
    ? pathname.replace(`/nextinations/${countrySlug}`, '').replace(/^\//, '') || 'overview'
    : null

  return (
    <li>
      {/* Country row */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        title={collapsed ? countryName : undefined}
        className={[
          'flex w-full items-center gap-2.5 rounded-[var(--radius-sidebar-row)] px-3 py-2 text-left text-sm font-medium transition-colors',
          collapsed ? 'justify-center px-2' : '',
          isCountryActive
            ? 'bg-gold-soft/25 text-white font-semibold'
            : 'text-[#9fb0cc] hover:bg-white/5 hover:text-white',
        ].join(' ')}
      >
        <span className="shrink-0 text-base leading-none" aria-hidden="true">{countryFlag(countryCode)}</span>
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{countryName}</span>
            <ChevronDown
              size={13}
              aria-hidden="true"
              className={`shrink-0 text-[#9fb0cc] transition-transform duration-[var(--duration-standard)] ${open ? 'rotate-180' : ''}`}
            />
          </>
        )}
      </button>

      {/* Country sections sub-list */}
      {open && !collapsed && (
        <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
          {COUNTRY_SECTIONS.map(({ id, label }) => {
            const sectionActive = activeSection === id
            return (
              <li key={id}>
                <Link
                  href={`/nextinations/${countrySlug}/${id}`}
                  aria-current={sectionActive ? 'page' : undefined}
                  className={[
                    'block rounded-[var(--radius-sidebar-row)] px-2 py-1.5 text-xs font-medium transition-colors',
                    sectionActive
                      ? 'bg-gold-soft/25 text-white font-semibold'
                      : 'text-[#7a91b0] hover:bg-white/5 hover:text-white',
                  ].join(' ')}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}

// ─── Sidebar group label ──────────────────────────────────────────────────────

function GroupLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) return <div className="my-2 h-px bg-white/8" />
  return (
    <p className="mb-1 mt-5 px-3 text-[10px] font-bold uppercase tracking-widest text-[#4a6080]">
      {label}
    </p>
  )
}

// ─── Sidebar nav ──────────────────────────────────────────────────────────────
// Implements the Kolmari sidebar IA:
//
//   [ungrouped] Dashboard
//   EXPLORE     Destinations · Countries
//   MY PLAN     Destinations · Pathways · My Plan · Flutter Mode · Documents
//   CONNECT     Kolmari Klub
//   TOOLS       Cost Calculator · Greenbook · Settings

function SidebarNav({
  pathname,
  collapsed,
  savedItems,
}: {
  pathname: string
  collapsed: boolean
  savedItems: SavedItem[]
}) {
  const [openCountries, setOpenCountries] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    if (pathname.startsWith('/nexitnation/')) initial.add('__nexit-world__')
    // Auto-open My Nextinations group when user is on any /nextinations route
    if (pathname.startsWith('/nextinations')) initial.add('__my-nextinations__')
    // Auto-open the active country's section list
    const match = pathname.match(/^\/nextinations\/([^/]+)/)
    if (match) initial.add(match[1])
    return initial
  })

  function toggleCountry(slug: string) {
    setOpenCountries((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  const myDestinationsActive = pathname.startsWith('/nextinations') || pathname === '/saved'

  return (
    <nav aria-label="Main navigation" className="space-y-0.5">

      {/* ── Dashboard (standalone) ────────────────────────────────────── */}
      <SidebarItem href="/dashboard" label="Dashboard" icon={LayoutDashboard}
        active={isActive(pathname, '/dashboard')} collapsed={collapsed} />

      {/* ── EXPLORE ───────────────────────────────────────────────────── */}
      <GroupLabel label="Explore" collapsed={collapsed} />

      {/* Destinations — expandable with region sub-list */}
      {collapsed ? (
        <SidebarItem href="/nexitnation" label="Destinations" icon={Globe2}
          active={isActive(pathname, '/nexitnation')} collapsed />
      ) : (
        <div>
          <div className={[
            'flex items-center rounded-[var(--radius-sidebar-row)] transition-colors',
            isActive(pathname, '/nexitnation')
              ? 'bg-gold-soft/25 text-white font-semibold'
              : 'text-[#9fb0cc] hover:bg-white/5 hover:text-white',
          ].join(' ')}>
            <Link href="/nexitnation" className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2 text-sm font-medium">
              <Globe2 size={16} aria-hidden="true" className="shrink-0" />
              <span>Destinations</span>
            </Link>
            <button
              type="button"
              onClick={() => toggleCountry('__nexit-world__')}
              aria-label="Toggle regions"
              aria-expanded={openCountries.has('__nexit-world__')}
              className="mr-1 grid size-8 place-items-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              <ChevronDown size={13} className={`transition-transform ${openCountries.has('__nexit-world__') ? 'rotate-180' : ''}`} />
            </button>
          </div>
          {openCountries.has('__nexit-world__') && (
            <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
              {regionList.map((region) => (
                <li key={region.slug}>
                  <Link
                    href={`/nexitnation/${region.slug}`}
                    aria-current={isActive(pathname, `/nexitnation/${region.slug}`) ? 'page' : undefined}
                    className="block rounded-[var(--radius-sidebar-row)] px-2 py-1.5 text-xs font-medium text-[#7a91b0] transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {region.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Saved (shortlist) */}
      {NAV_EXPLORE_SAVED.map(({ href, label, icon }) => (
        <SidebarItem key={href} href={href} label={label} icon={icon}
          active={isActive(pathname, href)} collapsed={collapsed} />
      ))}

      {/* ── PLAN ──────────────────────────────────────────────────────── */}
      <GroupLabel label="Plan" collapsed={collapsed} />
      {NAV_PLAN.map(({ href, label, icon }) => (
        <SidebarItem key={href} href={href} label={label} icon={icon}
          active={isActive(pathname, href)} collapsed={collapsed} />
      ))}

      {/* ── CONNECT ───────────────────────────────────────────────────── */}
      <GroupLabel label="Connect" collapsed={collapsed} />
      {NAV_CONNECT.map(({ href, label, icon }) => (
        <SidebarItem key={href} href={href} label={label} icon={icon}
          active={isActive(pathname, href)} collapsed={collapsed} />
      ))}

      {/* ── Saved destinations sub-tree (under Destinations) ─────────── */}
      {!collapsed && myDestinationsActive && savedItems.length > 0 && (
        <ul className="mt-0.5 border-l border-white/10 pl-3 ml-4 space-y-0.5">
          {savedItems.map((item) =>
            item.slug ? (
              <CountryTreeItem
                key={item.id}
                countrySlug={item.slug}
                countryName={item.name}
                countryCode={item.code}
                open={openCountries.has(item.id)}
                onToggle={() => toggleCountry(item.id)}
                pathname={pathname}
                collapsed={false}
              />
            ) : (
              <li key={item.id}>
                <Link
                  href="/nexitnation"
                  className="flex items-center gap-2.5 rounded-[var(--radius-sidebar-row)] px-3 py-2 text-sm font-medium text-[#9fb0cc] transition-colors hover:bg-white/5 hover:text-white"
                >
                  <span className="shrink-0 text-base leading-none" aria-hidden="true">{countryFlag(item.code)}</span>
                  <span className="flex-1 truncate">{item.name}</span>
                </Link>
              </li>
            ),
          )}
        </ul>
      )}

      {/* Collapsed: show saved destination flags as icon rows */}
      {collapsed && savedItems.length > 0 && (
        <ul className="mt-0.5 space-y-0.5">
          {savedItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.slug ? `/nextinations/${item.slug}/overview` : '/nexitnation'}
                title={item.name}
                className="flex justify-center rounded-[var(--radius-sidebar-row)] px-2 py-2 text-base leading-none text-[#9fb0cc] hover:bg-white/5"
              >
                {countryFlag(item.code)}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* ── TOOLS ─────────────────────────────────────────────────────── */}
      <GroupLabel label="Tools" collapsed={collapsed} />
      {NAV_TOOLS.map(({ href, label, icon }) => (
        <SidebarItem key={href} href={href} label={label} icon={icon}
          active={isActive(pathname, href)} collapsed={collapsed} />
      ))}

      {/* ── BOTTOM (Settings / Profile) ───────────────────────────────── */}
      <div className="mt-4 border-t border-white/8 pt-3 space-y-0.5">
        {NAV_BOTTOM.map(({ href, label, icon }) => (
          <SidebarItem key={href} href={href} label={label} icon={icon}
            active={isActive(pathname, href)} collapsed={collapsed} />
        ))}
      </div>

    </nav>
  )
}

// ─── App Shell ───────────────────────────────────────────────────────────────

export function AppShell({
  children,
  email,
  wizardStatus,
}: {
  children: React.ReactNode
  email: string
  wizardStatus: WizardStatus
}) {
  const pathname = usePathname()
  const router = useRouter()

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    return readCollapsed()
  })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [noticesOpen, setNoticesOpen] = useState(false)

  const drawerRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const profileComplete = wizardStatus === 'completed'
  const initials = email.slice(0, 1).toUpperCase()

  function toggleCollapse() {
    const next = !collapsed
    setCollapsed(next)
    writeCollapsed(next)
  }

  // Saved nextinations for the sidebar tree — sourced from the planning board.
  const { items: boardItems } = useNextinationBoard()
  const savedItems: SavedItem[] = boardItems.map((x) => ({
    id: x.id,
    name: x.name,
    code: x.countryCode,
    slug: countryWorkspaceSlug(x.country),
  }))

  // Close menus on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Trap focus in drawer, close on Escape
  useEffect(() => {
    if (!drawerOpen) return
    const el = drawerRef.current
    if (!el) return
    el.querySelector<HTMLElement>('a, button')?.focus()
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [drawerOpen])

  async function logout() {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const sidebarWidth = collapsed ? '60px' : '248px'

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-canvas"
      style={{ ['--sidebar-w' as string]: sidebarWidth }}
    >
      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <aside
        style={{ width: sidebarWidth }}
        className="fixed inset-y-0 left-0 z-30 hidden flex-col overflow-y-auto overflow-x-hidden border-r border-white/8 bg-navy-deep transition-[width] duration-[var(--duration-panel)] ease-[var(--ease-panel)] md:flex"
        aria-label="Workspace navigation"
      >
        {/* Logo + collapse toggle */}
        <div className={`mb-4 flex items-center pt-5 ${collapsed ? 'justify-center px-2' : 'justify-between px-3'}`}>
          {!collapsed && (
            <Link href="/dashboard" aria-label="Kolmari home" className="inline-flex items-center px-1">
              <Image
                src="/brand/NexitWordMark.svg"
                alt="Kolmari"
                width={108}
                height={28}
                style={{ width: 'auto', height: 28 }}
                priority
              />
            </Link>
          )}
          <button
            type="button"
            onClick={toggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            className={[
              'grid place-items-center rounded-[var(--radius-sidebar-row)] text-[#9fb0cc] hover:bg-white/5 hover:text-white transition-colors',
              collapsed ? 'size-10' : 'size-8 shrink-0',
            ].join(' ')}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          <SidebarNav
              pathname={pathname}
              collapsed={collapsed}
              savedItems={savedItems}
            />
        </div>

        {/* Profile readiness footer */}
        {!collapsed && (
          <div className="mx-2 mb-4 rounded-[var(--radius-card)] border border-white/10 bg-navy-card p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#cdd7e8]">Move Readiness</p>
            <p className="mt-2 text-sm font-bold text-white">
              {profileComplete ? 'Profile complete' : 'Not started'}
            </p>
            <Link
              href="/profile-wizard"
              className="mt-2 inline-block text-xs font-bold text-gold hover:text-gold-soft"
            >
              {profileComplete ? 'Edit profile' : 'Start Wizard'}
            </Link>
          </div>
        )}
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div
        style={{ marginLeft: sidebarWidth }}
        className="hidden min-w-0 transition-[margin-left] duration-[var(--duration-panel)] ease-[var(--ease-panel)] md:block"
      >
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-line bg-canvas/95 px-6 py-3 backdrop-blur md:px-10">
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative ml-auto">
              <button
                type="button"
                onClick={() => setNoticesOpen((v) => !v)}
                aria-label="Notifications"
                aria-expanded={noticesOpen}
                className="relative grid size-10 place-items-center rounded-[var(--radius-field)] border border-line bg-white text-navy"
              >
                <Bell size={18} />
                <span className="absolute right-2.5 top-2.5 size-2 rounded-full border border-white bg-danger" aria-hidden="true" />
              </button>
              {noticesOpen && (
                <div className="absolute right-0 top-12 w-72 rounded-[var(--radius-card)] border border-line bg-white p-4 text-sm shadow-[var(--shadow-shell)]">
                  <p className="font-bold text-navy">
                    {profileComplete ? 'Your Profile is ready' : 'Personalized matches are off'}
                  </p>
                  <p className="mt-1 text-muted">
                    {profileComplete
                      ? 'Review Pathways or continue your Move Plan.'
                      : 'Complete your Profile to see personalized matches.'}
                  </p>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-label="Account menu"
                aria-expanded={userMenuOpen}
                className="flex items-center gap-2 rounded-[var(--radius-field)] border border-line bg-white p-1.5 pr-3 text-sm font-semibold text-navy"
              >
                <span className="grid size-7 place-items-center rounded-full bg-navy text-xs font-bold text-white">
                  {initials}
                </span>
                <span className="hidden max-w-32 truncate lg:block">{email.split('@')[0]}</span>
                <ChevronDown size={13} aria-hidden="true" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-52 rounded-[var(--radius-card)] border border-line bg-white p-2 shadow-[var(--shadow-shell)]">
                  <Link href="/profile-wizard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-[var(--radius-sidebar-row)] px-3 py-2 text-sm text-navy hover:bg-canvas">
                    <UserRound size={15} aria-hidden="true" />
                    {profileComplete ? 'Edit Profile' : 'Build My Profile'}
                  </Link>
                  <Link href="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-[var(--radius-sidebar-row)] px-3 py-2 text-sm text-navy hover:bg-canvas">
                    <Settings size={15} aria-hidden="true" />Settings
                  </Link>
                  <button type="button" onClick={logout} className="flex w-full items-center gap-2 rounded-[var(--radius-sidebar-row)] px-3 py-2 text-left text-sm text-danger hover:bg-canvas">
                    <LogOut size={15} aria-hidden="true" />Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content — full available width per 04-LAYOUTS.md §17 */}
        <main className="px-6 pt-6 pb-[72px] md:px-7">
          {children}
        </main>
      </div>

      {/* ── Mobile layout (replaces the grid) ─────────────────────────────── */}
      <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden md:hidden">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 border-b border-line bg-canvas/95 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav-drawer"
              className="grid size-10 place-items-center rounded-[var(--radius-field)] border border-line bg-white text-navy"
            >
              <Menu size={19} />
            </button>
            <Wordmark compact href="/dashboard" />
            <div className="relative ml-auto">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-label="Account menu"
                aria-expanded={userMenuOpen}
                className="grid size-10 place-items-center rounded-[var(--radius-field)] border border-line bg-white text-navy"
              >
                <span className="grid size-7 place-items-center rounded-full bg-navy text-xs font-bold text-white">
                  {initials}
                </span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-52 rounded-[var(--radius-card)] border border-line bg-white p-2 shadow-[var(--shadow-shell)] z-50">
                  <Link href="/profile-wizard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 rounded-[var(--radius-sidebar-row)] px-3 py-2 text-sm text-navy hover:bg-canvas">
                    <UserRound size={15} aria-hidden="true" />
                    {profileComplete ? 'Edit Profile' : 'Build My Profile'}
                  </Link>
                  <button type="button" onClick={logout} className="flex w-full items-center gap-2 rounded-[var(--radius-sidebar-row)] px-3 py-2 text-left text-sm text-danger hover:bg-canvas">
                    <LogOut size={15} aria-hidden="true" />Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile page content */}
        <main className="min-w-0 flex-1 px-4 py-6 pb-10">
          {children}
        </main>
      </div>

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-deep/60 md:hidden"
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <div
        id="mobile-nav-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-[min(88vw,320px)] flex-col overflow-y-auto bg-navy-deep px-2 py-5 transition-transform duration-[var(--duration-panel)] ease-[var(--ease-panel)] md:hidden',
          drawerOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="mb-5 flex items-center justify-between px-2">
          <Link href="/dashboard" aria-label="Kolmari home" className="inline-flex items-center" onClick={() => setDrawerOpen(false)}>
            <Image src="/brand/NexitWordMark.svg" alt="Kolmari" width={100} height={26} style={{ width: 'auto', height: 26 }} priority />
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation"
            className="grid size-10 place-items-center rounded-[var(--radius-field)] text-[#9fb0cc] hover:bg-white/5 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <SidebarNav
          pathname={pathname}
          collapsed={false}
          savedItems={savedItems}
        />

        <div className="mx-1 mt-4 rounded-[var(--radius-card)] border border-white/10 bg-navy-card p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#cdd7e8]">Move Readiness</p>
          <p className="mt-1 text-sm font-bold text-white">
            {profileComplete ? 'Profile complete' : 'Not started'}
          </p>
          <Link
            href="/profile-wizard"
            onClick={() => setDrawerOpen(false)}
            className="mt-1 inline-block text-xs font-bold text-gold hover:text-gold-soft"
          >
            {profileComplete ? 'Edit profile' : 'Start Wizard'}
          </Link>
        </div>
      </div>

    </div>
  )
}
