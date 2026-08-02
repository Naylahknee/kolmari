# Kolmari Current State

Running log of implemented page state. Update this file when application code changes.

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
