/**
 * Kolmari brand configuration — single source of truth for public-facing brand values.
 * Do not scatter hardcoded brand labels through the application. Import from here.
 */
export const BRAND = {
  name: 'Kolmari',
  communityName: 'Kolmari Klub',
  tagline: 'Build a life without borders.',
  description:
    'Kolmari helps people discover countries, understand relocation pathways, and build a practical plan for life abroad.',
} as const

export type BrandConfig = typeof BRAND
