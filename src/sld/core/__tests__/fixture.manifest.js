// @ts-check
/**
 * Test fixture manifest for the SLD core unit tests.
 *
 * This is NOT user documentation (see ../manifest/example.manifest.js for
 * that). It is the executable spec's configuration: every entity, feature,
 * and rule the tests reference must resolve here. If a test needs a new
 * concept, add it here, not in the test.
 *
 * @typedef {import('../index.js').Manifest} Manifest
 */

/** @type {Manifest} */
export const FIXTURE_MANIFEST = {
  version: 1,
  protectedLayers: ['identity', 'design', 'behavior', 'system', 'logic', 'content', 'execution'],
  application: {
    name: 'Fixture Project',
    description: 'A test project exercising every SLD rule.',
    framework: 'next',
    runtime: 'node',
    language: 'typescript',
  },
  identity: {
    protectedTerms: ['Fixture Project', 'Dashboard'],
    forbiddenTerms: ['OldBrand'],
    criticalFeatures: ['authentication', 'checkout'],
  },
  architecture: {
    canonicalRoot: '.',
    rootMarkers: ['(^|/)(package\\.json|next\\.config\\.(js|ts|mjs|cjs))$'],
    protectedDirectories: ['src/app/api', 'src/lib/auth.ts', 'db/migrations'],
    forbiddenDependencies: [
      {
        fromGlob: 'src/components/**',
        toGlob: 'src/lib/db*',
        reason: 'UI components must not access the database directly.',
      },
    ],
    serverOnlyModules: ['src/lib/db.ts', 'src/lib/command-center.ts'],
    boundaries: ['ui', 'api', 'lib', 'data'],
  },
  data: {
    database: 'postgres',
    orm: 'drizzle',
    protectedTables: ['users', 'orders'],
    destructiveOperationsRequireApproval: true,
    destructivePatterns: ['DROP TABLE', 'TRUNCATE', 'DELETE FROM users'],
    migrationsDir: 'db/migrations',
  },
  interface: {
    designSystem: 'test tokens',
    protectedComponents: [
      'src/components/Header.tsx',
      'src/components/country-template/CountryHero.tsx',
      'src/components/country-template/Sidebar.tsx',
    ],
    reuseInsteadOfReimplementing: ['PrimaryButton', 'CardSurface'],
  },
  behavior: {
    protectedFeatures: [
      { key: 'authentication', paths: ['src/lib/auth.ts', 'src/middleware.ts'] },
      { key: 'checkout', paths: ['src/lib/checkout.ts'] },
      { key: 'command-center', paths: ['src/lib/command-center.ts', 'src/lib/command-center-model.ts'] },
    ],
  },
  intent: {
    productPrinciples: ['Never fabricate values; show honest empty states.'],
    reframingPhrases: ['book your flight', 'hotel booking'],
    fabricatedDataPatterns: ['price\\s*[:=]\\s*\\$?\\d+\\.\\d{2}'],
  },
  integrity: {
    magnitudeReviewThreshold: 0.35,
    magnitudeBlockThreshold: 0.6,
    elisionMarkers: [
      '... rest of file unchanged',
      'rest of file unchanged',
      '// unchanged',
      '[... existing code ...]',
    ],
    excludedGlobs: ['**/*.md', '**/*.test.*', '**/*.spec.*', 'package-lock.json', '.sld/**'],
  },
  entities: {
    'Country Hero': ['src/components/country-template/CountryHero.tsx', 'src/components/country-template/**'],
    'Your World Map': ['src/components/world-match-map.tsx'],
    'SLD Engine': ['src/core/**', '.sld/**', 'cli/sld.js'],
    Authentication: ['src/lib/auth.ts', 'src/middleware.ts'],
    'Checkout Flow': ['src/lib/checkout.ts', 'src/components/checkout/**'],
  },
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

export default FIXTURE_MANIFEST
