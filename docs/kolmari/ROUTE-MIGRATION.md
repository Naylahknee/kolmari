# Kolmari Route Migration

## Milestone 1 rule

Do not rename or remove existing routes. The application shell may display Kolmari terminology while existing bookmarks, authentication continuation paths, and internal links continue to resolve.

## Current routes retained temporarily

| Current route | Current Kolmari label | Future canonical route |
| --- | --- | --- |
| `/nexitnation` | Your World | `/world` |
| `/saved` and `/countries` | Destinations | `/destinations` |
| `/nexit-plan` | My Plan | `/plan` |
| `/checklist` | Flutter Mode | `/flutter` |
| `/community` | Kolmari Klub | `/klub` |
| `/nextinations/[slug]` | Destination page | `/destinations/[slug]` |

## Future redirect requirements

Before any current route is removed, add and test redirects for static and dynamic paths. Validate authentication `next` parameters, saved links, email links, browser refreshes, and external shared URLs.

## Data rule

Route migration does not authorize renaming database fields, cookies, local-storage keys, analytics events, or API contracts. Those require explicit compatibility plans.
