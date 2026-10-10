# Vendored SLD core

This directory is a byte-identical copy of `src/core/` from the canonical SLD
repo (`Naylahknee/SLD`), pinned at the commit recorded in `.core-version`.
Do not edit these files here: fixes belong in the canonical repo, then get
re-vendored. The CI drift check (`node scripts/sld-verify-core.mjs`, run in
`.github/workflows/sld.yml`) fails the build if any vendored file differs from
`.core-hashes.json`.

Kolmari-specific configuration lives OUTSIDE this directory:

- `src/sld/manifest/kolmari.manifest.js` — brand terms, app identity, intent
  phrases, fabricated-data patterns, governance paths, policies, entities.
- `src/sld/index.js` — thin adapter: re-exports the core plus `KOLMARI_MANIFEST`.
- `scripts/sld.mjs` — kolmari's CLI wrapper.

## How to sync a new core version

1. Pick the canonical commit (must be green on `Naylahknee/SLD` main).
2. Copy its `src/core/` over this directory (keep `.core-version`,
   `.core-hashes.json`, and this file).
3. Write the new SHA into `.core-version`.
4. Regenerate `.core-hashes.json`:

```sh
node scripts/sld-verify-core.mjs --regenerate
```

5. Run the full suite: `npm run sld:test`. The core tests run from the vendored
   copy; kolmari's own tests in `src/sld/__tests__/` run against the kolmari
   manifest.
6. Commit with the message naming the synced core commit, e.g.
   `Sync vendored SLD core to Naylahknee/SLD@<sha>`.
