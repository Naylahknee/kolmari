# Kolmari LLM Rules

## Before writing code

1. Read `00-README.md` and `09-IMPLEMENTATION-RULES.md`.
2. Inspect existing components and routes.
3. Read the controlling focused document for the task.
4. State assumptions explicitly — do not silently invent requirements.

## Never

- Invent a new design language
- Add unapproved colors, fonts, or gradients
- Fabricate Match Scores, readiness, budget, household, progress, or Pathway status
- Say the user qualifies for a visa or residence route
- Leave fake sample data in production paths
- Rename database fields casually
- Rename cookie/localStorage keys without a compatibility shim
- Duplicate design tokens
- Change auth, data contracts, or business logic during a design-only task
- Turn an entire page into a client component when only one section needs client behavior

## Always

- Preserve Kolmari identity and approved lexicon
- Reuse shared components
- Keep primary meaning and actions visible
- Show source, reporting period, and last verified date for time-sensitive facts
- Create honest empty states
- Support keyboard, screen reader, reduced-motion, and mobile use
- Run typecheck, lint, and production build
- Update documentation when an approved design rule changes

## Naming conventions

- HTML `class` → React `className`
- HTML `for` → React `htmlFor`
- `<a>` for internal routes → Next.js `<Link>`
- Inline `onclick` → React `onClick`
- Only interactive components use `'use client'`
