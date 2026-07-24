# Codex and AI Contributor Rules

Read the relevant Nexit documentation before changing code. These rules are mandatory for Codex, Claude, ChatGPT, and human contributors using AI-generated code.

## Before writing code

1. Read `00-README.md`.
2. Identify the Seven Layer Dip layer affected by the request.
3. Read the controlling focused document.
4. Inspect existing components, routes, tokens, and schemas.
5. State assumptions in implementation notes; do not silently invent requirements.

## Never

- invent a new design language;
- add unapproved colors, fonts, gradients, or logo variants;
- restore horizontal country tabs;
- remove or replace the persistent country hero;
- fabricate user profile values, match scores, readiness, budget, household, progress, or Pathway status;
- say the user qualifies for a visa or residence route;
- hide essential country sections because personalization ranks them lower;
- combine sourced facts, editorial interpretation, and community reports without labels;
- add a new UI, state, authentication, or accordion library when an existing system already serves the need;
- duplicate design tokens;
- copy Notion branding or proprietary components;
- change auth, data contracts, or business logic during a design-only task;
- leave fake sample data in production paths.

## Always

- preserve Nexit identity and approved lexicon;
- use the page-template registry;
- reuse shared components;
- keep primary meaning and actions visible;
- use progressive disclosure only for secondary detail;
- show source, reporting period, and last verified date for time-sensitive facts;
- create honest empty states;
- support keyboard, screen reader, reduced-motion, and mobile use;
- keep adaptive navigation deterministic and stable;
- run typecheck, lint, tests, and production build;
- update documentation when an approved design or product rule changes.

## Design-only task boundary

A design-only request may change:

- layout and composition;
- existing component presentation;
- spacing and responsive behavior;
- hierarchy and progressive disclosure;
- visual states grounded in existing data.

It may not change, unless explicitly requested:

- database schema;
- authentication behavior;
- scoring methodology;
- API contracts;
- route semantics;
- source data;
- legal conclusions.

## Required implementation summary

At completion, report:

- files changed;
- reused components;
- new components and why they were necessary;
- data or behavior deliberately preserved;
- tests/build results;
- unresolved issues or placeholder content;
- documentation updated.

## Core implementation command

> Build the smallest coherent system that satisfies the approved documentation. Preserve higher Seven Layer Dip layers, use real data only, and never solve inconsistency by introducing a second competing pattern.
