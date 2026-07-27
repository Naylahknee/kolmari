# Kolmari Route Migration Plan

## Current routes → future canonical Kolmari routes

| Current route | Kolmari canonical | Status |
|---|---|---|
| `/nexitnation` | `/world` | Future phase |
| `/nexitnation/[region]` | `/world/[region]` | Future phase |
| `/nextinations/[slug]/[section]` | `/destinations/[slug]/[section]` | Future phase |
| `/nexit-plan` | `/plan` | Future phase |
| `/checklist` | `/flutter` | Future phase |
| `/community` | `/klub` | Future phase |
| `/saved` | `/destinations` | Future phase |
| `/countries` | Redirects to `/nexitnation?view=countries` | Active |
| `/visa-wizard` | Redirects to `/profile-wizard` | Active |
| `/onboarding` | Redirects to `/welcome` | Active |

## Redirects to add (route migration phase)

```ts
// Future redirects (do not add until page migration is verified)
'/nexitnation' → '/world'
'/nexitnation/[region]' → '/world/[region]'
'/nexit-plan' → '/plan'
'/checklist' → '/flutter'
'/community' → '/klub'
```

## Rules

- Do not remove old routes before redirects are active and tested
- Old routes must return 301 (permanent) or 308 (permanent, method-preserving) redirects
- Test all deep-links before removing old routes
- Flutter Mode gets its own route `/flutter` (new, not a redirect)
