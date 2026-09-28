# 14 — SLD (Seven Layer Dip) Governance Engine

The SLD engine is Kolmari's **runtime preservation-governance / change-control**
system. It is executable, deterministic application logic — not documentation and
not an LLM prompt. Given a proposed set of file changes, it returns one decision:

```
ALLOW < ALLOW_WITH_WARNING < REVIEW_REQUIRED
      < INSUFFICIENT_EVIDENCE < BLOCK
```

The strictest finding wins. It **fails closed**: any malformed input,
missing manifest, or internal error returns `INSUFFICIENT_EVIDENCE`. There is no LLM in the
decision path, so the same change always yields the same decision.

## The seven layers

| # | Canonical layer | Current deterministic rule families |
|---|-----------------|---------------------------------------|
| 1 | Identity | Protected language, retired terms, relocation framing |
| 2 | Design | Protected components and reusable design primitives |
| 3 | Behavior | Protected interactions and critical features |
| 4 | System | App roots, architecture, routes and structural authority |
| 5 | Logic | Dependency boundaries, scoring and validation rules |
| 6 | Content | Copy, records, data mutation and destructive SQL |
| 7 | Execution | Authorization, scope, verification, content loss and AI-elision integrity |

Architecture, dependencies, data, interface and intent are technical rule
families. They map underneath the canonical seven layers and do not replace the
SLD ontology. `layers/canonical.js` is the executable registry; tests assert
exact conformance to the PRD.

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
npm run sld:check       # exit 2 on BLOCK/insufficient evidence, 1 on review
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
job only on a `BLOCK` or `INSUFFICIENT_EVIDENCE` decision;
`REVIEW_REQUIRED`/`ALLOW_WITH_WARNING` are advisory annotations).

## Scope enforcement (the governing rule)

SLD's first question is not "is this change risky?" but **"was the agent allowed
to make it?"**. Authorization and risk are separate dimensions, and the seven
layers only ever judge the second.

```
USER REQUEST → TASK CONTRACT → SCOPE GATE → SOURCE/ENTITY/STATE/ACTION
  → SEVEN LAYERS → IMPLEMENTATION → POST-CHANGE VERIFICATION → AUDIT
```

**Default deny.** An unspecified change is `BLOCK` — never `ALLOW`,
`ALLOW_WITH_WARNING` or `REVIEW_REQUIRED`. Missing, invalid, ambiguous or
self-approved authority returns `INSUFFICIENT_EVIDENCE`, never permission. A
`harmlessChange` remains a risk classification and is explicitly not
authorization: an unauthorized harmless change still blocks.

- `src/sld/scope/task-contract.js` — the TaskContract: allowed files,
  directories, entities, actions, states, required/forbidden changes,
  propagation rules, grants, and the mandatory preservation invariants
  (`UNCHANGED_UNLESS_AUTHORIZED`, `NO_OPPORTUNISTIC_REFACTORING`, …) that are
  attached to every contract automatically.
- `src/sld/scope/task-compiler.js` — compiles a contract into deterministic scope
  rules. It expands only what the contract literally says; entities resolve
  through the manifest's `entities` registry, and an entity it cannot resolve is
  ambiguity, which blocks rather than widening to "everything".
- `src/sld/scope/scope-gate.js` — runs before all seven layers. Enforces
  file-, entity-, behavior-, UI-region-, state- and action-level authorization, protects SLD's own
  governance surface, and emits the change ledger.

**Levels of authorization.** A file in scope does not put every property of it in
scope. Permission to MODIFY never implies DELETE; RESTYLE never implies REFACTOR.
Deterministic classifiers detect what a hunk actually does (dependency rewire,
restyle, copy change) and block any action the contract did not grant. Content
classifiers skip specimen surfaces — engine source and tests quote these patterns
as data.

**Ledger and verification.** Every evaluation returns a ledger mapping each
change to SOURCE → ENTITY → STATE → ACTION, or recording why it could not be
mapped. `npm run sld:verify` re-runs the gate over the real git diff after
implementation; any change that cannot be traced back to the contract is an
unauthorized change and the task fails.

Contracts are drafts until a distinct human approver records approval. Structured
`requiredChanges` are verified against the added content for their named
artifact; an unmet `mustContain` or `mustMatch` requirement blocks completion.

CLI: `npm run sld:contract` (inspect the active contract) and `npm run sld:verify`
(post-change verification). The API route accepts an optional `taskContract` and
returns the ledger.
