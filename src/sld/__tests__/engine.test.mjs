// @ts-nocheck
/**
 * Core decision-engine tests. Run with: npm run sld:test
 * Each test builds a minimal ChangeSet and asserts the deterministic decision.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  KOLMARI_MANIFEST,
  SLD_LAYER_IDS,
  approveTaskContract,
  createTaskContract,
  evaluateChangeSet,
  aggregateDecision,
} from '../index.js'

const M = KOLMARI_MANIFEST

const approvedContract = (input) => approveTaskContract(createTaskContract({
  ...input,
  draftedBy: 'test-drafter',
}), {
  approvedBy: 'test-owner',
  implementingActor: 'test-agent',
  approvedAt: '2026-09-11T00:00:00.000Z',
})

/**
 * These tests exercise the SEVEN LAYERS — i.e. risk, given permission. Under
 * strict SLD an unauthorized change BLOCKs at the Scope Gate before any layer
 * runs, so each case is evaluated under a wide-open maintenance contract. Scope
 * enforcement itself is covered in scope.test.mjs.
 */
const WIDE = approvedContract({
  taskId: 'layer-tests',
  instruction: 'Exercise the seven layer analyzers.',
  allowedDirectories: ['src', 'db', 'docs', '.open-next', 'kolmari-copy'],
  allowedActions: ['CREATE', 'MODIFY', 'DELETE', 'RENAME', 'MOVE', 'REFACTOR', 'RESTYLE', 'REWIRE', 'MIGRATE', 'REWRITE_COPY'],
  grants: ['SLD_ENGINE_MAINTENANCE'],
})
const WIDE_NO_DELETE = approvedContract({
  taskId: 'layer-tests-no-delete',
  instruction: 'Exercise integrity analysis without deletion authority.',
  allowedDirectories: ['src', 'docs'],
  allowedActions: ['CREATE', 'MODIFY', 'RENAME', 'MOVE', 'REFACTOR', 'RESTYLE', 'REWIRE', 'MIGRATE', 'REWRITE_COPY'],
  grants: ['SLD_ENGINE_MAINTENANCE'],
})

const cs = (changes) => ({ label: 'test', changes })

test('canonical layer registry exactly matches the SLD operational ontology', () => {
  assert.deepEqual(SLD_LAYER_IDS, [
    'identity', 'design', 'behavior', 'system', 'logic', 'content', 'execution',
  ])
  assert.deepEqual(M.protectedLayers, SLD_LAYER_IDS)
})

test('an AUTHORIZED harmless change is ALLOWed (permission proven first)', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/components/kolmari/hello.tsx', changeType: 'add', addedText: 'export const Hello = () => <p>Hi</p>' },
  ]), M, null, undefined, WIDE)
  assert.equal(r.decision, 'ALLOW')
  assert.equal(r.findings.length, 0)
})

test('an empty change set is ALLOWed', () => {
  const r = evaluateChangeSet(cs([]), M, null, undefined, WIDE)
  assert.equal(r.decision, 'ALLOW')
})

test('Layer 1 — reintroducing a forbidden term BLOCKs', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/components/foo.tsx', changeType: 'modify', addedText: 'const brand = "Nexitnation is back"' },
  ]), M, null, undefined, WIDE)
  assert.equal(r.decision, 'BLOCK')
  assert.ok(r.findings.some((f) => f.layer === 'identity' && f.class === 'forbiddenTerm'))
})

test('Layer 5 — destructive SQL on a protected table BLOCKs', () => {
  const r = evaluateChangeSet(cs([
    { path: 'db/migrations/003.sql', changeType: 'add', addedText: 'DROP TABLE users;' },
  ]), M, null, undefined, WIDE)
  assert.equal(r.decision, 'BLOCK')
  const f = r.findings.find((x) => x.layer === 'content')
  assert.ok(f)
  assert.match(f.message, /protected table/i)
})

test('Layer 5 — lowercase SQL words in UI code are NOT destructive (Tailwind "truncate")', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/components/kolmari/card.tsx', changeType: 'add', addedText: '<p className="min-w-0 truncate text-navy">{name}</p>' },
  ]), M, null, undefined, WIDE)
  assert.equal(r.decision, 'ALLOW', 'a CSS class must never read as a destructive DB operation')
})

test('Layer 5 — lowercase destructive SQL in a migration IS caught', () => {
  const r = evaluateChangeSet(cs([
    { path: 'db/migrations/004.sql', changeType: 'add', addedText: 'drop table users;' },
  ]), M, null, undefined, WIDE)
  assert.equal(r.decision, 'BLOCK')
  assert.ok(r.findings.some((f) => f.layer === 'content'))
})

test('Layer 7 — rendering the words "Match Score" is not a fabricated score', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/components/kolmari/shortlist.tsx', changeType: 'add', addedText: '<p className="text-[10px]">Match Score</p>\n<Icon size={13} />' },
  ]), M, null, undefined, WIDE)
  assert.equal(r.decision, 'ALLOW')
})

test('Layer 7 — a hard-coded Match Score value IS flagged', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/lib/country-data.ts', changeType: 'add', addedText: 'export const PT = { matchScore: 92 }' },
  ]), M, null, undefined, WIDE)
  assert.equal(r.decision, 'REVIEW_REQUIRED')
  assert.ok(r.findings.some((f) => f.detail === 'literal-match-score'))
})

test('Logic — UI component importing the DB client is a dependency violation (REVIEW_REQUIRED)', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/components/kolmari/widget.tsx', changeType: 'add', addedText: "import { getSql } from '@/lib/db'", imports: ['@/lib/db'] },
  ]), M, null, undefined, WIDE)
  assert.ok(['REVIEW_REQUIRED', 'BLOCK'].includes(r.decision))
  assert.ok(r.findings.some((f) => f.layer === 'logic'))
})

test('Logic — server-only module in a client component is an architecture violation (BLOCK)', () => {
  const r = evaluateChangeSet(cs([
    {
      path: 'src/components/kolmari/widget.tsx',
      changeType: 'add',
      addedText: "'use client'\nimport { x } from '@/lib/command-center'",
      imports: ['@/lib/command-center'],
      isClientComponent: true,
    },
  ]), M, null, undefined, WIDE)
  assert.equal(r.decision, 'BLOCK')
  assert.ok(r.findings.some((f) => f.class === 'architectureViolation'))
})

test('Layer 3 — a SERVER component may import a server-only module', () => {
  // Not every file under src/components/ is a client component; one without the
  // 'use client' directive is rendered on the server and may import freely.
  const r = evaluateChangeSet(cs([
    {
      path: 'src/components/kolmari/summary.tsx',
      changeType: 'add',
      addedText: "import { destinationProgress } from '@/lib/command-center'",
      imports: ['@/lib/command-center'],
      isClientComponent: false,
    },
  ]), M, null, undefined, WIDE)
  assert.ok(!r.findings.some((f) => f.class === 'architectureViolation'))
})

test('Layer 3 — falls back to the diff text when the scanner did not decide', () => {
  const r = evaluateChangeSet(cs([
    {
      path: 'src/components/kolmari/widget.tsx',
      changeType: 'add',
      addedText: "'use client'\nimport { x } from '@/lib/db'",
      imports: ['@/lib/db'],
    },
  ]), M, null, undefined, WIDE)
  assert.equal(r.decision, 'BLOCK')
})

test('Behavior — touching a protected feature triggers REVIEW_REQUIRED', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/lib/auth.ts', changeType: 'modify', addedText: '// tweak' },
  ]), M, null, undefined, WIDE)
  assert.equal(r.decision, 'REVIEW_REQUIRED')
  assert.ok(r.findings.some((f) => f.layer === 'behavior' && f.detail === 'authentication'))
})

test('Layer 2 — a new app root outside the canonical root BLOCKs (duplicate project)', () => {
  const r = evaluateChangeSet(cs([
    { path: 'kolmari-copy/package.json', changeType: 'add', addedText: '{"name":"kolmari"}' },
  ]), M, null, undefined, WIDE)
  assert.equal(r.decision, 'BLOCK')
  assert.ok(r.findings.some((f) => f.class === 'duplicateAppRoot'))
})

test('Layer 2 — build-output package.json (.open-next) is ignored', () => {
  const r = evaluateChangeSet(cs([
    { path: '.open-next/package.json', changeType: 'add', addedText: '{}' },
  ]), M, null, undefined, WIDE)
  assert.equal(r.decision, 'ALLOW')
})

test('Layer 6 — editing a protected design component WARNs', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/components/country-template/Sidebar.tsx', changeType: 'modify', addedText: '// restyle' },
  ]), M, null, undefined, WIDE)
  assert.equal(r.decision, 'ALLOW_WITH_WARNING')
  assert.ok(r.findings.some((f) => f.class === 'designSystemDrift'))
})

test('Identity — travel-app framing triggers REVIEW_REQUIRED', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/components/hero.tsx', changeType: 'add', addedText: 'Book your flight and vacation package today!' },
  ]), M, null, undefined, WIDE)
  assert.equal(r.decision, 'REVIEW_REQUIRED')
  assert.ok(r.findings.some((f) => f.layer === 'identity'))
})

test('priority: BLOCK dominates a mix of findings', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/components/country-template/Sidebar.tsx', changeType: 'modify', addedText: 'DROP TABLE users; // Nexit' },
  ]), M, null, undefined, WIDE)
  assert.equal(r.decision, 'BLOCK')
  assert.ok(r.summary.BLOCK >= 1)
})

test('aggregateDecision picks the highest severity', () => {
  assert.equal(aggregateDecision([{ decision: 'ALLOW_WITH_WARNING' }, { decision: 'REVIEW_REQUIRED' }, { decision: 'ALLOW' }]), 'REVIEW_REQUIRED')
  assert.equal(aggregateDecision([{ decision: 'ALLOW_WITH_WARNING' }]), 'ALLOW_WITH_WARNING')
  assert.equal(aggregateDecision([]), 'ALLOW')
})

test('FAIL CLOSED — malformed input returns INSUFFICIENT_EVIDENCE', () => {
  const r = evaluateChangeSet({ changes: 'not-an-array' }, M, null, undefined, WIDE)
  assert.equal(r.decision, 'INSUFFICIENT_EVIDENCE')
  assert.equal(r.failedClosed, true)
})

test('FAIL CLOSED — a missing manifest returns INSUFFICIENT_EVIDENCE', () => {
  const r = evaluateChangeSet(cs([{ path: 'a.ts', changeType: 'add' }]), null, null, undefined, WIDE)
  assert.equal(r.decision, 'INSUFFICIENT_EVIDENCE')
  assert.equal(r.failedClosed, true)
})

test('deletions never crash and are analyzed', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/lib/auth.ts', changeType: 'delete' },
  ]), M, null, undefined, WIDE)
  assert.ok(r.findings.some((f) => f.layer === 'behavior'))
})

test('the engine does not flag its own rulebook (which lists forbidden terms)', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/sld/manifest/kolmari.manifest.js', changeType: 'modify', addedText: "forbiddenTerms: ['Nexit', 'Nexitnation']" },
  ]), M, null, undefined, WIDE)
  assert.equal(r.decision, 'ALLOW', 'editing the manifest must not BLOCK on its own forbidden-terms list')
})

test('structural layers still apply to exempt surfaces', () => {
  // The specimen exemption covers CONTENT scanning only — a real boundary
  // violation inside a test file is still caught.
  const r = evaluateChangeSet(cs([
    {
      path: 'src/components/kolmari/__tests__/widget.test.tsx',
      changeType: 'add',
      addedText: "import { getSql } from '@/lib/db'",
      imports: ['@/lib/db'],
    },
  ]), M, null, undefined, WIDE)
  assert.notEqual(r.decision, 'ALLOW')
  assert.ok(r.findings.some((f) => f.layer === 'logic'))
})

test('test fixtures may quote destructive SQL without blocking', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/sld/__tests__/engine.test.mjs', changeType: 'modify', addedText: "addedText: 'DROP TABLE users;'" },
  ]), M, null, undefined, WIDE)
  assert.equal(r.decision, 'ALLOW')
})

test('Layer 7 — silent majority content loss without DELETE authorization BLOCKs', () => {
  const r = evaluateChangeSet(cs([{
    path: 'src/lib/example.ts',
    changeType: 'modify',
    addedText: 'export const retained = true',
    removedText: Array.from({ length: 70 }, (_, i) => `export const old${i} = ${i}`).join('\n'),
    baselineLineCount: 100,
    removedLineCount: 70,
  }]), M, null, undefined, WIDE_NO_DELETE)
  assert.equal(r.decision, 'BLOCK')
  assert.ok(r.findings.some((f) => f.layer === 'execution' && f.class === 'contentLoss'))
})

test('Layer 7 — AI elision plus substantial content loss BLOCKs corruption', () => {
  const r = evaluateChangeSet(cs([{
    path: 'src/lib/example.ts',
    changeType: 'modify',
    addedText: '// ... rest of file unchanged',
    removedText: Array.from({ length: 50 }, (_, i) => `export const old${i} = ${i}`).join('\n'),
    baselineLineCount: 100,
    removedLineCount: 50,
  }]), M, null, undefined, WIDE_NO_DELETE)
  assert.equal(r.decision, 'BLOCK')
  assert.ok(r.findings.some((f) => f.class === 'generationArtifactCorruption'))
})

test('Layer 7 — elision markers in documentation remain exempt', () => {
  const r = evaluateChangeSet(cs([{
    path: 'docs/example.md',
    changeType: 'modify',
    addedText: '... rest of file unchanged',
    baselineLineCount: 100,
    removedLineCount: 80,
  }]), M, null, undefined, WIDE)
  assert.equal(r.decision, 'ALLOW')
})
