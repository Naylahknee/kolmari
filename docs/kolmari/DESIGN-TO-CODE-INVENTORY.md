# Kolmari Design-to-Code Inventory

**Status:** Initial inventory — Phase 1 complete  
**Branch:** `migration/01-kolmari-foundation` (target)  
**Date produced:** 2026-07-27  
**Prepared by:** Bob (Plan mode — inventory only, no code changed)

---

## 0. Prerequisite notes

### Design reference files — NOT PRESENT in this workspace

The following files described in the Kolmari migration instructions are **not present** in the local workspace:

| Expected path | Status |
|---|---|
| `design-reference/claude-design/Kolmari App.dc.html` | **MISSING** |
| `design-reference/claude-design/image-slot.js` | **MISSING** |
| `design-reference/claude-design/kolmari-map.js` | **MISSING** |
| `design-reference/claude-design/support.js` | **MISSING** |
| `design-reference/claude-design/assets/kolmari-butterfly.png` | **MISSING** |
| `docs/kolmari/` directory | **CREATED NOW** (was absent) |

The `design-reference/` directory does not exist. The Claude Design project at  
`https://claude.ai/design/p/70604ab3-6b97-44f7-83c1-87f7f5fd2df0` has not yet been exported  
to the local workspace. The migration instruction states these files must be present  
before Phase 1 inventory can be finalized.

**This inventory documents what can be determined from the existing codebase.**  
The design-to-code mapping for each Kolmari screen must be completed once the  
`Kolmari App.dc.html` export is placed in `design-reference/claude-design/`.

### Kolmari documentation files — NOT PRESENT

The following Kolmari docs are referenced in the migration instructions but do not yet exist:

| File | Status |
|---|---|
| `docs/kolmari/00-README.md` | **MISSING** |
| `docs/kolmari/01-DESIGN.md` | **MISSING** |
| `docs/kolmari/02-DESIGN-TOKENS.md` | **MISSING** |
| `docs/kolmari/03-COMPONENTS.md` | **MISSING** |
| `docs/kolmari/04-LAYOUTS.md` | **MISSING** |
| `docs/kolmari/05-PAGE-TEMPLATES.md` | **MISSING** |
| `docs/kolmari/06-ADAPTIVE-WORKSPACE.md` | **MISSING** |
| `docs/kolmari/07-DATA-MODEL.md` | **MISSING** |
| `docs/kolmari/08-CONTENT-STANDARDS.md` | **MISSING** |
| `docs/kolmari/09-IMPLEMENTATION-RULES.md` | **MISSING** |
| `docs/kolmari/10-LLM-RULES.md` | **MISSING** |
| `docs/kolmari/REBRAND-MIGRATION.md` | **MISSING** |
| `docs/kolmari/REPLACEMENT-MATRIX.md` | **MISSING** |
| `docs/kolmari/ROUTE-MIGRATION.md` | **MISSING** |
| `docs/kolmari/HTML-INTEGRATION.md` | **MISSING** |
| `docs/kolmari/MIGRATION-CHECKLIST.md` | **MISSING** |
| `docs/kolmari/LEGACY-REFERENCE-AUDIT.md` | **MISSING** |

The only Kolmari documentation that currently exists is this file, produced during Phase 1.

### GitHub repository status

The remote repository `Naylahknee/kolmari` and branch `migration/01-kolmari-foundation`  
(PR #19) have not been inspected from this local workspace (no git remote connection confirmed).  
The git status shows only the local workspace on branch `main` with no pending changes  
other than `public/icons/` untracked.

---

## 1. Existing application — full route inventory

### 1a. Public and authentication routes

| Route | File | Component | Description |
|---|---|---|---|
| `/` | `src/app/(marketing)/page.tsx` | `LandingPage` | Marketing landing page |
| `/[seoSlug]` | `src/app/(marketing)/[seoSlug]/page.tsx` | `SeoPage` | 10 public SEO pages |
| `/signup` | `src/app/(auth)/signup/page.tsx` | `SignupPage` | User registration |
| `/login` | `src/app/(auth)/login/page.tsx` | `LoginPage` | User login |

### 1b. Protected workspace routes

| Route | File | Component/Notes | Kolmari nav label |
|---|---|---|---|
| `/welcome` | `src/app/(app)/welcome/page.tsx` | Onboarding gate | — |
| `/profile-wizard` | `src/app/(app)/profile-wizard/page.tsx` | `ProfileWizard` | Profile |
| `/onboarding` | `src/app/(app)/onboarding/page.tsx` | Redirects → `/welcome` | — |
| `/dashboard` | `src/app/(app)/(workspace)/dashboard/page.tsx` | Dashboard page | Dashboard |
| `/nexitnation` | `src/app/(app)/(workspace)/nexitnation/page.tsx` | `NexitWorldWorkspace` | Your World |
| `/nexitnation/[region]` | `src/app/(app)/(workspace)/nexitnation/[region]/page.tsx` | Region detail | Your World |
| `/countries` | `src/app/(app)/(workspace)/countries/page.tsx` | Redirects → `/nexitnation?view=countries` | — |
| `/nextinations` | `src/app/(app)/(workspace)/nextinations/page.tsx` | Redirects → top match | — |
| `/nextinations/[countrySlug]` | `src/app/(app)/(workspace)/nextinations/[countrySlug]/page.tsx` | Redirects → `/overview` | Destinations |
| `/nextinations/[countrySlug]/[section]` | `src/app/(app)/(workspace)/nextinations/[countrySlug]/[section]/page.tsx` | `CountryWorkspace` | Destination detail |
| `/pathways` | `src/app/(app)/(workspace)/pathways/page.tsx` | `PathwaysResults` | Pathways |
| `/nexit-plan` | `src/app/(app)/(workspace)/nexit-plan/page.tsx` | `NexitPlanWorkspace` | My Plan |
| `/checklist` | `src/app/(app)/(workspace)/checklist/page.tsx` | Redirects → `/nexit-plan#checklist` | — |
| `/visa-wizard` | `src/app/(app)/(workspace)/visa-wizard/page.tsx` | Redirects → `/profile-wizard` | — |
| `/cost-calculator` | `src/app/(app)/(workspace)/cost-calculator/page.tsx` | `CostCalculator` | Cost Calculator |
| `/greenbook` | `src/app/(app)/(workspace)/greenbook/page.tsx` | Greenbook page | Greenbook |
| `/community` | `src/app/(app)/(workspace)/community/page.tsx` | Coming soon | Kolmari Klub |
| `/saved` | `src/app/(app)/(workspace)/saved/page.tsx` | `SavedNextinations` | Destinations |
| `/documents` | `src/app/(app)/(workspace)/documents/page.tsx` | `DocumentsManager` | Documents |
| `/settings` | `src/app/(app)/(workspace)/settings/page.tsx` | `SettingsForm` | Settings |
| `/settings/privacy` | `src/app/(app)/(workspace)/settings/privacy/page.tsx` | `PrivacyAccountPage` | Settings → Privacy |

### 1c. API routes

| Route | File | Method(s) |
|---|---|---|
| `/api/login` | `src/app/api/login/route.ts` | POST |
| `/api/logout` | `src/app/api/logout/route.ts` | POST |
| `/api/profile` | `src/app/api/profile/route.ts` | GET, PUT |
| `/api/plan` | `src/app/api/plan/route.ts` | GET, PUT |
| `/api/countries` | `src/app/api/countries/route.ts` | GET |
| `/api/account/change-password` | `src/app/api/account/change-password/route.ts` | POST |
| `/api/account/data-export` | `src/app/api/account/data-export/route.ts` | GET |
| `/api/account/deletion-request` | `src/app/api/account/deletion-request/route.ts` | POST |
| `/api/account/sign-out-all` | `src/app/api/account/sign-out-all/route.ts` | POST |

---

## 2. Existing component inventory

### 2a. Shell and navigation

| Component | File | Type | Notes |
|---|---|---|---|
| `AppShell` | `src/components/nexit/app-shell.tsx` | Client | Full sidebar, top bar, mobile nav, user menu, search |
| `Wordmark` | `src/components/nexit/wordmark.tsx` | Server | Renders `NexitWordMark.svg`; `dark` prop deprecated but present for call-site compat |
| `MarketingMobileNav` | `src/components/nexit/marketing-mobile-nav.tsx` | Client | Marketing page mobile nav |

#### AppShell sidebar structure (current)

```
DISCOVER
  Dashboard           → /dashboard
  Nexit World         → /nexitnation

MY NEXIT
  My Nextinations     → /nextinations (collapsible tree)
    [country flags]
    [country sections]

PLANNING
  Nexit Pathways      → /pathways
  Nexit Plan          → /nexit-plan
  Cost Calculator     → /cost-calculator
  Greenbook           → /greenbook
  Documents           → /documents

(bottom)
  Settings            → /settings
  Profile             → /profile-wizard
```

#### AppShell top bar structure (current)

- Wordmark (collapsed: icon only; expanded: wordmark)
- Sidebar collapse/expand toggle
- Global search form
- Notifications bell (modal)
- User account menu (email, logout)

#### Mobile nav (bottom bar)

- Dashboard, Nexit World, Nexit Pathways, Nexit Plan (4 primary items)

### 2b. Core page components

| Component | File | Type | Notes |
|---|---|---|---|
| `NexitWorldWorkspace` | `src/components/nexit/nexit-world.tsx` | Client | Map/countries toggle, region match display |
| `NexitnationMap` | `src/components/nexit/NexitnationMap.tsx` | Client | SVG world map with 6 region links |
| `NexitnationMapbox` | `src/components/nexit/NexitnationMapbox.tsx` | Client | Mapbox detailed map |
| `NexitnationMapLoader` | `src/components/nexit/NexitnationMapLoader.tsx` | Client | Loader for Mapbox |
| `CountriesBrowser` | `src/components/nexit/countries-browser.tsx` | Client | Country list, search, filter |
| `ProfileWizard` | `src/components/nexit/profile-wizard.tsx` | Client | Multi-step wizard |
| `PathwaysResults` | `src/components/nexit/pathways-results.tsx` | Client | Pathway evaluations with accordion |
| `NexitPlanWorkspace` | `src/components/nexit/nexit-plan-workspace.tsx` | Client | Full plan CRUD workspace |
| `CostCalculator` | `src/components/nexit/cost-calculator.tsx` | Client | Budget builder with BudgetDonut |
| `DocumentsManager` | `src/components/nexit/documents-manager.tsx` | Client | File upload and list (local state) |
| `SettingsForm` | `src/components/nexit/settings-form.tsx` | Client | Profile/account settings |
| `PrivacyAccountPage` | `src/components/nexit/privacy-account-page.tsx` | Client | Data export, password, deletion |
| `AuthForm` | `src/components/nexit/auth-form.tsx` | Client | Shared login/signup form |
| `WelcomeActions` | `src/components/nexit/welcome-actions.tsx` | Client | Welcome page wizard/skip CTAs |
| `SavedNextinations` | `src/components/nexit/saved-nextinations.tsx` | Client | Saved country list (localStorage) |
| `CountryWorkspace` | `src/components/country-workspace/CountryWorkspace.tsx` | Client | Persistent country workspace with tabs |
| `MiniExperienceTrigger` | `src/components/nexit/landing-mini-experiences.tsx` | Client | Landing page interactive demos |
| `PassportIndexLink` | `src/components/nexit/PassportIndexLink.tsx` | Server | External passport index link |
| `MapboxMap` | `src/components/nexit/MapboxMap.tsx` | Client | Generic Mapbox wrapper |

### 2c. Display components (server-safe)

| Component | File | Notes |
|---|---|---|
| `ScoreRing` | `src/components/nexit/rings.tsx` | SVG ring for readiness/match |
| `BudgetDonut` | `src/components/nexit/rings.tsx` | Conic-gradient budget chart |

### 2d. Country workspace tab components

All in `src/components/country-workspace/tabs/`:

`OverviewTab` (implied), `CompareTab`, `CostOfLivingTab`, `DailyLifeTab`,
`EconomicProfileTab`, `EducationTab`, `EmploymentTab`, `FamilyPetsTab`,
`GreenbookTab`, `HealthcareTab`, `HousingTab`, `LegalTaxesTab`,
`ResourcesTab`, `SourceFooter`, `TransportationTab`

---

## 3. Existing data model and persistence

### 3a. Database tables (Neon Postgres)

| Table | Key fields | Access layer |
|---|---|---|
| `users` | `id`, `email`, `password_hash` | `src/lib/db.ts` + `src/app/api/login/` |
| `profiles` | `user_id` (FK), `wizard_status`, 28+ profile fields, `completed_tasks`, `goals[]` (JSONB), `preferred_regions[]` (JSONB) | `src/lib/profile.ts` |
| `nexit_plans` | `user_id` (FK), `timeline_stage`, `checklist[]`, `budget` (JSONB), `documents[]` | `src/lib/nexit-plan.ts` |

### 3b. Authentication

- Session cookie: `nexit_session` (httpOnly, SameSite=Lax)
- Token: JOSE HS256 JWT (7-day expiry), issuer `nexit`, audience `nexit-web`
- `requireCurrentUser()` → server-side guard used in all protected layouts/pages

### 3c. Persistence flags (legacy key names — must not be blindly renamed)

| Key | Location | Type | Status |
|---|---|---|---|
| `nexit_session` | Cookie | Auth session | **Active — do not rename without compatibility layer** |
| `nexit:sidebar-collapsed` | localStorage | Sidebar state | **Active — compatibility alias needed on rename** |
| `nexit-saves` | localStorage | Saved countries (via `useSavedNextinations`) | **Active — compatibility read required** |
| `nexit_session` | AUTH_CONSTANTS `SESSION_COOKIE` | Auth constant | **Active** |
| `TOKEN_ISSUER = 'nexit'` | `src/lib/auth-constants.ts` | JWT issuer | **Active** |
| `TOKEN_AUDIENCE = 'nexit-web'` | `src/lib/auth-constants.ts` | JWT audience | **Active** |

### 3d. Static data libraries

| Library | File | Contains |
|---|---|---|
| `COUNTRIES` | `src/lib/countries.ts` | 5 countries with slug, name, code, city, region, visaType, safety, cost, match, summary |
| `PATHWAYS` | `src/lib/pathways.ts` | 10+ pathway definitions with official source URLs and lastVerified dates |
| `GREENBOOK_ENTRIES` | `src/lib/greenbook.ts` | 5+ editorial planning prompts |
| `regions` | `src/lib/nexitnation-data.ts` | 6 region configs with country previews and images |
| `NEXIT_LEXICON` | `src/lib/lexicon.ts` | Brand vocabulary object (needs Kolmari equivalents) |
| `SEO_PAGES` | `src/lib/seoContent.ts` | 10 public SEO page definitions |

---

## 4. Legacy terminology classification

This classification must guide migration decisions. Do **not** blindly rename any of these.

### 4a. Terminology by occurrence category

#### Public UI copy (safe to migrate on page conversion)

| Legacy term | Current UI location | Kolmari equivalent |
|---|---|---|
| `Nexit` | Brand label throughout UI | `Kolmari` |
| `Nexitnation` | Sidebar label, page heading, breadcrumbs | `Your World` |
| `Nextination(s)` | Cards, headings, labels | `Destination(s)` |
| `Nexit Plan` | Sidebar, dashboard, page headings | `My Plan` |
| `Nexit Profile` | Dashboard, welcome, settings | `Kolmari Profile` |
| `Nexit Pathways` | Sidebar, dashboard | `Pathways` |
| `Nexit Tracker` | Dashboard | `Progress Tracker` |
| `Nexit Readiness` | Readiness score UI | `Move Readiness` |
| `Nexit Timeline` | Dashboard | `Move Timeline` |
| `Nexicution Mode` / `Nexiters` / `Nexicution` | Dashboard CTA, community page | `Flutter Mode` / `Kolmari Klub` members |
| `Nexit Budget` | Dashboard section heading | (removed or → `Budget`) |
| `Nexit World` | Sidebar label | `Your World` |
| `Community Fit` | Country cards | Retained: `Community Fit` |
| `Match Score` | Country cards | Retained: `Match Score` |
| `Greenbook Insights` | Greenbook page | Retained: `Greenbook Insights` |
| `Greenbook Layer` | In lexicon | Retained: `Greenbook Layer` |

#### Component filenames (internal — rename carefully, not on UI)

| File/component | Notes |
|---|---|
| `src/components/nexit/app-shell.tsx` | Internal; can be migrated to `kolmari-shell.tsx` in separate phase |
| `src/components/nexit/nexit-plan-workspace.tsx` | Internal; keep until route migrated |
| `src/components/nexit/nexit-world.tsx` | Internal; keep until route migrated |
| `src/lib/nexit-plan.ts` | Contains `NexitPlan`, `emptyNexitPlan()` — DB table name `nexit_plans` |
| `src/lib/lexicon.ts` | `NEXIT_LEXICON` — needs a `KOLMARI_LEXICON` parallel (do not delete existing) |

#### Routes (maintain with redirects — do not rename without separate phase)

| Current route | Kolmari canonical | Migration phase |
|---|---|---|
| `/nexitnation` | `/world` | Future |
| `/nexitnation/[region]` | `/destinations/[slug]` | Future |
| `/nexit-plan` | `/plan` | Future |
| `/checklist` | `/flutter` (already redirects to nexit-plan) | Future |
| `/community` | `/klub` | Future |
| `/nextinations/[slug]` | `/destinations/[slug]` | Future |
| `/saved` | `/destinations` (consolidate) | Future |

#### Database fields (MUST NOT be renamed without a separate migration task)

| Field / table | Contains "nexit" | Risk |
|---|---|---|
| `nexit_plans` table | Table name | HIGH — do not rename |
| `profiles.completed_tasks` | Field name is neutral | Low risk |
| `profiles.wizard_status` | Neutral | No change |
| API route `/api/plan` | Neutral URL | No change |

#### Cookie and localStorage keys (require compatibility reads on rename)

| Key | Recommendation |
|---|---|
| `nexit_session` | Keep until new cookie name verified with auth system |
| `nexit:sidebar-collapsed` | Read old key → write new key in compatibility pass |
| `nexit-saves` (localStorage saved countries) | Read old → write new `kolmari-saves` with migration shim |

#### Metadata, SEO, and `site.ts`

| Location | Current value | Proposed |
|---|---|---|
| `src/lib/site.ts` | `FALLBACK_SITE_URL = 'https://nexit.madincrease.workers.dev'` | Update to Kolmari domain when ready |
| `src/app/layout.tsx` | `title: 'Nexit | Build your Nexit Plan'` | Migrate when branding is confirmed |
| `src/lib/auth-constants.ts` | `TOKEN_ISSUER = 'nexit'`, `SESSION_COOKIE = 'nexit_session'` | Keep for now; change only with auth migration |
| `package.json` | `"name": "nexit"` | Low risk; update in separate cleanup |

---

## 5. Design-to-code screen mapping

The following table maps the **expected** Kolmari screens (based on the approved Kolmari  
terminology and product structure) to the existing application routes and components.  
This will need to be verified against `Kolmari App.dc.html` when the file is available.

### 5a. Screen inventory (inferred from Kolmari product spec)

| # | Kolmari screen | Expected sections | Current route | Current components | Client? |
|---|---|---|---|---|---|
| 1 | Dashboard | Welcome header, Move Readiness ring, Destination summary, Next Steps, Plan progress, Budget snapshot, Pathways signal | `/dashboard` | `dashboard/page.tsx`, `rings.tsx` | Partial (server page, client sub-components) |
| 2 | Your World (map) | Region map, region cards, search, country browser | `/nexitnation` | `NexitWorldWorkspace`, `NexitnationMap` | Yes |
| 3 | Destinations (list) | Country grid/list, search, filter, Match Score | `/nexitnation?view=countries` → `countries-browser.tsx` | `CountriesBrowser` | Yes |
| 4 | Destination detail | Hero, tabs: Overview, Why You, Cost, Pathways, Healthcare, Housing, Greenbook, etc. | `/nextinations/[slug]/[section]` | `CountryWorkspace` + 15 tabs | Yes |
| 5 | Pathways | Pathway list, filters, accordion evaluations, strong/possible/missing | `/pathways` | `PathwaysResults` | Yes |
| 6 | My Plan | Stage selector, Destination picker, Pathway picker, checklist, budget, documents, notes | `/nexit-plan` | `NexitPlanWorkspace` | Yes |
| 7 | Flutter Mode | Execution checklist, task prioritization, deadlines, progress summary | `/checklist` (redirects → `/nexit-plan#checklist`) | `NexitPlanWorkspace` (checklist section) | Yes |
| 8 | Documents | File upload, document list, delete | `/documents` | `DocumentsManager` | Yes |
| 9 | Kolmari Klub | Community page — currently "coming soon" with related links | `/community` | `community/page.tsx` | No (server) |
| 10 | Cost Calculator | Budget builder, BudgetDonut, income context | `/cost-calculator` | `CostCalculator` | Yes |
| 11 | Greenbook | Planning prompts, provenance legend, community-reported empty state | `/greenbook` | `greenbook/page.tsx` | No (server) |
| 12 | Settings | Display name, current location, timeline, priority, notifications | `/settings` | `SettingsForm` | Yes |
| 13 | Privacy & Account | Data export, password change, sign out all, deletion request | `/settings/privacy` | `PrivacyAccountPage` | Yes |
| 14 | Profile Wizard | Multi-step: name, citizenship, income, work, household, regions, goals, climate, timeline | `/profile-wizard` | `ProfileWizard` | Yes |
| 15 | Welcome / Onboarding | Benefits list, Start/Skip CTAs | `/welcome` | `welcome/page.tsx`, `WelcomeActions` | Partial |
| 16 | Landing page | Hero, features bar, how-it-works, stats, community, footer | `/` | `(marketing)/page.tsx` | Partial |
| 17 | Auth — Signup | Wordmark, form, next-path preservation | `/signup` | `signup/page.tsx`, `AuthForm` | Partial |
| 18 | Auth — Login | Wordmark, form, next-path preservation | `/login` | `login/page.tsx`, `AuthForm` | Partial |
| 19 | SEO pages (×10) | Country/topic content, CTAs | `/[seoSlug]` | `[seoSlug]/page.tsx` | No (server) |
| 20 | Region detail | Hero image, country cards with Match Score, Pathways/Greenbook CTAs | `/nexitnation/[region]` | `[region]/page.tsx` | No (server) |
| 21 | Saved Destinations | Saved country cards, remove action | `/saved` | `SavedNextinations` | Yes |

### 5b. Shared components across screens

| Component | Used on screens |
|---|---|
| App shell (sidebar + top bar + mobile nav) | All protected workspace screens (1–13, 20–21) |
| `Wordmark` | Shell, auth screens, landing, marketing |
| `ScoreRing` | Dashboard (readiness/timeline), region pages |
| `BudgetDonut` | Dashboard, Cost Calculator |
| `PathwaysResults` (or sub-parts) | Pathways, My Plan (pathway picker) |
| `CountryWorkspace` + tab system | Destination detail (screen 4) |

---

## 6. Interaction and behavior inventory

### 6a. Client-only interactions (require `'use client'`)

| Interaction | Current component | Kolmari screen |
|---|---|---|
| Sidebar collapse/expand, mobile drawer | `AppShell` | All protected |
| User menu dropdown | `AppShell` | All protected |
| Notifications modal | `AppShell` | All protected |
| Global search (form submit → redirect) | `AppShell` | All protected |
| Country tree expand/collapse in sidebar | `SidebarNav` | All protected |
| Map region selection | `NexitnationMap` | Your World |
| Country browser search + filter | `CountriesBrowser` | Destinations |
| Map/Countries toggle | `NexitWorldWorkspace` | Your World |
| Wizard step navigation | `ProfileWizard` | Profile Wizard |
| Pathway accordion expand/collapse | `PathwaysResults` | Pathways |
| Plan stage selector, checklist CRUD, budget fields | `NexitPlanWorkspace` | My Plan |
| File upload drag-and-drop | `DocumentsManager` | Documents |
| Budget form + donut update | `CostCalculator` | Cost Calculator |
| Tab navigation in country workspace | `CountryWorkspace` | Destination detail |
| Saved country management | `SavedNextinations` | Saved / Sidebar |
| Settings form save | `SettingsForm` | Settings |
| Password change, data export, deletion | `PrivacyAccountPage` | Privacy & Account |
| Auth form (login/signup) | `AuthForm` | Auth screens |
| Mini experience modals | `MiniExperienceTrigger` | Landing |
| Marketing mobile nav | `MarketingMobileNav` | Landing |

### 6b. Map behavior

| Map | Technology | Status | Notes |
|---|---|---|---|
| Nexitnation world map | SVG (accessible) | Production | 6 region links, no Mapbox token required |
| Region detail / country detail | Mapbox GL | Available | Requires client token; used in `NexitnationMapbox` |

No `kolmari-map.js` has been inspected (file absent from local workspace).

### 6c. Missing behavior (current state)

| Feature | Current state | Priority for Kolmari |
|---|---|---|
| Kolmari Klub / community | Placeholder ("coming soon") | High — pilot page |
| Community posting, moderation | Not built | Future |
| Flutter Mode as distinct route/page | Redirects to nexit-plan#checklist | High — needs own route/page |
| Notifications (bell) | Modal shell exists; no real notification data | Low |
| Document persistence | Local state only (no backend storage) | Medium |
| Mapbox in destination detail | Available but may not be wired to Destination detail pages | Medium |

---

## 7. Mock data and fabrication risks

| Location | Risk | Description |
|---|---|---|
| `src/lib/countries.ts` | LOW | `match` field is a static number (92, 90, etc.) — not calculated from profile. Must not be displayed as a real Match Score without profile completion. |
| `src/app/(marketing)/page.tsx` | MEDIUM | Stats (`50+`, `120+`, `20K+`, `4.8/5`) appear fabricated. Must carry appropriate disclaimer or be removed. Testimonial from "Maya R." is fabricated. |
| `src/app/(app)/(workspace)/nexitnation/[region]/page.tsx` | LOW | `region.countryCount` is a static number. |
| `GREENBOOK_ENTRIES` | LOW | Clearly labeled as editorial prompts, not testimonials. Provenance system is in place. |
| `PATHWAYS` | LOW | `lastVerified` dates are present. Disclaimer system `RESEARCH_DISCLAIMER` exists in pathways.ts. |

---

## 8. Brand asset inventory (current state)

### 8a. Production assets (in `public/brand/`)

| File | Current usage |
|---|---|
| `NexitWordMark.svg` | Wordmark component — used on auth, shell, landing |
| `nexit-app-icon.png` | App icon |
| `faviconNexit.svg` | SVG favicon |
| `favicon-16.png`, `favicon-32.png`, `favicon-48.png`, `favicon-512.png`, `favicon.ico` | Favicon family |

### 8b. Kolmari butterfly asset

The `kolmari-butterfly.png` referenced in the migration instructions is **absent** from the workspace.

Proposed placement once received:
```
public/brand/kolmari-butterfly.png
```

A centralized brand-assets configuration should be created at:
```
src/config/brand-assets.ts
```

### 8c. Design token alignment

Current Nexit tokens (`src/app/globals.css`) match the Kolmari palette from the migration instructions:

| Token | Current value | Kolmari spec |
|---|---|---|
| `--color-navy` | `#17305b` | `#17305B` ✓ |
| `--color-navy-deep` | `#0d1b39` | `#0D1B39` ✓ |
| `--color-gold` | `#f3c516` | `#F8C21A` (slight difference — migration doc uses `#F8C21A`) ⚠️ |
| `--color-canvas` | `#f4f6f9` | `#F4F6F9` ✓ |
| `--color-muted` | `#6b7a92` | `#6B7A90` (small difference) ⚠️ |

**Note:** The Kolmari migration spec lists `Gold: #F8C21A` while the current implementation uses `#F3C516`. This discrepancy must be confirmed with the owner before any token changes. Do not change without explicit approval.

---

## 9. Missing Kolmari brand configuration files

The following files do not exist and must be created during Phase 2 (Foundation Verification):

| File | Purpose |
|---|---|
| `src/config/brand.ts` | Centralized `BRAND` object (`name`, `communityName`, `tagline`, `description`) |
| `src/config/product-copy.ts` | Centralized Kolmari navigation labels and CTA strings |
| `src/config/brand-assets.ts` | Centralized asset path references |

Expected content of `src/config/brand.ts`:

```ts
export const BRAND = {
  name: 'Kolmari',
  communityName: 'Kolmari Klub',
  tagline: 'Build a life without borders.',
  description:
    'Kolmari helps people discover countries, understand relocation pathways, and build a practical plan for life abroad.',
} as const
```

The existing `src/lib/lexicon.ts` (`NEXIT_LEXICON`) must be preserved for compatibility and extended  
with a parallel `KOLMARI_LEXICON` object. Do not delete `NEXIT_LEXICON` until all references are migrated.

---

## 10. Proposed Kolmari sidebar structure (target)

```
Dashboard

EXPLORE
  Your World          → /nexitnation   (future: /world)
  Destinations        → /saved         (future: /destinations)

PLAN
  Pathways            → /pathways
  My Plan             → /nexit-plan    (future: /plan)
  Flutter Mode        → /nexit-plan#checklist  (future: /flutter)
  Documents           → /documents

CONNECT
  Kolmari Klub        → /community     (future: /klub)

TOOLS
  Cost Calculator     → /cost-calculator
  Greenbook           → /greenbook
  Settings            → /settings
```

Currently the `AppShell` has groups: DISCOVER, MY NEXIT, PLANNING.  
The Kolmari spec requires: EXPLORE, PLAN, CONNECT, TOOLS.

---

## 11. Proposed migration order

This order is recommended based on risk level and dependency:

### Foundation (Phase 2 — no page migration)

1. Create `src/config/brand.ts`
2. Create `src/config/product-copy.ts`
3. Create `src/config/brand-assets.ts`
4. Add `KOLMARI_LEXICON` to `src/lib/lexicon.ts` (keep `NEXIT_LEXICON`)
5. Update sidebar labels in `AppShell` to Kolmari terminology
6. Update top bar and mobile nav labels
7. Update `src/app/layout.tsx` metadata (title/description → Kolmari)
8. Create migration documentation files under `docs/kolmari/`
9. Place `kolmari-butterfly.png` in `public/brand/`
10. Verify token discrepancy (`gold: #F3C516` vs `#F8C21A`)

### Pilot page (Phase 3, step 1)

11. **Kolmari Klub** (`/community`) — lowest risk, currently a placeholder
    - Komponente: `src/components/community/klub-header.tsx`, `klub-tabs.tsx`, etc.
    - Real data: none yet (community is not built) → honest empty state
    - Goal: test full shell integration, new terminology, responsive behavior

### Lower-risk pages (Phase 3, steps 2–4)

12. **Settings** (`/settings` + `/settings/privacy`)
13. **Dashboard** (`/dashboard`)
14. **Cost Calculator** (`/cost-calculator`)

### Core planning pages (Phase 3, steps 5–9)

15. **Destinations / Saved** (`/saved`)
16. **Documents** (`/documents`)
17. **Pathways** (`/pathways`)
18. **My Plan** (`/nexit-plan`)
19. **Flutter Mode** (needs new route `/flutter` or distinct section in `/nexit-plan`)

### Higher-risk pages (Phase 3, steps 10–12)

20. **Destination detail** (`/nextinations/[slug]/[section]`)
21. **Your World + map** (`/nexitnation`)
22. **Profile wizard** (`/profile-wizard`)

### Marketing and launch (Phase 4)

23. Landing page (`/`)
24. Auth screens (signup, login)
25. SEO pages (`/[seoSlug]`)
26. Route redirects (old → new canonical Kolmari routes)
27. Domain and metadata cleanup

---

## 12. Recommended pilot page

**Kolmari Klub (`/community`)** is the recommended pilot for these reasons:

1. **Lowest data risk** — currently a placeholder with honest empty state; no real community data to break
2. **Tests full shell** — exercises the Kolmari app shell, new nav labels, sidebar active state
3. **Tests Kolmari terminology** — "Kolmari Klub" label, teal color usage, community CTAs
4. **Tests componentization** — must be split into reusable components per spec
5. **No business-logic risk** — no scoring, no profile logic, no database mutations
6. **Responsive** — can test card layout, tabs, mobile behavior

Pilot completion criteria (from migration spec section 10):
- Converted to TSX with named components
- Split into: `klub-header.tsx`, `klub-tabs.tsx`, `chatter-feed.tsx`, `discover-klubs.tsx`, `my-klubs.tsx`
- Real community data: none available — show honest "in development" state
- Tab behavior works
- Mobile layout works
- Sidebar active state shows Kolmari Klub as active
- No public "Nexit" copy on the page
- typecheck passes, lint passes, build passes

---

## 13. Accessibility concerns

| Issue | Location | Risk |
|---|---|---|
| `SavedNextinations` uses localStorage-only state | Client component | Works but not SSR-accessible |
| `DocumentsManager` has no backend persistence | Client state | File names lost on refresh |
| `CostCalculator` — save to plan may fail silently | Client fetch | Needs status announcement |
| Marketing page stats are fabricated | `(marketing)/page.tsx` | User trust issue |
| Testimonial "Maya R." is fabricated | `(marketing)/page.tsx` | Must be removed or clearly labeled |
| `AppShell` search — empty query behavior | No validation message | Accessibility |
| `CountryWorkspace` tabs | Needs `aria-selected` and `role="tab"` audit | Accessibility |
| Map SVG — region click areas | Need minimum 44px touch targets on mobile | Mobile accessibility |

---

## 14. Risks and blockers

| Risk | Level | Description |
|---|---|---|
| `Kolmari App.dc.html` not present | **BLOCKER** | Cannot complete screen-by-screen design mapping without the Claude Design export |
| `kolmari-butterfly.png` not present | HIGH | New brand asset required before wordmark/icon migration |
| Kolmari `docs/kolmari/` docs not present | HIGH | All 10 required documentation files are absent |
| PR #19 / `migration/01-kolmari-foundation` not inspectable locally | HIGH | Cannot verify completed foundation work without remote access |
| Gold token discrepancy (`#F3C516` vs `#F8C21A`) | MEDIUM | Requires owner confirmation before changing |
| `TOKEN_ISSUER = 'nexit'` in JWT | MEDIUM | Changing this invalidates all existing sessions — must be a separate auth migration |
| `nexit_session` cookie name | MEDIUM | Must be renamed with compatibility layer, not casually |
| `nexit_plans` database table name | MEDIUM | Do not rename without a formal DB migration task |
| `nexit-saves` localStorage key | LOW-MEDIUM | Must read old key → write new key with migration shim |
| Community features not built | LOW | Honest empty state already in place; pilot can proceed |
| Document persistence is local-only | LOW | Backend document storage is a separate feature request |
| Fabricated marketing stats and testimonial | MEDIUM | Must be addressed before launch |

---

## 15. Required actions before code can begin

1. **Place `Kolmari App.dc.html`** in `design-reference/claude-design/`
2. **Place `kolmari-butterfly.png`** in `design-reference/claude-design/assets/` (then copy to `public/brand/`)
3. **Provide `image-slot.js`, `kolmari-map.js`, `support.js`** for behavior classification
4. **Confirm gold token value** — `#F3C516` (current) vs `#F8C21A` (spec)
5. **Confirm Kolmari domain** for `src/lib/site.ts` update
6. **Create `docs/kolmari/` documentation files** (00-README through 10-LLM-RULES)
7. **Review PR #19** to avoid duplicating completed foundation work
8. **Receive explicit approval** before any page migration begins

---

## 16. Summary

This inventory was produced from inspection of the **local workspace only** (no Claude Design  
project access, no remote repository access to `Naylahknee/kolmari`).

**What is documented here:**
- Full route inventory (21 protected workspace routes + APIs)
- Full component inventory (25+ components)
- Data model (3 tables, auth system, localStorage keys)
- Legacy terminology classification by category
- Kolmari-to-Nexit screen mapping (inferred from product spec, not design file)
- Brand asset gaps
- Missing configuration files
- Proposed migration order
- Recommended pilot page (Kolmari Klub)
- Risks and blockers

**What cannot be documented until design files arrive:**
- Screen-by-screen design component hierarchy
- Exact visual layout differences between Kolmari design and current implementation
- New components required that don't exist in current codebase
- Image placeholder behavior from `image-slot.js`
- Map interaction prototype from `kolmari-map.js`
- UI animation/support behavior from `support.js`
- Color/spacing deviations from `Kolmari App.dc.html`

**No application code was changed during this inventory.**
