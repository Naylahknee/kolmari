# Nexit Interaction Design

## Purpose

This document defines how Nexit should behave as users move through:

```text
Nexitnation Map
→ Region Workspace
→ Country Workspace
→ Nexit Plan
```

It explains:

- what happens when users hover
- what happens when users click
- what changes on screen
- how transitions should feel
- how map discovery becomes structured research
- how research becomes relocation planning
- which interactions should remain stable
- which animations are appropriate
- which behaviors should be avoided

This document governs interaction behavior.

For visual identity, typography, colors, and design tokens, use the other Nexit design documents.

---

# Core Interaction Principle

Nexit should help users move from uncertainty to clarity.

Each interaction should answer one of these questions:

1. Where can I go?
2. Which places are relevant to me?
3. What does this place mean for my life?
4. What should I research next?
5. What should I do next?

Interactions must support decision-making.

Do not add motion, controls, overlays, or effects that exist only to make the interface look impressive.

---

# Experience Model

The core Nexit experience has four stages.

## Stage 1: Discover

Primary surface:

```text
Nexitnation Map
```

Primary question:

> Where should I begin looking?

The user explores:

- world regions
- countries
- saved Nextinations
- relevant country groupings
- geographic relationships

The experience should feel open, calm, and exploratory.

---

## Stage 2: Narrow

Primary surface:

```text
Region Workspace
```

Primary question:

> Which countries in this region deserve a closer look?

The user begins comparing:

- countries
- costs
- pathways
- safety context
- healthcare
- education
- community fit
- available evidence

The experience should become more structured.

---

## Stage 3: Evaluate

Primary surface:

```text
Country Workspace
```

Primary question:

> Could this country work for my actual life?

The user evaluates:

- personal fit
- immigration pathways
- cost of living
- employment
- healthcare
- education
- housing
- transportation
- legal and tax context
- community insights
- family and pet considerations

The experience should feel focused and evidence-based.

---

## Stage 4: Plan

Primary surface:

```text
Nexit Plan
```

Primary question:

> What do I need to do next?

The user moves from research into:

- saved decisions
- tasks
- documents
- timelines
- budgets
- pathway preparation
- relocation milestones

The experience should feel actionable without becoming overwhelming.

---

# Interaction Character

Nexit interactions should feel:

- calm
- deliberate
- editorial
- responsive
- stable
- trustworthy
- understandable
- purposeful

Nexit interactions should not feel:

- game-like
- bouncy
- flashy
- noisy
- excessively animated
- unpredictable
- celebratory for routine actions
- like a travel-booking product
- like an AI demo

---

# Navigation Model

Nexit uses progressive depth.

```text
World
→ Region
→ Country
→ Plan
```

Each level should provide more detail than the level before it.

The user should always understand:

- where they are
- how they arrived there
- how to go back
- what the next action is

Do not force users to restart from the map when moving backward.

Preserve context whenever possible.

Examples:

```text
Portugal
→ Back to Europe
→ Europe remains selected
```

```text
Europe
→ Back to Nexitnation
→ Europe remains visible or highlighted
```

---

# Map Interaction Levels

The Nexitnation experience has three geographic interaction levels.

## Level 1: World

Purpose:

- discover regions
- understand global geography
- begin broad exploration

Primary elements:

- world map
- region labels
- search
- saved indicators
- map controls
- profile relevance explanation, when available

At this level, the user should not see a full country report.

---

## Level 2: Region

Purpose:

- compare countries within a geographic area
- understand broad regional differences
- begin narrowing options

Primary elements may include:

- selected region highlight
- region summary
- country cards
- region-level filters
- saved region action
- pathway overview
- community insight preview

The map may remain visible, but the region workspace becomes the primary research surface.

---

## Level 3: Country

Purpose:

- open focused country research
- evaluate real-life suitability
- continue into the Country Workspace

The map should not attempt to contain the entire country experience.

After country selection, the user should enter the Country Workspace or open a concise country preview first.

---

# World Map Behavior

## Initial Load

When the Nexitnation page opens:

1. Show the application shell.
2. Show a defined map loading state.
3. Load Mapbox.
4. Load the approved map style.
5. Load country and region geometry.
6. Load saved-country state, when available.
7. Load personalization only when real profile data exists.
8. Transition into the ready state.

Do not show a large blank dark rectangle while the map initializes.

Do not block the rest of the application shell unnecessarily.

---

## Default View

The default view should show the world at a useful scale.

The view should:

- keep all major regions understandable
- avoid excessive ocean space
- preserve room for region labels
- remain usable on common desktop sizes
- adapt appropriately on mobile

The default camera must not change unpredictably because unrelated data loads.

---

## Region Hover

When a pointer user hovers over a region:

- subtly increase the region outline or highlight
- show the region name
- indicate that the region is selectable
- preserve readable country boundaries
- use a pointer cursor when appropriate

Hover behavior must not:

- aggressively pulse
- enlarge the region
- hide neighboring regions
- play sound
- trigger navigation
- open a large panel automatically
- create rapid flashing when the pointer moves

Hover is a preview, not a commitment.

---

## Region Focus

Keyboard focus should provide an equivalent visible state to hover.

Focused regions must have:

- a clear focus indicator
- an accessible label
- a clear action
- predictable keyboard order where technically supported

Important regional and country content must also be available through a non-map interface.

---

## Region Selection

When the user selects a region:

1. Mark the region as selected.
2. Preserve that selected state.
3. Move the camera toward the region.
4. Reveal a concise region preview or transition toward the Region Workspace.
5. Update the URL when appropriate.
6. Keep a visible way to return to the world view.

Selection should feel intentional.

Do not immediately replace the screen before the user can understand what they selected.

---

## Region Transition

The transition from world to region may include:

- a gentle camera movement
- a restrained region highlight
- a soft content fade
- a side panel or workspace reveal
- preservation of the app shell

The transition should communicate:

> You are entering this region.

It should not communicate:

> A dramatic animation is playing.

---

# Country Interaction on the Map

## Country Hover

When a country is hoverable:

- show a subtle boundary highlight
- show the country name
- indicate whether a workspace is available
- show saved status when useful

Do not show unsupported metrics on hover.

Do not show a Match Score unless the score is real, available, and explainable.

---

## Country Selection

When a country is selected:

1. Highlight the selected country.
2. Keep the country highlighted while its preview is open.
3. Open a concise country preview.
4. Show only available and verified information.
5. Provide a clear action to open the full Country Workspace.
6. Allow the user to close the preview.
7. Clear the previous selection when another country is selected.

Do not change the selected country because of unrelated re-renders or background requests.

---

## Country Preview

The preview may include:

- country name
- region
- short country summary
- saved state
- data availability status
- verified high-level cost information
- available pathways
- Greenbook or community insight status
- action to open the Country Workspace

The preview should not contain:

- the full country report
- large comparison tables
- unsupported recommendations
- fabricated personal fit
- definitive legal conclusions
- entire visa analyses
- long-form planning tools

The preview is a bridge into research.

---

## Opening a Country Workspace

When the user chooses to open a country:

1. Preserve the country selection.
2. Navigate to the approved country route.
3. Load the Country Hero.
4. Show the appropriate country navigation.
5. Preserve the user's region context when possible.
6. Provide a clear route back to the region or map.

The user should not feel that they have entered an unrelated part of the application.

---

# Region Workspace Behavior

## Purpose

The Region Workspace helps users narrow a broad geographic interest into specific country options.

It should answer:

- What defines this region?
- Which countries should I examine?
- How do the countries differ?
- What pathways may be relevant?
- What should I open next?

---

## Region Hero

The Region Hero may include:

- region name
- concise regional summary
- approved imagery
- number of represented countries
- relevant high-level indicators
- save-region action
- breadcrumb navigation

The hero should not imply that an entire region shares one uniform experience.

Avoid broad guarantees about:

- safety
- affordability
- healthcare
- culture
- immigration ease
- community acceptance

---

## Country Cards

Country cards should support comparison.

A country card may show:

- country name
- city or regional context
- approved image
- saved state
- verified cost summary
- data availability
- relevant profile explanation
- real Match Score, only when available
- clear open-country action

Country cards should not:

- show fabricated scores
- imply eligibility
- use unsupported rankings
- hide uncertainty
- include too many competing metrics
- behave like hotel or vacation cards

---

## Country Card Interaction

On hover or focus:

- slightly raise or emphasize the card
- reveal a clear border or shadow change
- preserve all text
- keep the save control accessible

On click:

- open the country workspace
- do not trigger save unless the user clicked the save control
- preserve region context

The entire card may be clickable only when nested controls remain accessible and predictable.

---

## Region Comparison

Comparison interactions may allow users to:

- select two or more countries
- compare a defined set of factors
- remove countries from comparison
- save the comparison
- continue to individual country workspaces

Comparison must clearly separate:

- verified data
- user preferences
- community insights
- incomplete information
- legal or visa information

Do not produce one unexplained overall winner.

---

# Country Workspace Behavior

## Persistent Country Context

The Country Hero should remain the stable identity anchor for the workspace.

As the user moves between country sections:

- the country identity should remain clear
- the route should remain within the same country workspace
- saved state should remain accurate
- navigation should not reset without reason
- unrelated sections should not reload the entire page unnecessarily

---

## Country Section Navigation

Country navigation may be:

- standard
- personalized

Personalization may reorder sections.

Personalization must not:

- hide essential research
- fabricate relevance
- create a different information architecture on every render
- change the order repeatedly within the same session

Section ordering should remain stable during the user's session unless the user changes relevant preferences.

---

## Progressive Disclosure

Country pages should show:

1. the section title
2. a concise summary
3. key facts or tradeoffs
4. a clear next action
5. expandable supporting detail

Do not hide the entire meaning of a section inside accordions.

Accordions should contain supporting detail, not the only useful content.

---

## Save Behavior

When the user saves a country:

1. Update the control immediately when safe.
2. Show a calm confirmation.
3. Persist the change.
4. Handle errors visibly.
5. Restore the previous state if persistence fails.

Do not use confetti or oversized success animations.

Do not claim the country was saved if the request failed.

---

# Nexit Plan Transition

## Starting a Plan

A user may begin a Nexit Plan from:

- the Country Workspace
- a saved country
- a region workspace
- the dashboard
- a comparison result

When the user starts a plan:

1. Confirm which country or pathway the plan relates to.
2. Use real saved data.
3. Do not fabricate completed steps.
4. Create an understandable starting state.
5. explain what information is missing.
6. show the first useful action.

---

## Plan Creation Feedback

After a plan is created:

- show a clear confirmation
- identify the country or pathway
- provide an action to open the plan
- preserve the user's research context
- avoid blocking modal sequences unless a decision is required

---

# Search Behavior

## Global Search

Search may support:

- country names
- regions
- pathway names
- saved countries
- relevant workspace sections

Search results should:

- identify the result type
- show a clear destination
- use verified labels
- avoid fabricated matches
- handle no-result states clearly

---

## Search Selection

When a user chooses a result:

- navigate directly to the appropriate destination
- preserve the query only when useful
- close the search interface
- focus the destination appropriately

Do not force the user through the map when they directly searched for a country.

---

# Filters

Filters should help users narrow information, not create an illusion of certainty.

Filters may include:

- region
- cost range
- language
- pathway availability
- climate
- healthcare considerations
- education needs
- family needs
- community considerations

Filters must:

- show active states
- support clearing
- explain unavailable results
- avoid silently excluding all options
- not imply legal eligibility

---

# Saved State

Saved controls should behave consistently across:

- the map
- region cards
- country cards
- country workspaces
- comparisons
- the dashboard

The same saved country should show the same state everywhere.

Do not maintain disconnected local save states that contradict the database.

---

# Empty States

Empty states should explain:

- what is missing
- why the area is empty
- what the user can do next

Examples:

```text
You have not saved any Nextinations yet.
Explore the Nexitnation Map to begin.
```

```text
Complete your Nexit Profile to receive personalized country ordering.
You can still explore every country without it.
```

Do not fill empty areas with fabricated recommendations.

---

# Loading States

Loading states should preserve layout stability.

Use:

- skeletons for structured cards
- labeled map loading states
- compact progress indicators
- reserved content space

Avoid:

- full-screen spinners for small updates
- layout jumps
- rapidly flashing placeholders
- indefinite loading without explanation

---

# Error States

Errors should:

- explain what failed
- preserve navigation
- provide a retry action when appropriate
- avoid exposing sensitive technical details
- avoid implying that data loaded successfully

Examples:

```text
The map could not load.
Check your connection and try again.
```

```text
We could not save this country.
Your previous saved state has been restored.
```

---

# Motion System

## Motion Purpose

Motion may be used to:

- show cause and effect
- preserve spatial context
- indicate selection
- reveal supporting content
- communicate navigation depth
- confirm a state change

Motion should not be used as decoration.

---

## Motion Character

Motion should feel:

- smooth
- restrained
- calm
- direct
- intentional

Avoid:

- bouncing
- spinning
- elastic movement
- repeated pulsing
- dramatic zooms
- excessive parallax
- long cinematic sequences
- unrelated background movement

---

## Recommended Timing

Use these as general targets, not rigid requirements:

| Interaction | Suggested Duration |
|---|---:|
| Button or control feedback | 100–180 ms |
| Card hover or focus | 120–200 ms |
| Panel reveal | 180–280 ms |
| Accordion open or close | 180–300 ms |
| Map highlight | 150–250 ms |
| Map camera transition | 450–900 ms |
| Page content fade | 180–320 ms |

Avoid stacking several long transitions in sequence.

The interface should remain responsive even when motion is present.

---

## Reduced Motion

Respect the user's reduced-motion preference.

When reduced motion is enabled:

- avoid animated camera travel where possible
- use immediate or very short state changes
- remove nonessential fades and slides
- preserve all navigation and meaning
- do not remove required feedback

---

# Panels, Drawers, and Sheets

## Desktop

Desktop may use:

- side panels
- anchored previews
- persistent comparison areas
- contextual detail panels

Panels should not cover the entire map unless the user enters a full workspace.

---

## Mobile

Mobile may use:

- bottom sheets
- full-height drawers
- compact overlays
- sticky primary actions

Mobile sheets should:

- have a visible handle or close control
- support scrolling
- preserve map context when partially open
- use large touch targets
- avoid placing critical controls behind browser UI

---

# Modals

Use a modal only when the user must make a focused decision before continuing.

Appropriate examples:

- confirm removal
- choose which plan to add a country to
- confirm leaving unsaved work

Do not use a modal for:

- routine country previews
- basic navigation
- long country reports
- information that belongs in the page
- every save confirmation

---

# Notifications

Notifications should be:

- brief
- specific
- calm
- truthful

Examples:

```text
Portugal was saved to My Nextinations.
```

```text
Your plan was updated.
```

```text
We could not save this change.
```

Avoid vague notifications such as:

```text
Success!
```

Do not show success before persistence is confirmed unless optimistic behavior is safely reversible.

---

# Accessibility Interaction Rules

All important interactions must support:

- keyboard navigation
- visible focus
- readable labels
- semantic controls
- screen-reader descriptions
- sufficient contrast
- logical reading order
- touch targets appropriate for mobile

Map-only information must have an accessible non-map alternative.

Do not require:

- hover
- color recognition
- drag gestures
- precise pointer control

as the only way to access important information.

---

# State Stability

User interface state should remain stable.

Do not unexpectedly reset:

- selected region
- selected country
- active country section
- comparison list
- filters
- saved state
- scroll position
- open supporting detail

State may reset when:

- the user explicitly clears it
- the selected entity no longer exists
- the user signs out
- the route intentionally changes context
- preserving the state would be misleading or unsafe

---

# URL Behavior

Important navigation state may be represented in the URL.

Examples:

```text
/nexitnation?region=europe
/nexitnation?country=portugal
/nextination/portugal
/nextination/portugal/healthcare
```

URLs should be:

- readable
- shareable
- refresh-safe
- compatible with browser back and forward behavior

Do not include sensitive profile information in the URL.

---

# Browser Back and Forward Behavior

Browser navigation should work predictably.

Examples:

```text
Country Workspace
→ Back
→ Region Workspace
```

```text
Region Workspace
→ Back
→ World Map
```

Do not intercept browser navigation in ways that trap users.

---

# Data Trust During Interaction

Every dynamic interaction must distinguish between:

- loaded data
- loading data
- unavailable data
- incomplete data
- personalized data
- canonical country data
- community insight
- legal or pathway guidance

Do not temporarily display invented placeholder facts as though they are real.

Placeholders should look like placeholders.

---

# AI-Assisted Interactions

AI may help users:

- interpret information
- summarize tradeoffs
- identify research gaps
- formulate questions
- understand pathways
- organize a plan

AI must not:

- pretend to know missing profile data
- silently change saved decisions
- claim legal eligibility
- create unexplained Match Scores
- make irreversible changes without confirmation
- replace source disclosure

AI-generated outputs should be clearly distinguishable from verified country data where necessary.

---

# Responsive Interaction Summary

## Desktop

Prioritize:

- visible map context
- side panels
- comparison
- persistent navigation
- richer country cards
- simultaneous context and detail

## Tablet

Prioritize:

- collapsible panels
- simplified controls
- clear hierarchy
- reduced information density

## Mobile

Prioritize:

- large touch targets
- bottom sheets
- direct navigation
- shorter summaries
- sticky actions
- minimal map controls
- clear close and back behavior

Do not shrink the desktop interaction model without redesigning it for touch.

---

# Prohibited Interaction Patterns

Do not add:

- automatic carousels
- decorative pulsing markers
- confetti
- endless animated backgrounds
- autoplay video
- surprise audio
- forced onboarding tours
- repeated modal interruptions
- hidden navigation
- misleading loading completion
- fake activity indicators
- random AI suggestions
- unsupported recommendation badges
- travel-booking urgency
- countdown timers
- scarcity language
- manipulative save prompts

---

# Interaction Validation

Before an interaction is considered complete, verify:

- the user understands what is clickable
- hover and focus states are visible
- keyboard use is possible
- touch behavior works
- loading is explained
- errors are visible
- selected state is stable
- browser back and forward work
- URLs remain meaningful
- saved state is accurate
- no unsupported data appears
- reduced-motion preferences are respected
- mobile panels can be opened and closed
- navigation preserves context
- Cloudflare compatibility is preserved
- no unrelated working behavior was broken

---

# Map-to-Plan Validation Journey

Test this complete path:

1. Open the Nexitnation Map.
2. Select a region.
3. Open the Region Workspace.
4. Select a country.
5. Open the Country Workspace.
6. Review at least two country sections.
7. Save the country.
8. Begin or update a Nexit Plan.
9. Return to the country.
10. Return to the region.
11. Return to the world map.
12. Confirm that context and saved state remain accurate.

The experience should feel like one connected system.

---

# Implementation Rule

Before implementing or changing a major interaction:

1. Read `/AGENTS.md`.
2. Read `/DESIGN.md`.
3. Read this file.
4. Read the documentation for the affected page or component.
5. Inspect the existing interaction.
6. Preserve working behavior that does not conflict with approved rules.
7. Define the intended states before writing code.
8. Implement one bounded interaction at a time.
9. Test desktop, tablet, and mobile behavior.
10. Test loading, empty, error, and success states.
11. Test keyboard and reduced-motion behavior.
12. Update `/docs/nexit/CURRENT-STATE.md`.
