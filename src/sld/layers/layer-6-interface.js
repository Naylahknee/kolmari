// @ts-check
/**
 * Layer 6 — Interface.
 * Guards the design system: touching a protected component, or re-implementing a
 * reusable primitive inline instead of reusing it, is design-system drift.
 *
 * @typedef {import('../index.js').ChangeSet} ChangeSet
 * @typedef {import('../index.js').Manifest} Manifest
 * @typedef {import('../index.js').Finding} Finding
 */

/**
 * @param {ChangeSet} changeSet
 * @param {Manifest} manifest
 * @returns {Finding[]}
 */
export function analyzeInterface(changeSet, manifest) {
  /** @type {Finding[]} */
  const findings = []
  const protectedComponents = manifest.interface.protectedComponents || []
  const reusable = manifest.interface.reuseInsteadOfReimplementing || []

  for (const change of changeSet.changes) {
    const p = change.path

    if (protectedComponents.includes(p) && change.changeType !== 'add') {
      findings.push({
        layer: 'interface',
        class: 'designSystemDrift',
        decision: manifest.policies.designSystemDrift,
        path: p,
        message: `Protected design-system component changed (${p}). Verify it still matches the approved Kolmari look and reuses shared tokens.`,
        detail: p,
      })
    }

    // Re-declaring a reusable primitive in a NEW file elsewhere is drift.
    if (change.changeType === 'add' && !protectedComponents.includes(p)) {
      const text = change.addedText || ''
      for (const prim of reusable) {
        const declRe = new RegExp(
          `(function|const|class)\\s+${prim.replace(/[^a-zA-Z0-9]/g, '')}\\b`,
        )
        if (declRe.test(text)) {
          findings.push({
            layer: 'interface',
            class: 'designSystemDrift',
            decision: manifest.policies.designSystemDrift,
            path: p,
            message: `Reusable primitive "${prim}" appears to be re-implemented in ${p}. Reuse the shared component instead of duplicating it.`,
            detail: prim,
          })
        }
      }
    }
  }

  return findings
}
