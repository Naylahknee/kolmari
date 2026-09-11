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
    if (looksLikeCopyChange(text)) out.push({ action: 'REWRITE_COPY', label: 'user-visible copy change' })
  }
  return out
}

/**
 * Enforce a narrowed semantic dimension without guessing. When the contract
 * names allowed values, missing evidence is not treated as broad permission.
 * @param {string} label
 * @param {string[]} allowed
 * @param {string[] | undefined} declared
 * @returns {string[]}
 */
function semanticScopeReasons(label, allowed, declared) {
  if (allowed.length === 0) return []
  if (!Array.isArray(declared) || declared.length === 0) {
    return [`TaskContract is ${label}-scoped but the change declares no ${label}, so it cannot be proven in scope.`]
  }
  const unauthorized = declared.filter(
    (value) => !allowed.some((candidate) => candidate.toLowerCase() === value.toLowerCase()),
  )
  return unauthorized.length > 0 ? [`Change touches unauthorized ${label}(s): ${unauthorized.join(', ')}.`] : []
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
      layer: 'execution',
      class: 'invalidContractApproval',
      decision: 'INSUFFICIENT_EVIDENCE',
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
      layer: 'execution',
      class: 'unknownScope',
      decision: 'INSUFFICIENT_EVIDENCE',
      message: `TaskContract names entities SLD cannot resolve deterministically: ${scope.unresolvedEntities.join(', ')}. Add them to the manifest entity registry or name files explicitly.`,
      detail: scope.unresolvedEntities.join(','),
    })
    for (const change of changes) {
      ledger.unauthorized.push({
        path: change.path,
        reason: `Contract target cannot be resolved: ${scope.unresolvedEntities.join(', ')}.`,
      })
    }
    return { findings, ledger }
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
    reasons.push(...semanticScopeReasons('state', scope.states, change.states))
    reasons.push(...semanticScopeReasons('behavior', scope.behaviors, change.behaviors))
    reasons.push(...semanticScopeReasons('UI region', scope.uiRegions, change.uiRegions))

    if (reasons.length === 0) {
      ledger.authorized.push({
        path,
        entity: entityForPath(path, scope) ?? '(named file)',
        states: Array.isArray(change.states) && change.states.length ? change.states : ['(unspecified)'],
        behaviors: Array.isArray(change.behaviors) && change.behaviors.length ? change.behaviors : ['(unspecified)'],
        uiRegions: Array.isArray(change.uiRegions) && change.uiRegions.length ? change.uiRegions : ['(unspecified)'],
        action: CHANGE_TYPE_ACTION[change.changeType] ?? 'MODIFY',
        source: active.taskId,
      })
      continue
    }

    const reason = reasons.join(' ')
    ledger.unauthorized.push({ path, reason })
    findings.push({
      layer: 'execution',
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
    const artifact = typeof required === 'string' ? required : required.artifact
    const met = changes.some((c) => c.path === artifact || c.path.endsWith(artifact))
    if (!met) {
      ledger.observations.push({
        observation: `TaskContract lists "${artifact}" as a required change, but no such change is present.`,
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
  if (contract && findings.every((finding) => finding.class !== 'invalidContractApproval')) {
    for (const requirement of contract.requiredChanges || []) {
      const rule = typeof requirement === 'string' ? { artifact: requirement } : requirement
      const change = actualDiff.changes.find(
        (candidate) => candidate.path === rule.artifact || candidate.path.endsWith(rule.artifact),
      )
      let satisfied = Boolean(change && change.changeType !== 'delete')
      if (satisfied && rule.mustContain) satisfied = (change.addedText || '').includes(rule.mustContain)
      if (satisfied && rule.mustMatch) {
        try {
          satisfied = new RegExp(rule.mustMatch).test(change.addedText || '')
        } catch {
          satisfied = false
        }
      }
      if (rule.mustExist === false) satisfied = !change || change.changeType === 'delete'
      if (!satisfied) {
        findings.push({
          layer: 'execution',
          class: 'missingRequiredChange',
          decision: 'BLOCK',
          path: rule.artifact,
          message: `Required content-level change was not satisfied for ${rule.artifact}.`,
          detail: rule.mustContain || rule.mustMatch || (rule.mustExist === false ? 'must-not-exist' : 'must-exist'),
        })
      }
    }
  }
  const unauthorizedCount = ledger.unauthorized.length
  return { pass: unauthorizedCount === 0 && findings.length === 0, unauthorizedCount, ledger, findings }
}
