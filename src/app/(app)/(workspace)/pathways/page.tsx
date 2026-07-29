import type { Metadata } from 'next'
import { PathwaysResults, type Fit, type Pathway } from '@/components/kolmari/pathways-results'
import { PlusGate } from '@/components/kolmari/plus-gate'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile, isPaid } from '@/lib/profile'
import { evaluatePathways, PATHWAYS } from '@/lib/pathways'

export const metadata: Metadata = { title: 'Pathways | Kolmari', description: 'Compare official residency and visa Pathways using your Profile.' }

/** Free-plan preview: the routes we research, by name only — no requirements,
 *  thresholds, fees, or sources (those are the Plus detail). */
function PathwaysPreview() {
  return (
    <section className="card-surface p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-gold-deep">Kolmari Pathways</p>
      <h1 className="mt-1 text-2xl font-bold text-navy">Residency &amp; visa Pathways we research</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        These are the official routes in Kolmari today. Plus opens the full detail for each — requirements,
        income guidelines, fees, processing times, and the official source.
      </p>
      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {PATHWAYS.map((pathway) => (
          <li key={pathway.id} className="flex items-center justify-between gap-3 rounded-[var(--radius-field)] border border-line bg-white px-4 py-3">
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-navy">{pathway.name}</span>
              <span className="block text-xs text-muted">{pathway.country} · {pathway.category}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default async function PathwaysPage() {
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)

  if (!isPaid(profile)) {
    return (
      <PlusGate
        eyebrow="Kolmari Pathways"
        title="Unlock the full Pathways detail with Plus"
        description="Free shows the routes we research. Plus opens each Pathway's requirements, income guidelines, fees, processing times, and official sources — matched against your Kolmari Profile."
        bullets={[
          'Full requirements for every Pathway',
          'Income guidelines and estimated fees',
          'Processing times and official sources',
          'Personalized match status from your Profile',
        ]}
        preview={<PathwaysPreview />}
      />
    )
  }
  const evaluated = profile.wizard_status === 'completed'
    ? evaluatePathways(profile)
    : PATHWAYS.map((pathway) => ({
        ...pathway,
        status: 'Missing Requirements' as const,
        requirementsMet: [],
        missingRequirements: [],
      }))
  const countryCodes: Record<string, string> = {
    Canada: 'CA',
    Germany: 'DE',
    Ireland: 'IE',
    'New Zealand': 'NZ',
    Portugal: 'PT',
    Spain: 'ES',
  }
  const fitByStatus = {
    'Strong Match': 'likely',
    'Possible Match': 'possible',
    'Missing Requirements': 'unknown',
  } as const satisfies Record<(typeof evaluated)[number]['status'], Fit>
  const pathways: Pathway[] = evaluated.map((pathway) => ({
    id: pathway.id,
    category: pathway.category,
    title: pathway.name,
    country: pathway.country,
    countryCode: countryCodes[pathway.country] ?? pathway.country.slice(0, 2).toUpperCase(),
    fit: fitByStatus[pathway.status],
    incomeGuide: pathway.incomeThreshold,
    dependents: pathway.dependentsAllowed,
    workRights: pathway.localWorkRights,
    fees: pathway.estimatedFees,
    processing: pathway.estimatedProcessingTime,
    lastVerified: pathway.lastVerified,
    sourceUrl: pathway.officialSource,
    sourceLabel: pathway.sourceLabel,
    met: pathway.requirementsMet,
    missing: pathway.missingRequirements,
  }))

  return <PathwaysResults profile={profile} pathways={pathways} />
}
