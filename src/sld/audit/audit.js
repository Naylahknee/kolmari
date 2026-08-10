// @ts-check
/**
 * Audit-trail entry builder.
 * Produces a compact, secret-free record of a single evaluation. NEVER includes
 * file contents, environment values, tokens, or keys — only paths, layer/class,
 * decision, and human-readable messages that the analyzers already sanitized.
 *
 * @typedef {import('../index.js').ChangeSet} ChangeSet
 * @typedef {import('../index.js').EvaluationResult} EvaluationResult
 * @typedef {import('../index.js').AuditEntry} AuditEntry
 */

/**
 * @param {ChangeSet} changeSet
 * @param {EvaluationResult} result
 * @param {string} at ISO timestamp supplied by the caller (keeps this pure).
 * @returns {AuditEntry}
 */
export function buildAuditEntry(changeSet, result, at) {
  return {
    at,
    label: sanitizeLabel(changeSet.label || `${changeSet.changes.length} file(s)`),
    decision: result.decision,
    counts: result.summary,
    findings: result.findings.map((f) => ({
      layer: f.layer,
      class: f.class,
      decision: f.decision,
      path: f.path,
      message: f.message,
    })),
  }
}

/**
 * Strip anything that looks like a secret from a free-form label. Defensive:
 * labels come from branch names / PR titles which are low-risk, but we redact
 * token-shaped substrings anyway.
 * @param {string} label
 * @returns {string}
 */
function sanitizeLabel(label) {
  return String(label)
    .slice(0, 200)
    // redact long base64/hex-ish runs that could be a leaked key
    .replace(/[A-Za-z0-9_-]{40,}/g, '[redacted]')
    // redact obvious key=value secrets
    .replace(/(secret|token|key|password|api[_-]?key)\s*[:=]\s*\S+/gi, '$1=[redacted]')
}
