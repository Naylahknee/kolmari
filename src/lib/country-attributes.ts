/**
 * Per-country panel attributes, gathered from free verified sources.
 *
 * Sources (verified 2026-09-28):
 * - Safety advisory level: US State Department travel advisories (travel.state.gov)
 * - Safety score: derived from Global Peace Index 2026 (Institute for
 *   Economics & Peace, visionofhumanity.org) as round((5 - gpi) / 4 * 100);
 *   higher means safer. Shown on panels as "N/100 safety".
 * - Internet: Speedtest Global Index fixed-broadband median, latest 2026 month.
 * - Climate/landscape: dominant climate zone and notable geography.
 *
 * Countries on the State Department Level 4 "Do Not Travel" list and
 * countries involved in the current US-Iran/Strait of Hormuz conflict are
 * excluded from Kolmari's listings entirely.
 */

import type { PanelIconName } from '@/components/kolmari/panel-icons'
import {
  costIconForBand,
  internetIconForMbps,
  safetyIconForLevel,
  safetyLabelForLevel,
} from '@/components/kolmari/panel-icons'

export type CountryAttributes = {
  slug: string
  advisoryLevel: 1 | 2 | 3 | 4
  /** 0-100 safety score derived from GPI 2026; higher is safer. Null when no
   * verifiable 2026 GPI score exists (panels fall back to the advisory label). */
  safetyScore: number | null
  climateIcon: PanelIconName
  climateLabel: string
  landscapeIcon: PanelIconName
  landscapeLabel: string
  /** Fixed-broadband median Mbps, latest 2026 month available. */
  broadbandMbps: number | null
}

export const ATTRIBUTE_SOURCES = {
  advisory: 'US State Department travel advisories (travel.state.gov)',
  safetyScore: 'Derived from Global Peace Index 2026, Institute for Economics & Peace (visionofhumanity.org): round((5 - gpi) / 4 * 100)',
  internet: 'Speedtest Global Index, fixed broadband median (speedtest.net/global-index)',
  verifiedDate: '2026-09-28',
} as const

// Populated from verified research (see country-research-2026.json).
export const COUNTRY_ATTRIBUTES: Record<string, CountryAttributes> = {
  mexico: {
    slug: 'mexico',
    advisoryLevel: 2,
    safetyScore: 59,
    climateIcon: 'sunny',
    climateLabel: 'Temperate to dry',
    landscapeIcon: 'beach',
    landscapeLabel: 'Beaches',
    broadbandMbps: 186.3,
  },
  canada: {
    slug: 'canada',
    advisoryLevel: 1,
    safetyScore: 87,
    climateIcon: 'snowy',
    climateLabel: 'Continental climate',
    landscapeIcon: 'mountains',
    landscapeLabel: 'Mountains',
    broadbandMbps: 373.23,
  },
  'united-kingdom': {
    slug: 'united-kingdom',
    advisoryLevel: 2,
    safetyScore: 82,
    climateIcon: 'partly-cloudy',
    climateLabel: 'Temperate climate',
    landscapeIcon: 'beach',
    landscapeLabel: 'Coastline',
    broadbandMbps: 295.85,
  },
  germany: {
    slug: 'germany',
    advisoryLevel: 2,
    safetyScore: 84,
    climateIcon: 'partly-cloudy',
    climateLabel: 'Temperate climate',
    landscapeIcon: 'forest',
    landscapeLabel: 'Forests',
    broadbandMbps: 204.18,
  },
  australia: {
    slug: 'australia',
    advisoryLevel: 1,
    safetyScore: 85,
    climateIcon: 'sunny',
    climateLabel: 'Arid to temperate',
    landscapeIcon: 'beach',
    landscapeLabel: 'Beaches',
    broadbandMbps: 259.32,
  },
  'south-korea': {
    slug: 'south-korea',
    advisoryLevel: 1,
    safetyScore: 79,
    climateIcon: 'cold',
    climateLabel: 'Humid continental climate',
    landscapeIcon: 'mountains',
    landscapeLabel: 'Mountains',
    broadbandMbps: 317.89,
  },
  france: {
    slug: 'france',
    advisoryLevel: 2,
    safetyScore: 73,
    climateIcon: 'partly-cloudy',
    climateLabel: 'Temperate climate',
    landscapeIcon: 'beach',
    landscapeLabel: 'Beaches',
    broadbandMbps: 524.45,
  },
  japan: {
    slug: 'japan',
    advisoryLevel: 1,
    safetyScore: 88,
    climateIcon: 'partly-cloudy',
    climateLabel: 'Temperate climate',
    landscapeIcon: 'mountains',
    landscapeLabel: 'Mountains',
    broadbandMbps: 401.69,
  },
  spain: {
    slug: 'spain',
    advisoryLevel: 2,
    safetyScore: 84,
    climateIcon: 'sunny',
    climateLabel: 'Mediterranean climate',
    landscapeIcon: 'beach',
    landscapeLabel: 'Beaches',
    broadbandMbps: 357.92,
  },
  'costa-rica': {
    slug: 'costa-rica',
    advisoryLevel: 2,
    safetyScore: 78,
    climateIcon: 'hot',
    climateLabel: 'Tropical climate',
    landscapeIcon: 'beach',
    landscapeLabel: 'Beaches',
    broadbandMbps: 223.25,
  },
  netherlands: {
    slug: 'netherlands',
    advisoryLevel: 2,
    safetyScore: 86,
    climateIcon: 'partly-cloudy',
    climateLabel: 'Temperate oceanic climate',
    landscapeIcon: 'beach',
    landscapeLabel: 'Coastline',
    broadbandMbps: 342.14,
  },
  ireland: {
    slug: 'ireland',
    advisoryLevel: 1,
    safetyScore: 91,
    climateIcon: 'partly-cloudy',
    climateLabel: 'Temperate oceanic climate',
    landscapeIcon: 'beach',
    landscapeLabel: 'Coastline',
    broadbandMbps: 293.55,
  },
  italy: {
    slug: 'italy',
    advisoryLevel: 2,
    safetyScore: 82,
    climateIcon: 'sunny',
    climateLabel: 'Mediterranean climate',
    landscapeIcon: 'beach',
    landscapeLabel: 'Beaches',
    broadbandMbps: 281.08,
  },
  'new-zealand': {
    slug: 'new-zealand',
    advisoryLevel: 1,
    safetyScore: 91,
    climateIcon: 'partly-cloudy',
    climateLabel: 'Temperate maritime climate',
    landscapeIcon: 'mountains',
    landscapeLabel: 'Mountains',
    broadbandMbps: 304.17,
  },
  philippines: {
    slug: 'philippines',
    advisoryLevel: 2,
    safetyScore: 73,
    climateIcon: 'hot',
    climateLabel: 'Tropical monsoon climate',
    landscapeIcon: 'island',
    landscapeLabel: 'Islands',
    broadbandMbps: 188.56,
  },
  portugal: {
    slug: 'portugal',
    advisoryLevel: 1,
    safetyScore: 89,
    climateIcon: 'sunny',
    climateLabel: 'Mediterranean climate',
    landscapeIcon: 'beach',
    landscapeLabel: 'Beaches',
    broadbandMbps: 360.09,
  },
  thailand: {
    slug: 'thailand',
    advisoryLevel: 2,
    safetyScore: 73,
    climateIcon: 'hot',
    climateLabel: 'Tropical savanna climate',
    landscapeIcon: 'beach',
    landscapeLabel: 'Beaches',
    broadbandMbps: 368.89,
  },
  panama: {
    slug: 'panama',
    advisoryLevel: 2,
    safetyScore: 76,
    climateIcon: 'hot',
    climateLabel: 'Tropical monsoon climate',
    landscapeIcon: 'beach',
    landscapeLabel: 'Beaches',
    broadbandMbps: 287.2,
  },
  albania: {
    slug: 'albania',
    advisoryLevel: 2,
    safetyScore: 82,
    climateIcon: 'sunny',
    climateLabel: 'Mediterranean climate',
    landscapeIcon: 'beach',
    landscapeLabel: 'Beaches',
    broadbandMbps: 169.88,
  },
  bulgaria: {
    slug: 'bulgaria',
    advisoryLevel: 1,
    safetyScore: 84,
    climateIcon: 'partly-cloudy',
    climateLabel: 'Temperate continental climate',
    landscapeIcon: 'beach',
    landscapeLabel: 'Beaches',
    broadbandMbps: 190.56,
  },
  romania: {
    slug: 'romania',
    advisoryLevel: 1,
    safetyScore: 80,
    climateIcon: 'partly-cloudy',
    climateLabel: 'Temperate continental climate',
    landscapeIcon: 'mountains',
    landscapeLabel: 'Mountains',
    broadbandMbps: 359.65,
  },
  slovenia: {
    slug: 'slovenia',
    advisoryLevel: 1,
    safetyScore: 91,
    climateIcon: 'partly-cloudy',
    climateLabel: 'Temperate continental climate',
    landscapeIcon: 'mountains',
    landscapeLabel: 'Mountains',
    broadbandMbps: 363.05,
  },
  malta: {
    slug: 'malta',
    advisoryLevel: 1,
    safetyScore: null,
    climateIcon: 'sunny',
    climateLabel: 'Mediterranean climate',
    landscapeIcon: 'island',
    landscapeLabel: 'Islands',
    broadbandMbps: 301.12,
  },
  uruguay: {
    slug: 'uruguay',
    advisoryLevel: 2,
    safetyScore: 81,
    climateIcon: 'partly-cloudy',
    climateLabel: 'Humid subtropical climate',
    landscapeIcon: 'beach',
    landscapeLabel: 'Beaches',
    broadbandMbps: 263.27,
  },
  paraguay: {
    slug: 'paraguay',
    advisoryLevel: 1,
    safetyScore: 78,
    climateIcon: 'hot',
    climateLabel: 'Subtropical climate',
    landscapeIcon: 'forest',
    landscapeLabel: 'Forests',
    broadbandMbps: 220.44,
  },
  belize: {
    slug: 'belize',
    advisoryLevel: 2,
    safetyScore: null,
    climateIcon: 'hot',
    climateLabel: 'Tropical climate',
    landscapeIcon: 'beach',
    landscapeLabel: 'Beaches',
    broadbandMbps: 86.47,
  },
  ecuador: {
    slug: 'ecuador',
    advisoryLevel: 2,
    safetyScore: 62,
    climateIcon: 'partly-cloudy',
    climateLabel: 'Varies by altitude',
    landscapeIcon: 'island',
    landscapeLabel: 'Islands',
    broadbandMbps: 315.06,
  },
  georgia: {
    slug: 'georgia',
    advisoryLevel: 1,
    safetyScore: 73,
    climateIcon: 'partly-cloudy',
    climateLabel: 'Subtropical to continental',
    landscapeIcon: 'mountains',
    landscapeLabel: 'Mountains',
    broadbandMbps: 55.07,
  },
  cambodia: {
    slug: 'cambodia',
    advisoryLevel: 2,
    safetyScore: 73,
    climateIcon: 'hot',
    climateLabel: 'Tropical climate',
    landscapeIcon: 'beach',
    landscapeLabel: 'Beaches',
    broadbandMbps: 81.84,
  },
  ghana: {
    slug: 'ghana',
    advisoryLevel: 2,
    safetyScore: 76,
    climateIcon: 'hot',
    climateLabel: 'Tropical climate',
    landscapeIcon: 'beach',
    landscapeLabel: 'Beaches',
    broadbandMbps: 90.42,
  },
}

export function getCountryAttributes(slug: string): CountryAttributes | null {
  return COUNTRY_ATTRIBUTES[slug] ?? null
}

export type AttributeIcon = { name: PanelIconName; label: string }

/**
 * The five panel attribute icons for a country, in display order:
 * climate, landscape, cost tier, safety, internet.
 */
export function attributeIconsFor(slug: string, costBand: string | null): AttributeIcon[] {
  const attrs = getCountryAttributes(slug)
  if (!attrs) return []
  return [
    { name: attrs.climateIcon, label: attrs.climateLabel },
    { name: attrs.landscapeIcon, label: attrs.landscapeLabel },
    { name: costIconForBand(costBand), label: costBand ? `${costBand} cost of living` : 'Cost of living' },
    { name: safetyIconForLevel(attrs.advisoryLevel), label: safetyLabelForLevel(attrs.advisoryLevel) },
    { name: internetIconForMbps(attrs.broadbandMbps), label: 'Internet speed' },
  ]
}
