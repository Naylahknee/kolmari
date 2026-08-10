// @ts-check
/**
 * The SLD decision engine. Runs the seven layer analyzers over a ChangeSet and
 * aggregates their findings into a single deterministic decision.
 *
 * Rules:
 *  - Severity order: BLOCK > REVIEW > WARN > ALLOW. The final decision is the
 *    highest-severity finding present.
 *  - Empty findings ⇒ ALLOW.
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

/** @type {Record<Decision, number>} */
const SEVERITY = { ALLOW: 0, WARN: 1, REVIEW: 2, BLOCK: 3 }
/** @type {Decision[]} */
const BY_SEVERITY = ['ALLOW', 'WARN', 'REVIEW', 'BLOCK']

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
  const summary = { ALLOW: 0, WARN: 0, REVIEW: 0, BLOCK: 0 }
  for (const f of findings) summary[f.decision] += 1
  return summary
}

/**
 * Validate the shape of a ChangeSet before analysis. A malformed input is a
 * fail-closed BLOCK, not a crash.
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
export function evaluateChangeSet(changeSet, manifest, baseline = null, now) {
  try {
    if (!isValidChangeSet(changeSet)) {
      return {
        decision: 'BLOCK',
        findings: [
          {
            layer: 'architecture',
            class: 'unknownChange',
            decision: 'BLOCK',
            message: 'Malformed change set — cannot evaluate. Failing closed.',
          },
        ],
        summary: { ALLOW: 0, WARN: 0, REVIEW: 0, BLOCK: 1 },
        failedClosed: true,
        evaluatedAt: now,
      }
    }
    if (!manifest || !manifest.policies) {
      throw new Error('missing manifest policies')
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
    ]

    // An empty change set (or one with only unrecognized, harmless edits) is an
    // explicit ALLOW rather than a silent pass.
    const decision = findings.length ? aggregateDecision(findings) : 'ALLOW'

    return {
      decision,
      findings,
      summary: summarize(findings),
      failedClosed: false,
      evaluatedAt: now,
    }
  } catch (err) {
    // FAIL CLOSED. Never leak an error object (could carry paths/values).
    const message = err instanceof Error ? err.message : 'unknown analysis error'
    return {
      decision: 'BLOCK',
      findings: [
        {
          layer: 'architecture',
          class: 'unknownChange',
          decision: 'BLOCK',
          message: `SLD analysis failed; blocking by policy (fail-closed): ${message}`,
        },
      ],
      summary: { ALLOW: 0, WARN: 0, REVIEW: 0, BLOCK: 1 },
      failedClosed: true,
      evaluatedAt: now,
    }
  }
}
