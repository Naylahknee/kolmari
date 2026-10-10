#!/usr/bin/env node
/**
 * SLD core drift check.
 *
 * Verifies that src/sld/core/ is still a byte-identical copy of the canonical
 * SLD core at the commit pinned in src/sld/core/.core-version. Any local edit
 * to the vendored core fails loudly: fixes belong in the Naylahknee/SLD repo
 * and get re-vendored, never patched in place.
 *
 *   node scripts/sld-verify-core.mjs              verify only (CI)
 *   node scripts/sld-verify-core.mjs --regenerate rewrite .core-hashes.json
 *                                             from the current tree (sync time)
 */
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CORE = join(ROOT, 'src', 'sld', 'core')
const HASHES_PATH = join(CORE, '.core-hashes.json')
const SKIP = new Set(['.core-hashes.json', '.core-version', 'VENDOR.md'])

function* walk(dir) {
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) yield* walk(p)
    else yield p
  }
}

function sha256File(p) {
  return 'sha256:' + createHash('sha256').update(readFileSync(p)).digest('hex')
}

function currentHashes() {
  const out = {}
  for (const p of walk(CORE)) {
    const rel = relative(CORE, p)
    if (SKIP.has(rel)) continue
    out[rel] = sha256File(p)
  }
  return out
}

const regenerate = process.argv.includes('--regenerate')

if (regenerate) {
  const recorded = JSON.parse(readFileSync(HASHES_PATH, 'utf8'))
  recorded.files = currentHashes()
  writeFileSync(HASHES_PATH, JSON.stringify(recorded, null, 2) + '\n')
  console.log(`Regenerated ${HASHES_PATH}: ${Object.keys(recorded.files).length} files.`)
  process.exit(0)
}

const recorded = JSON.parse(readFileSync(HASHES_PATH, 'utf8'))
const current = currentHashes()
let failures = 0

for (const [rel, hash] of Object.entries(recorded.files)) {
  if (!(rel in current)) {
    console.error(`MISSING vendored core file: ${rel}`)
    failures++
  } else if (current[rel] !== hash) {
    console.error(`DRIFT in vendored core file: ${rel} (does not match canonical)`)
    failures++
  }
}
for (const rel of Object.keys(current)) {
  if (!(rel in recorded.files)) {
    console.error(`UNTRACKED file in vendored core: ${rel}`)
    failures++
  }
}

if (failures > 0) {
  console.error(
    `\nSLD core drift check FAILED (${failures} problem${failures === 1 ? '' : 's>'}). ` +
    'The vendored core must stay byte-identical to the canonical SLD repo at ' +
    `${recorded.core_commit}. Fix the canonical repo and re-vendor; never patch src/sld/core in place.`,
  )
  process.exit(1)
}
console.log(
  `SLD core drift check passed: ${Object.keys(current).length} files identical ` +
  `to canonical ${recorded.core_commit.slice(0, 7)}.`,
)
