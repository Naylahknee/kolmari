import { ExternalLink } from 'lucide-react'
import type { HousingContent } from '@/lib/country-workspace/country-content'

export function HousingTab({ content, countryName }: { content: HousingContent | null; countryName: string }) {
  if (!content) return <ResearchInProgress countryName={countryName} />
  return (
    <div className="space-y-5">
      {/* Rental ranges */}
      <section className="card-surface p-6">
        <h2 className="font-display text-2xl font-bold text-navy">Housing in {countryName}</h2>
        <p className="mt-2 text-sm text-muted">Typical monthly rental ranges by city. Prices vary by neighbourhood, size, and season.</p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs font-bold uppercase tracking-[.12em] text-muted">
                <th className="pb-2 pr-4">City</th>
                <th className="pb-2 pr-4">Studio / 1-bed</th>
                <th className="pb-2">2-bed</th>
              </tr>
            </thead>
            <tbody>
              {content.rentalRanges.map((r) => (
                <tr key={r.city} className="border-b border-line/50">
                  <td className="py-2.5 pr-4 font-bold text-navy">{r.city}</td>
                  <td className="py-2.5 pr-4 text-muted">{r.currency}{r.studioMin.toLocaleString()}–{r.currency}{r.studioMax.toLocaleString()}/mo</td>
                  <td className="py-2.5 text-muted">{r.currency}{r.twoBedMin.toLocaleString()}–{r.currency}{r.twoBedMax.toLocaleString()}/mo</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Details grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <DetailCard title="Deposit" body={content.depositMonths} />
        <DetailCard title="Furnished vs unfurnished" body={content.furnished} />
        <DetailCard title="Lease duration" body={content.leaseDuration} />
        <DetailCard title="Tenant rights" body={content.tenantRights} />
        <DetailCard title="Foreign buyer rules" body={content.foreignBuyerRules} />
      </div>

      {/* Popular areas */}
      <section className="card-surface p-6">
        <h3 className="font-bold text-navy">Popular relocation areas</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {content.popularAreas.map((area) => (
            <li key={area} className="rounded-pill bg-canvas px-3.5 py-1.5 text-sm font-semibold text-navy">{area}</li>
          ))}
        </ul>
      </section>

      {/* Portals */}
      <section className="card-surface p-6">
        <h3 className="font-bold text-navy">Housing portals</h3>
        <ul className="mt-3 space-y-2">
          {content.portals.map((p) => (
            <li key={p.url}>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-bold text-gold-deep hover:underline">
                {p.name} <ExternalLink size={13} />
              </a>
            </li>
          ))}
        </ul>
        {content.notes ? <p className="mt-4 rounded-xl bg-canvas p-3 text-xs leading-5 text-muted">{content.notes}</p> : null}
      </section>
    </div>
  )
}

function DetailCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="card-surface p-5">
      <p className="text-xs font-bold uppercase tracking-[.12em] text-gold-deep">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
    </div>
  )
}

function ResearchInProgress({ countryName }: { countryName: string }) {
  return (
    <section className="card-surface p-8 text-center">
      <p className="font-extrabold text-navy">Research in progress</p>
      <p className="mt-1 text-sm text-muted">Housing details for {countryName} are being verified. Check the Resources tab for official links.</p>
    </section>
  )
}
