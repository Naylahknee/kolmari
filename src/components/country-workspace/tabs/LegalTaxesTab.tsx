import type { LegalTaxesContent } from '@/lib/country-workspace/country-content'

export function LegalTaxesTab({ content, countryName }: { content: LegalTaxesContent | null; countryName: string }) {
  if (!content) return <ResearchInProgress countryName={countryName} />

  const items: [string, string][] = [
    ['Tax residency', content.taxResidency],
    ['Income tax', content.incomeTax],
    ['Social security', content.socialSecurity],
    ['Double taxation treaties', content.doubleTaxationTreaties],
    ['Banking', content.banking],
    ['Foreign account reporting', content.foreignAccountReporting],
    ["Driver's license rules", content.driverLicenseRules],
    ['Residency obligations', content.residencyObligations],
    ['Property ownership', content.propertyOwnership],
    ['Business registration', content.businessRegistration],
  ]

  return (
    <div className="space-y-5">
      <section className="card-surface p-6">
        <h2 className="font-display text-2xl font-bold text-navy">Legal &amp; Taxes in {countryName}</h2>
        <p className="mt-2 text-sm text-muted">Tax residency, income obligations, banking, and legal considerations for residents.</p>
        <div className="mt-3 rounded-xl bg-warn-soft px-4 py-3">
          <p className="text-xs font-bold text-warn">Planning &amp; research information only</p>
          <p className="mt-1 text-xs text-warn/80">This is not legal or tax advice. Confirm all details with a qualified local attorney or accountant before acting.</p>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map(([title, body]) => (
          <div key={title} className="card-surface p-5">
            <p className="text-xs font-bold uppercase tracking-[.12em] text-gold-deep">{title}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
          </div>
        ))}
      </div>

      <p className="rounded-xl border border-line bg-canvas px-4 py-3 text-xs text-muted">{content.disclaimer}</p>
    </div>
  )
}

function ResearchInProgress({ countryName }: { countryName: string }) {
  return (
    <section className="card-surface p-8 text-center">
      <p className="font-extrabold text-navy">Research in progress</p>
      <p className="mt-1 text-sm text-muted">Legal &amp; tax details for {countryName} are being verified. This section is not legal advice. Check the Resources tab for official links.</p>
    </section>
  )
}
