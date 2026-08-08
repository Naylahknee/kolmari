export type KolmariSource = {
  title: string
  url: string
}

export type KolmariCopilotAnswer = {
  answer: string
  confidence: 'high' | 'moderate' | 'low'
  status: 'verified_information' | 'decision_support' | 'needs_professional_review'
  nextActions: string[]
  sources: KolmariSource[]
  workspace: {
    href: string
    label: string
  }
}

export type KolmariCopilotError = {
  error: string
}

export type KolmariCopilotResponse = KolmariCopilotAnswer | KolmariCopilotError

export function isKolmariCopilotError(
  response: KolmariCopilotResponse,
): response is KolmariCopilotError {
  return 'error' in response
}
