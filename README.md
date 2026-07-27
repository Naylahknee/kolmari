# Kolmari

A responsive relocation-planning app backed by Neon Postgres. It includes onboarding, a five-step visa wizard, country discovery, a move checklist, and a monthly cost calculator.

## Setup

1. Create a Neon database and run [`db/schema.sql`](db/schema.sql) in its SQL editor.
2. Copy `.env.example` to `.env.local` and set a real `DATABASE_URL` and a random `JWT_SECRET` of at least 32 characters.
3. Install and start the app:

```bash
npm install
npm run dev
