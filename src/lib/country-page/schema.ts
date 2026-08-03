import { z } from 'zod'

/* Country Design System — shared page-layout contract.
 *
 * Every Kolmari country page renders from ONE shared template driven by this
 * config (the "Kolmari Country Page Standard", reference implementation:
 * Portugal). No country gets its own layout component or bespoke spacing. */

const focalPoint = z.object({ x: z.number().min(0).max(100), y: z.number().min(0).max(100) })

export const heroMetricSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  valueSource: z.string().min(1),
  supportingSource: z.string().optional(),
})

export const countryTabSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  route: z.string().min(1),
})

export const countryPageLayoutConfigSchema = z.object({
  layoutStyle: z.literal('kolmari-country-page-standard'),
  hero: z.object({
    minHeight: z.number().int().min(240).max(560),
    contentMaxWidth: z.number().int().min(360).max(900),
    focalPoint,
    overlayStrength: z.number().min(0).max(1),
    metrics: z.array(heroMetricSchema).length(4),
  }),
  tabs: z.array(countryTabSchema).min(1),
  overview: z.object({
    mainSidebarRatio: z.string().min(1),
    personalizedSummary: z.object({ enabled: z.boolean() }),
    snapshot: z.object({
      showMap: z.boolean(),
      showClimateStrip: z.boolean(),
      showTradeoff: z.boolean(),
      factKeys: z.array(z.string()),
    }),
    showMatchScore: z.boolean(),
    showRecommendedActions: z.boolean(),
    showTopCities: z.boolean(),
  }),
})

export type CountryPageLayoutConfig = z.infer<typeof countryPageLayoutConfigSchema>
export type HeroMetric = z.infer<typeof heroMetricSchema>
export type CountryTab = z.infer<typeof countryTabSchema>
