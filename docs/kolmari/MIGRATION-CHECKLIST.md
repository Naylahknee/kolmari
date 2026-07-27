# Kolmari Migration Checklist

## Milestone 1 — Foundation

- [x] Create migration branch.
- [x] Add centralized Kolmari brand configuration.
- [x] Add centralized product copy configuration.
- [x] Introduce the Kolmari lexicon with temporary legacy aliases.
- [x] Add a canonical Kolmari app-shell boundary.
- [x] Update the protected workspace to use the Kolmari app shell.
- [x] Update sidebar labels to the approved Kolmari navigation.
- [x] Update top-bar branding and page labels.
- [x] Preserve existing routes.
- [x] Avoid database and API migrations.
- [x] Add migration documentation.
- [ ] Complete repository-wide legacy reference classification.
- [ ] Run typecheck.
- [ ] Run lint.
- [ ] Run tests.
- [ ] Run Next.js production build.
- [ ] Run OpenNext Cloudflare build.
- [ ] Complete authenticated manual regression checks.

## Acceptance review

- [x] The protected application shell displays Kolmari.
- [x] The sidebar includes Your World, Destinations, Pathways, My Plan, Flutter Mode, Documents, Kolmari Klub, Cost Calculator, Greenbook, and Settings.
- [x] Existing route paths are retained.
- [x] Existing authentication and profile gates are preserved in code.
- [x] No database migration was attempted.
- [ ] CI/build checks confirm the branch compiles.
- [ ] Manual inspection confirms desktop and mobile navigation behavior.

## Next milestone

After validation, use Kolmari Klub as the pilot HTML-to-React page migration. Do not begin that implementation inside Milestone 1.
