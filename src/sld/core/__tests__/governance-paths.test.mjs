// @ts-nocheck
/**
 * Manifest-driven governance paths.
 *
 * The core must protect the referee's own files without hardcoding any repo
 * layout: manifest.governance.paths (scope protection) and
 * manifest.governance.sourcePaths (content-scan exemption) let each consuming
 * project name its own vendored core location. When the manifest omits them,
 * the core falls back to its own repo layout, so existing behavior is
 * unchanged.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  approveTaskContract,
  createTaskContract,
  evaluateChangeSet,
} from '../index.js'
import { isGovernancePath } from '../scope/task-contract.js'
import { isGovernanceSource, isSpecimenSurface } from '../engine/match.js'
import { FIXTURE_MANIFEST } from './fixture.manifest.js'

const M = FIXTURE_MANIFEST

/** A consuming project that vendors the core at vendor/sld-core/. */
const PROJECT_MANIFEST = {
  ...M,
  entities: {
    ...M.entities,
    'SLD Engine': ['vendor/sld-core/**', '.sld/**'],
  },
  governance: {
    paths: ['vendor/sld-core/', '.sld/', 'scripts/sld-check.mjs'],
    sourcePaths: ['vendor/sld-core/', 'scripts/sld-check.mjs'],
  },
}

const approvedContract = (input) => approveTaskContract(createTaskContract({
  ...input,
  draftedBy: 'test-drafter',
}), {
  approvedBy: 'test-owner',
  implementingActor: 'test-agent',
  approvedAt: '2026-09-11T00:00:00.000Z',
})
const cs = (changes) => ({ label: 'test', changes })
const decide = (changes, contract, manifest = M) =>
  evaluateChangeSet(cs(changes), manifest, null, undefined, contract)

/** Ordinary feature task: touch the Country Hero, nothing else. */
const featureContract = approvedContract({
  taskId: 'feature-x',
  instruction: 'Build feature X.',
  allowedEntities: ['Country Hero'],
  allowedActions: ['MODIFY'],
})

// ── unit level ───────────────────────────────────────────────────────────────

test('isGovernancePath falls back to the core defaults without a governance section', () => {
  assert.equal(isGovernancePath('src/core/layers/layer-1-identity.js', M), true)
  assert.equal(isGovernancePath('cli/sld.js', M), true)
  assert.equal(isGovernancePath('.github/workflows/core-ci.yml', M), true)
  assert.equal(isGovernancePath('src/lib/feature.ts', M), false)
})

test('isGovernancePath honors manifest.governance.paths', () => {
  assert.equal(isGovernancePath('vendor/sld-core/engine/decision-engine.js', PROJECT_MANIFEST), true)
  assert.equal(isGovernancePath('scripts/sld-check.mjs', PROJECT_MANIFEST), true)
  assert.equal(isGovernancePath('.sld/baseline.json', PROJECT_MANIFEST), false) // exempt input, not referee
  // The core's own repo layout is NOT this project's governance surface.
  assert.equal(isGovernancePath('src/core/layers/layer-1-identity.js', PROJECT_MANIFEST), false)
  assert.equal(isGovernancePath('cli/sld.js', PROJECT_MANIFEST), false)
})

test('isGovernanceSource falls back to the core defaults without a governance section', () => {
  assert.equal(isGovernanceSource('src/core/engine/match.js', M), true)
  assert.equal(isGovernanceSource('cli/sld.js', M), true)
  assert.equal(isGovernanceSource('vendor/sld-core/engine/match.js', M), false)
})

test('isGovernanceSource honors manifest.governance.sourcePaths', () => {
  assert.equal(isGovernanceSource('vendor/sld-core/engine/match.js', PROJECT_MANIFEST), true)
  assert.equal(isGovernanceSource('scripts/sld-check.mjs', PROJECT_MANIFEST), true)
  assert.equal(isGovernanceSource('src/core/engine/match.js', PROJECT_MANIFEST), false)
  assert.equal(isSpecimenSurface('vendor/sld-core/manifest.js', PROJECT_MANIFEST), true)
  assert.equal(isSpecimenSurface('src/lib/feature.ts', PROJECT_MANIFEST), false)
})

// ── end to end through the scope gate ────────────────────────────────────────

test('custom governance paths BLOCK during an ordinary feature task', () => {
  const r = decide([{
    path: 'vendor/sld-core/engine/decision-engine.js',
    changeType: 'modify',
    addedText: '// relax the rule',
  }], featureContract, PROJECT_MANIFEST)
  assert.equal(r.decision, 'BLOCK')
  assert.match(r.ledger.unauthorized[0].reason, /SLD_ENGINE_MAINTENANCE/)
})

test('custom governance paths are editable under an SLD_ENGINE_MAINTENANCE grant', () => {
  const maintenance = approvedContract({
    taskId: 'sld-repair',
    instruction: 'Repair the vendored SLD core.',
    allowedEntities: ['SLD Engine'],
    allowedActions: ['MODIFY'],
    grants: ['SLD_ENGINE_MAINTENANCE'],
  })
  const r = decide([{
    path: 'vendor/sld-core/engine/decision-engine.js',
    changeType: 'modify',
    addedText: '// tighten the rule',
  }], maintenance, PROJECT_MANIFEST)
  assert.equal(r.decision, 'ALLOW')
})

test('content scanning skips the vendored core manifest definitions', () => {
  // The vendored manifest quotes the project's own forbidden terms; scanning it
  // as ordinary content would flag its own definitions. Use the maintenance
  // grant so the change is authorized and the content layers actually run.
  const maintenance = approvedContract({
    taskId: 'sld-manifest-tweak',
    instruction: 'Adjust the vendored manifest.',
    allowedEntities: ['SLD Engine'],
    allowedActions: ['MODIFY'],
    grants: ['SLD_ENGINE_MAINTENANCE'],
  })
  const r = decide([{
    path: 'vendor/sld-core/manifest.js',
    changeType: 'modify',
    addedText: "forbiddenTerms: ['OldBrand']",
  }], maintenance, PROJECT_MANIFEST)
  assert.ok(!r.findings.some((f) => f.class === 'forbiddenTerm'),
    'vendored governance sources must be exempt from content scanning')
})
