# Nexit Current Implementation State

## Last Updated

Phase 4 — Consistent page header typography across workspace pages

---

## Phase 1 Summary (completed prior)

See git history. Key changes:
- Approved brand assets (`NexitWordMark.svg`, `faviconNexit.svg`) integrated
- Global design token system consolidated in `src/app/globals.css`
- App shell rewritten with approved nav labels, sidebar row geometry, and slide-in mobile drawer

---

## Phase 2 Summary (completed prior)

| File | Change |
|---|---|
| `src/components/nexit/pathways-results.tsx` | Accordion disclosure, page header, top-3 summary cards, category filters, sources footer. Converted to client component. |
| `src/app/(app)/(workspace)/dashboard/page.tsx` | 4-section dashboard template, stat cards, nextinations list, plan + budget two-column, Pathways signal. |
| `src/components/country-workspace/CountryWorkspace.tsx` | Persistent CountryHero, vertical section nav (desktop) + dropdown selector (mobile). |

---

## Phase 3 Changes

### Files Changed

| File | Change |
|---|---|
| `src/app/globals.css` | `card-surface`, `gold-button`, and `field` CSS classes updated to use `var()` token references instead of hardcoded pixel/color values. |
| `src/components/nexit/saved-nextinations.tsx` | Fixed `/countries/[slug]` link → `/nextinations/[slug]`. CTA copy updated to "Explore This Nextination". |
| `src/app/(app)/(workspace)/greenbook/page.tsx` | Provenance legend, per-card provenance labels, honest "community-reported" empty state. |
| `src/app/(app)/(workspace)/community/page.tsx` | Honest "in development" empty state, correct Nexiters Community heading, accessible layout. |
| `src/components/nexit/documents-manager.tsx` | Proper page header, honest session-only privacy notice, accessible empty state, "document groups unavailable" notice. |
| `src/components/nexit/nexit-plan-workspace.tsx` | Planning workspace template: structured header with progress, labeled sections, `aria-pressed` timeline buttons, consistent tokens. |
| `src/components/nexit/cost-calculator.tsx` | Calculator tool template: summary-first layout, inputs, donut or honest empty state, methodology note footer. |

---

## Phase 4 Changes

### Problem
Four workspace `<h1>` elements used `font-display text-4xl` — the editorial/Playfair Display style appropriate for marketing pages and hero sections, but not for dense workspace page headers (Dashboard, Checklist, Countries browser, Settings). This was inconsistent with the approved workspace heading pattern: `text-2xl sm:text-3xl font-bold text-navy`.

### Files Changed

| File | Change |
|---|---|
| `src/app/(app)/(workspace)/saved/page.tsx` | `font-display text-4xl font-bold` → `text-2xl font-bold text-navy sm:text-3xl`. Label `text-sm font-bold` → `text-xs font-bold uppercase tracking-widest`. |
| `src/components/nexit/countries-browser.tsx` | Same heading fix. Label updated to `text-xs font-bold uppercase tracking-widest`. |
| `src/components/nexit/settings-form.tsx` | Same heading fix. Label updated to `text-xs font-bold uppercase tracking-widest`. |
| `src/components/nexit/checklist.tsx` | Same heading fix. Label updated to `text-xs font-bold uppercase tracking-widest`. |

### What was NOT changed
- Marketing pages (`src/app/(marketing)/`) — `font-display` is correct on hero and editorial headings
- Auth pages (login, signup) — `font-display` is correct for entry screens
- Welcome page — `font-display` is appropriate for the large welcome heading
- Nexitnation map and region workspace — `font-display` is correct for map hero headings
- Country workspace tabs — `font-display text-2xl` is appropriate for section article headings
- `profile-wizard.tsx` — `font-display text-3xl` is correct for wizard step headings
- All route files, auth, DB, API contracts

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
| Workspace page `<h1>` | Geist Sans (`font-sans`) | `text-2xl sm:text-3xl` | `font-bold` |
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

## Tests Run (Phase 4)

| Check | Result |
|---|---|
| TypeScript (via `next build`) | ✅ Pass — 0 errors |
| ESLint (`npm run lint`) | ✅ Pass — 0 errors, 0 warnings |
| Production build (`npm run build`) | ✅ Pass — 48 pages, compiled in 14.3s |

---

## Known Issues / Unresolved

- The `countries/[slug]` route still exists at the legacy URL (e.g. `/countries/portugal`). This is a separate page from the new `/nextinations/[countrySlug]` workspace. Both remain for compatibility per the route preservation rule.
- The mobile section dropdown in CountryWorkspace opens on top of content. On very small screens (< 375px) this may cover the hero. A future pass should anchor the mobile section selector below the hero with a sticky behavior.

---

## Next Recommended Implementation Phase

**Phase 5 — Country workspace source disclosure + verified data patterns**

1. Add `verificationDate` and `sourceLabel` fields to each country workspace tab's data objects.
2. Display a small "Last verified: [date] · [source]" footer beneath each tab's data section.
3. Apply the pattern to: `EconomicProfileTab`, `CostOfLivingTab`, `LegalTaxesTab`, `HealthcareTab`, `EmploymentTab`, `HousingTab`, `EducationTab`, `DailyLifeTab`, `TransportationTab`.
4. Do not fabricate verification dates — use honest "Not verified" or "Community-reported" labels where real dates are unavailable.
5. After source disclosure, consider the Nexitnation Map page and region workspace enhancements (Phase 6).
