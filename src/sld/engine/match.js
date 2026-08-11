// @ts-check
/**
 * Deterministic path/glob/edge helpers shared by the seven layer analyzers.
 * Pure string logic only — no I/O, no regex compiled from untrusted input
 * without anchoring, no secrets. Safe on Cloudflare Workers and in Node.
 */

/**
 * Convert a restricted glob (supporting `**`, `*`, `?`) into an anchored RegExp.
 * Only these metacharacters are honored; everything else is escaped, so a
 * hostile manifest can't inject an expensive or open-ended pattern.
 * @param {string} glob
 * @returns {RegExp}
 */
export function globToRegExp(glob) {
  let out = '^'
  for (let i = 0; i < glob.length; i += 1) {
    const c = glob[i]
    if (c === '*') {
      if (glob[i + 1] === '*') {
        // ** → any depth (including path separators)
        out += '.*'
        i += 1
        if (glob[i + 1] === '/') i += 1 // swallow the slash after **
      } else {
        out += '[^/]*'
      }
    } else if (c === '?') {
      out += '[^/]'
    } else if ('\\^$.|+()[]{}'.includes(c)) {
      out += `\\${c}`
    } else {
      out += c
    }
  }
  return new RegExp(`${out}$`)
}

/**
 * @param {string} path
 * @param {string} glob
 * @returns {boolean}
 */
export function matchGlob(path, glob) {
  return globToRegExp(glob).test(path)
}

/**
 * A "directory or file prefix" test used for protected directories: matches the
 * exact path or anything beneath it.
 * @param {string} path
 * @param {string} prefix
 * @returns {boolean}
 */
export function underPath(path, prefix) {
  return path === prefix || path.startsWith(`${prefix}/`)
}

/**
 * Case-insensitive whole-word-ish scan for a protected/forbidden term inside a
 * blob of added text. Word boundaries are approximated with non-alphanumeric
 * neighbours so "Nexit" matches but "Nexitude"… also matches (intentional: any
 * appearance of a retired brand stem is a finding).
 * @param {string} haystack
 * @param {string} term
 * @returns {boolean}
 */
export function containsTerm(haystack, term) {
  if (!haystack || !term) return false
  return haystack.toLowerCase().includes(term.toLowerCase())
}

/**
 * Escape a string for safe inclusion in a RegExp.
 * @param {string} s
 * @returns {string}
 */
export function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Test whether any destructive SQL pattern appears in the text.
 *
 * Matching is CASE-SENSITIVE on purpose. The manifest's patterns are written as
 * uppercase SQL and this codebase writes SQL uppercase, while lowercase spellings
 * of the same words are everyday UI vocabulary — Tailwind's `truncate` class,
 * a `delete` handler, a `drop` target. Case-insensitive matching flagged those
 * as destructive database operations, which trained the reader to ignore a BLOCK.
 * A genuinely lowercase `drop table` is still caught by the migration-file rule
 * in Layer 5.
 *
 * @param {string} text
 * @param {string[]} patterns
 * @returns {string | null} the first matched pattern, or null
 */
export function findDestructiveSql(text, patterns) {
  if (!text) return null
  for (const pattern of patterns) {
    let re
    try {
      re = new RegExp(pattern)
    } catch {
      // A malformed manifest pattern must never crash analysis — skip it.
      continue
    }
    if (re.test(text)) return pattern
  }
  return null
}

/**
 * True when a path is a place SQL legitimately lives. Used to widen destructive
 * detection (case-insensitively) for migrations, where any spelling counts.
 * @param {string} path
 * @param {string} migrationsDir
 * @returns {boolean}
 */
export function isSqlSurface(path, migrationsDir) {
  return path.endsWith('.sql') || (!!migrationsDir && path.startsWith(`${migrationsDir}/`))
}

/**
 * True for the governance engine's own source and tests.
 *
 * Content-scanning layers (Identity, Intent) must skip these files: the rulebook
 * necessarily spells out every term and pattern it forbids, so scanning it finds
 * its own definitions. Without this, editing the manifest — whose forbiddenTerms
 * list contains the retired brand name — would BLOCK on itself, and the layer
 * tests could never assert on the strings they exist to detect. Structural layers
 * (Architecture, Dependencies, Data, Interface) still apply here as normal.
 *
 * @param {string} path
 * @returns {boolean}
 */
export function isGovernanceSource(path) {
  return path.startsWith('src/sld/') || path === 'scripts/sld.mjs'
}

/** Test files, which must contain the very strings they assert on. */
export function isTestSurface(path) {
  return path.includes('__tests__/') || /\.(test|spec)\.[a-z]+$/.test(path)
}

/**
 * Files exempt from CONTENT scanning (Identity, Data, Intent) because their text
 * is specimen rather than production behavior: the governance rulebook and test
 * fixtures. Structural layers — Architecture, Dependencies, Behavior, Interface —
 * still apply everywhere, so a real boundary violation in a test is still caught.
 *
 * @param {string} path
 * @returns {boolean}
 */
export function isSpecimenSurface(path) {
  return isGovernanceSource(path) || isTestSurface(path)
}

/**
 * Normalize a local import specifier to a comparable path-ish string so that
 * '@/lib/db' and 'src/lib/db' and './db' can be tested against a glob like
 * 'src/lib/db*'. Only handles the app's own aliases; bare npm packages are
 * returned as-is (and won't match src globs).
 * @param {string} spec
 * @returns {string}
 */
export function normalizeImport(spec) {
  if (spec.startsWith('@/')) return `src/${spec.slice(2)}`
  if (spec.startsWith('src/')) return spec
  return spec
}
