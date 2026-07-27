# Kolmari Replacement Matrix

## Terminology replacement

| Legacy term | Kolmari term | Location type | Migrate now? |
|---|---|---|---|
| Nexit (brand) | Kolmari | Public UI copy | Yes — page by page |
| Nexitnation | Your World | Public UI copy | Yes — page by page |
| Nextination | Destination | Public UI copy | Yes — page by page |
| Nexit Plan | My Plan | Public UI copy | Yes — page by page |
| Nexit Profile | Kolmari Profile | Public UI copy | Yes — page by page |
| Nexit Pathways | Pathways | Public UI copy | Yes — page by page |
| Nexit Tracker | Progress Tracker | Public UI copy | Yes — page by page |
| Nexit Readiness | Move Readiness | Public UI copy | Yes — page by page |
| Nexit Timeline | Move Timeline | Public UI copy | Yes — page by page |
| Nexicution Mode | Flutter Mode | Public UI copy | Yes — page by page |
| Nexiters Community | Kolmari Klub | Public UI copy | Yes — page by page |
| Start Your Nexit | Build My Move Plan | CTA | Yes — page by page |
| Enter Nexicution Mode | Enter Flutter Mode | CTA | Yes — page by page |
| Choose Your Nexitnation | Your World | Page heading | Yes — page by page |
| nexit_session | kolmari_session | Cookie | No — auth migration |
| nexit:sidebar-collapsed | kolmari:sidebar-collapsed | localStorage | Shim on foundation |
| nexit-saves | kolmari-saves | localStorage | Shim on page migration |
| nexit_plans | kolmari_plans | DB table | No — DB migration |
| TOKEN_ISSUER 'nexit' | 'kolmari' | Auth constant | No — auth migration |
| /nexitnation | /world | Route URL | No — route migration |
| /nexit-plan | /plan | Route URL | No — route migration |
| /checklist | /flutter | Route URL | No — route migration |
| /community | /klub | Route URL | No — route migration |

## Component filename migration (future refactor phase)

| Current | Target |
|---|---|
| `src/components/nexit/app-shell.tsx` | `src/components/kolmari/app-shell.tsx` |
| `src/components/nexit/nexit-plan-workspace.tsx` | `src/components/kolmari/plan-workspace.tsx` |
| `src/components/nexit/nexit-world.tsx` | `src/components/kolmari/world-workspace.tsx` |
| `src/lib/lexicon.ts` (NEXIT_LEXICON) | Keep + add KOLMARI_LEXICON (done in foundation) |
