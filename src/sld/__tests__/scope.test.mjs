// @ts-nocheck
/**
 * Scope Gate tests — the strict-authorization contract.
 *
 * The governing question here is never "is this change good?" but "did the agent
 * have permission?". Every test below asserts on permission, not on risk.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  KOLMARI_MANIFEST,
  createTaskContract,
  evaluateChangeSet,
  verifyAgainstContract,
} from '../index.js'

const M = KOLMARI_MANIFEST
const cs = (changes) => ({ label: 'test', changes })
const decide = (changes, contract) => evaluateChangeSet(cs(changes), M, null, undefined, contract)

/** Contract: adjust the Country Hero's mobile height. Nothing else. */
const heroHeightContract = createTaskContract({
  taskId: 'hero-mobile-height',
  instruction: 'Make the country hero shorter on mobile.',
  objective: 'Reduce hero height at mobile breakpoints.',
  allowedEntities: ['Country Hero'],
  allowedActions: ['MODIFY', 'RESTYLE'],
  allowedStates: ['mobileHeight'],
})

// ── 1–3: entity + state scoping ──────────────────────────────────────────────

test('1. authorized change inside the authorized entity and state is ALLOWed', () => {
  const r = decide([{
    path: 'src/components/country-template/CountryHero.tsx',
    changeType: 'modify',
    addedText: '<div className="hero h-[220px] sm:h-[320px]" />',
    states: ['mobileHeight'],
  }], heroHeightContract)
  // Permission granted: no scope finding, and the change is on the ledger.
  // CountryHero is a protected design component, so Layer 6 still raises an
  // advisory WARN — authorization and risk are separate dimensions, and an
  // authorized change is never BLOCKed for being risky-looking.
  assert.ok(!r.findings.some((f) => f.layer === 'scope'))
  assert.notEqual(r.decision, 'BLOCK')
  assert.equal(r.ledger.unauthorized.length, 0)
  assert.equal(r.ledger.authorized[0].entity, 'Country Hero')
})

test('2. same task, agent changes the hero FONT → BLOCK (state not authorized)', () => {
  const r = decide([{
    path: 'src/components/country-template/CountryHero.tsx',
    changeType: 'modify',
    addedText: '<h1 className="font-display text-5xl" />',
    states: ['typography'],
  }], heroHeightContract)
  assert.equal(r.decision, 'BLOCK')
  assert.ok(r.findings.some((f) => f.layer === 'scope' && f.class === 'unauthorizedChange'))
})

test('3. same task, agent changes GLOBAL typography → BLOCK (file out of scope)', () => {
  const r = decide([{
    path: 'src/app/globals.css',
    changeType: 'modify',
    addedText: 'body { font-size: 15px; }',
    states: ['mobileHeight'],
  }], heroHeightContract)
  assert.equal(r.decision, 'BLOCK')
  assert.match(r.ledger.unauthorized[0].reason, /not named by the TaskContract/i)
})

// ── 4–5: fix does not mean redesign ──────────────────────────────────────────

const mapFixContract = createTaskContract({
  taskId: 'fix-map-loading',
  instruction: 'Fix the map failing to load.',
  allowedEntities: ['Your World Map'],
  allowedActions: ['MODIFY'],
})

test('4. fixing map initialization is ALLOWed', () => {
  const r = decide([{
    path: 'src/components/kolmari/world-match-map.tsx',
    changeType: 'modify',
    addedText: 'if (!containerRef.current) return',
  }], mapFixContract)
  assert.equal(r.decision, 'ALLOW')
})

test('5. same task, redesigning map controls → BLOCK (RESTYLE not granted)', () => {
  const r = decide([{
    path: 'src/components/kolmari/world-match-map.tsx',
    changeType: 'modify',
    addedText: '<button className="rounded-full bg-gold px-4" style={{ color: "#fff" }}>Zoom</button>',
  }], mapFixContract)
  assert.equal(r.decision, 'BLOCK')
  assert.match(r.findings[0].message, /RESTYLE/)
})

// ── 6–7: hunk-level authorization ────────────────────────────────────────────

const labelContract = createTaskContract({
  taskId: 'button-label',
  instruction: 'Change the Continue button label to Resume.',
  allowedFiles: ['src/components/kolmari/dashboard/panels.tsx'],
  allowedActions: ['MODIFY'],
  allowedStates: ['continueButtonLabel'],
})

test('6. changing the one authorized label is ALLOWed', () => {
  const r = decide([{
    path: 'src/components/kolmari/dashboard/panels.tsx',
    changeType: 'modify',
    addedText: '{task.cta}',
    states: ['continueButtonLabel'],
  }], labelContract)
  assert.equal(r.decision, 'ALLOW')
})

test('7. same task, changing a DIFFERENT label in the same file → BLOCK', () => {
  const r = decide([{
    path: 'src/components/kolmari/dashboard/panels.tsx',
    changeType: 'modify',
    addedText: '<p>Nothing needs your attention right now</p>',
    states: ['attentionEmptyCopy'],
  }], labelContract)
  assert.equal(r.decision, 'BLOCK')
  assert.match(r.findings[0].message, /unauthorized state/i)
})

// ── 8–9: file and refactor scoping ───────────────────────────────────────────

test('8. contract authorizes one file; agent edits an unrelated file → BLOCK', () => {
  const r = decide([{
    path: 'src/lib/auth.ts',
    changeType: 'modify',
    addedText: '// tidy up',
    states: ['continueButtonLabel'],
  }], labelContract)
  assert.equal(r.decision, 'BLOCK')
})

test('9. contract authorizes a component; unrelated refactor inside it → BLOCK', () => {
  const refactorless = createTaskContract({
    taskId: 'hero-copy',
    instruction: 'Update the hero subtitle.',
    allowedEntities: ['Country Hero'],
    allowedActions: ['MODIFY'],
  })
  const r = decide([{
    path: 'src/components/country-template/CountryHero.tsx',
    changeType: 'modify',
    addedText: "import { memo } from 'react'\nconst Hero = memo(function Hero() {})",
  }], refactorless)
  assert.equal(r.decision, 'BLOCK', 'an import rewire is a REWIRE the contract never granted')
})

// ── 10–11: propagation and out-of-scope discoveries ──────────────────────────

test('10. a genuinely required dependent change is ALLOWed when the contract names it', () => {
  const contract = createTaskContract({
    taskId: 'plan-type-change',
    instruction: 'Add a field to the plan type and update its consumer.',
    allowedFiles: ['src/lib/plan-types.ts', 'src/components/kolmari/plan/OverviewTab.tsx'],
    allowedActions: ['MODIFY', 'REWIRE'],
    propagationRules: [{ from: 'src/lib/plan-types.ts', to: 'src/components/kolmari/plan/OverviewTab.tsx', reason: 'type consumer' }],
  })
  const r = decide([
    { path: 'src/lib/plan-types.ts', changeType: 'modify', addedText: 'export type X = { a: number }' },
    { path: 'src/components/kolmari/plan/OverviewTab.tsx', changeType: 'modify', addedText: 'const a = plan.a' },
  ], contract)
  // Both files are authorized propagation. plan-types.ts belongs to a protected
  // feature so Layer 4 asks for review — again, risk, not permission.
  assert.ok(!r.findings.some((f) => f.layer === 'scope'))
  assert.notEqual(r.decision, 'BLOCK')
  assert.equal(r.ledger.authorized.length, 2)
})

test('11. a useful but unrequested cleanup is BLOCKed, not quietly applied', () => {
  const r = decide([{
    path: 'src/components/country-template/Sidebar.tsx',
    changeType: 'modify',
    addedText: '// dedupe breakpoint logic\nconst BP = 900',
  }], heroHeightContract)
  assert.equal(r.decision, 'BLOCK')
  assert.equal(r.ledger.authorized.length, 0)
})

// ── 12–14: no contract, ambiguity, empty task ────────────────────────────────

test('12. no TaskContract supplied → BLOCK', () => {
  const r = decide([{ path: 'src/lib/dashboard-model.ts', changeType: 'modify', addedText: 'x' }], null)
  assert.equal(r.decision, 'BLOCK')
  assert.ok(r.findings.some((f) => f.class === 'unknownScope'))
})

test('13. ambiguous TaskContract (unresolvable entity) → BLOCK', () => {
  const vague = createTaskContract({
    taskId: 'vague',
    instruction: 'Fix the thing.',
    allowedEntities: ['The Thing'],
    allowedActions: ['MODIFY'],
  })
  const r = decide([{ path: 'src/lib/dashboard-model.ts', changeType: 'modify', addedText: 'x' }], vague)
  assert.equal(r.decision, 'BLOCK')
  assert.ok(r.findings.some((f) => f.class === 'unknownScope'))
})

test('14. empty contract with proposed changes → BLOCK', () => {
  const empty = createTaskContract({ taskId: 'empty', instruction: '' })
  const r = decide([{ path: 'src/lib/db.ts', changeType: 'modify', addedText: 'x' }], empty)
  assert.equal(r.decision, 'BLOCK')
})

test('an empty diff needs no authorization', () => {
  assert.equal(decide([], null).decision, 'ALLOW')
})

// ── Authorization vs risk are separate dimensions ────────────────────────────

test('an UNAUTHORIZED harmless change is BLOCKed', () => {
  const r = decide([{
    path: 'src/components/kolmari/hello.tsx',
    changeType: 'add',
    addedText: 'export const Hello = () => <p>Hi</p>',
  }], heroHeightContract)
  assert.equal(r.decision, 'BLOCK', 'low risk is not permission')
})

test('an AUTHORIZED harmless change is ALLOWed', () => {
  const contract = createTaskContract({
    taskId: 'add-hello',
    instruction: 'Add a Hello component.',
    allowedFiles: ['src/components/kolmari/hello.tsx'],
    allowedActions: ['CREATE'],
  })
  const r = decide([{
    path: 'src/components/kolmari/hello.tsx',
    changeType: 'add',
    addedText: 'export const Hello = () => <p>Hi</p>',
  }], contract)
  assert.equal(r.decision, 'ALLOW')
})

// ── SLD self-protection ──────────────────────────────────────────────────────

test('SLD governance files are BLOCKed during an ordinary feature task', () => {
  const r = decide([{
    path: 'src/sld/layers/layer-5-data.js',
    changeType: 'modify',
    addedText: '// relax the rule',
  }], heroHeightContract)
  assert.equal(r.decision, 'BLOCK')
  assert.match(r.ledger.unauthorized[0].reason, /SLD_ENGINE_MAINTENANCE/)
})

test('SLD governance files are editable under an SLD_ENGINE_MAINTENANCE grant', () => {
  const maintenance = createTaskContract({
    taskId: 'sld-repair',
    instruction: 'Repair the SLD engine.',
    allowedEntities: ['SLD Engine'],
    allowedActions: ['CREATE', 'MODIFY', 'REWIRE'],
    grants: ['SLD_ENGINE_MAINTENANCE'],
  })
  const r = decide([{
    path: 'src/sld/layers/layer-5-data.js',
    changeType: 'modify',
    addedText: '// tighten the rule',
  }], maintenance)
  assert.equal(r.decision, 'ALLOW')
})

// ── Scope precedes the seven layers ──────────────────────────────────────────

test('scope BLOCKs before the seven layers run', () => {
  // Destructive SQL in an unauthorized file: the reported reason must be the
  // missing permission, not the data-layer risk.
  const r = decide([{
    path: 'db/migrations/999.sql',
    changeType: 'add',
    addedText: 'DROP TABLE users;',
  }], heroHeightContract)
  assert.equal(r.decision, 'BLOCK')
  assert.ok(r.findings.every((f) => f.layer === 'scope'))
})

// ── Post-change verification ─────────────────────────────────────────────────

test('post-change verification fails when the diff exceeds the contract', () => {
  const v = verifyAgainstContract(cs([
    { path: 'src/components/country-template/CountryHero.tsx', changeType: 'modify', addedText: 'h-[220px]', states: ['mobileHeight'] },
    { path: 'src/app/globals.css', changeType: 'modify', addedText: 'body{font-size:15px}', states: ['mobileHeight'] },
  ]), M, heroHeightContract)
  assert.equal(v.pass, false)
  assert.equal(v.unauthorizedCount, 1)
  assert.equal(v.ledger.authorized.length, 1)
})

test('post-change verification passes when every hunk maps to the contract', () => {
  const v = verifyAgainstContract(cs([
    { path: 'src/components/country-template/CountryHero.tsx', changeType: 'modify', addedText: 'h-[220px]', states: ['mobileHeight'] },
  ]), M, heroHeightContract)
  assert.equal(v.pass, true)
  assert.equal(v.unauthorizedCount, 0)
})

test('the ledger traces every authorized change to source, entity, state and action', () => {
  const r = decide([{
    path: 'src/components/country-template/CountryHero.tsx',
    changeType: 'modify',
    addedText: 'h-[220px]',
    states: ['mobileHeight'],
  }], heroHeightContract)
  const entry = r.ledger.authorized[0]
  assert.equal(entry.source, 'hero-mobile-height')
  assert.equal(entry.entity, 'Country Hero')
  assert.deepEqual(entry.states, ['mobileHeight'])
  assert.equal(entry.action, 'MODIFY')
})

test('every contract carries the mandatory preservation invariants', () => {
  assert.ok(heroHeightContract.invariants.includes('UNCHANGED_UNLESS_AUTHORIZED'))
  assert.ok(heroHeightContract.invariants.includes('NO_OPPORTUNISTIC_REFACTORING'))
  assert.ok(heroHeightContract.invariants.includes('NO_UNREQUESTED_COPY_CHANGES'))
})

test('action classifiers do not fire on their own source or on test fixtures', () => {
  // The styling detector must not match the string `className=` when it appears
  // inside engine source or a test fixture rather than as real markup.
  const maintenance = createTaskContract({
    taskId: 'sld-repair',
    instruction: 'Repair the SLD engine.',
    allowedEntities: ['SLD Engine'],
    allowedActions: ['CREATE', 'MODIFY'],
    grants: ['SLD_ENGINE_MAINTENANCE'],
  })
  const r = decide([
    { path: 'src/sld/scope/scope-gate.js', changeType: 'modify', addedText: "test: (t) => /className=|style=\\{\\{/.test(t)" },
    { path: 'src/sld/__tests__/scope.test.mjs', changeType: 'modify', addedText: "addedText: '<div className=\"x\" />'" },
  ], maintenance)
  assert.equal(r.decision, 'ALLOW')
  assert.equal(r.ledger.unauthorized.length, 0)
})

test('a RESTYLE in a real UI file is still detected', () => {
  const contract = createTaskContract({
    taskId: 'copy-only',
    instruction: 'Change the hero subtitle text.',
    allowedEntities: ['Country Hero'],
    allowedActions: ['MODIFY'],
  })
  const r = decide([{
    path: 'src/components/country-template/CountryHero.tsx',
    changeType: 'modify',
    addedText: '<div className="bg-navy p-8" />',
  }], contract)
  assert.equal(r.decision, 'BLOCK')
  assert.match(r.findings[0].message, /RESTYLE/)
})
