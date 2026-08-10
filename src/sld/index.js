// @ts-check
/**
 * Seven Layer Dip (SLD) — public entry point for the pure, Workers-safe
 * governance core. Everything re-exported here is dependency-free and
 * deterministic: no fs, no git, no network, no LLM, no randomness, no clock
 * (timestamps are always passed in). This module is safe to import from the
 * Cloudflare-Workers API route and from Node.
 *
 * The seven layers:
 *   1. Identity      — protected/forbidden product language
 *   2. Architecture  — single canonical app root, no duplicate/nested project
 *   3. Dependencies  — forbidden import edges, server-only boundary
 *   4. Behavior      — protected/critical features
 *   5. Data          — destructive DB operations
 *   6. Interface     — design-system drift
 *   7. Intent        — product-intent (relocation, not travel; no fabricated data)
 */
export { KOLMARI_MANIFEST, default as manifest } from './manifest/kolmari.manifest.js'
export { evaluateChangeSet, aggregateDecision } from './engine/decision-engine.js'
export { computeImpact } from './graph/impact.js'
export { buildAuditEntry } from './audit/audit.js'
