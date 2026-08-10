// @ts-check
/**
 * Canonical Kolmari SLD manifest — the source of truth the Seven Layer Dip
 * engine governs against. Plain ESM JS (no deps) so it runs identically in the
 * Node CLI and, imported through index.d.ts, in the Cloudflare-Workers API route.
 * Never put secret VALUES here — only names/paths/rules.
 *
 * @typedef {import('../index.js').Manifest} Manifest
 */

/** @type {Manifest} */
export const KOLMARI_MANIFEST = {
  version: 1,
  application: {
    name: 'Kolmari',
    description: 'Relocation decision and planning system (not a travel app).',
    framework: 'next',
    runtime: 'cloudflare-workers',
    language: 'typescript',
  },
  // Layer 1 — Identity
  identity: {
    protectedTerms: [
      'Kolmari', 'Kolmarination', 'Destination', 'Kolmari Profile', 'Kolmari Plan',
      'Kolmari Pathways', 'Match Score', 'Kolmari Readiness', 'Kolmari Timeline',
      'Greenbook Insights', 'Community Fit', 'Flutter Mode', 'Kolmari Tracker', 'Kolmari Klub',
    ],
    // Terms that must NOT reappear in the app (retired brand).
    forbiddenTerms: ['Nexit', 'Nexitnation'],
    criticalFeatures: [
      'authentication', 'match-scoring', 'kolmari-plan', 'command-center',
      'profile-wizard', 'pathways', 'food-health-fit',
    ],
  },
  // Layer 2 — Architecture
  architecture: {
    canonicalRoot: '.',
    // A file path is expected to sit under exactly one owner root.
    protectedDirectories: ['src/app/api', 'src/lib/auth.ts', 'src/lib/db.ts', 'db/migrations'],
    // Forbidden import edges expressed as { from: glob, to: glob, reason }.
    forbiddenDependencies: [
      { fromGlob: 'src/components/**', toGlob: 'src/lib/db*', reason: 'UI components must not access the database directly (UI → API/service → data).' },
      { fromGlob: 'src/app/**/page.tsx', toGlob: 'src/lib/db*', reason: 'Pages should read data via server libs/services, not the raw DB client.' },
      { fromGlob: 'src/components/**', toGlob: 'child_process', reason: 'UI must never spawn processes.' },
    ],
    // Server-only modules that must not be imported by client components.
    serverOnlyModules: ['src/lib/db.ts', 'src/lib/command-center.ts', 'src/lib/country-assets.ts'],
    boundaries: ['ui', 'api', 'lib', 'data'],
  },
  // Layer 5 — Data
  data: {
    database: 'neon-postgres',
    orm: 'drizzle',
    protectedTables: ['users', 'kolmari_plans', 'profiles', 'countries'],
    destructiveOperationsRequireApproval: true,
    destructivePatterns: ['DROP TABLE', 'DROP COLUMN', 'TRUNCATE', 'DELETE FROM users', 'ALTER TABLE .* DROP'],
    migrationsDir: 'db/migrations',
  },
  // Layer 6 — Interface
  interface: {
    designSystem: 'tailwind-v4 + @theme tokens (globals.css)',
    protectedComponents: [
      'src/components/country-template/CountryHero.tsx',
      'src/components/country-template/Sidebar.tsx',
      'src/components/kolmari/command-center/board.tsx',
    ],
    // Reusable primitives; re-implementing these inline is design-system drift.
    reuseInsteadOfReimplementing: ['gold-button', 'card-surface', 'ButterflyMark', 'PlusGate'],
  },
  // Layer 4 — Behavior
  behavior: {
    protectedFeatures: [
      { key: 'match-scoring', paths: ['src/lib/userProfile.ts', 'src/lib/readiness.ts'] },
      { key: 'authentication', paths: ['src/lib/auth.ts', 'src/lib/auth-constants.ts', 'src/middleware.ts', 'middleware.ts'] },
      { key: 'kolmari-plan', paths: ['src/lib/kolmari-plan.ts', 'src/lib/plan-types.ts'] },
      { key: 'command-center', paths: ['src/lib/command-center.ts', 'src/lib/command-center-model.ts'] },
      { key: 'data-integrity', paths: ['src/lib/country-data.ts', 'src/lib/food-culture/data.ts'] },
    ],
  },
  // Layer 7 — Intent
  intent: {
    productPrinciples: [
      'Kolmari is a relocation decision/planning system, not a travel-booking app.',
      'Never fabricate Match Scores, readiness, eligibility, legal conclusions, or country statistics — show honest empty states.',
      'Preserve existing auth, DB queries, API contracts, route protection, and Cloudflare Workers compatibility.',
      'Use approved product language; do not reintroduce retired brand terms.',
    ],
  },
  // Policy defaults — deterministic mapping from finding class → decision.
  policies: {
    unknownChange: 'REVIEW',
    destructiveChange: 'BLOCK',
    architectureViolation: 'BLOCK',
    dependencyViolation: 'REVIEW',
    behavioralChange: 'REVIEW',
    protectedFeatureChange: 'REVIEW',
    designSystemDrift: 'WARN',
    forbiddenTerm: 'BLOCK',
    duplicateAppRoot: 'BLOCK',
    harmlessChange: 'ALLOW',
  },
}

export default KOLMARI_MANIFEST
