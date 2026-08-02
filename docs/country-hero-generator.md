# Dynamic country hero generator

Kolmari now includes an authenticated internal generator at:

`/settings/country-hero`

The tool converts structured destination details into the approved flag-and-map design prompt, sends it to OpenAI's image generation API, previews the result, and lets an administrator download the generated WebP asset.

## Required environment variables

Set these as encrypted deployment secrets. Do not commit their values.

```bash
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put KOLMARI_ADMIN_EMAILS
```

`KOLMARI_ADMIN_EMAILS` accepts a comma-separated allowlist of authenticated Kolmari account emails.

Example value:

```text
owner@example.com,designer@example.com
```

In local development, add the same variables to `.dev.vars`:

```text
OPENAI_API_KEY=...
KOLMARI_ADMIN_EMAILS=owner@example.com
```

The API key remains server-side. The browser calls `/api/admin/country-hero`; it never receives the key.

## Current workflow

1. Sign in with an email listed in `KOLMARI_ADMIN_EMAILS`.
2. Visit `/settings/country-hero`.
3. Enter the city, country, flag-symbol safety details, and geographic pin guidance.
4. Generate the image.
5. Review the result and generated prompt.
6. Download the WebP and add it to the relevant country asset record.

## Production storage follow-up

The current implementation returns the generated image to the authenticated administrator for review and download. This approval step prevents an imperfect or geographically inaccurate AI-generated image from publishing automatically.

A later storage phase can add an R2 binding and save approved assets under a stable key such as:

```text
country-heroes/{country-slug}/{city-slug}-flag-map.webp
```

Do not generate a new image on every visitor request. Generate once in the admin tool, approve it, store it, and serve the stored asset from the country page.

## Cost and safety controls

- The endpoint requires an authenticated user.
- Production access is restricted to `KOLMARI_ADMIN_EMAILS`.
- Quality is selected explicitly before each request.
- The generated prompt is returned for review and reproducibility.
- The endpoint generates one image per request.
