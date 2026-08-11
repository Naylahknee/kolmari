<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Kolmari Project Instructions

Kolmari is a relocation decision and planning system. It is not a vacation, travel-booking, or generic travel application.

## Required documentation

Before changing application code, read:

1. `/DESIGN.md`
2. `/docs/kolmari/00-README.md`
3. The documentation files relevant to the assigned task
4. `/docs/kolmari/09-IMPLEMENTATION-RULES.md`
5. `/docs/kolmari/10-LLM-RULES.md`

Do not rely only on chat history or an older implementation prompt.
For Kolmari world map work, also read `/docs/kolmari/11-KOLMARI-MAP.md`.

For interaction, navigation, transition, or motion work, also read `/docs/kolmari/12-INTERACTION-DESIGN.md`.

For account, privacy, deletion, role, permission, or administrative work, also read `/docs/kolmari/13-ACCOUNT-ADMINISTRATION.md`.


## Source-of-truth order

When instructions conflict, follow this order:

1. The owner's current explicit instruction
2. `/DESIGN.md`
3. Files inside `/docs/kolmari/`
4. Existing production behavior, code, and types
5. Older prompts, mockups, archived documents, and reference material

## Approved product language

Use these terms consistently:

- Kolmari
- Kolmarination
- Destination
- Kolmari Profile
- Kolmari Plan
- Kolmari Pathways
- Match Score
- Kolmari Readiness
- Kolmari Timeline
- Greenbook Insights
- Community Fit
- Flutter Mode
- Kolmari Tracker

Do not replace these terms with generic travel-product language.

## Technical constraints

Preserve:

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Neon Postgres
- Drizzle ORM
- existing authentication
- existing database queries
- existing API contracts
- existing route protection
- Cloudflare Workers compatibility
- approved Kolmari assets and design tokens

Before using a Next.js API or convention, consult:

`node_modules/next/dist/docs/`

Do not introduce a new framework, styling system, authentication system, or duplicate token system without explicit approval.

## Data integrity

Never fabricate:

- user profile information
- saved countries
- household composition
- budgets
- Match Scores
- Kolmari Readiness
- Pathway eligibility
- visa eligibility
- legal conclusions
- country statistics
- source dates
- task completion
- plan progress

When real information does not exist, display a clear empty, incomplete, or unavailable state.

## Implementation method

Before changing code:

1. Inspect the existing implementation.
2. Read the documentation relevant to the task.
3. Identify the smallest safe scope.
4. Preserve unrelated working behavior.
5. Reuse existing components when appropriate.
6. Implement only the assigned phase.
7. Run the available validation commands.
8. Update `/docs/kolmari/CURRENT-STATE.md`.
9. Report changed files, test results, unresolved issues, and assumptions.

Do not perform a full-product rewrite unless the owner explicitly requests one.
## SLD task scope (binding)

SLD does not ask whether a change is good. It asks whether there was permission
to make it. If permission cannot be proven: BLOCK.

**Unspecified change = BLOCK.** A change is not authorized because it is an
improvement, cleanup, refactor, simplification, consistency fix, accessibility or
responsive or performance improvement, better UX, modernization, a bug noticed in
passing, or a "related" improvement. Those need explicit authorization unless
they are technically necessary to complete the requested change. Low risk is not
permission — a harmless change nobody asked for is still blocked.

**Preservation is the default.** Anything outside the task contract — wording,
layout, routes, components, colours, spacing, typography, animation, behaviour,
APIs, schemas, calculations, navigation, responsive and accessibility behaviour,
and even unrelated existing bugs — must be left exactly as it is.

Before editing any file:

1. Read the active TaskContract (`.sld/task-contract.json`, `npm run sld:contract`).
2. Identify the authorized entity.
3. Identify the authorized state.
4. Identify the authorized action.
5. Confirm the file is permitted.
6. Confirm the exact modification is permitted.
7. Make the minimum necessary change.

After editing:

8. Run `npm run sld:verify` (post-change verification).
9. Inspect the complete git diff.
10. Map every changed hunk to the TaskContract.
11. Revert every unauthorized hunk.
12. Only then report completion.

Permission to MODIFY does not imply DELETE. RESTYLE does not imply REFACTOR. FIX
does not imply REBUILD. ADD does not imply REPLACE. A file being in scope does
not put every property of that file in scope.

Never expand your own scope. If you notice a worthwhile adjacent change, do not
implement it — record it as an out-of-scope observation and report it.

`src/sld/**`, `.sld/**`, and the SLD documentation may only be modified under a
contract granting `SLD_ENGINE_MAINTENANCE`.

Report at task end: requested, authorized entities, files changed, required
propagation, preserved, out-of-scope observations, post-change verification
PASS/FAIL, unauthorized changes count, final SLD decision. If unauthorized
changes > 0, the task has not passed.
