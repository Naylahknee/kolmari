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
import type { WizardStatus } from '@/lib/profile'

/**
 * Approved navigation items mapped to existing routes.
 * Labels follow the locked Nexit product lexicon.
 * Do not change route URLs unless a migration is explicitly approved.
 */
const NAV_ITEMS = [
  { href: '/dashboard',      label: 'Dashboard',          icon: LayoutDashboard },
  { href: '/nexitnation',    label: 'Nexitnation',         icon: MapPinned },
  { href: '/countries',      label: 'Countries',           icon: Globe2 },
  { href: '/nextinations',   label: 'My Nextinations',     icon: Compass },
  { href: '/pathways',       label: 'Nexit Pathways',      icon: Route },
  { href: '/nexit-plan',     label: 'Nexit Plan',          icon: NotebookTabs },
  { href: '/cost-calculator',label: 'Cost Calculator',     icon: Calculator },
  { href: '/greenbook',      label: 'Greenbook',           icon: BookOpen },
  { href: '/documents',      label: 'My Documents',        icon: FileText },
  { href: '/settings',       label: 'Settings',            icon: Settings },
] as const

/** Five primary destinations shown in the mobile bottom bar */
const MOBILE_PRIMARY_HREFS = ['/dashboard', '/nexitnation', '/pathways', '/nexit-plan']

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

// ─── Desktop sidebar nav item ────────────────────────────────────────────────

function SidebarItem({ href, label, icon: Icon, active }: { href: string; label: string; icon: typeof Globe2; active: boolean }) {
  return (
    <Link
      href={href}
      className={[
        'flex items-center gap-3 rounded-[var(--radius-sidebar-row)] px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-gold text-navy-deep font-semibold'
          : 'text-[#9fb0cc] hover:bg-white/5 hover:text-white',
      ].join(' ')}
      aria-current={active ? 'page' : undefined}
    >
      <Icon size={16} aria-hidden="true" />
      <span>{label}</span>
    </Link>
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

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [noticesOpen, setNoticesOpen] = useState(false)

  const drawerRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const profileComplete = wizardStatus === 'completed'
  const initials = email.slice(0, 1).toUpperCase()

  const mobilePrimary = NAV_ITEMS.filter(({ href }) => MOBILE_PRIMARY_HREFS.includes(href))

  // Close menus on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Trap focus in drawer and close on Escape
  useEffect(() => {
    if (!drawerOpen) return
    const el = drawerRef.current
    if (!el) return
    const firstFocusable = el.querySelector<HTMLElement>('a, button')
    firstFocusable?.focus()
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

  return (
    <div className="min-h-screen bg-canvas md:grid md:grid-cols-[248px_1fr]">

      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col overflow-y-auto border-r border-white/8 bg-navy-deep px-3 py-5 md:flex"
        aria-label="Workspace navigation"
      >
        {/* Logo */}
        <div className="mb-5 px-2 pt-1">
          <Link href="/dashboard" aria-label="Nexit home" className="inline-flex items-center">
            {/* Approved dark-surface wordmark asset — do not recreate in CSS */}
            <Image
              src="/brand/NexitWordMark.svg"
              alt="Nexit"
              width={108}
              height={28}
              style={{ width: 'auto', height: 28 }}
              priority
            />
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-0.5" aria-label="Main navigation">
          {NAV_ITEMS.map(({ href, label, icon }) => (
            <SidebarItem key={href} href={href} label={label} icon={icon} active={isActive(pathname, href)} />
          ))}
        </nav>

        {/* Profile readiness footer */}
        <div className="mt-4 rounded-[var(--radius-card)] border border-white/10 bg-navy-card p-4 text-center">
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
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="min-w-0 md:col-start-2">

        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-line bg-canvas/95 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile: hamburger + wordmark */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav-drawer"
              className="grid size-10 place-items-center rounded-[var(--radius-field)] border border-line bg-white text-navy md:hidden"
            >
              <Menu size={19} />
            </button>
            <div className="md:hidden">
              <Wordmark compact href="/dashboard" />
            </div>

            {/* Desktop: search */}
            <form
              onSubmit={onSearch}
              role="search"
              className="ml-auto hidden max-w-xl flex-1 items-center gap-2 rounded-[var(--radius-field)] border border-line bg-white px-3 md:flex"
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
            <div className="relative ml-auto md:ml-0">
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
        <main className="mx-auto max-w-[1180px] px-4 py-6 pb-24 md:px-8 md:py-8 md:pb-10">
          {children}
        </main>
      </div>

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      {drawerOpen && (
        /* Backdrop */
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
          'fixed inset-y-0 left-0 z-50 flex w-[min(88vw,320px)] flex-col overflow-y-auto bg-navy-deep px-3 py-5 transition-transform duration-[var(--duration-panel)] ease-[var(--ease-panel)] md:hidden',
          drawerOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Drawer header */}
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

        {/* Drawer nav items */}
        <nav className="flex-1 space-y-0.5" aria-label="Main navigation">
          {NAV_ITEMS.map(({ href, label, icon }) => (
            <SidebarItem key={href} href={href} label={label} icon={icon} active={isActive(pathname, href)} />
          ))}
        </nav>

        {/* Drawer profile footer */}
        <div className="mt-4 rounded-[var(--radius-card)] border border-white/10 bg-navy-card p-4">
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
        {/* More — opens the full drawer */}
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
