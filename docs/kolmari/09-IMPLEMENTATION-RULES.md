# Kolmari Implementation Rules

## Technical stack (preserved)

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Neon Postgres
- Drizzle ORM (schema migrations only — not used for all queries)
- Cloudflare Workers (via OpenNext)
- JOSE JWT authentication

## Do not introduce

- A new framework
- A second authentication system
- A duplicate token system
- A new component library when existing components suffice
- Mock backend behavior
- Fake production data

## File structure

```
src/
  app/           ← Next.js App Router
  components/
    nexit/       ← existing components (migrate in place)
    community/   ← new Kolmari Klub components
    dashboard/   ← new dashboard sub-components
    destinations/ ← new destination sub-components
    flutter/     ← new Flutter Mode sub-components
  config/
    brand.ts
    product-copy.ts
    brand-assets.ts
  lib/           ← business logic (preserve all)
```

## Migration phases

1. Foundation (config, lexicon, shell labels, docs)
2. Pilot: Kolmari Klub
3. Core pages (dashboard, settings, cost calculator, destinations, documents, pathways, plan, flutter mode, greenbook, your world, profile wizard)
4. Marketing and launch

## Completion criteria per page

- Converted to TSX with named components
- Real data connected (no hardcoded values)
- Honest empty states
- No public "Nexit" copy on migrated page
- typecheck passes
- lint passes
- build passes
- Responsive at 320px, 375px, 768px, 1024px, 1280px, 1440px

## Route safety

Do not remove legacy routes until redirects are in place.
Do not rename database tables or cookie names without a separate migration task.
