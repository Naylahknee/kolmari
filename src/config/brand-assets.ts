/**
 * Kolmari brand asset paths — centralized references to all approved brand assets.
 * Do not hardcode asset paths in components. Import from here.
 */
export const BRAND_ASSETS = {
  // Wordmark
  wordmark: '/brand/KolmariWordMark.svg',
  wordmarkFallback: '/brand/NexitWordMark.svg', // compat until new wordmark is delivered

  // Butterfly — primary visual symbol
  butterfly: '/brand/kolmari-butterfly.png',

  // App icons
  appIcon: '/brand/nexit-app-icon.png', // replaced when Kolmari icon delivered

  // Favicons
  faviconSvg: '/brand/faviconNexit.svg',
  favicon32: '/brand/favicon-32.png',
  favicon16: '/brand/favicon-16.png',
  faviconIco: '/brand/favicon.ico',

  // Scene imagery (retained — relocation imagery is brand-neutral)
  heroAirplaneWindow: '/images/hero-airplane-window.png',
  journeyGlobePins: '/images/journey-globe-pins.png',
  passportVisaDocuments: '/images/passport-visa-documents.png',
  luggageTropicalCoast: '/images/luggage-tropical-coast.png',
  dashboardBeachBanner: '/images/dashboard-beach-banner.png',
  footerBeachOcean: '/images/footer-beach-ocean.png',
  travelRoutePin: '/images/travel-route-pin.png',
  airplane: '/images/airplane.png',
} as const

export type BrandAssets = typeof BRAND_ASSETS
