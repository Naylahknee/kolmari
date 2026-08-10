// @ts-check
/**
 * Layer 4 — Behavior.
 * Guards critical/protected features: any change touching a file that a
 * protected feature depends on is flagged for review so behavioral regressions
 * (auth, match-scoring, plan, command-center) can't slip through silently.
 *
 * @typedef {import('../index.js').ChangeSet} ChangeSet
 * @typedef {import('../index.js').Manifest} Manifest
 * @typedef {import('../index.js').Finding} Finding
 */
import { underPath } from '../engine/match.js'

/**
 * @param {ChangeSet} changeSet
 * @param {Manifest} manifest
 * @returns {Finding[]}
 */
export function analyzeBehavior(changeSet, manifest) {
  /** @type {Finding[]} */
  const findings = []
  const features = manifest.behavior.protectedFeatures || []

  for (const change of changeSet.changes) {
    const p = change.path
    for (const feature of features) {
      const paths = feature.paths || []
      const hit = paths.some((fp) => p === fp || underPath(p, fp.replace(/\.(ts|tsx|js|jsx)$/, '')))
      if (hit) {
        const destructive = change.changeType === 'delete'
        findings.push({
          layer: 'behavior',
          class: 'protectedFeatureChange',
          decision: destructive
            ? manifest.policies.behavioralChange
            : manifest.policies.protectedFeatureChange,
          path: p,
          message: `${change.changeType === 'delete' ? 'Deletion' : 'Change'} touches protected feature "${feature.key}". Confirm behavior (auth, scoring, plan, command-center, data-integrity) is preserved.`,
          detail: feature.key,
        })
      }
    }
  }

  return findings
}
