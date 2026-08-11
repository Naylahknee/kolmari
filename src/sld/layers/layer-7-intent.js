// @ts-check
/**
 * Layer 7 — Intent.
 * Guards product intent: fabricated-data risk and travel-app framing. Deterministic
 * heuristics only — this layer flags for human review, it does not adjudicate
 * meaning. It catches obvious violations of the "never fabricate" principle
 * (hard-coded Match Scores / readiness / eligibility in data-integrity files).
 *
 * @typedef {import('../index.js').ChangeSet} ChangeSet
 * @typedef {import('../index.js').Manifest} Manifest
 * @typedef {import('../index.js').Finding} Finding
 */
import { containsTerm, isSpecimenSurface } from '../engine/match.js'

// Phrases that, added to code, suggest a relocation product is being reframed as
// a travel/vacation/booking product (a Layer-7 intent violation).
const TRAVEL_FRAMING = ['vacation package', 'book your flight', 'travel booking', 'hotel booking', 'trip planner']

/**
 * @param {ChangeSet} changeSet
 * @param {Manifest} manifest
 * @returns {Finding[]}
 */
export function analyzeIntent(changeSet, manifest) {
  /** @type {Finding[]} */
  const findings = []

  for (const change of changeSet.changes) {
    if (change.changeType === 'delete') continue
    // Skip the engine's own source and tests: they define these patterns.
    if (isSpecimenSurface(change.path)) continue
    const text = change.addedText || ''
    if (!text) continue

    for (const phrase of TRAVEL_FRAMING) {
      if (containsTerm(text, phrase)) {
        findings.push({
          layer: 'intent',
          class: 'behavioralChange',
          decision: manifest.policies.behavioralChange,
          path: change.path,
          message: `Language "${phrase}" reframes Kolmari as a travel/booking product. Kolmari is a relocation decision & planning system.`,
          detail: phrase,
        })
      }
    }

    // Fabricated-data smell: a Match Score assigned a literal number, e.g.
    // `matchScore: 87`. Scored per LINE — checking the whole blob flagged any
    // file that merely rendered the words "Match Score" and separately
    // contained any number, which is most of the UI.
    const literalScore = text.split('\n').find((line) => (
      /match\s*_?score/i.test(line) && /match\s*_?score["'\s]*[:=]\s*\d{1,3}\b/i.test(line)
    ))
    if (literalScore) {
      findings.push({
        layer: 'intent',
        class: 'behavioralChange',
        decision: manifest.policies.behavioralChange,
        path: change.path,
        message: `A Match Score is assigned a literal value in ${change.path}. Match Scores must be computed, never fabricated — confirm this is not hard-coded data.`,
        detail: 'literal-match-score',
      })
    }
  }

  return findings
}
