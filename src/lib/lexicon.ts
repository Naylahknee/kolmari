// ─── Legacy lexicon (preserved for compatibility) ────────────────────────────
// Do not delete. Used by existing components until migration is complete.
export const NEXIT_LEXICON = {
  brand: 'Nexit',
  map: 'Nexitnation',
  place: 'Nextination',
  profile: 'Nexit Profile',
  plan: 'Nexit Plan',
  matchScore: 'Match Score',
  pathways: 'Pathways',
  readiness: 'Nexit Readiness',
  timeline: 'Nexit Timeline',
  greenbookLayer: 'Greenbook Layer',
  greenbookInsights: 'Greenbook Insights',
  communityFit: 'Community Fit',
  nexicutionMode: 'Nexicution Mode',
  tracker: 'Nexit Tracker',
  startCta: 'Start Your Nexit',
  executionCta: 'Enter Nexicution Mode',
  mapTitle: 'Choose Your Nexitnation',
  regionTitle: 'Explore This Nextination',
} as const

export const NEXIT_STORY = [
  NEXIT_LEXICON.startCta,
  NEXIT_LEXICON.mapTitle,
  'Explore a Nextination',
  'Review Your Pathways',
  'Build Your Nexit Plan',
  NEXIT_LEXICON.executionCta,
] as const

// ─── Kolmari lexicon (new — use for all migrated pages) ──────────────────────
export const KOLMARI_LEXICON = {
  brand: 'Kolmari',
  communityName: 'Kolmari Klub',
  map: 'Your World',
  place: 'Destination',
  places: 'Destinations',
  profile: 'Kolmari Profile',
  plan: 'My Plan',
  matchScore: 'Match Score',
  pathways: 'Pathways',
  readiness: 'Move Readiness',
  timeline: 'Move Timeline',
  greenbookLayer: 'Greenbook Layer',
  greenbookInsights: 'Greenbook Insights',
  communityFit: 'Community Fit',
  flutterMode: 'Flutter Mode',
  tracker: 'Progress Tracker',
  startCta: 'Build My Move Plan',
  executionCta: 'Enter Flutter Mode',
  exploreCta: 'Explore Countries',
  mapTitle: 'Your World',
  regionTitle: 'Explore This Destination',
  tagline: 'Build a life without borders.',
} as const

export const KOLMARI_STORY = [
  KOLMARI_LEXICON.startCta,
  KOLMARI_LEXICON.exploreCta,
  'Explore a Destination',
  'View My Pathways',
  KOLMARI_LEXICON.plan,
  KOLMARI_LEXICON.executionCta,
] as const
