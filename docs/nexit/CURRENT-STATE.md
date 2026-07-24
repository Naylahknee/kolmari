# Nexit Current Implementation State

## Last Updated

Phase 2 — Pathways Accordion, Dashboard Template, Country Workspace

---

## Phase 1 Summary (completed prior)

See git history. Key changes:
- Approved brand assets (`NexitWordMark.svg`, `faviconNexit.svg`) integrated
- Global design token system consolidated in `src/app/globals.css`
- App shell rewritten with approved nav labels, sidebar row geometry, and slide-in mobile drawer

---

## Phase 2 Changes

### Files Changed

| File | Change |
|---|---|
| `src/components/nexit/pathways-results.tsx` | Rebuilt with accordion disclosure per `05-PAGE-TEMPLATES.md`: page header, personalized top-3 compact summary cards, category filter pills, accordion directory (highest-ranked item opens by default), sources and disclaimer footer. Converted from server to client component to support accordion and filter interactivity. Status labels updated to approved: Likely fit / Possible fit / More information needed. No eligibility claims. |
| `src/app/(app)/(workspace)/dashboard/page.tsx` | Rebuilt to 4-section template per spec: (1) Continue where you left off — stat cards; (2) Nextinations to explore — table-style list; (3) Nexit Plan + Budget — two-column; (4) Pathways signal. Removed editorial image band (dashboard is a workspace, not marketing). Consistent use of `card-surface`, `var(--radius-card)`, `var(--radius-field)`. Removed `Image` import (no longer needed). Heading hierarchy corrected. All data real. |
| `src/components/country-workspace/CountryWorkspace.tsx` | Replaced horizontal scrolling tab strip with: (desktop) a vertical 200px section nav sidebar beside the content area; (mobile) a compact dropdown selector. Persistent `CountryHero` extracted into its own component that never unmounts as sections change. Keyboard arrow navigation on tabs removed (no longer applicable — now standard buttons). All section content preserved. `aria-current` on active section. `aria-hidden` on decorative icons. |

### What was not changed
- `src/lib/pathways.ts` — pathway data and evaluation logic unchanged
- `src/lib/country-workspace/tabs.ts` — tab registry and ranking logic unchanged
- `src/app/(app)/(workspace)/nextinations/[countrySlug]/page.tsx` — page unchanged; passes same props to CountryWorkspace
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

## Routes Preserved

All existing routes unchanged. No new routes. No redirects removed. All 48 pages in build output.

Authentication, database schema, API contracts, Mapbox behavior, and Cloudflare configuration were not modified.

---

## Tests Run

| Check | Result |
|---|---|
| TypeScript (via `next build`) | ✅ Pass — 0 errors |
| ESLint (`npm run lint`) | ✅ Pass — 0 errors, 0 warnings |
| Production build (`npm run build`) | ✅ Pass — 48 pages, compiled in 15.7s |

---

## Known Issues / Unresolved

- The `countries/[slug]` route still exists at the legacy URL (e.g. `/countries/portugal`). This is a separate page from the new `/nextinations/[countrySlug]` workspace. Both remain for compatibility per the route preservation rule.
- The mobile section dropdown in CountryWorkspace opens on top of content. On very small screens (< 375px) this may cover the hero. A future pass should anchor the mobile section selector below the hero with a sticky behavior.
- `card-surface` CSS class still uses hardcoded `border-radius: 16px` in `globals.css`. After Phase 1's `--radius-card: 12px` token change, the `card-surface` class should be updated to reference the token. This is a CSS class not a utility, so it won't auto-update. Filed for Phase 3.

---

## Next Recommended Implementation Phase

**Phase 3 — Shared surface polish + card-surface token fix**

1. Update `card-surface` CSS class in `globals.css` to use `var(--radius-card)` instead of hardcoded `16px`.
2. Update `gold-button` CSS class radius to use `var(--radius-btn)` instead of hardcoded `12px`.
3. Update `field` CSS class radius to use `var(--radius-field)`.
4. Apply consistent empty states to: `/saved`, `/documents`, `/greenbook`, `/community`.
5. Review `/nexit-plan` and `/cost-calculator` pages for the planning and calculator templates from `05-PAGE-TEMPLATES.md`.
6. Add source disclosure and verification date patterns to country workspace tab content.

---

## Notes

- No mock data was introduced. All displayed values come from real database queries or honest empty states.
- Authentication flow is intact.
- Cloudflare-compatible build passes.
- `nexit-butterfly.svg` references have been fully eliminated from all source files.
