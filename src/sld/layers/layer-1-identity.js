// @ts-check
/**
 * Layer 1 — Identity.
 * Guards the product's name and language: retired brand terms (e.g. "Nexit")
 * must never reappear, and the app's declared identity must stay intact.
 *
 * @typedef {import('../index.js').FileChange} FileChange
 * @typedef {import('../index.js').Manifest} Manifest
 * @typedef {import('../index.js').Finding} Finding
 * @typedef {import('../index.js').ChangeSet} ChangeSet
 */
import { containsTerm } from '../engine/match.js'

/**
 * @param {ChangeSet} changeSet
 * @param {Manifest} manifest
 * @returns {Finding[]}
 */
export function analyzeIdentity(changeSet, manifest) {
  /** @type {Finding[]} */
  const findings = []
  const forbidden = manifest.identity.forbiddenTerms || []

  for (const change of changeSet.changes) {
    if (change.changeType === 'delete') continue
    const text = change.addedText || ''
    if (!text) continue
    for (const term of forbidden) {
      if (containsTerm(text, term)) {
        findings.push({
          layer: 'identity',
          class: 'forbiddenTerm',
          decision: manifest.policies.forbiddenTerm,
          path: change.path,
          message: `Retired brand term "${term}" reintroduced. The app is Kolmari; forbidden terms must not appear.`,
          detail: term,
        })
      }
    }
  }

  return findings
}
