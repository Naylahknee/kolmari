// @ts-nocheck
/**
 * Core decision-engine tests. Run with: npm run sld:test
 * Each test builds a minimal ChangeSet and asserts the deterministic decision.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { KOLMARI_MANIFEST, evaluateChangeSet, aggregateDecision } from '../index.js'

const M = KOLMARI_MANIFEST
const cs = (changes) => ({ label: 'test', changes })

test('a harmless change is ALLOWed', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/components/kolmari/hello.tsx', changeType: 'add', addedText: 'export const Hello = () => <p>Hi</p>' },
  ]), M)
  assert.equal(r.decision, 'ALLOW')
  assert.equal(r.findings.length, 0)
})

test('an empty change set is ALLOWed', () => {
  const r = evaluateChangeSet(cs([]), M)
  assert.equal(r.decision, 'ALLOW')
})

test('Layer 1 — reintroducing a forbidden term BLOCKs', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/components/foo.tsx', changeType: 'modify', addedText: 'const brand = "Nexitnation is back"' },
  ]), M)
  assert.equal(r.decision, 'BLOCK')
  assert.ok(r.findings.some((f) => f.layer === 'identity' && f.class === 'forbiddenTerm'))
})

test('Layer 5 — destructive SQL on a protected table BLOCKs', () => {
  const r = evaluateChangeSet(cs([
    { path: 'db/migrations/003.sql', changeType: 'add', addedText: 'DROP TABLE users;' },
  ]), M)
  assert.equal(r.decision, 'BLOCK')
  const f = r.findings.find((x) => x.layer === 'data')
  assert.ok(f)
  assert.match(f.message, /protected table/i)
})

test('Layer 3 — UI component importing the DB client is a dependency violation (REVIEW)', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/components/kolmari/widget.tsx', changeType: 'add', addedText: "import { getSql } from '@/lib/db'", imports: ['@/lib/db'] },
  ]), M)
  assert.ok(['REVIEW', 'BLOCK'].includes(r.decision))
  assert.ok(r.findings.some((f) => f.layer === 'dependencies'))
})

test('Layer 3 — server-only module in a client component is an architecture violation (BLOCK)', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/components/kolmari/widget.tsx', changeType: 'add', addedText: "import { x } from '@/lib/command-center'", imports: ['@/lib/command-center'] },
  ]), M)
  assert.equal(r.decision, 'BLOCK')
  assert.ok(r.findings.some((f) => f.class === 'architectureViolation'))
})

test('Layer 4 — touching a protected feature triggers REVIEW', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/lib/auth.ts', changeType: 'modify', addedText: '// tweak' },
  ]), M)
  assert.equal(r.decision, 'REVIEW')
  assert.ok(r.findings.some((f) => f.layer === 'behavior' && f.detail === 'authentication'))
})

test('Layer 2 — a new app root outside the canonical root BLOCKs (duplicate project)', () => {
  const r = evaluateChangeSet(cs([
    { path: 'kolmari-copy/package.json', changeType: 'add', addedText: '{"name":"kolmari"}' },
  ]), M)
  assert.equal(r.decision, 'BLOCK')
  assert.ok(r.findings.some((f) => f.class === 'duplicateAppRoot'))
})

test('Layer 2 — build-output package.json (.open-next) is ignored', () => {
  const r = evaluateChangeSet(cs([
    { path: '.open-next/package.json', changeType: 'add', addedText: '{}' },
  ]), M)
  assert.equal(r.decision, 'ALLOW')
})

test('Layer 6 — editing a protected design component WARNs', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/components/country-template/Sidebar.tsx', changeType: 'modify', addedText: '// restyle' },
  ]), M)
  assert.equal(r.decision, 'WARN')
  assert.ok(r.findings.some((f) => f.class === 'designSystemDrift'))
})

test('Layer 7 — travel-app framing triggers REVIEW', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/components/hero.tsx', changeType: 'add', addedText: 'Book your flight and vacation package today!' },
  ]), M)
  assert.equal(r.decision, 'REVIEW')
  assert.ok(r.findings.some((f) => f.layer === 'intent'))
})

test('priority: BLOCK dominates a mix of findings', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/components/country-template/Sidebar.tsx', changeType: 'modify', addedText: 'DROP TABLE users; // Nexit' },
  ]), M)
  assert.equal(r.decision, 'BLOCK')
  assert.ok(r.summary.BLOCK >= 1)
})

test('aggregateDecision picks the highest severity', () => {
  assert.equal(aggregateDecision([{ decision: 'WARN' }, { decision: 'REVIEW' }, { decision: 'ALLOW' }]), 'REVIEW')
  assert.equal(aggregateDecision([{ decision: 'WARN' }]), 'WARN')
  assert.equal(aggregateDecision([]), 'ALLOW')
})

test('FAIL CLOSED — a malformed change set BLOCKs', () => {
  const r = evaluateChangeSet({ changes: 'not-an-array' }, M)
  assert.equal(r.decision, 'BLOCK')
  assert.equal(r.failedClosed, true)
})

test('FAIL CLOSED — a missing manifest BLOCKs', () => {
  const r = evaluateChangeSet(cs([{ path: 'a.ts', changeType: 'add' }]), null)
  assert.equal(r.decision, 'BLOCK')
  assert.equal(r.failedClosed, true)
})

test('deletions never crash and are analyzed', () => {
  const r = evaluateChangeSet(cs([
    { path: 'src/lib/auth.ts', changeType: 'delete' },
  ]), M)
  assert.ok(r.findings.some((f) => f.layer === 'behavior'))
})
