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
2. `/docs/Kolmari/00-README.md`
3. The documentation files relevant to the assigned task
4. `/docs/Kolmari/09-IMPLEMENTATION-RULES.md`
5. `/docs/Kolmari/10-LLM-RULES.md`

Do not rely only on chat history or an older implementation prompt.
For Kolmarination Map work, also read `/docs/Kolmari/11-KolmariNATION-MAP.md`.

For interaction, navigation, transition, or motion work, also read `/docs/Kolmari/12-INTERACTION-DESIGN.md`.

For account, privacy, deletion, role, permission, or administrative work, also read `/docs/Kolmari/13-ACCOUNT-ADMINISTRATION.md`.


## Source-of-truth order

When instructions conflict, follow this order:

1. The owner's current explicit instruction
2. `/DESIGN.md`
3. Files inside `/docs/Kolmari/`
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
8. Update `/docs/Kolmari/CURRENT-STATE.md`.
9. Report changed files, test results, unresolved issues, and assumptions.

Do not perform a full-product rewrite unless the owner explicitly requests one.