// @ts-check
/**
 * Layer 7 — Execution preservation.
 * Detects AI-generation elision and silent content loss. Scope authorization is
 * also reported under Execution by the Scope Gate.
 *
 * @typedef {import('../index.js').ChangeSet} ChangeSet
 * @typedef {import('../index.js').Manifest} Manifest
 * @typedef {import('../index.js').Baseline} Baseline
 * @typedef {import('../index.js').TaskContract} TaskContract
 * @typedef {import('../index.js').Finding} Finding
 */
import { isSpecimenSurface, matchGlob } from '../engine/match.js'

/** @param {string} text */
function lineCount(text) {
  if (!text) return 0
  return text.split('\n').filter((line) => line.length > 0).length
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

  for (const change of changeSet.changes) {
    if (change.changeType === 'delete' || isSpecimenSurface(change.path)) continue
    if (excluded.some((glob) => matchGlob(change.path, glob))) continue

    const addedText = change.addedText || ''
    const marker = markers.find((candidate) => addedText.toLowerCase().includes(candidate.toLowerCase()))
    const baselineLines = change.baselineLineCount ?? baseline?.files?.[change.path]?.lineCount ?? 0
    const removedLines = change.removedLineCount ?? lineCount(change.removedText || '')
    const magnitude = baselineLines > 0 ? removedLines / baselineLines : 0
    const deletionAuthorized = Boolean(contract?.allowedActions?.includes('DELETE'))

    if (marker && magnitude >= reviewThreshold) {
      findings.push({
        layer: 'execution',
        class: 'generationArtifactCorruption',
        decision: 'BLOCK',
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
        decision: 'REVIEW_REQUIRED',
        path: change.path,
        message: `Possible AI elision marker "${marker}" introduced. Confirm that source content was not replaced by a summary placeholder.`,
        detail: marker,
      })
    }

    if (magnitude >= reviewThreshold && !deletionAuthorized) {
      findings.push({
        layer: 'execution',
        class: 'contentLoss',
        decision: magnitude >= blockThreshold ? 'BLOCK' : 'REVIEW_REQUIRED',
        path: change.path,
        message: `${Math.round(magnitude * 100)}% of the baseline artifact was removed without an explicit DELETE grant.`,
        detail: magnitude.toFixed(3),
      })
    }
  }

  return findings
}
