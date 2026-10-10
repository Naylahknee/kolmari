// @ts-check
/**
 * Layer 7 — Intent.
 * Guards product intent: fabricated-data risk and product reframing.
 * Deterministic heuristics only — this layer flags for human review, it does
 * not adjudicate meaning.
 *
 * All product-specific knowledge comes from the manifest:
 *   manifest.intent.reframingPhrases — phrases that suggest the product is
 *     being reframed into something it is not (e.g. a planning tool reframed
 *     as a booking tool).
 *   manifest.intent.fabricatedDataPatterns — regex sources (as strings) that
 *     detect hard-coded values where values must be computed, e.g.
 *     "matchScore\\s*[:=]\\s*\\d{1,3}".
 *
 * @typedef {import('../index.js').ChangeSet} ChangeSet
 * @typedef {import('../index.js').Manifest} Manifest
 * @typedef {import('../index.js').Finding} Finding
 */
import { containsTerm, isSpecimenSurface } from '../engine/match.js'

/**
 * @param {ChangeSet} changeSet
 * @param {Manifest} manifest
 * @returns {Finding[]}
 */
export function analyzeIntent(changeSet, manifest) {
  /** @type {Finding[]} */
  const findings = []
  const appName = manifest.application?.name || 'the app'
  const appDescription = manifest.application?.description || ''
  const reframingPhrases = manifest.intent?.reframingPhrases || []
  const fabricatedPatterns = (manifest.intent?.fabricatedDataPatterns || []).map(
    (source) => new RegExp(source, 'i'),
  )

  for (const change of changeSet.changes) {
    if (change.changeType === 'delete') continue
    // Skip the engine's own source and tests: they define these patterns.
    if (isSpecimenSurface(change.path, manifest)) continue
    const text = change.addedText || ''
    if (!text) continue

    for (const phrase of reframingPhrases) {
      if (containsTerm(text, phrase)) {
        findings.push({
          layer: 'identity',
          class: 'behavioralChange',
          decision: manifest.policies.behavioralChange,
          path: change.path,
          message: `Language "${phrase}" reframes ${appName} as something it is not.${appDescription ? ` ${appDescription}` : ''}`,
          detail: phrase,
        })
      }
    }

    // Fabricated-data smell: a value assigned a literal where the product
    // principles require computed values. Scored per line so that merely
    // rendering a label near a number does not flag.
    for (const pattern of fabricatedPatterns) {
      const hit = text.split('\n').find((line) => pattern.test(line))
      if (hit) {
        findings.push({
          layer: 'logic',
          class: 'behavioralChange',
          decision: manifest.policies.behavioralChange,
          path: change.path,
          message: `A value appears to be hard-coded in ${change.path} (matched "${pattern.source}"). Values covered by this rule must be computed, never fabricated. Confirm this is not hard-coded data.`,
          detail: pattern.source,
        })
        break
      }
    }
  }

  return findings
}
