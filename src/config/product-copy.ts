/**
 * Kolmari product copy — approved navigation labels, CTA strings, and terminology.
 * Use these values in navigation, headings, buttons, and metadata.
 */
export const PRODUCT_COPY = {
  // Navigation labels
  nav: {
    dashboard: 'Dashboard',
    world: 'Your World',
    destinations: 'Destinations',
    pathways: 'Pathways',
    plan: 'My Plan',
    flutterMode: 'Flutter Mode',
    documents: 'Documents',
    kolmariKlub: 'Kolmari Klub',
    costCalculator: 'Cost Calculator',
    greenbook: 'Greenbook',
    settings: 'Settings',
    profile: 'Profile',
  },

  // Nav group labels
  groups: {
    explore: 'Explore',
    plan: 'Plan',
    connect: 'Connect',
    tools: 'Tools',
  },

  // Feature terms
  matchScore: 'Match Score',
  communityFit: 'Community Fit',
  readiness: 'Move Readiness',
  timeline: 'Move Timeline',
  tracker: 'Progress Tracker',
  destination: 'Destination',
  destinations: 'Destinations',
  pathways: 'Pathways',
  plan: 'My Plan',
  flutterMode: 'Flutter Mode',
  greenbook: 'Greenbook Insights',
  greenbookLayer: 'Greenbook Layer',
  kolmariKlub: 'Kolmari Klub',

  // Core calls to action
  startCta: 'Build My Move Plan',
  executionCta: 'Enter Flutter Mode',
  exploreCta: 'Explore Countries',
  viewPathwaysCta: 'View My Pathways',
  joinKlubCta: 'Join Kolmari Klub',
  saveDestinationCta: 'Save Destination',
  compareDestinationsCta: 'Compare Destinations',
  nextStepsCta: 'See My Next Steps',
} as const

export type ProductCopy = typeof PRODUCT_COPY
