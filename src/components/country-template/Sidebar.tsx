'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { PRODUCT_COPY } from '@/config/product-copy'
import { ButterflyMark } from '@/components/kolmari/butterfly-mark'
import { flutterReadiness } from '@/lib/flutter-plan'

function Icon({ children }: { children: React.ReactNode }) {
  return <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor">{children}</svg>
}

type Match = { slug: string; name: string; code: string }

// Section lead icons (shown alone when the rail is collapsed → four primary icons).
const ICONS = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  explore: <><path d="M12 21s-7-6.3-7-11a7 7 0 0114 0c0 4.7-7 11-7 11z" /><circle cx="12" cy="10" r="2.6" /></>,
  plan: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 3v18M11 8h6M11 12h4" /></>,
  connect: <><circle cx="8" cy="8" r="3" /><circle cx="16" cy="8" r="3" /><path d="M2 21a6 6 0 0112 0M10 21a6 6 0 0112 0" /></>,
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

  // Relocation-plan progress drives the Flutter Mode butterfly.
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
  const exploreActive = active('/your-world') || active('/destinations') || active('/greenbook') || active('/passportindex') || onCountry
  const planActive = active('/command-center') || active('/pathways') || active('/my-plan') || active('/flutter') || active('/checklist') || active('/documents') || active('/cost-calculator') || active('/astrocartography')
  const connectActive = active('/community')

  // Which sections are expanded. Default: the section matching the current page.
  const [openSecs, setOpenSecs] = useState<Record<string, boolean>>({})
  const openState = useMemo(() => ({
    explore: openSecs.explore ?? exploreActive,
    plan: openSecs.plan ?? planActive,
    connect: openSecs.connect ?? connectActive,
  }), [openSecs, exploreActive, planActive, connectActive])
  const toggle = (key: string, fallback: boolean) =>
    setOpenSecs((prev) => ({ ...prev, [key]: !(prev[key] ?? fallback) }))

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
          {/* Dashboard — standalone primary icon */}
          <Link className={`sb-item sb-sec${active('/dashboard') ? ' active' : ''}`} href="/dashboard" title="Dashboard">
            <Icon>{ICONS.dashboard}</Icon>
            <span className="lbl">{PRODUCT_COPY.dashboard}</span>
          </Link>

          {/* Explore */}
          <button
            type="button"
            className={`sb-item sb-sec${exploreActive ? ' active' : ''}`}
            aria-expanded={openState.explore}
            title="Explore"
            onClick={() => {
              if (document.body.classList.contains('rail-collapsed')) { router.push('/your-world'); return }
              toggle('explore', exploreActive)
            }}
          >
            <Icon>{ICONS.explore}</Icon>
            <span className="lbl">Explore</span>
            <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <div className="sb-group" hidden={!openState.explore}>
            <Link className={`sb-sub${active('/your-world') || onCountry ? ' active' : ''}`} href="/your-world">Your World</Link>
            {matches.map((m) => (
              <Link key={m.slug} className={`sb-country${pathname.startsWith(`/nextinations/${m.slug}`) ? ' active' : ''}`} href={`/nextinations/${m.slug}/v2/overview`}>
                <span className="sb-cc">{m.code}</span>
                <span className="nm">{m.name}</span>
              </Link>
            ))}
            <Link className={`sb-sub${active('/greenbook') ? ' active' : ''}`} href="/greenbook">{PRODUCT_COPY.greenbook}</Link>
            <Link className={`sb-sub${active('/passportindex') ? ' active' : ''}`} href="/passportindex">PassportIndex</Link>
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
            <Link className={`sb-sub${active('/cost-calculator') ? ' active' : ''}`} href="/cost-calculator">{PRODUCT_COPY.costCalculator}</Link>
            <Link className={`sb-sub${active('/astrocartography') ? ' active' : ''}`} href="/astrocartography">Astrocartography</Link>
          </div>

          {/* Connect */}
          <button
            type="button"
            className={`sb-item sb-sec${connectActive ? ' active' : ''}`}
            aria-expanded={openState.connect}
            title="Connect"
            onClick={() => {
              if (document.body.classList.contains('rail-collapsed')) { router.push('/community'); return }
              toggle('connect', connectActive)
            }}
          >
            <Icon>{ICONS.connect}</Icon>
            <span className="lbl">Connect</span>
            <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <div className="sb-group" hidden={!openState.connect}>
            <Link className={`sb-sub${active('/community') ? ' active' : ''}`} href="/community">{PRODUCT_COPY.kolmariKlub}</Link>
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
    </aside>
  )
}
