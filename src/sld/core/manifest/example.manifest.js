// @ts-check
/**
 * Example SLD manifest — the per-project configuration for the Seven Layer Dip
 * governance core.
 *
 * Copy this file to your project (e.g. ./sld.manifest.js), fill in the values
 * for YOUR project, and point the core at it. The core files stay identical
 * across projects; only this file changes.
 *
 * Every section is optional except `policies`. Missing sections disable the
 * rules that read them. When in doubt, start small: forbiddenTerms,
 * protectedTables, and the integrity thresholds below cover the most common
 * AI-edit accidents.
 *
 * @typedef {import('../index.js').Manifest} Manifest
 */

/** @type {Manifest} */
export const EXAMPLE_MANIFEST = {
  version: 1,
  // Which of the seven canonical layers are enforced for this project.
  // Default when omitted: all seven.
  protectedLayers: ['identity', 'design', 'behavior', 'system', 'logic', 'content', 'execution'],
  application: {
    name: 'Example Project',
    description: 'A short plain-language description of what this project is (and is not).',
    framework: 'next',
    runtime: 'cloudflare-workers',
    language: 'typescript',
  },
  // Layer 1 — Identity: the project's name and language.
  identity: {
    // Terms that are part of the product's approved vocabulary.
    protectedTerms: ['Example Project', 'Dashboard'],
    // Retired brand terms that must never reappear.
    forbiddenTerms: ['OldBrand'],
    criticalFeatures: ['authentication', 'checkout'],
  },
  // Layer 2 — Architecture, Layer 3 — Dependencies.
  architecture: {
    canonicalRoot: '.',
    // Regex sources (as strings). A new file matching one of these outside
    // the canonical root looks like a duplicate/nested application.
    rootMarkers: ['(^|/)(package\\.json|next\\.config\\.(js|ts|mjs|cjs))$'],
    protectedDirectories: ['src/app/api', 'src/lib/auth.ts', 'db/migrations'],
    // Import edges that must never exist: { fromGlob, toGlob, reason }.
    forbiddenDependencies: [
      {
        fromGlob: 'src/components/**',
        toGlob: 'src/lib/db*',
        reason: 'UI components must not access the database directly.',
      },
    ],
    // Modules only server code may import. A client component importing one
    // of these is an architecture violation.
    serverOnlyModules: ['src/lib/db.ts'],
    boundaries: ['ui', 'api', 'lib', 'data'],
  },
  // Layer 5 — Data.
  data: {
    database: 'postgres',
    orm: 'drizzle',
    protectedTables: ['users', 'orders'],
    destructiveOperationsRequireApproval: true,
    // Substrings/regex sources matched against added SQL text.
    destructivePatterns: ['DROP TABLE', 'TRUNCATE', 'DELETE FROM users'],
    migrationsDir: 'db/migrations',
  },
  // Layer 6 — Interface.
  interface: {
    designSystem: 'tailwind + shared tokens',
    // Components that may not be modified without human review.
    protectedComponents: ['src/components/Header.tsx'],
    // Reusable primitives: re-declaring one of these in a new file is drift.
    reuseInsteadOfReimplementing: ['PrimaryButton', 'CardSurface'],
  },
  // Layer 4 — Behavior.
  behavior: {
    protectedFeatures: [
      { key: 'authentication', paths: ['src/lib/auth.ts', 'src/middleware.ts'] },
      { key: 'checkout', paths: ['src/lib/checkout.ts'] },
    ],
  },
  // Layer 7 — Intent.
  intent: {
    productPrinciples: [
      'Never fabricate prices, eligibility, or legal conclusions: show honest empty states.',
      'Use approved product language; do not reintroduce retired brand terms.',
    ],
    // Phrases suggesting the product is being reframed into something it is not.
    reframingPhrases: ['book your flight', 'hotel booking'],
    // Regex sources (as strings, case-insensitive) detecting hard-coded values
    // where values must be computed.
    fabricatedDataPatterns: ['price\\s*[:=]\\s*\\$?\\d+\\.\\d{2}'],
  },
  // Layer 7 — Execution: content-loss detection.
  integrity: {
    // Removing this fraction of a file asks for human review...
    magnitudeReviewThreshold: 0.35,
    // ...and this fraction blocks, unless the change was explicitly authorized.
    magnitudeBlockThreshold: 0.6,
    // Phrases suggesting the AI replaced real code with a placeholder.
    elisionMarkers: [
      '... rest of file unchanged',
      'rest of file unchanged',
      '// unchanged',
      '[... existing code ...]',
    ],
    // Paths never measured for content loss.
    excludedGlobs: ['**/*.md', '**/*.test.*', '**/*.spec.*', 'package-lock.json', '.sld/**'],
  },
  // Entity registry: friendly task names → the files that implement them.
  // A TaskContract can authorize "Checkout Flow" without naming files.
  entities: {
    Authentication: ['src/lib/auth.ts', 'src/middleware.ts'],
    'Checkout Flow': ['src/lib/checkout.ts', 'src/components/checkout/**'],
    'SLD Engine': ['src/core/**', '.sld/**'],
  },
  // Where SLD's own governance surface lives in THIS project. The core uses
  // these instead of its built-in defaults (which describe the SLD repo
  // itself), so the referee stays protected wherever it is vendored.
  // Entries ending in '/' are prefix matches, otherwise exact matches.
  governance: {
    // Paths only a contract granting SLD_ENGINE_MAINTENANCE may touch.
    paths: ['src/core/', '.sld/', '.github/workflows/core-ci.yml', 'cli/sld.js'],
    // Paths exempt from content scanning: the rulebook quotes its own
    // forbidden terms, so scanning it would flag its own definitions.
    sourcePaths: ['src/core/', 'cli/sld.js'],
  },
  // Policy defaults: deterministic mapping from finding class → decision.
  // contentLoss and generationArtifactCorruption are FLOORS: the execution
  // layer may escalate above them on magnitude, never below them.
  policies: {
    unauthorizedChange: 'BLOCK',
    unknownScope: 'BLOCK',
    unknownChange: 'INSUFFICIENT_EVIDENCE',
    destructiveChange: 'BLOCK',
    architectureViolation: 'BLOCK',
    dependencyViolation: 'REVIEW_REQUIRED',
    behavioralChange: 'REVIEW_REQUIRED',
    protectedFeatureChange: 'REVIEW_REQUIRED',
    designSystemDrift: 'ALLOW_WITH_WARNING',
    forbiddenTerm: 'BLOCK',
    duplicateAppRoot: 'BLOCK',
    harmlessChange: 'ALLOW',
    invalidContractApproval: 'INSUFFICIENT_EVIDENCE',
    missingRequiredChange: 'BLOCK',
    contentLoss: 'REVIEW_REQUIRED',
    generationArtifactCorruption: 'REVIEW_REQUIRED',
  },
}

export default EXAMPLE_MANIFEST
