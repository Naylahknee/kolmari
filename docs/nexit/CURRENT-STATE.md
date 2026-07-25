# Nexit Current Implementation State

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

## Next Recommended Implementation Phase

**Phase 11 — Greenbook disclosure pattern + legacy page review**

1. Review `GreenbookTab` inline provenance legend completeness.
2. Review `countries/[slug]` legacy page for consistency or deprecation.
3. Consider `CompareTab` source disclosure.
4. Adaptive section ordering (06-ADAPTIVE-WORKSPACE.md) — rank-country-sections lib and sidebar PersonalizedOrder toggle.
