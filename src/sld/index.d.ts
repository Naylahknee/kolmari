/**
 * Type surface for kolmari's SLD governance setup.
 *
 * Re-exports the canonical core's declarations (vendored at ./core/) so the
 * TypeScript consumers (the /api/sld/evaluate route) see the exact same types
 * the core was authored against. Do not hand-maintain a copy here.
 */
export * from './core/index.d.ts'
