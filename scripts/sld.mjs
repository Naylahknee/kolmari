#!/usr/bin/env node
// @ts-nocheck
/**
 * Seven Layer Dip (SLD) command-line interface.
 *
 *   node scripts/sld.mjs <command> [options]
 *
 * Commands:
 *   init                 create .sld/ and write the first baseline
 *   baseline             (re)write .sld/baseline.json from the working tree
 *   scan                 print a summary of the current baseline scan
 *   diff [ref]           show files changed vs <ref> (default origin/main, else HEAD)
 *   analyze [ref]        evaluate the diff vs <ref> and print findings (no exit code)
 *   check [ref]          analyze + exit non-zero if decision is REVIEW or BLOCK (CI gate)
 *   impact <path...>     print the blast radius of changing the given files
 *   drift                compare the working tree to the stored baseline
 *   audit [n]            print the last n audit entries (default 20)
 *   explain <class>      explain a finding class and its policy
 *
 * The CLI is the Node half of SLD; it uses git/fs. The pure evaluation core it
 * calls is identical to the one the Cloudflare-Workers API route uses.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync, appendFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  KOLMARI_MANIFEST,
  evaluateChangeSet,
  computeImpact,
  buildAuditEntry,
} from '../src/sld/index.js'
import {
  buildBaseline,
  workingChangeSet,
  diffToChangeSet,
  detectDrift,
} from '../src/sld/node/scan.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SLD_DIR = join(ROOT, '.sld')
const BASELINE_PATH = join(SLD_DIR, 'baseline.json')
const AUDIT_PATH = join(SLD_DIR, 'audit.jsonl')

const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', blue: '\x1b[34m', cyan: '\x1b[36m',
}
const DECISION_COLOR = { ALLOW: C.green, WARN: C.yellow, REVIEW: C.blue, BLOCK: C.red }

function now() {
  return new Date().toISOString()
}
function loadBaseline() {
  if (!existsSync(BASELINE_PATH)) return null
  try {
    return JSON.parse(readFileSync(BASELINE_PATH, 'utf8'))
  } catch {
    return null
  }
}
function saveBaseline(baseline) {
  mkdirSync(SLD_DIR, { recursive: true })
  writeFileSync(BASELINE_PATH, `${JSON.stringify(baseline, null, 2)}\n`)
}
function pickRef() {
  // Prefer origin/main if it resolves, else HEAD.
  return process.argv[3] || 'origin/main'
}
function printFinding(f) {
  const col = DECISION_COLOR[f.decision] || C.reset
  const loc = f.path ? ` ${C.dim}${f.path}${C.reset}` : ''
  console.log(`  ${col}${f.decision.padEnd(6)}${C.reset} ${C.cyan}[${f.layer}/${f.class}]${C.reset}${loc}`)
  console.log(`         ${f.message}`)
}
function printResult(result) {
  const col = DECISION_COLOR[result.decision] || C.reset
  console.log('')
  console.log(`${C.bold}SLD decision:${C.reset} ${col}${C.bold}${result.decision}${C.reset}` +
    (result.failedClosed ? ` ${C.red}(failed closed)${C.reset}` : ''))
  const s = result.summary
  console.log(`${C.dim}  BLOCK ${s.BLOCK}  REVIEW ${s.REVIEW}  WARN ${s.WARN}  ALLOW ${s.ALLOW}${C.reset}`)
  if (result.findings.length) {
    console.log('')
    for (const f of result.findings) printFinding(f)
  } else {
    console.log(`${C.green}  No findings.${C.reset}`)
  }
  console.log('')
}
function recordAudit(changeSet, result) {
  try {
    mkdirSync(SLD_DIR, { recursive: true })
    const entry = buildAuditEntry(changeSet, result, now())
    appendFileSync(AUDIT_PATH, `${JSON.stringify(entry)}\n`)
  } catch (err) {
    console.error(`${C.yellow}Warning: could not write audit entry.${C.reset}`)
  }
}

function cmdInit() {
  mkdirSync(SLD_DIR, { recursive: true })
  const baseline = buildBaseline(ROOT, { name: KOLMARI_MANIFEST.application.name }, KOLMARI_MANIFEST.version, now())
  saveBaseline(baseline)
  console.log(`${C.green}Initialized SLD.${C.reset}`)
  console.log(`  baseline: ${BASELINE_PATH}`)
  console.log(`  files:    ${Object.keys(baseline.files).length}`)
  console.log(`  appRoots: ${baseline.appRoots.join(', ') || '(none)'}`)
  if (baseline.appRoots.length > 1) {
    console.log(`${C.red}  WARNING: multiple application roots detected — duplicate/nested project.${C.reset}`)
  }
}

function cmdBaseline() {
  const baseline = buildBaseline(ROOT, { name: KOLMARI_MANIFEST.application.name }, KOLMARI_MANIFEST.version, now())
  saveBaseline(baseline)
  console.log(`${C.green}Baseline written:${C.reset} ${Object.keys(baseline.files).length} files, ${Object.keys(baseline.edges).length} with edges.`)
}

function cmdScan() {
  const baseline = loadBaseline() || buildBaseline(ROOT, { name: KOLMARI_MANIFEST.application.name }, KOLMARI_MANIFEST.version, now())
  console.log(`${C.bold}SLD scan${C.reset} — ${KOLMARI_MANIFEST.application.name}`)
  console.log(`  files:      ${Object.keys(baseline.files).length}`)
  console.log(`  edges:      ${Object.keys(baseline.edges).length}`)
  console.log(`  env names:  ${baseline.envNames.length ? baseline.envNames.join(', ') : '(none)'}`)
  console.log(`  app roots:  ${baseline.appRoots.join(', ') || '(none)'}`)
}

function cmdDiff() {
  const ref = pickRef()
  const cs = diffToChangeSet(ROOT, ref)
  if (!cs.changes.length) {
    console.log(`${C.dim}No changes vs ${ref}.${C.reset}`)
    return
  }
  console.log(`${C.bold}Changes vs ${ref}:${C.reset}`)
  for (const c of cs.changes) {
    console.log(`  ${c.changeType.padEnd(7)} ${c.path}${c.oldPath ? ` ${C.dim}(from ${c.oldPath})${C.reset}` : ''}`)
  }
}

function cmdAnalyze(exitOnSeverity) {
  const ref = pickRef()
  const cs = diffToChangeSet(ROOT, ref)
  const baseline = loadBaseline()
  const result = evaluateChangeSet(cs, KOLMARI_MANIFEST, baseline, now())
  printResult(result)
  recordAudit(cs, result)
  if (exitOnSeverity && (result.decision === 'REVIEW' || result.decision === 'BLOCK')) {
    process.exitCode = result.decision === 'BLOCK' ? 2 : 1
  }
}

function cmdImpact() {
  const paths = process.argv.slice(3)
  if (!paths.length) {
    console.error('Usage: sld impact <path> [path...]')
    process.exitCode = 1
    return
  }
  const baseline = loadBaseline()
  if (!baseline) {
    console.error(`${C.red}No baseline. Run "npm run sld:init" first.${C.reset}`)
    process.exitCode = 1
    return
  }
  const { files, features } = computeImpact(paths, baseline, KOLMARI_MANIFEST)
  console.log(`${C.bold}Impact of changing:${C.reset} ${paths.join(', ')}`)
  console.log(`${C.cyan}  ${files.length} file(s) in blast radius:${C.reset}`)
  for (const f of files) console.log(`    ${f}`)
  console.log(`${C.cyan}  protected features touched:${C.reset} ${features.length ? features.join(', ') : '(none)'}`)
}

function cmdDrift() {
  const baseline = loadBaseline()
  if (!baseline) {
    console.error(`${C.red}No baseline. Run "npm run sld:init" first.${C.reset}`)
    process.exitCode = 1
    return
  }
  const drift = detectDrift(baseline, ROOT, now())
  console.log(`${C.bold}Drift vs baseline (generated ${baseline.generatedAt}):${C.reset}`)
  console.log(`  ${C.green}added:${C.reset}   ${drift.added.length}`)
  console.log(`  ${C.yellow}changed:${C.reset} ${drift.changed.length}`)
  console.log(`  ${C.red}removed:${C.reset} ${drift.removed.length}`)
  if (drift.appRootDrift) console.log(`${C.red}  App-root drift detected — possible duplicate/nested project.${C.reset}`)
}

function cmdAudit() {
  if (!existsSync(AUDIT_PATH)) {
    console.log(`${C.dim}No audit entries yet.${C.reset}`)
    return
  }
  const n = Number(process.argv[3]) || 20
  const lines = readFileSync(AUDIT_PATH, 'utf8').trim().split('\n').filter(Boolean)
  for (const line of lines.slice(-n)) {
    try {
      const e = JSON.parse(line)
      const col = DECISION_COLOR[e.decision] || C.reset
      console.log(`${C.dim}${e.at}${C.reset}  ${col}${e.decision.padEnd(6)}${C.reset}  ${e.label}  ${C.dim}(B${e.counts.BLOCK} R${e.counts.REVIEW} W${e.counts.WARN} A${e.counts.ALLOW})${C.reset}`)
    } catch {
      // skip malformed line
    }
  }
}

function cmdExplain() {
  const cls = process.argv[3]
  const policies = KOLMARI_MANIFEST.policies
  if (!cls || !(cls in policies)) {
    console.log(`${C.bold}Finding classes and their policies:${C.reset}`)
    for (const [k, v] of Object.entries(policies)) {
      const col = DECISION_COLOR[v] || C.reset
      console.log(`  ${k.padEnd(24)} → ${col}${v}${C.reset}`)
    }
    return
  }
  const col = DECISION_COLOR[policies[cls]] || C.reset
  console.log(`${C.bold}${cls}${C.reset} → ${col}${policies[cls]}${C.reset}`)
}

function main() {
  const cmd = process.argv[2]
  switch (cmd) {
    case 'init': return cmdInit()
    case 'baseline': return cmdBaseline()
    case 'scan': return cmdScan()
    case 'diff': return cmdDiff()
    case 'analyze': return cmdAnalyze(false)
    case 'check': return cmdAnalyze(true)
    case 'impact': return cmdImpact()
    case 'drift': return cmdDrift()
    case 'audit': return cmdAudit()
    case 'explain': return cmdExplain()
    default:
      console.log(`${C.bold}SLD — Seven Layer Dip governance${C.reset}`)
      console.log('Usage: node scripts/sld.mjs <init|baseline|scan|diff|analyze|check|impact|drift|audit|explain>')
      if (cmd) process.exitCode = 1
  }
}

main()
