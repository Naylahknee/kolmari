# Deploying Kolmari to Cloudflare

The app runs on a Cloudflare Worker named **`kolmari`** (set in `wrangler.jsonc`).
Your live site — `kolmari.<account>.workers.dev` (and any custom domain routed to
it) — is served by that worker.

> Note: an older worker named **`kolmari`** also exists from before the rebrand.
> Deploys used to point at `kolmari` by mistake, so fixes never reached the live
> `kolmari` worker. That is fixed. The old `kolmari` worker can be deleted once the
> `kolmari` worker is confirmed working (see "Clean up" below).

## Automatic deploys (recommended — no terminal needed)

`.github/workflows/deploy.yml` builds and deploys automatically whenever `main`
updates. One-time setup:

1. **Create a Cloudflare API token**
   - Cloudflare dashboard → My Profile → API Tokens → Create Token
   - Use the **"Edit Cloudflare Workers"** template → Continue → Create Token
   - Copy the token (shown once).
2. **Find your Account ID**
   - Cloudflare dashboard → Workers & Pages → the right sidebar shows **Account ID**.
3. **Add both as GitHub secrets**
   - GitHub repo → Settings → Secrets and variables → Actions → New repository secret
   - `CLOUDFLARE_API_TOKEN` = the token from step 1
   - `CLOUDFLARE_ACCOUNT_ID` = the ID from step 2
4. **Trigger a deploy** — merge to `main`, or run the workflow manually:
   GitHub repo → Actions → "Deploy to Cloudflare" → Run workflow.

Watch it under the **Actions** tab; green check = deployed.

## Manual deploy (alternative)

From a machine with the repo and Node 22:

```bash
npm ci
npx wrangler login          # once, opens a browser
npm run deploy              # builds + deploys to the "kolmari" worker
```

## Runtime secrets (set once, on the Worker)

These live on the Worker, not in the repo, and persist across deploys:
Cloudflare dashboard → Workers & Pages → **kolmari** → Settings → Variables.

- `JWT_SECRET` — session signing secret (required for sign-in)
- `DATABASE_URL` — Neon Postgres connection string
- `NEXT_PUBLIC_MAPBOX_TOKEN` — optional, enables real map tiles

## Clean up the old worker

Once `kolmari` is confirmed working:
Cloudflare dashboard → Workers & Pages → **kolmari** → Settings → Delete
(or `npx wrangler delete --name kolmari`). This removes any confusion between the
two workers.
