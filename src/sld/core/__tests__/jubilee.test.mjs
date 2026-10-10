// @ts-nocheck
/**
 * SLD adversarial jubilee — a permanent battery of hypothetical attack and
 * failure scenarios run against the real engine core. If any of these regress,
 * the engine has lost the ability it was built for.
 *
 * Run with: npm test
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  evaluateChangeSet,
  createTaskContract,
  approveTaskContract,
} from '../index.js'
import EXAMPLE_MANIFEST from '../manifest/example.manifest.js'

const M = EXAMPLE_MANIFEST
const NOW = new Date().toISOString()

const approvedContract = (input) => approveTaskContract(createTaskContract({
  ...input,
  draftedBy: 'jubilee',
}), {
  approvedBy: 'test-owner',
  implementingActor: 'test-agent',
  approvedAt: NOW,
})

const contractFor = (files, actions = ['MODIFY']) => approvedContract({
  taskId: 'jubilee',
  instruction: 'Jubilee scenario.',
  allowedFiles: files,
  allowedActions: actions,
})

const BASE = {
  files: {
    'src/components/dashboard/customize.tsx': { lineCount: 600 },
    'src/lib/auth.ts': { lineCount: 200 },
    'src/lib/checkout.ts': { lineCount: 300 },
    'src/components/ui/thing.tsx': { lineCount: 100 },
  },
  appRoots: ['.'],
  generatedAt: NOW,
}

const run = (changes, contract, baseline = BASE) =>
  evaluateChangeSet({ label: 'jubilee', changes }, M, baseline, NOW, contract)

// ── Scope gate ─────────────────────────────────────────────────────────────
test('jubilee: empty diff needs no contract', () => {
  assert.equal(run([], null).decision, 'ALLOW')
})

test('jubilee: change without a contract fails closed', () => {
  const r = run([{ path: 'src/lib/auth.ts', changeType: 'modify', addedText: '// hi' }], null)
  assert.equal(r.decision, 'INSUFFICIENT_EVIDENCE')
})

test('jubilee: unauthorized file BLOCKs', () => {
  const r = run(
    [{ path: 'src/lib/auth.ts', changeType: 'modify', addedText: '// hi' }],
    contractFor(['src/components/ui/thing.tsx']),
  )
  assert.equal(r.decision, 'BLOCK')
  assert.ok(r.findings.some((f) => f.class === 'unauthorizedChange'))
})

test('jubilee: stale contract from another task BLOCKs', () => {
  const c = approvedContract({
    taskId: 'other-task',
    instruction: 'Other work.',
    allowedEntities: ['SLD Engine'],
    allowedActions: ['MODIFY'],
  })
  const r = run(
    [{ path: 'src/components/dashboard/customize.tsx', changeType: 'modify', addedText: 'x' }],
    c,
  )
  assert.equal(r.decision, 'BLOCK')
})

// ── Execution: content loss ────────────────────────────────────────────────
test('jubilee: whole-file delete without a DELETE grant BLOCKs', () => {
  const r = run(
    [{ path: 'src/components/dashboard/customize.tsx', changeType: 'delete' }],
    contractFor(['src/components/dashboard/customize.tsx']),
  )
  assert.equal(r.decision, 'BLOCK')
})

test('jubilee: whole-file delete with a DELETE grant is visible, not silent', () => {
  const r = run(
    [{ path: 'src/components/dashboard/customize.tsx', changeType: 'delete' }],
    contractFor(['src/components/dashboard/customize.tsx'], ['DELETE']),
  )
  assert.equal(r.decision, 'REVIEW_REQUIRED')
  assert.ok(r.findings.some((f) => f.class === 'contentLoss'))
})

test('jubilee: 40% removal asks for review', () => {
  const r = run(
    [{ path: 'src/components/dashboard/customize.tsx', changeType: 'modify', baselineLineCount: 600, removedLineCount: 240, addedText: '// reworked' }],
    contractFor(['src/components/dashboard/customize.tsx']),
  )
  assert.equal(r.decision, 'REVIEW_REQUIRED')
})

test('jubilee: 65% removal BLOCKs', () => {
  const r = run(
    [{ path: 'src/components/dashboard/customize.tsx', changeType: 'modify', baselineLineCount: 600, removedLineCount: 390, addedText: '// reworked' }],
    contractFor(['src/components/dashboard/customize.tsx']),
  )
  assert.equal(r.decision, 'BLOCK')
})

test('jubilee: 95% removal under an authorized DELETE grant asks for confirmation', () => {
  const r = run(
    [{ path: 'src/components/dashboard/customize.tsx', changeType: 'modify', baselineLineCount: 600, removedLineCount: 570, addedText: '// reworked' }],
    contractFor(['src/components/dashboard/customize.tsx'], ['MODIFY', 'DELETE']),
  )
  assert.equal(r.decision, 'REVIEW_REQUIRED')
  assert.ok(r.findings.some((f) => f.class === 'contentLoss'))
})

test('jubilee: elision marker plus substantial removal BLOCKs', () => {
  const r = run(
    [{ path: 'src/components/dashboard/customize.tsx', changeType: 'modify', baselineLineCount: 600, removedLineCount: 240, addedText: '// ... rest of file unchanged' }],
    contractFor(['src/components/dashboard/customize.tsx']),
  )
  assert.equal(r.decision, 'BLOCK')
  assert.ok(r.findings.some((f) => f.class === 'generationArtifactCorruption'))
})

test('jubilee: elision marker with tiny removal asks for review', () => {
  const r = run(
    [{ path: 'src/components/dashboard/customize.tsx', changeType: 'modify', baselineLineCount: 600, removedLineCount: 30, addedText: '// ... rest of file unchanged' }],
    contractFor(['src/components/dashboard/customize.tsx']),
  )
  assert.equal(r.decision, 'REVIEW_REQUIRED')
})

test('jubilee: removal that cannot be measured fails closed', () => {
  const r = run(
    [{ path: 'src/components/dashboard/customize.tsx', changeType: 'modify', removedLineCount: 390, addedText: '// reworked' }],
    contractFor(['src/components/dashboard/customize.tsx']),
    null,
  )
  assert.equal(r.decision, 'INSUFFICIENT_EVIDENCE')
})

// ── Identity / Architecture / Dependencies ─────────────────────────────────
test('jubilee: forbidden term reintroduced BLOCKs', () => {
  const r = run(
    [{ path: 'src/components/ui/thing.tsx', changeType: 'modify', addedText: 'Welcome to OldBrand!' }],
    contractFor(['src/components/ui/thing.tsx']),
  )
  assert.equal(r.decision, 'BLOCK')
  assert.ok(r.findings.some((f) => f.class === 'forbiddenTerm'))
})

test('jubilee: nested application root BLOCKs', () => {
  const r = run(
    [{ path: 'nested-copy/package.json', changeType: 'add', addedText: '{"name":"x"}' }],
    contractFor(['nested-copy/package.json'], ['CREATE']),
  )
  assert.equal(r.decision, 'BLOCK')
  assert.ok(r.findings.some((f) => f.class === 'duplicateAppRoot'))
})

test('jubilee: forbidden UI-to-DB edge asks for review', () => {
  const r = run(
    [{ path: 'src/components/ui/thing.tsx', changeType: 'modify', addedText: 'import db from "@/lib/db";', imports: ['@/lib/db'] }],
    contractFor(['src/components/ui/thing.tsx'], ['MODIFY', 'REWIRE']),
  )
  assert.ok(r.findings.some((f) => f.class === 'dependencyViolation'))
})

test('jubilee: client component importing a server-only module BLOCKs', () => {
  const r = run(
    [{ path: 'src/components/ui/thing.tsx', changeType: 'modify', addedText: '"use client";\nimport db from "@/lib/db";', imports: ['@/lib/db'], isClientComponent: true }],
    contractFor(['src/components/ui/thing.tsx'], ['MODIFY', 'REWIRE']),
  )
  assert.equal(r.decision, 'BLOCK')
})

// ── Behavior / Data / Interface / Intent ───────────────────────────────────
test('jubilee: deleting a protected feature file asks for review', () => {
  const r = run(
    [{ path: 'src/lib/auth.ts', changeType: 'delete' }],
    contractFor(['src/lib/auth.ts'], ['DELETE']),
  )
  assert.equal(r.decision, 'REVIEW_REQUIRED')
  assert.ok(r.findings.some((f) => f.class === 'protectedFeatureChange'))
})

test('jubilee: modifying a protected feature asks for review', () => {
  const r = run(
    [{ path: 'src/lib/checkout.ts', changeType: 'modify', addedText: '// tweak' }],
    contractFor(['src/lib/checkout.ts']),
  )
  assert.equal(r.decision, 'REVIEW_REQUIRED')
})

test('jubilee: DROP TABLE in a migration BLOCKs', () => {
  const r = run(
    [{ path: 'db/migrations/0007_drop.sql', changeType: 'add', addedText: 'DROP TABLE users;' }],
    contractFor(['db/migrations/0007_drop.sql'], ['CREATE']),
  )
  assert.equal(r.decision, 'BLOCK')
  assert.ok(r.findings.some((f) => f.class === 'destructiveChange'))
})

test('jubilee: modifying a protected component warns', () => {
  const r = run(
    [{ path: 'src/components/Header.tsx', changeType: 'modify', addedText: '// tweak' }],
    contractFor(['src/components/Header.tsx']),
  )
  assert.equal(r.decision, 'ALLOW_WITH_WARNING')
})

test('jubilee: re-implementing a shared primitive warns', () => {
  const r = run(
    [{ path: 'src/components/ui/mybtn.tsx', changeType: 'add', addedText: 'function PrimaryButton() { return 1; }' }],
    contractFor(['src/components/ui/mybtn.tsx'], ['CREATE']),
  )
  assert.equal(r.decision, 'ALLOW_WITH_WARNING')
})

test('jubilee: reframing language asks for review', () => {
  const r = run(
    [{ path: 'src/components/ui/thing.tsx', changeType: 'modify', addedText: 'Book your flight today!' }],
    contractFor(['src/components/ui/thing.tsx']),
  )
  assert.equal(r.decision, 'REVIEW_REQUIRED')
})

test('jubilee: hard-coded price asks for review', () => {
  const r = run(
    [{ path: 'src/lib/catalog.ts', changeType: 'add', addedText: 'export const ITEM = { price: 19.99 }' }],
    contractFor(['src/lib/catalog.ts'], ['CREATE']),
  )
  assert.equal(r.decision, 'REVIEW_REQUIRED')
})

// ── Engine meta ────────────────────────────────────────────────────────────
test('jubilee: malformed changeset fails closed', () => {
  const r = evaluateChangeSet(
    { label: 'jubilee', changes: 'not-an-array' }, M, BASE, NOW,
    contractFor(['x']),
  )
  assert.equal(r.decision, 'INSUFFICIENT_EVIDENCE')
  assert.equal(r.failedClosed, true)
})

test('jubilee: manifest policy floors are honored and escalated, never undercut', () => {
  assert.equal(M.policies.contentLoss, 'REVIEW_REQUIRED')
  assert.equal(M.policies.generationArtifactCorruption, 'REVIEW_REQUIRED')
  const r = run(
    [{ path: 'src/components/dashboard/customize.tsx', changeType: 'modify', baselineLineCount: 600, removedLineCount: 420, addedText: '// reworked' }],
    contractFor(['src/components/dashboard/customize.tsx']),
  )
  const f = r.findings.find((x) => x.class === 'contentLoss')
  assert.ok(f)
  assert.equal(f.decision, 'BLOCK', 'magnitude escalates above the manifest floor')
})
