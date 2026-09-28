/**
 * Kolmari icon library.
 *
 * Source: Kolmari Icons design comp (Sep 2026).
 * Design tokens: 24x24 grid, 1.8px stroke, round line caps and joins,
 * drawn in currentColor unless the source artwork specifies its own
 * stroke/fill color (kept as-is from the comp).
 *
 * Usage: <KolmariIcon name="safety" className="size-5" />
 */

import type { ReactNode, SVGProps } from 'react'

export type KolmariIconName =
  | 'safety'
  | 'healthcare'
  | 'cost-of-living'
  | 'taxes'
  | 'housing'
  | 'climate-and-weather'
  | 'infrastructure'
  | 'internet'
  | 'transport'
  | 'education'
  | 'jobs-and-economy'
  | 'banking'
  | 'visa-and-residency'
  | 'language'
  | 'community'
  | 'nature-and-outdoors'
  | 'governance'
  | 'food-and-culture'
  | 'stage-discover'
  | 'stage-fit-check'
  | 'stage-compare'
  | 'stage-decide'
  | 'stage-plan'
  | 'stage-apply'
  | 'stage-move'
  | 'stage-settle'
  | 'search'
  | 'notifications'
  | 'pro-lock'
  | 'done'
  | 'chevron'
  | 'profile'
  | 'settings'
  | 'add'
  | 'filter'
  | 'favorite'
  | 'download'
  | 'explore'
  | 'sunny'
  | 'partly-cloudy'
  | 'overcast'
  | 'rainy'
  | 'stormy'
  | 'snowy'
  | 'hot'
  | 'cold'
  | 'very-safe'
  | 'generally-safe'
  | 'use-caution'
  | 'beach'
  | 'mountains'
  | 'forest'
  | 'desert'
  | 'island'
  | 'big-city'
  | 'basic'
  | 'average'
  | 'fast'

const ICONS: Record<KolmariIconName, ReactNode> = {
  'safety': (
    <>
      <path d="M12 3l7 2.8v5.4c0 4.6-3 7.6-7 9.3-4-1.7-7-4.7-7-9.3V5.8z" />
      <path d="M9.2 12l2 2 3.8-4" />
    </>
  ),
  'healthcare': (
    <>
      <path d="M9.5 4h5v5.5H20v5h-5.5V20h-5v-5.5H4v-5h5.5z" />
    </>
  ),
  'cost-of-living': (
    <>
      <rect x="3" y="7" width="18" height="11" rx="2" />
      <circle cx="12" cy="12.5" r="2.6" />
      <path d="M6.4 10.2h.01M17.6 14.8h.01" />
    </>
  ),
  'taxes': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 15l6-6" />
      <circle cx="9.3" cy="9.3" r="1" />
      <circle cx="14.7" cy="14.7" r="1" />
    </>
  ),
  'housing': (
    <>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 9.2V20h12V9.2" />
      <path d="M10 20v-5.5h4V20" />
    </>
  ),
  'climate-and-weather': (
    <>
      <path d="M12 3v1.5" />
      <path d="M18.4 5.6l-1.1 1.1" />
      <path d="M20.5 12H19" />
      <path d="M15.9 12.7A4 4 0 1010 8.5" />
      <path d="M13 21H7a4.5 4.5 0 114.4-5.5H13a2.75 2.75 0 010 5.5z" />
    </>
  ),
  'infrastructure': (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V8h6v13" />
      <path d="M13 21V3.5h6V21" />
      <path d="M8 11h.01M8 14.5h.01M8 18h.01M16 7h.01M16 10.5h.01M16 14h.01M16 17.5h.01" />
    </>
  ),
  'internet': (
    <>
      <path d="M2.5 8.8a15 15 0 0119 0" />
      <path d="M5.6 12.4a10.4 10.4 0 0112.8 0" />
      <path d="M8.7 15.9a5.8 5.8 0 016.6 0" />
      <path d="M12 19.5h.01" />
    </>
  ),
  'transport': (
    <>
      <rect x="5" y="3.5" width="14" height="14.5" rx="3" />
      <path d="M5 11.5h14" />
      <path d="M9 15h.01M15 15h.01" />
      <path d="M8.7 18l-1.7 3M15.3 18l1.7 3" />
    </>
  ),
  'education': (
    <>
      <path d="M2.5 9L12 4.5 21.5 9 12 13.5z" />
      <path d="M6.5 11.3v4.4c0 1.5 2.5 2.8 5.5 2.8s5.5-1.3 5.5-2.8v-4.4" />
      <path d="M21.5 9v4.5" />
    </>
  ),
  'jobs-and-economy': (
    <>
      <rect x="3" y="7.5" width="18" height="12.5" rx="2" />
      <path d="M9 7.5V6a2 2 0 012-2h2a2 2 0 012 2v1.5" />
      <path d="M3 12.5h18" />
    </>
  ),
  'banking': (
    <>
      <path d="M3 9L12 3.5 21 9H3z" />
      <path d="M5 12v5.5M9.7 12v5.5M14.3 12v5.5M19 12v5.5" />
      <path d="M3 20.5h18" />
    </>
  ),
  'visa-and-residency': (
    <>
      <rect x="4.5" y="2.5" width="15" height="19" rx="2.5" />
      <circle cx="12" cy="9.5" r="3.2" />
      <path d="M8.5 16.5h7" />
    </>
  ),
  'language': (
    <>
      <path d="M4 5.5h8" />
      <path d="M8 3.5v2" />
      <path d="M10.5 5.5c-.8 3.2-3 5.9-6.5 7.6" />
      <path d="M5.5 8.5c1.2 2.5 3.4 4.3 6 5" />
      <path d="M13.5 20.5l4-9.5 4 9.5" />
      <path d="M14.9 17.2h5.2" />
    </>
  ),
  'community': (
    <>
      <circle cx="9" cy="8.2" r="3.4" />
      <path d="M3.2 20a5.8 5.8 0 0111.6 0" />
      <path d="M15.8 5.2a3.4 3.4 0 010 6" />
      <path d="M17.4 14.6a5.8 5.8 0 013.4 5.4" />
    </>
  ),
  'nature-and-outdoors': (
    <>
      <circle cx="17.8" cy="6.2" r="2.4" />
      <path d="M2.5 19.5L9 9l4.3 6.8 2.6-3.8 5.6 7.5z" />
    </>
  ),
  'governance': (
    <>
      <path d="M12 3v18" />
      <path d="M9 21h6" />
      <path d="M5 7h14" />
      <path d="M16 15l3-8 3 8a5 5 0 01-6 0" />
      <path d="M2 15l3-8 3 8a5 5 0 01-6 0" />
    </>
  ),
  'food-and-culture': (
    <>
      <path d="M7.5 2.5v19" />
      <path d="M4.5 2.5v5a3 3 0 006 0v-5" />
      <path d="M17.5 2.5c-2 1.2-3 3.4-3 6 0 2.3 1.3 3.5 3 3.5V21.5" />
    </>
  ),
  'stage-discover': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.8 9.2l-1.7 4.6-4.6 1.7 1.7-4.6z" />
    </>
  ),
  'stage-fit-check': (
    <>
      <path d="M4 7h9M17 7h3M15 5v4M4 17h3M11 17h9M9 15v4" />
    </>
  ),
  'stage-compare': (
    <>
      <path d="M4 6h6v12H4zM14 6h6v12h-6z" />
    </>
  ),
  'stage-decide': (
    <>
      <path d="M12 21s-7-5-7-11a7 7 0 0114 0c0 6-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  'stage-plan': (
    <>
      <rect x="4" y="6" width="16" height="14" rx="1.5" />
      <path d="M4 11h16M8 4v4M16 4v4" />
    </>
  ),
  'stage-apply': (
    <>
      <path d="M7 3h7l4 4v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
      <path d="M14 3v4h4M9.5 12h5M9.5 16h5" />
    </>
  ),
  'stage-move': (
    <>
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
    </>
  ),
  'stage-settle': (
    <>
      <path d="M4 11l8-7 8 7v9a1 1 0 01-1 1H5a1 1 0 01-1-1z" />
      <image href="/assets/kolmari-butterfly-t.png" x="8" y="12" width="8" height="5.8" />
    </>
  ),
  'search': (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20.5 20.5L16 16" />
    </>
  ),
  'notifications': (
    <>
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" />
    </>
  ),
  'pro-lock': (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 018 0v3" />
    </>
  ),
  'done': (
    <>
      <path d="M20 6L9 17l-5-5" />
    </>
  ),
  'chevron': (
    <>
      <path d="M9 18l6-6-6-6" />
    </>
  ),
  'profile': (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20a7 7 0 0114 0" />
    </>
  ),
  'settings': (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5l1.2 2.6 2.8-.7.7 2.8 2.6 1.2-1.4 2.6 1.4 2.6-2.6 1.2-.7 2.8-2.8-.7-1.2 2.6-1.2-2.6-2.8.7-.7-2.8-2.6-1.2 1.4-2.6-1.4-2.6 2.6-1.2.7-2.8 2.8.7z" />
    </>
  ),
  'add': (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  'filter': (
    <>
      <path d="M3 5h18M6.5 12h11M10 19h4" />
    </>
  ),
  'favorite': (
    <>
      <path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6-5.4-2.9-5.4 2.9 1.1-6-4.5-4.3 6.1-.8z" />
    </>
  ),
  'download': (
    <>
      <path d="M12 3v12M6.5 10.5L12 16l5.5-5.5M4 20h16" />
    </>
  ),
  'explore': (
    <>
      <path d="M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
    </>
  ),
  'sunny': (
    <>
      <circle cx="12" cy="12" r="4.4" fill="#f3c516" />
      <path d="M12 2.6v2.3M12 19.1v2.3M2.6 12h2.3M19.1 12h2.3M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7" stroke="#f3c516" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),
  'partly-cloudy': (
    <>
      <circle cx="15.5" cy="8" r="3.6" fill="#f3c516" />
      <path d="M15.5 2.2v1.5M20.5 5l-1 1M21.8 9.8h-1.5" stroke="#f3c516" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M6.5 20h8.5a3.4 3.4 0 100-6.8 5 5 0 00-9.6 1.4A2.9 2.9 0 006.5 20z" fill="#9fb0cc" />
    </>
  ),
  'overcast': (
    <>
      <path d="M9.5 11h8.3a2.8 2.8 0 100-5.6 4.2 4.2 0 00-8.1 1.1A2.4 2.4 0 009.5 11z" fill="#cfd9e8" />
      <path d="M5.5 19.5h9.7a3.2 3.2 0 100-6.4A4.8 4.8 0 006 14.4a2.7 2.7 0 00-.5 5.1z" fill="#9fb0cc" />
    </>
  ),
  'rainy': (
    <>
      <path d="M6.5 15h9a3.3 3.3 0 100-6.6 5 5 0 00-9.6 1.4A2.9 2.9 0 006.5 15z" fill="#9fb0cc" />
      <path d="M8.2 17.3l-.9 2.8M12.2 17.3l-.9 2.8M16.2 17.3l-.9 2.8" stroke="#3a5a94" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),
  'stormy': (
    <>
      <path d="M6.5 13.5h9a3.3 3.3 0 100-6.6 5 5 0 00-9.6 1.4 2.9 2.9 0 00.6 5.2z" fill="#6b7a92" />
      <path d="M13.4 13l-3.6 5h2.3l-1.3 4 4.1-5.6h-2.3z" fill="#f3c516" />
    </>
  ),
  'snowy': (
    <>
      <path d="M6.5 15h9a3.3 3.3 0 100-6.6 5 5 0 00-9.6 1.4A2.9 2.9 0 006.5 15z" fill="#9fb0cc" />
      <circle cx="8" cy="18" r="1.1" fill="#6b7a92" />
      <circle cx="12" cy="20" r="1.1" fill="#6b7a92" />
      <circle cx="16" cy="18" r="1.1" fill="#6b7a92" />
    </>
  ),
  'hot': (
    <>
      <path d="M9 13.8V5.6a2 2 0 014 0v8.2a4.2 4.2 0 11-4 0z" fill="#fff" stroke="#17305b" strokeWidth="1.6" />
      <circle cx="11" cy="17.5" r="2.2" fill="#f0637a" />
      <path d="M11 17.5V6.8" stroke="#f0637a" strokeWidth="2" strokeLinecap="round" />
      <path d="M17.5 5.5h2.2M17.5 8.5h3.4M17.5 11.5h2.2" stroke="#f0637a" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  'cold': (
    <>
      <path d="M9 13.8V5.6a2 2 0 014 0v8.2a4.2 4.2 0 11-4 0z" fill="#fff" stroke="#17305b" strokeWidth="1.6" />
      <circle cx="11" cy="17.5" r="2.2" fill="#3a5a94" />
      <path d="M11 17.5v-3.2" stroke="#3a5a94" strokeWidth="2" strokeLinecap="round" />
      <path d="M18.6 5.6v6M16 7.1l5.2 3M21.2 7.1l-5.2 3" stroke="#3a5a94" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  'very-safe': (
    <>
      <path d="M12 2.8l7.2 2.9v5.5c0 4.7-3.1 7.8-7.2 9.5-4.1-1.7-7.2-4.8-7.2-9.5V5.7z" fill="#1f9d94" />
      <path d="M9 12l2.1 2.1 4-4.2" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  'generally-safe': (
    <>
      <path d="M12 2.8l7.2 2.9v5.5c0 4.7-3.1 7.8-7.2 9.5-4.1-1.7-7.2-4.8-7.2-9.5V5.7z" fill="#f3c516" />
      <path d="M9 12.2h6" stroke="#17305b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </>
  ),
  'use-caution': (
    <>
      <path d="M12 2.8l7.2 2.9v5.5c0 4.7-3.1 7.8-7.2 9.5-4.1-1.7-7.2-4.8-7.2-9.5V5.7z" fill="#f0637a" />
      <path d="M12 7.5v5M12 15.7h.01" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </>
  ),
  'beach': (
    <>
      <circle cx="16.8" cy="6.5" r="3" fill="#f3c516" />
      <path d="M2.5 15c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0" stroke="#3a5a94" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M2.5 19.5c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 6 0" stroke="#9fb0cc" strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  ),
  'mountains': (
    <>
      <circle cx="18.2" cy="5.8" r="2.6" fill="#f3c516" />
      <path d="M2 20L8.5 9.5 15 20z" fill="#17305b" />
      <path d="M11.5 20l4.5-7 5 7z" fill="#3a5a94" />
      <path d="M6.9 12.1l1.6-2.6 1.6 2.6-1.6 1.2z" fill="#fff" />
    </>
  ),
  'forest': (
    <>
      <path d="M8 3.5L12.5 10h-9z" fill="#1f9d94" />
      <path d="M8 7.5l5 8H3z" fill="#177a72" />
      <rect x="7" y="15.5" width="2" height="4.5" rx="1" fill="#17305b" />
      <path d="M17 7.5l4 7h-8z" fill="#1f9d94" />
      <rect x="16.1" y="14.5" width="1.8" height="4" rx="0.9" fill="#17305b" />
    </>
  ),
  'desert': (
    <>
      <circle cx="18.5" cy="5.3" r="2.4" fill="#f3c516" />
      <rect x="9.3" y="5.5" width="3.6" height="15" rx="1.8" fill="#1f9d94" />
      <path d="M9.3 12.5H7.2a1.7 1.7 0 01-1.7-1.7V9.2" stroke="#1f9d94" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M12.9 15h2.1a1.7 1.7 0 001.7-1.7v-1.6" stroke="#1f9d94" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  'island': (
    <>
      <path d="M4.5 20a7.5 4.2 0 0115 0z" fill="#f3c516" />
      <path d="M13 19.5c-.5-3.6-.3-6.5.8-9" stroke="#17305b" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M13.8 10.5C11.7 8.5 9.4 8.1 7 9.1M13.8 10.5c2.1-2 4.4-2.4 6.7-1.4M13.8 10.5c-.4-2.6.5-4.7 2.5-6" stroke="#1f9d94" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </>
  ),
  'big-city': (
    <>
      <path d="M4 20V10h5v10z" fill="#3a5a94" />
      <path d="M10.5 20V4.5h6V20z" fill="#17305b" />
      <path d="M18 20v-8h3.5v8z" fill="#9fb0cc" />
      <path d="M6.5 12.8h.01M6.5 15.8h.01M13.5 7.5h.01M13.5 10.5h.01M13.5 13.5h.01" stroke="#f3c516" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),
  'basic': (
    <>
      <path d="M2.8 9a14.6 14.6 0 0118.4 0" stroke="#dfe5ee" strokeWidth="2.2" />
      <path d="M5.8 12.6a10 10 0 0112.4 0" stroke="#dfe5ee" strokeWidth="2.2" />
      <path d="M8.8 16.1a5.6 5.6 0 016.4 0" stroke="#17305b" strokeWidth="2.2" />
      <path d="M12 19.6h.01" stroke="#17305b" strokeWidth="2.6" />
    </>
  ),
  'average': (
    <>
      <path d="M2.8 9a14.6 14.6 0 0118.4 0" stroke="#dfe5ee" strokeWidth="2.2" />
      <path d="M5.8 12.6a10 10 0 0112.4 0" stroke="#17305b" strokeWidth="2.2" />
      <path d="M8.8 16.1a5.6 5.6 0 016.4 0" stroke="#17305b" strokeWidth="2.2" />
      <path d="M12 19.6h.01" stroke="#17305b" strokeWidth="2.6" />
    </>
  ),
  'fast': (
    <>
      <path d="M2.8 9a14.6 14.6 0 0118.4 0" stroke="#17305b" strokeWidth="2.2" />
      <path d="M5.8 12.6a10 10 0 0112.4 0" stroke="#17305b" strokeWidth="2.2" />
      <path d="M8.8 16.1a5.6 5.6 0 016.4 0" stroke="#17305b" strokeWidth="2.2" />
      <path d="M12 19.6h.01" stroke="#f3c516" strokeWidth="2.8" />
    </>
  ),
}

export function KolmariIcon({
  name,
  ...props
}: { name: KolmariIconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {ICONS[name]}
    </svg>
  )
}
