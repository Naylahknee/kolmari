<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Nexit Project Instructions

Nexit is a relocation decision and planning system. It is not a vacation, travel-booking, or generic travel application.

## Required documentation

Before changing application code, read:

1. `/DESIGN.md`
2. `/docs/nexit/00-README.md`
3. The documentation files relevant to the assigned task
4. `/docs/nexit/09-IMPLEMENTATION-RULES.md`
5. `/docs/nexit/10-LLM-RULES.md`

Do not rely only on chat history or an older implementation prompt.
For Nexitnation Map work, also read `/docs/nexit/11-NEXITNATION-MAP.md`.

## Source-of-truth order

When instructions conflict, follow this order:

1. The owner's current explicit instruction
2. `/DESIGN.md`
3. Files inside `/docs/nexit/`
4. Existing production behavior, code, and types
5. Older prompts, mockups, archived documents, and reference material

## Approved product language

Use these terms consistently:

- Nexit
- Nexitnation
- Nextination
- Nexit Profile
- Nexit Plan
- Nexit Pathways
- Match Score
- Nexit Readiness
- Nexit Timeline
- Greenbook Insights
- Community Fit
- Nexicution Mode
- Nexit Tracker

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
- approved Nexit assets and design tokens

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
- Nexit Readiness
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
8. Update `/docs/nexit/CURRENT-STATE.md`.
9. Report changed files, test results, unresolved issues, and assumptions.

Do not perform a full-product rewrite unless the owner explicitly requests one.