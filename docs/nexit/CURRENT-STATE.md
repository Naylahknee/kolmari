# Nexit Current Implementation State

## 2026-07-26 — Interactive Nexit World regions

- The live Nexit World SVG now exposes six labeled, clickable region targets with visible hover and keyboard-focus states.
- Every region routes to the existing canonical `/nexitnation/[region]` page.
- A non-map region grid provides an accessible alternate navigation path.
- All six region pages use the shared continent template and contain editorial starter locations.
- Incomplete profiles see “Popular places to research” without fabricated Match Scores or personalized claims.
- Country cards route only to available country guides; unavailable guides show an honest research-in-progress state.

## 2026-07-26 — Sidebar brand mark visibility

- The butterfly favicon is hidden while the workspace sidebar is expanded.
- The butterfly favicon appears in the sidebar-aligned header zone only when the sidebar is collapsed.

## 2026-07-26 — Nexit Pathways directory redesign

- `PathwaysResults` accepts evaluated Pathway data as a prop from the server-rendered route.
- Strong signals use a responsive one-, two-, and three-column card grid.
- Category filters use one horizontally scrollable, counted, accessible chip row.
- Results are grouped by likely, possible, and unknown fit, with country codes visible on every row.
- Pathway rows use full-width accessible accordion headers and show structured requirements, facts, and official sources.
- The research disclaimer appears once at the end of the page.
- The page retains the Geist interface font and existing Nexit design tokens.

## Last Updated

Phase 8 — 04-LAYOUTS.md implementation: sidebar groups, collapse, saved country tree, URL-addressable country sections, hero pathway summary

---

## Phase 1 Summary (completed)

- Approved brand assets (`NexitWordMark.svg`, `faviconNexit.svg`) integrated
- Global design token system consolidated in `src/app/globals.css`
- App shell rewritten with approved nav labels, sidebar row geometry, and slide-in mobile drawer

---

## Phase 2 Summary (completed)

| File | Change |
|---|---|
| `src/components/nexit/pathways-results.tsx` | Accordion disclosure, page header, top-3 summary cards, category filters, sources footer. Converted to client component. |
| `src/app/(app)/(workspace)/dashboard/page.tsx` | 4-section dashboard template. |
| `src/components/country-workspace/CountryWorkspace.tsx` | Persistent CountryHero, vertical section nav (desktop) + dropdown selector (mobile). |

---

## Phase 3 Summary (completed)

| File | Change |
|---|---|
| `src/app/globals.css` | `card-surface`, `gold-button`, `field` classes use `var()` tokens. |
| `src/components/nexit/saved-nextinations.tsx` | Link fix; CTA copy update. |
| `src/app/(app)/(workspace)/greenbook/page.tsx` | Provenance legend + per-card labels. |
| `src/app/(app)/(workspace)/community/page.tsx` | Honest in-development empty state. |
| `src/components/nexit/documents-manager.tsx` | Page header, privacy notice, empty state. |
| `src/components/nexit/nexit-plan-workspace.tsx` | Planning workspace template. |
| `src/components/nexit/cost-calculator.tsx` | Calculator template, summary-first layout. |

---

## Phase 4 Summary (completed)

Workspace `<h1>` headings in `saved/page.tsx`, `countries-browser.tsx`, `settings-form.tsx`, `checklist.tsx` updated from `font-display text-4xl` to `text-2xl font-bold text-navy sm:text-3xl`. Page labels updated to `text-xs font-bold uppercase tracking-widest`.

---

## Phase 5 Changes

### Source Disclosure — Country Workspace Tabs

**Problem:** Per spec (`08-CONTENT-STANDARDS.md`), every country workspace section must show a "source period, last-verified date, or stale status" that is never hidden behind an accordion.

**Solution:** Added optional `disclosure?: SectionDisclosure` field to each content type. Created a shared `SourceFooter` component. Applied to all nine data tabs.

### New Type

```ts
// src/lib/country-workspace/country-content.ts
export type SectionDisclosure = {
  lastVerified: string   // ISO date
  sourceNote: string     // plain-language source summary
  status: ContentStatus
}
```

### New Component

`src/components/country-workspace/tabs/SourceFooter.tsx` — renders "Last verified: [date] · [sourceNote]" plus a color-coded status badge (`Official source verified` / `Editorially reviewed` / `Placeholder` / `May be out of date`). Returns `null` when `disclosure` is undefined (Research in Progress state).

### Files Changed

| File | Change |
|---|---|
| `src/lib/country-workspace/country-content.ts` | Added `SectionDisclosure` type. Added `disclosure?` field to: `HousingContent`, `EmploymentContent`, `HealthcareContent`, `EducationContent`, `TransportationContent`, `LegalTaxesContent`, `DailyLifeContent`, `FamilyPetsContent`, `CostOfLivingContent`. Added disclosure data to Portugal (9 sections) and Spain (9 sections). |
| `src/components/country-workspace/tabs/SourceFooter.tsx` | New shared component. |
| `src/components/country-workspace/tabs/LegalTaxesTab.tsx` | Added `<SourceFooter />`. |
| `src/components/country-workspace/tabs/HealthcareTab.tsx` | Added `<SourceFooter />`. |
| `src/components/country-workspace/tabs/EmploymentTab.tsx` | Added `<SourceFooter />`. |
| `src/components/country-workspace/tabs/HousingTab.tsx` | Added `<SourceFooter />`. |
| `src/components/country-workspace/tabs/TransportationTab.tsx` | Added `<SourceFooter />`. |
| `src/components/country-workspace/tabs/DailyLifeTab.tsx` | Added `<SourceFooter />`. |
| `src/components/country-workspace/tabs/FamilyPetsTab.tsx` | Added `<SourceFooter />`. |
| `src/components/country-workspace/tabs/EducationTab.tsx` | Added `<SourceFooter />`. |
| `src/components/country-workspace/tabs/CostOfLivingTab.tsx` | Added `<SourceFooter />`. |

### What was NOT changed
- `EconomicProfileTab` — already shows per-metric `source · period · Verified [date]` on each metric card. Section-level SourceFooter not added (would duplicate). Future improvement: add section-level summary with `EconomicProfileContent.disclosure?`.
- `GreenbookTab` — has its own inline disclaimer. Source disclosure treatment is different (community-reported vs verified resource labeling per `08-CONTENT-STANDARDS.md`).
- `ResourcesTab` — already shows `lastChecked` on every individual resource link.
- Greece and Mexico country data — disclosure fields not yet added (data is structurally compatible; will show no footer until added, which is the correct behavior for unlabeled content).

---

## Phase 6 Changes

### Nexitnation Map Accessibility

**Problem:** `NexitnationMapbox` only showed the accessible region grid when the map token was absent or errored. When the map loaded successfully, keyboard-only users and screen reader users had no way to reach regions without using pointer interaction on the map canvas.

**Fix:** Added a `RegionGrid` sub-component (always rendered below the map). When the map loads successfully, an "All regions" heading and the region grid appear below the canvas. When the map fails or token is absent, the existing dark-surface region grid is shown instead.

### Region Workspace — Match Score Fix

**Problem:** Country cards in the region workspace displayed `matches[slug]%` labeled "Regional Nexit Match" for every individual country card in the grid. This used the same regional-level score for every country, implying false per-country precision.

**Fix:** The regional match percentage is already shown accurately in the hero band (`rounded-pill` badge with "Nexit Match X%"). The per-country card display of the same number was removed — it conveyed nothing additional and violated the no-fabrication rule by implying per-country analysis that doesn't exist. Country cards now show a small "Complete your Nexit Profile for personalized match data." prompt only when the profile is incomplete.

### Label Style Consistency

Section labels in `nexitnation/page.tsx` and `nexitnation/[region]/page.tsx` updated from `text-sm font-semibold` to `text-xs font-bold uppercase tracking-widest` to match the established workspace label pattern.

### Files Changed

| File | Change |
|---|---|
| `src/components/nexit/NexitnationMapbox.tsx` | Extracted `RegionGrid` component. Added accessible region list below map canvas when map loads. Fixed no-token/error state copy. Consistent `aria-hidden` on decorative icons. |
| `src/app/(app)/(workspace)/nexitnation/page.tsx` | Label style: `text-sm font-semibold` → `text-xs font-bold uppercase tracking-widest`. |
| `src/app/(app)/(workspace)/nexitnation/[region]/page.tsx` | Removed per-country fabricated match display from country cards. Section label styles updated to `text-xs font-bold uppercase tracking-widest`. |

---

## Canonical Brand Asset Filenames

| Asset | Runtime path | Surface |
|---|---|---|
| Dark-surface wordmark (SVG) | `/brand/NexitWordMark.svg` | Sidebar, drawer, dark headers |
| Light-surface wordmark (PNG) | `/brand/nexit-wordmark-master-light.png` | Auth pages, light cards |
| Favicon (SVG) | `/brand/faviconNexit.svg` | Browser favicon (preferred) |
| Favicon 32px | `/brand/favicon-32.png` | Fallback |
| Favicon 16px | `/brand/favicon-16.png` | Fallback |
| Favicon ICO | `/brand/favicon.ico` | Legacy fallback |
| Apple touch icon | `/brand/app-icon-180.png` | iOS home screen |

---

## Typography Rules (established)

| Context | Font | Size | Weight |
|---|---|---|---|
| Workspace page `<h1>` | Geist Sans | `text-2xl sm:text-3xl` | `font-bold` |
| Workspace section `<h2>` | Geist Sans or Playfair | `text-xl` | `font-bold` or `font-extrabold` |
| Country workspace tab `<h2>` | Playfair (`font-display`) | `text-2xl` | `font-bold` |
| Marketing / hero `<h1>` | Playfair (`font-display`) | `text-4xl+` | `font-extrabold` |
| Auth / welcome `<h1>` | Playfair (`font-display`) | `text-4xl` | `font-bold` |
| Profile wizard step `<h1>` | Playfair (`font-display`) | `text-3xl sm:text-4xl` | `font-bold` |
| Nexitnation map `<h1>` | Playfair (`font-display`) | `text-4xl sm:text-5xl` | `font-bold` |
| Page label (above h1) | Geist Sans | `text-xs uppercase tracking-widest` | `font-bold` |

---

## Routes Preserved

All existing routes unchanged. No new routes. No redirects removed. All 48 pages in build output.

Authentication, database schema, API contracts, Mapbox behavior, and Cloudflare configuration were not modified.

---

## Tests Run (Phase 5 + 6)

| Check | Result |
|---|---|
| TypeScript (via `next build`) | ✅ Pass — 0 errors |
| ESLint (`npm run lint`) | ✅ Pass — 0 errors, 0 warnings |
| Production build (`npm run build`) | ✅ Pass — 48 pages, compiled in 14.1s |

---

## Known Issues / Unresolved

- The `countries/[slug]` route still exists at the legacy URL (e.g. `/countries/portugal`). Both remain for compatibility per the route preservation rule.
- The mobile section dropdown in CountryWorkspace can overlap the hero on very small screens (< 375px). A future pass should anchor the mobile section selector below the hero.
- Greece and Mexico `country-content.ts` sections do not yet have `disclosure` fields. The `SourceFooter` silently omits on those — correct behavior.
- `EconomicProfileContent` has no section-level `disclosure?` field yet (per-metric sources are already shown). This is consistent but can be unified in a future pass.

---

## Phase 7 Summary (completed)

**Audit findings and fix.**

### What was already done (found in audit)

- `EconomicProfileContent` type already had `disclosure?: SectionDisclosure` — no change needed.
- `EconomicProfileTab` already called `<SourceFooter disclosure={content.disclosure} />` — no change needed.
- All five countries (Portugal, Spain, Greece, Estonia, Mexico) already had `disclosure` populated on their `economic` section — no change needed.
- Greece and Mexico already had `disclosure` populated on all non-greenbook sections — no change needed.

### What was broken (found in audit)

**TypeScript build error:** Greece (`greenbook.disclosure`) and Estonia (`greenbook.disclosure`) had orphaned `disclosure` fields inside their `greenbook` objects. `GreenbookSection` does not declare `disclosure?`. This caused a `Type error: Object literal may only specify known properties` failure in the production build.

**Why these were removed, not type-extended:** Per Phase 5 notes and `08-CONTENT-STANDARDS.md`, the Greenbook section has its own inline disclaimer and provenance treatment (community-reported vs verified resource labeling). Adding `disclosure?: SectionDisclosure` to `GreenbookSection` would incorrectly imply a standard source-footer should appear on Greenbook, conflating two different trust patterns. The orphaned fields were removed.

### Files Changed

| File | Change |
|---|---|
| `src/lib/country-workspace/country-content.ts` | Removed `disclosure` from `greece.greenbook` and `estonia.greenbook` (orphaned fields — type error). |

### Tests Run

| Check | Result |
|---|---|
| TypeScript (via `next build`) | ✅ Pass — 0 errors |
| ESLint (`npm run lint`) | ✅ Pass — 0 errors, 0 warnings |
| Production build (`npm run build`) | ✅ Pass — 48 pages, compiled in 13.0s |

---

---

## Phase 8 Summary (completed)

**04-LAYOUTS.md implementation — gaps identified in prior audit, now resolved.**

### Changes

#### `src/components/nexit/app-shell.tsx` (rewritten)

- **Sidebar section groups:** DISCOVER / MY NEXIT / PLANNING labeled sections replace the flat nav list.
- **Collapse toggle:** Desktop sidebar collapses to 60px icon-only strip; preference persisted in `localStorage` (`nexit:sidebar-collapsed`). Collapse state initialized from storage on mount using lazy `useState` initializer (no `useEffect` cascade). Animated with `transition-[width]`.
- **Active item color:** Active nav items now use `bg-gold-soft/25 text-white` (gold-soft tint on navy) per spec, replacing the full `bg-gold text-navy-deep`.
- **Nested saved country tree:** Saved countries from `localStorage` appear as collapsible tree items under "My Nextinations". Each country expands to show all 16 section links. The currently active country auto-expands on mount. Sections link directly to `/nextinations/[slug]/[section]` routes.
- **Canvas padding/max-width:** Desktop canvas padding updated to `px-14 py-10` (56px / 40px). Max-width tightened from 1180px to 960px per spec.
- **Mobile:** Separate mobile layout block (no grid); same drawer and bottom nav behavior preserved.

#### `src/components/nexit/use-saved-nextinations.ts` (new)

Client-only hook that reads saved slugs from `localStorage` and returns matching country objects. Reacts to `storage` events and a custom `nexit:saved-nextinations-changed` event for cross-tab consistency.

#### `src/app/(app)/(workspace)/nextinations/[countrySlug]/page.tsx` (updated)

Now redirects to `/nextinations/[countrySlug]/overview` (with `?source` param preserved). Country sections are no longer client-state-only.

#### `src/app/(app)/(workspace)/nextinations/[countrySlug]/[section]/page.tsx` (new)

URL-addressable country section route. Validates the `section` param against the 16 known tab IDs; falls back to `overview` for unknown values. Passes `initialSection` and `pathwayCount` to `CountryWorkspace`.

#### `src/components/country-workspace/CountryWorkspace.tsx` (updated)

- Accepts `initialSection: CountryTabId` (from URL) and `pathwayCount: number` props.
- Active section is now determined by the URL param, not client state.
- Desktop section nav items are `<Link>` elements pointing to the section URL (no `useState` for active tab).
- Mobile section selector uses `router.push()` to navigate.
- `CountryHero` shows a Pathway count line when `pathwayCount > 0` (real data only, using a `Route` icon).
- "Compare" button in hero links to `/nextinations/[slug]/compare` instead of `/countries`.

### Files Changed

| File | Change |
|---|---|
| `src/components/nexit/app-shell.tsx` | Sidebar groups, collapse toggle, gold-soft active style, nested country tree, canvas padding/max-width |
| `src/components/nexit/use-saved-nextinations.ts` | New — localStorage hook for saved country slugs |
| `src/app/(app)/(workspace)/nextinations/[countrySlug]/page.tsx` | Redirect to `/overview` |
| `src/app/(app)/(workspace)/nextinations/[countrySlug]/[section]/page.tsx` | New — URL-addressable section route |
| `src/components/country-workspace/CountryWorkspace.tsx` | URL-based active section, pathway count in hero, Compare link fix |

### Tests Run

| Check | Result |
|---|---|
| TypeScript (via `next build`) | ✅ Pass — 0 errors |
| ESLint (`npm run lint`) | ✅ Pass — 0 errors, 0 warnings |
| Production build (`npm run build`) | ✅ Pass — 48 pages + new `[section]` route, compiled |

### Remaining known gaps (not in scope for this phase)

- Header height is ~56px effective vs 72px spec — minor, no current user impact.
- `countries/[slug]` legacy page still uses a different UI from the workspace; preserved for compatibility.
- `useSavedNextinations` reads from `localStorage` only — no server-side persistence for saved countries yet.

---

## Phase 9 Summary (completed)

**13-ACCOUNT-ADMINISTRATION.md Part 1 + 04-LAYOUTS.md §17–20 canvas + breadcrumb**

### Changes

#### API routes (new)

| Route | Method | Purpose |
|---|---|---|
| `/api/account/change-password` | POST | Requires current password + new password (min 8 chars); updates hash; revokes session cookie |
| `/api/account/sign-out-all` | POST | Revokes session cookie (stateless JWT; future session-table would invalidate all tokens) |
| `/api/account/data-export` | POST | Returns JSON file with profile, plan, and account email; excludes password hashes |
| `/api/account/deletion-request` | POST | Requires current password + exact typed phrase `DELETE MY NEXIT ACCOUNT`; deletes profile + user rows via cascade; revokes session |

#### `src/components/nexit/privacy-account-page.tsx` (new)

Client component implementing the full Privacy & Account page per `13-ACCOUNT-ADMINISTRATION.md §Page Sections`:

- **Account Information:** Read-only current email; Change Password form (current password required, confirmation field, signs out on success)
- **Change Email:** UI scaffolded with "coming soon" notice (email verification not yet implemented)
- **Security:** Sign Out of All Devices with two-step confirmation
- **Your Data:** Download My Data — triggers `/api/account/data-export` and triggers browser download
- **Danger Zone:** Delete My Account — explains what is deleted, requires current password AND exact phrase `DELETE MY NEXIT ACCOUNT`, permanent and irreversible

#### `src/app/(app)/(workspace)/settings/privacy/page.tsx` (new)

Server component route rendering `PrivacyAccountPage`. Requires auth.

#### `src/components/nexit/settings-form.tsx` (updated)

- Reformatted from minified single-line JSX to readable multi-line component
- Added **Privacy & Account** card at the bottom linking to `/settings/privacy`
- Profile form structure preserved; all existing save behavior preserved

#### `src/components/country-workspace/CountryWorkspace.tsx` (updated)

- **Removed** the `<aside>` desktop vertical section nav (white SECTIONS panel) — sidebar tree handles this per `04-LAYOUTS.md §18`
- **Removed** the personalized/all toggle from the in-page nav (sidebar handles ordering)
- **Removed** `SectionNavItem` component (no longer needed)
- **Added** breadcrumb navigation: `My Nextinations / [Country] / [Section]` per `04-LAYOUTS.md §20`
- **Content** now spans full available width (no `lg:grid-cols-[200px_1fr]` constraint)
- **Mobile** section dropdown preserved; now shows `allTabs` directly

### Files Changed

| File | Change |
|---|---|
| `src/app/api/account/change-password/route.ts` | New — change password API |
| `src/app/api/account/sign-out-all/route.ts` | New — sign out all devices API |
| `src/app/api/account/data-export/route.ts` | New — data export API |
| `src/app/api/account/deletion-request/route.ts` | New — account deletion API |
| `src/components/nexit/privacy-account-page.tsx` | New — Privacy & Account page component |
| `src/app/(app)/(workspace)/settings/privacy/page.tsx` | New — route for Privacy & Account |
| `src/components/nexit/settings-form.tsx` | Updated — reformatted; Privacy & Account link added |
| `src/components/country-workspace/CountryWorkspace.tsx` | Updated — removed SECTIONS aside; added breadcrumb; full-width canvas |

### Tests Run

| Check | Result |
|---|---|
| TypeScript (via `next build`) | ✅ Pass — 0 errors |
| ESLint (`npm run lint`) | ✅ Pass — 0 errors, 0 warnings |
| Production build (`npm run build`) | ✅ Pass — 53 pages, compiled in 11.0s |

### Known limitations / future work

- **Change Email:** UI is scaffolded but shows a "coming soon" notice. Full email change requires a verification flow (send confirmation to new address before replacing). Not yet implemented.
- **Sign Out of All Devices:** Since JWTs are stateless and stored only as cookies, this revokes the current device's cookie. A future session-table implementation would allow true multi-device revocation.
- **Deletion audit record:** The deletion route currently deletes immediately. A formal `account_deletion_audit` table per spec is not yet created (appropriate for a future phase when user volume requires it).

---

## Phase 10 Summary (completed)

**Logo reconnection, canvas width, and mobile nav audit**

### Root cause

The `Wordmark` component pointed to `/brand/nexit-wordmark-master-light.png` for light surfaces (login, signup, mobile top bar). That file **does not exist** in `public/brand/` — only `NexitWordMark.svg` is present. Every `<Wordmark />` call without `dark={true}` was rendering a broken 404 image.

### Fixes

| File | Change |
|---|---|
| `src/components/nexit/wordmark.tsx` | Both surfaces now use `/brand/NexitWordMark.svg`. The `dark` prop is kept for call-site compatibility but no longer changes the source. |
| `src/components/nexit/app-shell.tsx` | Removed `max-w-[960px]` constraint from the main canvas. Canvas now fills the full available width per `04-LAYOUTS.md §17`. Padding set to `px-6 pt-6 pb-[72px] md:px-7` (matches spec `24px 28px 72px`). |
| `src/components/nexit/marketing-mobile-nav.tsx` | Reformatted from minified single-line JSX. Added `NexitWordMark.svg` logo to the mobile menu drawer header. |
| `src/app/(auth)/login/page.tsx` | Reformatted from minified single-line JSX. `<Wordmark>` now correctly renders the SVG on the light card surface. |
| `src/app/(auth)/signup/page.tsx` | Reformatted from minified single-line JSX. `<Wordmark>` now correctly renders the SVG on the light card surface. |

### Logo surface inventory (verified)

| Location | File | Logo used | Status |
|---|---|---|---|
| Desktop sidebar (expanded) | `app-shell.tsx` line 438 | `NexitWordMark.svg` direct `<Image>` | ✅ |
| Mobile drawer | `app-shell.tsx` line 645 | `NexitWordMark.svg` direct `<Image>` | ✅ |
| Mobile top bar | `app-shell.tsx` line 590 | `<Wordmark compact>` → SVG | ✅ fixed |
| Login page | `login/page.tsx` | `<Wordmark>` → SVG | ✅ fixed |
| Signup page | `signup/page.tsx` | `<Wordmark>` → SVG | ✅ fixed |
| Marketing hero | `(marketing)/page.tsx` | `<Wordmark dark>` → SVG | ✅ |
| Marketing footer | `(marketing)/page.tsx` | `<Wordmark dark compact>` → SVG | ✅ |
| SEO pages | `[seoSlug]/page.tsx` | `<Wordmark dark>` → SVG | ✅ |
| Marketing mobile menu | `marketing-mobile-nav.tsx` | `NexitWordMark.svg` direct `<Image>` | ✅ fixed |
| Favicon | `layout.tsx` | `faviconNexit.svg` | ✅ |

### Tests Run

| Check | Result |
|---|---|
| TypeScript (via `next build`) | ✅ Pass — 0 errors |
| ESLint (`npm run lint`) | ✅ Pass — 0 errors, 0 warnings |
| Production build (`npm run build`) | ✅ Pass — 53 pages, compiled in 11.2s |

---

## Phase 11 Summary (completed)

**Nexit World — unified discovery page**

### What changed

The two separate discovery pages (`/nexitnation` Nexitnation Map and `/countries` Nextinations directory) were unified into a single **Nexit World** page at `/nexitnation` with a `Map` / `Countries` view switcher. Selected view is persisted in the URL (`?view=map` or `?view=countries`).

#### `src/app/(app)/(workspace)/nexitnation/page.tsx` (updated)

- Title: `Nexit World | Nexit`
- Tagline: `Explore regions, research countries, and save possible Nextinations.`
- Reads `?view` and `?q` from `searchParams`; passes `initialView` and `initialQuery` to `NexitWorldWorkspace`
- Removed `NexitnationMapLoader` import; removed `NEXIT_LEXICON` import

#### `src/components/nexit/nexit-world.tsx` (new)

Client component `NexitWorldWorkspace` containing:
- **`MapPanel`** — Mapbox canvas with region badge markers; falls back to dark-surface region list when token absent or errored. Badge shows `Nexit Match X%` only when `profileComplete && matchValue !== undefined` (no fabricated scores).
- **`RegionGrid`** — Always-visible accessible region grid below the map; same match-only-when-real guard.
- **`CountriesView`** (imported from `countries-browser`) — Country directory panel; no page header.
- **View switcher** — `role="tablist"` segmented control (`Map` / `Countries`); syncs URL via `router.replace` on switch.

#### `src/components/nexit/countries-browser.tsx` (updated)

Extracted `CountriesView` export (country-directory panel without page header) from the existing `CountriesBrowser` component. `CountriesBrowser` is kept for backward compatibility only (no longer used in any active route).

#### `src/app/(app)/(workspace)/countries/page.tsx` (updated)

Now calls `redirect()` to `/nexitnation?view=countries` (with `?q` forwarded if present). `/countries` route is preserved for backward compatibility; all traffic redirects to the unified page.

#### `src/components/nexit/app-shell.tsx` (updated)

- Removed `Nexitnation` (MapPinned icon) and `Nextinations` (Globe2 icon) from `NAV_DISCOVER`
- Added single `Nexit World` entry pointing to `/nexitnation` (Globe2 icon)
- Removed unused `MapPinned` import from lucide-react
- Mobile bottom nav updated: `Nexitnation` → `Nexit World` (Globe2)
- Header search box now navigates to `/nexitnation?view=countries&q=…` instead of `/countries?q=…`

### Files Changed

| File | Change |
|---|---|
| `src/app/(app)/(workspace)/nexitnation/page.tsx` | Updated — Nexit World page; reads `?view`/`?q`; renders `NexitWorldWorkspace` |
| `src/components/nexit/nexit-world.tsx` | New — `NexitWorldWorkspace`, `MapPanel`, `RegionGrid` |
| `src/components/nexit/countries-browser.tsx` | Updated — `CountriesView` extracted as named export |
| `src/app/(app)/(workspace)/countries/page.tsx` | Updated — redirect to `/nexitnation?view=countries` |
| `src/components/nexit/app-shell.tsx` | Updated — sidebar / mobile nav / search unified to Nexit World |

### Tests Run

| Check | Result |
|---|---|
| TypeScript (via `next build`) | ✅ Pass — 0 errors |
| Production build (`npm run build`) | ✅ Pass — 53 pages, compiled in 13.5s |

### Routes

- `/nexitnation` → Nexit World (Map view by default)
- `/nexitnation?view=map` → Map view
- `/nexitnation?view=countries` → Countries view
- `/nexitnation?view=countries&q=…` → Countries view with pre-filled search
- `/countries` → redirects to `/nexitnation?view=countries` (backward compat preserved)
- `/countries?q=…` → redirects to `/nexitnation?view=countries&q=…`
- `/nexitnation/[region]` → region workspace (unchanged)

### No fabricated data

Region badges and grid rows show `Nexit Match X%` only when `profileComplete === true` and a real calculated match value exists. Users with incomplete profiles see neutral copy (`32 countries`, region name only).

---

## Phase 12 Summary (completed)

**Landing page mini experiences**

### What changed

Three interactive mini experiences added to the landing page — one per existing panel card. Each experience opens in a modal dialog triggered by the panel CTA. No routes, database writes, auth changes, or new design-system tokens were introduced.

#### `src/components/nexit/landing-mini-experiences.tsx` (new)

Single client component file containing:

- **`LandingMiniExperienceResult` type** — typed result object for potential future onboarding handoff (`experience`, `answers`, `teaserTitle`, `teaserItems`, `completedAt`)
- **Experience 1 — Find Your Starting Places** — 4 questions; deterministic regional starter suggestions by `region` + `priority` answer; cautious copy (`You may want to start with:`); no Match Score, no eligibility claims
- **Experience 2 — Explore Your Pathways** — 4 questions; deterministic pathway-category list from `situation` + `ties` + `willingness` answers; required disclosure (`This is a starting point for research, not a legal eligibility determination.`)
- **Experience 3 — Discover Your Nexit Stage** — 4 questions; deterministic three-stage assignment (`Discovery Stage` / `Research Stage` / `Planning Stage`) from `countryInMind` + `idealTimeline` + `obstacle` answers; no percentage or readiness score
- **`ProgressBar`** — accessible `role="progressbar"` with `aria-valuenow/min/max`; gold filled segments; `X of 4` text
- **`QuestionStep`** — options rendered as `role="radio"` buttons with `aria-checked`; navy-filled selected state; `Check` icon inside circular indicator; visible focus ring
- **`TeaserScreen`** — result shown immediately after question 4; no account creation required before this screen; disclosure note shown for Pathways experience
- **`FinalScreen`** — shared across all three experiences; links to `/signup?next=%2Fnexitnation` (existing route); secondary "Continue exploring" closes modal; `Already have an account? Sign in` links to `/login`
- **`MiniExperienceModal`** — `role="dialog" aria-modal="true"`; focus trap with Tab/Shift-Tab; Escape closes; background scroll locked; progress phases: `questions` → `teaser` → `final`; back button navigates all phases; answers preserved in local state while modal is open; `backdrop-blur` overlay
- **`MiniExperienceTrigger`** — drop-in `<button>` replacement for each panel CTA; receives `experience` ID and `label`

#### `src/app/(marketing)/page.tsx` (updated)

- Added `MiniExperienceTrigger` import
- `nexitSteps` entries given `experience` field (`'starting-places'`, `'pathways'`, `'nexit-stage'`)
- Action labels updated: `Choose your Nexitnation` → `Find Your Starting Places`; `Get matched` → `Explore Your Pathways`; `Start Your Nexit` → `Discover Your Nexit Stage`
- Panel CTA `<Link>` replaced with `<MiniExperienceTrigger>` for all three cards; outer page remains a server component (client boundary is inside `MiniExperienceTrigger`)

### What was preserved

- Panel card images, titles, copy, layout, and card geometry — unchanged
- All existing landing-page sections (hero, features bar, testimonial, stats, community, footer) — unchanged
- `/signup?next=%2Fnexitnation` and `/login` routes — unchanged (no duplicate routes created)
- Auth, database, API contracts, session handling — unchanged
- Design system tokens — no new tokens added

### Data integrity

- No Match Scores displayed
- No eligibility or legal conclusions
- No fabricated country statistics
- Teaser results are deterministic based on user-selected answers
- All country suggestions use cautious language (`commonly researched for`, `often explored for`, `worth comparing for`)
- Answers held in component state only; not written to localStorage or database

### Files Changed

| File | Change |
|---|---|
| `src/components/nexit/landing-mini-experiences.tsx` | New — all three mini experiences, modal shell, progress bar, teaser screens, final screen |
| `src/app/(marketing)/page.tsx` | Updated — panel CTAs wired to `MiniExperienceTrigger` |

### Tests Run

| Check | Result |
|---|---|
| TypeScript (via `next build`) | ✅ Pass — 0 errors |
| Production build (`npm run build`) | ✅ Pass — 53 pages, compiled in 15.8s |

---

## Country Page Template (v2) — install + build fixes

**Installed the approved `index.html` country-page mockup as the `v2` template** via
`install-nexit-template.py` (26 files under `src/`), then repaired the converter
artifacts so `npm run lint` and `npm run build` pass.

### Install

- Ran `python3 install-nexit-template.py`. It added the `v2` route tree
  (`nextinations/[countrySlug]/v2/…`), the `country-template` frame + tabs
  components, `lib/country-template/*`, and `styles/country-template.css`, and
  rewrote `nextinations/page.tsx` with the `NEXT_PUBLIC_COUNTRY_TEMPLATE` gate.
- **`NEXT_PUBLIC_COUNTRY_TEMPLATE` was deliberately left unset**, so the wizard
  still lands users on the existing sixteen-tab workspace. The v2 template is
  installed dormant and reachable only at `/nextinations/[slug]/v2/overview`.

### Fixes applied to the installed template

| Area | Fix |
|---|---|
| Parse errors (7 tabs) | Removed a stray trailing `{/* ══════ … ══════ */}` JSX comment left between the closing `</div>` and `)` in each tab (`Overview`, `MoveThere`, `CostHousing`, `WorkStudy`, `Healthcare`, `Lifestyle`, `FamilySchools`). |
| `react/no-unescaped-entities` (6 tabs) | Escaped 31 literal `'`/`"` characters in prose to `&apos;`/`&quot;`. |
| `@next/next/no-html-link-for-pages` | Converted internal `<a href="/…">` to `<Link>` in `Sidebar`, `RightRail`, `TopBar`, `OverviewTab`, `MoveThereTab`, `CostHousingTab`. |
| `TopBar` units control | Replaced the hardcoded units block (which called an undefined `setUnit`) with the imported `<UnitsControl />` island (already inside `UnitsProvider`). |
| Zero-JS server tabs | Removed dangling event handlers (`onClick`/`onChange`/`onInput`/`onError`) that referenced undefined functions (`go`, `setHousehold`, `setTaxReg`, `setTaxMode`, `renderEntry`, `calcTax`) — the tabs are server components with no JS per the template README, so the mockup's inline handlers were non-functional. |
| JSX attribute type | `HealthcareTab`: `colSpan="4"` → `colSpan={4}`. |

The `.backup` file the installer created was removed (original is preserved in git
history), and `package-lock.json` was left untouched.

### Tests Run

| Check | Result |
|---|---|
| ESLint (`npm run lint`) | ✅ Pass — 0 errors (31 pre-existing style warnings remain) |
| Production build (`npm run build`) | ✅ Pass — 54 pages generated |

### Known follow-ups (from the template README, not yet done)

- Tab markup is still verbatim Portugal copy; bind to `content.*` per section.
- Interactive controls (household/tax toggles, cross-tab jump chips, passport
  entry selector) are now static — rewire as client islands when those sections
  become dynamic.
- `NEXT_PUBLIC_MAPBOX_TOKEN` and the brand PNGs referenced by the template still
  need to be provided before switching users onto v2.

---

## Next Recommended Implementation Phase

**Phase 13 — Greenbook disclosure pattern + adaptive section ordering**

1. Review `GreenbookTab` inline provenance legend completeness.
2. Consider `CompareTab` source disclosure.
3. Adaptive section ordering (06-ADAPTIVE-WORKSPACE.md) — rank-country-sections lib and sidebar PersonalizedOrder toggle.

---

## Country Overview — per-country facts (data-integrity fix)

The merged Country Overview dashboard displayed **Portugal's reference facts for
every country**: the Country Snapshot grid showed real values only for Portugal
(others "Researching"), and the climate cards (`16°C / 28°C / -5 hrs`) plus the
hero membership badges (`Schengen · EU · NATO`) were hardcoded and therefore
shown, incorrectly, for Spain, Greece, Estonia, and **Mexico** (which is not in
Schengen, the EU, or NATO). That violated the no-fabricated-statistics rule.

**Fix:** new `src/lib/country-workspace/country-facts.ts` provides
`getCountryFacts(slug)` with real public reference facts (capital, population,
currency, official language, government, time zone, driving side, Schengen, EU,
climate) plus per-country climate averages and a source disclosure for all five
workspace countries. The Overview snapshot grid, climate cards, and the hero
membership badges now read from it. Countries without a facts dataset fall back
to an honest "Researching" state, and membership badges render only when true.

### Files Changed

| File | Change |
|---|---|
| `src/lib/country-workspace/country-facts.ts` | New — `getCountryFacts(slug)` + per-country snapshot/climate reference data with source disclosure |
| `src/components/country-workspace/CountryWorkspace.tsx` | Snapshot `factRows`, climate cards, and hero membership badges now derive from `getCountryFacts` instead of hardcoded Portugal values |

### Tests Run

| Check | Result |
|---|---|
| TypeScript (`tsc --noEmit`) | ✅ Pass |
| Production build (`next build`) | ✅ Pass |
## Nexit World interactive map and country panels

The active Nexit World workspace renders the existing Mapbox GL map rather
than the static SVG substitute. Clicking a region badge opens that continent
page. The region controls below the map provide the same routes for keyboard
and screen-reader users.

Every continent page uses a country-specific silhouette in each country card.
The shapes come from the repository's Natural Earth boundary data. Mauritius
uses a simplified local outline because it is below the 1:110m dataset's
minimum feature size. Country cards no longer repeat continent hero artwork.
## Expanded Nexit World discovery

- Mapbox region labels remain hidden until pointer hover or keyboard focus.
- Nexit World has a collapsible continent list in the application sidebar.
- Browse-by-region cards use their continent artwork as a background.
- The 30 requested expat research countries are listed on their continent
  pages and open country research pages without being automatically saved to
  My Nextinations.
- Country cards use flag images and country-specific boundary silhouettes.
- Countries without verified detailed datasets display an explicit research
  starting point rather than copied Portugal content or invented facts.
## Mobile workspace optimization

At widths of 900px and below, the shared workspace navigation is now an
off-canvas drawer instead of a narrow fixed rail that pushes the page off
screen. The header menu button opens it, the backdrop and navigation links
close it, and the page always retains the full viewport width.

Country workspaces now stack the hero metrics, primary content, and right rail
at phone widths. Tabs remain horizontally scrollable, card headings wrap, and
mobile page padding is reduced without changing desktop layouts.

## Sidebar restored on all country research pages

Country research pages for discoverable Nextinations (every country except
Portugal, e.g. Japan at `/nextinations/japan/v2/overview`) previously rendered
without the workspace sidebar. `WorkspaceShell` intentionally omits its own
chrome for `/nextinations/[slug]/v2` routes because the full `CountryTemplate`
supplies its own top bar and sidebar, but the lighter `CountryResearchPage`
supplied none, so those pages appeared with no navigation menu.

A new `CountryResearchShell` client component now wraps `CountryResearchPage`
in the same `country-template-root` frame (top bar + collapsible sidebar) used
by `CountryTemplate`. Every country research workspace page now shows the
sidebar menu at all breakpoints.

| File | Change |
|---|---|
| `src/components/country-template/CountryResearchShell.tsx` | New client shell providing the top bar and sidebar chrome for research pages |
| `src/app/(app)/(workspace)/nextinations/[countrySlug]/v2/[section]/page.tsx` | Wrap `CountryResearchPage` in `CountryResearchShell` |

### Tests Run

| Check | Result |
|---|---|
| TypeScript (`tsc --noEmit`) | ✅ Pass |
| Lint (`eslint`) | ✅ No new errors (36 pre-existing errors unchanged) |
| Production build (`next build`) | ✅ Pass |

## Country card artwork matches the Portugal Nextination hero

Region pages (`/nexitnation/[region]`) previously rendered each country card
image as a bold solid-gold silhouette with a plain "{city} · {code}" pill.
`CountryShapePanel` now mirrors the Portugal country page hero style: a warm
navy-to-earth wash, the faint diamond-grid brand pattern, a low-opacity white
country silhouette, and a gold butterfly location pin (navy teardrop, gold
edge, gold glow, butterfly mark) sitting on the shape's centre.

The pin's primary label is the featured city (gold); the sub-label is the
country name (muted), **not** "Capital". The Portugal hero can say "Capital"
because Lisbon is the capital, but region cards feature cities that are not
always the national capital (e.g. Barcelona), so asserting capital status
would fabricate a country fact. The country-name sub-label keeps the same
two-line visual treatment while staying truthful.

| File | Change |
|---|---|
| `src/components/nexit/CountryShapePanel.tsx` | Rebuilt card artwork to match the Portugal hero (warm wash, brand pattern, faint outline, gold butterfly capital pin, city/country label) |

### Tests Run

| Check | Result |
|---|---|
| TypeScript (`tsc --noEmit`) | ✅ Pass |
| Lint (`eslint` on changed file) | ✅ Pass |
| Production build (`next build`) | ✅ Pass |
| Visual check (headless Chromium render of 8 countries) | ✅ Matches Portugal hero style |

## Country research shell layout fix and capital-accurate card pins

Two follow-ups to the sidebar and country-card work:

**Research page layout.** `CountryResearchShell` originally wrapped the
Tailwind-based `CountryResearchPage` in the `country-template-root` frame,
whose global CSS reset (`* { margin: 0; padding: 0 }`) and scoped image rules
clobbered the page's spacing (overlapping flag/title, collapsed hero, cramped
cards). The shell now renders the shared workspace chrome instead — the same
top bar, collapsible sidebar, and `.main.workspace-main` container that
Dashboard, Pathways, and every other Tailwind workspace page use — so the
research page keeps the sidebar while its own layout renders correctly.

**Capital-accurate card pins.** `CountryShapePanel` pins now mark each
country's national capital instead of the shape centroid. `generate-country-shapes.mjs`
gained a capitals table and now emits `src/lib/country-capitals.ts`, projecting
each capital's WGS84 lat/lng through the *same* per-country fit transform as the
silhouette, so the pin always lands on the drawn shape. The pin label shows the
capital and country; the card body still shows the featured research city
(which is often not the capital, e.g. Barcelona, Fukuoka, Melbourne). Countries
without capital data fall back to the shape centre and the featured city.

| File | Change |
|---|---|
| `src/components/country-template/CountryResearchShell.tsx` | Use shared workspace chrome instead of `country-template-root` |
| `scripts/generate-country-shapes.mjs` | Add capitals table; emit projected `country-capitals.ts` alongside shapes |
| `src/lib/country-capitals.ts` | Generated capital name + projected (x, y) per country |
| `src/components/nexit/CountryShapePanel.tsx` | Pin on the capital, labelled capital + country |

### Tests Run

| Check | Result |
|---|---|
| TypeScript (`tsc --noEmit`) | ✅ Pass |
| Lint (`eslint` on changed files) | ✅ Pass |
| Production build (`next build`) | ✅ Pass |
| Visual check (headless Chromium, 12 countries) | ✅ Pins land on capitals, on-shape |

## Country research pages use the shared workspace chrome (final)

Superseding the `CountryResearchShell` note above: that bespoke shell has been
removed. Discoverable country research pages now render through the same
`NewWorkspaceChrome` path in `WorkspaceShell` that Dashboard, Pathways, and
every other Tailwind workspace page use — the proven chrome that keeps the
sidebar and renders the page's Tailwind layout correctly.

`WorkspaceShell` previously bypassed its chrome for *all* `/nextinations/[slug]/v2`
routes, assuming each page brought its own (true only for `CountryTemplate`
pages such as Portugal). It now uses the shared `usesResearchPage(slug)` helper
to pass through only genuine `CountryTemplate` routes and wrap research pages in
the standard chrome. The v2 page renders `CountryResearchPage` bare again, as it
did originally, so its layout is intact.

| File | Change |
|---|---|
| `src/lib/countries.ts` | Add `usesResearchPage(slug)` — shared source of truth for which chrome wraps a country route |
| `src/components/nexit/workspace-shell.tsx` | Pass through only CountryTemplate routes; wrap research pages in the shared workspace chrome |
| `src/app/(app)/(workspace)/nextinations/[countrySlug]/v2/[section]/page.tsx` | Render `CountryResearchPage` without the removed shell |
| `src/components/country-template/CountryResearchShell.tsx` | Removed |

### Tests Run

| Check | Result |
|---|---|
| TypeScript (`tsc --noEmit`) | ✅ Pass |
| Lint (`eslint` on changed files) | ✅ Pass |
| Production build (`next build`) | ✅ Pass |
| Cloudflare worker build (`opennextjs-cloudflare build`) | ✅ Pass |
| Route smoke test (`next start` + curl) | ✅ /nextinations/uruguay/v2/overview redirects to /login like /dashboard (no 500) |
