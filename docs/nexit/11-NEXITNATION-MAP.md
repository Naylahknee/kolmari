# Nexitnation Map

## Purpose

The Nexitnation Map is the geographic research and discovery layer of Nexit.

It helps users:
- explore countries and regions
- understand geographic relationships
- open country workspaces
- identify possible Nextinations
- compare locations visually
- move from map discovery into structured relocation research

The map is not a travel-booking map and should not behave like a tourism product.

## Core Experience

The map should feel:
- calm
- editorial
- structured
- trustworthy
- exploratory
- easy to understand

The map should not feel:
- game-like
- overly animated
- cluttered
- decorative
- like a vacation-planning website

## Primary Route

```text
/nexitnation
```

Country selections may route to:
```text
/nextination/[country-slug]
```

or the approved country workspace route used by the application.

Do not create duplicate country routes.

## Map Technology

Use the existing Mapbox implementation.

Preserve:
- `mapbox-gl`
- the existing environment variable for the Mapbox token
- Cloudflare compatibility
- current route structure
- existing country data
- existing user authentication and saved-country behavior

Do not introduce a second mapping library without explicit approval.

## Implementation Target

Before changing anything:
1. Read this file.
2. Inspect the existing map component and data sources.
3. Identify the current Mapbox source, layer, selection, and routing logic.
4. Preserve working behavior.
5. Make one bounded change at a time.
6. Test after each change.
7. Update `/docs/nexit/CURRENT-STATE.md`.

## Map States

The map must support these states:

### Loading
Show a clear loading state while:
- the map library loads
- the Mapbox style loads
- country data loads
- user-specific saved data loads

Do not show a blank unexplained area.

### Ready
The user can:
- pan
- zoom
- select a country or region
- open a country summary
- continue to the country workspace

### Empty Personalization
When the user has not completed their profile:
- show the standard map
- do not fabricate recommendations
- explain that profile completion can improve relevance

### Error
When the map cannot load:
- show a readable error message
- preserve navigation
- provide a retry action
- do not leave a blank canvas

### Unsupported Data
When a country lacks complete data:
- allow the country to remain visible
- label the information as incomplete
- do not invent statistics, scores, or eligibility

## Country Interaction

When a country is selected, show a concise preview containing only available information.

The preview may include:
- country name
- region
- short summary
- cost indicator
- safety or Greenbook status
- pathway availability
- saved status
- action to open the full country workspace

Do not place the entire country report inside the map popup.

## Selection Behavior

Country selection should be deterministic.

When the user selects a country:
1. Highlight the country.
2. Open the country preview.
3. Preserve the selected country while the preview is open.
4. Allow the user to continue to the country workspace.
5. Clear the selection when the user intentionally closes it or selects another country.

Do not change selected countries because of unrelated state updates.

## Visual Layers

Possible layers include:
- base geography
- country boundaries
- selected-country highlight
- saved Nextinations
- personalized relevance indicators
- Greenbook information
- regional imagery overlays

Every layer must have a defined purpose.

Do not add visual layers only for decoration.

## Regional Imagery

Regional imagery may be used to give the map a distinctive Nexit identity.

Imagery must:
- remain readable beneath interface elements
- not obscure country boundaries
- not reduce text contrast
- support the location being shown
- use approved assets
- remain subtle at lower zoom levels

Do not use random tourism photos as map decoration.

## Photo-Filled Continent Direction

If the map uses photo-filled continent styling:
- keep continent polygons as the clickable targets
- use the polygon shape to control where the image appears
- preserve visible boundaries
- keep hover and selection states readable
- do not rely on the image alone for interaction

The photo effect is visual only. The polygon remains the source of truth for clicks.

## Personalization

Personalization may influence:
- country emphasis
- ordering of suggested locations
- preview content
- saved-country indicators
- recommendation explanations

Personalization must not:
- hide countries
- fabricate a Match Score
- imply visa eligibility
- imply legal suitability
- imply that a country is safe for every user
- replace standard geographic navigation

When personalization data is incomplete, use the standard map experience.

## Match Scores

Only show a Match Score when:
- the required user profile fields exist
- the country data required by the scoring method exists
- the score can be explained
- the scoring system is implemented and validated

If those conditions are not met, do not show a placeholder or estimated score.

## Greenbook Information

Greenbook content should be clearly labeled.

It may include:
- community insights
- lived-experience indicators
- safety context
- external Greenbook resources
- source and verification information

Greenbook information must not be presented as a guarantee of safety.

## Accessibility

The map must provide:
- keyboard-accessible controls where supported
- readable focus states
- text alternatives for important map information
- a non-map path to country content
- sufficient contrast
- accessible labels for buttons and controls

A user must be able to reach country information without relying only on pointer interaction.

## Responsive Behavior

### Desktop
Desktop may use:
- full map canvas
- side preview panel
- persistent app navigation
- larger country information cards

### Tablet
Tablet may use:
- map with a collapsible preview panel
- reduced controls
- simplified information density

### Mobile
Mobile should use:
- map as the primary canvas
- bottom sheet or drawer for country previews
- large touch targets
- limited controls
- clear close and continue actions

Do not shrink the desktop sidebar and popup into an unusable mobile layout.

## Data Requirements

Map country records should use stable identifiers.

Recommended minimum fields:

```ts
type MapCountry = {
  id: string
  slug: string
  name: string
  iso2?: string
  iso3?: string
  region?: string
  subregion?: string
  coordinates?: [number, number]
  hasCountryWorkspace: boolean
  dataStatus: "complete" | "partial" | "unavailable"
}
```

User-specific map state should be stored separately from canonical country data.

Example:

```ts
type UserMapCountryState = {
  countryId: string
  saved: boolean
  status?: "researching" | "considering" | "planning"
  matchScore?: number
}
```

Do not store fabricated defaults as real user data.

## Component Responsibilities

Suggested components:

```text
NexitnationMap
MapCanvas
MapControls
CountryLayer
SelectedCountryLayer
SavedCountryLayer
CountryPreview
CountryPreviewMobileSheet
MapLegend
MapLoadingState
MapErrorState
```

Each component should have one clear responsibility.

Avoid one large component containing:
- Mapbox initialization
- data fetching
- personalization
- popup rendering
- routing
- saved-country logic
- responsive behavior

## URL State

Important map state may be represented in the URL.

Examples:

```text
/nexitnation?country=portugal
/nexitnation?region=europe
```

URL state should be:
- shareable
- readable
- reversible
- safe to refresh

Do not place sensitive profile information in the URL.

## Performance

The map should:
- load Mapbox only where needed
- avoid unnecessary map reinitialization
- memoize stable data where appropriate
- limit expensive layer updates
- avoid fetching the same country data repeatedly
- lazy-load nonessential panels
- keep mobile performance in mind

## Validation

Before considering the map complete, verify:
- the map loads without console errors
- the Mapbox token is read correctly
- country selection works
- country preview opens and closes
- routing to country pages works
- saved states are accurate
- empty states are accurate
- errors are visible
- mobile interaction works
- keyboard access is available
- no fabricated user or country data appears
- Cloudflare build compatibility is preserved