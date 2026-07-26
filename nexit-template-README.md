# Nexit country page template

The approved `index.html` mockup converted into the repo's component structure,
wired to be the page a user lands on when the profile wizard completes.

## The completion flow, before and after

Your existing flow already does the hard part:

```
profile-wizard.tsx  ->  /nextinations?source=quiz
/nextinations       ->  rankNextinations(profile), redirect to the top match
/nextinations/[slug] ->  /overview
```

So switching the landing page is **one line**, in
`src/app/(app)/(workspace)/nextinations/page.tsx`:

```diff
+const TEMPLATE_PATH = process.env.NEXT_PUBLIC_COUNTRY_TEMPLATE === 'v2' ? '/v2/overview' : ''
+
-  redirect(`/nextinations/${ranked[0].country.slug}?source=quiz`)
+  redirect(`/nextinations/${ranked[0].country.slug}${TEMPLATE_PATH}?source=quiz`)
```

`rankNextinations` still picks the country. `?source=quiz` still flows through,
so the hero still shows the "Your top Nextination from the Nexit Match Quiz"
pill. Nothing about the wizard changes.

## Reversible without a deploy

```bash
NEXT_PUBLIC_COUNTRY_TEMPLATE=v2      # new template
# unset, or anything else            # existing sixteen-tab workspace
```

Flip the variable back and the next request lands on the old page. That matters
for a post-signup landing page, which is the worst place to discover a problem.

## Install

1. Copy `src/` over the repo's `src/`. Only `nextinations/page.tsx` is
   overwritten, and the diff is in `SWITCH.diff`.
2. Add the brand PNGs to `public/brand/`. `marketing-logo.tsx` points at
   `/brand/nexit-butterfly.png`, which does not exist. That is the broken logo
   in the sidebar today.
3. Set `NEXT_PUBLIC_MAPBOX_TOKEN`.
4. Set `NEXT_PUBLIC_COUNTRY_TEMPLATE=v2`.
5. `npm run dev`, complete the wizard, and you land on the new page.

Leave step 4 out and everything installs dormant. You can review
`/nextinations/portugal/v2/overview` directly before switching anyone onto it.

## Routes added

```
/nextinations/[countrySlug]/v2                    -> redirects to /v2/overview
/nextinations/[countrySlug]/v2/[section]          -> the new template
```

Eight sections: `overview`, `move-there`, `cost-housing`, `work-study`,
`healthcare`, `family-schools`, `lifestyle-community`, `tax-money`.

Nothing at `/nextinations/[countrySlug]/[section]` is touched. Both templates
run side by side.

## What is where

| Path | Notes |
|---|---|
| `styles/country-template.css` | Extracted verbatim. Tokens already match `globals.css`. |
| `components/country-template/*.tsx` | Frame: top bar, sidebar, hero, tab bar, right rail |
| `components/country-template/tabs/*.tsx` | Eight tabs, **server components**, zero JS |
| `components/country-template/client/*` | The three real client islands |
| `lib/country-template/tax.ts` | `calcIrs`, `estimate`. Pure, unit-testable. |
| `lib/country-template/format.ts` | `fmtMoney`, `fmtTemp`, FX constant |
| `html2jsx.py`, `raw/` | The converter and its inputs, so this is repeatable |

## Three decisions already made

**Tabs are routes, not state.** Each is its own URL, matching the existing
`[section]` pattern. Tab bodies stay server components and ship no JavaScript.

**Accordions and expanders toggle the DOM directly** (`client/behaviours.ts`).
Unusual for React, but they sit on static server-rendered content that never
re-renders, which kept all eight tabs free of client boundaries. If a section
becomes dynamic, convert that one to local state.

**Units are context, not a DOM walker.** The mockup rewrapped text nodes, which
React would discard on re-render. `UnitsProvider` plus `<Money eur={1600} />`
replaces it.

## Still to do

1. **Bind content.** Tab markup is verbatim Portugal copy. Replace literals with
   `content.*` one section at a time. Components already accept `slug`.
2. **Extend `CountryContent`** with the new field groups: `overview.narrative`,
   `geo.outline`, `geo.capital`, `lifestyleSummary`, `climate`, `taxBands`,
   `entryRequirements`, `schooling`, `safetyScores`.
3. **Swap section 1 of Tax & Money** for `<TaxEstimator />`. Static markup is
   still in `TaxMoneyTab.tsx`; the working component is in `client/`.
4. **Drop the hardcoded ternaries** in the old workspace
   (`slug === 'portugal' ? 'Euro (EUR)' : 'Researching'`). That is why four
   countries show "Researching" on data they already have.
5. **Live FX rate.** `FX = 1.08` is a placeholder.
6. **Real entry data.** Seven passports of sample values today. Use the
   MIT-licensed Passport Index dataset.

Until step 1 lands, every country renders Portugal's copy. Ship it behind the
flag for yourself first, not for users.

## Regenerating

If the mockup changes, re-run the converter rather than hand-editing tabs:

```bash
python3 html2jsx.py raw out
```

It reports structural problems instead of silently mangling markup.
Current run: 13 chunks, 0 problems.
