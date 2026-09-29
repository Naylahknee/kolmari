// Kolmari map stack decision (2026-09-28):
//
// Primary: OpenFreeMap vector tiles rendered with MapLibre GL.
//   - Free, no API key, no token gate. OpenFreeMap serves OpenMapTiles-schema
//     vector tiles; the same component code runs against self-hosted Protomaps
//     later by changing KOLMARI_MAP_STYLE to the self-hosted style URL.
//   - Attribution (required): OpenMapTiles + OpenStreetMap contributors.
//     The OpenFreeMap styles carry this attribution; keep attributionControl on.
//
// Fallback: the D3 + Natural Earth SVG renderers (world-geo.ts,
// CountrySnapshotMap) render automatically if WebGL or the tile endpoint is
// unavailable. No blank maps, ever.
//
// Retired: the Mapbox-token-gated path (MapboxMap.tsx). Mapbox GL JS needed
// NEXT_PUBLIC_MAPBOX_TOKEN and showed a "connect your token" placeholder
// without one. OpenFreeMap removes the token entirely.

export const KOLMARI_MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron'

// Swap to a self-hosted Protomaps style with one constant change, e.g.
// export const KOLMARI_MAP_STYLE = 'https://tiles.kolmari.com/styles/kolmari.json'

export const KOLMARI_MAP_ATTRIBUTION = '© OpenMapTiles © OpenStreetMap contributors'
