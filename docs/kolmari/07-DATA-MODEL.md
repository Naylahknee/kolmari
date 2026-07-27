# Kolmari Data Model

## Database tables (unchanged from Nexit — do not rename)

| Table | Key fields | Notes |
|---|---|---|
| `users` | `id`, `email`, `password_hash` | Do not rename |
| `profiles` | `user_id`, `wizard_status`, 28+ fields | Do not rename fields |
| `nexit_plans` | `user_id`, `timeline_stage`, `checklist`, `budget`, `documents` | Do not rename table |

## Persistent keys (must not be casually renamed)

| Key | Location | Safe to rename? |
|---|---|---|
| `nexit_session` | Cookie (auth) | No — invalidates all sessions |
| `nexit:sidebar-collapsed` | localStorage | Rename with compatibility read of old key |
| `nexit-saves` | localStorage (saved countries) | Rename to `kolmari-saves` with migration shim |
| `TOKEN_ISSUER = 'nexit'` | JWT | No — invalidates tokens |

## Compatibility shim pattern

When renaming a localStorage key:
```ts
const value =
  localStorage.getItem('kolmari-saves') ??
  localStorage.getItem('nexit-saves')
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
