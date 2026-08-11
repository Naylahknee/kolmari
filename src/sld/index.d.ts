/**
 * Type surface for the Seven Layer Dip (SLD) governance engine.
 *
 * The engine itself is authored in dependency-free ESM JavaScript so the exact
 * same code runs in the Node CLI and inside the Cloudflare-Workers API route.
 * This declaration file gives the TypeScript consumers (the `/api/sld/evaluate`
 * route) a fully typed view of that JS.
 *
 * SECURITY: no type here ever carries a secret value. Environment variables are
 * referenced by NAME only; the engine never receives, stores, or emits a token,
 * password, key, or connection string.
 */

export type Decision = 'ALLOW' | 'WARN' | 'REVIEW' | 'BLOCK'

/** The seven layers, in canonical order. */
export type Layer =
  | 'scope'
  | 'identity'
  | 'architecture'
  | 'dependencies'
  | 'behavior'
  | 'data'
  | 'interface'
  | 'intent'

/** Deterministic finding classes → policy keys in the manifest. */
export type FindingClass =
  | 'unauthorizedChange'
  | 'unknownScope'
  | 'unknownChange'
  | 'destructiveChange'
  | 'architectureViolation'
  | 'dependencyViolation'
  | 'behavioralChange'
  | 'protectedFeatureChange'
  | 'designSystemDrift'
  | 'forbiddenTerm'
  | 'duplicateAppRoot'
  | 'harmlessChange'

export type ChangeType = 'add' | 'modify' | 'delete' | 'rename'

/**
 * One file's worth of change, pre-analyzed into deterministic signals. The Node
 * scanner extracts these from a git diff; the API route accepts them directly.
 * Full file contents are optional so a Worker request stays small.
 */
export interface FileChange {
  path: string
  changeType: ChangeType
  /** Previous path when changeType === 'rename'. */
  oldPath?: string
  /** Text added by this change (the '+' side of a diff), newline-joined. */
  addedText?: string
  /** Text removed by this change (the '-' side of a diff), newline-joined. */
  removedText?: string
  /** Module specifiers imported by the new content (e.g. '@/lib/db'). */
  imports?: string[]
  /**
   * Whether the file carries a `'use client'` directive. Supplied by the Node
   * scanner, which can read the whole file; `undefined` means "not determined",
   * and rules that depend on it must not assume either way.
   */
  isClientComponent?: boolean
  /**
   * States of the authorized entity this change touches (e.g. 'mobileVisibility',
   * 'backgroundImage'). Required when the TaskContract is state-scoped: a file
   * being in scope does not put every property of it in scope.
   */
  states?: string[]
}

export interface ChangeSet {
  /** Free-form label for the audit trail (branch, PR title, etc.). No secrets. */
  label?: string
  changes: FileChange[]
}

export interface Finding {
  layer: Layer
  class: FindingClass
  decision: Decision
  path?: string
  message: string
  /** Optional machine detail (matched term, edge, table…). Never a secret. */
  detail?: string
}

export type ScopeAction =
  | 'CREATE' | 'MODIFY' | 'DELETE' | 'MOVE' | 'RENAME'
  | 'REFACTOR' | 'RESTYLE' | 'REWIRE' | 'MIGRATE'

/** Exactly what the user authorized. Absent from it means PRESERVE. */
export interface TaskContract {
  taskId: string
  instruction: string
  objective: string
  allowedFiles: string[]
  allowedDirectories: string[]
  allowedEntities: string[]
  allowedActions: ScopeAction[]
  allowedBehaviors: string[]
  allowedUIRegions: string[]
  allowedStates: string[]
  requiredChanges: string[]
  forbiddenChanges: string[]
  invariants: string[]
  propagationRules: Array<{ from: string; to: string; reason: string }>
  /** Special grants, e.g. SLD_ENGINE_MAINTENANCE. */
  grants: string[]
  ambiguityPolicy: 'BLOCK' | 'ALLOW'
  createdFrom: string
}

export interface CompiledScope {
  taskId: string
  fileGlobs: string[]
  entityGlobs: Record<string, string[]>
  unresolvedEntities: string[]
  actions: ScopeAction[]
  states: string[]
  forbidden: string[]
  ambiguityPolicy: 'BLOCK' | 'ALLOW'
}

/** Per-task record of what was authorized, what was not, and what was noticed. */
export interface ChangeLedger {
  taskId: string | null
  authorized: Array<{ path: string; entity: string; states: string[]; action: ScopeAction; source: string }>
  unauthorized: Array<{ path: string; reason: string }>
  observations: Array<{ observation: string; action: 'none'; reason: string }>
}

export interface Manifest {
  version: number
  application: {
    name: string
    description?: string
    framework: string
    runtime: string
    language: string
  }
  identity: {
    protectedTerms: string[]
    forbiddenTerms: string[]
    criticalFeatures: string[]
  }
  architecture: {
    canonicalRoot: string
    protectedDirectories: string[]
    forbiddenDependencies: Array<{ fromGlob: string; toGlob: string; reason: string }>
    serverOnlyModules: string[]
    boundaries: string[]
  }
  data: {
    database: string
    orm: string
    protectedTables: string[]
    destructiveOperationsRequireApproval: boolean
    destructivePatterns: string[]
    migrationsDir: string
  }
  interface: {
    designSystem: string
    protectedComponents: string[]
    reuseInsteadOfReimplementing: string[]
  }
  behavior: {
    protectedFeatures: Array<{ key: string; paths: string[] }>
  }
  intent: {
    productPrinciples: string[]
  }
  /** Entity name → file globs implementing it. Powers entity-level scope. */
  entities?: Record<string, string[]>
  policies: Record<FindingClass, Decision>
}

/** A frozen snapshot of the governed app; produced by the Node scanner. */
export interface Baseline {
  version: number
  generatedAt: string
  manifestVersion: number
  application: { name: string; root: string }
  /** path → { hash, size, layerTags } for every governed file. */
  files: Record<string, { hash: string; size: number; tags: string[] }>
  /** Discovered app roots (>1 ⇒ duplicate-project drift). */
  appRoots: string[]
  /** Import edges: path → list of local module specifiers it imports. */
  edges: Record<string, string[]>
  /** Environment variable NAMES referenced in the app (never values). */
  envNames: string[]
}

export interface EvaluationResult {
  decision: Decision
  findings: Finding[]
  summary: {
    ALLOW: number
    WARN: number
    REVIEW: number
    BLOCK: number
  }
  failedClosed: boolean
  /** Scope ledger for the evaluated change set, when a contract was supplied. */
  ledger?: ChangeLedger
  evaluatedAt?: string
}

export interface AuditEntry {
  at: string
  label: string
  decision: Decision
  counts: EvaluationResult['summary']
  findings: Array<Pick<Finding, 'layer' | 'class' | 'decision' | 'path' | 'message'>>
}

export const KOLMARI_MANIFEST: Manifest

/**
 * Pure, deterministic evaluation. No I/O, no LLM, no randomness, no clock unless
 * `now` is supplied. Fail-closed: if analysis throws, returns a BLOCK.
 */
export function evaluateChangeSet(
  changeSet: ChangeSet,
  manifest: Manifest,
  baseline?: Baseline | null,
  now?: string,
  contract?: TaskContract | null,
): EvaluationResult

/** Build a TaskContract from an authored description. Never widens scope. */
export function createTaskContract(input: Partial<TaskContract>): TaskContract

/** A contract must name a concrete target and an action, else it is not permission. */
export function validateTaskContract(
  contract: TaskContract | null | undefined,
): { ok: boolean; reason: string }

/** Authorization check that runs before the seven layers. */
export function runScopeGate(
  changeSet: ChangeSet,
  manifest: Manifest,
  contract: TaskContract | null | undefined,
): { findings: Finding[]; ledger: ChangeLedger }

/** Post-change verification: compare the actual diff to the contract. */
export function verifyAgainstContract(
  actualDiff: ChangeSet,
  manifest: Manifest,
  contract: TaskContract | null | undefined,
): { pass: boolean; unauthorizedCount: number; ledger: ChangeLedger; findings: Finding[] }

export const SCOPE_ACTIONS: ScopeAction[]
export const MANDATORY_INVARIANTS: string[]
export const SLD_MAINTENANCE_GRANT: string

/** Highest-severity decision across findings; empty ⇒ ALLOW. */
export function aggregateDecision(findings: Finding[]): Decision

/** Impact set: files/features reachable from the changed paths via baseline edges. */
export function computeImpact(
  changedPaths: string[],
  baseline: Baseline,
  manifest: Manifest,
): { files: string[]; features: string[] }

/** Build a secret-free audit entry from an evaluation. */
export function buildAuditEntry(
  changeSet: ChangeSet,
  result: EvaluationResult,
  at: string,
): AuditEntry
