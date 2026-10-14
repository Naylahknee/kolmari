'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { LESSER_KNOWN_ROUTES, type LesserKnownRoute } from '@/lib/pathway-extras'
import { passportCodeForCountry } from '@/lib/passport-covers'
import { PassportCover } from './passport-cover'

// Presentation summaries intentionally omit the unverified speed/income claims in the original records.
const SUMMARIES: Record<string, [string, string]> = {
  'Citizenship by descent': ['Research nationality rules for people with Portuguese ancestry.', 'Ancestry'],
  'D3 Tech Visa': ['Review routes for employment with a Portuguese technology company.', 'Employment'],
  'Job-seeker visa': ['Check the current availability and requirements for seeking work.', 'Work search'],
  'D5 Research permit': ['Confirm the correct permit category with the research institution.', 'Research'],
  'Right of Abode': ['Research Ghana’s Right of Abode provisions and application criteria.', 'Diaspora'],
  'Family unity route': ['Review residence options based on a qualifying family relationship.', 'Family unity'],
  'EU family member route': ['Review family-member rights under applicable free-movement rules.', 'Family mobility'],
  'CPLP agreement': ['Research residence provisions for nationals of CPLP member countries.', 'CPLP nationality'],
}

export function PathwaysLesserRoutes() {
  const [selected, setSelected] = useState<LesserKnownRoute | null>(null)
  return (
    <section id="pw-lesser" className="scroll-mt-4" aria-labelledby="pw-lesser-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="pw-lesser-heading" className="text-base font-bold text-navy">Lesser-known routes most people miss</h2>
          <p className="mt-1 text-[12.5px] leading-5 text-muted">Explore alternative immigration pathways that may offer advantages based on your circumstances.</p>
        </div>
        <a href="#pw-routes" className="inline-flex items-center gap-1 text-xs font-bold text-navy hover:underline">View all routes <ArrowRight size={14} aria-hidden="true" /></a>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {LESSER_KNOWN_ROUTES.map((route) => {
          const [summary, benefit] = SUMMARIES[route.name] ?? ['Review this route with the relevant authority.', 'Research']
          return (
            <article key={`${route.country}-${route.name}`} className="flex min-w-0 gap-3 rounded-[var(--radius-card)] border border-line bg-white p-4 shadow-tile">
              <PassportCover code={passportCodeForCountry(route.country)} country={route.country} mobility={route.country === 'EU-wide'} className="w-10 self-start" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-soft">{route.country}</p>
                <h3 className="mt-1 text-sm font-bold text-navy">{route.name}</h3>
                <p className="mt-1.5 text-xs leading-5 text-muted">{summary}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-pill bg-canvas px-2 py-1 text-[10px] font-semibold text-muted">{benefit}</span>
                  <button type="button" onClick={() => setSelected(route)} className="inline-flex items-center gap-1 text-xs font-bold text-navy hover:underline" aria-label={`View ${route.country} ${route.name}`}>View route <ArrowRight size={13} aria-hidden="true" /></button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
      <p className="mt-3 text-[11px] leading-5 text-muted-soft">Verification pending. These existing research leads do not yet carry official sources or verification dates. Availability, route names and requirements must be confirmed.</p>
      {selected && <ResearchLeadDialog route={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}

function ResearchLeadDialog({ route, onClose }: { route: LesserKnownRoute; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const element = dialog.current
    element?.showModal()
    return () => { element?.close(); previous?.focus() }
  }, [])
  return (
    <dialog ref={dialog} aria-labelledby="pw-research-title" onCancel={onClose} className="m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-[var(--radius-card)] border border-line bg-white p-6 text-navy shadow-drawer backdrop:bg-navy-deep/50">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-xs font-semibold text-muted">{route.country}</p><h2 id="pw-research-title" className="mt-1 text-lg font-bold">{route.name}</h2></div>
        <button type="button" onClick={onClose} aria-label="Close route research" className="grid size-9 shrink-0 place-items-center rounded-pill hover:bg-canvas"><X size={18} aria-hidden="true" /></button>
      </div>
      <p className="mt-4 rounded-[var(--radius-field)] bg-warn-soft p-3 text-sm">Verification pending. This research lead has no verified detail record yet.</p>
      <p className="mt-3 text-sm text-muted">{route.who}. {SUMMARIES[route.name]?.[0]}</p>
      <dl className="mt-4 divide-y divide-line text-xs">
        {['Eligibility', 'Financial requirements', 'Processing timeline', 'Documentation', 'Work authorization', 'Residency rights', 'Citizenship pathway', 'Official source', 'Last verification date'].map((label) => <div key={label} className="flex justify-between gap-4 py-2.5"><dt>{label}</dt><dd className="text-muted">Not verified</dd></div>)}
      </dl>
      <button type="button" onClick={onClose} className="mt-4 rounded-[var(--radius-btn)] bg-navy px-4 py-2 text-sm font-semibold text-white">Back to pathways</button>
    </dialog>
  )
}
