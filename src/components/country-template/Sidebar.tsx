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

const ICONS = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  world: <><path d="M12 21s-7-6.3-7-11a7 7 0 0114 0c0 4.7-7 11-7 11z" /><circle cx="12" cy="10" r="2.6" /></>,
  plan: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 3v18M11 8h6M11 12h4" /></>,
  connect: <><circle cx="8" cy="8" r="3" /><circle cx="16" cy="8" r="3" /><path d="M2 21a6 6 0 0112 0M10 21a6 6 0 0112 0" /></>,
  tools: <><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></>,
}

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
  const worldActive = active('/your-world') || active('/destinations') || onCountry
  const planActive = active('/command-center') || active('/pathways') || active('/my-plan') || active('/flutter') || active('/checklist') || active('/documents')
  const toolsActive = active('/cost-calculator') || active('/greenbook') || active('/passportindex') || active('/astrocartography')

  // Collapsible sections (Plan, Tools). Default open = the active section.
  const [openSecs, setOpenSecs] = useState<Record<string, boolean>>({})
  const openState = useMemo(() => ({
    plan: openSecs.plan ?? planActive,
    tools: openSecs.tools ?? toolsActive,
  }), [openSecs, planActive, toolsActive])
  const toggle = (key: string, fallback: boolean) =>
    setOpenSecs((prev) => ({ ...prev, [key]: !(prev[key] ?? fallback) }))

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
          {/* Dashboard */}
          <Link className={`sb-item sb-sec${active('/dashboard') ? ' active' : ''}`} href="/dashboard" title="Dashboard">
            <Icon>{ICONS.dashboard}</Icon>
            <span className="lbl">{PRODUCT_COPY.dashboard}</span>
          </Link>

          {/* Your World — floating country menu */}
          <div className="sb-flyout-anchor" ref={worldRowRef}>
            <Link className={`sb-item sb-sec${worldActive ? ' active' : ''}`} href="/your-world" title="Your World">
              <Icon>{ICONS.world}</Icon>
              <span className="lbl">Your World</span>
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

          {/* Plan */}
          <button
            type="button"
            className={`sb-item sb-sec${planActive ? ' active' : ''}`}
            aria-expanded={openState.plan}
            title="Plan"
            onClick={() => {
              if (document.body.classList.contains('rail-collapsed')) { router.push('/command-center'); return }
              toggle('plan', planActive)
            }}
          >
            <Icon>{ICONS.plan}</Icon>
            <span className="lbl">Plan</span>
            <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <div className="sb-group" hidden={!openState.plan}>
            <Link className={`sb-sub${active('/command-center') ? ' active' : ''}`} href="/command-center">Command Center</Link>
            <Link className={`sb-sub${active('/pathways') ? ' active' : ''}`} href="/pathways">{PRODUCT_COPY.pathways}</Link>
            <Link className={`sb-sub${active('/my-plan') ? ' active' : ''}`} href="/my-plan">{PRODUCT_COPY.plan}</Link>
            <Link className={`sb-sub sb-sub-flutter${active('/flutter') || active('/checklist') ? ' active' : ''}`} href="/flutter">
              <ButterflyMark className="sb-sub-bf" filled={planReady > 75} />
              {PRODUCT_COPY.flutterMode}
            </Link>
            <Link className={`sb-sub${active('/documents') ? ' active' : ''}`} href="/documents">{PRODUCT_COPY.documents}</Link>
          </div>

          {/* Connect */}
          <Link className={`sb-item sb-sec${active('/community') ? ' active' : ''}`} href="/community" title="Connect">
            <Icon>{ICONS.connect}</Icon>
            <span className="lbl">{PRODUCT_COPY.kolmariKlub}</span>
          </Link>

          {/* Tools */}
          <button
            type="button"
            className={`sb-item sb-sec${toolsActive ? ' active' : ''}`}
            aria-expanded={openState.tools}
            title="Tools"
            onClick={() => {
              if (document.body.classList.contains('rail-collapsed')) { router.push('/cost-calculator'); return }
              toggle('tools', toolsActive)
            }}
          >
            <Icon>{ICONS.tools}</Icon>
            <span className="lbl">Tools</span>
            <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <div className="sb-group" hidden={!openState.tools}>
            <Link className={`sb-sub${active('/cost-calculator') ? ' active' : ''}`} href="/cost-calculator">{PRODUCT_COPY.costCalculator}</Link>
            <Link className={`sb-sub${active('/greenbook') ? ' active' : ''}`} href="/greenbook">{PRODUCT_COPY.greenbook}</Link>
            <Link className={`sb-sub${active('/passportindex') ? ' active' : ''}`} href="/passportindex">PassportIndex</Link>
            <Link className={`sb-sub${active('/astrocartography') ? ' active' : ''}`} href="/astrocartography">Astrocartography</Link>
          </div>
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
