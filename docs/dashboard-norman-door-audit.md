# Dashboard Norman-Door Audit

**Status:** Current Dashboard affordance review  
**Applies to:** `/dashboard`

## Audit rule

A Norman door is any Dashboard surface whose appearance suggests the wrong action, implies clickability where none exists, or hides the result of an interaction.

Dashboard controls should make three things obvious before interaction:

1. **What is interactive.**
2. **What will happen.**
3. **What is only information.**

## Findings and implementation status

| Surface | Finding | Status |
| --- | --- | --- |
| Dashboard header | `Enter Flutter Mode` acted as the dominant top-right CTA even though the Dashboard is the planning home and Flutter is a later execution mode. | **FIXED** — replaced with plan/upgrade section after profile completion. |
| Dashboard first-visit tour | The tour still targeted the former docked progress tracker after Journey moved to the header dropdown. | **FIXED** — walkthrough now starts from the current Recommended next action, then Destinations. |
| Destination match image cards | Image-backed cards previously looked and behaved like navigation despite the product rule that they are informational match panels. | **FIXED** — cards are static information surfaces with no link, pointer action, or hover-navigation treatment. |
| Visa Options rows | Full rows linked to the generic Pathways page, making each route look like a distinct route-specific action even though every row went to the same destination. | **FIXED** — rows are informational; one explicit `Open Pathways` link owns navigation. |
| Active pathway country action | A button labeled only with the country name did not state that it opens the country guide. | **FIXED** — explicit `Open {country} guide` label. |
| Active pathway route action | `View pathway` was weaker than the actual action. | **FIXED** — explicit `Review active pathway` / `Find a pathway` labels. |
| Recommended next action | The action link currently sits inside the same native `<summary>` used to toggle `Why this matters`. This combines navigation and disclosure inside one apparent control region. | **OPEN** — separate the navigation CTA and disclosure trigger in a bounded follow-up edit to `dashboard/panels.tsx`. |
| Optional Shortlist cards | The whole card gains hover border/shadow while only the footer control is actionable, which can imply whole-card clickability. | **OPEN / LOW** — remove whole-card hover affordance or make only the actual button visually reactive. |
| Legacy `OrientationHeader` | Contains an `Enter Flutter Mode` CTA but is not used by the current Dashboard page. | **OPEN / TECHNICAL DEBT** — remove or update if this legacy component is retained. |
| Legacy `JourneyPanel` next milestone | A chevron appears beside non-interactive milestone text, visually implying navigation. The current Dashboard uses `JourneyTracker`, not this panel. | **OPEN / TECHNICAL DEBT** — remove chevron if the legacy panel remains available. |

## Upgrade section contract

After the profile is complete, the old Dashboard-header Flutter CTA is replaced by a plan-aware section:

- **Explorer:** `Unlock your full move plan` → `View upgrade options`
- **Plus:** `Need multi-destination planning?` → `Compare with Navigator`
- **Navigator:** active-plan status → `Manage plan`

All actions route to:

`/settings?tab=billing`

The section describes the result before the user clicks. It does not imply that checkout is already live.

For an incomplete profile, the existing `Build My Kolmari Plan` action remains because its destination and result are explicit.

## Preservation rule

Do not make informational Dashboard cards clickable merely to make the interface feel more interactive. A visible navigation treatment must correspond to a specific destination or state-changing action.