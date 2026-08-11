// @ts-check
/**
 * Task compiler — turns a TaskContract into deterministic scope rules.
 *
 * Deliberately dumb. It expands only what the contract literally says: named
 * files, directories, and entities resolved through the manifest's entity map.
 * It never infers broader authority from a relationship ("fix the map" does not
 * compile to "the Your World page"), and when a target cannot be resolved it
 * records the ambiguity so the Scope Gate can BLOCK on it.
 *
 * @typedef {import('../index.js').TaskContract} TaskContract
 * @typedef {import('../index.js').Manifest} Manifest
 * @typedef {import('../index.js').CompiledScope} CompiledScope
 */
import { matchGlob, underPath } from '../engine/match.js'

/**
 * Resolve an entity name to the file globs that implement it, using the
 * manifest's entity registry. Unknown entities resolve to nothing and are
 * reported as unresolved rather than silently treated as "everything".
 *
 * @param {string} name
 * @param {Manifest} manifest
 * @returns {string[] | null} globs, or null when the entity is unknown
 */
function resolveEntity(name, manifest) {
  const registry = (manifest && manifest.entities) || {}
  const key = Object.keys(registry).find((k) => k.toLowerCase() === name.trim().toLowerCase())
  return key ? registry[key] : null
}

/**
 * @param {TaskContract} contract
 * @param {Manifest} manifest
 * @returns {CompiledScope}
 */
export function compileTaskContract(contract, manifest) {
  /** @type {string[]} */
  const fileGlobs = []
  /** @type {string[]} */
  const unresolvedEntities = []
  /** @type {Record<string, string[]>} */
  const entityGlobs = {}

  for (const f of contract.allowedFiles) fileGlobs.push(f)
  for (const d of contract.allowedDirectories) fileGlobs.push(d.endsWith('/') ? `${d}**` : `${d}/**`)

  for (const entity of contract.allowedEntities) {
    const globs = resolveEntity(entity, manifest)
    if (!globs || globs.length === 0) {
      unresolvedEntities.push(entity)
      continue
    }
    entityGlobs[entity] = globs
    fileGlobs.push(...globs)
  }

  return {
    taskId: contract.taskId,
    fileGlobs: [...new Set(fileGlobs)],
    entityGlobs,
    unresolvedEntities,
    actions: [...contract.allowedActions],
    states: [...contract.allowedStates],
    forbidden: [...contract.forbiddenChanges],
    ambiguityPolicy: contract.ambiguityPolicy,
  }
}

/**
 * Is this path inside the compiled scope?
 * @param {string} path
 * @param {CompiledScope} scope
 * @returns {boolean}
 */
export function pathInScope(path, scope) {
  return scope.fileGlobs.some((g) => (g.includes('*') ? matchGlob(path, g) : path === g || underPath(path, g)))
}

/**
 * Which authorized entity covers this path, if any. Used for the ledger so every
 * change is traceable back to SOURCE → ENTITY → STATE → ACTION.
 * @param {string} path
 * @param {CompiledScope} scope
 * @returns {string | null}
 */
export function entityForPath(path, scope) {
  for (const [entity, globs] of Object.entries(scope.entityGlobs)) {
    if (globs.some((g) => (g.includes('*') ? matchGlob(path, g) : path === g || underPath(path, g)))) return entity
  }
  return null
}
