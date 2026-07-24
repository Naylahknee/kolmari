import Link from 'next/link'
import { ArrowRight, BookOpen, Globe2, Users } from 'lucide-react'

const relatedActions = [
  { href: '/greenbook',   title: 'Greenbook Insights',    copy: 'Use practical prompts to research daily life and Community Fit.',             icon: BookOpen },
  { href: '/nexitnation', title: 'Nexitnation',            copy: 'Open the Nexitnation map and narrow your strongest regional fit.',           icon: Globe2   },
  { href: '/saved',       title: 'My Nextinations',        copy: 'Save the Nextinations you want to keep comparing.',                          icon: Users    },
]

export default function CommunityPage() {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-teal-deep">Nexiters</p>
      <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">Nexiters Community</h1>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
        Build a stronger Nexit Plan with context from people thinking seriously about relocation — not vacation content or unsupported claims.
      </p>

      {/* Honest state — verified community features are not yet available */}
      <section className="mt-6 overflow-hidden rounded-[var(--radius-card)] border border-line bg-white p-7">
        <Users size={28} className="text-teal" aria-hidden="true" />
        <h2 className="mt-4 text-lg font-bold text-navy">Verified community features are in development.</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Moderated member discussions, country-specific conversations, and verified relocation notes are being built. Until moderation and verification are ready, Nexit clearly labels editorial planning prompts and sourced insights.
        </p>
        <p className="mt-4 text-sm leading-6 text-muted">
          In the meantime, use Greenbook Insights for sourced planning context and Nexitnation to compare regions with real data.
        </p>
      </section>

      {/* Related actions */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {relatedActions.map(({ href, title, copy, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="card-surface group flex flex-col p-6 transition-colors hover:bg-canvas"
          >
            <span className="grid size-10 place-items-center rounded-[var(--radius-field)] bg-teal-soft text-teal-deep" aria-hidden="true">
              <Icon size={18} />
            </span>
            <p className="mt-4 font-semibold text-navy">{title}</p>
            <p className="mt-1.5 flex-1 text-sm leading-6 text-muted">{copy}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-gold-deep">
              Open <ArrowRight size={13} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
