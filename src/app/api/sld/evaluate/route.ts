import { getRequestUser } from '@/lib/auth'
import { isAdminUser } from '@/lib/admin'
import { isSameOrigin } from '@/lib/security'
import {
  KOLMARI_MANIFEST,
  createTaskContract,
  evaluateChangeSet,
  buildAuditEntry,
} from '@/sld'
import type { ChangeSet, FileChange, ChangeType, TaskContract } from '@/sld'

/**
 * POST /api/sld/evaluate
 *
 * The runtime governance gate. An admin submits a ChangeSet (already reduced to
 * deterministic signals by the CLI/scanner or a client) and receives the SLD
 * decision: ALLOW | WARN | REVIEW | BLOCK, with per-layer findings.
 *
 * This uses the SAME pure evaluation core as the CLI — the decision is identical
 * whether it runs in CI or here on Cloudflare Workers. No LLM, no randomness.
 *
 * SECURITY: the request body must carry only structural signals (paths, change
 * type, added/removed text, imports). Never send secret values; the engine never
 * inspects or emits them. Input is validated and size-bounded below.
 */

const MAX_CHANGES = 2000
const MAX_TEXT = 200_000 // per-field cap so a request can't be used to exhaust memory
const CHANGE_TYPES: ChangeType[] = ['add', 'modify', 'delete', 'rename']

function str(v: unknown, cap = MAX_TEXT): string | undefined {
  if (typeof v !== 'string') return undefined
  return v.length > cap ? v.slice(0, cap) : v
}

function sanitizeChange(raw: unknown): FileChange | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  const path = str(r.path, 1024)
  const changeType = r.changeType
  if (!path || typeof changeType !== 'string' || !CHANGE_TYPES.includes(changeType as ChangeType)) {
    return null
  }
  const imports = Array.isArray(r.imports)
    ? r.imports.filter((s): s is string => typeof s === 'string').slice(0, 500).map((s) => s.slice(0, 512))
    : undefined
  return {
    path,
    changeType: changeType as ChangeType,
    oldPath: str(r.oldPath, 1024),
    addedText: str(r.addedText),
    removedText: str(r.removedText),
    imports,
    isClientComponent: typeof r.isClientComponent === 'boolean' ? r.isClientComponent : undefined,
    states: Array.isArray(r.states)
      ? r.states.filter((s): s is string => typeof s === 'string').slice(0, 50).map((s) => s.slice(0, 120))
      : undefined,
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Request blocked.' }, { status: 403 })
  }

  const user = await getRequestUser(request)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(await isAdminUser(user))) return Response.json({ error: 'Forbidden' }, { status: 403 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const rawChanges = (body as { changes?: unknown })?.changes
  if (!Array.isArray(rawChanges)) {
    return Response.json({ error: 'Body must include a "changes" array.' }, { status: 400 })
  }
  if (rawChanges.length > MAX_CHANGES) {
    return Response.json({ error: `Too many changes (max ${MAX_CHANGES}).` }, { status: 413 })
  }

  const changes: FileChange[] = []
  for (const raw of rawChanges) {
    const c = sanitizeChange(raw)
    if (c) changes.push(c)
  }

  const label = str((body as { label?: unknown })?.label, 200)
  const changeSet: ChangeSet = { label, changes }

  // The TaskContract carries the authorization. Absent or invalid, the Scope
  // Gate blocks every change — no contract is not permission.
  const rawContract = (body as { taskContract?: unknown })?.taskContract
  const contract: TaskContract | null =
    rawContract && typeof rawContract === 'object'
      ? createTaskContract(rawContract as Partial<TaskContract>)
      : null

  // Fail-closed pure evaluation. The API route never loads a baseline (no fs on
  // Workers); duplicate-app-root and drift checks belong to the CLI/CI half.
  const at = new Date().toISOString()
  const result = evaluateChangeSet(changeSet, KOLMARI_MANIFEST, null, at, contract)
  const audit = buildAuditEntry(changeSet, result, at)

  return Response.json({
    decision: result.decision,
    summary: result.summary,
    failedClosed: result.failedClosed,
    findings: result.findings,
    ledger: result.ledger ?? null,
    audit,
    evaluatedAt: at,
    manifestVersion: KOLMARI_MANIFEST.version,
  })
}
