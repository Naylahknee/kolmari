import type { DailyLifeContent } from '@/lib/country-workspace/country-content'
import { SourceFooter } from './SourceFooter'

export function DailyLifeTab({ content, countryName }: { content: DailyLifeContent | null; countryName: string }) {
  if (!content) return <ResearchInProgress countryName={countryName} />

  const items: [string, string][] = [
    ['Grocery shopping', content.groceryShopping],
    ['Dining out', content.dining],
    ['Internet', content.internet],
    ['Mobile service', content.mobile],
    ['Weather', content.weather],
    ['Public holidays', content.holidays],
    ['Cultural etiquette', content.culturalEtiquette],
    ['Safety', content.safety],
    ['Pace of life', content.paceOfLife],
    ['Recreation', content.recreation],
  ]

  return (
    <div className="space-y-5">
      <section className="card-surface p-6">
        <h2 className="font-display text-2xl font-bold text-navy">Daily Life in {countryName}</h2>
        <p className="mt-2 text-sm text-muted">What everyday life actually looks and feels like — shopping, dining, weather, culture, and pace.</p>
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
      <p className="mt-1 text-sm text-muted">Daily life details for {countryName} are being verified. Check the Resources tab for official links.</p>
    </section>
  )
}
