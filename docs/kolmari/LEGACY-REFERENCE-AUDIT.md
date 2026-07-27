# Legacy Brand Reference Audit

## Status

Milestone 1 intentionally changes only the shared public shell and central terminology. A repository-wide cleanup is deferred until each occurrence is classified and its compatibility requirements are known.

## Confirmed categories

### Repository instructions and design documentation

Legacy Nexit terminology remains throughout:

- `AGENTS.md`
- `DESIGN.md`
- `docs/nexit/01-DESIGN.md`
- `docs/nexit/02-DESIGN-TOKENS.md`
- `docs/nexit/03-COMPONENTS.md`
- `docs/nexit/04-LAYOUTS.md`
- `docs/nexit/05-PAGE-TEMPLATES.md`
- `docs/nexit/06-ADAPTIVE-WORKSPACE.md`
- `docs/nexit/07-DATA-MODEL.md`
- `docs/nexit/08-CONTENT-STANDARDS.md`
- `docs/nexit/09-IMPLEMENTATION-RULES.md`
- `docs/nexit/10-LLM-RULES.md`
- map, interaction, administration, migration, and current-state documents under `docs/nexit/`

These files currently contain conflicting source-of-truth rules and must be migrated in a dedicated documentation phase. Historical references should remain only where they explain the former product name.

### Routes and route directories

Legacy route names remain intentionally for compatibility, including:

- `/nexitnation`
- `/nexit-plan`
- `/nextinations/[slug]`
- `/checklist`
- `/community`
- `/saved`

Do not delete these routes before redirect coverage and authentication continuation-path testing exist.

### Components, files, and directories

Legacy technical names remain in paths and exports such as:

- `src/components/nexit/`
- `src/components/nexit/workspace-shell.tsx`
- Nexit/Nextination map, plan, profile, saved-country, and marketing components
- `src/lib/nexit-plan.ts`
- `src/lib/nexitnation-data.ts`
- compatibility exports in `src/lib/lexicon.ts`

These are implementation identifiers, not all user-facing defects. Rename them domain by domain after imports and tests are mapped.

### Public copy outside the shared shell

Page content, marketing copy, auth copy, onboarding, plan content, country content, metadata, emails, labels, empty states, and accessibility text may still contain:

- Nexit
- Nexitnation
- Nextination
- Nexit Plan
- Nexit Readiness
- Nexicution / Nexecution
- Nexiter / Nexiters

These require page-level review rather than blind replacement.

### Assets and metadata

Legacy brand names may remain in:

- `public/brand/` filenames
- image imports
- favicons and app-icon source names
- Open Graph images
- manifests
- site metadata
- robots and canonical-domain configuration

Asset paths should remain stable until approved Kolmari replacements exist and every import is updated.

### Persistent and compatibility-sensitive identifiers

Search and migration review must cover:

- database table and column names
- JSON payload keys
- cookies and session claims
- local-storage keys
- cache keys
- analytics events
- object-storage paths
- email template identifiers
- environment variable names

No persistent identifier was renamed during Milestone 1.

## Approved remaining references during Milestone 1

The following are expected and temporary:

- legacy route paths
- compatibility exports `NEXIT_LEXICON` and `NEXIT_STORY`
- existing implementation paths under `src/components/nexit/`
- asset filenames required by current imports
- historical migration references

## Required next audit action

Run a local repository search with the commands in the migration plan, export every occurrence, and assign each result to one of these categories:

1. visible interface copy
2. route
3. API contract
4. component/file identifier
5. type/function/variable
6. database or stored value
7. cookie/local storage/cache
8. asset or metadata
9. test or fixture
10. documentation or historical reference
11. redirect or compatibility layer
12. unresolved defect
