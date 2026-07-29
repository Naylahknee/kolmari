'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PRODUCT_COPY } from '@/config/product-copy'

function Icon({ children }: { children: React.ReactNode }) {
  return <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor">{children}</svg>
}

export function Sidebar() {
  const pathname = usePathname()
  const active = (route: string) => pathname === route || pathname.startsWith(`${route}/`)

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

        <p className="sb-label">Explore</p>
        <Link className={`sb-item${active('/nexitnation') ? ' active' : ''}`} href="/nexitnation">
          <Icon><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" /></Icon>
          <span className="lbl">{PRODUCT_COPY.world}</span>
        </Link>
        <Link className={`sb-item${active('/saved') || active('/countries') ? ' active' : ''}`} href="/saved">
          <Icon><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></Icon>
          <span className="lbl">Saved</span>
        </Link>

        <p className="sb-label">Plan</p>
        <Link className={`sb-item${active('/pathways') ? ' active' : ''}`} href="/pathways">
          <Icon><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.5 6H15a3 3 0 010 6H9a3 3 0 000 6h6.5" /></Icon>
          <span className="lbl">{PRODUCT_COPY.pathways}</span>
        </Link>
        <Link className={`sb-item${active('/nexit-plan') ? ' active' : ''}`} href="/nexit-plan">
          <Icon><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 3v18M11 8h6M11 12h4" /></Icon>
          <span className="lbl">{PRODUCT_COPY.plan}</span>
        </Link>
        <Link className={`sb-item${active('/checklist') ? ' active' : ''}`} href="/checklist">
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
        <Link className={`sb-item${active('/settings') ? ' active' : ''}`} href="/settings">
          <Icon><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5v.2a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H2a2 2 0 010-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V2a2 2 0 014 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1h.2a2 2 0 010 4h-.1a1.6 1.6 0 00-1.5 1z" /></Icon>
          <span className="lbl">{PRODUCT_COPY.settings}</span>
        </Link>
      </nav>
    </aside>
  )
}
