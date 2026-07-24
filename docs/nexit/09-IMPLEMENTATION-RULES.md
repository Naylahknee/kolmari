# Nexit Implementation Rules and Delivery Plan

This file translates the product documentation into repository work. Preserve current business logic, database queries, API contracts, SEO data, authentication, and Cloudflare compatibility unless a task explicitly changes them.

## 9. Application routes

The project uses `src/app`, not a root `app/` directory.

### Public and authentication routes

```text
src/app/
  (marketing)/page.tsx                 → public landing page
  (marketing)/[seoSlug]/page.tsx       → ten public SEO pages
  (auth)/signup/page.tsx               → signup
  (auth)/login/page.tsx                → login
```

Public SEO slugs:

1. `/move-to-portugal-from-us`
2. `/move-to-spain-from-us`
3. `/move-to-thailand-from-us`
4. `/best-countries-for-black-expats`
5. `/best-countries-for-single-women`
6. `/best-countries-for-families`
7. `/digital-nomad-visas-for-americans`
8. `/easiest-visas-for-us-citizens`
9. `/portugal-vs-spain-for-expats`
10. `/thailand-vs-mexico-cost-of-living`

### Protected workspace routes

```text
src/app/(app)/
  welcome/page.tsx
  profile-wizard/page.tsx
  onboarding/page.tsx                  → compatibility redirect
  (workspace)/
    dashboard/page.tsx
    nexitnation/page.tsx
    nexitnation/[region]/page.tsx
    pathways/page.tsx
    nexit-plan/page.tsx
    visa-wizard/page.tsx                → compatibility redirect
    countries/page.tsx
    countries/[slug]/page.tsx
    checklist/page.tsx
    cost-calculator/page.tsx
    greenbook/page.tsx
    community/page.tsx
    saved/page.tsx
    documents/page.tsx
    settings/page.tsx
```

Approved UI labels:

- `/nexitnation` → **Choose Your Nexitnation**
- `/nexitnation/[region]` → **Explore This Nextination**
- `/profile-wizard` → **Nexit Profile Wizard**
- `/pathways` → **Nexit Pathways**
- `/nexit-plan` → **Nexit Plan**
- `/countries` → **Nextinations**
- `/checklist` → **Nexit Tracker**
- `/greenbook` → **Greenbook Insights**
- `/community` → **Nexiters Community**
- `/saved` → **Saved Nextinations**

Keep `/countries`, `/visa-wizard`, and `/checklist` URLs for compatibility unless a separate migration is approved.

### Nexitnation interaction

- `/nexitnation` uses a responsive illustrated SVG world map with six accessible region links, image `clipPath` masks, Navy overlays, Gold outlines, and restrained motion.
- The main discovery map must not require Mapbox or a client token. Mapbox remains available for detailed country, city, neighborhood, and Greenbook location maps.
- Before profile completion, maps and cards show **Complete your Nexit Profile to see personalized matches** and never substitute a static score or match label.
- A region selection routes to `/nexitnation/[region]`; the map does not replace the protected App Shell.
- Region pages use the typed registry in `src/lib/nexitnation-data.ts` and retain **Match Score**, **Pathways**, **Community Fit**, and **Explore This Nextination** language.
- Passport Index is an outbound research resource only. Never scrape, embed, proxy, or reproduce its passport-strength and mobility data.

## 10. Authentication and continuation flow

- Authentication uses Neon user records, bcrypt password hashes, and JOSE-signed HS256 JWTs.
- The JWT is stored in a secure, `httpOnly`, `SameSite=Lax` session cookie in production.
- Current Route Handlers are `POST /api/login`, `POST /api/logout`, and `/api/profile` for profile reads and writes.
- Do not document or introduce an alternate authentication-handler namespace.
- Landing entry actions use **Start Your Nexit**.
- Logged-out access to an intended protected route uses `/signup?next=<safe-internal-route>` or `/login?next=<safe-internal-route>`.
- Preserve validated internal `next` paths through signup and login.
- Reject absolute external URLs, protocol-relative URLs beginning with `//`, backslashes, and control characters.
- The `(app)` workspace is protected by the Next.js 16 `src/proxy.ts` convention and server-side layout validation. Keep both layers.
- New accounts continue to `/welcome`. Users may start `/profile-wizard` or skip to `/nexitnation` without placeholder profile values.
- Completing the wizard persists the real Nexit Profile and continues to `/pathways`.
- Existing sign-ins continue to the validated internal `next` path; use `/dashboard` as the fallback.
- Empty personal fields remain `NULL` in Neon until the user supplies them.
## 30. Implementation Guidance

Suggested components:

```text
components/app-shell/
  NexitWorkspaceShell.tsx
  WorkspaceSidebar.tsx
  WorkspaceHeader.tsx
  SidebarSection.tsx
  SidebarItem.tsx
  SidebarTreeItem.tsx
  SidebarCollapseButton.tsx
  MobileSidebarDrawer.tsx
  WorkspaceCanvas.tsx

components/nextinations/
  CountryWorkspaceLayout.tsx
  CountryHero.tsx
  NextinationTree.tsx
  CountrySectionNavigation.tsx
  PersonalizedOrderControl.tsx
  SourceDisclosure.tsx
  LastVerified.tsx
  ResearchInProgress.tsx

components/nextinations/pages/
  OverviewPage.tsx
  EconomicProfilePage.tsx
  CostOfLivingPage.tsx
  HousingPage.tsx
  PathwaysPage.tsx
  EmploymentPage.tsx
  HealthcarePage.tsx
  EducationPage.tsx
  TransportationPage.tsx
  LegalTaxesPage.tsx
  DailyLifePage.tsx
  FamilyPetsPage.tsx
  GreenbookPage.tsx
  ResourcesPage.tsx

lib/navigation/
  sidebar-registry.ts
  build-sidebar-tree.ts
  rank-country-sections.ts
  sidebar-preferences.ts
```

### Country workspace rendering rule

The shared country layout must render:

```tsx
<CountryWorkspaceLayout>
  <CountryHero />
  <ActiveCountrySection />
</CountryWorkspaceLayout>
```

The hero remains stable while only `ActiveCountrySection` changes.

---

## 31. Completion Criteria

The v2 design system is correctly implemented when:

- The app uses the Nexit color and typography system.
- The desktop workspace has a collapsible nested sidebar.
- Mobile uses a drawer.
- Saved Nextinations appear as nested pages.
- Country research sections no longer use horizontal tabs.
- The country hero remains on every country page.
- Only the section beneath the hero changes.
- Adaptive ordering works.
- Standard ordering remains available.
- Economic Profile is prominent.
- The main canvas is less card-heavy.
- No fake user information appears.
- Source and verification patterns are implemented.
- Existing routes redirect safely.
- Type checking, linting, tests, and production build pass.

---
### Implementation priority

1. Build shared template registry, accordion system, and source disclosure.
2. Rebuild the long Pathways page.
3. Apply disclosure patterns to country chapters while preserving the hero.
4. Update Nexit Plan, Cost Calculator, Documents, and Compare.
5. Simplify Dashboard and preserve Nexitnation's visual discovery model.

---
# 29. Responsive Behavior

## Desktop

* Keep the main sidebar fixed or collapsible.
* Country hero spans the main content width.
* Main content uses approximately 960–1120px maximum width depending on the data type.
* Accordions fill the readable workspace width.
* Tool pages may use two columns where helpful.
* Comparison pages may use wider layouts.

## Tablet

* Collapse the main sidebar when space is limited.
* Preserve the country hero.
* Use one main content column.
* Calculator side panels stack.

## Mobile

* Sidebar becomes a drawer.
* Country hero becomes vertically stacked.
* Match score moves beneath the summary or into a compact top row.
* Actions stack or wrap.
* Accordions become full-width.
* Avoid nested accordions deeper than two levels.
* Keep sticky bottom actions only when necessary.
* Do not create horizontal tab strips.

---

# 30. Accessibility Requirements

* Use semantic headings.
* Accordion triggers must be buttons.
* Include `aria-expanded`.
* Include `aria-controls`.
* Use visible focus styles.
* Support keyboard navigation.
* Announce expanded or collapsed state.
* Do not rely on color alone.
* Maintain logical heading hierarchy.
* Use at least 44px touch targets on mobile.
* Respect reduced motion.
* Preserve screen-reader access to hidden panels appropriately.
* Do not mount essential content only after hover.

---

# 31. Performance Requirements

* Lazy-load large accordion panel content.
* Do not fetch every detailed section on initial page load.
* Load country hero and visible summary first.
* Prefetch the most likely next section.
* Cache public country data.
* Avoid rendering hidden charts.
* Do not initialize maps until opened.
* Preserve open state during client navigation.
* Avoid layout jumps when accordions open.

---

# 32. Implementation Phases

## Phase 1 — Shared system

Build:

* page-template registry
* reusable accordion system
* persistent country workspace layout
* source disclosure component
* empty-state component

## Phase 2 — Pathways page

Rebuild the long Pathways page first.

Implement:

* summary
* filters
* top matches
* expandable categories
* one default-open recommended pathway
* verified sources
* disclaimers

## Phase 3 — Country pages

Update:

* Economic Profile
* Cost of Living
* Housing
* Healthcare
* Education
* Legal & Taxes
* Daily Life
* Family & Pets
* Greenbook
* Resources

Preserve country hero.

## Phase 4 — Planning and tools

Update:

* Nexit Plan
* Cost Calculator
* Documents
* Comparison

## Phase 5 — Dashboard and Nexitnation

Simplify Dashboard.

Preserve the visual Nexitnation map experience.

---
## 34. Final Product Validation Checklist

Before merging a significant interface update, confirm all applicable items:

### Identity and language

- Nexit remains a relocation decision and planning system, not a travel or booking product.
- Approved product terms and action labels are used consistently.
- Logo artwork and brand assets follow the locked inventory and usage rules.
- Gold remains action-focused and teal remains community-focused.

### Structure

- The correct page template is used.
- The sidebar and workspace canvas behave correctly at all breakpoints.
- Country chapters retain the persistent country hero.
- Adaptive ordering reorders rather than unnecessarily hiding content.
- A standard-order option remains available where personalization changes navigation.

### Content disclosure

- The user can understand the page without opening several accordions.
- Primary metrics, warnings, tradeoffs, recommendations, totals, deadlines, and CTAs remain visible.
- Secondary detail is grouped in accessible accordions, toggles, drawers, or detail panels.
- Accordion nesting does not exceed two levels.
- The top relevant item is opened by default only when doing so improves comprehension.

### Trust and personalization

- No fake profile, household, budget, score, match, readiness, or eligibility data appears.
- Personalized copy is based on real profile or quiz data.
- Time-sensitive facts show source, reporting period, and verification status.
- Greenbook distinguishes verified resources, editorial context, and community reports.
- Legal, tax, immigration, financial, and healthcare information includes appropriate planning disclaimers.

### Accessibility and responsiveness

- Keyboard navigation works for sidebar trees, drawers, forms, and accordions.
- Focus states are visible.
- Color is not the sole status indicator.
- Touch targets meet mobile sizing requirements.
- Reduced-motion preferences are respected.
- Desktop, tablet, and mobile layouts are verified with real content lengths.

### Engineering

- Existing route compatibility is preserved or intentionally migrated.
- No duplicate token system or unnecessary UI framework was introduced.
- TypeScript passes.
- Linting passes.
- Relevant unit and interaction tests pass.
- The production Cloudflare-compatible build passes.
- Files created, changed, removed, redirected, and left incomplete are reported clearly.

## Canonical documentation check

Before implementation, identify the controlling files:

- identity or language → `01-DESIGN.md`
- visual tokens → `02-DESIGN-TOKENS.md`
- component behavior → `03-COMPONENTS.md`
- layout structure → `04-LAYOUTS.md`
- page content → `05-PAGE-TEMPLATES.md`
- adaptive country logic → `06-ADAPTIVE-WORKSPACE.md`
- data and trust → `07-DATA-MODEL.md`
- copy and disclosure → `08-CONTENT-STANDARDS.md`

## Required quality gates

```text
TypeScript typecheck
Lint
Unit tests
Component/accessibility tests
Production build
Responsive inspection
No fabricated data audit
Source and verification audit
```
