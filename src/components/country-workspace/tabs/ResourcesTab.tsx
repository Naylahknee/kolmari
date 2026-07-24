import { ExternalLink } from 'lucide-react'
import type { ResourceLink } from '@/lib/country-workspace/country-content'

const CATEGORY_LABELS: Record<ResourceLink['category'], string> = {
  immigration: 'Immigration',
  embassy: 'Embassy & Consulates',
  taxes: 'Taxes',
  statistics: 'Statistics',
  employment: 'Employment',
  housing: 'Housing',
  healthcare: 'Healthcare',
  education: 'Education',
  transportation: 'Transportation',
  community: 'Community',
}

const CATEGORY_ORDER: ResourceLink['category'][] = [
  'immigration', 'embassy', 'taxes', 'statistics', 'employment',
  'housing', 'healthcare', 'education', 'transportation', 'community',
]

export function ResourcesTab({ resources, countryName }: { resources: ResourceLink[]; countryName: string }) {
  // Group by category in the preferred order
  const grouped = CATEGORY_ORDER.reduce<Record<string, ResourceLink[]>>((acc, cat) => {
    const items = resources.filter((r) => r.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  return (
    <div className="space-y-5">
      <section className="card-surface p-6">
        <h2 className="font-display text-2xl font-bold text-navy">Resources for {countryName}</h2>
        <p className="mt-2 text-sm text-muted">Curated links to official and community sources. Each resource is labelled Official or Community and includes a last-checked date. Links open in a new tab.</p>
      </section>

      {Object.entries(grouped).map(([cat, items]) => (
        <section key={cat} className="card-surface p-6">
          <p className="text-xs font-bold uppercase tracking-[.12em] text-gold-deep">{CATEGORY_LABELS[cat as ResourceLink['category']]}</p>
          <ul className="mt-4 space-y-3">
            {items.map((r) => (
              <li key={r.url} className="flex items-start gap-3 rounded-xl bg-canvas p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-navy">{r.title}</p>
                    <span className={`rounded-pill px-2 py-0.5 text-[10px] font-bold ${r.type === 'official' ? 'bg-ok-soft text-ok' : 'bg-info-soft text-info'}`}>
                      {r.type === 'official' ? 'Official' : 'Community'}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{r.organization}</p>
                  <p className="mt-1 text-sm leading-5 text-muted">{r.description}</p>
                  <p className="mt-1.5 text-[10px] text-muted/70">Last checked: {r.lastChecked}</p>
                </div>
                <a href={r.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${r.title}`} className="shrink-0 text-gold-deep hover:text-navy">
                  <ExternalLink size={16} />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {resources.length === 0 && (
        <section className="card-surface p-8 text-center">
          <p className="font-extrabold text-navy">Research in progress</p>
          <p className="mt-1 text-sm text-muted">We are compiling curated resources for {countryName}.</p>
        </section>
      )}
    </div>
  )
}
