import type { TransportationContent } from '@/lib/country-workspace/country-content'
import { SourceFooter } from './SourceFooter'

export function TransportationTab({ content, countryName }: { content: TransportationContent | null; countryName: string }) {
  if (!content) return <ResearchInProgress countryName={countryName} />

  const items: [string, string][] = [
    ['Public transit', content.publicTransit],
    ['Walkability', content.walkability],
    ['Rail', content.rail],
    ['Domestic travel', content.domesticTravel],
    ['International connections', content.internationalConnections],
    ['Car ownership', content.carOwnership],
    ['Driver\'s license conversion', content.driverLicenseConversion],
    ['Rideshare', content.rideshare],
    ['Cycling', content.cycling],
    ['Accessibility', content.accessibility],
  ]

  return (
    <div className="space-y-5">
      <section className="card-surface p-6">
        <h2 className="font-display text-2xl font-bold text-navy">Transportation in {countryName}</h2>
        <p className="mt-2 text-sm text-muted">Getting around locally, regionally, and internationally.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map(([title, body]) => (
          <div key={title} className="card-surface p-5">
            <p className="text-xs font-bold uppercase tracking-[.12em] text-gold-deep">{title}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
          </div>
        ))}
      </div>
      <SourceFooter disclosure={content.disclosure} />
    </div>
  )
}

function ResearchInProgress({ countryName }: { countryName: string }) {
  return (
    <section className="card-surface p-8 text-center">
      <p className="font-extrabold text-navy">Research in progress</p>
      <p className="mt-1 text-sm text-muted">Transportation details for {countryName} are being verified. Check the Resources tab for official links.</p>
    </section>
  )
}
