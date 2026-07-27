# Kolmari Rebrand Migration

## Objective

Migrate the existing relocation application from Nexit to Kolmari without rebuilding or breaking working authentication, database access, API routes, route protection, scoring, saved-country behavior, Mapbox, Greenbook, or Cloudflare compatibility.

## Milestone 1 scope

- Centralize Kolmari brand and product copy.
- Introduce a canonical Kolmari app-shell boundary while preserving the existing shell implementation.
- Update the protected workspace shell and sidebar to approved Kolmari labels.
- Keep existing routes and persistent data structures unchanged.
- Inventory remaining legacy references before deeper renames.

## Approved public terminology

| Purpose | Term |
| --- | --- |
| Product | Kolmari |
| Community | Kolmari Klub |
| Execution workspace | Flutter Mode |
| Country exploration | Your World |
| Saved countries | Destinations |
| Visa and residence options | Pathways |
| Relocation plan | My Plan |
| Preparation level | Move Readiness |
| Timeline | Move Timeline |
| Progress system | Progress Tracker |

## Guardrails

1. Public copy may change before internal identifiers.
2. Legacy routes remain active until redirects are implemented in a later milestone.
3. Database fields, stored keys, API contracts, and authentication behavior are not renamed in Milestone 1.
4. Compatibility exports may remain temporarily.
5. HTML mockups are design references and must be converted into accessible React components rather than served directly.

## Current compatibility decisions

- `/nexitnation`, `/nexit-plan`, `/checklist`, `/community`, `/saved`, and existing country URLs remain unchanged during Milestone 1.
- `NEXIT_LEXICON` and `NEXIT_STORY` remain temporary aliases to the new Kolmari lexicon.
- The existing `WorkspaceShell` remains the shell implementation behind `KolmariAppShell` until later domain-by-domain refactoring.
