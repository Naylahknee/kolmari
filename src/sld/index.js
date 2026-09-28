// @ts-check
/**
 * Seven Layer Dip (SLD) — public entry point for the pure, Workers-safe
 * governance core. Everything re-exported here is dependency-free and
 * deterministic: no fs, no git, no network, no LLM, no randomness, no clock
 * (timestamps are always passed in). This module is safe to import from the
 * Cloudflare-Workers API route and from Node.
 *
 * Governance sequence:
 *   TASK CONTRACT → SCOPE GATE → SOURCE/ENTITY/STATE/ACTION → SEVEN LAYERS
 *   → POST-CHANGE VERIFICATION → AUDIT
 *
 * The Scope Gate decides whether the agent had permission to make a change at
 * all; the seven layers only judge whether an already-authorized change violates
 * protected architecture. Permission and risk are separate dimensions.
 *
 * Canonical operational preservation layers:
 *   Identity · Design · Behavior · System · Logic · Content · Execution
 *
 * Architecture, dependencies, data, interface, and intent remain technical
 * rule families mapped underneath the canonical SLD ontology.
 */
export { KOLMARI_MANIFEST, default as manifest } from './manifest/kolmari.manifest.js'
export { evaluateChangeSet, aggregateDecision } from './engine/decision-engine.js'
export { computeImpact } from './graph/impact.js'
export { buildAuditEntry } from './audit/audit.js'
export { runScopeGate, verifyAgainstContract } from './scope/scope-gate.js'
export {
  createTaskContract,
  approveTaskContract,
  validateTaskContract,
  SCOPE_ACTIONS,
  MANDATORY_INVARIANTS,
  SLD_MAINTENANCE_GRANT,
} from './scope/task-contract.js'
export { compileTaskContract } from './scope/task-compiler.js'
export { SLD_LAYER_IDS, isCanonicalLayer } from './layers/canonical.js'
