import type { HealthcareContent } from '@/lib/country-workspace/country-content'

export function HealthcareTab({ content, countryName }: { content: HealthcareContent | null; countryName: string }) {
  if (!content) return <ResearchInProgress countryName={countryName} />
  return (
    <div className="space-y-5">
      <section className="card-surface p-6">
        <h2 className="font-display text-2xl font-bold text-navy">Healthcare in {countryName}</h2>
        <p className="mt-2 text-sm text-muted">Public and private healthcare options for residents. We never collect health diagnoses in this experience.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <DetailCard tone="navy" title="Public system" body={content.publicSystem} />
        <DetailCard tone="navy" title="Private system" body={content.privateSystem} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DetailCard tone="default" title="Eligibility" body={content.eligibility} />
        <DetailCard tone="default" title="Insurance requirement" body={content.insuranceRequirement} />
        <DetailCard tone="default" title="Emergency care" body={content.emergencyCare} />
        <DetailCard tone="default" title="Primary care" body={content.primaryCare} />
        <DetailCard tone="default" title="Prescriptions" body={content.prescriptions} />
        <DetailCard tone="default" title="Mental health" body={content.mentalHealth} />
        <DetailCard tone="default" title="Accessibility" body={content.accessibilityNotes} />
      </div>

      <section className="card-surface p-5">
        <p className="text-xs font-bold uppercase tracking-[.12em] text-gold-deep">Estimated private insurance range</p>
        <p className="mt-2 text-lg font-extrabold text-navy">{content.estimatedInsuranceRange}</p>
        <p className="mt-1 text-xs text-muted">Planning estimate only — actual premiums depend on age, coverage level, and provider. Request quotes directly from insurers.</p>
      </section>

      <p className="rounded-xl border border-line bg-canvas px-4 py-3 text-xs text-muted">{content.disclaimer}</p>
    </div>
  )
}

function DetailCard({ title, body, tone }: { title: string; body: string; tone: 'navy' | 'default' }) {
  return (
    <div className="card-surface p-5">
      <p className={`text-xs font-bold uppercase tracking-[.12em] ${tone === 'navy' ? 'text-navy' : 'text-gold-deep'}`}>{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
    </div>
  )
}

function ResearchInProgress({ countryName }: { countryName: string }) {
  return (
    <section className="card-surface p-8 text-center">
      <p className="font-extrabold text-navy">Research in progress</p>
      <p className="mt-1 text-sm text-muted">Healthcare details for {countryName} are being verified. We never collect health diagnoses. Check the Resources tab for official links.</p>
    </section>
  )
}
