# Kolmari Design-to-Code Inventory

**Created:** 2025-01-07
**Branch:** migration/02-kolmari-terminology
**Status:** Initial inventory — no application code changed

---

## Critical notice: design reference files are absent

The Claude Design files listed in the migration instructions **do not exist in the repository**:

| Expected path | Status |
|---|---|
| `design-reference/claude-design/Kolmari-App-Reference.html` | **MISSING** |
| `design-reference/claude-design/Kolmari App.dc.html` | **MISSING** |
| `design-reference/claude-design/image-slot.js` | **MISSING** |
| `design-reference/claude-design/kolmari-map.js` | **MISSING** |
| `design-reference/claude-design/support.js` | **MISSING** |
| `design-reference/claude-design/assets/kolmari-butterfly.png` | **MISSING** |
| `design-reference/` directory | **MISSING** |

This inventory was produced entirely from the existing application source code and Kolmari documentation files. It cannot include a screen-by-screen design-to-code comparison without the HTML design file. That mapping must be completed once the design reference is added to the repository.

**Action required:** Add the Claude Design export to `design-reference/claude-design/` and re-run this inventory pass to complete the design-to-code mapping sections.

---

## 1. Repository state summary

### Foundation work status (Milestone 1)

The following Milestone 1 deliverables are confirmed present and correct:

| Item | File | Status |
|---|---|---|
| Brand configuration | `src/config/brand.ts` | ✅ Present |
| Product copy configuration | `src/config/product-copy.ts` | ✅ Present |
| Brand assets configuration | `src/config/brand-assets.ts` | ✅ Present |
| Kolmari lexicon | `src/lib/lexicon.ts` | ✅ Present |
| Kolmari app-shell boundary | `src/components/layout/kolmari-app-shell.tsx` | ✅ Present |
| Workspace layout using Kolmari shell | `src/app/(app)/(workspace)/layout.tsx` | ✅ Present |
| AppShell with Kolmari sidebar labels | `src/components/nexit/app-shell.tsx` | ✅ Present |
| Migration documentation | `docs/kolmari/` | ✅ Present |
| Legacy compatibility exports | `src/lib/lexicon.ts` (`NEXIT_LEXICON`, `NEXIT_STORY`) | ✅ Present |
| Sidebar collapse localStorage migration shim | `src/components/nexit/app-shell.tsx` | ✅ Present |

### Milestone 1 validation checks outstanding

| Check | Status |
|---|---|
| `npm run typecheck` | ⬜ Not run |
| `npm run lint` | ⬜ Not run |
| `npm run test` | ⬜ Not run |
| `npm run build` | ⬜ Not run |
| `npx opennextjs-cloudflare build` | ⬜ Not run |

---

## 2. Application route inventory

### Public routes

| Route | File | Component | Purpose | Kolmari copy status |
|---|---|---|---|---|
| `/` | `src/app/(marketing)/page.tsx` | Inline (`LandingPage`) | Marketing landing page | ✅ Kolmari terms in use |
| `/quiz` | `src/app/(marketing)/quiz/page.tsx` | Inline (`NexitQuizPage`) | 8-question move planning quiz | ⚠️ Function name `NexitQuizPage` still legacy; `nexit-quiz-result` localStorage key is legacy |
| `/[seoSlug]` | `src/app/(marketing)/[seoSlug]/page.tsx` | Not inspected | 10 public SEO pages | ⬜ Not inspected |
| `/login` | `src/app/(auth)/login/page.tsx` | `AuthForm`, `Wordmark` | Login | ✅ Kolmari terms in copy |
| `/signup` | `src/app/(auth)/signup/page.tsx` | `AuthForm`, `Wordmark` | Signup | ✅ Kolmari terms in copy |

### Compatibility redirect routes

| Route | File | Destination |
|---|---|---|
| `/onboarding` | `src/app/(app)/onboarding/page.tsx` | Redirects → `/welcome` |
| `/checklist` | `src/app/(app)/(workspace)/checklist/page.tsx` | Redirects → `/nexit-plan#checklist` |

### Protected workspace routes

| Route | File | Primary component | Data source | Kolmari copy status |
|---|---|---|---|---|
| `/welcome` | `src/app/(app)/welcome/page.tsx` | `WelcomeActions` | `getProfile()` | ✅ Kolmari copy |
| `/profile-wizard` | `src/app/(app)/profile-wizard/page.tsx` | `ProfileWizard` | `getProfile()` | ⬜ Not inspected |
| `/dashboard` | `src/app/(app)/(workspace)/dashboard/page.tsx` | Inline page + `ScoreRing`, `BudgetDonut` | `getProfile()`, `getNexitPlan()`, `evaluatePathways()` | ⚠️ Some legacy refs (link to `/nexit-plan`) |
| `/nexitnation` | `src/app/(app)/(workspace)/nexitnation/page.tsx` | `NexitWorldBoard` (via `KolmariWorldBoard`) | `getProfile()`, `calculateRegionMatches()` | ⚠️ Metadata still "Nexit World \| Nexit"; uses `NexitWorldBoard` import which doesn't exist |
| `/nexitnation/[region]` | `src/app/(app)/(workspace)/nexitnation/[region]/page.tsx` | Inline page + `CountryShapePanel` | `getProfile()`, `calculateRegionMatches()`, `regions[]` | ✅ Mostly Kolmari; uses `NEXIT_LEXICON` for labels |
| `/saved` | `src/app/(app)/(workspace)/saved/page.tsx` | `SavedNextinations` | localStorage (`kolmari-saves`) | ✅ Page header uses "Destinations" |
| `/countries` | `src/app/(app)/(workspace)/countries/page.tsx` | Not inspected | `COUNTRIES` data | ⬜ Not inspected |
| `/countries/[slug]` | `src/app/(app)/(workspace)/countries/[slug]/page.tsx` | `SaveNextinationButton` | `COUNTRIES[]`, `getProfile()` | ⚠️ Uses "Nextination" in UI comments only; copy is mostly Kolmari |
| `/pathways` | `src/app/(app)/(workspace)/pathways/page.tsx` | `PathwaysResults` | `getProfile()`, `evaluatePathways()`, `PATHWAYS` | ✅ Kolmari metadata |
| `/nexit-plan` | `src/app/(app)/(workspace)/nexit-plan/page.tsx` | `NexitPlanWorkspace` | `getProfile()`, `getNexitPlan()`, `COUNTRIES`, `PATHWAYS` | ✅ Kolmari metadata |
| `/flutter` | `src/app/(app)/(workspace)/flutter/page.tsx` | `NexitPlanWorkspace` (defaultTab="checklist") | Same as `/nexit-plan` | ✅ Kolmari metadata |
| `/documents` | `src/app/(app)/(workspace)/documents/page.tsx` | `DocumentsManager` | Client state (no backend yet) | ⬜ Not inspected |
| `/community` | `src/app/(app)/(workspace)/community/page.tsx` | `KlubHeader`, `KlubEmptyState`, `KlubTabs` | None (empty state) | ✅ Kolmari Klub copy |
| `/cost-calculator` | `src/app/(app)/(workspace)/cost-calculator/page.tsx` | `CostCalculator` | `getProfile()` (income) | ⬜ Not inspected |
| `/greenbook` | `src/app/(app)/(workspace)/greenbook/page.tsx` | Inline page + `GREENBOOK_ENTRIES` | `GREENBOOK_ENTRIES` static data | ⚠️ Uses "Nextination" in one prompt string |
| `/settings` | `src/app/(app)/(workspace)/settings/page.tsx` | `SettingsForm` | `getProfile()` | ⬜ Not inspected |
| `/settings/privacy` | `src/app/(app)/(workspace)/settings/privacy/page.tsx` | Not inspected | API calls | ⬜ Not inspected |
| `/nextinations` | `src/app/(app)/(workspace)/nextinations/page.tsx` | Not inspected | `COUNTRIES` | ⬜ Not inspected |
| `/nextinations/[slug]` | `src/app/(app)/(workspace)/nextinations/[slug]/page.tsx` | Redirect → `/nextinations/[slug]/v2/overview` | — | — |
| `/nextinations/[slug]/v2/[section]` | `src/app/(app)/(workspace)/nextinations/[countrySlug]/v2/[section]/page.tsx` | `CountryTemplate`, `CountryResearchPage` | Country content lib | ⚠️ Metadata uses "Nexit" |
| `/visa-wizard` | `src/app/(app)/(workspace)/visa-wizard/page.tsx` | Not inspected | — | ⬜ Not inspected |

### API routes

| Route | File | Purpose |
|---|---|---|
| `POST /api/login` | `src/app/api/login/route.ts` | Authentication |
| `POST /api/logout` | `src/app/api/logout/route.ts` | Session termination |
| `GET/PUT /api/profile` | `src/app/api/profile/route.ts` | Profile read/write |
| `GET/POST /api/plan` | `src/app/api/plan/route.ts` | Plan read/write |
| `GET /api/countries` | `src/app/api/countries/route.ts` | Country data |
| `POST /api/account/change-password` | `src/app/api/account/change-password/route.ts` | Account security |
| `POST /api/account/data-export` | `src/app/api/account/data-export/route.ts` | Data portability |
| `POST /api/account/deletion-request` | `src/app/api/account/deletion-request/route.ts` | Account deletion |
| `POST /api/account/sign-out-all` | `src/app/api/account/sign-out-all/route.ts` | Session management |

---

## 3. Screen and component inventory

### 3.1 Shared shell (KolmariAppShell)

**Route protection:** All workspace routes use `KolmariAppShell` via `src/app/(app)/(workspace)/layout.tsx`.

**Architecture:**
- `KolmariAppShell` (`src/components/layout/kolmari-app-shell.tsx`) — thin boundary wrapper
- delegates to `WorkspaceShell` (`src/components/nexit/workspace-shell.tsx`) — routes conditionally to country-template chrome or the new AppShell
- `AppShell` (`src/components/nexit/app-shell.tsx`) — full client component, the real implementation

**AppShell capabilities:**
- Desktop collapsible sidebar (248px expanded / 60px collapsed)
- localStorage persistence of collapse state (`kolmari:sidebar-collapsed`, migrates from `nexit:sidebar-collapsed`)
- Mobile drawer with focus trap and Escape key close
- Top bar with notifications dropdown and user account menu
- Logout via `POST /api/logout`
- Profile readiness footer panel in sidebar
- Country section sub-tree (collapsible per saved country)
- Saved destinations sourced from `useNextinationBoard()` (localStorage)

**Current sidebar navigation structure (as implemented):**

```
[Wordmark: /brand/NexitWordMark.svg — legacy filename]

Dashboard                → /dashboard

[EXPLORE group label]
[NAV_EXPLORE — REFERENCE BUG: array does not exist; likely intended as NAV_DISCOVER]
  Dashboard              → /dashboard  (duplicated)

Your World               → /nexitnation  (expandable, shows region sub-list)

[MY NEXIT group label — legacy terminology]
  My Nextinations        → collapsible, shows saved country tree

[TOOLS group label]
  Cost Calculator        → /cost-calculator
  Greenbook              → /greenbook

[Bottom / Settings group]
  Settings               → /settings
  Profile                → /profile-wizard
```

**Sidebar defects identified:**
1. `NAV_EXPLORE` array is referenced at line 265 but never defined — only `NAV_DISCOVER` exists (defines `Dashboard`). This is a bug that will cause a runtime error.
2. The group label at line 313 still reads `"My Nexit"` — should be updated to the approved Kolmari navigation.
3. The approved sidebar from `docs/kolmari/04-LAYOUTS.md` specifies a PLAN group (`Pathways`, `My Plan`, `Flutter Mode`, `Documents`) and a CONNECT group (`Kolmari Klub`). None of these are rendered from the NAV arrays.
4. The wordmark image points to `/brand/NexitWordMark.svg` — this is an asset that may not exist; the brand assets config lists `/brand/KolmariWordMark.svg` as the target.

**Approved sidebar (not yet implemented):**

```
Dashboard

EXPLORE
  Your World      → /nexitnation
  Destinations    → /saved

PLAN
  Pathways        → /pathways
  My Plan         → /nexit-plan
  Flutter Mode    → /flutter
  Documents       → /documents

CONNECT
  Kolmari Klub    → /community

TOOLS
  Cost Calculator → /cost-calculator
  Greenbook       → /greenbook
  Settings        → /settings
```

---

### 3.2 Dashboard

**Route:** `/dashboard`
**File:** `src/app/(app)/(workspace)/dashboard/page.tsx`
**Rendering:** Server component
**Data sources:**
- `getProfile(user.id)` → display name, wizard status
- `getNexitPlan(user.id)` → plan stage, checklist, budget
- `evaluatePathways(profile)` → Pathways signal count
- `COUNTRIES[]` → first 3 countries for discovery section

**Sections:**
1. Page header — user first name, primary CTA (Enter Flutter Mode / Build My Move Plan)
2. Profile incomplete notice (conditional)
3. Stat cards row — Kolmari Profile, Pathways signals, Plan stage, Saved tasks
4. Destinations to explore — first 3 from `COUNTRIES`, link to `/nexitnation?view=countries`
5. Move Timeline card — `ScoreRing` with plan progress, links to `/flutter`
6. Budget snapshot card — `BudgetDonut`, links to `/cost-calculator`
7. Pathways section — strong match list or profile-incomplete state

**Existing components reused:**
- `ScoreRing` (`src/components/nexit/rings.tsx`)
- `BudgetDonut` (`src/components/nexit/rings.tsx`)

**Kolmari copy status:** ✅ Mostly Kolmari. One remaining legacy internal link: `href="/nexit-plan"` on the Plan stage stat card.

**Empty states:** ✅ Present for plan, budget, Pathways

**Mock data risk:** None — all data is live from server

---

### 3.3 Your World (Nexitnation)

**Route:** `/nexitnation`
**File:** `src/app/(app)/(workspace)/nexitnation/page.tsx`
**Primary component:** `KolmariWorldBoard` (`src/components/nexit/KolmariWorldBoard.tsx`)
**Map component:** `DestinationMap` (`src/components/nexit/DestinationMap.tsx`)
**Data sources:**
- `getProfile(user.id)` → profile completion, `wizard_status`
- `calculateRegionMatches(profile)` → per-region match percentages
- `useNextinationBoard()` hook → saved destinations from localStorage

**Features:**
- Interactive SVG world map (6 clickable region polygons) — server-safe, no Mapbox
- Add destination search (city/country lookup from `src/lib/world-places.ts`)
- Status chips (Researching / Shortlisted)
- Saved destinations row
- Per-destination detail panel with notes, status update, remove

**Defects identified:**
1. The page imports `NexitWorldBoard` which does not exist in the repository. The actual component is `KolmariWorldBoard`. This will cause a build/runtime error.
2. Page metadata still reads `"Nexit World | Nexit"` — should be `"Your World | Kolmari"`.
3. `DestinationMap.tsx` imports from `'@/lib/Destination-data'` which does not exist (should be `nexitnation-data`). This is a broken import.
4. `KolmariWorldBoard.tsx` contains broken imports: `'Destination/link'`, `'@/components/Kolmari/DestinationMapLoader'`, `'@/lib/Destinationination-board'`, `'@/lib/Destination-data'`. This file appears to have been partially migrated and contains corrupted import paths.

---

### 3.4 Your World — Region page

**Route:** `/nexitnation/[region]`
**File:** `src/app/(app)/(workspace)/nexitnation/[region]/page.tsx`
**Data sources:**
- `getProfile(user.id)`
- `calculateRegionMatches(profile)`
- `regions[slug]` from `src/lib/nexitnation-data.ts`

**Sections:**
1. Breadcrumb: Your World → Region name
2. Region hero image with match score chip and indicators
3. Countries grid — `CountryShapePanel` cards
4. Pathways and Greenbook CTA sections
5. Passport Index link (external research resource, outbound only)
6. Full-width CTA to Flutter Mode

**Kolmari copy status:** ✅ Mostly Kolmari. Uses `NEXIT_LEXICON` (compatibility alias) for labels — this resolves to Kolmari terms correctly.

---

### 3.5 Destinations (Saved)

**Route:** `/saved`
**File:** `src/app/(app)/(workspace)/saved/page.tsx`
**Component:** `SavedNextinations` (`src/components/nexit/saved-nextinations.tsx`)
**Data source:** localStorage (`kolmari-saves` with fallback read from `nexit-saves`)
**Kolmari copy status:** ✅ Page header uses "Destinations"

---

### 3.6 Country detail (legacy `/countries/[slug]`)

**Route:** `/countries/[slug]`
**File:** `src/app/(app)/(workspace)/countries/[slug]/page.tsx`
**Data sources:**
- `COUNTRIES[]` — static country data
- `getProfile(user.id)` — profile completion state
**Features:** Hero, Pathways card, "Why it could fit" card, comparison CTA rail, `SaveNextinationButton`, `PassportIndexLink`

**Kolmari copy status:** ✅ Copy is clean. Uses "Destination" and "Pathways" language correctly.

---

### 3.7 Country workspace (full `/nextinations/[slug]/v2/[section]`)

**Route:** `/nextinations/[countrySlug]/v2/[section]`
**File:** `src/app/(app)/(workspace)/nextinations/[countrySlug]/v2/[section]/page.tsx`
**Components:**
- `CountryTemplate` (`src/components/country-template/CountryTemplate.tsx`)
- `CountryResearchPage` (`src/components/nexit/CountryResearchPage.tsx`)
- `CountryResearchShell` (`src/components/country-template/CountryResearchShell.tsx`)
- Tab components: `OverviewTab`, `MoveThereTab`, `CostHousingTab`, `WorkStudyTab`, `HealthcareTab`, `FamilySchoolsTab`, `LifestyleTab`, `TaxMoneyTab`

**Available sections (v2 template):** overview, move-there, cost-housing, work-study, healthcare, family-schools, lifestyle-community, tax-money

**Tab system (full workspace, `src/lib/country-workspace/tabs.ts`):** 16 sections — overview, why-you, economic-profile, cost-of-living, pathways, healthcare, greenbook, housing, legal-taxes, employment, transportation, daily-life, education, family-pets, resources, compare

**Defect:** Metadata still uses "Nexit" in `generateMetadata` (`"Nextination Not Found | Nexit"`, `"[country] — [label] | Nexit"`).

---

### 3.8 Pathways

**Route:** `/pathways`
**File:** `src/app/(app)/(workspace)/pathways/page.tsx`
**Component:** `PathwaysResults` (`src/components/nexit/pathways-results.tsx`)
**Data sources:** `getProfile()`, `evaluatePathways()`, `PATHWAYS[]`
**Kolmari copy status:** ✅ Metadata uses "Kolmari"

---

### 3.9 My Plan

**Route:** `/nexit-plan`
**File:** `src/app/(app)/(workspace)/nexit-plan/page.tsx`
**Component:** `NexitPlanWorkspace` (`src/components/nexit/nexit-plan-workspace.tsx`)
**Data sources:** `getProfile()`, `getNexitPlan()`, `COUNTRIES[]`, `PATHWAYS[]`
**DB table:** `nexit_plans` — do not rename
**Kolmari copy status:** ✅ Metadata uses "My Plan | Kolmari"

---

### 3.10 Flutter Mode

**Route:** `/flutter`
**File:** `src/app/(app)/(workspace)/flutter/page.tsx`
**Component:** `NexitPlanWorkspace` (same as My Plan, `defaultTab="checklist"`)
**Data sources:** Same as My Plan
**Kolmari copy status:** ✅ Metadata uses "Flutter Mode | Kolmari"

**Note:** Flutter Mode and My Plan currently share the same `NexitPlanWorkspace` component. A future milestone may create a dedicated Flutter Mode component with a more focused execution view.

---

### 3.11 Documents

**Route:** `/documents`
**File:** `src/app/(app)/(workspace)/documents/page.tsx`
**Component:** `DocumentsManager` (`src/components/nexit/documents-manager.tsx`)
**Data source:** Client state only — no backend storage yet
**Kolmari copy status:** ⬜ Not inspected

---

### 3.12 Kolmari Klub (Community)

**Route:** `/community`
**File:** `src/app/(app)/(workspace)/community/page.tsx`
**Components:**
- `KlubHeader` (`src/components/community/klub-header.tsx`) — Server-safe
- `KlubEmptyState` (`src/components/community/klub-header.tsx`) — Server-safe
- `KlubTabs` (`src/components/community/klub-tabs.tsx`) — Client component

**Data source:** None — all tabs show honest empty states
**Kolmari copy status:** ✅ Full Kolmari copy throughout
**Tab panels:** Chatter (empty), Discover Klubs (empty), My Klubs (empty)

**Pilot readiness:**
- ✅ KlubHeader implemented
- ✅ KlubEmptyState implemented
- ✅ KlubTabs with accessible role/aria attributes
- ✅ Three tab panels with honest empty states
- ✅ Related actions section (Greenbook Insights, Your World)
- ⚠️ `KlubHeader` is marked `'use client'` unnecessarily — it has no client state

---

### 3.13 Cost Calculator

**Route:** `/cost-calculator`
**File:** `src/app/(app)/(workspace)/cost-calculator/page.tsx`
**Component:** `CostCalculator` (`src/components/nexit/cost-calculator.tsx`)
**Data source:** `getProfile()` (income only)
**Kolmari copy status:** ⬜ Not inspected

---

### 3.14 Greenbook

**Route:** `/greenbook`
**File:** `src/app/(app)/(workspace)/greenbook/page.tsx`
**Data source:** `GREENBOOK_ENTRIES` (`src/lib/greenbook.ts`) — static data
**Rendering:** `'use client'` (full page — tag filter requires state)
**Kolmari copy status:** ⚠️ One legacy copy: "Apply context to a specific Nextination" — should be "Destination"

**Note:** The entire page is a client component due to tag filtering. Consider extracting only the filter button group as a client component and rendering the entry grid server-side.

---

### 3.15 Settings

**Route:** `/settings`
**File:** `src/app/(app)/(workspace)/settings/page.tsx`
**Component:** `SettingsForm` (`src/components/nexit/settings-form.tsx`)
**Data source:** `getProfile()`, `requireCurrentUser()`
**Kolmari copy status:** ⬜ Not inspected

---

### 3.16 Welcome (onboarding entry)

**Route:** `/welcome`
**File:** `src/app/(app)/welcome/page.tsx`
**Component:** `WelcomeActions` (`src/components/nexit/welcome-actions.tsx`)
**Data source:** `getProfile()`, redirects by wizard_status
**Kolmari copy status:** ✅ "Welcome to Kolmari", "Build Your Move Plan", "Kolmari Profile" language

---

### 3.17 Profile wizard

**Route:** `/profile-wizard`
**File:** `src/app/(app)/profile-wizard/page.tsx`
**Component:** `ProfileWizard` (`src/components/nexit/profile-wizard.tsx`)
**Data source:** `getProfile()`
**Kolmari copy status:** ⬜ Not inspected

---

### 3.18 Landing page (marketing)

**Route:** `/`
**File:** `src/app/(marketing)/page.tsx`
**Components:** `MarketingLogo`, `MarketingMobileNav`, `QuestionsSection`
**Data source:** Static — no server data
**Kolmari copy status:** ✅ Kolmari language throughout

---

### 3.19 Quiz (marketing)

**Route:** `/quiz`
**File:** `src/app/(marketing)/quiz/page.tsx`
**Rendering:** `'use client'`
**Data source:** localStorage (`nexit-quiz-result` — legacy key)
**Kolmari copy status:** ⚠️ Function still named `NexitQuizPage`; localStorage key is `nexit-quiz-result`

---

### 3.20 Authentication pages

| Route | Kolmari copy |
|---|---|
| `/login` | ✅ "Continue your Move Plan", "Progress Tracker" |
| `/signup` | ✅ "Build My Move Plan", "Kolmari workspace" |

---

## 4. Reusable component inventory

### Existing components (src/components/nexit/)

| Component file | Purpose | Server/Client | Migration priority |
|---|---|---|---|
| `app-shell.tsx` | Full workspace shell — sidebar, topbar, mobile drawer | Client | 🔴 Has bugs (NAV_EXPLORE undefined, group labels) |
| `workspace-shell.tsx` | Routes between country-template chrome and AppShell | Client | ⬜ Low |
| `wordmark.tsx` | Renders brand SVG/PNG | Server | ⬜ Low |
| `rings.tsx` | `ScoreRing`, `BudgetDonut` | Server | ⬜ Low |
| `profile-wizard.tsx` | Multi-step profile wizard | Client | 🟡 Medium |
| `nexit-plan-workspace.tsx` | Move Plan + Flutter Mode workspace | Client | 🟡 Medium |
| `pathways-results.tsx` | Pathways evaluation display | Mixed | 🟡 Medium |
| `saved-nextinations.tsx` | Destinations list + save/remove | Client | 🟡 Medium |
| `settings-form.tsx` | Account settings | Client | ⬜ Low |
| `documents-manager.tsx` | Document upload/list | Client | ⬜ Low |
| `checklist.tsx` | Checklist items | Client | ⬜ Low |
| `cost-calculator.tsx` | Budget calculator | Client | ⬜ Low |
| `auth-form.tsx` | Login/signup form | Client | ⬜ Low |
| `welcome-actions.tsx` | Welcome page CTA actions | Client | ⬜ Low |
| `countries-browser.tsx` | Country search and browse | Client | ⬜ Low |
| `KolmariWorldBoard.tsx` | World board + map + saved destinations | Client | 🔴 Has broken imports |
| `DestinationMap.tsx` | SVG world map | Server | 🔴 Has broken import |
| `NexitnationMapbox.tsx` | Mapbox map | Client | ⬜ Low |
| `NexitnationMapLoader.tsx` | Async Mapbox loader | Client | ⬜ Low |
| `CountryResearchPage.tsx` | Country research shell | Mixed | ⬜ Low |
| `CountryShapePanel.tsx` | Country shape artwork | Server | ⬜ Low |
| `MapboxMap.tsx` | Mapbox integration | Client | ⬜ Low |
| `marketing-logo.tsx` | Marketing page logo | Server | ⬜ Low |
| `marketing-mobile-nav.tsx` | Marketing mobile nav | Client | ⬜ Low |
| `questions-section.tsx` | Landing page Q&A section | Server | ⬜ Low |
| `landing-mini-experiences.tsx` | Landing features | Server | ⬜ Low |
| `privacy-account-page.tsx` | Privacy/account settings | Client | ⬜ Low |
| `PassportIndexLink.tsx` | Outbound passport research link | Server | ⬜ Low |
| `nexit-world.tsx` | World exploration (legacy) | Client | ⬜ Low |
| `use-saved-nextinations.ts` | Saved nextinations hook | Client | ⬜ Low |

### Community components (src/components/community/) — Milestone 2 deliverables

| Component | Purpose | Server/Client | Status |
|---|---|---|---|
| `klub-header.tsx` | Kolmari Klub page header + empty state | Incorrectly `'use client'` | ✅ Implemented |
| `klub-tabs.tsx` | Tab navigation for Klub sections | Client (correct) | ✅ Implemented |

**Gap:** `docs/kolmari/03-COMPONENTS.md` lists `DiscoverKlubs`, `MyKlubs`, `ChatterFeed` as separate components in `src/components/community/`. These are currently inline functions inside `klub-tabs.tsx`.

### Country workspace components (src/components/country-workspace/)

Full 16-tab workspace used for `/nextinations/[slug]` routes. Status: existing and functional, legacy "Nexit" terminology may remain in tab content copy.

### Country template components (src/components/country-template/)

Alternative template layout (v2) with fewer tabs (8 sections), hero, sidebar, tab bar, right rail. Used for Portugal and other v2-enabled countries.

---

## 5. Data source and persistence inventory

### Database (Neon Postgres — do not rename)

| Table | Key fields | Used by |
|---|---|---|
| `users` | `id`, `email`, `password_hash` | Auth everywhere |
| `profiles` | `user_id`, `wizard_status`, 28+ fields | Profile wizard, dashboard, pathways, regions |
| `nexit_plans` | `user_id`, `timeline_stage`, `checklist`, `budget`, `documents`, etc. | My Plan, Flutter Mode, dashboard |

### Authentication

| Item | Value | Safe to rename? |
|---|---|---|
| JWT issuer | `'nexit'` (in `src/lib/auth-constants.ts`) | No — invalidates all sessions |
| Session cookie | `nexit_session` | No — invalidates all sessions |
| Auth routes | `/api/login`, `/api/logout`, `/api/profile` | No |

### localStorage keys

| Key | Purpose | Migration status |
|---|---|---|
| `kolmari:sidebar-collapsed` | Sidebar collapse state | ✅ New key, reads legacy `nexit:sidebar-collapsed` |
| `nexit:sidebar-collapsed` | Legacy sidebar collapse | ✅ Removed after migration |
| `kolmari-saves` | Saved destinations (board) | ✅ New key (via `useNextinationBoard`) |
| `nexit-saves` | Legacy saved nextinations | ⬜ Compatibility read needed |
| `nexit-quiz-result` | Quiz answers | ⚠️ Legacy key — should migrate to `kolmari-quiz-result` with shim |

### Static data files

| File | Purpose |
|---|---|
| `src/lib/countries.ts` | COUNTRIES array — all destinations |
| `src/lib/nexitnation-data.ts` | Region configs, shapes, labels |
| `src/lib/pathways.ts` | PATHWAYS array |
| `src/lib/greenbook.ts` | GREENBOOK_ENTRIES |
| `src/lib/world-places.ts` | Searchable cities/countries |
| `src/lib/regionData.ts` | Region data |
| `src/lib/seoContent.ts` | SEO page content |
| `public/data/continents.geojson` | Map polygon data |

---

## 6. Critical defects found during inventory

These are **bugs** (not just migration tasks) that affect the application:

### Bug 1: `NAV_EXPLORE` undefined in app-shell.tsx

**File:** `src/components/nexit/app-shell.tsx` line 265
**Problem:** `NAV_EXPLORE.map(...)` is called but `NAV_EXPLORE` is never defined. Only `NAV_DISCOVER` exists and contains only `Dashboard`. This will cause a runtime `ReferenceError` when the sidebar renders.
**Severity:** 🔴 Critical — will break the workspace shell

### Bug 2: `NexitWorldBoard` import doesn't exist

**File:** `src/app/(app)/(workspace)/nexitnation/page.tsx` line 2
**Problem:** `import { NexitWorldBoard } from '@/components/nexit/NexitWorldBoard'` — this file does not exist. The actual component is `KolmariWorldBoard` in `KolmariWorldBoard.tsx`.
**Severity:** 🔴 Critical — will break the Your World route

### Bug 3: Broken imports in `KolmariWorldBoard.tsx`

**File:** `src/components/nexit/KolmariWorldBoard.tsx`
**Problem:** Multiple import paths are corrupted with "Destination" substitutions that don't match the actual file system:
- `import Link from 'Destination/link'` — should be `'next/link'`
- `import { DestinationMapLoader } from '@/components/Kolmari/DestinationMapLoader'` — file does not exist
- `import { ... } from '@/lib/Destinationination-board'` — should be `@/lib/nextination-board`
- `import type { RegionSlug } from '@/lib/Destination-data'` — should be `@/lib/nexitnation-data`
**Severity:** 🔴 Critical — will break build

### Bug 4: Broken import in `DestinationMap.tsx`

**File:** `src/components/nexit/DestinationMap.tsx` line 3
**Problem:** `import { ... } from '@/lib/Destination-data'` — file does not exist (should be `nexitnation-data`)
**Severity:** 🔴 Critical — will break build

### Bug 5: Syntax errors in `SidebarNav` (app-shell.tsx)

**File:** `src/components/nexit/app-shell.tsx` around lines 330–342
**Problem:** The `SidebarNav` function has unclosed JSX: a `<>` fragment opened inside the My Nextinations button is never closed, and there are duplicate `savedCountries` / `savedItems` variable references suggesting the code was partially merged or partially edited.
**Severity:** 🔴 Critical — will break TypeScript compilation

---

## 7. Legacy terminology remaining in source code

The following legacy terms were observed during inspection. They are classified below.

### Visible public copy (page-level)

| File | Legacy term | Location | Priority |
|---|---|---|---|
| `src/app/(app)/(workspace)/nexitnation/page.tsx` | "Nexit World \| Nexit" | Metadata title | 🟡 Medium |
| `src/app/(app)/(workspace)/nextinations/[countrySlug]/v2/[section]/page.tsx` | "Nextination Not Found \| Nexit", "[country] \| Nexit" | Metadata | 🟡 Medium |
| `src/app/(app)/(workspace)/greenbook/page.tsx` | "Nextination" | Prompt string line 99 | 🟡 Medium |
| `src/app/(marketing)/quiz/page.tsx` | `NexitQuizPage` (function name) | Export | 🟢 Low |

### Route paths (intentional compatibility — do not rename)

- `/nexitnation`, `/nexitnation/[region]` — future target: `/world`
- `/nexit-plan` — future target: `/plan`
- `/nextinations/[slug]` — future target: `/destinations/[slug]`

### Component file and function names (internal identifiers)

- `src/components/nexit/` directory — entire directory
- `NexitPlanWorkspace`, `PathwaysResults`, `SavedNextinations`, etc. — internal names
- `getNexitPlan`, `saveNexitPlan`, `emptyNexitPlan` — lib functions
- `NexitPlan` type in `src/lib/nexit-plan.ts`

### Database and API (must not rename)

- `nexit_plans` table
- `nexit_session` cookie
- `TOKEN_ISSUER = 'nexit'`

### Documentation (intentional historical references)

- `DESIGN.md` — legacy Nexit design document (to be superseded by `docs/kolmari/01-DESIGN.md`)
- `docs/nexit/` directory — entire legacy documentation tree

---

## 8. Missing features and gaps

| Feature | Status | Notes |
|---|---|---|
| Community / Kolmari Klub (real data) | Not implemented | Honest empty state shown |
| Document backend storage | Not implemented | Client state only |
| Move Readiness score calculation | Partial | `calculateReadiness()` exists but dashboard shows profile complete/not started only |
| Greenbook community-reported entries | Not implemented | Empty state shown |
| Kolmari butterfly brand asset | `/brand/kolmari-butterfly.png` — not confirmed present | Referenced in `brand-assets.ts` |
| Kolmari wordmark SVG | `/brand/KolmariWordMark.svg` — not confirmed present | Sidebar still uses `/brand/NexitWordMark.svg` |
| Flutter Mode dedicated UI | Partial | Same component as My Plan with defaultTab |
| Route redirects (legacy → new) | Not implemented | Phase deferred |

---

## 9. Assets inventory

### Public brand assets (src/config/brand-assets.ts references)

| Asset | Path | Present? |
|---|---|---|
| Kolmari wordmark | `/brand/KolmariWordMark.svg` | ⬜ Not confirmed |
| Kolmari wordmark (fallback) | `/brand/NexitWordMark.svg` | Likely present (used in sidebar) |
| Kolmari butterfly | `/brand/kolmari-butterfly.png` | ⬜ Not confirmed |
| App icon | `/brand/nexit-app-icon.png` | Likely present |
| Favicon SVG | `/brand/faviconNexit.svg` | Likely present |
| Favicon 32px | `/brand/favicon-32.png` | Present (used in quiz) |
| Favicon 16px | `/brand/favicon-16.png` | Likely present |
| Favicon ICO | `/brand/favicon.ico` | Likely present |

### Scene imagery

All listed in `BRAND_ASSETS.ts` — relocation imagery is brand-neutral and retained.

---

## 10. Recommended migration order

Based on risk, data complexity, and existing state:

### Immediate (bug fixes — not migration tasks)

1. **Fix `NAV_EXPLORE` undefined** in `app-shell.tsx` — critical runtime bug
2. **Fix `NexitWorldBoard` import** in nexitnation page — critical build bug
3. **Fix broken imports** in `KolmariWorldBoard.tsx` and `DestinationMap.tsx`
4. **Fix `SidebarNav` JSX syntax** in `app-shell.tsx`
5. **Fix `KlubHeader` client directive** — remove unnecessary `'use client'`
6. **Run typecheck, lint, and build** to confirm zero errors before proceeding

### Phase 2 — Pilot (Kolmari Klub, after bug fixes pass)

7. Confirm `/community` page meets all pilot criteria from the migration plan
8. Extract `ChatterFeed`, `DiscoverKlubs`, `MyKlubs` into `src/components/community/` per `03-COMPONENTS.md`

### Phase 3 — Low-risk pages

9. Dashboard — add missing Kolmari copy tweaks, fix `/nexit-plan` link to `/nexit-plan` (intentional for now — route not yet migrated)
10. Settings — inspect and update copy
11. Cost Calculator — inspect and update copy
12. Documents — inspect and update copy

### Phase 4 — Core planning pages

13. Greenbook — fix "Nextination" → "Destination" copy, extract client filter component
14. Pathways — inspect and update copy
15. My Plan (`/nexit-plan`) — inspect component copy
16. Flutter Mode — consider dedicated component
17. Destinations (`/saved`) — inspect component copy

### Phase 5 — Higher-risk pages

18. Your World (`/nexitnation`) — fix all bugs first, then migrate metadata
19. Destination detail pages (`/nextinations/[slug]`) — fix metadata, align copy
20. Profile wizard
21. Quiz (`/quiz`) — fix localStorage key, update function name

### Phase 6 — Routes, SEO, marketing

22. Route redirects (legacy → Kolmari canonical)
23. Metadata and SEO cleanup
24. Landing page review
25. Documentation cleanup

---

## 11. Recommended pilot page assessment

**Kolmari Klub (`/community`) is the most advanced page for a pilot**, per the migration plan:

| Criterion | Status |
|---|---|
| Converted to TSX with named components | ✅ |
| Real data connected | N/A — honest empty state |
| No public "Nexit" copy | ✅ |
| Accessible tabs with role/aria | ✅ |
| Empty states | ✅ |
| Mobile-responsive | ⬜ Not verified |
| Sidebar active state | ⬜ Depends on sidebar fix |
| typecheck passes | ⬜ Pending (blocked by critical bugs) |
| lint passes | ⬜ Pending |
| Build passes | ⬜ Blocked by critical bugs in shell/world |

**Blocker:** The critical bugs in `app-shell.tsx` and `KolmariWorldBoard.tsx` must be fixed before any page can pass a production build check.

---

## 12. Files inspected

| File | Purpose |
|---|---|
| `DESIGN.md` | Legacy Nexit design reference |
| `docs/kolmari/00-README.md` | Kolmari product overview |
| `docs/kolmari/01-DESIGN.md` | Kolmari design system |
| `docs/kolmari/02-DESIGN-TOKENS.md` | Token reference |
| `docs/kolmari/03-COMPONENTS.md` | Component contracts |
| `docs/kolmari/04-LAYOUTS.md` | Layout specifications |
| `docs/kolmari/05-PAGE-TEMPLATES.md` | Page templates |
| `docs/kolmari/06-ADAPTIVE-WORKSPACE.md` | Country workspace rules |
| `docs/kolmari/07-DATA-MODEL.md` | Data and persistence |
| `docs/kolmari/08-CONTENT-STANDARDS.md` | Content standards |
| `docs/kolmari/09-IMPLEMENTATION-RULES.md` | Implementation rules |
| `docs/kolmari/10-LLM-RULES.md` | AI contributor rules |
| `docs/kolmari/REBRAND-MIGRATION.md` | Migration strategy |
| `docs/kolmari/REPLACEMENT-MATRIX.md` | Term mapping |
| `docs/kolmari/ROUTE-MIGRATION.md` | Route plan |
| `docs/kolmari/HTML-INTEGRATION.md` | HTML integration rules |
| `docs/kolmari/MIGRATION-CHECKLIST.md` | Phase checklist |
| `docs/kolmari/LEGACY-REFERENCE-AUDIT.md` | Legacy audit |
| `src/config/brand.ts` | Kolmari brand config |
| `src/config/product-copy.ts` | Product copy config |
| `src/config/brand-assets.ts` | Asset paths |
| `src/lib/lexicon.ts` | Kolmari lexicon + compatibility aliases |
| `src/lib/nexit-plan.ts` | Plan lib + DB schema |
| `src/lib/nexitnation-data.ts` | Region data |
| `src/lib/profile.ts` | Profile types and DB access |
| `src/components/layout/kolmari-app-shell.tsx` | Kolmari shell boundary |
| `src/components/nexit/app-shell.tsx` | AppShell implementation |
| `src/components/nexit/workspace-shell.tsx` | Workspace routing shell |
| `src/components/nexit/KolmariWorldBoard.tsx` | World board component |
| `src/components/nexit/DestinationMap.tsx` | SVG world map |
| `src/components/nexit/welcome-actions.tsx` | Welcome CTA actions |
| `src/components/community/klub-header.tsx` | Klub header + empty state |
| `src/components/community/klub-tabs.tsx` | Klub tab navigation |
| `src/app/(app)/(workspace)/layout.tsx` | Workspace layout |
| `src/app/(app)/(workspace)/dashboard/page.tsx` | Dashboard page |
| `src/app/(app)/(workspace)/nexitnation/page.tsx` | Your World page |
| `src/app/(app)/(workspace)/nexitnation/[region]/page.tsx` | Region page |
| `src/app/(app)/(workspace)/community/page.tsx` | Kolmari Klub page |
| `src/app/(app)/(workspace)/saved/page.tsx` | Destinations page |
| `src/app/(app)/(workspace)/countries/[slug]/page.tsx` | Country detail |
| `src/app/(app)/(workspace)/pathways/page.tsx` | Pathways page |
| `src/app/(app)/(workspace)/nexit-plan/page.tsx` | My Plan page |
| `src/app/(app)/(workspace)/flutter/page.tsx` | Flutter Mode page |
| `src/app/(app)/(workspace)/documents/page.tsx` | Documents page |
| `src/app/(app)/(workspace)/greenbook/page.tsx` | Greenbook page |
| `src/app/(app)/(workspace)/cost-calculator/page.tsx` | Cost Calculator |
| `src/app/(app)/(workspace)/settings/page.tsx` | Settings page |
| `src/app/(app)/(workspace)/checklist/page.tsx` | Checklist redirect |
| `src/app/(app)/(workspace)/nextinations/[countrySlug]/page.tsx` | Country redirect |
| `src/app/(app)/(workspace)/nextinations/[countrySlug]/v2/page.tsx` | Country v2 index |
| `src/app/(app)/(workspace)/nextinations/[countrySlug]/v2/[section]/page.tsx` | Country v2 sections |
| `src/app/(app)/layout.tsx` | App layout |
| `src/app/(app)/welcome/page.tsx` | Welcome page |
| `src/app/(app)/profile-wizard/page.tsx` | Profile wizard |
| `src/app/(app)/onboarding/page.tsx` | Onboarding redirect |
| `src/app/(marketing)/page.tsx` | Landing page |
| `src/app/(marketing)/quiz/page.tsx` | Quiz page |
| `src/app/(auth)/login/page.tsx` | Login page |
| `src/app/(auth)/signup/page.tsx` | Signup page |

---

## 13. Next recommended assignment

**Fix the five critical bugs before proceeding to any page migration.**

The application will not build or run correctly until these are resolved:

1. `NAV_EXPLORE` undefined in `src/components/nexit/app-shell.tsx`
2. `NexitWorldBoard` import in `src/app/(app)/(workspace)/nexitnation/page.tsx`
3. Broken imports in `src/components/nexit/KolmariWorldBoard.tsx`
4. Broken import in `src/components/nexit/DestinationMap.tsx`
5. `SidebarNav` JSX syntax issues in `src/components/nexit/app-shell.tsx`

After fixes: run `npm run typecheck`, `npm run lint`, `npm run build`, and verify the workspace shell renders before marking Milestone 1 complete.

Do not begin the Kolmari Klub pilot or any page migration until the build is clean.
