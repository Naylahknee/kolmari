# Kolmari Current State

Running log of implemented page state. Update this file when application code changes.

## SLD engine now consumes the canonical core — 2026-10-09

`src/sld/` no longer carries its own fork of the engine. The canonical SLD core
is vendored byte-identical at `src/sld/core/` (pinned to `Naylahknee/SLD`
commit `921e11d`; `node scripts/sld-verify-core.mjs` fails CI on any drift).
Kolmari-specific rules (brand terms, travel-framing phrases, fabricated-data
patterns, governance paths) moved into `src/sld/manifest/kolmari.manifest.js`;
`src/sld/index.js` is a thin adapter re-exporting the core plus the manifest.
`npm run sld:test` runs kolmari's tests and the vendored core tests (176 green);
`next build` passes. No behavior change to the app itself.

## Kolmari Guide chat — 2026-09-28 (pending release)

Owner direction (chat, 2026-09-28): add a basic AI chat bot ("Kolmari Guide")
to logged-in pages. New `POST /api/chat` route: requires login (401
otherwise), validates the last 10 messages (1,000 chars each, last message
must be from the user), enforces 30 messages per user per day in a Neon
`chat_usage` table (auto-created on first use, no manual migration), and
calls the Meta Model API (`muse-spark-1.3`) with a compact profile context
(preferred regions, timeline, goals, etc.) when the user has a completed
quiz. Usage is counted only after a successful AI reply. New
`AskKolmariWidget` floating chat panel (navy/gold Kolmari branding, Enter to
send, 401 sign-in message, AI disclaimer line) mounted in the workspace
layout so it appears on all logged-in pages. Privacy policy names the Meta
Model API as the AI provider and what is sent to it. No SLD contract covers
this work; the stale `sld-031-canonical-governance-repair` contract was not
modified.

Manual steps required before the chat works in production:
(a) create a Meta Model API key at dev.meta.ai
(b) run `npx wrangler secret put MODEL_API_KEY`

## Region card art + region switcher — 2026-09-28 (pending release)

Owner direction (chat, 2026-09-28): replace the gold country-outline artwork.
Regions page country cards now use `RegionCountryArt`: the country's own photo
when one exists (Europe's Portugal/Spain/Greece/Estonia), otherwise a large
centered flag on navy with a letter fallback. The region hero already used
photography and was left alone.

All six region pages (Europe, Africa, Asia, North America, Latin America,
Oceania) render from the same dynamic route; a new region switcher tab bar
below the breadcrumb links them all, so none is Europe-only in practice.
Regions with no researched pathway data (Africa, Asia, Latin America) show the
honest research-in-progress note; North America shows Canada routes, Oceania
shows New Zealand routes.

## Passport buttons on regions page, Destinations reverted — 2026-09-28 (pending release)

Owner correction (chat, 2026-09-28): the passport buttons belong on the
regions page panels, not the Destinations browse page. The Destinations page
was reverted to its original card design (photo or flag top, no passport
button). No SLD contract covers this work; the stale
`sld-031-canonical-governance-repair` contract was not modified.

Regions page (`destinations/regions/[region]/page.tsx`): the "Destinations in
{region}" country panels are restored below the hero (country-shape art, flag +
city, pathway/community-fit/cost rows, "View Destination" gold button), each
carrying the "Passport power and visa-free access" button, which now opens the
research lightbox instead of a new tab. The "Visa routes in {region}" and
"Other relocation alternatives" research sections remain below the panels.

Destinations browse (`src/components/kolmari/destinations-explorer.tsx`):
restored byte-for-byte to the pre-change version (photo if available, else
flagcdn w160 flag with letter fallback; slide-over detail unchanged).

## Your World even cards, Destinations passport lightbox — 2026-09-28 (pending release)

Owner-directed (chat, 2026-09-28): (1) the Your World "Recommended for you"
country panels should be even height with no trailing white space; (2) the
Destinations page keeps its panels with the passport research button, but the
card tops show flags or country media images instead of country outlines;
(3) the passport button opens a lightbox instead of a new tab. No SLD contract
covers this work; the stale `sld-031-canonical-governance-repair` contract was
not modified.

Your World cards (`src/components/kolmari/your-world.tsx`): the "Recommended
for you" grid uses `items-stretch`, the cost/safety/match row has a fixed
minimum height so two-line safety text cannot shift the layout, and the
highlights icon row is pinned to the card bottom with `mt-auto`. All cards in a
row now render at the same height.

Destinations cards (`src/components/kolmari/destinations-explorer.tsx`):
- Card tops show the generated country photo when available, otherwise a large
  centered flag on the navy gradient (the country-outline art from the earlier
  change was removed per owner direction).
- Every card now carries the dark "Passport power and visa-free access" button
  at the bottom of the panel.

Passport lightbox (`src/components/kolmari/PassportIndexLink.tsx`): new
optional `lightbox` mode renders the compact passport button so it opens a
Kolmari-styled research lightbox (what to check: mobility score/rank,
visa-free count, advance-visa targets) with a gold "Open Passport Index" CTA to
the country's Passport Index page. Passport Index sends
`X-Frame-Options: SAMEORIGIN`, so the content cannot be iframed; the lightbox
links out instead of rendering a blocked frame. Escape, backdrop click, and
scroll-lock are handled. The banner variant (regions page) keeps the new-tab
behavior.

## Visa panel, regions research page, card art, OpenFreeMap — 2026-09-28 (pending release)

Owner-directed (chat, 2026-09-28): (1) the dashboard visa options panel should
sit right below the country cards and widen/narrow with the Journey panel;
(2) the regions page becomes a visa + relocation-alternatives research page;
(3) destination card art should be consistent; (4) decide the map tool for Your
World and the Country Snapshot mini maps. No SLD contract covers this work; the
stale `sld-031-canonical-governance-repair` contract was not modified.

Map decision (`src/lib/kolmari-map.ts`): OpenFreeMap vector tiles rendered with
MapLibre GL are the primary interactive map (free, no API key; the same code
runs against self-hosted Protomaps by changing `KOLMARI_MAP_STYLE`). The D3 +
Natural Earth SVG renderers are the automatic fallback when WebGL or the tile
endpoint is unavailable. The Mapbox-token-gated path (MapboxMap.tsx) is retired.
New dependency: `maplibre-gl` in package.json.

Country Snapshot mini map (`src/components/kolmari/CountryVectorMap.tsx`):
vector map centered on the country with the country's own Natural Earth polygon
drawn as a dashed red highlight over a soft gold fill, plus a gold pin with a
city label pill. Swapped into the country overview Country Snapshot
(`OverviewTab.tsx`); falls back to the SVG locator on any error. Your World
keeps its SVG world map; migrating it to the vector stack is the next step.

Dashboard visa options (`src/components/kolmari/dashboard/visa-route-table.tsx`):
new expandable comparison table (visa route / financial requirement / processing)
matching the approved mockup: flag + "Visa options for {country}", category
icons, first route expanded with Income requirement and Processing details cards,
record review date, "Explore this route", footer research note + gold "Explore
{country} pathways" button. Free tiers keep route-names-only + upgrade CTA.
`YourMatchesSection` now renders the panel inside the left column under the
country cards, so it expands when the Journey panel is collapsed/absent and
narrows when the Journey panel is expanded. `VisaInfoSection` uses the same
table for consistency.

Regions page (`destinations/regions/[region]/page.tsx`): no longer a second
destinations catalog. It is now the region's visa + relocation-alternatives
research page: "Visa routes in {region}" (per-country researched pathway blocks
with key facts, linking to Pathways and the country guide; honest "research in
progress" note for uncovered countries) and "Other relocation alternatives"
(lesser-known routes relevant to the region: ancestry, fast-tracks, special
agreements). Hero, community-context card, Passport Index banner, and plan CTA
are preserved.

Card art consistency (`src/components/kolmari/destinations-explorer.tsx`):
the browse-all cards no longer show flag images or letter tiles; countries
without a generated photo now render the gold country-shape panel (same art as
the dashboard and regions pages), with letter fallback only when no shape exists.

## Dashboard layout designer restore, Journey default, Your World map — 2026-09-28 (pending release)

Owner-directed (chat, 2026-09-28): restore the full dashboard layout designer that
was restricted in `f0084d7`, make the Journey tracker default to the right-side
panel, and fix the invisible Your World map by simplifying the implementation.
No SLD contract covers this work; the stale `sld-031-canonical-governance-repair`
contract was not modified.

Dashboard layout designer (`src/components/kolmari/dashboard/customize.tsx`):
- Restored the pre-`f0084d7` designer adapted to the fixed top sections: four
  templates (Focused move plan, Balanced overview, Research mode, Execution mode),
  drag panels between the main and second columns, up/down and move-column buttons,
  show/hide switches, and a desktop/mobile live preview.
- The top sections (question hero, Your Matches / Browse Destinations, Visa Options)
  stay fixed; Ask Kolmari and the Journey tracker are excluded from the draggable
  lists and managed separately.
- New dependencies: `d3-geo`, `topojson-client`, `world-atlas` (+ types) in
  package.json.

Journey tracker default (`src/lib/dashboard-layout.ts`, customizer):
- Defaults to the right-side panel; the header menu appears only when the user
  explicitly picks it. New `journeyPlacementChosen` marker: stored layouts from
  before this marker carry the old automatic `header` value, which now migrates
  to `panel`. All four templates use `panel`.

Your World map (`src/components/kolmari/world-svg-map.tsx`, `world-match-map.tsx`):
- The "Matched destinations" map is now a Natural Earth SVG world map (from the
  owner's supplied fallback design) instead of the Mapbox Static Images API, so it
  renders on every load with no token dependency.
- Matched countries highlight in gold; wizard-picked countries highlight in white;
  star pins mark each centroid. Every highlighted country is clickable and routes
  to `/nextinations/{slug}/v2/overview`. Countries too small for the 110m dataset
  (Malta) get a projected star pin from their stored coordinates.
- `WorldMatchMap` keeps its collapse toggle, match/selected pill rows, and the
  incomplete-profile empty state.

Validation: `npx tsc --noEmit` passes; `npm run build` passes. Highlight
wiring verified in Node against the real topology data (30/30 country codes map;
gold/white fills resolve to real polygons; Malta resolves to a projected star
pin). Pushed to `main` as `05688ab`; GitHub Actions "Deploy to Cloudflare" run
`36498831074` completed success on 2026-09-28 ~16:44 PDT. SLD Governance run
`36498831003` failed on the stale unrelated `sld-031-canonical-governance-repair`
contract (expected; contract untouched).

## Quiz carryover (Phase 2, batch A) — 2026-09-28 (pending release)

Owner-approved Phase 2 batch A: make the Match Quiz answers visibly shape setup and
the Command Center, per the Kolmari Flow design. Authorized in chat on 2026-09-28
("let's take a page from Zuck and follow your suggestion"). No SLD contract covers
this work; the stale `sld-engine-hardening` contract was not modified.

- `src/lib/onboarding.ts`: new verbatim-from-design mappings — `QUIZ_PRIORITY_LANES`
  (mq2 priority → lane preselects, e.g. Affordability → money, Healthcare and schools
  → health+family), `QUIZ_REGION_DESTINATIONS` (mq3 region → starter destinations,
  e.g. Europe → Portugal, Spain, Albania), `QUIZ_START_HERE` (mq8 obstacle → Command
  Center guidance text), `QUIZ_CARRYOVER_QUESTIONS` (the six household-carryover
  questions), `QUIZ_WHO_HOUSEHOLD` / `QUIZ_SITUATION_GOAL` (unambiguous prefill maps
  only — "I am only exploring" and ambiguous timeline/budget answers are never forced
  into profile fields).
- `src/components/kolmari/profile-wizard.tsx`:
  - Lane picker (step 0): preselects lanes from the quiz priority answer on a fresh
    setup and shows "You said {priority} matters most, so {lanes} is/are preselected.
    Change it freely." The banner shows only while the current lanes match the quiz
    suggestion. Never overrides lanes the user already chose.
  - Household step: shows a "From your Match Quiz" card listing the six carried
    answers, each tagged FROM YOUR QUIZ. Unambiguous answers also prefill the form
    ("Just me" → Solo, "Me and a partner" → Couple, "My family" → Family; situation →
    the matching pathway goal) without overwriting values the user already set.
  - Review step: seeds starter destinations from the quiz region (e.g. Latin America
    and the Caribbean → Mexico, Costa Rica, Uruguay) with a "Suggested from your
    Match Quiz region. Change them freely." note.
- `src/app/(app)/(workspace)/command-center/page.tsx`: new START HERE panel above
  the board, keyed on the quiz obstacle answer (e.g. "Choosing a country" →
  "Compare your destinations side by side. Tick off Neighborhood and safety first.").

Validation: production `next build` passes (exit 0, all routes). 20 focused
assertions pass against compiled lib output covering all five design mappings,
unknown/missing answers (no crash, no preselect), and the unambiguous-only prefill
maps. Not deployed.

## Signup screen, copy pass, sign-in landing (Phase 2, batches B, C, D) — 2026-09-28 (pending release)

Owner-approved Phase 2 batches B, C, D, continuing the batch-A authorization
("go ahead and continue until finished", 2026-09-28). No SLD contract covers this
work; the stale `sld-engine-hardening` contract was not modified.

Batch B — signup screen (`src/components/kolmari/auth-form.tsx`,
`src/components/kolmari/auth-shell.tsx`, `src/app/(auth)/signup/page.tsx`):
- Full-name field (signup only), saved to the profile via the same post-auth PUT
  as the quiz sync (`syncQuizResultToProfile({ displayName })` in
  `src/lib/quiz-sync.ts`); never overwrites an already-set name.
- Quiz reassurance chip when an anonymous quiz result is waiting: "{N} answers
  saved · {Stage} stage. They prefill your setup."
- Terms/privacy checkbox; the Create account button stays disabled until the name
  is non-empty, the email is valid, the password meets length, and the box is
  ticked. (Checkbox text is unlinked: no /terms or /privacy routes exist yet.)
- Screen-4 copy: eyebrow "SAVE YOUR STARTING POINT", title "Create account",
  subtitle "Free. Your quiz answers, destinations and checklist live here.", brand
  panel "NEXT: SET UP YOUR COMMAND CENTER — A few questions about how you want to
  approach the move, then your checklist is built for you."

Batch C — copy pass (`src/app/(marketing)/quiz/page.tsx`,
`src/components/kolmari/profile-wizard.tsx`, `src/lib/onboarding.ts`):
- Quiz result recommendations now verbatim from the design (region anchor,
  situation line, ancestry line when mq5 = Yes, otherwise the obstacle line), up
  to 3.
- Stages renamed to the design's Exploring / Planning / Preparing with the
  design's derivation rules; result H1 is "You are in the {Stage} Stage."
- "Retake the quiz" link on the result screen (clears answers and restarts).
- Energy lane tag now "Opens Energy focus · Experimental" (was "Opens Energy
  focus").
- Wizard lane picker: eyebrow "QUESTION 1 — IT SETS THE REST", title "How do you
  want to approach this move?", intro verbatim from the design. Review title now
  "Your Command Center is built around {lane shorts}" (e.g. "health and food and
  family and schools").
- Login screen copy: title "Welcome back", subtitle "Pick up where your move
  left off."

Batch D — sign-in landing (`src/app/(auth)/login/page.tsx`,
`src/components/kolmari/auth-form.tsx`):
- Login now defaults to /command-center (was /dashboard); explicit `next`
  params are still honored.
- Login page gains "Just exploring? Take the Match Quiz" linking to /quiz.

Validation: production `next build` passes (exit 0, all routes). 14 focused
assertions pass against the compiled `buildResult` covering the new stage rules
and all verbatim recommendation lines. Not deployed. Still not started: real
email verification (needs an email provider decision), demo redirect/archival
(blocked until the official flow is live and tested).

## Real email verification (Phase 3) — 2026-09-28 (pending release)

Owner-authorized as part of the original onboarding sequence; provider decided in
chat on 2026-09-28 (Resend free tier: 100/day, 3,000/month, $0). No SLD contract
covers this work; the stale `sld-engine-hardening` contract was not modified.

- `src/lib/verification.ts`: 6-digit crypto-random codes, SHA-256 hash stored
  (never the code), single active code per user, 15-minute expiry, dead after 5
  wrong guesses (constant-time compare), 60-second resend cooldown. The whole
  flow is inert until `RESEND_API_KEY` is set, so nothing can lock users out
  before the email service is configured. Demo account (`demo@kolmari.app`) is
  always exempt.
- `src/app/api/auth/verify/send/route.ts` and `.../verify/confirm/route.ts`:
  authed-only, same-origin checks, per-IP rate limits (10 sends / 20 confirms
  per 15 min), generic error messages.
- `src/app/api/login/route.ts` now returns `verificationRequired`; the auth form
  routes those sessions to `/verify-email?next=...` instead of the app.
- `src/app/(auth)/verify-email/page.tsx` + `src/components/kolmari/verify-email-form.tsx`:
  the verify screen (design Screen 5 copy). Sends the code on mount, 6-digit
  input, resend with 60s cooldown, "wrong email? start over" sign-out.
- `src/app/(app)/layout.tsx` gates every app page: unverified sessions redirect
  to `/verify-email`. `users` table gains `email_verified` (idempotent ALTER).
- Sending goes through the Resend API (`api.resend.com`); from-address defaults
  to `Kolmari <noreply@kolmari.com>` and is overridable with `RESEND_FROM_EMAIL`.
  The domain must be verified in Resend for production delivery.

Validation: production `next build` passes (exit 0, all routes). 20 focused
assertions pass against the compiled verification module with an in-memory fake
DB: enable/disable gating, demo exemption, code format, no plaintext storage,
correct-code acceptance, attempt counting and 5-strike lockout, resend cooldown,
resend replacing the code, expiry cleanup, and the verified flag clearing the
requirement.

Deployed 2026-09-28: commit `bdfbf4b` ("Ship onboarding spine + email
verification (Phases 1-3)") pushed to main; GitHub Actions "Deploy to
Cloudflare" run 36456425537 completed success; live at
https://kolmari.madincrease.workers.dev/. Owner set RESEND_API_KEY as a Worker
secret via the Cloudflare dashboard. kolmari.com verified in Resend.

KNOWN ISSUE, RESOLVED: `/api/auth/verify/send` and `/api/auth/verify/confirm`
briefly returned 404 on the live site right after deploy while the
`/verify-email` page worked. Local `opennextjs-cloudflare preview` of the same
commit returned the correct 401s, proving the bundle was fine. Re-testing the
live site minutes later returned the correct 401s: it was Cloudflare edge
propagation delay, not a build problem. No code change needed.

## Onboarding spine repair (Phase 1) — 2026-09-28 (pending release)

Owner-approved Phase 1: connect the Match Quiz -> account -> profile-wizard spine. No SLD
contract covers this work; the owner authorized it explicitly in chat on 2026-09-28
("Yes, start with Phase 1"). The stale `sld-engine-hardening` contract was not modified.

- `src/lib/schemas.ts`: `onboardingSchema` gains an optional `quiz` snapshot
  (`answers`, `stage`, `completedAt`). Schema stays `.strict()`; malformed quiz data
  and unknown keys are still rejected.
- `src/lib/onboarding.ts`: `OnboardingState` gains optional `quiz?: QuizSnapshot`, so the
  profile wizard's existing `{ ...setup }` saves preserve the snapshot automatically.
- `src/lib/quiz-sync.ts` (new): after signup/login, a stored `kolmari-quiz-result`
  localStorage entry is merged into the profile's `onboarding` JSONB via
  GET+PUT `/api/profile` (existing onboarding is preserved; a newer stored snapshot
  wins; the entry is cleared only after a successful PUT). Never throws and never
  blocks navigation; failures keep the entry for a later retry.
- `src/components/kolmari/auth-form.tsx`: runs the quiz sync after successful auth and
  honors the `next` param for signup too (previously hardcoded to `/welcome`).
- `src/app/(auth)/signup/page.tsx`: new accounts without an explicit `next` land in
  `/profile-wizard` (the lane picker) instead of the `/welcome` interstitial.
  `/welcome` remains a working route.
- `src/app/(marketing)/quiz/page.tsx`: completion stores the computed stage alongside
  answers; both CTAs now carry `next=/profile-wizard` (was `/destinations`, a dead end).

Validation: `next build --webpack` passes (routes render). New schema assertions
(5/5) pass against compiled lib output: quiz accepted, strictness preserved,
malformed quiz rejected, pre-existing onboarding still validates. `tests/onboarding.test.ts`
fails identically before and after this change (pre-existing extensionless-import
resolution under `node --test`; no test runner is wired in package.json). Not deployed.

## Priority onboarding and mobile navigation — September 2026 (pending release)

Native React flow based on the supplied mobile and onboarding references now supports
three ordered priorities, lane questions, optional existing Energy Portal, two-part
household handoff, account-backed resume and explicit destination selection. New board
destinations receive research prompts from these answers. Mobile workspace navigation
uses four touch targets and safe-area padding. Existing auth and board progress remain intact.

TypeScript, five focused tests, Next.js production build and Cloudflare bundle pass.
Lint is blocked by the existing TypeScript 7 / typescript-eslint mismatch. SLD verification
blocks against the stale `demo-access-code` contract; that contract and the engine were not
modified. Browser verification and real Neon persistence have not been exercised here.
See `BUILD-COMPARISON-2026-09.md` for evidence, scope, reference gaps and the recommendation
to retain the official repository and eventually archive the demo. Not deployed.

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
the values stored in `kolmari_plans.timeline_stage` are unchanged, so no migration is involved.
My Plan still shows the stored names, which is a known inconsistency to resolve separately.

**Data.** Every value in the tracker is derived from persisted plan data by
`journeyStages()` and `journeyPercent()` in `src/lib/plan-types.ts`:

- Stage position comes from `kolmari_plans.journey_stage`.
- Stage task lists come from the user's saved checklist items, grouped by `stage`.
- A task is *blocked* only when it carries a real due date that has already passed.
- Completion percent is fully-passed stages plus the share of the current stage's saved tasks
  that are done. A stage with no saved tasks reports that it has none — no filler tasks,
  no assumed partial credit.
- The footer timestamp is `kolmari_plans.updated_at`, formatted in UTC on the server, and reads
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

## Sync housekeeping (demo → app)

- **AGENTS.md case fix.** AGENTS.md referenced `/docs/Kolmari/` (capital K); the
  real folder is `/docs/kolmari/` (lowercase). On case-sensitive build/CI
  environments those doc lookups silently missed. All references corrected to
  lowercase. (Note: a near-empty `docs/Kolmari/` dir still holds one orphan file,
  `hero-image-standard.md`; left in place — not referenced by the fixed paths.)
- **Removed stray `/app.html`.** A 2.4 MB root-level copy of the demo's built SPA
  bundle (byte-identical to `kolmari-demo/public/app.html`), unrelated to
  `src/app/` and referenced by nothing in the repo. Deleted.

## Command Center (multi-destination household board)

A persistent, editable comparison board — distinct from the single-destination
Kolmari Plan + 8-stage Tracker (orthogonal axes: lifecycle vs topic×destination).
Translated from the demo's D1 prototype to Neon + real per-user auth.

- **Data** — `src/lib/command-center.ts` (server-only; `ensureTables()` + CRUD,
  all scoped to `user_id`) with the client-safe model (types, 5 categories,
  progress helpers) split into `src/lib/command-center-model.ts` to avoid the RSC
  server-only footgun. Tables `cc_destination`, `cc_checklist_item`, `cc_note`,
  `cc_member`, `cc_member_note` (mirror in `db/migrations/006_command_center.sql`).
- **API** — `GET /api/command-center` (full board) and a single same-origin-guarded
  `POST /api/command-center/mutate` dispatcher that returns the fresh board.
- **UI** — `/command-center` page + `CommandCenterBoard` client component:
  destination switcher, 5 category cards (work/visa/schools/safety/community) each
  with a checklist (toggle/add/delete) + notes, a household member panel with
  per-member per-destination fit notes, and per-category/destination/household
  progress bars. Honest empty state ("Add your first destination").
- **Nav** — added under the sidebar "Plan" group.
- New destinations seed a generic default checklist (planning prompts, not country
  facts); nothing here fabricates Match Scores, eligibility, or country data.

## Sync cleanup

- Removed a dead world-map component chain (a self-referencing board + map
  components imported by no route or live component). The live world map is
  `your-world.tsx` / `your-world-map.tsx` at `/your-world`.
- Added the map, interaction-design, and account-administration docs
  (`11-KOLMARI-MAP.md`, `12-INTERACTION-DESIGN.md`, `13-ACCOUNT-ADMINISTRATION.md`)
  under `docs/kolmari/`, matching AGENTS.md's references.
- Removed obsolete files that served no purpose for the app: the completed
  rebrand's migration-tracking docs and one-off root template tooling
  (`install-kolmari-template.py` and its patch/README).
- Migrated `hero-image-standard.md` out of the stray capital-`Kolmari` directory
  into `docs/kolmari/`, resolving the last case-sensitivity artifact.

## Astrocartography (scaffold only)

Owner-approved UX scaffold for a relocation-astrocartography tool at
`/astrocartography` (sidebar Tools group). Portal/energy framing, a birth-details
form (date / time / place, "unknown time" option), and a "Map my lines" action.
Deliberately **no line calculation**: real astrocartography lines need an
ephemeris (planetary positions) from a data source not yet chosen, and the
data-integrity rules forbid inventing planetary line positions — so the results
panel shows an honest "being built" state and a "what your map will show"
explainer, never a fabricated reading. Birth details live in component state only
(not sent or persisted). Wiring a real ephemeris source is the follow-up.

## Brand consolidation — everything is Kolmari

The application, its identifiers, routes, CSS classes, storage keys, docs, and
URLs are all Kolmari — the pre-rebrand brand has been removed everywhere.
- Code identifiers, CSS classes (`kolmari-*`), localStorage keys (`kolmari:*`),
  the plan type/functions (`KolmariPlan`, `getKolmariPlan`, …), the lexicon
  (`KOLMARI_LEXICON`), and site URLs are all Kolmari-named.
- Legacy redirect routes and their region page were removed; the canonical routes
  are `/my-plan`, `/destinations`, and `/destinations/regions/[region]`, with
  SEO/nav/robots references pointing at them.
- The user-plan table is `kolmari_plans`. `ensurePlanTable()` carries a single
  guarded one-time rename from the pre-rebrand table name — the only place that
  legacy name still appears — so existing user plans are preserved on upgrade.
- **Auth:** the session cookie and JWT issuer/audience were renamed, so existing
  sessions are invalidated once — everyone signs in again after the deploy.
- The "Nextination" spelling (the `saved_nextination` column, the `/nextinations/`
  country routes) is a separate portmanteau, still present; cleaning it would
  touch a live DB column and every country URL, so it remains a separate decision.

## Command Center — matched to the demo design

Rebuilt the `/command-center` page UI to match the demo (`command-center.html`):
"Relocation Command Center" title + subtitle, a dark navy **Overall progress**
banner (gold eyebrow, "N of M checklist items done across K destinations", big
percentage, gold bar), a full-width add-destination row, destination tabs, five
category cards (checklist + notes) in a 2-up grid, a **Food & health fit** card
that resolves the selected destination to its editorial food profile (archetypes,
allergen prevalence, heart note, disclosure), and a **Who's moving** household
panel (per-person needs + per-destination fit notes). Same data + mutate API as
before; only the presentation changed. Renders inside the app's own workspace
shell (the demo's standalone header/sidebar chrome was not adopted).

## Sidebar — text section headers + icon menu items

Reworked the workspace rail (`src/components/country-template/Sidebar.tsx`) to
match the approved reference: section headers (Explore, Plan, Connect, Tools) are
now **text-only labels with a caret** (no header icons), and every individual
menu item carries its own icon (Dashboard, Your World, Command Center, Pathways,
My Plan, Flutter Mode, Documents, Kolmari Club, Cost Calculator, Greenbook,
PassportIndex, Astrocartography). Collapsed rail is unchanged in spirit: it shows
Dashboard + one icon per section + the account avatar (the section icon is hidden
while expanded and revealed only in the collapsed strip). Your World keeps its
floating destinations menu. CSS in `src/styles/workspace-chrome.css`
(`.sb-head`, `.sb-link`, `.sb-top`).

## SLD (Seven Layer Dip) governance engine — installed

Added a deterministic, fail-closed change-governance engine (see
`docs/kolmari/14-SLD-GOVERNANCE.md`). Pure Workers-safe core under `src/sld/`
(seven layer analyzers, decision engine with BLOCK>REVIEW>WARN>ALLOW priority,
impact graph, secret-free audit) + Node-only scanner (`src/sld/node/scan.mjs`)
for baseline/diff/duplicate-root detection. Machine-readable manifest at
`src/sld/manifest/kolmari.manifest.js`. CLI via `npm run sld:*`; admin-gated
`POST /api/sld/evaluate`; CI workflow `.github/workflows/sld.yml` (blocks only on
BLOCK). Baseline committed at `.sld/baseline.json` (443 files, single canonical
root, env vars by name only — no secret values). 21 engine unit tests pass;
demonstrated live catching intentional Layer 1/3/5/7 violations (→ BLOCK, CLI
exit 2). No new dependencies.

## Dashboard — redesigned as a decision workspace

Rebuilt `/dashboard` around the five questions it exists to answer: where did I
leave off, what should I do next, is anything waiting for me, how far along am I,
and what can I ask Kolmari. Order: orientation header (greeting, one-sentence
state, compact journey progress, Flutter Mode) → Ask Kolmari → Pick Up Where You
Left Off + Your Journey → What's Next + Needs Your Attention → Your Shortlist.

A new pure derivation layer, `src/lib/dashboard-model.ts`, computes all of it from
real saved state (Kolmari Plan, Command Center board, Kolmari Profile) with
`today` passed in so server and client render identically:

- **Pick up where you left off** uses actual work, not the last visited URL — a
  part-way Command Center category ("Continue comparing safety — 1 of 3 items
  checked for Portugal"), then a document mid-pipeline, then an open task.
- **What's Next** returns at most three actions in dependency order (profile
  before scoring, destination before pathway, pathway before documents, budget
  before affordability); overdue dated items jump the queue. Each carries a
  reason behind a "Why this?" disclosure.
- **Needs Your Attention** emits only date-derived alerts (document expiring
  before the target move date, expired documents, overdue and imminent tasks).
  Kolmari has no live requirements feed, so no "changed" alerts are manufactured.
  With nothing waiting the section collapses to a single line.
- **Your Shortlist** shows two destinations with real signals only (tracked
  Kolmari Pathways count, cost of living, Community Fit, safety) and a Match
  Score only where one has been calculated.

Relocated rather than deleted: planning-area coverage and the consolidated
deadline list now render in **My Plan → Overview** (`PlanWorkspace` gained
`profileComplete` / `dependents` props). Journey stage management was already in
My Plan's Kolmari Timeline stepper, per-stage tasks in the Checklist tab, food fit
in Command Center and `/food-fit`, pathway detail in `/pathways`. The four
dashboard-only presentation components those replaced were removed
(`dashboard-side-cards`, `dashboard-command-center`, `dashboard-food-health`,
`journey-drawer`). Ask Kolmari now takes at most three contextual suggestion chips
built from the user's own destinations and plan state instead of six fixed tiles.

Panels are server components; "Why this?" uses native `<details>`, so the
redesign ships no new client JavaScript beyond the time-of-day greeting.

## SLD precision fixes (found by running the gate on the dashboard redesign)

Running `sld:analyze` against the redesign surfaced three false positives in the
engine, now fixed with regression tests (28 total):

- Destructive-SQL matching is **case-sensitive** outside real SQL surfaces, so
  Tailwind's `truncate` class no longer reads as `TRUNCATE`. Inside `.sql` files
  and `db/migrations/` any spelling still counts.
- The fabricated-Match-Score heuristic is scored **per line** and requires an
  actual assignment (`matchScore: 92`), not merely the words plus a number
  somewhere in the file.
- Content-scanning layers (Identity, Data, Intent) skip **specimen surfaces** —
  the engine's own source and test files — which necessarily contain the strings
  they exist to detect. Without this, editing the manifest would BLOCK on its own
  forbidden-terms list. Structural layers still apply everywhere.

## Dashboard — restored layout, customizable panels, vertical Journey tracker

**One greeting.** The dashboard was rendering two (`DashboardWelcome`'s "Welcome
back" plus the redesign's orientation header). `DashboardWelcome` is now the
single greeting and uses the time-of-day `<Greeting>`; the separate orientation
header is gone.

**Layout restored** to the approved arrangement: greeting → Recommended next
action (navy, now with a "Why this matters" disclosure) → Progress by planning
area → Deadlines and blockers / Destinations / Active pathway → with the Journey
tracker docked to the right of the content column at every layout.

**Customizable panels.** `src/lib/dashboard-layout.ts` holds the widget registry
and the stored shape; `profiles.dashboard_layout` (JSONB, its own read/write
helpers so `saveProfile` can never clobber it) persists per user through
`GET/PUT/DELETE /api/dashboard-layout`. **Account → Dashboard** offers
drag-and-drop reordering (native HTML5 DnD — no new dependency) with Move up /
Move down buttons as the keyboard path, per-panel on/off toggles, a live-region
status line, and Reset to default. Nine panels are available; the five in the
approved layout are on by default, and Ask Kolmari, Your shortlist, Food & health
fit, and Command Center summary can be switched on. The resolver splices in
panels added after a user saved their layout, so new widgets are never silently
lost.

**Journey tracker** (`journey-tracker.tsx` + `styles/journey-tracker.css`) is now
the specified collapsible vertical rail: a 322px ⇄ 56px shell animating on
`cubic-bezier(.4,0,.2,1)`, a collapsed rail with vertical "JOURNEY", eight status
dots and a stage counter, and an expanded panel with the PROGRESS TRACKER header,
stage summary, gold progress bar, an eight-stage accordion (one open at a time,
current stage open on load) using 26px stage-icon discs on a continuous connector
line, task rows with done/blocker/todo dots and Blocker pills, and a navy "Open My
Plan" footer with the real last-saved stamp. Below 860px the rail is dropped and
the tracker becomes a normal full-width card.

Stage position, per-stage task states, percentage, and the saved stamp all come
from the saved plan via `journeyStages`. Where a stage has no saved tasks the
tracker shows Kolmari's suggested steps for that stage under a "Suggested steps"
label, so suggestions are never counted as progress.

## SLD: client vs server components (found by the gate on this change)

The gate BLOCKed a restored **server** component for importing a server-only
module. Layer 3 had assumed everything under `src/components/` is a client
component. It now requires evidence: the Node scanner reads each changed file's
directive prologue and sets `isClientComponent`, the API route accepts the same
flag, and the rule falls back to scanning the diff text when it is undetermined.
Server components may import server-only modules freely; the UI → DB dependency
rule still applies to both. Three regression tests cover it (30 total).

## Sidebar — identical on country pages

The sidebar looked different on `/nextinations/*` pages. Root cause was not the
component — all three country shells render the same `<Sidebar>` — but the CSS:

1. `country-template.css` carried a **duplicate copy** of the whole rail and
   sidebar-nav block, scoped to `.country-template-root`, which had drifted from
   the shared version (rail 254px vs 256px, collapsed 70px vs 64px) and was still
   written against the pre-rename class names (`.sb-item`, `.sb-sub`), so it no
   longer matched the markup and left the real rules unapplied.
2. The scoped reset `.country-template-root *{padding:0}` plus
   `a{color:inherit}` / `button{color:inherit}` loads **after**
   workspace-chrome.css, so it flattened every sidebar row's padding to 0 and
   forced all labels to white.
3. `.country-template-root` sets `line-height:1.55`, which the rail inherited,
   making each row about 2px taller than everywhere else.

Fixes: the duplicated rail/sidebar block was deleted so workspace-chrome.css is
the single source of truth; the country reset now excludes the shared rail
(`*:not(.rail, .rail *)`, and the same for the `a`/`button` colour resets); and
`.rail` pins `line-height: 1.5` so it renders identically wherever it is mounted.
The removed mobile rail rules sat in a `max-width:900px` query that the global
stylesheet already matches, so the drawer behaviour is unchanged.

Verified by rendering the sidebar in both contexts in headless Chromium and
diffing `getComputedStyle` across width, padding, colour, font, radius, margin,
gap and rendered height for the rail, section headers, labels, menu items, item
icons, section wrappers and the account row: **34 differences → 0**.

## Country page — free-tier visibility

Free accounts on a **matched** destination now get the full country frame (hero,
tabs, right rail) with the content gated, instead of the flat `SimpleCountryView`.
The split mirrors `kolmari-demo`'s `richOverview` / `lockedTab` / `plainTab` rule:

- **Overview, free:** section 1 (Country Snapshot) plus the personalized summary
  teaser. Sections 2–5 are the personalized research and are not rendered at all.
- **Every other tab, free:** the `LockedTab` card — Kolmari Pro eyebrow, the tab's
  real headline, its actual section titles numbered in a grid, an "Unlock Kolmari
  Pro" CTA, and the section count. Same layout on every tab.
- **Unmatched destination, free:** unchanged `SimpleCountryView`.
- **Paid:** unchanged.

Hero metric panels were `rgba(13,27,57,.5)` on a dark hero and effectively
invisible; they are now `rgba(255,255,255,.10)`, keeping the existing
`backdrop-filter: blur(14px)` frosting. For free accounts the panel *values* and
sub-lines are frosted (`filter: blur(5px)`) via `data-plan="free"` on the country
root, so the labels stay readable and the figures unlock with Pro.

## SLD: the per-task contract file is an input, not the referee

Post-change verification blocked `.sld/task-contract.json` as part of SLD's own
governance surface — which made the system unusable, since declaring a task's
scope would itself have required `SLD_ENGINE_MAINTENANCE`, handing every feature
task the power to rewrite the rules. The per-task working files
(`task-contract.json`, `audit.jsonl`, `baseline.json`) are now exempt; the engine,
manifest and governance docs stay protected. Two tests cover both directions.

## Country hero — one standard for every destination

The approved hero panel is now the standard on all country pages, not just
Portugal. Both paths already shared the same classes (`hero`, `hero-eyebrow`,
`hero-name`, `hero-blurb`, `badges`, `hero-status`, `metrics`), so typography was
mostly common; three real divergences are fixed:

- **Metric panels are clickable everywhere.** Non-Portugal countries rendered a
  static `<div className="metric">` with no `m-go` arrow. `DataMetric` now emits
  the same `<button className="metric">` + arrow as the approved standard and
  navigates to the same tab (cost → Cost & Housing, the other three → Move There).
- **Big figure + small unit.** `splitMetric()` splits at the slash, else after the
  first token, so data-driven values render like the standard: `$1,905 / mo`,
  `D8 digital nomad`, `4 to 7 months`, `5 years`.
- **No inline typography override.** The "Being verified" state used
  `style={{ fontSize: 16 }}`, which sized differently from every other hero. It
  now uses `.m-v-pending` (colour only), so `.m-v` sizing is uniform.

Portugal keeps its verified literal copy; only the shared presentation was
unified. Verified structurally — both paths emit identical DOM, class for class.

## Country hero — metric panel typography made explicit

The hero metric panels were still not matching between Destinations. Measuring
computed styles against the real stylesheet found the cause: a panel renders as a
`<button>` when the figure is verified and a `<div>` when it is not, and the
scoped reset `.country-template-root button:not(.rail button){color:inherit}`
(specificity 0,2,2) outranked `.country-template-root .metric{color:#fff}`
(0,2,0). Button panels were painting their value navy on the dark hero; div
panels painted it white.

Fixed by declaring the panel typography instead of inheriting it:

- **Explicit declarations.** `.metrics` and every child (`.metric`, `.m-l`,
  `.m-v`, `.m-v small`, `.m-n`) now state their own `font-family`, `font-size`,
  `font-weight`, `line-height`, `letter-spacing` and `color`. Every selector
  carries the `.metrics .metric` chain, which also lifts them clear of the button
  reset, so both elements resolve identically.
- **Design tokens.** `--font-family-main` (deferring to the app's `--font-sans`),
  `--font-weight-bold/semibold/medium/normal` and
  `--font-size-metric-label/value/unit/note` on `:root`.
- **Tabular figures.** `font-variant-numeric: tabular-nums` on `.m-v` and its
  unit, so costs and durations keep a fixed advance width across the four panels.
- **One component.** `MetricButton.tsx` owns the panel markup and both states
  (clickable button / "Being verified" div). Portugal's four hand-written panels
  and the data-driven `DataMetric` now both render through it, with the four
  icons shared from a single `MetricIcons` map.

Verified in headless Chromium against the real stylesheet: the Portugal panel,
the data-driven panel and the pending panel now report identical computed
typography, the only remaining difference being the intended `.m-v-pending`
muted colour.

## Workspace margins — one content column on every page

Two separate problems sat behind "fix the margins".

**1. The build was red.** `main` at `f1f3fdb` (PR #147) failed to compile —
`your-world-gated.tsx` imports `WorldPin` from `./world-match-map`, which imports
the type but never re-exported it. Deploy #172 failed, so the live site was
frozen on the older build #171. `world-match-map.tsx` now re-exports the type.

**2. Country pages had their own content column.** `workspace-shell.tsx` returns
`children` directly for `/nextinations/…/v2`, so country pages never get
`.main.workspace-main` — they use `country-template.css`'s own `.main`, which was
`max-width:1500px; padding:18px 20px 60px` with **no** `margin-inline:auto`. Every
other workspace page is a centred 1240px column with 28px gutters. On a wide
monitor a country page therefore hugged the rail and ran 260px wider than the
rest of the app.

Fixed by making the column a shared pair of tokens rather than two hard-coded
copies: `--workspace-column: 1240px` and `--workspace-gutter: 28px` on `:root` in
`workspace-chrome.css`, read by both `.main.workspace-main` and
`.country-template-root .main` (each with a literal fallback so the column cannot
collapse if the token bundle is ever absent). Country pages keep their own
vertical rhythm — only the column width, side gutters and centring are shared.

Measured in headless Chromium against the real compiled CSS bundles, at 1565 /
1920 / 2560px, for both a workspace page and a country page:

| | column | gutter | centred | doc overflow |
|---|---|---|---|---|
| workspace | 1240px | 28px | yes | 0px |
| country | 1240px | 28px | yes | 0px |

Zero elements extend past the viewport at any of the three widths. The same
measurement showed that when the workspace stylesheet chunk is absent the page
loses the rail width, the column and the gutters entirely and overflows right —
which is what a stale or unstyled build looks like.

## Restore: country-template.css was committed truncated

`ef4b0f9a` ("Make country page topbar and tabbar full-width relative to
viewport") deleted **605 lines** of `src/styles/country-template.css` — the file
went from 853 lines / 73.6 KB to 296 / 23.9 KB. An elided diff was written to
disk verbatim: 17 rules were cut off mid-declaration and replaced with the
literal text `[...]`, and two placeholder comments
(`/* ... rest of file unchanged ... */`) stood in for the deleted content. The
build failed on `Unknown word bord` at line 63, taking deploys #173 and #174 red.

Restored the file from `f1f3fdb` (the last version that built) and re-applied,
by hand, both changes that belonged on top of it:

- **The shared content column** (from #154): `.country-template-root .main` reads
  `--workspace-column` / `--workspace-gutter`, centred, so country pages match
  every other workspace page.
- **The full-bleed header band** (ef4b0f9a's intent): `--ct-rail-width` token,
  `body.rail-collapsed` override to 64px, and the rail-offset width on `.topbar`,
  plus its narrow-viewport edge-to-edge override.

One correction to that feature: it applied the same rail offset to `.tabbar`, but
`.tabbar` renders **inside** `.main` while `.topbar` is a root-level sibling of
`.shell`. With the content column now centred, a 256px offset would have pushed
the tabbar out of its column, so the tabbar spans the column and only the topbar
carries the offset.

Measured against the real compiled CSS with the true DOM order:

| viewport | overflow | rail | main | topbar | tabbar |
|---|---|---|---|---|---|
| 1565 | 0px | 256 | left 290.5, w 1240 | left 256, w 1309 | left 318.5, w 1184 |
| 2560 | 0px | 256 | left 788, w 1240 | left 256, w 2304 | left 816, w 1184 |

Zero offenders at both widths. The hero metric typography from the earlier pass
survives the restore (`.m-v` = 22px, tabular-nums, white).

## Demo access code

A shared demo account so people can try Kolmari without signing up. Reachable
from `/demo` (accepts `?code=` so a link lands the recipient on a prefilled
form) and from a "Have a demo code?" link on the login page.

`POST /api/demo` mirrors `api/login/route.ts` rather than inventing a second
auth style: same same-origin CSRF check, same 10-per-15-minutes IP rate limit,
same cookie shape — with a 24h session instead of 7 days. The code is compared
in constant time so response timing cannot leak it character by character, and
it lives only in `DEMO_ACCESS_CODE`. **Unset means the demo is off** and the
endpoint returns 404; this repository is public, so a credential must never
appear in source (the same reason `ADMIN_EMAILS` is an environment variable).

The seeded persona is the point. Kolmari's value is the personalization, so an
unseeded demo would land on `wizard_status: 'not_started'`, redirect to the
wizard, and show empty states everywhere. `DEMO_PERSONA` fills the fields
`rankNextinations()` actually reads and puts the account on the `navigator`
plan, so every paid surface is visible. Entering the code re-seeds, so each
demo starts from the same state.

**Admin lockout, enforced in code.** Keeping the demo email out of
`ADMIN_EMAILS` would not have been enough: `isAdminUser()` also grants admin to
the first registered user, and `getProfile()` promotes that user to `navigator`.
On a fresh or re-seeded database the demo route can create `users` row #1, which
would have made the demo an admin with no configuration at all. So `isAdminUser()`
denies the demo *before* the first-user query, `isAdminEmail()` denies it even if
allowlisted, and both `getProfile()` and the admin user list exclude it.

`demo-identity.ts` is a dependency-free leaf holding the identity and code
primitives, so `admin.ts`, `profile.ts` and `admin-data.ts` can recognise the
demo account without an import cycle back through `demo.ts` → `profile.ts` —
the same split `plan-tiers.ts` uses.

Four account routes return 403 for the demo user so one visitor cannot break the
shared account for everyone: `change-password`, `deletion-request`,
`sign-out-all` and `data-export`. Normal sign-out (`/api/logout`) still works.

**Verified.** Seven unit tests over the compiled modules, including two security
cases and a control that proves they are not false passes: the demo is denied
even when listed in `ADMIN_EMAILS`, and denied *before* any DB access (with
`DATABASE_URL` unset it returns false rather than throwing, while a normal user
in the same conditions throws `DATABASE_URL` — proving the guard ordering).
Against a running server: cross-origin 403, wrong code 401, missing code 401,
correct code passes the gates and reaches the seeding step, 429 after the rate
limit, 404 with `DEMO_ACCESS_CODE` unset, login link present, `?code=` prefills.

**Not verified locally:** anything requiring the database — the seed itself, the
populated dashboard, and the Pro treatment on country pages. The app uses the
Neon HTTP client, which cannot target a local Postgres instance. These need a
check against the deployed site once `DEMO_ACCESS_CODE` is set.

## Dashboard restructure — 2026-09-28 (pending release)

Owner-directed dashboard restructure, authorized in chat on 2026-09-28. No SLD
contract covers this work; the stale `sld-031-canonical-governance-repair`
contract was not modified. Typecheck and production build pass locally; push and
deployed verification pending.

- Dashboard order is now fixed: greeting, then "What do you need to figure out?"
  (Ask Kolmari hero) spanning the full content width, then the destinations
  section, then visa options, then the customizable main/third-column panel grid.
- Paid tiers see "Your matches" (three matched country panels, "Based on what
  you told us, these are the three destinations worth exploring first.") with the
  Journey tracker nested beside them. Free tier sees the Destinations browse
  panel in the same position.
- Visa options stay visible for every tier. Free accounts see researched route
  names and categories only, with an upgrade path for details; paid accounts see
  category, income bar, timeline, and verification date from `PATHWAYS`.
- Journey tracker gained panel-mode collapse controls: horizontal (collapses to a
  slim vertical rail) and vertical (collapses to a compact header bar). Header
  dropdown mode is unchanged.
- Customizer restricted: users may only organize the third column (reorder +
  show/hide), choose Journey placement (header menu or below the question hero),
  and choose the collapse direction. Unrestricted templates and drag-between-
  columns were removed. Journey no longer appears in the movable widget grid.
- Plus Plan marketing moved off the dashboard header into the sidebar: a
  plan-aware upsell card below all menu items, above the account row, hidden when
  the rail is collapsed. Free sees "Unlock your full move plan"; Plus sees the
  Navigator comparison; Navigator sees plan management.
- `src/lib/dashboard-layout.ts`: removed the movable `destinations` widget,
  added `journeyCollapse` to the layout model with migration to `horizontal`.

## Your Matches consolidation — 2026-09-28 (pending release)

Owner-directed consolidation of the Dashboard matches experience, authorized in
chat on 2026-09-28 (supersedes the earlier "Your matches" panel rules where
they conflict). No SLD contract covers this work; the stale
`sld-031-canonical-governance-repair` contract was not modified. Canonical spec
updated in `docs/dashboard-destination-panels.md`.

- New `YourMatchesSection` (`src/components/kolmari/dashboard/your-matches.tsx`):
  one section containing the three match selector cards, the Journey tracker
  nested beside them, and Visa Options for the selected country inside the same
  section below the cards. Selecting a card swaps the visa preview in place; it
  never navigates away and never changes saved destination state.
- Match cards restyled to the owner-approved reference (third screenshot):
  country name + region, `Strong Fit` (match >= 80) / `Worth Exploring` badge,
  one-line personalized hook (top `rankNextinations` reason, else country
  summary), and a three-stat row built only from researched fields: Income
  guide, Route, Safety. `Viewing` pill marks the selected card. Stats are not
  fabricated: no citizenship timelines or cost-of-living figures are shown
  because no verified production source exists for them.
- `VisaOptionsList` extracted in `visa-info.tsx` and shared between the
  standalone `VisaInfoSection` and the nested section. Free sees route names
  only + upgrade path; paid sees category, income bar, timeline, verified date.
  Legal caution copy preserved.
- Dashboard wiring: paid tiers with a complete profile render
  `YourMatchesSection` (journey nested when placement = panel). Everyone else
  keeps the Destinations browse panel + standalone Visa Options. The unused
  `DashboardDestinationsCard` was removed from `dashboard-side-cards.tsx`.
- Country Snapshot passes `fallback="locator"` to `CountrySnapshotMap`, so the
  snapshot never shows the flag when the Mapbox token is missing or the image
  fails. The locator now draws the country's own Natural Earth 110m polygon
  fitted to the viewport with light regional context and the gold city pin
  (Sep 28: replaced the zoomed-out whole-globe glyph per owner feedback).
  Countries absent from the 110m set (Malta) get a zoomed regional graticule
  with the pin. ISO2 -> NE id mapping and feature access live in shared
  `src/lib/world-geo.ts`, also used by `world-svg-map.tsx` (deduped).
- Typecheck and production build pass locally; SSR preview of the new section
  verified (cards, badges, stats, visa options, "Explore more destinations"
  link). Temporary preview route removed. Push and deployed verification
  pending.
- Dashboard match cards (Sep 28): the Your Matches cards grid now uses
  `content-start` so the cards keep their compact approved height instead of
  stretching to the Journey tracker's height on desktop, per owner feedback
  with the reference screenshot.

## Your World round 3 (2026-09-28, ~17:10 PDT, commit f046b63)
- Your World "Recommended for you" and the free gated teaser now list the top 3 quiz matches instead of 4, matching the dashboard's 3-match set.
- Stories & expert guidance is now country-driven: country pills for the user's matched destinations; the video grid shows videos for the selected country only (demo stories tagged per country + the verified Greenbook per-country YouTube library, deduped). Countries with no coverage show an honest "being verified" note, never placeholders.
- Workspace content column widened to 1760px with a 24px gutter to match the demo site's near-full-bleed margins (was 1240px / 28px). Country pages inherit the same vars.
- Deploy to Cloudflare run 36500824461 completed success. SLD Governance fails on the stale sld-031 contract as expected (untouched).

## Pathways explorer (2026-09-28, ~17:45 PDT, commit 805d9c1)
- /pathways "Explore all Pathways" card grid replaced with a master-detail layout: scannable route list left (~64%), detail panel right (~36%), thin vertical divider, panel never covers the list.
- Header above the list: "EXPLORE YOUR OPTIONS" / "Your potential visa routes" / "See what fits your profile and what to confirm next." Search + category pills kept.
- Tabs with live counts and navy underline: All routes, Potential fits, Needs information, Saved.
- Status semantics: green "Potential fit" (matching evidence), amber "Needs confirmation" (missing/unverified info), red "Requirement not met" (only when a requirement is documented as unmet, e.g. income below the planning guide). Unknown info is never treated as failed.
- Detail panel: ROUTE OVERVIEW + close, flag + country, full route title + status, "Why this appeared for you" (actual profile signals), "What to review next" (gaps), accordions for Money and fees / Bringing your family / Processing information / Official requirements (source link + verified date inside), full-width navy Save route, Add to comparison secondary.
- Save route writes selected_pathway ("Country — Name") via PUT /api/plan (existing plan functionality). Add to comparison bookmarks the route into the saved set; 2+ saved routes enable a side-by-side compare table.
- Responsive: below lg the list is full width and selecting a route opens a full-screen detail with a back button; filters persist; focus returns to the row on close. Keyboard: arrow keys move between rows, Enter selects, accordions use button semantics.
- No SLD contract files touched.

## Region card art: generated media (not map graphics) — 2026-09-28

Owner reported "I don't see images": the /images/countries/*.webp files are
stylized gold-on-navy map graphics, not photos. Region cards now use the
approved generated `dashboard_destination` asset via /api/country-asset (the
same source as the Destinations browse page), falling back to a large centered
flag on navy when no media exists for a country.

## Country Snapshot maps: vector map per country (2026-09-28)

Owner: the Country Snapshot map must show the map of the country in question,
per the approved 1a/1b mockups (MapLibre + OpenFreeMap vector tiles primary,
D3 + Natural Earth SVG fallback). CountryWorkspace and DataOverviewTab now
render CountryVectorMap (dashed country highlight, gold city pin, zoom
controls) with the actual country code; the SVG locator remains the automatic
failure fallback. OverviewTab's literal Portugal copy is a known content gap,
unchanged.

## Map stack review: removed dead features, rebuilt vector map (2026-09-28)

Owner asked for a review of all map features; remove what should go, re-add what should stay.
Removed: MapboxMap.tsx (retired component, zero importers, deleted); the
Mapbox-token static-image branches in CountrySnapshotMap and CityMapImage (no
token was ever configured; the map decision retired Mapbox); the `.hero-map`
detection hack in CountrySnapshotMap. CountrySnapshotMap is now a pure
dependency-free D3 + Natural Earth SVG locator (approved 1b fallback).
Rebuilt: CountryVectorMap now statically imports maplibre-gl (JS + CSS), so no
separate chunk fetch can fail in production; the dynamic import() was the
likely cause of the persistent fallback. Kept: Your World SVG maps,
PlanHeaderLocator, CityMapImage placeholder.

## Country Snapshot map: production diagnostic (2026-09-28)

Vector map still falls back to the SVG locator in production after the
rebuild. Live-browser QA on the Portugal overview page confirmed the fallback
SVG is the only thing rendered (no MapLibre container/canvas in the DOM), so
`failed` is being set in production; the MapLibre error details were being
discarded by the old handler. Temporary diagnostic added to CountryVectorMap:
the first fatal error (map 'error' event message, or constructor exception) is
captured and exposed as an invisible `data-map-error` attribute on the
fallback, plus a console.error. Next step: read the attribute from the live
page, fix the real root cause, then remove the diagnostic. CSP already
verified clean (worker-src blob:, tile host allowlisted); tile/style endpoints
return HTTP 200; WebGL available in the test browser.

## Country Snapshot map: ROOT CAUSE FOUND and fixed (2026-09-28)

The temporary data-map-error diagnostic reported the exact production
failure: "event: Worker failed to load. Check that the worker URL is
correct." Root cause: MapLibre GL v6 (6.11.2) loads its Web Worker from a
separate file whose URL defaults to import.meta.url of the bundled module.
In the Next.js bundle that URL is bogus, so the worker 404s and every map
falls back to the SVG locator. The map could never have worked in
production with this version. Fix: serve the real worker files from
public/ (maplibre-gl-worker.mjs + maplibre-gl-shared.mjs, kept side by
side so the worker's relative import resolves) and call
maplibregl.setWorkerUrl('/maplibre-gl-worker.mjs') before creating the
map. The temporary data-map-error diagnostic was removed. CSP already
allows worker-src 'self' blob:, so the same-origin module worker is
permitted.

## Country Snapshot map: VERIFIED FIXED in production (2026-09-28)

The worker-URL fix is deployed and live. The Portugal overview page now
renders the interactive MapLibre vector map in the Country Snapshot card:
real vector tiles, dashed red Portugal boundary, gold Lisbon pin with
label callout, and working +/- zoom controls (drag-pan confirmed). Root
cause recap: maplibre-gl v6 derives its worker URL from import.meta.url,
which is invalid inside the Next.js bundle, so the worker 404d and every
map silently fell back to the SVG locator. The worker files now ship in
public/ with an explicit setWorkerUrl call. Lesson: when upgrading or
reinstalling maplibre-gl, confirm the installed major version still
inlines its worker; if it uses a separate worker file, the public/
copies and setWorkerUrl must stay in place.

## Country hero image backfill agent — 2026-09-28 (pending release)

New autonomous nightly job that pre-generates missing country hero images via
the approved National Flag Shadow Hero engine (gpt-image-2), so country pages
never wait on a first visit to trigger the on-demand self-heal.

New route `src/app/api/internal/country-hero/backfill/route.ts` (POST, nodejs
runtime, maxDuration 120): accepts EITHER an admin session from
`getRequestUser` on the `KOLMARI_ADMIN_EMAILS` allowlist (same pattern as the
admin country-asset route) OR `Authorization: Bearer <CRON_SECRET>` matching
`process.env.CRON_SECRET` (compared in constant time). With no `slug` in the
JSON body it finds the first country in `COUNTRIES` with no saved hero (one
DB query via `listSavedHeroSlugs`) and generates exactly ONE hero, then saves
it and finishes the job. With a `slug` it processes just that country. Safety
mirrors the self-heal route: COUNTRIES allowlist, existing-asset no-op, DB
claim/finish locking, the API key is never logged. Returns JSON
`{status: 'generated'|'ready'|'no-missing'|'failed'|'unknown-country'|'unauthorized', slug?}`
(the scheduler stops its loop on `no-missing`; `unconfigured` is returned if
OPENAI_API_KEY is not set). It only creates the decorative hero image, never
page content or figures.

New workflow `.github/workflows/country-hero-backfill.yml`: runs at 04:30 UTC
nightly plus manual `workflow_dispatch`. It loops up to 10 times calling
`https://kolmari.com/api/internal/country-hero/backfill` with the bearer
secret, stopping early on `no-missing`. One image per call keeps each
invocation inside the Worker time limit.

Setup required before the first run (two secrets, same value):
1. Cloudflare worker secret: run `npx wrangler secret put CRON_SECRET` and
   paste a strong random value (from the repo root).
2. GitHub repo secret: Settings -> Secrets and variables -> Actions, add a
   secret named `CRON_SECRET` with the exact same value.
3. Confirm `OPENAI_API_KEY` is configured on the worker (it already is, per
   the self-heal ensure route).

Note: no SLD contract covers this work; the active
`sld-031-canonical-governance-repair` contract authorizes only SLD engine
maintenance files and was left untouched.
