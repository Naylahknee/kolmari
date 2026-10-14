import type { Metadata } from 'next'
import Link from 'next/link'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'
import { HIDDEN_ROUTES, HIDDEN_ROUTES_CHECKED, HIDDEN_ROUTE_SOURCES } from '@/lib/hidden-routes'

export const metadata: Metadata = {
  title: '5 Relocation Routes Most People Miss | Kolmari',
  description: 'Five relocation routes for U.S. citizens that need no job offer or large investment, each with a clear eligibility test.',
}

export default async function HiddenRoutesGuidePage() {
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
  const quizDone = profile.wizard_status === 'completed'

  return (
    <article className="mx-auto max-w-[820px] space-y-4 pb-12">
      <Link href="/news" className="inline-block py-1 text-[13px] font-bold text-navy hover:text-gold-deep">← News &amp; Guides</Link>

      <header className="space-y-2.5 rounded-[20px] bg-navy-deep px-6 py-8 text-white sm:px-8" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.07) 1px, transparent 1.4px)', backgroundSize: '22px 22px' }}>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">Guide · For U.S. citizens · {HIDDEN_ROUTES_CHECKED}</p>
        <h1 className="max-w-[20ch] text-balance text-[26px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-4xl">5 relocation routes most people never hear about.</h1>
        <p className="max-w-[58ch] text-pretty text-[15px] leading-relaxed text-[#c8d3e6]">None of these need a job offer or a large investment. Each one has a clear eligibility test you can check today.</p>
      </header>

      {HIDDEN_ROUTES.map((r, i) => (
        <section key={r.id} id={r.id} className="scroll-mt-4 space-y-3 rounded-[16px] border border-line bg-white px-6 py-5">
          <div className="flex items-start gap-3.5">
            <span className="text-[26px] font-bold leading-none text-gold">{String(i + 1).padStart(2, '0')}</span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-deep">{r.country}</p>
              <h2 className="mt-0.5 text-[19px] font-bold leading-tight text-navy">{r.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{r.intro}</p>
            </div>
          </div>
          <dl className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(min(180px,100%),1fr))]">
            {r.facts.map((f) => (
              <div key={f.label} className="rounded-[10px] bg-canvas px-3.5 py-3">
                <dt className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">{f.label}</dt>
                <dd className="mt-0.5 text-[13.5px] leading-snug text-navy">{f.value}</dd>
              </div>
            ))}
          </dl>
          <p className="rounded-[10px] border border-gold/40 bg-gold-soft/60 px-3.5 py-2.5 text-[13.5px] leading-relaxed text-navy">
            <strong className="font-semibold">The catch:</strong> {r.catch}
          </p>
        </section>
      ))}

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-[16px] bg-gold px-6 py-5">
        <div className="max-w-[52ch]">
          <h2 className="text-[19px] font-bold text-navy">{quizDone ? 'Check these against your profile' : 'Not sure which one fits you?'}</h2>
          <p className="mt-1 text-[13.5px] leading-relaxed text-navy">{quizDone ? 'Your matched routes on Pathways already reflect your quiz answers.' : 'The free Kolmari Match Quiz takes eight questions and shows the routes worth checking first.'}</p>
        </div>
        {quizDone ? (
          <span className="flex flex-wrap items-center gap-3">
            <Link href="/pathways" className="rounded-[10px] bg-navy px-4 py-2.5 text-[13px] font-bold text-white hover:bg-navy-deep">See my matched routes</Link>
            <Link href="/profile-wizard" className="text-[12.5px] font-bold text-navy underline">Retake the quiz</Link>
          </span>
        ) : (
          <Link href="/profile-wizard" className="rounded-[10px] bg-navy px-4 py-2.5 text-[13px] font-bold text-white hover:bg-navy-deep">Find my starting point</Link>
        )}
      </section>

      <footer className="space-y-2 px-0.5 pt-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Sources · checked {HIDDEN_ROUTES_CHECKED}</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px]">
          {HIDDEN_ROUTE_SOURCES.map((s) => (
            <li key={s.href}><a href={s.href} target="_blank" rel="noopener noreferrer" className="text-navy underline hover:text-gold-deep">{s.label}</a></li>
          ))}
        </ul>
        <p className="text-xs leading-relaxed text-muted">Fees, thresholds and processing times change. This is planning guidance, not legal advice.</p>
      </footer>
    </article>
  )
}
