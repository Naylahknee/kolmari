import { ExternalLink } from 'lucide-react'
import type { GreenbookSection } from '@/lib/country-workspace/country-content'

export function GreenbookTab({ content, countryName }: { content: GreenbookSection | null; countryName: string }) {
  if (!content) return <ResearchInProgress countryName={countryName} />

  const sections: [string, string][] = [
    ['Community fit', content.communityFit],
    ['Black community & diaspora', content.blackDiaspora],
    ['LGBTQ+ resources & climate', content.lgbtq],
    ["Women's safety", content.womenSafety],
    ['Faith communities', content.faithCommunities],
    ['Disability access', content.disabilityAccess],
    ['Cultural belonging', content.culturalBelonging],
    ['Neighbourhood insights', content.neighborhoodInsights],
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <section className="overflow-hidden rounded-card bg-navy-deep p-6 text-white sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-teal">Greenbook Insights</p>
        <h2 className="mt-1 font-display text-2xl font-bold">Community &amp; belonging in {countryName}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">The insight that competitors don&apos;t offer. You never have to disclose identity categories to view this. Verified resources, community-reported insights, and editorial context are kept clearly separate.</p>
      </section>

      {/* Main insight sections */}
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map(([title, body]) => (
          <div key={title} className="card-surface p-5">
            <p className="text-xs font-bold uppercase tracking-[.12em] text-teal-deep">{title}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
          </div>
        ))}
      </div>

      {/* Community organisations */}
      {content.communityOrgs.length > 0 && (
        <section className="card-surface p-6">
          <p className="text-xs font-bold uppercase tracking-[.12em] text-teal-deep">Community organisations &amp; resources</p>
          <ul className="mt-4 space-y-3">
            {content.communityOrgs.map((org) => (
              <li key={org.name} className="flex items-start gap-3 rounded-xl bg-canvas p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-navy">{org.name}</p>
                  <p className="mt-0.5 text-sm text-muted">{org.description}</p>
                </div>
                {org.url && (
                  <a href={org.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-gold-deep">
                    <ExternalLink size={16} />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Disclaimer */}
      <div className="rounded-xl border border-line bg-canvas px-4 py-4">
        <p className="text-xs font-bold text-navy">About Greenbook Insights</p>
        <p className="mt-1.5 text-xs leading-5 text-muted">{content.disclaimer}</p>
      </div>
    </div>
  )
}

function ResearchInProgress({ countryName }: { countryName: string }) {
  return (
    <section className="card-surface p-8 text-center">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-deep">Greenbook Insights</p>
      <p className="mt-3 font-extrabold text-navy">Research in progress</p>
      <p className="mt-1 text-sm text-muted">We are still compiling community and belonging insights for {countryName}. You never have to disclose identity categories to access this content. Check the Resources tab for official links in the meantime.</p>
    </section>
  )
}
