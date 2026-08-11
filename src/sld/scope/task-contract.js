// @ts-check
/**
 * TaskContract — the first-class record of what the user actually authorized.
 *
 * SLD's governing question is not "is this change good?" but "did the agent have
 * permission to make it?". The contract is the only source of that permission.
 * Everything absent from it is PRESERVE by default.
 *
 * Pure data + validation. No I/O, no inference: a contract is authored from the
 * user's request, never widened by the engine.
 *
 * @typedef {import('../index.js').TaskContract} TaskContract
 * @typedef {import('../index.js').ScopeAction} ScopeAction
 */

/** Every action a contract can grant. Permission to one never implies another. */
export const SCOPE_ACTIONS = /** @type {ScopeAction[]} */ ([
  'CREATE', 'MODIFY', 'DELETE', 'MOVE', 'RENAME', 'REFACTOR', 'RESTYLE', 'REWIRE', 'MIGRATE',
])

/**
 * Invariants attached to every contract automatically. They encode "preservation
 * is the default" — the agent may not take these liberties even inside an
 * otherwise authorized file.
 */
export const MANDATORY_INVARIANTS = [
  'UNCHANGED_UNLESS_AUTHORIZED',
  'NO_OPPORTUNISTIC_REFACTORING',
  'NO_OPPORTUNISTIC_REDESIGN',
  'NO_UNREQUESTED_COPY_CHANGES',
  'NO_UNREQUESTED_DEPENDENCY_CHANGES',
  'NO_UNREQUESTED_FILE_REORGANIZATION',
  'NO_UNREQUESTED_ROUTE_CHANGES',
  'NO_UNREQUESTED_DATABASE_CHANGES',
  'NO_UNREQUESTED_COMPONENT_REPLACEMENT',
  'NO_UNREQUESTED_FEATURE_ADDITION',
  'NO_UNREQUESTED_FEATURE_REMOVAL',
]

/**
 * SLD's own governance surface. These paths may only be touched when the
 * contract explicitly grants SLD_ENGINE_MAINTENANCE, so a coding agent cannot
 * weaken the referee because the referee is inconvenient.
 */
export const GOVERNANCE_PATHS = ['src/sld/', '.sld/', 'docs/kolmari/14-SLD-GOVERNANCE.md', 'scripts/sld.mjs']
export const SLD_MAINTENANCE_GRANT = 'SLD_ENGINE_MAINTENANCE'

/**
 * Build a contract from an authored description. Missing collections default to
 * empty — an empty contract authorizes nothing, which is the correct default.
 * @param {Partial<TaskContract>} input
 * @returns {TaskContract}
 */
export function createTaskContract(input) {
  const list = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string' && x.length > 0) : [])
  const actions = list(input.allowedActions)
    .map((a) => a.toUpperCase())
    .filter((a) => (SCOPE_ACTIONS).includes(/** @type {ScopeAction} */ (a)))

  return {
    taskId: typeof input.taskId === 'string' && input.taskId ? input.taskId : 'untitled-task',
    instruction: typeof input.instruction === 'string' ? input.instruction : '',
    objective: typeof input.objective === 'string' ? input.objective : '',
    allowedFiles: list(input.allowedFiles),
    allowedDirectories: list(input.allowedDirectories),
    allowedEntities: list(input.allowedEntities),
    allowedActions: /** @type {ScopeAction[]} */ (actions),
    allowedBehaviors: list(input.allowedBehaviors),
    allowedUIRegions: list(input.allowedUIRegions),
    allowedStates: list(input.allowedStates),
    requiredChanges: list(input.requiredChanges),
    forbiddenChanges: list(input.forbiddenChanges),
    invariants: [...new Set([...MANDATORY_INVARIANTS, ...list(input.invariants)])],
    propagationRules: Array.isArray(input.propagationRules) ? input.propagationRules : [],
    grants: list(input.grants),
    ambiguityPolicy: input.ambiguityPolicy === 'ALLOW' ? 'ALLOW' : 'BLOCK',
    createdFrom: typeof input.createdFrom === 'string' ? input.createdFrom : 'user-request',
  }
}

/**
 * A contract is usable only if it names something concrete to change and at
 * least one action. An empty or vague contract is not permission — under the
 * default ambiguity policy it BLOCKs.
 *
 * @param {TaskContract | null | undefined} contract
 * @returns {{ ok: boolean; reason: string }}
 */
export function validateTaskContract(contract) {
  if (!contract || typeof contract !== 'object') {
    return { ok: false, reason: 'No TaskContract supplied. An agent change requires explicit authorization.' }
  }
  if (!contract.instruction || contract.instruction.trim().length === 0) {
    return { ok: false, reason: 'TaskContract has no instruction — the authorizing user request is missing.' }
  }
  const hasTarget =
    contract.allowedFiles.length > 0 ||
    contract.allowedDirectories.length > 0 ||
    contract.allowedEntities.length > 0
  if (!hasTarget) {
    return {
      ok: false,
      reason: 'TaskContract names no allowed file, directory, or entity — scope cannot be resolved deterministically.',
    }
  }
  if (contract.allowedActions.length === 0) {
    return { ok: false, reason: 'TaskContract grants no actions. Permission to change must be explicit.' }
  }
  return { ok: true, reason: '' }
}

/** True when the contract explicitly permits editing SLD's own governance files. */
export function allowsGovernanceEdits(contract) {
  return Boolean(contract && contract.grants && contract.grants.includes(SLD_MAINTENANCE_GRANT))
}

/** True when a path belongs to SLD's own governance surface. */
export function isGovernancePath(path) {
  return GOVERNANCE_PATHS.some((p) => (p.endsWith('/') ? path.startsWith(p) : path === p))
}
