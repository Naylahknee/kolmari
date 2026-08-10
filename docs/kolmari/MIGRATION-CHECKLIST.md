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
- [x] Complete repository-wide legacy reference classification (`DESIGN-TO-CODE-INVENTORY.md`).
- [x] Run typecheck — passed (0 errors).
- [ ] Run lint — pre-existing errors in country-template tabs (not introduced here).
- [ ] Run tests.
- [x] Run Next.js production build — passed.
- [x] Run OpenNext Cloudflare build — passed.
- [ ] Complete authenticated manual regression checks.

## Bug fixes applied (branch: migration/02-kolmari-terminology)

- [x] Fixed `NAV_EXPLORE` undefined reference in `app-shell.tsx`.
- [x] Fixed broken JSX structure in `SidebarNav` (unclosed fragments, undefined variables).
- [x] Replaced legacy "My Nexit" / "Nexit World" group labels with Kolmari-approved navigation.
- [x] Added approved PLAN group (Pathways, My Plan, Flutter Mode, Documents) to sidebar.
- [x] Added CONNECT group (Kolmari Klub) to sidebar.
- [x] Fixed `NexitWorldBoard` import in `nexitnation/page.tsx` → `KolmariWorldBoard`.
- [x] Fixed broken imports in `KolmariWorldBoard.tsx` (next/link, nextination-board, nexitnation-data).
- [x] Fixed broken import in `DestinationMap.tsx` (nexitnation-data).
- [x] Fixed corrupted href values in `KolmariWorldBoard.tsx` DetailPanel.
- [x] Added missing `BUDGET_COLORS` export to `rings.tsx`.
- [x] Added missing `regionTitle` to Kolmari lexicon.
- [x] Removed unnecessary `'use client'` directive from `KlubHeader`.
- [x] Updated nexitnation page metadata to "Kolmarination | Kolmari".
- [x] Fixed stale `@/components/nexit/` import paths in four pages (resolved to `@/components/kolmari/`).
- [x] Fixed stale `@/lib/nexitnation-data` import path → `@/lib/destinations-data`.

## Acceptance review

- [x] The protected application shell displays Kolmari.
- [x] The sidebar includes Kolmarination, Destinations, Pathways, Kolmari Plan, Flutter Mode, Documents, Kolmari Klub, Cost Calculator, Greenbook, and Settings.
- [x] Existing route paths are retained.
- [x] Existing authentication and profile gates are preserved in code.
- [x] No database migration was attempted.
- [x] CI/build checks confirm the branch compiles (Next.js build passed, tsc passed).
- [ ] Manual inspection confirms desktop and mobile navigation behavior.

## Milestone 2 — Kolmari Klub pilot

- [x] `KlubHeader` server component (no client state).
- [x] `KlubEmptyState` honest state — community features not yet built.
- [x] `KlubTabs` client component with accessible `role="tablist"`, `aria-selected`, `aria-controls`.
- [x] Three tab panels (Chatter, Discover Klubs, My Klubs) with honest empty states.
- [x] Related actions section (Greenbook Insights, Kolmarination).
- [x] No public "Nexit" copy on the page.
- [x] Build passes.
- [x] Typecheck passes.
- [ ] Mobile layout manually verified.
- [ ] Sidebar active state ("Kolmari Klub") manually confirmed.
- [ ] Lint passes (blocked by pre-existing country-template errors on branch).

## Milestone 3 — Legacy copy sweep (branch: migration/02-kolmari-terminology)

### Approved terminology applied (DESIGN.md authority)

| Old copy | New copy | Files |
| --- | --- | --- |
| Your World | Kolmarination | 8+ components and pages |
| My Plan / My Plan title | Kolmari Plan | nexit-plan-workspace, dashboard, KolmariWorldBoard |
| Move Readiness | Kolmari Readiness | checklist, nexit-plan-workspace, CountryOverviewEnhancements |
| Move Timeline | Kolmari Timeline | nexit-plan-workspace, seoContent |
| Progress Tracker | Kolmari Tracker | checklist, login page |
| Build My Move Plan | Build Your Kolmari Plan | 10+ pages and components |
| Open My Plan | Open Kolmari Plan | KolmariWorldBoard |
| Continue your Move Plan | Continue your Kolmari Plan | login page |
| Progress Tracker (login) | Kolmari Tracker | login page |
| Nexit → Kolmari (copy) | Kolmari | auth-form, CountryResearchPage, landing, PassportIndexLink, pathways disclaimer, marketing pages, greenbook source labels |
| Nextinations → Destinations (copy) | Destinations | CompareTab, quiz, landing, countries-browser |
| Nexitnation regions (aria) | Kolmarination regions | NexitnationMapbox |

### Files updated in this milestone

- `src/components/nexit/CountryResearchPage.tsx` — breadcrumb and description copy
- `src/components/nexit/landing-mini-experiences.tsx` — experience name and copy strings
- `src/components/community/klub-header.tsx` — "Your World" → "Kolmarination" in description
- `src/components/nexit/KolmariWorldBoard.tsx` — section label and "Open My Plan" button
- `src/components/nexit/questions-section.tsx` — CTA label
- `src/components/nexit/welcome-actions.tsx` — skip button loading text
- `src/components/nexit/marketing-mobile-nav.tsx` — primary CTA label and condition
- `src/components/nexit/checklist.tsx` — heading and readiness label
- `src/components/nexit/nexit-plan-workspace.tsx` — page title, save button, timeline heading, readiness label
- `src/components/country-workspace/CountryOverviewEnhancements.tsx` — readiness heading, description, aria-label
- `src/components/country-workspace/CountryWorkspace.tsx` — CTA label
- `src/components/country-template/RightRail.tsx` — CTA label
- `src/components/country-template/tabs/MoveThereTab.tsx` — "Open in My Plan" link
- `src/app/(auth)/login/page.tsx` — heading and subtitle
- `src/app/(auth)/signup/page.tsx` — eyebrow and description copy
- `src/app/(marketing)/page.tsx` — 3× CTA labels
- `src/app/(marketing)/[seoSlug]/page.tsx` — 3× CTA labels, "Your World" → "Kolmarination"
- `src/app/(marketing)/quiz/page.tsx` — "Nextinations" → "Destinations" in result copy
- `src/app/(app)/(workspace)/dashboard/page.tsx` — code comments updated
- `src/app/(app)/(workspace)/nexitnation/[region]/page.tsx` — import path fixed
- `src/app/(app)/(workspace)/nextinations/[countrySlug]/v2/[section]/page.tsx` — import path fixed
- `src/app/(app)/(workspace)/countries/[slug]/page.tsx` — import paths fixed
- `src/components/kolmari/landing-mini-experiences.tsx` — copy and experience name
- `src/components/kolmari/auth-form.tsx` — "Nexit" → "Kolmari" in auth prompt
- `src/components/kolmari/NexitnationMapbox.tsx` — aria-label on region sections
- `src/components/kolmari/MapboxMap.tsx` — marker aria-label
- `src/components/kolmari/marketing-logo.tsx` — alt text and aria-label
- `src/components/kolmari/CountryResearchPage.tsx` — "Nexit does not" → "Kolmari does not"
- `src/components/kolmari/PassportIndexLink.tsx` — affiliation notice
- `src/components/kolmari/app-shell.tsx` — sidebar IA comment updated
- `src/components/country-workspace/tabs/CompareTab.tsx` — empty state copy
- `src/lib/greenbook.ts` — `sourceLabel` type and all entry values
- `src/lib/pathways.ts` — research disclaimer
- `src/lib/seoContent.ts` — "Move Timeline" → "Kolmari Timeline" in intro copy
- `src/components/nexit/nexit-world.tsx` — internal comment updated

## Legacy terms intentionally preserved (compatibility)

| Term | Location | Reason |
| --- | --- | --- |
| `kolmari_plans` | DB table | Database field — requires separate DB migration |
| `nexit_session` | Cookie | Auth system — must not be renamed without full auth migration |
| `TOKEN_ISSUER = 'nexit'` | auth-constants.ts | JWT issuer — must not be renamed without full auth migration |
| `NexitPlan` type | kolmari-plan.ts | Internal type used by API + plan pages |
| `NexitReadiness` type | readiness.ts | Internal calculation type |
| `NexitRegion` type | regionData.ts | Internal region type |
| `calculateNexitReadiness` | readiness.ts | Internal function |
| `getNexitPlan` / `saveNexitPlan` | kolmari-plan.ts | Plan API functions |
| `isNexitnationRegion` | destinations-data.ts | Internal guard function |
| `RankedNextination` type | userProfile.ts | Internal ranked country type |
| `NexitnationUserProfile` type | userProfile.ts | Internal profile type |
| `NextinationStatus` type | nextination-board.ts | localStorage board type |
| `SavedNextination` type | nextination-board.ts | localStorage board type |
| `useNextinationBoard` hook | nextination-board.ts | localStorage hook |
| `NEXIT_LEXICON` alias | lexicon.ts | Compatibility alias → KOLMARI_LEXICON |
| `NEXIT_STORY` alias | lexicon.ts | Compatibility alias → KOLMARI_STORY |
| `SaveNextinationButton` | saved-nextinations.tsx | Component name — internal |
| `NexitPlanWorkspace` | nexit-plan-workspace.tsx | Component name — internal |
| Route `/nexit-plan` | app router | Legacy route — redirects in a separate phase |
| Route `/nexitnation` | app router | Legacy route — redirects in a separate phase |
| Route `/nextinations` | app router | Legacy route — redirects in a separate phase |
| `DELETE MY NEXIT ACCOUNT` | deletion-request API | Account deletion confirmation phrase — requires owner decision |
| country-cities.ts comments | lib | Internal dataset notes |

## Next milestone

Milestone 4 — Dashboard visual refinement and Settings page.
