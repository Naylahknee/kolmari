# Kolmari Current State

Running log of implemented page state. Update this file when application code changes.

## Your World map resilience — 2026-08-03

The main map on `/your-world` no longer depends on an account-specific Mapbox style or a public
token. It now follows the primary-discovery-map contract in `DESIGN.md`:

- The repository's existing six-region SVG geometry always renders with no external map request.
- Real matched-country coordinates are projected onto the illustrated board as linked markers.
- Each region and Destination marker is keyboard reachable, visibly focusable, and routes to its
  existing workspace; the card grid below remains the non-map path.
- An honest profile-completion state appears over the world board when no matched markers exist.
- Free accounts now receive the same illustrated map promised by the page; their markers omit
  paid Match Scores while retaining links to available Destination overviews.
- Detailed country, city, neighborhood, and Greenbook locator maps continue to use Mapbox.

## Decision Workspace home — 2026-08-03

The existing dashboard now begins with a bounded conversational doorway while preserving the
current visual system and all existing planning panels below it.

- `src/components/kolmari/decision-workspace-starter.tsx` adds one plain-language question field
  and six guided question routes for Destinations, Pathways, affordability, planning, community
  context, and documents.
- `src/lib/decision-routing.ts` classifies the submitted question deterministically and routes it
  to an existing Kolmari workflow. It does not answer the question, infer profile information,
  place user text in the URL, or persist the text.
- The dashboard remains server-rendered for profile and plan data. Only the question starter is a
  focused Client Component.
- Existing Dashboard recommendations, progress, Destinations, Pathway, deadlines, and Kolmari
  Tracker behavior remain unchanged.
- The welcome header now identifies the page as the user's decision workspace and explains that
  users can ask a question, continue research, or take the next planning step.
- The persistent shell field uses the same deterministic routing for Pathways, affordability,
  documents, community context, planning, and Destinations. Short Destination lookups become a
  Your World filter; question-like text is not placed in the URL.
- The shell records only the last major workspace route and its display label in browser-local
  storage. The dashboard uses that location for a `Continue where you left off` link. It does not
  store question text or update the Kolmari Profile.
- Your World now initializes its real catalog filter from the shell's `?q=` Destination lookup.

Validation for this slice:

- TypeScript (`npx tsc --noEmit`) passes.
- Focused ESLint passes for all changed application files; the existing TopBar image warning is
  unchanged.
- Fifteen focused intent, resume-route, URL-safety, and map-projection checks pass.
- An isolated Next.js render returned HTTP 200 and verified all six region links, a real
  Destination marker, its overview link, and no Mapbox dependency in the rendered map.
- The production Next.js build passes with local font responses replacing sandbox-blocked Google
  Fonts requests.
- The repository-wide lint command still reports 37 pre-existing errors in unrelated country-tab
  components and Flutter Mode; none are in this slice.

## Dashboard

**Layout.** Eyebrow + greeting, then a two-column flex row:

- Left content column (`flex:1; min-width:0`) stacks the dark *Recommended next action* hero
  (gradient `135deg,#0d1b39,#17305b 58%,#1b3f68`), the *Progress by planning area* card
  (two-column grid of labelled 5px bars), and a row of three cards — *Deadlines and blockers*,
  *Destinations*, *Active pathway* — on `repeat(auto-fit, minmax(252px, 1fr))`.
- Right drawer column holds the Kolmari Tracker and animates its own width, so the
  left column reflows wider whenever the tracker is collapsed.

Measurements follow `design-reference/claude-design/Kolmari-App-Reference.html.html`.
The stat-card row, budget donut, destination image tiles and *Stay on track* bar are no longer
on the Dashboard; `dashboard-destinations.tsx` was removed with them. The onboarding tour
anchors `#dashboard-progress` and `#dashboard-destinations` moved onto the tracker and the
Destinations card respectively, so the tour still resolves both steps.

**Kolmari Tracker.** `src/components/kolmari/journey-drawer.tsx` — a vertical, collapsible
progress drawer on the right edge. Expanded it is a 322px panel listing all eight plan stages
on a connector rail with per-stage task lists (one stage open at a time, the current stage open
by default). Collapsed it becomes a 56px rail carrying the stage dots and a `n/8` counter.
Width animates 322px ↔ 56px over `.42s cubic-bezier(.4,0,.2,1)`. Under the 900px workspace
breakpoint the row stacks, the panel is always visible, and the rail is not used.

Styles live in the `.k-journey*` block in `src/app/globals.css`, alongside the other shared
component styles. No new tokens were introduced — navy, gold, teal, line, and muted all come
from the existing `@theme` block.

The previous horizontal stepper (`kolmari-tracker.tsx`) has been removed; the journey now reads
top-to-bottom in the drawer only.

Expanded, the panel sits in normal flow so it defines the column height and the stage list is
never clipped by a shorter content column; collapsing lifts it out of flow so the column can
shrink to the rail.

Stage rows use the short display labels in `JOURNEY_STAGE_LABELS`
(Discover, Fit check, Compare, Decide, Plan, Apply, Move, Settle). These are display-only —
the values stored in `nexit_plans.timeline_stage` are unchanged, so no migration is involved.
My Plan still shows the stored names, which is a known inconsistency to resolve separately.

**Data.** Every value in the tracker is derived from persisted plan data by
`journeyStages()` and `journeyPercent()` in `src/lib/plan-types.ts`:

- Stage position comes from `nexit_plans.journey_stage`.
- Stage task lists come from the user's saved checklist items, grouped by `stage`.
- A task is *blocked* only when it carries a real due date that has already passed.
- Completion percent is fully-passed stages plus the share of the current stage's saved tasks
  that are done. A stage with no saved tasks reports that it has none — no filler tasks,
  no assumed partial credit.
- The footer timestamp is `nexit_plans.updated_at`, formatted in UTC on the server, and reads
  "Not saved yet" when the plan has never been saved.

**Validation.** `tsc --noEmit`, `eslint` (changed files), and `next build` all pass. Verified in
Chromium at 420px, 1024px, and 1440px in both expanded and collapsed states.

**Planning-area data.** Eligibility is `n/4` over profile-complete, destination, pathway and
move date. Documents is approved/total. Budget is entered/total cost lines. Housing and
Healthcare report whether that budget line carries a figure. Schools reflects a school-related
checklist task and is marked not applicable when the profile lists no dependents.

## Pathways

**Layout (top to bottom).** Navy header → section tab bar → visa journey tracker →
strongest signals → Match calculator → Explore all Pathways → Lesser-known routes →
sources note. The tabs (Journey / Signals / Match / All routes / Lesser-known) are
anchor links onto the sections below, using the shared `.k-tabbar` / `.k-tab` styles.

**Visa journey.** A six-step tracker for the destination saved on the plan: teal circle
with a check for done, gold ring for the current step, grey for upcoming, with the label
and a meta line under each. The "Gather documents" meta uses the real document counts from
the plan when any exist. Sequences live in `VISA_JOURNEYS` in
`src/lib/pathway-extras.ts`, keyed by country — a destination with no researched sequence
shows an empty state rather than another country's steps.

**Strongest signals.** Top three routes by fit, each showing category, fit badge, name,
country, and the first two signals the profile actually meets.

**Match calculator.** Monthly income and savings sliders, adults/children steppers, and a
"how you earn" select. Adjusting these recomputes every fit label on the page live. They
are exploratory only — nothing is written to the saved Kolmari Profile, and the card says
so with a Reset once any value differs.

**Explore all Pathways.** Category pill filters over the researched routes from
`src/lib/pathways.ts`, rendered as cards with the fit badge, signals-met count, a 2×2 fact
grid, and an expandable requirement ledger with the official source and verification date.
Only the single top-ranked route carries the gold border and "Best match" tag.

**Lesser-known routes.** `LESSER_KNOWN_ROUTES` in `src/lib/pathway-extras.ts`, ported
verbatim from the approved design reference. These carry no official source or verification
date yet, unlike the routes in `pathways.ts`, and the section says so — add a source and
`lastVerified` to each before treating any of it as researched guidance.

**Data integrity.** Fit labels come from the real `evaluatePathways`, run client-side so
the Match controls recompute live (`src/lib/profile.ts` is `server-only`, so the component
imports the profile type only and takes values from the client-safe `pathways.ts`). Labels
stay on Likely fit / Different route likely / Gap identified rather than the
"You Qualify" wording in the older prompt, since Kolmari does not assert visa eligibility.
Before the wizard is complete every route reports a gap; nothing is assumed.


## Flutter Mode

**What it is.** The execution phase. The plan is decided; fluttering is the doing —
working requirements off the list, tracking the application, and preparing to land. The
page says this in the header rather than assuming the user knows the term.

**Free (`isPaid` false).** `src/components/kolmari/flutter-gate.tsx` — upgrade banner,
"What the report covers" (the four report sections, structure shown openly), "Your quiz
results" with the top match readable and the rest locked, and the Kolmari Pro panel listing
what upgrading opens. Country names are free; the scoring behind them is not.

**Pro.** `src/components/kolmari/flutter-mode.tsx`, organised around The Waiting Room:

1. Header — what fluttering means, plus Share report / Edit timeline.
2. Kolmari Readiness dial with Legal & visa and Financial buffer bars, beside the navy
   Immediate priority card (deadline + Open My Plan).
3. Application status (self-reported pills) beside Move readiness.
4. Kolmari Protocol Checklist beside Greenbook Insights.
5. "A moment for the wait" reflection.
6. The Waiting Room accordions — Before you go, Documents, Finances, Housing,
   Shipping & customs, Winding down at home, Arrival day.
7. Saved Destinations.

**Data integrity.** Readiness is `readinessChecks()` — the share of setup milestones the
plan actually records. Legal & visa is approved/total documents; Financial buffer is
entered/total budget lines; both read "Not started" when the plan holds nothing. The
Immediate priority is `nextBestAction()`. Protocol items are the user's own checklist with
their real state (Complete / In progress / Overdue) — never an eligibility claim. Greenbook
uses the published insight for the saved destination and shows an empty state when none
exists. Application status is self-reported and stored client-side; Kolmari never sets it.
Waiting Room task completion persists through `PUT /api/profile` (`completed_tasks`), as
before — `checklist.tsx` was folded into `flutter-mode.tsx`.

## Country hero generation — reference-guided + direct upload

The Hero tab of the Country Page Generator Engine now matches an uploaded look
two ways. Root cause of the earlier mismatch: generation used OpenAI
text-to-image, which never sees a reference image. Fixes:

1. **Reference-guided generation.** A hero request carrying a `flagCode` (ISO-2)
   and/or `styleReferenceDataUrl` routes to `/v1/images/edits`: the country's own
   flag raster (`public/flags-png/{code}.png`) is the subject and the reference is
   a style exemplar, so the flag/emblem stay real and the fabric/shadow/silhouette
   look is copied. No image inputs → unchanged text-to-image path.
2. **Direct upload.** Hero and City tabs have an "upload finished art" card that
   saves the file as-is through the existing `POST /api/admin/country-asset`
   (Neon-backed, served by `/api/country-asset`) — no AI. `OPENAI_API_KEY` stays
   server-only; uploaded bytes travel only over the admin-only routes.

**Built-in style reference.** The approved National Flag Shadow Hero standard is
committed at `public/references/national-flag-shadow-hero.webp` and is sent to the
edits endpoint automatically as the default style exemplar whenever a hero is
generated with a flag code (no upload needed). An uploaded style reference
overrides it.

**Automated hero coverage (backfill + self-heal).** Country heroes no longer
depend on someone sitting in the admin panel:
- **Backfill** — the Hero tab has a "Generate all missing heroes" button that
  loops `POST /api/admin/country-hero/backfill` (admin-only; one hero per call
  with live progress) until every country in `src/lib/countries.ts` has a saved
  hero.
- **Self-heal** — when a country page renders with no saved hero, a small client
  trigger (`HeroAutoGenerate`) fires `POST /api/internal/country-hero/ensure`
  once. That endpoint validates the slug against the fixed COUNTRIES list,
  no-ops if a hero already exists, and uses a DB lock (`country_hero_jobs`) so at
  most one generation runs per country — capping total spend at one image per
  country regardless of traffic. The composite fallback shows meanwhile; the AI
  hero swaps in on the next render.
Both paths reuse `generateCountryHero`/`defaultHeroInput` in
`src/lib/country-visuals/generate.ts`. Only the decorative hero image is ever
auto-generated — page content and figures are never fabricated.
