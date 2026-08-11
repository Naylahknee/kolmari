// @ts-check
/**
 * Layer 3 — Dependencies.
 * Guards import boundaries: forbidden edges (UI → DB, UI → child_process) and
 * server-only modules imported into client components.
 *
 * @typedef {import('../index.js').ChangeSet} ChangeSet
 * @typedef {import('../index.js').Manifest} Manifest
 * @typedef {import('../index.js').Finding} Finding
 */
import { matchGlob, normalizeImport, underPath } from '../engine/match.js'

/**
 * @param {ChangeSet} changeSet
 * @param {Manifest} manifest
 * @returns {Finding[]}
 */
export function analyzeDependencies(changeSet, manifest) {
  /** @type {Finding[]} */
  const findings = []
  const edges = manifest.architecture.forbiddenDependencies || []
  const serverOnly = manifest.architecture.serverOnlyModules || []

  for (const change of changeSet.changes) {
    if (change.changeType === 'delete') continue
    const imports = change.imports || []
    if (imports.length === 0) continue
    const from = change.path

    for (const rawSpec of imports) {
      const spec = normalizeImport(rawSpec)

      // Forbidden edge rules.
      for (const edge of edges) {
        if (matchGlob(from, edge.fromGlob) && matchGlob(spec, edge.toGlob)) {
          findings.push({
            layer: 'dependencies',
            class: 'dependencyViolation',
            decision: manifest.policies.dependencyViolation,
            path: from,
            message: `Forbidden import: ${from} → ${rawSpec}. ${edge.reason}`,
            detail: `${edge.fromGlob} ↛ ${edge.toGlob}`,
          })
        }
      }

      // Server-only module pulled into a CLIENT component. A server component
      // under src/components/ may import server-only modules freely, so this
      // needs the `'use client'` directive as evidence — the scanner supplies it,
      // and we fall back to the diff text when it has not been determined.
      const declaresClient =
        change.isClientComponent === true ||
        (change.isClientComponent === undefined && /^\s*['"]use client['"]/m.test(change.addedText || ''))
      if (declaresClient) {
        for (const mod of serverOnly) {
          const modNoExt = mod.replace(/\.(ts|tsx|js|jsx)$/, '')
          if (spec === mod || spec === modNoExt || underPath(spec, modNoExt)) {
            findings.push({
              layer: 'dependencies',
              class: 'architectureViolation',
              decision: manifest.policies.architectureViolation,
              path: from,
              message: `Server-only module "${mod}" imported by a client component (${from}). This breaks the RSC/client boundary and the Workers build.`,
              detail: mod,
            })
          }
        }
      }
    }
  }

  return findings
}
