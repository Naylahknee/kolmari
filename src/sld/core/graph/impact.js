// @ts-check
/**
 * Dependency / impact graph.
 * Given a set of changed paths and a baseline (which records import edges), find
 * every file that transitively imports a changed file — i.e. the blast radius —
 * plus which protected features that radius touches.
 *
 * Pure and deterministic; operates only on the baseline's edge map.
 *
 * @typedef {import('../index.js').Baseline} Baseline
 * @typedef {import('../index.js').Manifest} Manifest
 */
import { normalizeImport, underPath } from '../engine/match.js'

/**
 * Build a reverse-edge map: module → files that import it.
 * @param {Baseline} baseline
 * @returns {Map<string, Set<string>>}
 */
function reverseEdges(baseline) {
  /** @type {Map<string, Set<string>>} */
  const rev = new Map()
  const edges = baseline.edges || {}
  for (const [file, specs] of Object.entries(edges)) {
    for (const spec of specs) {
      const target = normalizeImport(spec).replace(/\.(ts|tsx|js|jsx)$/, '')
      if (!rev.has(target)) rev.set(target, new Set())
      rev.get(target).add(file)
    }
  }
  return rev
}

/**
 * Compute the transitive set of files impacted by changing `changedPaths`.
 * @param {string[]} changedPaths
 * @param {Baseline} baseline
 * @param {Manifest} manifest
 * @returns {{ files: string[]; features: string[] }}
 */
export function computeImpact(changedPaths, baseline, manifest) {
  const rev = reverseEdges(baseline)
  /** @type {Set<string>} */
  const impacted = new Set()
  /** @type {string[]} */
  const queue = []

  for (const p of changedPaths) {
    const key = p.replace(/\.(ts|tsx|js|jsx)$/, '')
    queue.push(key)
    impacted.add(p)
  }

  // BFS over reverse edges. Bounded by the file count, so it always terminates.
  let guard = 0
  const maxIterations = Object.keys(baseline.files || {}).length + changedPaths.length + 1
  while (queue.length && guard <= maxIterations) {
    guard += 1
    const cur = queue.shift()
    const importers = rev.get(cur)
    if (!importers) continue
    for (const importer of importers) {
      if (!impacted.has(importer)) {
        impacted.add(importer)
        queue.push(importer.replace(/\.(ts|tsx|js|jsx)$/, ''))
      }
    }
  }

  // Which protected features does the impacted set touch?
  const features = new Set()
  for (const feature of manifest.behavior.protectedFeatures || []) {
    for (const fp of feature.paths || []) {
      const fpKey = fp.replace(/\.(ts|tsx|js|jsx)$/, '')
      for (const f of impacted) {
        if (f === fp || underPath(f, fpKey)) {
          features.add(feature.key)
          break
        }
      }
    }
  }

  return { files: [...impacted].sort(), features: [...features].sort() }
}
