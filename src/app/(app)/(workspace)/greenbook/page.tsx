import { MapPin } from 'lucide-react'
import { GREENBOOK_ENTRIES, resolveCountrySlug } from '@/lib/greenbook'
import { GreenbookBoard } from '@/components/kolmari/greenbook-board'
import { PlusGate } from '@/components/kolmari/plus-gate'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile, isPaid } from '@/lib/profile'

const DEFAULT_COUNTRIES = ['portugal', 'spain', 'mexico']

/** Free-plan preview: a few Greenbook cards, read-only, no filters. */
function GreenbookPreview() {
  return (
    <section>
      <div className="border-t-2 border-teal pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-gold-deep">Greenbook</p>
        <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-navy sm:text-4xl">Research before you commit</h1>
        <p className="mt-1 max-w-xl text-sm leading-5 text-muted">
          Videos, community reviews, and real conversations for the countries in your match set.
        </p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {GREENBOOK_ENTRIES.slice(0, 3).map((entry) => (
          <article key={entry.id} className="card-surface flex min-h-48 flex-col p-5">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-teal-deep" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-navy">{entry.location}</p>
                <p className="text-xs text-teal-deep">{entry.context}</p>
              </div>
            </div>
            <p className="mt-4 flex-1 text-sm leading-6 text-muted">{entry.note}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default async function GreenbookPage() {
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)

  const destinations = profile.onboarding?.destinations ?? []
  const resolved = [...new Set(destinations.map(resolveCountrySlug).filter((slug): slug is string => slug != null))]
  const countries = resolved.length > 0 ? resolved : DEFAULT_COUNTRIES

  if (!isPaid(profile)) {
    return (
      <PlusGate
        eyebrow="Greenbook"
        title="Unlock the full Greenbook with Plus"
        description="Free shows a preview. Plus opens videos, community reviews, and real conversations for every country in your match set, plus Community Fit context for every destination."
        bullets={[
          'YouTube videos per matched country',
          'Women and Black traveler reviews',
          'Real relocation conversations',
          'Community Fit context per destination',
          'Source-labeled, honest context',
        ]}
        preview={<GreenbookPreview />}
      />
    )
  }

  return <GreenbookBoard countries={countries} />
}
