// @ts-nocheck
/**
 * Node-only SLD scanner. Uses fs + git; NEVER runs on Cloudflare Workers.
 * Responsibilities:
 *   - discover governed files under the canonical root
 *   - build a deterministic baseline snapshot (hashes, layer tags, import edges,
 *     env-var NAMES, discovered app roots)
 *   - turn a git diff into a ChangeSet the pure core can evaluate
 *   - detect duplicate / nested application roots
 *
 * SECURITY: reads source text to extract structure only. It records env var
 * NAMES (e.g. "OPENAI_API_KEY") but NEVER their values, and never emits file
 * contents, tokens, or keys into the baseline or audit.
 */
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, sep, posix } from 'node:path'

const BASELINE_VERSION = 1

// Directories never governed / scanned.
const IGNORE_DIRS = new Set([
  'node_modules', '.git', '.next', '.open-next', '.claude', '.wrangler',
  'dist', 'build', 'coverage', '.vercel', '.turbo',
])
// Extensions whose text we parse for edges/terms/SQL.
const CODE_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.sql', '.md', '.json'])

/** @param {string} p */
function toPosix(p) {
  return p.split(sep).join(posix.sep)
}

/**
 * Recursively list governed files (relative, posix paths) under a root.
 * @param {string} root absolute repo root
 * @returns {string[]}
 */
export function listFiles(root) {
  /** @type {string[]} */
  const out = []
  /** @param {string} dir */
  const walk = (dir) => {
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const e of entries) {
      if (e.name.startsWith('.') && e.name !== '.sld') {
        // allow dotfiles at root but skip dot-dirs except our own .sld
        if (e.isDirectory()) continue
      }
      if (e.isDirectory()) {
        if (IGNORE_DIRS.has(e.name)) continue
        walk(join(dir, e.name))
      } else if (e.isFile()) {
        out.push(toPosix(relative(root, join(dir, e.name))))
      }
    }
  }
  walk(root)
  return out.sort()
}

/**
 * Tag a file with the layers it participates in (for baseline metadata).
 * @param {string} path posix-relative
 * @returns {string[]}
 */
function tagFile(path) {
  const tags = []
  if (path.startsWith('src/components/')) tags.push('interface')
  if (path.startsWith('src/app/api/')) tags.push('api')
  if (path.startsWith('src/lib/')) tags.push('lib')
  if (path.startsWith('db/') || path.endsWith('.sql')) tags.push('data')
  if (path.startsWith('src/app/') && path.endsWith('page.tsx')) tags.push('page')
  return tags
}

/**
 * Extract local + bare import specifiers from source text (static imports and
 * `import(...)`/`require(...)`). Deterministic regex scan — no code execution.
 * @param {string} text
 * @returns {string[]}
 */
export function extractImports(text) {
  const specs = new Set()
  const patterns = [
    /import\s+(?:[^'"]*?\sfrom\s+)?['"]([^'"]+)['"]/g,
    /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    /export\s+(?:\*|\{[^}]*\})\s+from\s+['"]([^'"]+)['"]/g,
  ]
  for (const re of patterns) {
    let m
    while ((m = re.exec(text))) specs.add(m[1])
  }
  return [...specs]
}

/**
 * True when a file declares `'use client'` in its directive prologue. Read from
 * the file on disk, so it is accurate for modifications where the diff does not
 * include the first line.
 * @param {string} root
 * @param {string} path
 * @returns {boolean | undefined} undefined when the file cannot be read
 */
export function detectClientComponent(root, path) {
  if (!/\.(tsx|jsx|ts|js|mjs)$/.test(path)) return undefined
  try {
    const head = readFileSync(join(root, path), 'utf8').slice(0, 800)
    // Skip leading comments/blank lines, then look for the directive.
    const stripped = head.replace(/^\s*(\/\*[\s\S]*?\*\/|\/\/[^\n]*\n)\s*/g, '')
    return /^['"]use client['"]/.test(stripped.trimStart())
  } catch {
    return undefined
  }
}

/**
 * Extract environment variable NAMES referenced via process.env.X or
 * process.env['X']. Values are never read.
 * @param {string} text
 * @returns {string[]}
 */
export function extractEnvNames(text) {
  const names = new Set()
  const re1 = /process\.env\.([A-Z0-9_]+)/g
  const re2 = /process\.env\[\s*['"]([A-Z0-9_]+)['"]\s*\]/g
  let m
  while ((m = re1.exec(text))) names.add(m[1])
  while ((m = re2.exec(text))) names.add(m[1])
  return [...names]
}

/**
 * Discover application roots: directories containing a package.json with a
 * Next/React app shape. More than one (excluding ignored build dirs) means a
 * duplicate/nested project.
 * @param {string} root
 * @param {string[]} files
 * @returns {string[]}
 */
export function discoverAppRoots(root, files) {
  const roots = []
  for (const f of files) {
    if (!f.endsWith('package.json')) continue
    const dir = f.includes('/') ? f.slice(0, f.lastIndexOf('/')) : '.'
    try {
      const pkg = JSON.parse(readFileSync(join(root, f), 'utf8'))
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) }
      const isApp = 'next' in deps || 'react' in deps
      if (isApp) roots.push(dir)
    } catch {
      // ignore unreadable/invalid package.json
    }
  }
  return [...new Set(roots)].sort()
}

/**
 * Build the full baseline snapshot.
 * @param {string} root absolute repo root
 * @param {{ name: string }} app
 * @param {number} manifestVersion
 * @param {string} at ISO timestamp
 * @returns {import('../index.js').Baseline}
 */
export function buildBaseline(root, app, manifestVersion, at) {
  const files = listFiles(root)
  /** @type {Record<string, {hash:string,size:number,tags:string[]}>} */
  const fileMap = {}
  /** @type {Record<string, string[]>} */
  const edges = {}
  const envNames = new Set()

  for (const f of files) {
    const abs = join(root, f)
    let buf
    try {
      buf = readFileSync(abs)
    } catch {
      continue
    }
    const hash = createHash('sha256').update(buf).digest('hex').slice(0, 16)
    fileMap[f] = { hash, size: buf.length, tags: tagFile(f) }

    const ext = f.slice(f.lastIndexOf('.'))
    if (CODE_EXT.has(ext) && buf.length < 512 * 1024) {
      const text = buf.toString('utf8')
      const imports = extractImports(text).filter((s) => s.startsWith('.') || s.startsWith('@/') || s.startsWith('src/'))
      if (imports.length) edges[f] = imports
      for (const n of extractEnvNames(text)) envNames.add(n)
    }
  }

  return {
    version: BASELINE_VERSION,
    generatedAt: at,
    manifestVersion,
    application: { name: app.name, root: '.' },
    files: fileMap,
    appRoots: discoverAppRoots(root, files),
    edges,
    envNames: [...envNames].sort(),
  }
}

/**
 * Run git and return stdout, or '' on any failure (git absent, not a repo…).
 * @param {string} root
 * @param {string[]} args
 * @returns {string}
 */
function git(root, args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  } catch {
    return ''
  }
}

/**
 * Parse `git diff --name-status` + per-file added/removed text into a ChangeSet.
 * @param {string} root
 * @param {string} baseRef e.g. 'origin/main' or 'HEAD'
 * @returns {import('../index.js').ChangeSet}
 */
export function diffToChangeSet(root, baseRef) {
  const nameStatus = git(root, ['diff', '--name-status', '-M', baseRef, '--']).trim()
  const changes = []
  if (!nameStatus) return { label: `diff ${baseRef}`, changes }

  for (const line of nameStatus.split('\n')) {
    const parts = line.split('\t')
    const status = parts[0]
    let path
    let oldPath
    let changeType
    if (status.startsWith('R')) {
      changeType = 'rename'
      oldPath = toPosix(parts[1])
      path = toPosix(parts[2])
    } else if (status.startsWith('A')) {
      changeType = 'add'
      path = toPosix(parts[1])
    } else if (status.startsWith('D')) {
      changeType = 'delete'
      path = toPosix(parts[1])
    } else {
      changeType = 'modify'
      path = toPosix(parts[1])
    }

    let addedText = ''
    let removedText = ''
    if (changeType !== 'delete') {
      const patch = git(root, ['diff', '-M', baseRef, '--', path])
      for (const l of patch.split('\n')) {
        if (l.startsWith('+') && !l.startsWith('+++')) addedText += `${l.slice(1)}\n`
        else if (l.startsWith('-') && !l.startsWith('---')) removedText += `${l.slice(1)}\n`
      }
    }

    const imports = addedText ? extractImports(addedText).filter((s) => s.startsWith('.') || s.startsWith('@/') || s.startsWith('src/')) : []
    const isClientComponent = changeType === 'delete' ? undefined : detectClientComponent(root, path)
    changes.push({ path, changeType, oldPath, addedText, removedText, imports, isClientComponent })
  }

  return { label: `diff ${baseRef}`, changes }
}

/**
 * Build a ChangeSet from working-tree files (staged + unstaged) vs a ref.
 * Falls back to comparing against HEAD.
 * @param {string} root
 * @param {string} [baseRef]
 * @returns {import('../index.js').ChangeSet}
 */
export function workingChangeSet(root, baseRef = 'HEAD') {
  return diffToChangeSet(root, baseRef)
}

/**
 * Compare a fresh scan against a stored baseline to detect drift (added,
 * removed, or content-changed files).
 * @param {import('../index.js').Baseline} baseline
 * @param {string} root
 * @param {string} at
 * @returns {{ added: string[]; removed: string[]; changed: string[]; appRootDrift: boolean }}
 */
export function detectDrift(baseline, root, at) {
  const current = buildBaseline(root, baseline.application, baseline.manifestVersion, at)
  const prev = baseline.files || {}
  const cur = current.files
  const added = []
  const removed = []
  const changed = []
  for (const f of Object.keys(cur)) {
    if (!prev[f]) added.push(f)
    else if (prev[f].hash !== cur[f].hash) changed.push(f)
  }
  for (const f of Object.keys(prev)) if (!cur[f]) removed.push(f)
  const appRootDrift = current.appRoots.length > 1 || current.appRoots.length !== (baseline.appRoots || []).length
  return { added: added.sort(), removed: removed.sort(), changed: changed.sort(), appRootDrift }
}
