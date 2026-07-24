# Nexit Adaptive Country Workspace — Implementation Plan

This document preserves the original adaptive-country-workspace intent and updates its visual destination for the Notion-inspired nested sidebar. Adaptive logic now ranks country chapters in the sidebar; it does not produce a horizontal tab strip.

## Product objective

Help each user reach the country research that matters most to their circumstances without hiding essential information or changing the navigation unpredictably.

## Workspace model

```text
My Nextinations
└── Portugal
    ├── Overview
    ├── Economic Profile
    ├── Cost of Living
    ├── Pathways
    ├── Housing
    └── remaining sections in personalized order
```

The persistent country hero remains above the active chapter. Only the chapter below changes.

## Country section registry

```ts
export type CountrySectionId =
  | "overview"
  | "economic-profile"
  | "cost-of-living"
  | "housing"
  | "pathways"
  | "employment"
  | "healthcare"
  | "education"
  | "transportation"
  | "legal-taxes"
  | "daily-life"
  | "family-pets"
  | "greenbook"
  | "resources";

export type CountrySectionDefinition = {
  id: CountrySectionId;
  label: string;
  routeSegment: string;
  basePriority: number;
  alwaysVisible: boolean;
  standardPosition: number;
  relevanceRules: RelevanceRule[];
};
```

## Standard order

1. Overview
2. Economic Profile
3. Cost of Living
4. Housing
5. Nexit Pathways
6. Employment
7. Healthcare
8. Education
9. Transportation
10. Legal & Taxes
11. Daily Life
12. Family & Pets
13. Greenbook
14. Resources

## Personalization context

```ts
export type CountryNavigationContext = {
  householdType: HouseholdType | null;
  incomePlans: IncomePlan[];
  priorities: Priority[];
  placePreferences: PlacePreference[];
  moveTimeline: MoveTimeline | null;
  monthlyBudget: number | null;
  hasChildren: boolean;
  hasPets: boolean;
  healthcareNeeds: boolean;
  accessibilityNeeds: boolean;
  employmentInterest: boolean;
  studyInterest: boolean;
  businessInterest: boolean;
  passiveIncomeInterest: boolean;
};
```

Public quiz answers may create a temporary context. Saved profile data becomes authoritative after signup. Missing fields remain unknown; do not infer them.

## Deterministic relevance scoring

| Section | Base | Relevant adjustments |
|---|---:|---|
| Overview | 1000 | Always first; never hidden |
| Economic Profile | 95 | Career +10; local employment +10; business +10; self-employment +8; passive income +5 |
| Cost of Living | 90 | Affordability +20; budget supplied +10; family +5; passive income +5 |
| Pathways | 90 | Move within 12 months +15; relevant income plan +10; study/business/retirement/employment +10 |
| Housing | 70 | Affordability +10; family +8; move within 12 months +10 |
| Employment | 60 | Local employment +25; career +20; self-employment +10; remote work +5 |
| Healthcare | 75 | Healthcare priority +20; family +8; accessibility +15; retirement/passive income +10 |
| Education | 40 | Children +35; study pathway +30; schools priority +25; no children/study −25 |
| Family & Pets | 35 | Family +30; multigenerational +30; children +20; pets +20; solo/no pets −20 |
| Transportation | 60 | Transit priority +25; large city +10; medium city +8 |
| Greenbook | 75 | Community +25; safety +10; family +5; always accessible |
| Legal & Taxes | 70 | Business +15; self-employment +12; remote +10; passive income +10; move within 12 months +10 |
| Daily Life | 65 | Lifestyle +15; language +10; climate +8; community +8 |
| Resources | 30 | Move within 6 months +20; within 12 months +10; normally last |

Weights are product defaults, not scientific measures. Changes to weights require documented rationale and tests.

## Ordering invariants

- `overview` is always position 1.
- Economic Profile remains within the first four sections.
- Cost of Living and Pathways remain easy to reach.
- Greenbook is never inaccessible.
- Resources normally remains last.
- Prefer reordering over hiding.
- A section with missing verified content may show an honest empty state rather than disappearing.

## Personalized and standard modes

The country tree includes a compact order menu:

```text
Section order
✓ Personalized for You
  Standard order
```

### Personalized for You

- Uses real profile or quiz context.
- Reorders country sections by deterministic relevance.
- Preserves essential sections.
- Computes once when the country workspace loads.
- Stores the resulting order for the session.

### Standard order

- Uses the master order.
- Shows all available sections.
- Supports systematic country research.

The user's mode preference should persist across sessions when logged in.

## Visibility

Always accessible:

- Overview
- Economic Profile
- Cost of Living
- Pathways
- Healthcare
- Legal & Taxes
- Daily Life
- Greenbook
- Resources

Optional sections may be omitted from the primary ranked list only when all four conditions are true:

1. No verified country content exists.
2. The section is irrelevant to the known profile.
3. The registry marks it optional.
4. It remains reachable through **All country sections**.

## Ranking functions

```ts
export function rankCountrySections(
  registry: CountrySectionDefinition[],
  context: CountryNavigationContext,
): RankedCountrySection[] {
  return registry
    .map((section) => ({
      ...section,
      relevanceScore:
        section.basePriority +
        calculateRuleScore(section.relevanceRules, context),
    }))
    .filter((section) => shouldDisplaySection(section, context))
    .sort(compareCountrySections);
}

export function normalizeCountrySectionOrder(
  sections: RankedCountrySection[],
): RankedCountrySection[] {
  return enforceCountrySectionPositions(sections, {
    first: "overview",
    economicProfileMaximumPosition: 4,
    last: "resources",
  });
}
```

Tie-breakers use `standardPosition`, then stable section ID. Do not use randomization.

## Stability rules

- Do not reorder while a user is actively navigating the country.
- Recompute only when the profile materially changes, the user explicitly refreshes personalization, or a new session begins.
- Preserve the active section after recomputing.
- Never move a section merely because network data completed loading.
- Do not visibly recalculate the country hero during the session.
- A saved sidebar order is presentation state, not evidence about the user.

## Component and file architecture

```text
src/components/nextinations/
  NextinationTree.tsx
  NextinationTreeCountry.tsx
  CountrySectionTree.tsx
  CountrySectionTreeItem.tsx
  CountrySectionOrderMenu.tsx
  AllCountrySectionsMenu.tsx

src/lib/country-workspace/
  country-section-types.ts
  country-section-registry.ts
  build-country-navigation-context.ts
  rank-country-sections.ts
  normalize-country-section-order.ts
  country-section-visibility.ts
  country-navigation-preferences.ts
```

## Test matrix

At minimum, test:

- family with children;
- solo remote worker;
- local job seeker;
- student;
- retiree/passive-income mover;
- business founder;
- user with healthcare/accessibility priorities;
- incomplete profile;
- standard-order mode;
- ties and missing section content;
- active-route preservation after recompute.

Tests should assert invariants, not only exact full arrays.

## Implementation phases

### Phase 1 — Registry and ranking foundation

- Define types and registry.
- Build profile-to-context mapping.
- Implement deterministic scoring and normalization.
- Add unit tests.

### Phase 2 — Nested sidebar integration

- Render saved Nextinations as expandable parents.
- Expand the active country only.
- Render ranked country sections beneath it.
- Add personalized/standard menu and **All country sections**.
- Remove horizontal country tabs.

### Phase 3 — Persistent country workspace

- Move the Country Hero into `[countrySlug]/layout.tsx`.
- Preserve shell and hero while chapter routes change.
- Add source and verification disclosures.

### Phase 4 — Country chapter delivery

Implement first: Overview, Economic Profile, Cost of Living, Pathways, Housing.

Then: Employment, Healthcare, Education, Transportation, Legal & Taxes, Daily Life, Family & Pets, Greenbook, Resources.

### Phase 5 — Planning integration

Allow chapter actions to add relevant items to the Nexit Plan, Documents, Calculator, saved research, and Nexit Tracker.

## Completion criteria

- No horizontal country tab strip remains.
- Personalized and standard order both work.
- Essential sections remain accessible.
- Order is deterministic and session-stable.
- The hero persists across country chapter navigation.
- No fake profile data or scores appear.
- Mobile navigation uses the workspace drawer.
- Ranking, visibility, and route-preservation tests pass.
