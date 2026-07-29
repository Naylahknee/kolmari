import { MapPin } from 'lucide-react'
import { GREENBOOK_ENTRIES } from '@/lib/greenbook'
import { GreenbookBoard } from '@/components/kolmari/greenbook-board'
import { PlusGate } from '@/components/kolmari/plus-gate'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile, isPaid } from '@/lib/profile'

/** Free-plan preview: a few Greenbook cards, read-only, no filters. */
function GreenbookPreview() {
  return (
    <section>
      <div className="border-t-2 border-teal pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-teal-deep">Community context</p>
        <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-navy sm:text-4xl">Greenbook Insights</h1>
        <p className="mt-1 max-w-xl text-sm leading-5 text-muted">
          Practical prompts for researching daily life, neighborhoods, documents, and Community Fit before committing to a Destination.
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

  if (!isPaid(profile)) {
    return (
      <PlusGate
        eyebrow="Greenbook Insights"
        title="Unlock the full Greenbook with Plus"
        description={`Free shows a preview. Plus opens all ${GREENBOOK_ENTRIES.length} Greenbook Insights with tag filters and Community Fit context for every Destination.`}
        bullets={[
          `All ${GREENBOOK_ENTRIES.length} Greenbook Insights`,
          'Filter by topic and location',
          'Community Fit context per Destination',
          'Source-labeled, honest context',
        ]}
        preview={<GreenbookPreview />}
      />
    )
  }

  return <GreenbookBoard />
}
