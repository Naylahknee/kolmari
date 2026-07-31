import Link from 'next/link'
import { ArrowRight, BookOpen, Globe2 } from 'lucide-react'
import { KlubHeader } from '@/components/community/klub-header'
import { KolmariClub } from '@/components/kolmari/kolmari-club'
import { requireCurrentUser } from '@/lib/auth'
import { COUNTRIES } from '@/lib/countries'
import { getNexitPlan } from '@/lib/kolmari-plan'

const relatedActions = [
  { href: '/greenbook', title: 'Greenbook Insights', copy: 'Sourced planning context to research daily life and Community Fit.', icon: BookOpen },
  { href: '/nexitnation', title: 'Destinations', copy: 'Explore the map and narrow your strongest regional fit.', icon: Globe2 },
]

export default async function CommunityPage() {
  const user = await requireCurrentUser()
  const plan = await getNexitPlan(user.id)
  const groups = COUNTRIES.map((c) => ({ slug: c.slug, name: c.name }))
  // Open the group for the destination the user has chosen, if any.
  const saved = plan?.saved_nextination ?? null
  const initial =
    COUNTRIES.find((c) => c.slug === saved || c.name === saved)?.slug ?? groups[0]?.slug ?? 'portugal'

  return (
    <div>
      <KlubHeader />

      <KolmariClub groups={groups} initialCountry={initial} />

      {/* Related actions */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {relatedActions.map(({ href, title, copy, icon: Icon }) => (
          <Link key={href} href={href} className="card-surface group flex flex-col p-6 transition-colors hover:bg-canvas">
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
