import type { RelocationProfile } from './profile'

export type ReadinessCategory = {
  score: number | null
  label: string
  detail: string
}

export type NexitReadiness = {
  overall: number | null
  profile: ReadinessCategory
  documents: ReadinessCategory
  research: ReadinessCategory
}

type ReadinessInputs = {
  documentCompletion?: number | null
  researchCompletion?: number | null
}

function clampPercentage(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) return null
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function calculateProfileCompletion(profile: RelocationProfile) {
  const fields = [
    profile.household_type,
    profile.preferred_regions.length > 0,
    profile.timeline,
    profile.priority,
    profile.goals.length > 0,
    profile.monthly_income !== null || profile.annual_income !== null,
    profile.occupation || profile.income_type || profile.remote !== null,
  ]

  const complete = fields.filter(Boolean).length
  return Math.round((complete / fields.length) * 100)
}

export function calculateNexitReadiness(
  profile: RelocationProfile,
  inputs: ReadinessInputs = {},
): NexitReadiness {
  const profileScore = calculateProfileCompletion(profile)
  const documentScore = clampPercentage(inputs.documentCompletion)
  const researchScore = clampPercentage(inputs.researchCompletion)

  const overall = documentScore !== null && researchScore !== null
    ? Math.round((profileScore * 0.4) + (documentScore * 0.3) + (researchScore * 0.3))
    : null

  return {
    overall,
    profile: {
      score: profileScore,
      label: 'Profile',
      detail: 'Based on household, region, timeline, priorities, goals, budget, and work information currently stored in your Nexit Profile.',
    },
    documents: {
      score: documentScore,
      label: 'Documents',
      detail: documentScore === null
        ? 'Documents not yet assessed'
        : 'Based on uploaded, verified, or user-confirmed document statuses.',
    },
    research: {
      score: researchScore,
      label: 'Research',
      detail: researchScore === null
        ? 'Research not yet assessed'
        : 'Based on meaningful saved country-research activity.',
    },
  }
}
