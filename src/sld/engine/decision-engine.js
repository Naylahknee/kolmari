// @ts-check
/**
 * The SLD decision engine. Runs the seven layer analyzers over a ChangeSet and
 * aggregates their findings into a single deterministic decision.
 *
 * Rules:
 *  - Progression order: BLOCK > INSUFFICIENT_EVIDENCE > REVIEW_REQUIRED >
 *    ALLOW_WITH_WARNING > ALLOW. The strictest finding wins.
 *  - Scope is evaluated FIRST. An unauthorized change BLOCKs immediately and the
 *    seven layers are not consulted — permission is prior to risk.
 *  - Empty findings ⇒ ALLOW, but only for a change already proven in scope.
 *  - FAIL CLOSED: if any analyzer throws, the whole evaluation returns BLOCK.
 *    Governance never fails open.
 *  - Fully deterministic: no clock, no randomness, no network, no LLM.
 *
 * @typedef {import('../index.js').ChangeSet} ChangeSet
 * @typedef {import('../index.js').Manifest} Manifest
 * @typedef {import('../index.js').Baseline} Baseline
 * @typedef {import('../index.js').Finding} Finding
 * @typedef {import('../index.js').Decision} Decision
 * @typedef {import('../index.js').EvaluationResult} EvaluationResult
 */
import { analyzeIdentity } from '../layers/layer-1-identity.js'
import { analyzeArchitecture } from '../layers/layer-2-architecture.js'
import { analyzeDependencies } from '../layers/layer-3-dependencies.js'
import { analyzeBehavior } from '../layers/layer-4-behavior.js'
import { analyzeData } from '../layers/layer-5-data.js'
import { analyzeInterface } from '../layers/layer-6-interface.js'
import { analyzeIntent } from '../layers/layer-7-intent.js'
import { analyzeExecution } from '../layers/layer-7-execution.js'
import { runScopeGate } from '../scope/scope-gate.js'
import { isCanonicalLayer, SLD_LAYER_IDS } from '../layers/canonical.js'

/** @type {Record<Decision, number>} */
const SEVERITY = {
  ALLOW: 0,
  ALLOW_WITH_WARNING: 1,
  REVIEW_REQUIRED: 2,
  INSUFFICIENT_EVIDENCE: 3,
  BLOCK: 4,
}
/** @type {Decision[]} */
const BY_SEVERITY = ['ALLOW', 'ALLOW_WITH_WARNING', 'REVIEW_REQUIRED', 'INSUFFICIENT_EVIDENCE', 'BLOCK']

/**
 * Highest-severity decision across findings.
 * @param {Finding[]} findings
 * @returns {Decision}
 */
export function aggregateDecision(findings) {
  let max = 0
  for (const f of findings) {
    const s = SEVERITY[f.decision]
    if (s > max) max = s
  }
  return BY_SEVERITY[max]
}

/**
 * @param {Finding[]} findings
 * @returns {EvaluationResult['summary']}
 */
function summarize(findings) {
  const summary = { ALLOW: 0, ALLOW_WITH_WARNING: 0, REVIEW_REQUIRED: 0, BLOCK: 0, INSUFFICIENT_EVIDENCE: 0 }
  for (const f of findings) summary[f.decision] += 1
  return summary
}

/**
 * Guard against the exact ontology drift SLD exists to prevent. A rule family
 * may change, but every emitted finding must belong to the canonical model.
 * @param {Finding[]} findings
 */
function assertCanonicalFindings(findings) {
  const invalid = findings.find((finding) => !isCanonicalLayer(finding.layer))
  if (invalid) throw new Error(`non-canonical SLD layer emitted: ${invalid.layer}`)
}

/**
 * Validate the shape of a ChangeSet before analysis. A malformed input is a
 * fail-closed INSUFFICIENT_EVIDENCE, not a crash.
 * @param {unknown} changeSet
 * @returns {changeSet is ChangeSet}
 */
function isValidChangeSet(changeSet) {
  return (
    !!changeSet &&
    typeof changeSet === 'object' &&
    Array.isArray(/** @type {any} */ (changeSet).changes) &&
    /** @type {any} */ (changeSet).changes.every(
      (c) => c && typeof c.path === 'string' && typeof c.changeType === 'string',
    )
  )
}

/**
 * Run all seven layers and aggregate. Fail-closed on any error.
 * @param {ChangeSet} changeSet
 * @param {Manifest} manifest
 * @param {Baseline | null} [baseline]
 * @param {string} [now]
 * @returns {EvaluationResult}
 */
export function evaluateChangeSet(changeSet, manifest, baseline = null, now, contract = null) {
  try {
    if (!isValidChangeSet(changeSet)) {
      return {
        decision: 'INSUFFICIENT_EVIDENCE',
        findings: [
          {
            layer: 'execution',
            class: 'unknownChange',
            decision: 'INSUFFICIENT_EVIDENCE',
            message: 'Malformed change set — cannot evaluate. Failing closed.',
          },
        ],
        summary: { ALLOW: 0, ALLOW_WITH_WARNING: 0, REVIEW_REQUIRED: 0, BLOCK: 0, INSUFFICIENT_EVIDENCE: 1 },
        failedClosed: true,
        evaluatedAt: now,
      }
    }
    if (!manifest || !manifest.policies) {
      throw new Error('missing manifest policies')
    }

    // ── Scope Gate ──────────────────────────────────────────────────────────
    // Permission before risk. If the agent could not prove authorization, the
    // seven layers are irrelevant: the change should not exist at all.
    const scope = runScopeGate(changeSet, manifest, contract)
    if (scope.findings.length > 0) {
      return {
        decision: aggregateDecision(scope.findings),
        findings: scope.findings,
        summary: summarize(scope.findings),
        failedClosed: false,
        ledger: scope.ledger,
        evaluatedAt: now,
      }
    }

    /** @type {Finding[]} */
    const findings = [
      ...analyzeIdentity(changeSet, manifest),
      ...analyzeArchitecture(changeSet, manifest, baseline),
      ...analyzeDependencies(changeSet, manifest),
      ...analyzeBehavior(changeSet, manifest),
      ...analyzeData(changeSet, manifest),
      ...analyzeInterface(changeSet, manifest),
      ...analyzeIntent(changeSet, manifest),
      ...analyzeExecution(changeSet, manifest, baseline, contract),
    ]

    assertCanonicalFindings(findings)

    const applicable = Array.isArray(manifest.protectedLayers)
      ? manifest.protectedLayers
      : SLD_LAYER_IDS
    const applicableFindings = findings.filter((finding) => applicable.includes(finding.layer))

    // An empty change set (or one with only unrecognized, harmless edits) is an
    // explicit ALLOW rather than a silent pass.
    const decision = applicableFindings.length ? aggregateDecision(applicableFindings) : 'ALLOW'

    return {
      decision,
      findings: applicableFindings,
      summary: summarize(applicableFindings),
      failedClosed: false,
      ledger: scope.ledger,
      evaluatedAt: now,
    }
  } catch (err) {
    // FAIL CLOSED. Never leak an error object (could carry paths/values).
    const message = err instanceof Error ? err.message : 'unknown analysis error'
    return {
      decision: 'INSUFFICIENT_EVIDENCE',
      findings: [
        {
          layer: 'execution',
          class: 'unknownChange',
          decision: 'INSUFFICIENT_EVIDENCE',
          message: `SLD analysis failed; blocking by policy (fail-closed): ${message}`,
        },
      ],
      summary: { ALLOW: 0, ALLOW_WITH_WARNING: 0, REVIEW_REQUIRED: 0, BLOCK: 0, INSUFFICIENT_EVIDENCE: 1 },
      failedClosed: true,
      evaluatedAt: now,
    }
  }
}
