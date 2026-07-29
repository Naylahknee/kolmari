import { Check } from 'lucide-react'
import { Wordmark } from './wordmark'

// Value bullets echo the landing "Journey" so the top-of-funnel reads as one product.
const BULLETS = [
  'Match destinations to your Profile',
  'See visa pathways you may qualify for',
  'Build and track a real move plan',
]

/**
 * Shared branded auth layout used by login and signup so both match each other
 * and the redesigned landing: a navy brand panel (desktop) beside a white form
 * card. 4-color palette only (navy / gold / canvas / white).
 */
export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-canvas lg:grid lg:grid-cols-2">
      {/* Brand panel — desktop only */}
      <aside className="hero-grid relative hidden overflow-hidden bg-navy-deep p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Wordmark href="/" dark />
        <div>
          <h2 className="font-display text-4xl font-extrabold leading-[1.1]">Your move, made clearer.</h2>
          <p className="mt-4 max-w-sm text-base leading-7 text-white/75">
            One place to compare destinations, review visa pathways, and build a realistic move plan.
          </p>
          <ul className="mt-8 space-y-3">
            {BULLETS.map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm text-white/85">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold text-navy-deep">
                  <Check size={14} aria-hidden="true" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-white/50">Visa recommendations are planning guidance, not legal advice.</p>
      </aside>

      {/* Form side */}
      <div className="flex items-center justify-center px-5 py-12 sm:px-8">
        <section className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Wordmark href="/" />
          </div>
          <div className="card-surface p-7 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[.18em] text-gold-deep">{eyebrow}</p>
            <h1 className="mt-2 font-display text-4xl font-bold text-navy">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-muted">{subtitle}</p>
            {children}
          </div>
        </section>
      </div>
    </main>
  )
}
