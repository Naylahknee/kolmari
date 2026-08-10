import Link from 'next/link'
import { ArrowRight, BookOpen, Globe2 } from 'lucide-react'
import { KlubHeader } from '@/components/community/klub-header'
import { KolmariClub } from '@/components/kolmari/kolmari-club'
import { requireCurrentUser } from '@/lib/auth'
import { COUNTRIES } from '@/lib/countries'
import { getKolmariPlan } from '@/lib/kolmari-plan'
import { getProfile, hasCompletedProfile } from '@/lib/profile'
import { rankNextinations } from '@/lib/userProfile'

const relatedActions = [
  { href: '/greenbook', title: 'Greenbook Insights', copy: 'Sourced planning context to research daily life and Community Fit.', icon: BookOpen },
  { href: '/destinations', title: 'Destinations', copy: 'Explore the map and narrow your strongest regional fit.', icon: Globe2 },
]

export default async function CommunityPage() {
  const user = await requireCurrentUser()
  const [plan, profile] = await Promise.all([getKolmariPlan(user.id), getProfile(user.id)])

  // Every member is in the Welcome group; a country group opens for each
  // destination the user matches (no manual joining, no dropdown).
  const matched = hasCompletedProfile(profile)
    ? rankNextinations(profile).map((r) => ({ slug: r.country.slug, name: r.country.name }))
    : []
  const groups = [{ slug: 'welcome', name: 'Welcome' }, ...matched]

  // Open the group for the destination the user has chosen, if it's one of
  // their matched groups; otherwise start in Welcome.
  const saved = plan?.saved_nextination ?? null
  const savedSlug = COUNTRIES.find((c) => c.slug === saved || c.name === saved)?.slug
  const initial = savedSlug && groups.some((g) => g.slug === savedSlug) ? savedSlug : 'welcome'

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
