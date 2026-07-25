# Nexit Current Implementation State

## Last Updated

Phase 7 — EconomicProfileTab disclosure audit; greenbook type fix

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

## Next Recommended Implementation Phase

**Phase 8 — Greenbook disclosure pattern and Compare tab**

1. Review `GreenbookTab` to ensure its inline provenance legend is complete and clearly distinguishes verified resources, editorial context, and community reports.
2. Consider adding `CompareTab` source disclosure for comparison data.
3. After data completeness: review the `countries/[slug]` legacy page for consistency with the new workspace (or deprecate in favor of `/nextinations/[countrySlug]`).
