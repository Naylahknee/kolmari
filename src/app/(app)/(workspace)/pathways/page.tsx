import type { Metadata } from 'next'
import { PathwaysResults, type Fit, type Pathway } from '@/components/nexit/pathways-results'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'
import { evaluatePathways, PATHWAYS } from '@/lib/pathways'

export const metadata: Metadata = { title: 'Pathways | Kolmari', description: 'Compare official residency and visa Pathways using your Kolmari Profile.' }

export default async function PathwaysPage() {
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
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
