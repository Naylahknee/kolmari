import type { Metadata } from 'next'
import { Globe2, Plane, ShieldCheck } from 'lucide-react'
import { requireCurrentUser } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'PassportIndex | Kolmari',
  description: 'Visa-free access for your passport.',
}

/**
 * PassportIndex — visa-free access overview. Live per-country visa data requires
 * a real provider (free tier: Arton/PassportIndex open dataset; paid: a
 * daily-updated API). Until that integration lands we show the honest overview
 * and a "being verified" state per destination — never fabricated visa rules.
 */
export default async function PassportIndexPage() {
  await requireCurrentUser()
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Tools</p>
      <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">PassportIndex</h1>
      <p className="mt-1 text-sm text-muted">What your passport opens — visa-free entry, visa-on-arrival, and where you need to apply ahead.</p>

      <section className="card-surface mt-6 flex items-center gap-4 p-6">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gold-soft text-navy" aria-hidden="true">
          <Plane size={22} />
        </span>
        <div>
          <p className="text-sm font-bold text-navy">US passport</p>
          <p className="mt-0.5 text-sm text-muted">
            A US passport reaches roughly <strong className="text-navy">180+ destinations</strong> visa-free or visa-on-arrival,
            per public passport indices. Exact rules change often — Kolmari confirms them per destination rather than showing a stale table.
          </p>
        </div>
      </section>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Globe2, label: 'Visa-free / on arrival', note: 'Most destinations for a US passport' },
          { icon: ShieldCheck, label: 'eTA / eVisa', note: 'Quick online authorization' },
          { icon: Plane, label: 'Visa required', note: 'Apply before you travel' },
        ].map(({ icon: Icon, label, note }) => (
          <div key={label} className="card-surface p-5">
            <Icon size={18} className="text-gold-deep" aria-hidden="true" />
            <p className="mt-2 text-sm font-bold text-navy">{label}</p>
            <p className="mt-0.5 text-xs text-muted">{note}</p>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-[var(--radius-card)] border border-dashed border-line-strong bg-white p-6">
        <p className="font-bold text-navy">Per-destination lookup — being verified</p>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
          Live, per-country visa rules are wired to a dedicated passport-data provider so they stay current (the free tier uses
          an open dataset; the full experience uses a daily-updated source). Until that connection is live, Kolmari won&rsquo;t show
          invented visa rules — check each destination&rsquo;s <span className="font-semibold text-navy">Move There</span> tab for the
          researched routes we have confirmed.
        </p>
      </section>
    </div>
  )
}
