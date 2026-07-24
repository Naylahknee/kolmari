# Nexit Component System

Components must express the Nexit product model rather than acting as generic visual containers. Reuse before creating. Prefer borders, hierarchy, and document rhythm over decorative card grids.

## 8. Component language and inventory

Component filenames may preserve compatibility, but user-facing names follow the lexicon.

| Code component or legacy URL | Approved user-facing role | Notes |
| --- | --- | --- |
| `Wordmark` | NEXIT geometric arrow wordmark | Replace only after the logo family is approved |
| `Button` | Primary, ghost, and outline actions | Gold only for the primary action |
| `Card` | Structured content surface | White, `border-line`, restrained shadow |
| `StatCard` | Nexit Plan metric | One key measure and one supporting action |
| `ScoreRing` | Nexit Readiness | Accessible text must accompany the SVG |
| `MatchRing` | Match Score | Never imply scientific certainty without evidence |
| `BudgetDonut` | Budget overview | Pair color with labels and values |
| `ChecklistRow` | Nexit Tracker item | Clear complete, pending, warning, and blocked states |
| `CountryTile` / `CountryRow` | Nextination card or row | Name, location, Pathways, Match Score, Community Fit |
| `Sidebar` | Workspace navigation | Navy; active item may use Gold |
| `TopBar` | Search, alerts, and account controls | Keep compact and task-oriented |
| `BottomNav` | Responsive workspace navigation | Five or fewer primary destinations |
| `ProfileWizardStep` | Nexit Profile Wizard step | One primary question per step |
| `CtaBanner` | Nexicution Mode action | One primary CTA |

Legacy URLs such as `/visa-wizard` and `/checklist` may remain as redirects for compatibility. Do not expose them as permanent product navigation.
### Nexit accordion system

Use one accessible component family throughout the application.

```ts
export type AccordionBehavior =
  | "single"
  | "multiple"
  | "all-collapsed"
  | "first-open"
  | "recommended-open";
```

Visual rules:

- flat white or transparent surface
- 1px divider using `colors.border`
- 12–16px vertical padding
- navy title, muted summary, right-aligned chevron
- optional soft-neutral open state
- no heavy shadow
- no dramatic height animation
- 44px minimum touch target on mobile

Interaction rules:

- the whole trigger row is a semantic button
- include `aria-expanded` and `aria-controls`
- keyboard accessible with visible focus
- preserve state during client navigation where practical
- respect reduced motion
- allow only two levels of nested accordions maximum

Default-opening rules:

- open the highest-priority or recommended item by default
- do not open multiple large sections by default
- FAQs may start fully collapsed
- comparison-oriented research may use multiple-open mode
### Component architecture

```text
components/layouts/
  DashboardHomeLayout.tsx
  CountryWorkspaceLayout.tsx
  PathwaysDirectoryLayout.tsx
  PlanningWorkspaceLayout.tsx
  CalculatorToolLayout.tsx
  GreenbookDirectoryLayout.tsx
  DocumentManagerLayout.tsx
  MapDiscoveryLayout.tsx
  ComparisonWorkspaceLayout.tsx
  SettingsFormLayout.tsx
  StandardDocumentLayout.tsx

components/accordion/
  NexitAccordion.tsx
  NexitAccordionItem.tsx
  AccordionTrigger.tsx
  AccordionPanel.tsx
  AccordionStatus.tsx
  AccordionCount.tsx
  AccordionSourceList.tsx
```

## Required shared component families

```text
components/
  layout/
    AppShell
    WorkspaceHeader
    Sidebar
    MobileWorkspaceDrawer
  nextinations/
    CountryWorkspaceLayout
    CountryHero
    CountrySectionContent
    NextinationTree
    CountrySectionTree
    CountrySectionOrderMenu
  ui/
    NexitAccordion
    NexitAccordionItem
    SourceDisclosure
    VerificationBadge
    SectionHeader
    DecisionCallout
    EmptyState
    MetricGrid
    ComparisonTable
  pathways/
    PathwaySummaryCard
    PathwayMatchBadge
    PathwayDetail
  planning/
    PlanProgress
    PlanPhaseAccordion
    TaskRow
    DocumentStatus
```

## Component contract rules

- Components receive typed domain data; they do not invent placeholder values.
- Score components always include accessible text and a methodology path.
- Source and verification components are reusable, not hand-written differently on every page.
- Empty states explain what is missing, why it matters, and the next available action.
- Country navigation components must support both personalized and standard order.
- No component may hard-code a fabricated user profile, readiness score, match score, budget, household, or completion state.
