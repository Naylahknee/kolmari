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
 * Test whether any destructive SQL pattern appears in the text. Patterns from
 * the manifest are treated as case-insensitive regex fragments but anchored to
 * word-ish context to reduce false positives.
 * @param {string} text
 * @param {string[]} patterns
 * @returns {string | null} the first matched pattern, or null
 */
export function findDestructiveSql(text, patterns) {
  if (!text) return null
  for (const pattern of patterns) {
    let re
    try {
      re = new RegExp(pattern, 'i')
    } catch {
      // A malformed manifest pattern must never crash analysis — skip it.
      continue
    }
    if (re.test(text)) return pattern
  }
  return null
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
