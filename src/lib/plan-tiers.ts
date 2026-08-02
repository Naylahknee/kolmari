// Subscription tiers. Pure module (no server-only imports) so both server code
// and client components can share these constants safely.
export const PLAN_TIERS = ['free', 'plus', 'navigator'] as const
export type PlanTier = (typeof PLAN_TIERS)[number]
