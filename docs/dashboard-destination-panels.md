# Dashboard Destination Panels

**Status:** Canonical Dashboard destination-card design

**Applies to:** `/dashboard`

**Primary components:**

- `src/components/kolmari/dashboard/destination-panel.tsx`
- `src/components/kolmari/dashboard-side-cards.tsx`
- `src/app/(app)/(workspace)/dashboard/page.tsx`

**Related systems:**

- `docs/country-design-system.md`
- `docs/country-hero-generator.md`
- `src/lib/country-assets.ts`
- `src/lib/country-visuals/data.ts`
- `src/lib/userProfile.ts`

---

## 1. Purpose

The Dashboard Destination panel shows the user's strongest current country matches as visual, navigable country cards.

The panel is a **presentation of existing match state**. It does not create a second matching engine, a second shortlist system, or a second primary-destination state.

The governing behavior is:

```text
COMPLETED PROFILE
    ↓
COUNTRY MATCH ENGINE
    ↓
RANKED COUNTRIES
    ↓
RESOLVE CANONICAL COUNTRY HERO
    ↓
DASHBOARD DESTINATION PANELS
    ↓
COUNTRY OVERVIEW
```

---

## 2. Review of the Proposed Destination Visa Dashboard Prompt

The proposed design is directionally compatible with Kolmari but must be adapted rather than copied literally.

### Keep

- Responsive one-to-three-column image-card grid.
- Approximately 190–208px visual card height.
- Strong image overlay for readable text.
- Country name as the dominant label.
- Match badge/score.
- Restrained hover movement.
- Existing Kolmari Geist/display typography and design tokens.
- Country card navigation into the country workspace.

### Do not add to the Dashboard card template yet

- A card-local `useState` concept of "Primary" destination.
- A card-local lock button.
- A second visa-options accordion directly below the country grid.
- Indigo/Emerald styling that bypasses the existing Kolmari navy/gold/token system.
- User-specific image generation.

These exclusions prevent the Dashboard from creating behavior that duplicates existing Kolmari systems.

`Primary destination` must eventually bind to the canonical destination relationship/decision state. Visa details already have dedicated Pathways and Active Pathway surfaces. The Dashboard destination cards should not invent separate versions of those behaviors.

---

## 3. Image Generation Rule

### Never generate one image per user match

A match should generate a **panel**, not a unique AI image.

Country imagery is a reusable country-level asset.

Correct model:

```text
COUNTRY
    ↓
ONE CANONICAL HERO ASSET
    ↓
Country Page
Dashboard Match Panel
Future Comparison Surfaces
Other approved country surfaces
```

Incorrect model:

```text
USER A + PORTUGAL → GENERATE PORTUGAL IMAGE
USER B + PORTUGAL → GENERATE ANOTHER PORTUGAL IMAGE
USER C + PORTUGAL → GENERATE ANOTHER PORTUGAL IMAGE
```

The incorrect model increases cost, produces visual inconsistency, slows dashboard loading, and creates unnecessary AI variance.

---

## 4. Existing Image Generator

Kolmari already has a country hero generation system.

The generation core is:

`src/lib/country-visuals/generate.ts`

It uses OpenAI `gpt-image-2` and prefers the image-edits path with:

1. The real local rasterized country flag.
2. The committed National Flag Shadow Hero reference.
3. A standardized country silhouette/fabric prompt.

Generated heroes are stored through:

`src/lib/country-assets.ts`

Saved generated heroes are served through:

`/api/country-asset?slug={country-slug}&type=hero`

The existing generation lock prevents multiple simultaneous generations for the same country.

---

## 5. Dashboard Image Resolution Hierarchy

The Dashboard must follow the same country-image authority as the country pages.

```text
1. SAVED GENERATED HERO
   Neon country_generated_assets
   ↓ if absent

2. APPROVED COMMITTED HERO
   src/lib/country-visuals/data.ts
   ↓ if absent

3. BRANDED FALLBACK PANEL
   Navy/gold Kolmari visual
   + background request to existing HeroAutoGenerate
```

The Dashboard must not call OpenAI directly.

The browser must never receive `OPENAI_API_KEY`.

`HeroAutoGenerate` may request the existing internal ensure endpoint when a matched country has no saved hero. The server-side generation lock remains responsible for deduplication.

---

## 6. Data Contract

The canonical Dashboard destination-card data is:

```ts
type DashboardDestinationPanelData = {
  country: CountryDetail
  match: number | null
  imageSrc: string | null
  routeLabel: string | null
  monthlyCost: string | null
}
```

The card must not calculate Match Scores.

The card receives the score already calculated by `rankNextinations(profile)`.

The card must not infer visa qualification.

The card may display the country's existing route label as descriptive context, but pathway eligibility belongs to the pathway evaluation system.

---

## 7. Ranked Panel Selection

When the Profile Wizard is complete:

```text
rankNextinations(profile)
    ↓
TOP 3
    ↓
Dashboard Destination Panel
```

The Dashboard displays at most three country match panels in this surface.

When no ranked matches are available, the panel may display up to three unscored discovery countries as visual entry points, clearly labeled as unscored.

No Match Score may be fabricated.

---

## 8. Layout Standard

Container:

```text
white card surface
Kolmari standard border
Kolmari card radius
Kolmari tile shadow
16–20px internal padding
```

Destination grid:

```text
grid-cols-1
md:grid-cols-3
gap-4
```

Individual destination card:

```text
min-height: 190px
border-radius: 16px
overflow: hidden
background: canonical country hero or branded fallback
```

The Dashboard's Journey Tracker remains outside this grid and retains its existing docked behavior.

---

## 9. Image Treatment

Country imagery should remain visually consistent with the Country Design System.

The dashboard card applies a dark readability overlay approximately equivalent to:

```css
linear-gradient(
  180deg,
  rgba(13, 27, 57, 0.24) 0%,
  rgba(13, 27, 57, 0.82) 78%,
  rgba(13, 27, 57, 0.94) 100%
)
```

Do not independently recolor or heavily saturate the approved National Flag Shadow Hero.

The source artwork is already controlled by the country hero standard.

---

## 10. Card Information Hierarchy

Top:

- `Match #n` status pill.
- Match Score when calculated.
- `Unscored` when no score exists.

Bottom:

- City/context line.
- Country name.
- Existing route label where available.
- Monthly cost estimate where available.
- Navigation affordance.

Country name is the dominant visual label.

The panel must remain useful if secondary metadata is missing.

---

## 11. Interaction

Whole card:

```text
Click / tap → /nextinations/{slug}/v2/overview
```

Hover:

- Very small image scale increase.
- Small external/navigation arrow movement.
- No large bounce animation.

Keyboard:

- Entire card is focusable through the underlying link.
- Visible `focus-visible` ring.

Reduced motion:

Any future animation additions must respect `prefers-reduced-motion`.

---

## 12. Selected / Primary Destination Behavior

The supplied design prompt includes a `Primary`/lock interaction.

That behavior is **not part of this template yet**.

Reason:

Kolmari currently has overlapping destination concepts:

- Saved Destination
- Shortlist
- Command Center destination
- My Plan `saved_nextination`
- Journey `Decide` stage

The Dashboard must not create a sixth destination state.

When the canonical destination relationship state is implemented, this template may add a selected treatment such as:

```text
SELECTED destination
→ gold border
→ subtle gold ring
→ "Selected" badge
```

The state must come from persisted product logic, not local React state.

---

## 13. Visa Options

The supplied prompt proposes a visa-options list beneath the destination grid.

Do not duplicate that list inside this Dashboard panel.

Current Kolmari ownership:

```text
Destination card → country overview
Pathways → pathway research and fit
Active Pathway card → saved route summary
My Plan → selected pathway execution
```

If a future Dashboard requirement calls for one route preview per destination, it must consume existing pathway evaluation data and remain a summary, not become a new pathway engine.

---

## 14. Responsive Behavior

### Mobile

- One destination card per row.
- Full-width cards.
- No horizontal scrolling required.
- Minimum touch target is the whole card.

### Tablet and desktop

- Three columns when the available Dashboard content width permits.
- Cards remain equal-height through the shared minimum height.

The destination panel itself is a full-width Dashboard widget so the three-card grid is not compressed into the compact Deadlines/Active Pathway row.

---

## 15. Failure States

### No completed profile

Show unscored discovery cards with explanatory copy.

### No generated/approved hero

Show branded fallback immediately.

Background generation may begin through the existing hero ensure pipeline.

### Image generation fails

Keep branded fallback.

The dashboard must remain functional.

### No Match Score

Display `Unscored`.

Never display a placeholder percentage.

### Country data incomplete

Hide missing secondary metadata instead of fabricating it.

---

## 16. Image Cost Control

The approved architecture is country-level caching.

Generation cost is bounded by the number of uncovered countries, not the number of users or dashboard visits.

```text
FIRST uncovered request for country
→ claim generation lock
→ generate once
→ save hero

LATER requests
→ reuse saved asset
```

The Dashboard must never regenerate an existing saved hero simply because a different user matched to the country.

---

## 17. Template Ownership

The reusable visual unit is:

`DashboardDestinationPanel`

The Dashboard grouping/orchestration unit is:

`DashboardDestinationsCard`

The Dashboard page owns:

- Which countries are selected for display.
- Match ranking input.
- Resolution of stored/approved country image assets.

The individual card owns:

- Rendering.
- Navigation.
- Accessible card interaction.
- Missing-image fallback trigger.

It does not own:

- Match calculation.
- Destination selection state.
- Shortlist state.
- Visa qualification.
- Billing gates.
- AI prompt construction.

---

## 18. Preservation Rules

AI coding agents modifying this surface must preserve:

1. Existing `rankNextinations()` scoring logic.
2. Existing country hero generator and storage pipeline.
3. Existing Country Design System asset authority.
4. Existing Journey Tracker behavior.
5. Existing dashboard widget customization behavior.
6. Existing Pathways ownership of visa/pathway evaluation.
7. No fabricated Match Scores.
8. No fabricated eligibility claims.
9. No per-user AI image generation.
10. No card-local primary-destination state.

Any change that violates one of these rules requires an explicit product decision before implementation.

---

## 19. Canonical Dashboard Destination Flow

```text
USER COMPLETES PROFILE
        ↓
rankNextinations(profile)
        ↓
TOP 3 MATCHES
        ↓
resolve generated hero
        ├── found → use it
        └── missing
              ↓
        resolve approved hero
              ├── found → use it
              └── missing
                    ↓
             branded fallback
                    +
             background ensure request
                    ↓
            hero stored once
                    ↓
             future renders reuse it

USER SELECTS CARD
        ↓
/nextinations/{slug}/v2/overview
```

This is the canonical Dashboard Destination Panel template.
