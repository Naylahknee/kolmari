# Kolmari Design System and Brand Asset Standard

This document is the repository-level source of truth for Kolmari identity, language, visual design, interface patterns, and brand assets. Kolmari is a relocation decision system—not a travel app.

**Current stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Geist, Playfair Display, Neon Postgres, Route Handlers, bcrypt, JOSE JWT, Mapbox GL, Cloudflare Workers, and the `Naylahknee/Kolmari` repository.

## 1. Source-of-truth hierarchy

When sources conflict, use this order:

1. Explicit owner approval, including the locked identity and lexicon in this document.
2. This `DESIGN.md` file.
3. Production React components, data definitions, and tokens in `src/`.
4. Owner-supplied HTML mockups and image references.

References guide appearance, spacing, composition, and mood. Rebuild them as accessible React components and approved repository assets; never ship raw reference HTML or copy another product's branded design.

## 2. Seven Layer Dip guardrails

### Layer 1 — Identity (locked)

- Kolmari is a relocation decision system, not a vacation, booking, or generic travel product.
- Kolmari helps people evaluate relocation, choose a viable place, build a plan, and act.
- Tone is direct, practical, informed, confident, and human.
- Avoid generic SaaS language and aspirational filler.
- Changes require explicit owner approval.

### Layer 2 — Design system (locked)

- The color roles, typography roles, logo system, and brand vocabulary in this document are final.
- Gold is reserved for action, progress, and deliberate emphasis.
- Teal is reserved for community and Greenbook-related meaning.
- Geist is the interface typeface. Playfair Display is limited to selective editorial headings and quotations.
- Changes require explicit owner approval.

### Layer 3 — UX patterns (semi-locked)

- The Kolmari Profile Wizard presents one primary question per step.
- The dashboard is structured and action-oriented, not an open-ended discovery surface.
- Mobile screens prioritize one primary action.
- Interfaces must not become cluttered, form-heavy, or multi-action without review.

### Layer 4 — Feature structure (flexible)

- Greenbook Insights
- Kolmari Profile Wizard and Kolmari Pathways output
- Kolmarination and Destination evaluation
- Kolmari Tracker
- Cost calculator and document tools

Features may expand while preserving Layers 1–3.

### Layer 5 — Logic (flexible)

- Match Score calculations
- Kolmari Readiness calculations
- Destination recommendations
- Pathways matching

### Layer 6 — Content (flexible)

- Editorial copy
- Destination information
- Sourced Greenbook summaries
- Verified community submissions

### Layer 7 — Execution (fully flexible)

- Code structure
- Performance work
- Refactoring
- Testing and deployment implementation

### Enforcement

- Layer 1 or 2 impact: reject unless the owner explicitly approves the change.
- Layer 3 impact: review before implementation.
- Layer 4–7 impact: allow when it preserves all higher layers.
- AI and contributors must default to preserving the highest applicable layer.

## 3. Locked product lexicon

Use these terms consistently in navigation, headings, buttons, onboarding, metadata, and support copy.

| Approved term | Meaning | Primary placement |
| --- | --- | --- |
| **Kolmari** | The intentional act of leaving the United States to build a life elsewhere | Brand and identity |
| **Kolmarination** | The global map and comparison interface | Map title and navigation |
| **Destination** | A country or region being evaluated | Cards and detail pages |
| **Kolmari Profile** | The user's income, work, family, timing, and lifestyle inputs | Onboarding and sidebar |
| **Kolmari Plan** | The user's structured relocation plan | Dashboard |
| **Match Score** | Compatibility between a Kolmari Profile and a Destination | Destination cards |
| **Pathways** | Applicable visa and residence options | Wizard and Destination detail |
| **Kolmari Readiness** | The user's current preparation level | Dashboard and score UI |
| **Kolmari Timeline** | Relocation actions organized over time | Plan view |
| **Greenbook Insights** | Sourced lived-experience and context summaries | High on Destination pages |
| **Community Fit** | A qualitative belonging and daily-life consideration | Cards and Greenbook Insights |
| **Flutter Mode** | The transition from research to action | Primary dashboard action |
| **Kolmari Tracker** | Checklist and progress system | Dashboard and tracker route |

Exact interface copy:

- `Start Your Kolmari`
- `Choose Your Kolmarination`
- `Explore This Destination`
- `Review Your Pathways`
- `Build Your Kolmari Plan`
- `Enter Flutter Mode`

Product story:

```text
Start Your Kolmari
→ Choose Your Kolmarination
→ Explore a Destination
→ Review Your Pathways
→ Build Your Kolmari Plan
→ Enter Flutter Mode
```

Do not substitute generic **destination**, **journey**, **travel**, or **explore** language for the approved system terms. Exceptions are official names, factual requirements such as “travel insurance,” and the approved phrase **Explore This Destination**. Preserve official names such as **Destination Thailand Visa** verbatim.

## 4. Brand identity system

### 4.1 Primary mark — butterfly globe

The primary symbol is a precise geometric butterfly whose wings form a world map.

- Left wing: simplified Americas.
- Right wing: simplified Europe, Africa, Asia, and Oceania.
- Wing fields: Navy Deep or Navy.
- Continents and outer keyline: Gold or Gold Deep as appropriate for contrast.
- Latitude and longitude grid lines sit behind the continent shapes and must never cross over them.
- Form is balanced, structured, sharp, and symmetrical; it must not feel soft, whimsical, or organic.
- Geography is an identity cue, not a cartographic claim. Simplify it enough to scale cleanly.

### 4.2 Wordmark — geometric Kolmari arrow

The approved wordmark is uppercase `Kolmari` in a custom geometric sans-serif construction.

- The E/X transition forms a forward-facing gold arrow.
- The arrow may subtly suggest a roofline or directional home symbol, but must remain immediately readable.
- Remaining letters use Navy on light backgrounds and white on dark backgrounds.
- Do not use a legacy mixed-serif treatment in place of the approved geometric wordmark.
- Do not substitute a typed font for the final approved vector wordmark.

### 4.3 Tagline

The only approved logo-lockup tagline is:

```text
YOUR NEXT MOVE. YOUR NEXT LIFE.
```

Use uppercase geometric sans-serif with generous tracking. `NEXT` may use Gold when contrast and size support it. Do not place the tagline in small-size lockups where it becomes illegible.

### 4.4 App icon

- Gold butterfly-globe symbol on a Navy Deep field.
- Production master is a full-bleed square with no baked-in corner radius; operating systems apply masks.
- Keep critical artwork inside an 18% safe area.
- No wordmark or tagline inside the icon.
- Subtle tonal depth is allowed in the icon background only. The master logo geometry remains flat and crisp.
- A separate rounded-square presentation mockup may be used in brand boards.

### 4.5 Favicon

- Use a simplified solid-gold butterfly silhouette.
- Remove continents and grid lines at tiny sizes.
- Favor recognition and balanced negative space over detail.
- Verify by inspection at 16 × 16 and 32 × 32 pixels.

### 4.6 Dark-background lockup

- Navy Deep background.
- Butterfly globe in Gold with optional white grid detail at sufficiently large sizes.
- Wordmark uses white letters with the gold E/X arrow.
- Maintain the same geometry and spacing as the light-background lockup.

### 4.7 Clear space, minimum size, and misuse

Use the height of the wordmark's `N` stem as unit `x`.

- Symbol clear space: at least `0.5x` on every side.
- Horizontal lockup clear space: at least `0.75x` on every side.
- Symbol minimum digital width: 48px for the detailed mark; use the simplified favicon below that size.
- Wordmark minimum digital width: 120px.
- Wordmark-plus-tagline minimum digital width: 240px.

Never:

- recolor the logo outside approved variants;
- put grid lines in front of continents;
- stretch, skew, rotate, crop, outline, or add an unapproved shadow;
- use gradients inside the master logo geometry;
- place the mark on a low-contrast or visually noisy area;
- add butterfly ornamentation, rounded cartoon forms, pastel colors, or travel-agency motifs;
- recreate the wordmark with a standard typeface.

### 4.8 Asset inventory and approval status

Approved production assets live in `public/brand/`. Scene imagery remains in `public/images/`.

| Asset | Runtime filename | Approved source | Usage | Status |
| --- | --- | --- | --- | --- |
| Light-surface wordmark | `Kolmari-wordmark-light.png` | `6.png` | White cards, auth, and light mobile headers | Integrated |
| Dark-surface wordmark | `Kolmari-wordmark-dark.png` | `5.png` | Hero, sidebar, SEO header, and footers | Integrated |
| Butterfly wordmark | `Kolmari-butterfly-wordmark.png` | `3.png` | Protected workspace sidebar | Integrated |
| Split wordmark alternate | `Kolmari-wordmark-split.png` | `7.png` | Retained alternate; no default placement | Approved |
| High-resolution wordmark | `Kolmari-wordmark-master-light.png` | `Kolmari WORD LOGO.png` | Owner-approved master reference | Approved |
| Primary butterfly globe | `Kolmari-primary-dark.png` | `Kolmari Logo dark bg.png` | Detailed dark-background identity asset | Approved |
| Dimensional app icon | `Kolmari-icon-dimensional-source.png` | `KolmariLogo1.png` | Official installable icon source | Integrated |
| Flat app icon alternate | `Kolmari-icon-flat.png` | `Kolmari Logo.png` | Retained alternate | Approved |
| App icon exports | `app-icon-1024.png`, `app-icon-512.png`, `app-icon-192.png`, `app-icon-180.png` | Dimensional app icon | Browser, PWA, and Apple metadata | Integrated |
| Favicon exports | `favicon-512.png`, `favicon-48.png`, `favicon-32.png`, `favicon-16.png`, `favicon.ico` | `Favicons.png` | Browser favicon family | Integrated |

The owner-supplied PNG artwork is authoritative. Runtime derivatives may remove transparent padding, resize, or remove an exterior presentation matte, but must not redraw, recolor, or reinterpret the logo.

## 5. Color system

The production tokens already exist under `@theme inline` in `src/app/globals.css`. Extend that implementation only when the owner approves a new semantic role; do not add a second token block.

### Core brand palette

| Token | Value | Role |
| --- | --- | --- |
| Navy | `#17305B` | Primary headings, ink, and branded surfaces |
| Navy Deep | `#0D1B39` | Darkest surfaces, sidebar, hero, dark lockups |
| Navy Card | `#122A52` | Raised cards on dark surfaces |
| Gold | `#F3C516` | Primary actions, active progress, intentional emphasis |
| Gold Deep | `#C99A00` | Gold text or fine detail on light backgrounds |
| Gold Soft | `#FBEEB6` | Supporting chips and restrained highlights |
| Canvas | `#F4F6F9` | Light app background |
| Line | `#E7EBF1` | Dividers and card borders |
| Ink | `#17305B` | Body text on light surfaces |
| Muted | `#6B7A92` | Secondary text |

### Community palette

| Token | Value | Role |
| --- | --- | --- |
| Teal | `#1F9D94` | Greenbook and Community Fit actions or signals |
| Teal Deep | `#147A74` | Teal text and strong community emphasis |
| Teal Soft | `#DFF5F2` | Greenbook and community supporting surfaces |

### Status palette

- OK: `#3ECF8E`
- Warning: `#F3C516`
- Danger: `#F0637A`

Gold is action-only. Teal is community-only. Soft colors are supporting surfaces, never the primary brand treatment. Avoid pastel-led pages, low-contrast gold text, and decorative gradients that weaken the precise navy-and-gold identity.

## 6. Typography

- **Geist Sans:** product UI, navigation, controls, labels, data, body copy, and the typographic basis for custom vector letterforms.
- **Geist Mono:** technical or code-like values only when appropriate.
- **Playfair Display:** selective editorial headlines and quotations. Do not use it for navigation, dense UI, form controls, or the approved geometric wordmark.
- Favor strong hierarchy, concise line lengths, and high contrast.
- Use sentence case in product UI. Use uppercase with deliberate tracking only in compact labels and the tagline.

Fonts load from `next/font/google` in `src/app/layout.tsx` and are exposed through the existing Tailwind theme variables.

## 7. Layout and composition

- Main content width: 1180–1236px, centered with responsive gutters.
- Desktop: structured 12-column grid; tablet: 6–8 columns; mobile: a single clear content flow.
- Use contained bento sections where comparison or hierarchy benefits from cards.
- Reserve full viewport width for the metrics band, intentional image bands, and footer.
- Default card radii are restrained: 12–16px. Pills are for compact statuses, filters, and segmented controls—not every container.
- Maintain clear edges, geometric alignment, generous whitespace, and a visible reading order.
- Do not turn every section into a card. Alternate contained editorial sections, focused bento groupings, and full-width brand bands.
- Testimonial sections are text-led and must not include a portrait or testimonial photo. A minimal route/airplane motif is permitted as supporting decoration.

## 8. Component language and inventory

Component filenames may preserve compatibility, but user-facing names follow the lexicon.

| Code component or legacy URL | Approved user-facing role | Notes |
| --- | --- | --- |
| `Wordmark` | Kolmari geometric arrow wordmark | Replace only after the logo family is approved |
| `Button` | Primary, ghost, and outline actions | Gold only for the primary action |
| `Card` | Structured content surface | White, `border-line`, restrained shadow |
| `StatCard` | Kolmari Plan metric | One key measure and one supporting action |
| `ScoreRing` | Kolmari Readiness | Accessible text must accompany the SVG |
| `MatchRing` | Match Score | Never imply scientific certainty without evidence |
| `BudgetDonut` | Budget overview | Pair color with labels and values |
| `ChecklistRow` | Kolmari Tracker item | Clear complete, pending, warning, and blocked states |
| `CountryTile` / `CountryRow` | Destination card or row | Name, location, Pathways, Match Score, Community Fit |
| `Sidebar` | Workspace navigation | Navy; active item may use Gold |
| `TopBar` | Search, alerts, and account controls | Keep compact and task-oriented |
| `BottomNav` | Responsive workspace navigation | Five or fewer primary destinations |
| `ProfileWizardStep` | Kolmari Profile Wizard step | One primary question per step |
| `CtaBanner` | Flutter Mode action | One primary CTA |

Legacy URLs such as `/visa-wizard` and `/checklist` may remain as redirects for compatibility. Do not expose them as permanent product navigation.

## 9. Application routes

The project uses `src/app`, not a root `app/` directory.

### Public and authentication routes

```text
src/app/
  (marketing)/page.tsx                 → public landing page
  (marketing)/[seoSlug]/page.tsx       → ten public SEO pages
  (auth)/signup/page.tsx               → signup
  (auth)/login/page.tsx                → login
```

Public SEO slugs:

1. `/move-to-portugal-from-us`
2. `/move-to-spain-from-us`
3. `/move-to-thailand-from-us`
4. `/best-countries-for-black-expats`
5. `/best-countries-for-single-women`
6. `/best-countries-for-families`
7. `/digital-nomad-visas-for-americans`
8. `/easiest-visas-for-us-citizens`
9. `/portugal-vs-spain-for-expats`
10. `/thailand-vs-mexico-cost-of-living`

### Protected workspace routes

```text
src/app/(app)/
  welcome/page.tsx
  profile-wizard/page.tsx
  onboarding/page.tsx                  → compatibility redirect
  (workspace)/
    dashboard/page.tsx
    Kolmarination/page.tsx
    Kolmarination/[region]/page.tsx
    pathways/page.tsx
    Kolmari-plan/page.tsx
    visa-wizard/page.tsx                → compatibility redirect
    countries/page.tsx
    countries/[slug]/page.tsx
    checklist/page.tsx
    cost-calculator/page.tsx
    greenbook/page.tsx
    community/page.tsx
    saved/page.tsx
    documents/page.tsx
    settings/page.tsx
```

Approved UI labels:

- `/Kolmarination` → **Choose Your Kolmarination**
- `/Kolmarination/[region]` → **Explore This Destination**
- `/profile-wizard` → **Kolmari Profile Wizard**
- `/pathways` → **Kolmari Pathways**
- `/Kolmari-plan` → **Kolmari Plan**
- `/countries` → **Destinations**
- `/checklist` → **Kolmari Tracker**
- `/greenbook` → **Greenbook Insights**
- `/community` → **Kolmariers Community**
- `/saved` → **Saved Destinations**

Keep `/countries`, `/visa-wizard`, and `/checklist` URLs for compatibility unless a separate migration is approved.

### Kolmarination interaction

- `/Kolmarination` uses a responsive illustrated SVG world map with six accessible region links, image `clipPath` masks, Navy overlays, Gold outlines, and restrained motion.
- The main discovery map must not require Mapbox or a client token. Mapbox remains available for detailed country, city, neighborhood, and Greenbook location maps.
- Before profile completion, maps and cards show **Complete your Kolmari Profile to see personalized matches** and never substitute a static score or match label.
- A region selection routes to `/Kolmarination/[region]`; the map does not replace the protected App Shell.
- Region pages use the typed registry in `src/lib/Kolmarination-data.ts` and retain **Match Score**, **Pathways**, **Community Fit**, and **Explore This Destination** language.
- Passport Index is an outbound research resource only. Never scrape, embed, proxy, or reproduce its passport-strength and mobility data.

## 10. Authentication and continuation flow

- Authentication uses Neon user records, bcrypt password hashes, and JOSE-signed HS256 JWTs.
- The JWT is stored in a secure, `httpOnly`, `SameSite=Lax` session cookie in production.
- Current Route Handlers are `POST /api/login`, `POST /api/logout`, and `/api/profile` for profile reads and writes.
- Do not document or introduce an alternate authentication-handler namespace.
- Landing entry actions use **Start Your Kolmari**.
- Logged-out access to an intended protected route uses `/signup?next=<safe-internal-route>` or `/login?next=<safe-internal-route>`.
- Preserve validated internal `next` paths through signup and login.
- Reject absolute external URLs, protocol-relative URLs beginning with `//`, backslashes, and control characters.
- The `(app)` workspace is protected by the Next.js 16 `src/proxy.ts` convention and server-side layout validation. Keep both layers.
- New accounts continue to `/welcome`. Users may start `/profile-wizard` or skip to `/Kolmarination` without placeholder profile values.
- Completing the wizard persists the real Kolmari Profile and continues to `/pathways`.
- Existing sign-ins continue to the validated internal `next` path; use `/dashboard` as the fallback.
- Empty personal fields remain `NULL` in Neon until the user supplies them.

## 11. Imagery system

Current relocation imagery lives in `public/images/`:

- `hero-airplane-window.png` — aspirational movement and a new beginning, not a vacation ad.
- `journey-globe-pins.png` — global evaluation concept.
- `passport-visa-documents.png` — Pathways and document readiness.
- `luggage-tropical-coast.png` — practical relocation preparation.
- `dashboard-beach-banner.png` — restrained editorial banner.
- `footer-beach-ocean.png` — full-width footer atmosphere.
- `travel-route-pin.png` and `airplane.png` — minimal route motifs.

- `regions/*.webp` — six navy-and-gold geographic region artworks for Kolmarination map patterns, mobile cards, and region heroes.
- `countries/*.webp` — geographic country-card artwork used by the initial Europe Destination previews.

The Kolmarination polygons in `public/data/continents.geojson` are derived from Natural Earth 1:110m Admin 0 boundaries. Keep the source note in `public/data/README.md` with the data file.

Despite legacy filenames, UI copy must follow the locked lexicon. Imagery should communicate movement, global transition, decision-making, preparation, and a credible new life. It must not resemble a resort campaign, booking site, travel agency, or generic stock-photo collage.

Image direction:

- Deep navy shadows, controlled gold light, natural blue skies, and realistic texture.
- Premium editorial composition with deliberate negative space.
- No people unless a feature specifically requires a human story and the owner approves it.
- No testimonial portraits.
- No oversaturated tropical color, novelty travel icons, excessive softness, or pastel treatments.

Final identity assets belong in `public/brand/`; do not mix logo masters into `public/images/`.

## 12. Brand asset handling

- Use only the owner-supplied artwork listed in the approved asset inventory.
- Keep composite brand boards and source sheets out of runtime assets.
- Crop only transparent padding; do not crop visible logo geometry.
- Preserve transparency in wordmarks and favicons.
- Installable icons must be opaque, square, and use Navy Deep outside the approved rounded icon artwork.
- Generate size variants from the approved source without AI regeneration or manual redrawing.
- Keep the original source files unchanged outside the repository.

## 13. Validation checklist

Before shipping an identity-asset change:

- Confirm exact spelling of `Kolmari` and `YOUR NEXT MOVE. YOUR NEXT LIFE.`
- Confirm the E/X connection reads as a forward arrow without obscuring the word.
- Confirm the approved supplied geometry has not been redrawn or recolored.
- Inspect the detailed butterfly at large size and the simplified favicon at 16px and 32px.
- Confirm PNG masters have the required alpha behavior and no unintended matte.
- Confirm app-icon exports are opaque, square, correctly padded, and free of white exterior corners or halos.
- Confirm light, dark, single-color, and tiny-size variants remain recognizable.
- Scan interface copy against the locked lexicon with narrow exceptions for official names.
- After application integration, run lint and a production build and verify responsive rendering.

## 14. Implementation scope

- Preserve current business logic, database queries, API contracts, SEO data, and authentication behavior unless a separate change explicitly includes them.
- Keep the current stack. Do not introduce a UI framework, CSS-in-JS, or duplicate token system.
- Use Tailwind 4 utilities and the existing `@theme inline` tokens.
- Only approved runtime derivatives belong in `public/brand/`; composite reference boards remain outside the product.
