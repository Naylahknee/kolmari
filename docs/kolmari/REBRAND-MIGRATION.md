# Kolmari Rebrand Migration Strategy

## Scope

This document describes the controlled migration from Nexit presentation layer and terminology to Kolmari design and product language.

This is NOT a rebuild. The existing application remains the functional source of truth.

## Classification system

Before renaming any occurrence of legacy terminology, classify it as one of:

| Category | Safe to rename on page conversion? |
|---|---|
| Public UI copy | Yes — migrate on each page conversion |
| Route URL | No — use redirects in a separate phase |
| Component filename | No — internal; rename in refactor phase |
| TypeScript type or interface | No — rename in type migration phase |
| Variable / constant name | No — internal; leave until refactor |
| API route | No — must not break contracts |
| Database field | No — requires formal DB migration |
| Cookie name | No — requires compatibility layer |
| localStorage key | Partial — read old, write new with shim |
| Metadata / SEO | Yes — migrate with each page |
| Test fixture | No — update alongside code |
| Documentation | Yes — update as docs are migrated |

## Migration sequence

### Foundation (no page changes)
- Brand config files
- Kolmari lexicon
- App shell labels
- Root metadata

### Page-by-page (visual + copy only)
- One page per branch section
- Connect real data
- Add honest empty states

### Route migration (separate phase)
- Add redirects before removing old routes
- Test all redirects
- Remove old routes only after verification

### Database migration (separate phase)
- Rename `nexit_plans` → `kolmari_plans`
- Update all query references
- Test thoroughly

### Auth migration (separate phase)
- Update cookie name `nexit_session` → `kolmari_session`
- Update JWT issuer and audience
- Invalidation plan for existing sessions
