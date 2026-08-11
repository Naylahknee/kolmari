// @ts-check
/**
 * Layer 5 — Data.
 * Guards the database: destructive SQL against protected tables and any
 * destructive DDL/DML require approval and, by policy, BLOCK. Secret values are
 * never inspected — only SQL text in the diff.
 *
 * @typedef {import('../index.js').ChangeSet} ChangeSet
 * @typedef {import('../index.js').Manifest} Manifest
 * @typedef {import('../index.js').Finding} Finding
 */
import { findDestructiveSql, containsTerm, isSqlSurface, isSpecimenSurface } from '../engine/match.js'

/**
 * @param {ChangeSet} changeSet
 * @param {Manifest} manifest
 * @returns {Finding[]}
 */
export function analyzeData(changeSet, manifest) {
  /** @type {Finding[]} */
  const findings = []
  const patterns = manifest.data.destructivePatterns || []
  const protectedTables = manifest.data.protectedTables || []
  const migrationsDir = manifest.data.migrationsDir || ''

  for (const change of changeSet.changes) {
    if (change.changeType === 'delete') continue
    // Test fixtures and the engine's own source quote SQL as specimen text.
    if (isSpecimenSurface(change.path)) continue
    const text = change.addedText || ''
    if (!text) continue

    // On a real SQL surface any spelling counts; elsewhere only uppercase SQL
    // does, so UI vocabulary ("truncate", "delete") is not mistaken for DDL.
    const onSqlSurface = isSqlSurface(change.path, migrationsDir)
    const matched = onSqlSurface
      ? findDestructiveSql(text.toUpperCase(), patterns)
      : findDestructiveSql(text, patterns)
    if (matched) {
      const touchedProtected = protectedTables.filter((t) => containsTerm(text, t))
      findings.push({
        layer: 'data',
        class: 'destructiveChange',
        decision: manifest.policies.destructiveChange,
        path: change.path,
        message: `Destructive database operation detected (${matched})${
          touchedProtected.length ? ` affecting protected table(s): ${touchedProtected.join(', ')}` : ''
        }. Requires explicit human approval.`,
        detail: matched,
      })
    }
  }

  return findings
}
