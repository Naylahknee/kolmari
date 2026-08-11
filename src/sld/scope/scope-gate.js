// @ts-check
/**
 * Scope Gate — runs BEFORE the seven layers.
 *
 * The layers answer "does this authorized change violate Kolmari's protected
 * architecture?". The gate answers the prior question: "was the agent allowed to
 * make this change at all?". Authorization and risk are separate dimensions — a
 * change can be perfectly harmless and still unauthorized, and unauthorized
 * always BLOCKs.
 *
 * Default-deny: anything the contract does not name is out of scope.
 *
 * @typedef {import('../index.js').ChangeSet} ChangeSet
 * @typedef {import('../index.js').FileChange} FileChange
 * @typedef {import('../index.js').Manifest} Manifest
 * @typedef {import('../index.js').TaskContract} TaskContract
 * @typedef {import('../index.js').Finding} Finding
 * @typedef {import('../index.js').ScopeAction} ScopeAction
 * @typedef {import('../index.js').ChangeLedger} ChangeLedger
 */
import { compileTaskContract, entityForPath, pathInScope } from './task-compiler.js'
import {
  allowsGovernanceEdits,
  isGovernancePath,
  validateTaskContract,
} from './task-contract.js'
import { isSpecimenSurface } from '../engine/match.js'

/** The action a change type implies at minimum. */
const CHANGE_TYPE_ACTION = /** @type {Record<string, ScopeAction>} */ ({
  add: 'CREATE',
  modify: 'MODIFY',
  delete: 'DELETE',
  rename: 'RENAME',
})

/**
 * Deterministic content classifiers. Each returns the action a hunk implies, so
 * an edit that quietly rewrites copy inside an otherwise-authorized file is
 * still caught: a file being in scope does not put every property in scope.
 */
const CONTENT_CLASSIFIERS = [
  {
    action: /** @type {ScopeAction} */ ('REWIRE'),
    label: 'dependency/import change',
    test: (text) => /^\s*[+-]?\s*import\s.+from\s+['"]/m.test(text) || /require\(\s*['"]/.test(text),
  },
  {
    action: /** @type {ScopeAction} */ ('RESTYLE'),
    label: 'styling change',
    test: (text) => /className=|style=\{\{|^\s*[.#][\w-]+\s*\{|[a-z-]+\s*:\s*(#[0-9a-f]{3,8}|rgba?\()/im.test(text),
  },
]

/**
 * Text that reads as user-visible copy: a quoted sentence or JSX text with
 * spaces and letters. Used to catch unrequested wording changes.
 * @param {string} text
 */
function looksLikeCopyChange(text) {
  return /(['"`])[A-Z][A-Za-z,'’\-]+(\s+[A-Za-z,'’\-]+){2,}\1/.test(text) || />\s*[A-Z][a-z]+(\s+\w+){2,}\s*</.test(text)
}

/** Only these can actually carry UI, so only these can imply a RESTYLE. */
const UI_CAPABLE = /\.(tsx|jsx|css|scss|html)$/

/**
 * @param {FileChange} change
 * @returns {{ action: ScopeAction; label: string }[]}
 */
function impliedActions(change) {
  /** @type {{ action: ScopeAction; label: string }[]} */
  const out = []
  const base = CHANGE_TYPE_ACTION[change.changeType]
  if (base) out.push({ action: base, label: `${change.changeType} file` })

  // Content classifiers read source text, so they must skip specimen surfaces —
  // the engine's own source and test fixtures quote these very patterns as data.
  // Without this the styling detector fires on its own regex.
  if (isSpecimenSurface(change.path)) return out

  const text = change.addedText || ''
  if (text) {
    for (const c of CONTENT_CLASSIFIERS) {
      if (c.action === 'RESTYLE' && !UI_CAPABLE.test(change.path)) continue
      if (c.test(text)) out.push({ action: c.action, label: c.label })
    }
    if (looksLikeCopyChange(text)) out.push({ action: 'MODIFY', label: 'copy change' })
  }
  return out
}

/**
 * Evaluate a ChangeSet against a TaskContract.
 *
 * Returns findings (all BLOCK when unauthorized) plus a ledger mapping every
 * change to SOURCE → ENTITY → STATE → ACTION, or explaining why it could not be
 * mapped.
 *
 * @param {ChangeSet} changeSet
 * @param {Manifest} manifest
 * @param {TaskContract | null | undefined} contract
 * @returns {{ findings: Finding[]; ledger: ChangeLedger }}
 */
export function runScopeGate(changeSet, manifest, contract) {
  /** @type {Finding[]} */
  const findings = []
  /** @type {ChangeLedger} */
  const ledger = { taskId: contract?.taskId ?? null, authorized: [], unauthorized: [], observations: [] }

  const changes = changeSet.changes || []

  // No contract is not permission. An empty diff needs no authorization.
  const validity = validateTaskContract(contract)
  if (!validity.ok) {
    if (changes.length === 0) return { findings, ledger }
    findings.push({
      layer: 'scope',
      class: 'unknownScope',
      decision: 'BLOCK',
      message: `${validity.reason} No change may proceed without a valid TaskContract.`,
    })
    for (const change of changes) {
      ledger.unauthorized.push({ path: change.path, reason: validity.reason })
    }
    return { findings, ledger }
  }

  const active = /** @type {TaskContract} */ (contract)
  const scope = compileTaskContract(active, manifest)

  // An entity the contract names but the manifest cannot resolve is ambiguous
  // scope. Under the default policy that BLOCKs rather than resolving to "all".
  if (scope.unresolvedEntities.length > 0 && scope.ambiguityPolicy === 'BLOCK') {
    findings.push({
      layer: 'scope',
      class: 'unknownScope',
      decision: 'BLOCK',
      message: `TaskContract names entities SLD cannot resolve deterministically: ${scope.unresolvedEntities.join(', ')}. Add them to the manifest entity registry or name files explicitly.`,
      detail: scope.unresolvedEntities.join(','),
    })
  }

  const governanceAllowed = allowsGovernanceEdits(active)

  for (const change of changes) {
    const path = change.path
    /** @type {string[]} */
    const reasons = []

    // SLD's own governance surface is protected from ordinary feature tasks.
    if (isGovernancePath(path) && !governanceAllowed) {
      reasons.push(
        'Path is part of SLD\'s own governance surface. It may only change under a TaskContract granting SLD_ENGINE_MAINTENANCE.',
      )
    }

    if (!pathInScope(path, scope)) {
      reasons.push('File is not named by the TaskContract (no allowed file, directory, or entity covers it).')
    }

    // Explicit prohibitions always win.
    for (const forbidden of scope.forbidden) {
      if (path === forbidden || path.startsWith(`${forbidden}/`)) {
        reasons.push(`File is listed in the TaskContract's forbiddenChanges.`)
      }
    }

    // Action-level: permission to MODIFY never implies DELETE, RESTYLE never
    // implies REFACTOR, and so on.
    const implied = impliedActions(change)
    const unauthorizedActions = implied.filter((i) => !scope.actions.includes(i.action))
    for (const bad of unauthorizedActions) {
      reasons.push(`Change implies ${bad.action} (${bad.label}), which the TaskContract does not grant.`)
    }

    // State-level: when the contract narrows to specific states, a change must
    // declare which state it touches and that state must be authorized.
    if (scope.states.length > 0) {
      const declared = Array.isArray(change.states) ? change.states : []
      if (declared.length === 0) {
        reasons.push('TaskContract is state-scoped but the change declares no state, so it cannot be proven in scope.')
      } else {
        const bad = declared.filter((s) => !scope.states.some((a) => a.toLowerCase() === s.toLowerCase()))
        if (bad.length > 0) reasons.push(`Change touches unauthorized state(s): ${bad.join(', ')}.`)
      }
    }

    if (reasons.length === 0) {
      ledger.authorized.push({
        path,
        entity: entityForPath(path, scope) ?? '(named file)',
        states: Array.isArray(change.states) && change.states.length ? change.states : ['(unspecified)'],
        action: CHANGE_TYPE_ACTION[change.changeType] ?? 'MODIFY',
        source: active.taskId,
      })
      continue
    }

    const reason = reasons.join(' ')
    ledger.unauthorized.push({ path, reason })
    findings.push({
      layer: 'scope',
      class: 'unauthorizedChange',
      decision: 'BLOCK',
      path,
      message: `Change was not authorized by the active TaskContract. ${reason}`,
      detail: active.taskId,
    })
  }

  // A required change that never arrived is worth surfacing, but it is an
  // incompleteness rather than an unauthorized act, so it does not BLOCK.
  for (const required of active.requiredChanges) {
    const met = changes.some((c) => c.path === required || c.path.endsWith(required))
    if (!met) {
      ledger.observations.push({
        observation: `TaskContract lists "${required}" as a required change, but no such change is present.`,
        action: 'none',
        reason: 'Reported for completeness; absence of a change is not an unauthorized change.',
      })
    }
  }

  return { findings, ledger }
}

/**
 * Post-change verification (§20). Re-runs the gate over the ACTUAL diff and
 * reports whether every change maps back to the contract.
 *
 * @param {ChangeSet} actualDiff
 * @param {Manifest} manifest
 * @param {TaskContract | null | undefined} contract
 * @returns {{ pass: boolean; unauthorizedCount: number; ledger: ChangeLedger; findings: Finding[] }}
 */
export function verifyAgainstContract(actualDiff, manifest, contract) {
  const { findings, ledger } = runScopeGate(actualDiff, manifest, contract)
  const unauthorizedCount = ledger.unauthorized.length
  return { pass: unauthorizedCount === 0 && findings.length === 0, unauthorizedCount, ledger, findings }
}
