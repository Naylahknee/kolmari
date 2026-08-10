# 14 — SLD (Seven Layer Dip) Governance Engine

The SLD engine is Kolmari's **runtime architectural-governance / change-control**
system. It is executable, deterministic application logic — not documentation and
not an LLM prompt. Given a proposed set of file changes, it returns one decision:

```
ALLOW  <  WARN  <  REVIEW  <  BLOCK
```

The highest-severity finding wins. It **fails closed**: any malformed input,
missing manifest, or internal error returns `BLOCK`. There is no LLM in the
decision path, so the same change always yields the same decision.

## The seven layers

| # | Layer        | Guards                                                                 | Analyzer |
|---|--------------|-----------------------------------------------------------------------|----------|
| 1 | Identity     | Protected product language; retired brand terms (e.g. "Nexit")        | `layers/layer-1-identity.js` |
| 2 | Architecture | Single canonical app root — no duplicate/nested Kolmari               | `layers/layer-2-architecture.js` |
| 3 | Dependencies | Forbidden import edges (UI→DB); server-only modules in client code    | `layers/layer-3-dependencies.js` |
| 4 | Behavior     | Protected/critical features (auth, match-scoring, plan, command-center)| `layers/layer-4-behavior.js` |
| 5 | Data         | Destructive DB operations on protected tables                          | `layers/layer-5-data.js` |
| 6 | Interface    | Design-system drift; re-implementing reusable primitives              | `layers/layer-6-interface.js` |
| 7 | Intent       | Relocation-not-travel framing; fabricated-data smells                 | `layers/layer-7-intent.js` |

## Architecture (why it is split)

Cloudflare Workers has no `fs`, `git`, or `child_process`, so the engine is split:

- **Pure core** — `src/sld/` (dependency-free ESM JS, typed via `index.d.ts`).
  Runs identically in Node and in the Workers API route. No I/O, no clock
  (timestamps are passed in), no randomness. This is the whole decision engine.
- **Node scanner** — `src/sld/node/scan.mjs`. Uses `fs` + `git` to build the
  baseline, turn a git diff into a `ChangeSet`, and detect duplicate app roots.
  CLI/CI only; never bundled into the Worker.

`src/sld/package.json` sets `"type": "module"` so Node loads the `.js` core as
ESM; the webpack/Workers build reads it by syntax and is unaffected.

## The manifest

`src/sld/manifest/kolmari.manifest.js` is the machine-readable source of truth:
protected/forbidden terms, canonical root, forbidden dependency edges,
server-only modules, protected tables + destructive SQL patterns, protected
components, protected features, product principles, and the policy map
(finding-class → decision). Edit the manifest to change what SLD governs.

## Security invariants

- The baseline and audit trail store environment variables **by NAME only**
  (e.g. `OPENAI_API_KEY`) — never their values. No file contents, tokens,
  passwords, keys, or connection strings are ever recorded or logged.
- Analysis never executes app code and never mutates app files.
- Manifest globs compile to anchored, metacharacter-escaped RegExp; a hostile
  manifest cannot inject an open-ended or catastrophic pattern.
- The API route validates and size-bounds every field; it loads no baseline
  (no `fs` on Workers) and evaluates fail-closed.

## CLI

```
npm run sld:init        # create .sld/ and write the first baseline.json
npm run sld:baseline    # (re)write baseline.json from the working tree
npm run sld:scan        # summarize the current scan (files, edges, env names, roots)
npm run sld:diff        # list files changed vs origin/main (or HEAD)
npm run sld:analyze     # evaluate the diff and print findings (never exits non-zero)
npm run sld:check       # analyze + exit 2 on BLOCK, 1 on REVIEW (CI gate)
npm run sld:impact -- src/lib/db.ts   # blast radius of changing given files
npm run sld:drift       # compare working tree to the stored baseline
npm run sld:audit       # print recent audit entries
npm run sld:explain     # list finding classes → policies
npm run sld:test        # run the engine unit tests (node:test)
```

`.sld/baseline.json` is committed as the governance reference. `.sld/audit.jsonl`
is git-ignored (runtime, append-only, secret-free).

## API gate

`POST /api/sld/evaluate` (admin + same-origin only) accepts a `ChangeSet`
(`{ label?, changes: [{ path, changeType, addedText?, removedText?, imports? }] }`)
and returns `{ decision, summary, findings, audit, failedClosed }`. It uses the
exact same pure core as the CLI, so CI and the running app agree on every
decision.

## CI

`.github/workflows/sld.yml` runs `sld:test` (blocking) and `sld:check` (fails the
job only on a `BLOCK` decision; `REVIEW`/`WARN` are advisory annotations).
