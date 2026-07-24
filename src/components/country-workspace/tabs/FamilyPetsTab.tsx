import type { FamilyPetsContent } from '@/lib/country-workspace/country-content'
import { SourceFooter } from './SourceFooter'

export function FamilyPetsTab({ content, countryName }: { content: FamilyPetsContent | null; countryName: string }) {
  if (!content) return <ResearchInProgress countryName={countryName} />

  const familyItems: [string, string][] = [
    ['Childcare', content.childcare],
    ['Family benefits', content.familyBenefits],
    ['Parental leave', content.parentalLeave],
    ["Children's healthcare", content.childrenHealthcare],
    ['Multigenerational living', content.multigenerational],
  ]

  const petItems: [string, string][] = [
    ['Pet import rules', content.petImportRules],
    ['Quarantine', content.quarantine],
    ['Veterinary care', content.vetCare],
    ['Pet-friendly housing', content.petFriendlyHousing],
  ]

  return (
    <div className="space-y-5">
      <section className="card-surface p-6">
        <h2 className="font-display text-2xl font-bold text-navy">Family &amp; Pets in {countryName}</h2>
        <p className="mt-2 text-sm text-muted">Childcare, family support, and what it takes to bring your pets.</p>
      </section>

      <section className="card-surface p-6">
        <p className="text-xs font-bold uppercase tracking-[.12em] text-gold-deep">Family</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {familyItems.map(([title, body]) => (
            <div key={title} className="rounded-xl bg-canvas p-4">
              <p className="text-xs font-bold text-navy">{title}</p>
              <p className="mt-1.5 text-sm leading-5 text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card-surface p-6">
        <p className="text-xs font-bold uppercase tracking-[.12em] text-gold-deep">Pets</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {petItems.map(([title, body]) => (
            <div key={title} className="rounded-xl bg-canvas p-4">
              <p className="text-xs font-bold text-navy">{title}</p>
              <p className="mt-1.5 text-sm leading-5 text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>
      <SourceFooter disclosure={content.disclosure} />
    </div>
  )
}

function ResearchInProgress({ countryName }: { countryName: string }) {
  return (
    <section className="card-surface p-8 text-center">
      <p className="font-extrabold text-navy">Research in progress</p>
      <p className="mt-1 text-sm text-muted">Family &amp; pets details for {countryName} are being verified. Check the Resources tab for official links.</p>
    </section>
  )
}
