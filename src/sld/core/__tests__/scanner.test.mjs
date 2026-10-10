// @ts-nocheck
import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { diffToChangeSet } from '../node/scan.mjs'

test('the scanner includes untracked files in the governed change set', () => {
  const root = mkdtempSync(join(tmpdir(), 'sld-scan-'))
  execFileSync('git', ['init', '-q'], { cwd: root })
  execFileSync('git', ['config', 'user.email', 'sld@example.test'], { cwd: root })
  execFileSync('git', ['config', 'user.name', 'SLD Test'], { cwd: root })
  writeFileSync(join(root, 'existing.js'), 'export const existing = true\n')
  execFileSync('git', ['add', 'existing.js'], { cwd: root })
  execFileSync('git', ['commit', '-qm', 'baseline'], { cwd: root })

  writeFileSync(join(root, 'new-file.js'), 'export const governed = true\n')
  const changeSet = diffToChangeSet(root, 'HEAD')
  const change = changeSet.changes.find((candidate) => candidate.path === 'new-file.js')

  assert.ok(change)
  assert.equal(change.changeType, 'add')
  assert.match(change.addedText, /governed = true/)
})
