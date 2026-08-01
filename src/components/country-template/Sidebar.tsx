'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PRODUCT_COPY } from '@/config/product-copy'

function Icon({ children }: { children: React.ReactNode }) {
  return <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor">{children}</svg>
}

type Match = { slug: string; name: string; code: string }

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const active = (route: string) => pathname === route || pathname.startsWith(`${route}/`)

  // The user's matched destinations, self-fetched so both workspace shells
  // (NewWorkspaceChrome and CountryTemplate) get the expandable tree without
  // threading props. Empty until the profile/quiz is complete.
  const [matches, setMatches] = useState<Match[]>([])
  useEffect(() => {
    let cancelled = false
    fetch('/api/matches')
      .then((res) => (res.ok ? res.json() : { matches: [] }))
      .then((data) => {
        if (!cancelled) setMatches(Array.isArray(data.matches) ? data.matches : [])
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const onCountry = pathname.startsWith('/nextinations/')
  const destinationsActive = active('/destinations') || active('/nexitnation') || onCountry
  const [open, setOpen] = useState(false)
  // Auto-open the tree whenever the user is on a country page.
  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    if (onCountry) setOpen(true)
  }, [onCountry])

  return (
    <aside className="rail">
      <nav
        aria-label="Main"
        onClick={(event) => {
          if (window.innerWidth <= 900 && (event.target as HTMLElement).closest('a')) {
            document.body.classList.remove('rail-collapsed')
          }
        }}
      >
        <Link className={`sb-item${active('/dashboard') ? ' active' : ''}`} href="/dashboard">
          <Icon><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Icon>
          <span className="lbl">{PRODUCT_COPY.dashboard}</span>
        </Link>

        <p className="sb-label" data-onboarding="explore-nav">Explore</p>
        <Link className={`sb-item${active('/your-world') ? ' active' : ''}`} href="/your-world">
          <Icon><path d="M12 21s-7-6.3-7-11a7 7 0 0114 0c0 4.7-7 11-7 11z" /><circle cx="12" cy="10" r="2.6" /></Icon>
          <span className="lbl">Your World</span>
        </Link>
        {matches.length > 0 ? (
          <>
            <button
              type="button"
              className={`sb-item${destinationsActive ? ' active' : ''}`}
              aria-expanded={open}
              onClick={() => {
                setOpen((prev) => !prev)
                router.push('/destinations')
              }}
            >
              <Icon><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" /></Icon>
              <span className="lbl">{PRODUCT_COPY.world}</span>
              <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <div className="sb-tree" hidden={!open}>
              {matches.map((m) => (
                <Link
                  key={m.slug}
                  className={`sb-country${pathname.startsWith(`/nextinations/${m.slug}`) ? ' active' : ''}`}
                  href={`/nextinations/${m.slug}/v2/overview`}
                >
                  <span className="sb-cc">{m.code}</span>
                  <span className="nm">{m.name}</span>
                </Link>
              ))}
              <Link className="sb-country sb-country-all" href="/destinations">
                <span className="sb-cc" aria-hidden="true">＋</span>
                <span className="nm">Browse all</span>
              </Link>
            </div>
          </>
        ) : (
          <Link className={`sb-item${active('/destinations') || active('/nexitnation') ? ' active' : ''}`} href="/destinations">
            <Icon><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" /></Icon>
            <span className="lbl">{PRODUCT_COPY.world}</span>
          </Link>
        )}

        <p className="sb-label" data-onboarding="plan-nav">Plan</p>
        <Link className={`sb-item${active('/pathways') ? ' active' : ''}`} href="/pathways">
          <Icon><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.5 6H15a3 3 0 010 6H9a3 3 0 000 6h6.5" /></Icon>
          <span className="lbl">{PRODUCT_COPY.pathways}</span>
        </Link>
        <Link className={`sb-item${active('/my-plan') || active('/nexit-plan') ? ' active' : ''}`} href="/my-plan">
          <Icon><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 3v18M11 8h6M11 12h4" /></Icon>
          <span className="lbl">{PRODUCT_COPY.plan}</span>
        </Link>
        <Link className={`sb-item${active('/flutter') || active('/checklist') ? ' active' : ''}`} href="/flutter">
          <Icon><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></Icon>
          <span className="lbl">{PRODUCT_COPY.flutterMode}</span>
        </Link>
        <Link className={`sb-item${active('/documents') ? ' active' : ''}`} href="/documents">
          <Icon><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></Icon>
          <span className="lbl">{PRODUCT_COPY.documents}</span>
        </Link>

        <p className="sb-label">Connect</p>
        <Link className={`sb-item${active('/community') ? ' active' : ''}`} href="/community">
          <Icon><circle cx="8" cy="8" r="3" /><circle cx="16" cy="8" r="3" /><path d="M2 21a6 6 0 0112 0M10 21a6 6 0 0112 0" /></Icon>
          <span className="lbl">{PRODUCT_COPY.kolmariKlub}</span>
        </Link>

        <p className="sb-label">Tools</p>
        <Link className={`sb-item${active('/cost-calculator') ? ' active' : ''}`} href="/cost-calculator">
          <Icon><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" /></Icon>
          <span className="lbl">{PRODUCT_COPY.costCalculator}</span>
        </Link>
        <Link className={`sb-item${active('/greenbook') ? ' active' : ''}`} href="/greenbook">
          <Icon><path d="M3 5a2 2 0 012-2h5v18H5a2 2 0 01-2-2zM21 5a2 2 0 00-2-2h-5v18h5a2 2 0 002-2z" /></Icon>
          <span className="lbl">{PRODUCT_COPY.greenbook}</span>
        </Link>
        <Link className={`sb-item${active('/passportindex') ? ' active' : ''}`} href="/passportindex">
          <Icon><rect x="4" y="3" width="16" height="18" rx="2" /><circle cx="12" cy="10" r="2.5" /><path d="M9 16h6" /></Icon>
          <span className="lbl">PassportIndex</span>
        </Link>

        {/* Profile pinned below the content nav, visually separate. */}
        <div className="mt-3 border-t border-line pt-3">
          <Link className={`sb-item${active('/settings') ? ' active' : ''}`} href="/settings">
            <Icon><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></Icon>
            <span className="lbl">Profile</span>
          </Link>
        </div>
      </nav>
    </aside>
  )
}
