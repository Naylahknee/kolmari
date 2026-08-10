import { BRAND } from '@/config/brand'
import { PRODUCT_COPY } from '@/config/product-copy'

export const KOLMARI_LEXICON = {
  brand: BRAND.name,
  world: PRODUCT_COPY.world,
  destinations: PRODUCT_COPY.destinations,
  destination: PRODUCT_COPY.destination,
  profile: 'Profile',
  plan: PRODUCT_COPY.plan,
  matchScore: PRODUCT_COPY.matchScore,
  pathways: PRODUCT_COPY.pathways,
  readiness: PRODUCT_COPY.readiness,
  timeline: PRODUCT_COPY.timeline,
  greenbookLayer: 'Greenbook Layer',
  greenbookInsights: 'Greenbook Insights',
  communityFit: PRODUCT_COPY.communityFit,
  flutterMode: PRODUCT_COPY.flutterMode,
  tracker: PRODUCT_COPY.tracker,
  startCta: PRODUCT_COPY.startCta,
  executionCta: PRODUCT_COPY.executionCta,
  worldTitle: PRODUCT_COPY.worldTitle,
  destinationTitle: PRODUCT_COPY.destinationTitle,
  regionTitle: 'Explore This Destination',
} as const

export const KOLMARI_STORY = [
  'Start Your Move',
  'Choose Your Destination',
  'Explore a Destination',
  'Review Your Pathways',
  KOLMARI_LEXICON.startCta,
  KOLMARI_LEXICON.executionCta,
] as const
