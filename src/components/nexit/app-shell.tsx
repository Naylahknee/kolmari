'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useEffect, useRef, useState } from 'react'
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
  MapPinned,
  Menu,
  NotebookTabs,
  Route,
  Search,
  Settings,
  UserRound,
  X,
} from 'lucide-react'
import { Wordmark } from './wordmark'
import { useSavedNextinations } from './use-saved-nextinations'
import { countryFlag } from '@/lib/countries'
import type { WizardStatus } from '@/lib/profile'

// ─── Sidebar section groups ──────────────────────────────────────────────────

type NavSection = {
  label: string
  items: { href: string; label: string; icon: typeof Globe2 }[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Discover',
    items: [
      { href: '/dashboard',    label: 'Dashboard',     icon: LayoutDashboard },
      { href: '/nexitnation',  label: 'Nexitnation',   icon: MapPinned },
      { href: '/countries',    label: 'Nextinations',  icon: Globe2 },
    ],
  },
  {
    label: 'My Nexit',
    items: [
      { href: '/nextinations', label: 'My Nextinations', icon: Compass },
    ],
  },
  {
    label: 'Planning',
    items: [
      { href: '/pathways',        label: 'Nexit Pathways',  icon: Route },
      { href: '/nexit-plan',      label: 'Nexit Plan',       icon: NotebookTabs },
      { href: '/cost-calculator', label: 'Cost Calculator',  icon: Calculator },
      { href: '/greenbook',       label: 'Greenbook',        icon: BookOpen },
      { href: '/documents',       label: 'My Documents',     icon: FileText },
      { href: '/settings',        label: 'Settings',         icon: Settings },
    ],
  },
]

// Flat list for mobile bottom nav (preserved)
const ALL_NAV_ITEMS = NAV_SECTIONS.flatMap((s) => s.items)
const MOBILE_PRIMARY_HREFS = ['/dashboard', '/nexitnation', '/pathways', '/nexit-plan']

// Country section labels (matches tab IDs in tabs.ts)
const COUNTRY_SECTIONS = [
  { id: 'overview',           label: 'Overview' },
  { id: 'why-you',            label: 'Why This Matches You' },
  { id: 'economic-profile',   label: 'Economic Profile' },
  { id: 'cost-of-living',     label: 'Cost of Living' },
  { id: 'pathways',           label: 'Nexit Pathways' },
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

const COLLAPSE_KEY = 'nexit:sidebar-collapsed'

function readCollapsed() {
  try { return window.localStorage.getItem(COLLAPSE_KEY) === 'true' } catch { return false }
}
function writeCollapsed(v: boolean) {
  try { window.localStorage.setItem(COLLAPSE_KEY, String(v)) } catch { /* noop */ }
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

// ─── Sidebar section label ────────────────────────────────────────────────────

function SidebarSectionLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) return <div className="my-1 h-px bg-white/8" />
  return (
    <p className="mb-1 mt-4 px-3 text-[10px] font-bold uppercase tracking-widest text-[#4a6080] first:mt-2">
      {label}
    </p>
  )
}

// ─── Sidebar nav (shared between desktop sidebar + mobile drawer) ─────────────

function SidebarNav({
  pathname,
  collapsed,
  savedCountries,
}: {
  pathname: string
  collapsed: boolean
  savedCountries: { slug: string; name: string; code: string }[]
}) {
  // Track which saved countries have their section sub-tree open
  const [openCountries, setOpenCountries] = useState<Set<string>>(() => {
    // Auto-open the currently active country
    const match = pathname.match(/^\/nextinations\/([^/]+)/)
    return match ? new Set([match[1]]) : new Set()
  })

  function toggleCountry(slug: string) {
    setOpenCountries((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  return (
    <nav className="flex-1 space-y-0" aria-label="Main navigation">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label}>
          <SidebarSectionLabel label={section.label} collapsed={collapsed} />
          <ul className="space-y-0.5">
            {section.items.map(({ href, label, icon }) => (
              <li key={href}>
                <SidebarItem
                  href={href} label={label} icon={icon}
                  active={isActive(pathname, href)}
                  collapsed={collapsed}
                />
                {/* Inject saved country tree under My Nextinations */}
                {href === '/nextinations' && savedCountries.length > 0 && (
                  <ul className="mt-0.5 space-y-0.5">
                    {savedCountries.map((c) => (
                      <CountryTreeItem
                        key={c.slug}
                        countrySlug={c.slug}
                        countryName={c.name}
                        countryCode={c.code}
                        open={openCountries.has(c.slug)}
                        onToggle={() => toggleCountry(c.slug)}
                        pathname={pathname}
                        collapsed={collapsed}
                      />
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
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

  const mobilePrimary = ALL_NAV_ITEMS.filter(({ href }) => MOBILE_PRIMARY_HREFS.includes(href))

  function toggleCollapse() {
    const next = !collapsed
    setCollapsed(next)
    writeCollapsed(next)
  }

  // Saved nextinations for the sidebar tree
  const { countries: savedCountries } = useSavedNextinations()

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

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = String(new FormData(e.currentTarget).get('query') ?? '').trim()
    router.push(q ? `/countries?q=${encodeURIComponent(q)}` : '/countries')
  }

  async function logout() {
    await fetch('/api/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const sidebarWidth = collapsed ? '60px' : '248px'

  return (
    <div
      className="min-h-screen bg-canvas"
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
            <Link href="/dashboard" aria-label="Nexit home" className="inline-flex items-center px-1">
              <Image
                src="/brand/NexitWordMark.svg"
                alt="Nexit"
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
              savedCountries={savedCountries}
            />
        </div>

        {/* Profile readiness footer */}
        {!collapsed && (
          <div className="mx-2 mb-4 rounded-[var(--radius-card)] border border-white/10 bg-navy-card p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#cdd7e8]">Nexit Readiness</p>
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
            {/* Desktop: search */}
            <form
              onSubmit={onSearch}
              role="search"
              className="max-w-xl flex-1 items-center gap-2 rounded-[var(--radius-field)] border border-line bg-white px-3 hidden md:flex"
            >
              <Search size={16} className="shrink-0 text-muted" aria-hidden="true" />
              <input
                name="query"
                aria-label="Search Nextinations, Pathways, and more"
                placeholder="Search Nextinations, Pathways, and more…"
                className="h-10 min-w-0 flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-muted"
              />
            </form>

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
                    {profileComplete ? 'Your Nexit Profile is ready' : 'Personalized matches are off'}
                  </p>
                  <p className="mt-1 text-muted">
                    {profileComplete
                      ? 'Review Nexit Pathways or continue your Nexit Plan.'
                      : 'Complete your Nexit Profile to see personalized matches.'}
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
                    {profileComplete ? 'Edit Nexit Profile' : 'Start Nexit Profile'}
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

        {/* Page content */}
        <main className="mx-auto max-w-[960px] px-6 py-10 pb-16 md:px-14">
          {children}
        </main>
      </div>

      {/* ── Mobile layout (replaces the grid) ─────────────────────────────── */}
      <div className="flex min-h-screen flex-col md:hidden">
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
                    {profileComplete ? 'Edit Nexit Profile' : 'Start Nexit Profile'}
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
        <main className="flex-1 px-4 py-6 pb-24">
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
          <Link href="/dashboard" aria-label="Nexit home" className="inline-flex items-center" onClick={() => setDrawerOpen(false)}>
            <Image src="/brand/NexitWordMark.svg" alt="Nexit" width={100} height={26} style={{ width: 'auto', height: 26 }} priority />
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
          savedCountries={savedCountries}
        />

        <div className="mx-1 mt-4 rounded-[var(--radius-card)] border border-white/10 bg-navy-card p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#cdd7e8]">Nexit Readiness</p>
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

      {/* ── Mobile bottom navigation ───────────────────────────────────────── */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-line bg-white px-2 py-2 md:hidden"
        aria-label="Mobile navigation"
      >
        {mobilePrimary.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href)
          const shortLabel = label.replace('Nexit Pathways', 'Pathways').replace('Nexit Plan', 'Plan')
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={[
                'flex min-w-[3rem] flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-semibold',
                active ? 'text-gold-deep' : 'text-muted',
              ].join(' ')}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{shortLabel}</span>
            </Link>
          )
        })}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open full navigation"
          aria-expanded={drawerOpen}
          aria-controls="mobile-nav-drawer"
          className="flex min-w-[3rem] flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-semibold text-muted"
        >
          <Menu size={20} aria-hidden="true" />
          <span>More</span>
        </button>
      </nav>
    </div>
  )
}
