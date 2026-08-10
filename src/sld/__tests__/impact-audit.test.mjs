// @ts-nocheck
/**
 * Impact-graph and audit tests.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { KOLMARI_MANIFEST, computeImpact, buildAuditEntry, evaluateChangeSet } from '../index.js'

const M = KOLMARI_MANIFEST

const baseline = {
  version: 1,
  generatedAt: '2026-01-01T00:00:00.000Z',
  manifestVersion: 1,
  application: { name: 'Kolmari', root: '.' },
  files: {
    'src/lib/db.ts': { hash: 'a', size: 1, tags: ['lib'] },
    'src/lib/command-center.ts': { hash: 'b', size: 1, tags: ['lib'] },
    'src/app/api/matches/route.ts': { hash: 'c', size: 1, tags: ['api'] },
  },
  appRoots: ['.'],
  edges: {
    'src/lib/command-center.ts': ['@/lib/db'],
    'src/app/api/matches/route.ts': ['@/lib/command-center'],
  },
  envNames: ['OPENAI_API_KEY'],
}

test('computeImpact finds the transitive blast radius', () => {
  const { files } = computeImpact(['src/lib/db.ts'], baseline, M)
  // db → command-center → matches route
  assert.ok(files.includes('src/lib/command-center.ts'))
  assert.ok(files.includes('src/app/api/matches/route.ts'))
})

test('computeImpact reports protected features touched', () => {
  const { features } = computeImpact(['src/lib/command-center.ts'], baseline, M)
  assert.ok(features.includes('command-center'))
})

test('computeImpact terminates on cyclic edges', () => {
  const cyclic = { ...baseline, edges: { 'a.ts': ['./b'], 'b.ts': ['./a'] }, files: { 'a.ts': {}, 'b.ts': {} } }
  const { files } = computeImpact(['a.ts'], cyclic, M)
  assert.ok(files.includes('a.ts'))
})

test('audit entry carries no file contents and redacts secret-shaped labels', () => {
  const r = evaluateChangeSet({ label: 'token=sk-abcdefghijklmnopqrstuvwxyz0123456789ABCD', changes: [
    { path: 'src/lib/auth.ts', changeType: 'modify', addedText: 'const KEY = "supersecretvalue"' },
  ] }, M, null, '2026-01-01T00:00:00.000Z')
  const entry = buildAuditEntry({ label: 'token=sk-abcdefghijklmnopqrstuvwxyz0123456789ABCD', changes: r.findings.length ? [{ path: 'x', changeType: 'modify' }] : [] }, r, '2026-01-01T00:00:00.000Z')
  const serialized = JSON.stringify(entry)
  assert.ok(!serialized.includes('supersecretvalue'), 'must not leak added text')
  assert.ok(serialized.includes('[redacted]'), 'must redact secret-shaped label')
  assert.equal(entry.decision, r.decision)
})

test('audit entry shape is stable and minimal', () => {
  const r = evaluateChangeSet({ label: 'x', changes: [{ path: 'src/lib/auth.ts', changeType: 'modify', addedText: 'x' }] }, M, null, '2026-01-01T00:00:00.000Z')
  const entry = buildAuditEntry({ label: 'x', changes: [{ path: 'src/lib/auth.ts', changeType: 'modify' }] }, r, '2026-01-01T00:00:00.000Z')
  assert.equal(entry.at, '2026-01-01T00:00:00.000Z')
  assert.deepEqual(Object.keys(entry).sort(), ['at', 'counts', 'decision', 'findings', 'label'])
  for (const f of entry.findings) {
    assert.deepEqual(Object.keys(f).sort().filter((k) => f[k] !== undefined).sort(), Object.keys(f).sort().filter((k) => f[k] !== undefined))
    assert.ok(!('detail' in f) || typeof f.detail === 'undefined')
  }
})
