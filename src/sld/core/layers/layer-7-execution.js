// @ts-check
/**
 * Layer 7 — Execution preservation.
 * Detects AI-generation elision and silent content loss. Scope authorization is
 * also reported under Execution by the Scope Gate.
 *
 * Two risks are kept separate on purpose:
 *   - PERMISSION (was this deletion allowed?) belongs to the Scope Gate.
 *   - ACCIDENT (did an authorized edit remove more than intended?) belongs here.
 * An authorized deletion can still be a mistake — that is the exact failure
 * this engine exists to catch — so the magnitude check runs whether or not a
 * DELETE grant is present. The grant only softens the decision from BLOCK to
 * REVIEW_REQUIRED; it never silences the finding.
 *
 * Policy floors come from manifest.policies (the manifest is the source of
 * truth for minimum severity per finding class). Magnitude may escalate a
 * finding above its floor, never below it.
 *
 * @typedef {import('../index.js').ChangeSet} ChangeSet
 * @typedef {import('../index.js').Manifest} Manifest
 * @typedef {import('../index.js').Baseline} Baseline
 * @typedef {import('../index.js').TaskContract} TaskContract
 * @typedef {import('../index.js').Finding} Finding
 * @typedef {import('../index.js').Decision} Decision
 */
import { isSpecimenSurface, matchGlob } from '../engine/match.js'

/** @param {string} text */
function lineCount(text) {
  if (!text) return 0
  return text.split('\n').filter((line) => line.length > 0).length
}

/** Severity order, mirroring the decision engine. */
/** @type {Decision[]} */
const SEVERITY_ORDER = ['ALLOW', 'ALLOW_WITH_WARNING', 'REVIEW_REQUIRED', 'INSUFFICIENT_EVIDENCE', 'BLOCK']

/**
 * Take the stricter of the manifest policy floor and the computed severity.
 * @param {Decision} floor
 * @param {Decision} computed
 * @returns {Decision}
 */
function escalate(floor, computed) {
  const rank = (d) => SEVERITY_ORDER.indexOf(d)
  return rank(computed) > rank(floor) ? computed : floor
}

/**
 * @param {ChangeSet} changeSet
 * @param {Manifest} manifest
 * @param {Baseline | null | undefined} baseline
 * @param {TaskContract | null | undefined} contract
 * @returns {Finding[]}
 */
export function analyzeExecution(changeSet, manifest, baseline, contract) {
  /** @type {Finding[]} */
  const findings = []
  const integrity = manifest.integrity || {}
  const markers = integrity.elisionMarkers || []
  const excluded = integrity.excludedGlobs || []
  const reviewThreshold = integrity.magnitudeReviewThreshold ?? 0.35
  const blockThreshold = integrity.magnitudeBlockThreshold ?? 0.60
  const contentLossFloor = manifest.policies?.contentLoss || 'REVIEW_REQUIRED'
  const corruptionFloor = manifest.policies?.generationArtifactCorruption || 'REVIEW_REQUIRED'
  const deletionAuthorized = Boolean(contract?.allowedActions?.includes('DELETE'))

  for (const change of changeSet.changes) {
    if (isSpecimenSurface(change.path, manifest)) continue
    if (excluded.some((glob) => matchGlob(change.path, glob))) continue

    // Whole-file deletion: the file is 100% gone. This used to be skipped
    // entirely, which made deletions invisible once a DELETE grant existed.
    // Permission was already judged by the Scope Gate; here we judge whether
    // the scale of the deletion needs human eyes.
    if (change.changeType === 'delete') {
      findings.push({
        layer: 'execution',
        class: 'contentLoss',
        decision: deletionAuthorized ? 'REVIEW_REQUIRED' : escalate(contentLossFloor, 'BLOCK'),
        path: change.path,
        message: deletionAuthorized
          ? `Entire file ${change.path} was deleted under an authorized DELETE grant. Confirm the deletion was intended — authorized edits have silently removed files before.`
          : `Entire file ${change.path} was deleted without a DELETE grant.`,
        detail: '1.000',
      })
      continue
    }

    const addedText = change.addedText || ''
    const marker = markers.find((candidate) => addedText.toLowerCase().includes(candidate.toLowerCase()))
    const baselineLines = change.baselineLineCount ?? baseline?.files?.[change.path]?.lineCount ?? 0
    const removedLines = change.removedLineCount ?? lineCount(change.removedText || '')

    // Fail closed when removal cannot be measured: lines were removed but the
    // baseline has no line count for this file, so the scale of the removal is
    // unknowable. An unmeasurable deletion is not a clean bill of health.
    if (removedLines > 0 && baselineLines <= 0) {
      findings.push({
        layer: 'execution',
        class: 'contentLoss',
        decision: 'INSUFFICIENT_EVIDENCE',
        path: change.path,
        message: `${removedLines} lines were removed from ${change.path} but the SLD baseline has no line count for it, so the scale of removal cannot be verified. Refresh the baseline with "npm run sld:baseline".`,
        detail: String(removedLines),
      })
      continue
    }

    const magnitude = baselineLines > 0 ? removedLines / baselineLines : 0

    if (marker && magnitude >= reviewThreshold) {
      findings.push({
        layer: 'execution',
        class: 'generationArtifactCorruption',
        decision: escalate(corruptionFloor, 'BLOCK'),
        path: change.path,
        message: `AI elision marker "${marker}" was introduced while removing ${Math.round(magnitude * 100)}% of the artifact. Possible generated-file corruption.`,
        detail: marker,
      })
      continue
    }

    if (marker) {
      findings.push({
        layer: 'execution',
        class: 'generationArtifactCorruption',
        decision: corruptionFloor,
        path: change.path,
        message: `Possible AI elision marker "${marker}" introduced. Confirm that source content was not replaced by a summary placeholder.`,
        detail: marker,
      })
    }

    if (magnitude >= reviewThreshold) {
      const computed = magnitude >= blockThreshold ? 'BLOCK' : 'REVIEW_REQUIRED'
      // A DELETE grant means the actor was allowed to remove content, so a
      // large-but-authorized removal asks for confirmation instead of blocking:
      // legitimate restructures must stay shippable, but never invisible.
      const decision = deletionAuthorized ? 'REVIEW_REQUIRED' : escalate(contentLossFloor, computed)
      findings.push({
        layer: 'execution',
        class: 'contentLoss',
        decision,
        path: change.path,
        message: deletionAuthorized
          ? `${Math.round(magnitude * 100)}% of ${change.path} was removed under an authorized DELETE grant. Confirm the scale of removal was intended.`
          : `${Math.round(magnitude * 100)}% of the baseline artifact was removed without an explicit DELETE grant.`,
        detail: magnitude.toFixed(3),
      })
    }
  }

  return findings
}
