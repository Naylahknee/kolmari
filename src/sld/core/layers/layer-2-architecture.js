// @ts-check
/**
 * Layer 2 — Architecture.
 * Guards structural invariants: a single canonical app root (no duplicate /
 * nested application), and no unexpected top-level project scaffolding.
 * Import-edge boundary rules live in Layer 3 (Dependencies).
 *
 * Which files count as "application root markers" comes from the manifest
 * (manifest.architecture.rootMarkers, regex sources), so non-Next.js
 * projects can define their own (e.g. pyproject.toml, go.mod).
 *
 * @typedef {import('../index.js').ChangeSet} ChangeSet
 * @typedef {import('../index.js').Manifest} Manifest
 * @typedef {import('../index.js').Baseline} Baseline
 * @typedef {import('../index.js').Finding} Finding
 */

/**
 * A new application root marker outside the canonical root signals a
 * duplicate/nested application — a fail-closed BLOCK per spec. We never
 * auto-delete; we flag for human resolution.
 * @param {ChangeSet} changeSet
 * @param {Manifest} manifest
 * @param {Baseline | null | undefined} baseline
 * @returns {Finding[]}
 */
export function analyzeArchitecture(changeSet, manifest, baseline) {
  /** @type {Finding[]} */
  const findings = []
  const root = manifest.architecture.canonicalRoot || '.'
  const appName = manifest.application?.name || 'the application'

  // Roots already known to be non-app (build output, worktrees, tooling).
  const IGNORED_ROOT_PREFIXES = ['.open-next/', '.claude/', 'node_modules/', '.next/']
  const isIgnored = (p) => IGNORED_ROOT_PREFIXES.some((pre) => p.startsWith(pre))

  const rootMarkers = (manifest.architecture.rootMarkers || [
    '(^|/)(package\\.json|next\\.config\\.(js|ts|mjs|cjs))$',
  ]).map((source) => new RegExp(source))
  const isRootMarker = (p) => rootMarkers.some((re) => re.test(p))

  for (const change of changeSet.changes) {
    if (change.changeType === 'delete') continue
    const p = change.path
    if (!isRootMarker(p) || isIgnored(p)) continue

    const dir = p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : '.'
    const atCanonicalRoot = dir === root || (root === '.' && dir === '.')
    if (!atCanonicalRoot) {
      findings.push({
        layer: 'system',
        class: 'duplicateAppRoot',
        decision: manifest.policies.duplicateAppRoot,
        path: p,
        message: `New application root marker outside the canonical root ("${root}"). This looks like a duplicate or nested ${appName}: requires human resolution, never auto-deletion.`,
        detail: dir,
      })
    }
  }

  // If a baseline is present and already records >1 app root, surface it so the
  // condition can't silently persist across evaluations.
  if (baseline && Array.isArray(baseline.appRoots) && baseline.appRoots.length > 1) {
    findings.push({
      layer: 'system',
      class: 'duplicateAppRoot',
      decision: manifest.policies.duplicateAppRoot,
      message: `Baseline records ${baseline.appRoots.length} application roots: ${baseline.appRoots.join(', ')}. A single canonical ${appName} root is required.`,
      detail: baseline.appRoots.join(','),
    })
  }

  return findings
}
