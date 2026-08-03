export type DecisionIntent =
  | 'pathways'
  | 'budget'
  | 'documents'
  | 'community'
  | 'plan'
  | 'destinations'

export type DecisionRoute = {
  intent: DecisionIntent
  href: string
  label: string
}

const ROUTES: Record<DecisionIntent, DecisionRoute> = {
  pathways: { intent: 'pathways', href: '/pathways', label: 'Pathways' },
  budget: { intent: 'budget', href: '/cost-calculator', label: 'Cost Calculator' },
  documents: { intent: 'documents', href: '/documents', label: 'Documents' },
  community: { intent: 'community', href: '/greenbook', label: 'Greenbook Insights' },
  plan: { intent: 'plan', href: '/my-plan', label: 'My Plan' },
  destinations: { intent: 'destinations', href: '/your-world', label: 'Your World' },
}

const INTENT_PATTERNS: Array<{ intent: DecisionIntent; pattern: RegExp }> = [
  {
    intent: 'documents',
    pattern: /\b(document|documents|passport|apostille|certificate|paperwork|records?)\b/i,
  },
  {
    intent: 'pathways',
    pattern: /\b(visa|visas|pathway|pathways|immigration|residen(?:ce|cy)|citizenship|qualif(?:y|ies|ication))\b/i,
  },
  {
    intent: 'budget',
    pattern: /\b(afford|affordable|budget|cost|costs|money|income|saving|savings|rent|expense|expenses)\b/i,
  },
  {
    intent: 'community',
    pattern: /\b(safe|safety|welcome|welcomed|belong|belonging|community|black|lgbtq?|racism|discrimination|women|identity)\b/i,
  },
  {
    intent: 'plan',
    pattern: /\b(plan|planning|timeline|deadline|deadlines|task|tasks|checklist|next step|start|someday)\b/i,
  },
  {
    intent: 'destinations',
    pattern: /\b(country|countries|destination|destinations|where|compare|comparison|healthcare|school|schools|education|family|children|kids|pets?|climate|language)\b/i,
  },
]

/**
 * Routes a plain-language question to an existing Kolmari workflow.
 * This is intentionally deterministic: it does not answer the question, infer
 * profile facts, or persist the user's text. The destination workflow remains
 * responsible for calculations, sourced facts, and saved changes.
 */
export function routeDecisionQuestion(question: string): DecisionRoute {
  const normalized = question.trim()
  const match = INTENT_PATTERNS.find(({ pattern }) => pattern.test(normalized))
  return ROUTES[match?.intent ?? 'destinations']
}

