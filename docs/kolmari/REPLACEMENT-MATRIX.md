# Kolmari Replacement Matrix

This matrix reflects the current approved terminology from `DESIGN.md` (source of truth, supersedes earlier docs).

## Public-facing copy replacements (completed)

| Legacy copy | Approved Kolmari copy | Status |
| --- | --- | --- |
| Nexit World | Kolmarination | ✅ Done |
| Your World | Kolmarination | ✅ Done |
| Nexitnation (public) | Kolmarination | ✅ Done |
| Destination (map CTA) | Kolmarination | ✅ Done |
| My Plan (public heading) | Kolmari Plan | ✅ Done |
| Move Plan | Kolmari Plan | ✅ Done |
| Nexit Plan | Kolmari Plan | ✅ Done |
| Move Readiness | Kolmari Readiness | ✅ Done |
| Nexit Readiness | Kolmari Readiness | ✅ Done |
| Move Timeline | Kolmari Timeline | ✅ Done |
| Nexit Timeline | Kolmari Timeline | ✅ Done |
| Progress Tracker | Kolmari Tracker | ✅ Done |
| Nexit Tracker | Kolmari Tracker | ✅ Done |
| Nexicution Mode / Nexecution | Flutter Mode | ✅ Done |
| Build My Move Plan | Build Your Kolmari Plan | ✅ Done |
| Open My Plan | Open Kolmari Plan | ✅ Done |
| Continue your Move Plan | Continue your Kolmari Plan | ✅ Done |
| Save My Plan | Save Kolmari Plan | ✅ Done |
| Nexit Profile | Kolmari Profile | ✅ Done (lexicon) |
| Profile (nav) | Kolmari Profile | ✅ Done (lexicon) |
| Nextinations → Destinations (copy) | Destinations | ✅ Done |
| Community | Kolmari Klub | ✅ Done (nav + pages) |
| Nexit (brand in copy) | Kolmari | ✅ Done |
| Nexitnation regions (aria) | Kolmarination regions | ✅ Done |
| Nexit editorial planning prompt | Kolmari editorial planning prompt | ✅ Done |
| Nexit provides research information | Kolmari provides research information | ✅ Done |
| New to Nexit / Already planning with Nexit | New to Kolmari / Already planning with Kolmari | ✅ Done |

## Internal identifiers — intentionally preserved (compatibility)

These must NOT be renamed without a dedicated migration phase.

| Term | Location | Category | Migration note |
| --- | --- | --- | --- |
| `nexit_plans` | DB table `nexit_plans` | Database field | Requires DB migration assignment |
| `nexit_session` | Auth cookie | Persistent auth cookie | Requires full auth migration |
| `TOKEN_ISSUER = 'nexit'` | `auth-constants.ts` | JWT claim | Requires auth migration |
| `NexitPlan` | `kolmari-plan.ts` | TypeScript type | Internal — safe to rename later |
| `NexitReadiness` | `readiness.ts` | TypeScript type | Internal — safe to rename later |
| `NexitRegion` | `regionData.ts` | TypeScript type | Internal — safe to rename later |
| `NexitnationUserProfile` | `userProfile.ts` | TypeScript type | Internal — safe to rename later |
| `calculateNexitReadiness` | `readiness.ts` | Function | Internal — safe to rename later |
| `getNexitPlan` / `saveNexitPlan` | `kolmari-plan.ts` | Functions | Internal — safe to rename later |
| `emptyNexitPlan` | `kolmari-plan.ts` | Function | Internal — safe to rename later |
| `isNexitnationRegion` | `destinations-data.ts` | Function | Internal — safe to rename later |
| `RankedNextination` | `userProfile.ts` | TypeScript type | Internal — safe to rename later |
| `rankNextinations` | `userProfile.ts` | Function | Internal — safe to rename later |
| `NextinationStatus` | `nextination-board.ts` | TypeScript type | Internal — safe to rename later |
| `SavedNextination` | `nextination-board.ts` | TypeScript type | Internal — safe to rename later |
| `useNextinationBoard` | `nextination-board.ts` | React hook | Internal — safe to rename later |
| `SaveNextinationButton` | `saved-nextinations.tsx` | Component name | Internal — safe to rename later |
| `NexitPlanWorkspace` | `nexit-plan-workspace.tsx` | Component name | Internal — safe to rename later |
| `NexitWorldWorkspace` | `nexit-world.tsx` | Component name | Internal — safe to rename later |
| `NEXIT_LEXICON` | `lexicon.ts` | Exported alias | Compatibility alias for `KOLMARI_LEXICON` |
| `NEXIT_STORY` | `lexicon.ts` | Exported alias | Compatibility alias for `KOLMARI_STORY` |

## Routes — preserved until redirect phase

| Legacy route | Future canonical | Status |
| --- | --- | --- |
| `/nexitnation` | `/kolmarination` (proposed) | Preserved — do not remove yet |
| `/nexitnation/[region]` | `/kolmarination/[region]` (proposed) | Preserved — do not remove yet |
| `/nexit-plan` | `/kolmari-plan` (proposed) | Preserved — do not remove yet |
| `/nextinations` | `/destinations` (proposed) | Preserved — do not remove yet |
| `/nextinations/[slug]` | `/destinations/[slug]` (proposed) | Preserved — do not remove yet |
| `/checklist` | `/flutter` | Preserved — redirect active |
| `/community` | `/klub` (proposed) | Preserved — do not remove yet |

## Account deletion phrase

`DELETE MY NEXIT ACCOUNT` is used as a typed confirmation phrase in the account deletion API (`src/app/api/account/deletion-request/route.ts`).

This phrase is shown to logged-in users about to delete their account. Changing it requires updating the API and coordinating with any users mid-flow. This is an owner decision — do not rename without explicit approval.

## Approved Kolmari lexicon (current, from DESIGN.md)

| Concept | Approved term |
| --- | --- |
| Product | Kolmari |
| Community | Kolmari Klub |
| Map / exploration interface | Kolmarination |
| Execution workspace | Flutter Mode |
| User relocation plan | Kolmari Plan |
| Relocation progress | Kolmari Readiness |
| Schedule and deadlines | Kolmari Timeline |
| Progress system | Kolmari Tracker |
| User profile | Kolmari Profile |
| Visa and relocation options | Pathways |
| Country recommendation result | Match Score |
| Community suitability | Community Fit |
| Map data layer | Greenbook Layer |
| Community content | Greenbook Insights |
| Saved / considered countries | Destinations |
| One country | Destination |
| Primary CTA | Build Your Kolmari Plan |
| Map CTA | Choose Your Kolmarination |
| Profile CTA | Start Your Kolmari |
