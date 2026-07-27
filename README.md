# Kolmari

A responsive relocation-planning app backed by Neon Postgres. It includes onboarding, a five-step visa wizard, country discovery, a move checklist, and a monthly cost calculator.

## Setup

1. Create a Neon database and run [`db/schema.sql`](db/schema.sql) in its SQL editor.
2. Copy `.env.example` to `.env.local` and set a real `DATABASE_URL` and a random `JWT_SECRET` of at least 32 characters.
3. Install and start the app:

```bash
npm install
npm run dev
Open http://localhost:3000.

For an existing Kolmari database, apply new migrations with npm run db:migrate.

Checks
bash
npm run lint
npm run build
Visa recommendations are illustrative and are not legal advice. Confirm current eligibility rules with the relevant government authority.

Country flags use free Unicode emoji, so no flag API key is required.

Code

---

## **FILE 5: `public/brand/README.md`**

```markdown
# Kolmari brand assets

These runtime assets are derived only from the owner-approved PNG artwork supplied for the app. No logo geometry was redrawn or AI-generated.

- `kolmari-wordmark-light.png`: navy and gold wordmark for light surfaces.
- `kolmari-wordmark-dark.png`: white and gold wordmark for dark surfaces.
- `kolmari-wordmark-split.png`: retained alternate treatment; not used by default.
- `kolmari-primary-dark.png`: detailed primary butterfly-globe on navy.
- `kolmari-icon-dimensional-source.png`: approved dimensional icon source.
- `kolmari-icon-flat.png`: retained flat icon alternative.
- `app-icon-*.png`: opaque, full-bleed installable icon exports.
- `favicon-*.png` and `favicon.ico`: transparent butterfly favicon exports.

The composite brand board and favicon source sheet are references only and are intentionally excluded from runtime assets.
