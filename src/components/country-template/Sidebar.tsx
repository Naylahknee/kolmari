'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PRODUCT_COPY } from '@/config/product-copy'
import { ButterflyMark } from '@/components/kolmari/butterfly-mark'
import { flutterReadiness } from '@/lib/flutter-plan'

function Icon({ children }: { children: React.ReactNode }) {
  return <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor">{children}</svg>
}

type Match = { slug: string; name: string; code: string }

// One icon per menu item. Section headers render NO icon when expanded; these
// icons live on the individual items (and on the header only in collapsed mode,
// where the rail becomes an icon strip).
const ICONS: Record<string, React.ReactNode> = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  world: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" /></>,
  command: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></>,
  pathways: <><circle cx="6" cy="6" r="2.4" /><circle cx="6" cy="18" r="2.4" /><circle cx="18" cy="12" r="2.4" /><path d="M6 8.4v7.2M8.2 6h4.6a3 3 0 013 3v.6M8.2 18h4.6a3 3 0 003-3v-.6" /></>,
  myPlan: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 3v18M12 8h4M12 12h4" /></>,
  documents: <><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
  connect: <><circle cx="8" cy="8" r="3" /><circle cx="16" cy="8" r="3" /><path d="M2 21a6 6 0 0112 0M10 21a6 6 0 0112 0" /></>,
  calculator: <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v3M8 18h4" /></>,
  greenbook: <><rect x="4" y="4" width="7" height="16" rx="1.5" /><rect x="13" y="4" width="7" height="16" rx="1.5" /></>,
  passport: <><rect x="5" y="3" width="14" height="18" rx="2" /><circle cx="12" cy="10" r="2.6" /><path d="M9.5 15.5h5" /></>,
  astro: <><circle cx="12" cy="12" r="9" /><path d="m12 6.5 1.3 2.9 3.2.3-2.4 2.1.7 3.1L12 15.3 9.2 17l.7-3.1-2.4-2.1 3.2-.3z" /></>,
  tools: <><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></>,
}

type Item = { href: string; label: string; icon: keyof typeof ICONS; flutter?: boolean; world?: boolean }
type Section = { key: string; label: string; primary: string; icon: keyof typeof ICONS; items: Item[] }

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const active = (route: string) => pathname === route || pathname.startsWith(`${route}/`)

  const [matches, setMatches] = useState<Match[]>([])
  useEffect(() => {
    let cancelled = false
    fetch('/api/matches')
      .then((res) => (res.ok ? res.json() : { matches: [] }))
      .then((data) => { if (!cancelled) setMatches(Array.isArray(data.matches) ? data.matches : []) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const [planReady, setPlanReady] = useState(0)
  useEffect(() => {
    let cancelled = false
    fetch('/api/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (!cancelled && Array.isArray(data?.completed_tasks)) setPlanReady(flutterReadiness(data.completed_tasks)) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const onCountry = pathname.startsWith('/nextinations/')

  const SECTIONS: Section[] = useMemo(() => [
    {
      key: 'explore', label: 'Explore', primary: '/your-world', icon: 'world',
      items: [{ href: '/your-world', label: 'Your World', icon: 'world', world: true }],
    },
    {
      key: 'plan', label: 'Plan', primary: '/command-center', icon: 'command',
      items: [
        { href: '/command-center', label: 'Command Center', icon: 'command' },
        { href: '/pathways', label: PRODUCT_COPY.pathways, icon: 'pathways' },
        { href: '/my-plan', label: PRODUCT_COPY.plan, icon: 'myPlan' },
        { href: '/flutter', label: PRODUCT_COPY.flutterMode, icon: 'documents', flutter: true },
        { href: '/documents', label: PRODUCT_COPY.documents, icon: 'documents' },
      ],
    },
    {
      key: 'connect', label: 'Connect', primary: '/community', icon: 'connect',
      items: [{ href: '/community', label: PRODUCT_COPY.kolmariKlub, icon: 'connect' }],
    },
    {
      key: 'tools', label: 'Tools', primary: '/cost-calculator', icon: 'tools',
      items: [
        { href: '/cost-calculator', label: PRODUCT_COPY.costCalculator, icon: 'calculator' },
        { href: '/greenbook', label: PRODUCT_COPY.greenbook, icon: 'greenbook' },
        { href: '/passportindex', label: 'PassportIndex', icon: 'passport' },
        { href: '/astrocartography', label: 'Astrocartography', icon: 'astro' },
      ],
    },
  ], [])

  const sectionActive = (s: Section) =>
    s.items.some((it) => active(it.href)) || (s.key === 'explore' && onCountry)

  // Collapsible sections. Default open = the active section (or explore/plan).
  const [openSecs, setOpenSecs] = useState<Record<string, boolean>>({})
  const isOpen = (s: Section) => openSecs[s.key] ?? (sectionActive(s) || s.key === 'explore' || s.key === 'plan')
  const toggle = (s: Section) =>
    setOpenSecs((prev) => ({ ...prev, [s.key]: !(prev[s.key] ?? (sectionActive(s) || s.key === 'explore' || s.key === 'plan')) }))

  // Your World countries → floating menu (fixed-positioned so the rail's overflow
  // doesn't clip it).
  const [worldOpen, setWorldOpen] = useState(false)
  const [worldPos, setWorldPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const worldRowRef = useRef<HTMLDivElement>(null)
  const worldFlyRef = useRef<HTMLDivElement>(null)
  const openWorld = () => {
    const r = worldRowRef.current?.getBoundingClientRect()
    if (r) setWorldPos({ top: r.top, left: r.right + 10 })
    setWorldOpen(true)
  }
  useEffect(() => {
    if (!worldOpen) return
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (worldFlyRef.current?.contains(t) || worldRowRef.current?.contains(t)) return
      setWorldOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setWorldOpen(false) }
    const onScroll = () => setWorldOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll, true)
    }
  }, [worldOpen])

  const renderItem = (it: Item) => {
    const isActive = active(it.href)
    if (it.world) {
      return (
        <div className="sb-flyout-anchor" ref={worldRowRef} key={it.href}>
          <Link className={`sb-link${isActive || onCountry ? ' active' : ''}`} href={it.href} title={it.label}>
            <Icon>{ICONS[it.icon]}</Icon>
            <span className="lbl">{it.label}</span>
          </Link>
          {matches.length > 0 && (
            <button
              type="button"
              className="sb-flyout-toggle"
              aria-label="Your destinations"
              aria-expanded={worldOpen}
              onClick={() => (worldOpen ? setWorldOpen(false) : openWorld())}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          )}
        </div>
      )
    }
    return (
      <Link key={it.href} className={`sb-link${isActive ? ' active' : ''}`} href={it.href} title={it.label}>
        {it.flutter
          ? <ButterflyMark className="ic sb-link-bf" filled={planReady > 75} />
          : <Icon>{ICONS[it.icon]}</Icon>}
        <span className="lbl">{it.label}</span>
      </Link>
    )
  }

  return (
    <aside className="rail">
      <nav
        className="rail-nav"
        aria-label="Main"
        onClick={(event) => {
          if (window.innerWidth <= 900 && (event.target as HTMLElement).closest('a')) {
            document.body.classList.remove('rail-collapsed')
          }
        }}
      >
        <div className="rail-scroll">
          {/* Dashboard — standalone top item */}
          <Link className={`sb-link sb-top${active('/dashboard') ? ' active' : ''}`} href="/dashboard" title="Dashboard">
            <Icon>{ICONS.dashboard}</Icon>
            <span className="lbl">{PRODUCT_COPY.dashboard}</span>
          </Link>

          {SECTIONS.map((s) => (
            <div className="sb-sec-wrap" key={s.key}>
              <button
                type="button"
                className={`sb-head${sectionActive(s) ? ' active' : ''}`}
                aria-expanded={isOpen(s)}
                title={s.label}
                onClick={() => {
                  if (document.body.classList.contains('rail-collapsed')) { router.push(s.primary); return }
                  toggle(s)
                }}
              >
                {/* Icon shows only when the rail is collapsed (icon strip). */}
                <Icon>{ICONS[s.icon]}</Icon>
                <span className="sb-head-lbl">{s.label}</span>
                <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <div className="sb-group" hidden={!isOpen(s)}>
                {s.items.map(renderItem)}
              </div>
            </div>
          ))}
        </div>

        {/* Account avatar pinned to the bottom */}
        <Link className={`sb-user${active('/settings') ? ' active' : ''}`} href="/settings" title="Account" aria-label="Account">
          <span className="sb-user-av">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" width="16" height="16" aria-hidden="true"><circle cx="12" cy="8" r="3.4" /><path d="M5.5 20a6.5 6.5 0 0113 0" /></svg>
          </span>
          <span className="lbl">Account</span>
        </Link>
      </nav>

      {/* Floating Your World country menu */}
      {worldOpen && (
        <div ref={worldFlyRef} className="sb-flyout" style={{ position: 'fixed', top: worldPos.top, left: worldPos.left }} role="menu">
          <p className="sb-flyout-title">Your destinations</p>
          {matches.map((m) => (
            <Link
              key={m.slug}
              role="menuitem"
              className={`sb-fly-item${pathname.startsWith(`/nextinations/${m.slug}`) ? ' active' : ''}`}
              href={`/nextinations/${m.slug}/v2/overview`}
              onClick={() => setWorldOpen(false)}
            >
              <span className="sb-cc">{m.code}</span>
              <span className="nm">{m.name}</span>
            </Link>
          ))}
          <Link role="menuitem" className="sb-fly-item sb-fly-all" href="/your-world" onClick={() => setWorldOpen(false)}>
            <span className="sb-cc" aria-hidden="true">＋</span>
            <span className="nm">Browse all destinations</span>
          </Link>
        </div>
      )}
    </aside>
  )
}
