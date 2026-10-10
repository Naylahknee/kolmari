# SLD Manifest

The manifest is the per-project configuration for the SLD governance core.
The core files (`src/core/`) are identical in every project. This file is the
part that changes.

## Minimal setup

1. Copy `src/core/manifest/example.manifest.js` to your project, e.g. `./sld.manifest.js`.
2. Fill in `application.name`, `identity.forbiddenTerms`, `data.protectedTables`,
   and `behavior.protectedFeatures` for your project. The rest has sane defaults.
3. Point the CLI at it: `node cli/sld.js check --manifest ./sld.manifest.js`.

## Sections

| Section | Layer | What it guards |
|---|---|---|
| `application` | — | Project name, description, stack. Used in human-readable messages. |
| `identity` | 1 Identity | `protectedTerms`, `forbiddenTerms` (retired brand names that must never reappear), `criticalFeatures`. |
| `architecture` | 2 System, 3 Logic | `canonicalRoot`, `rootMarkers` (regex sources for app-root files), `protectedDirectories`, `forbiddenDependencies` (`{fromGlob, toGlob, reason}`), `serverOnlyModules`, `boundaries`. |
| `data` | 5 Content | `protectedTables`, `destructivePatterns`, `migrationsDir`. |
| `interface` | 6 Design | `protectedComponents`, `reuseInsteadOfReimplementing`. |
| `behavior` | 4 Behavior | `protectedFeatures` (`{key, paths}`): touching these always asks for human eyes. |
| `intent` | 7 Identity/Logic | `productPrinciples`, `reframingPhrases`, `fabricatedDataPatterns` (regex sources for hard-coded values). |
| `integrity` | 7 Execution | `magnitudeReviewThreshold` (default 0.35), `magnitudeBlockThreshold` (default 0.60), `elisionMarkers`, `excludedGlobs`. |
| `entities` | Scope | Friendly names → file globs, so a TaskContract can authorize "Checkout Flow". |
| `governance` | Scope | Where SLD's own governance surface lives in this project: `paths` (only a SLD_ENGINE_MAINTENANCE contract may touch) and `sourcePaths` (exempt from content scanning). Omit both and the core uses its own repo layout as the default. |
| `policies` | — | Finding class → decision. `contentLoss` and `generationArtifactCorruption` are floors; the execution layer may escalate above them, never below. |

## Decisions

`ALLOW` < `ALLOW_WITH_WARNING` < `REVIEW_REQUIRED` < `INSUFFICIENT_EVIDENCE` < `BLOCK`.
The strictest finding wins. `INSUFFICIENT_EVIDENCE` and `BLOCK` fail CI;
`REVIEW_REQUIRED` is advisory and must be surfaced to a human (the recommended
CI setup posts the report as a PR comment).
