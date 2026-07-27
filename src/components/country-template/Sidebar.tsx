'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { toggleTree } from './client/behaviours'

const PORTUGAL_SECTIONS = [
  { label: 'Overview', target: 'overview' },
  { label: 'Why This Matches You', target: 'overview' },
  { label: 'Economic Profile', target: 'tax-money' },
  { label: 'Cost of Living', target: 'cost-housing' },
  { label: 'Nexit Pathways', target: 'move-there' },
  { label: 'Healthcare', target: 'healthcare' },
  { label: 'Greenbook', target: 'lifestyle-community' },
  { label: 'Housing', target: 'cost-housing' },
  { label: 'Legal & Taxes', target: 'tax-money' },
  { label: 'Employment', target: 'work-study' },
  { label: 'Transportation', target: 'lifestyle-community' },
  { label: 'Daily Life', target: 'lifestyle-community' },
  { label: 'Education', target: 'family-schools' },
  { label: 'Family & Pets', target: 'family-schools' },
  { label: 'Resources', target: 'overview' },
  { label: 'Compare', target: 'overview' },
] as const

/* Converted from the approved index.html mockup. Markup verbatim. */
export function Sidebar({ onToggleRail }: { onToggleRail: () => void }) {
  const pathname = usePathname()
  const activeSection = pathname.split('/').at(-1) ?? 'overview'

  return (
    <aside className="rail">
        <div className="rail-head">
          <span className="rail-title">Navigation</span>
          <button className="icon-btn" onClick={onToggleRail} aria-label="Collapse sidebar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M15 18l-6-6 6-6" /></svg></button>
        </div>

        <nav aria-label="Main">
          <p className="sb-label">Discover</p>
          <Link className="sb-item" href="/dashboard"><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg><span className="lbl">Dashboard</span></Link>
          <Link className="sb-item" href="/nexitnation"><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" /></svg><span className="lbl">Nexit World</span></Link>

          <p className="sb-label">My Nexit</p>
          <button className="sb-item active" aria-expanded="true" onClick={(e) => toggleTree(e.currentTarget)}><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></svg><span className="lbl">My Nextinations</span><svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6" /></svg></button>
          <div className="sb-tree">
            <Link className="sb-country active" href="/nextinations/portugal/v2/overview" aria-current="page"><span className="sb-cc">PT</span><span className="nm">Portugal</span><span className="sc">87%</span></Link>
            <div className="sb-sections" aria-label="Portugal sections">
              {PORTUGAL_SECTIONS.map(({ label, target }) => (
                <Link
                  key={label}
                  href={`/nextinations/portugal/v2/${target}`}
                  className={`sb-section${activeSection === target ? ' active' : ''}`}
                  aria-current={activeSection === target ? 'page' : undefined}
                >
                  {label}
                </Link>
              ))}
            </div>
            <Link className="sb-country" href="/nextinations/spain/v2/overview" title="Open the Spain page"><span className="sb-cc">ES</span><span className="nm">Spain</span><span className="sc">84%</span></Link>
            <Link className="sb-country" href="/nextinations/uruguay/v2/overview" title="Open the Uruguay page"><span className="sb-cc">UY</span><span className="nm">Uruguay</span><span className="sc">81%</span></Link>
            <Link className="sb-country" href="/nextinations/costa-rica/v2/overview" title="Open the Costa Rica page"><span className="sb-cc">CR</span><span className="nm">Costa Rica</span><span className="sc">76%</span></Link>
            <Link className="sb-country" href="/nextinations/ghana/v2/overview" title="Open the Ghana page"><span className="sb-cc">GH</span><span className="nm">Ghana</span><span className="sc">73%</span></Link>
            <Link className="sb-country" href="/nextinations/mexico/v2/overview" title="Open the Mexico page"><span className="sb-cc">MX</span><span className="nm">Mexico</span><span className="sc">71%</span></Link>
            <Link className="sb-country" href="/nextinations/malaysia/v2/overview" title="Open the Malaysia page"><span className="sb-cc">MY</span><span className="nm">Malaysia</span><span className="sc">64%</span></Link>
            <Link className="sb-country" href="/nextinations/albania/v2/overview" title="Open the Albania page"><span className="sb-cc">AL</span><span className="nm">Albania</span><span className="sc">59%</span></Link>
          </div>

          <p className="sb-label">Planning</p>
          <Link className="sb-item" href="/pathways"><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.5 6H15a3 3 0 010 6H9a3 3 0 000 6h6.5" /></svg><span className="lbl">Nexit Pathways</span></Link>
          <Link className="sb-item" href="/nexit-plan"><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 3v18M11 8h6M11 12h4" /></svg><span className="lbl">Nexit Plan</span></Link>
          <Link className="sb-item" href="/cost-calculator"><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" /></svg><span className="lbl">Cost Calculator</span></Link>
          <Link className="sb-item" href="/greenbook"><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 5a2 2 0 012-2h5v18H5a2 2 0 01-2-2zM21 5a2 2 0 00-2-2h-5v18h5a2 2 0 002-2z" /></svg><span className="lbl">Greenbook</span></Link>
          <Link className="sb-item" href="/documents"><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg><span className="lbl">Documents</span></Link>

          <div className="sb-div"></div>
          <p className="sb-label">Settings</p>
          <Link className="sb-item" href="/settings"><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5v.2a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H2a2 2 0 010-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V2a2 2 0 014 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1h.2a2 2 0 010 4h-.1a1.6 1.6 0 00-1.5 1z" /></svg><span className="lbl">Settings</span></Link>
          <Link className="sb-item" href="/profile-wizard"><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></svg><span className="lbl">Profile</span></Link>
        </nav>

        <div className="readiness">
          <div className="rl">Nexit Readiness</div>
          <div className="rv">Profile complete</div>
          <div className="rbar"><i style={{width: '100%'}}></i></div>
          <Link href="/profile-wizard">Edit profile</Link>
        </div>
      </aside>
  )
}
