import { ExternalLink } from 'lucide-react'
import type { EmploymentContent } from '@/lib/country-workspace/country-content'

export function EmploymentTab({ content, countryName }: { content: EmploymentContent | null; countryName: string }) {
  if (!content) return <ResearchInProgress countryName={countryName} />
  return (
    <div className="space-y-5">
      <section className="card-surface p-6">
        <h2 className="font-display text-2xl font-bold text-navy">Employment in {countryName}</h2>
        <p className="mt-2 text-sm text-muted">Local job market overview. Personalization for your specific occupation is available when your Nexit Profile is complete.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="card-surface p-5">
          <p className="text-xs font-bold uppercase tracking-[.12em] text-gold-deep">Top sectors</p>
          <ul className="mt-3 space-y-1.5">
            {content.topSectors.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-navy"><span className="size-1.5 shrink-0 rounded-full bg-gold" />{s}</li>
            ))}
          </ul>
        </section>

        <section className="card-surface p-5">
          <p className="text-xs font-bold uppercase tracking-[.12em] text-gold-deep">Job boards</p>
          <ul className="mt-3 space-y-2">
            {content.jobBoards.map((b) => (
              <li key={b.url}>
                <a href={b.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-bold text-gold-deep hover:underline">
                  {b.name} <ExternalLink size={12} />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DetailCard title="Average salary range" body={content.avgSalaryRange} />
        <DetailCard title="Language expectations" body={content.languageExpectation} />
        <DetailCard title="Work culture" body={content.workCulture} />
        <DetailCard title="Credential recognition" body={content.credentialRecognition} />
        <DetailCard title="Remote work environment" body={content.remoteEnvironment} />
        <DetailCard title="Networking groups" body={content.networkingGroups} />
      </div>

      <p className="rounded-xl border border-line bg-canvas px-4 py-3 text-xs text-muted">{content.disclaimer}</p>
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
      <p className="mt-1 text-sm text-muted">Employment details for {countryName} are being verified. Check the Resources tab for official links.</p>
    </section>
  )
}
