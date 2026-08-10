# Kolmari Data Model

## Database tables (unchanged from Kolmari — do not rename)

| Table | Key fields | Notes |
|---|---|---|
| `users` | `id`, `email`, `password_hash` | Do not rename |
| `profiles` | `user_id`, `wizard_status`, 28+ fields | Do not rename fields |
| `kolmari_plans` | `user_id`, `timeline_stage`, `checklist`, `budget`, `documents` | Do not rename table |

## Persistent keys (must not be casually renamed)

| Key | Location | Safe to rename? |
|---|---|---|
| `kolmari_session` | Cookie (auth) | No — invalidates all sessions |
| `kolmari:sidebar-collapsed` | localStorage | Rename with compatibility read of old key |
| `kolmari-saves` | localStorage (saved countries) | Rename to `kolmari-saves` with migration shim |
| `TOKEN_ISSUER = 'kolmari'` | JWT | No — invalidates tokens |

## Compatibility shim pattern

When renaming a localStorage key:
```ts
const value =
  localStorage.getItem('kolmari-saves') ??
  localStorage.getItem('kolmari-saves')
if (value && !localStorage.getItem('kolmari-saves')) {
  localStorage.setItem('kolmari-saves', value)
}
```

## Data integrity rules

Never fabricate:
- Match Scores
- Move Readiness scores
- Pathway eligibility
- Visa eligibility
- Country statistics
- Plan progress
- Task completion

When real data does not exist, display a clear empty state.

## Budget compatibility

`kolmari_plans.budget` remains JSONB and uses the existing line-item array. Each line may include:

- `systemBaseline` and `systemBaselineKey` for an explicitly identified planning reference;
- `userOverride` and `isCustom` for the user's aggregate category value;
- `detailOverrides` for optional sub-category values saved from the benchmark dialog.

The aggregate `userOverride` remains the compatibility value used by existing dashboard and readiness calculations. Baselines must be cleared when their destination/household key no longer matches the active plan.
