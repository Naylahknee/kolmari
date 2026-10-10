// @ts-check
/**
 * Seven Layer Dip (SLD) — kolmari entry point.
 *
 * Thin adapter over the vendored canonical core in ./core/ (byte-identical to
 * src/core/ of the Naylahknee/SLD repo at the commit pinned in
 * ./core/.core-version — never edit the core here). Kolmari-specific knowledge
 * lives only in ./manifest/kolmari.manifest.js, which the core reads through
 * the Manifest argument.
 *
 * Everything re-exported from ./core/ is dependency-free and deterministic:
 * no fs, no git, no network, no LLM, no randomness, no clock (timestamps are
 * always passed in). Safe to import from the Cloudflare-Workers API route and
 * from Node.
 *
 * Governance sequence:
 *   TASK CONTRACT → SCOPE GATE → SOURCE/ENTITY/STATE/ACTION → SEVEN LAYERS
 *   → POST-CHANGE VERIFICATION → AUDIT
 */
export * from './core/index.js'
export { KOLMARI_MANIFEST, default as manifest } from './manifest/kolmari.manifest.js'
