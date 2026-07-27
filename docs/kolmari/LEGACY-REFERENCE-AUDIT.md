# Kolmari Legacy Reference Audit

## Audit date: 2026-07-27

## Classified legacy references

### Compatibility routes (intentional — do not remove)
- `/checklist` → redirects to `/nexit-plan#checklist` — retained for compatibility
- `/visa-wizard` → redirects to `/profile-wizard` — retained for compatibility
- `/onboarding` → redirects to `/welcome` — retained for compatibility
- `/countries` → redirects to `/nexitnation?view=countries` — retained for compatibility

### Persistent keys (intentional — must not be renamed without compat shim)
- `nexit_session` cookie — auth session, must not change
- `nexit:sidebar-collapsed` localStorage — sidebar state, shim in foundation
- `nexit-saves` localStorage — saved countries, shim on migration
- `TOKEN_ISSUER = 'nexit'` — JWT issuer, auth migration only

### Database fields (intentional — must not rename without DB migration)
- `nexit_plans` table name
- All `profiles` and `users` field names

### Component filenames (internal — not public facing)
- `src/components/nexit/` directory — internal name, migrate in future refactor
- `src/lib/nexit-plan.ts` — internal, functional reference

### Lexicon (intentional backward compat)
- `NEXIT_LEXICON` in `src/lib/lexicon.ts` — kept for unmigrated components
- `NEXIT_STORY` in `src/lib/lexicon.ts` — kept for unmigrated components

### Metadata (to be migrated in foundation phase)
- `src/app/layout.tsx` title: "Nexit | Build your Nexit Plan"
- `src/lib/site.ts` fallback URL: `https://nexit.madincrease.workers.dev`

### Public UI copy (being migrated page by page)
- All uses of "Nexit", "Nexitnation", "Nextination", "Nexicution" in page copy
- All uses of "Start Your Nexit", "Enter Nexicution Mode", "Nexit Plan" in CTAs

## Unresolved legacy references (to track during migration)

Run this search after each migration phase to verify no unexplained legacy copy remains on migrated pages:

```bash
rg -n --hidden \
  --glob '!node_modules' \
  --glob '!.next' \
  --glob '!dist' \
  --glob '!coverage' \
  'Nexit|NEXIT|Nextination|Nextinations|Nexitnation|Nexecution|Nexicution|Nextication|Nexiter|Nexiters'
```

Every result must be classified as one of the categories above.
