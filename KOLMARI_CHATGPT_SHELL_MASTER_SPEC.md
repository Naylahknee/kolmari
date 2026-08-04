# Kolmari ChatGPT-Recognizable Workspace Shell

**Master product, UX, mobile, and implementation specification**  
**Version:** 1.0  
**Date:** August 3, 2026  
**Repository:** `Naylahknee/kolmari`  
**Implementation branch:** `codex/chatgpt-shell-phase-1`  
**Initial implementation scope:** Phase 1 only

---

## 1. Controlling directive

Transform the protected Kolmari workspace into a simpler, ChatGPT-recognizable application shell while preserving Kolmari's identity, production functionality, real user data, routes, authentication, database behavior, and relocation-specific workspaces.

This is not permission to copy ChatGPT's branding, create a general-purpose chatbot, redesign the entire product, or rewrite the application. The intended familiarity comes from the interaction model:

- a collapsible left navigation rail;
- a calm central workspace;
- one obvious place to ask a hard relocation question;
- direct routing from a question to the correct structured workspace;
- a clearly accessible account area;
- a separate, collapsible Journey tracker on the Dashboard;
- simple mobile navigation with one primary action at a time.

The official Kolmari repository is the functional source of truth. The demo may be used only as evidence that simpler navigation and reduced visual density improve the experience. Do not copy demo HTML, placeholder data, local-storage-only product logic, or preview behavior into production.

## 2. Source-of-truth order

When instructions conflict, apply them in this order:

1. The owner's current explicit instruction.
2. This specification for the approved ChatGPT-recognizable shell project.
3. Root `/DESIGN.md`.
4. Root `/AGENTS.md`.
5. Files in `/docs/kolmari/` relevant to the assigned phase.
6. Existing production behavior, components, types, routes, and data contracts.
7. Older prompts, mockups, screenshots, demo code, or archived references.

Do not silently resolve an important conflict. Preserve the higher source, implement the smallest safe interpretation, and report the conflict.

### Owner-approved terminology exception

For this shell project, the visible navigation label is **Your World** because that is the owner's current approved instruction and the current production route is `/your-world`. Do not rename the route, database fields, or compatibility redirects. Do not perform a repository-wide lexicon rewrite as part of Phase 1.

## 3. Seven Layer Dip drift-control contract

Every proposed change must be classified before implementation.

| Layer | Status | Protected decisions | Codex permission |
|---|---|---|---|
| 1. Identity | Locked | Kolmari is a relocation decision and planning system, not a travel, booking, or generic chatbot product. | No changes. Reject or stop if a task would alter this layer. |
| 2. Design system | Locked | Existing navy, gold, teal roles; approved brand assets; Geist interface typography; existing radii, spacing, and tokens. | Reuse only. Do not add colors, fonts, gradients, logo variants, or a second token system. |
| 3. Behavioral/UX patterns | Semi-locked | One primary action on mobile; structured and action-oriented dashboard; one question per wizard step; real and honest states. | Implement only the shell behaviors explicitly defined below. Flag other behavioral changes. |
| 4. Feature structure | Flexible within scope | Navigation grouping, shell hierarchy, Dashboard composition, Journey placement. | May change only during the phase that authorizes it. |
| 5. Logic | Protected during shell work | Authentication, matching, ranking, readiness, plans, Pathways, entitlements, question routing, and country gating. | No Phase 1 changes. Later changes require a separate approved phase. |
| 6. Content | Flexible but controlled | Shell labels, help text, empty-state copy, and concise guidance. | May change only where this specification supplies or authorizes the copy. |
| 7. Execution | Flexible | Component composition, CSS organization, accessibility fixes, testing, and performance improvements. | Allowed when Layers 1–6 remain intact. |

### Mandatory drift check

Before editing each file, Codex must answer internally:

1. Which layer does this file change affect?
2. Is that layer authorized in the current phase?
3. Can the result be achieved by reusing an existing component or token?
4. Does the change alter real data, business logic, route protection, or entitlements?
5. Is the change necessary for an acceptance criterion in this specification?

If the answer to question 2 is no or question 5 is no, do not make the change.

## 4. Product outcome

After the shell migration, a signed-in user should immediately understand:

1. **Where am I?** The current workspace is named in the header and highlighted in navigation.
2. **What can I do here?** The central canvas presents one clear task or decision.
3. **What should I do next?** The Dashboard question starter, recommended action, and Journey tracker provide the next step.

The shell should feel familiar to someone who has used ChatGPT, Claude, Kit, or another modern AI workspace without becoming a clone of any of them.

### Experience principles

- The shell organizes the product; it does not replace the product.
- Questions are a doorway to structured Kolmari tools.
- Deterministic calculations remain deterministic.
- AI may eventually explain verified results but may not invent them.
- Navigation should not duplicate content already visible in the main workspace.
- A user must never need to understand internal product architecture to find the next action.
- Empty states must tell the truth and provide one next step.

## 5. Existing implementation to preserve

The following production work already supports the target experience and should be reused:

| Existing file | Current responsibility | Required treatment |
|---|---|---|
| `src/components/layout/kolmari-app-shell.tsx` | Canonical protected shell boundary | Preserve as the canonical boundary. |
| `src/components/kolmari/workspace-shell.tsx` | Top bar, sidebar, activity tracking, route-specific shell handling | Refine in place. Do not create a competing shell. |
| `src/components/country-template/Sidebar.tsx` | Current protected navigation | Simplify in Phase 1. Do not replace with a new component library. |
| `src/components/country-template/TopBar.tsx` | Page title, question/destination input, account menu, logout | Simplify and preserve working account behavior. |
| `src/styles/workspace-chrome.css` | Shared protected-shell layout and responsive behavior | Modify in place using existing tokens. |
| `src/components/kolmari/decision-workspace-starter.tsx` | Large Dashboard question field and six guided questions | Preserve for Phase 2 refinement. |
| `src/lib/decision-routing.ts` | Deterministic question-to-workspace routing | Preserve unchanged during Phase 1. |
| `src/components/kolmari/journey-drawer.tsx` | 322px expanded / 56px collapsed Dashboard Journey tracker | Preserve its real-data contract. Refine only in Phase 2. |
| `src/app/(app)/(workspace)/dashboard/page.tsx` | Server-rendered Dashboard composition and real data | Do not modify in Phase 1. |
| `src/app/globals.css` | Approved tokens and shared Journey styles | Do not duplicate its tokens. Modify only if the current phase explicitly requires it. |

Do not create `AppShellV2`, `NewSidebar`, `ChatShell`, or duplicate production components merely to avoid understanding the current implementation.

## 6. Target information architecture

### Primary navigation

The left navigation should contain the following hierarchy.

1. **New question** — primary gold action; routes to `/dashboard` and focuses or scrolls to `#kolmari-decision-question` when feasible without changing routing logic.
2. **Dashboard** — `/dashboard`
3. **Explore**
   - Your World — `/your-world`
4. **Plan**
   - Pathways — `/pathways`
   - My Plan — `/my-plan`
   - Documents — `/documents`
   - Flutter Mode — `/flutter`
5. **Learn and connect**
   - Greenbook — `/greenbook`
   - Kolmari Club — `/community`
6. **Tools**
   - Cost Calculator — `/cost-calculator`
   - Passport Index — preserve the existing approved route or outbound behavior; do not rebuild it.
7. **Account footer**
   - Profile/Settings — `/settings`
   - Sign out remains in the authenticated account menu.

### Navigation removals

Remove from visible sidebar navigation:

- the expandable list of matched countries;
- the `Your Matches` section;
- the redundant Destinations entry;
- country subtrees under Your World;
- Saved Destinations as a primary navigation item;
- legacy redirects such as `/nexitnation`, `/nexit-plan`, `/checklist`, or `/visa-wizard`.

This removes only duplicated navigation. It does not delete the routes, data, saved countries, country cards, redirects, or destination functionality. Matched destinations belong in Dashboard and Your World content.

## 7. Desktop shell specification

Desktop behavior begins above the existing 900px workspace breakpoint.

### 7.1 Top bar

- Height remains 56px.
- It stays sticky and uses the existing light, blurred Kolmari surface.
- The left zone aligns with the sidebar width.
- The center identifies the current page.
- The right zone contains the real account menu and country-specific units control where already supported.
- Remove or hide controls that have no implemented behavior. Do not display a decorative notification control that does nothing.
- On Dashboard, the large Dashboard question starter is the canonical question input; do not show a second full-size question input in the top bar.
- On non-Dashboard workspace pages, the existing compact `Ask Kolmari or search Destinations` field may remain. It must continue using `routeWorkspaceInput()` and must not become a new AI endpoint in Phase 1.
- The profile menu must continue to show the real profile name when available and preserve Settings, Admin when authorized, and Sign out.

### 7.2 Left sidebar

- Expanded width: 256px.
- Collapsed width: 64px.
- Expanded state shows icons and labels.
- Collapsed state shows icons with accessible names/tooltips; labels must not merely disappear for screen readers.
- Use the existing Navy Deep sidebar surface.
- `New question` is the only filled gold primary action in the sidebar.
- Active items use existing brand tokens: restrained active surface, high-contrast label, and a gold indicator or icon treatment.
- The navigation list may scroll independently.
- The account area stays visually separated and anchored at the bottom when viewport height allows.
- Expanded/collapsed state must not cause horizontal overflow or page-width jumps.
- Toggling the sidebar must not interfere with the independent Dashboard Journey rail.

### 7.3 Central workspace

- Preserve the current `max-width: 1240px` content boundary unless a page-specific existing template intentionally overrides it.
- Preserve responsive gutters and `min-width: 0` behavior.
- Do not wrap all existing pages in an additional card.
- The central workspace should remain the visual focus.
- Each page retains its current server-rendered data and page-specific components.

### 7.4 Dashboard Journey column

The Dashboard is the only screen with the separate right Journey column.

- Expanded width: 322px.
- Collapsed width: 56px.
- It remains separate from the left navigation.
- Collapsing it expands the Dashboard content column cleanly.
- The rail continues to display Journey, stage dots, and `current/total` progress.
- Only one Journey stage is open at a time.
- All values come from persisted plan data.
- The shell sidebar and Journey rail must be independently operable.

## 8. Mobile and tablet shell specification

The mobile/tablet shell applies at 900px and below.

### 8.1 Mobile header

- Height remains 56px.
- Show a clear hamburger/navigation button on the left.
- Show the current page title or compact Kolmari mark.
- Keep the account/profile control visible on the right.
- Do not show the desktop question/search field in the header.
- Do not allow header controls to overlap at 320px.

### 8.2 Mobile navigation drawer

- The left sidebar becomes an off-canvas drawer using the existing behavior.
- Width remains `min(86vw, 300px)`.
- Opening the drawer displays a backdrop and prevents background scrolling.
- Selecting a route closes the drawer.
- Escape closes the drawer.
- Focus moves into the drawer when opened and returns to the trigger when closed.
- The close control must be visible and have an accessible label.
- The drawer contains the same simplified hierarchy as desktop.
- **Do not add bottom navigation in Phase 1.** The ChatGPT-recognizable mobile pattern for this project is a header plus navigation drawer. A second navigation system would add clutter and violate the one-primary-action rule.

### 8.3 Mobile central workspace

- Content uses one column.
- Minimum horizontal page padding: 12px at the narrowest supported width.
- No component may create horizontal page scrolling.
- Buttons and interactive controls have a minimum 44px touch target where practical.
- Dense grids stack to one column.
- Tabs may scroll horizontally inside their own tab container, not the page.
- Fixed or sticky elements must respect iOS safe-area insets when later packaged.

### 8.4 Mobile Journey behavior

This is a Phase 2 change, not Phase 1.

- Do not display the 56px vertical rail on mobile.
- Show a compact full-width Journey summary row by default.
- The row displays current stage, `current/total`, and percentage.
- Tapping the row expands the full tracker as an accordion or sheet.
- Only one stage remains open at a time.
- The expanded tracker remains in normal document flow unless a later approved bottom-sheet design includes full focus trapping and dismissal behavior.

## 9. Dashboard conversational doorway

This section defines the Phase 2 target and must not be implemented during Phase 1.

### 9.1 Empty/returning state

The Dashboard begins with the existing `DecisionWorkspaceStarter` above the Dashboard country and planning panels.

Required content:

- eyebrow: `Start with the hard question`;
- heading: `What do you need to figure out?`;
- supporting text explaining that Kolmari opens the workspace designed to answer the question;
- a plain-language question input;
- a gold submit control;
- six guided question starters;
- `Continue where you left off` when a valid previous major workspace exists;
- an honest statement that the question is not saved unless persistence is separately approved.

### 9.2 Guided questions

Preserve these intents:

1. Where can I realistically move?
2. Which Pathways might fit me?
3. Can my family afford this?
4. How do I turn this into a plan?
5. Where might we feel welcomed?
6. What documents will I need?

### 9.3 Routing behavior

- Preserve deterministic classification in `src/lib/decision-routing.ts`.
- Do not call an LLM in Phases 1 or 2.
- Do not save question text.
- Do not place question-like text in a URL.
- Short country/destination lookups may continue to filter Your World safely.
- Do not infer or alter profile facts.
- Do not claim visa eligibility.
- The destination workspace remains responsible for calculations, verified research, and saved changes.

### 9.4 Matched-country panels

In Phase 2, the first three destination panels on Dashboard must be the user's first three real ranked matches.

- Do not substitute arbitrary countries when a completed profile has no calculated matches.
- If the profile is incomplete, show one honest profile-completion state.
- Do not fabricate Match Scores.
- Matched countries do not appear in the sidebar.

## 10. Route and data preservation

### Protected routes

Preserve all current protected routes and compatibility redirects. Visible primary routes include:

- `/dashboard`
- `/your-world`
- `/pathways`
- `/my-plan`
- `/flutter`
- `/documents`
- `/greenbook`
- `/community`
- `/cost-calculator`
- `/settings`
- existing country and Passport Index routes

Do not rename or delete legacy URLs during this project. If a redundant destination page is removed from visible navigation, preserve its redirect or direct-route compatibility.

### Authentication

Preserve:

- Neon user records;
- bcrypt password hashes;
- JOSE-signed JWT sessions;
- secure `httpOnly`, `SameSite=Lax` production cookies;
- `src/proxy.ts` route protection;
- protected layout validation;
- safe internal `next` behavior through login and signup;
- `/dashboard` as authenticated fallback;
- working logout behavior.

Do not add generated access codes, magic links, OAuth, mobile tokens, or a second authentication system during shell work.

### Data integrity

Never fabricate or hardcode production values for:

- profile information;
- household composition;
- saved or matched countries;
- Match Scores;
- readiness;
- plan progress;
- budgets;
- deadlines;
- Pathway or visa eligibility;
- document completion;
- subscription status.

Use existing server reads for protected page data. Keep interactive behavior in focused Client Components. Do not convert the whole workspace or Dashboard into a Client Component.

## 11. Visual system requirements

Reuse the existing token block in `src/app/globals.css`.

### Required brand roles

- Navy Deep: primary shell/sidebar surface.
- Navy: headings and interface ink.
- Gold: primary action, active progress, deliberate emphasis.
- Teal: community and Greenbook meaning only.
- Canvas: central workspace background.
- White: focused cards and fields.
- Existing line, muted, radius, shadow, and motion tokens.

### Prohibited visual drift

Do not:

- recolor or redraw the Kolmari logo;
- imitate ChatGPT's exact branding;
- add a monochrome black-and-white replacement theme;
- introduce purple, neon, pastel-led, or travel-agency colors;
- add a new font;
- replace Geist with a ChatGPT-like typeface;
- add decorative gradients to the shell;
- turn every area into a pill or card;
- add cartoon butterflies or travel icons;
- replace Lucide or existing icons with another icon library;
- create a second token file.

## 12. Interaction and accessibility requirements

- Every icon-only control has an accessible name.
- Collapsible controls use accurate `aria-expanded` state.
- Hidden drawer and collapsed-rail content must not remain keyboard-focusable.
- Focus states use the existing gold focus treatment.
- Keyboard users can open, navigate, and close the mobile drawer.
- Escape closes menus and drawers where expected.
- Account menu focus and outside-click behavior remain functional.
- Navigation active states are conveyed by more than color alone when practical.
- Motion respects `prefers-reduced-motion`.
- No hover-only essential actions.
- Text and controls meet readable contrast on navy, gold, white, and canvas surfaces.
- The shell must work at 200% browser zoom without hiding navigation or account access.

## 13. Performance requirements

- Preserve Server Components for protected page reads.
- Keep the shell Client Component boundary as small as practical.
- Remove the sidebar `/api/matches` request when the matched-country tree is removed.
- Do not add an LLM call, chat dependency, global state library, component library, or animation library.
- Do not add duplicate profile requests merely for labels that can safely be passed from the protected layout.
- Avoid sequential data waterfalls when existing server data can be fetched in parallel.
- Do not load maps, YouTube embeds, or country media as part of the shell.
- Preserve Cloudflare Workers/OpenNext compatibility.

## 14. Implementation phases

### Phase 0 — Baseline and documentation

Deliverables:

- add this specification to `docs/kolmari/CHATGPT-SHELL-SPEC.md` on the feature branch;
- record current desktop and mobile screenshots for Dashboard, Your World, My Plan, and one country page;
- record existing typecheck, focused lint, and production build status;
- identify pre-existing failures separately;
- do not change production behavior.

### Phase 1 — Protected application shell

Authorized work:

- simplify the Sidebar hierarchy;
- remove matched-country fetching and country subtree from Sidebar;
- add the `New question` primary action;
- preserve expanded 256px and collapsed 64px desktop states;
- preserve and improve the mobile navigation drawer;
- pin/separate account access;
- simplify TopBar while preserving page name, units where applicable, account menu, and logout;
- avoid duplicate Dashboard question fields;
- remove nonfunctional shell controls;
- improve shell accessibility and responsive behavior;
- update current-state documentation.

Allowed Phase 1 files:

- `src/components/layout/kolmari-app-shell.tsx`
- `src/components/kolmari/workspace-shell.tsx`
- `src/components/country-template/Sidebar.tsx`
- `src/components/country-template/TopBar.tsx`
- `src/styles/workspace-chrome.css`
- `src/config/product-copy.ts` only for shell labels required here
- `docs/kolmari/CHATGPT-SHELL-SPEC.md`
- `docs/kolmari/CURRENT-STATE.md`
- focused tests directly covering shell behavior

Phase 1 must not modify:

- Dashboard page composition;
- Journey data or component behavior;
- decision routing;
- Your World page content;
- country pages;
- landing page;
- login or signup;
- database schema;
- authentication;
- matching or ranking;
- subscription or country access;
- profile wizard;
- AI behavior;
- Capacitor configuration.

**Stop after Phase 1.** Do not continue because the remaining phases are documented. Await explicit owner approval.

### Phase 2 — Dashboard composition and Journey mobile behavior

Future authorized work after separate approval:

- refine the Dashboard conversational doorway;
- show the first three real matched destinations;
- remove arbitrary fallback destinations;
- preserve recommended action and honest progress;
- refine the desktop Journey rail if necessary;
- implement the compact, collapsible mobile Journey summary;
- verify returning from Greenbook reaches Dashboard without a preview modal.

### Phase 3 — Your World and destination integration

Future authorized work after separate approval:

- ensure the map highlights and pins real matched countries;
- place search below the map;
- place the user's first three matches first in Recommended for You;
- keep destination discovery out of the sidebar;
- verify country-page access and entitlement consistency using the approved reference behavior;
- preserve the map's current resilient SVG implementation.

### Phase 4 — Planning and research workspace consistency

Future authorized work after separate approval:

- apply the simplified shell consistently to Pathways, My Plan, Documents, Cost Calculator, Greenbook, and Community;
- keep each feature structured rather than turning it into a chat transcript;
- personalize approved research links and content from real match data;
- implement content ingestion only under a separate data, sourcing, moderation, and legal specification.

### Phase 5 — Marketing and onboarding

Future authorized work after separate approval:

- simplify the landing-page hierarchy;
- ensure mobile header collapse and visible Sign in access;
- preserve pricing, SEO, authentication, and matching inputs;
- do not reduce quiz inputs without auditing their effect on matching.

### Phase 6 — Native readiness and Capacitor spike

Future authorized work after the responsive web experience passes verification:

- define mobile API and authentication requirements;
- test deep links, secure storage, lifecycle, offline states, and hardware back behavior;
- do not use Capacitor `server.url` as the production architecture;
- do not package a thin website wrapper for store submission;
- add native value only under a separate approved specification.

## 15. Phase 1 acceptance criteria

### Desktop

- Sidebar expands to 256px and collapses to 64px without layout overflow.
- New question, Dashboard, Your World, Pathways, My Plan, Documents, Flutter Mode, Greenbook, Community, Cost Calculator, Passport Index, and Profile are reachable.
- Matched countries and redundant Destinations navigation are absent from the sidebar.
- Current-route highlighting works for direct routes and nested pages.
- Collapsed icons remain understandable and accessible.
- Account menu, Settings, Admin authorization, and Sign out still work.
- Dashboard Journey rail remains visually and behaviorally unchanged.
- Dashboard does not show two competing question inputs.
- Country routes retain their current compatible shell/template behavior.

### Mobile/tablet

- At 320px, 375px, 768px, and 900px there is no horizontal page overflow caused by the shell.
- Hamburger opens the drawer.
- Backdrop, Escape, close control, and route selection close the drawer.
- Background does not scroll while the drawer is open.
- Focus enters and exits the drawer correctly.
- Profile/account access remains visible.
- No bottom navigation is added.

### Data and architecture

- No new framework, component library, styling system, or auth system is installed.
- The Sidebar no longer requests `/api/matches`.
- No production data is fabricated.
- No database, matching, plan, subscription, or entitlement logic changes.
- Existing protected redirects and validated `next` flow continue to work.
- Server/Client boundaries remain valid and serializable.
- Cloudflare/OpenNext build compatibility is preserved.

## 16. Verification requirements

Run and report:

```bash
npx tsc --noEmit
npx eslint <each changed TypeScript/TSX file>
npm run build
```

Run focused shell tests if they already exist; add narrowly scoped tests only when needed to verify the changed behavior.

Manually verify:

- 320px
- 375px
- 768px
- 900px
- 1024px
- 1280px
- 1440px

Test at minimum:

- Dashboard, sidebar expanded;
- Dashboard, sidebar collapsed;
- Dashboard Journey expanded and collapsed;
- mobile drawer closed and open;
- Your World;
- My Plan;
- one country page;
- account menu;
- logout;
- keyboard navigation;
- reduced motion.

If repository-wide lint or build has a pre-existing failure, prove that the failure is unrelated by reporting the exact failing file and confirming focused validation for every changed file. Do not hide or repair unrelated failures.

## 17. Reporting requirements

At the end of Phase 1, report:

1. Outcome in plain language.
2. Branch name.
3. Files changed.
4. Shell behaviors implemented.
5. Desktop and mobile verification performed.
6. Typecheck, lint, and build results.
7. Pre-existing failures left unchanged.
8. Assumptions or deviations.
9. Confirmation that Phases 2–6 were not implemented.

Update `docs/kolmari/CURRENT-STATE.md` with the approved Phase 1 result. Do not rewrite unrelated history in that file.

## 18. Explicit non-goals

This shell project does not authorize:

- a full-site redesign;
- a general-purpose Kolmari chatbot;
- saved conversations or conversation history;
- AI-generated Match Scores or immigration answers;
- changes to country research content;
- changes to paid/free access;
- moving production data into local storage;
- deleting routes because they are removed from navigation;
- replacing the official app with the demo;
- changing the map implementation;
- changing landing-page content during Phase 1;
- changing quiz questions or scoring;
- adding Capacitor during Phase 1;
- copying ChatGPT source code, trademarks, colors, or branded assets.

## 19. Codex execution directive

Use the following directive when starting implementation:

> Act as a senior Next.js 16 product engineer and UI/UX implementation specialist working in `Naylahknee/kolmari`. Create and work only on branch `codex/chatgpt-shell-phase-1`. Read `/AGENTS.md`, `/DESIGN.md`, `/docs/kolmari/00-README.md`, `/docs/kolmari/09-IMPLEMENTATION-RULES.md`, `/docs/kolmari/10-LLM-RULES.md`, `/docs/kolmari/CURRENT-STATE.md`, and this complete specification before changing code. Inspect the existing shell files and current behavior. Implement Phase 1 only. Preserve Seven Layer Dip Layers 1–3, all authentication, data, routes, matching, entitlements, Dashboard content, Journey behavior, country pages, and unrelated working behavior. Modify only the Phase 1 allowed files. Reuse existing components and tokens. Do not add packages. Validate at all required widths, run typecheck, focused lint, and production build, update `CURRENT-STATE.md`, and stop after reporting results. If an instruction conflicts with current production behavior or requires a file outside the allowed list, stop and report the conflict instead of expanding scope.

---

## Final drift gate

Phase 1 is complete only if the application looks and navigates more like a calm, familiar AI workspace while still unmistakably functioning as Kolmari.

If the result resembles a generic chatbot, a travel booking product, a different brand, or a full-product redesign, the implementation has drifted and must not ship.
