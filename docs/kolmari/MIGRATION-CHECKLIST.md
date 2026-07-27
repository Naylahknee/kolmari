# Kolmari Migration Checklist

## Phase 2: Foundation

- [x] Create `src/config/brand.ts`
- [x] Create `src/config/product-copy.ts`
- [x] Create `src/config/brand-assets.ts`
- [x] Add `KOLMARI_LEXICON` to `src/lib/lexicon.ts`
- [x] Create `docs/kolmari/` documentation files
- [ ] Update `AppShell` sidebar to Kolmari nav structure
- [ ] Update `AppShell` sidebar group labels
- [ ] Update root layout metadata (title, description → Kolmari)
- [ ] Add localStorage compatibility shim for `nexit:sidebar-collapsed`

## Phase 3: Pilot — Kolmari Klub

- [ ] Create `src/components/community/` directory
- [ ] Create `klub-header.tsx`
- [ ] Create `klub-tabs.tsx`
- [ ] Create `discover-klubs.tsx`
- [ ] Create `my-klubs.tsx`
- [ ] Create `chatter-feed.tsx`
- [ ] Update `/community` page to use new components
- [ ] No public "Nexit" copy on page
- [ ] Honest empty states

## Phase 3: Dashboard

- [ ] Migrate public copy: "Your Nexit workspace" → Kolmari
- [ ] "Enter Nexicution Mode" → "Enter Flutter Mode"
- [ ] "Nexit Profile" → "Kolmari Profile"
- [ ] "Nexit Plan" → "My Plan"
- [ ] "Nexit Tracker" → "Progress Tracker"
- [ ] "Nexit Timeline progress" → "Move Timeline"
- [ ] "Nexit Pathways" → "Pathways"
- [ ] "Nexit Budget" → "Budget"

## Phase 3: Settings

- [ ] Migrate public copy to Kolmari terminology

## Phase 3: Cost Calculator

- [ ] Migrate public copy to Kolmari terminology

## Phase 3: Destinations / Saved

- [ ] Header: "Destinations" (was "Saved Nextinations")
- [ ] Terminology: "Destinations" not "Nextinations"
- [ ] localStorage: add `kolmari-saves` shim

## Phase 3: Documents

- [ ] Migrate public copy to Kolmari terminology

## Phase 3: Pathways

- [ ] Migrate public copy to Kolmari terminology
- [ ] "Nexit Pathways" heading → "Pathways"

## Phase 3: My Plan

- [ ] Page heading: "My Plan" (was "Nexit Plan")
- [ ] Timeline stages preserved
- [ ] Checklist label: "Progress Tracker"

## Phase 3: Flutter Mode

- [ ] Create new route `/flutter`
- [ ] Execution-focused view of plan checklist
- [ ] "Enter Flutter Mode" CTA

## Phase 3: Greenbook

- [ ] Migrate public copy to Kolmari terminology
- [ ] "Compare Nextinations" → "Compare Destinations"

## Phase 3: Your World

- [ ] Page heading: "Your World" (was "Nexit World")
- [ ] Region matches label: "Kolmari Match" not "Nexit Match"

## Phase 3: Profile Wizard

- [ ] Migrate public copy to Kolmari terminology
- [ ] "Build Your Nexit Profile" → "Build Your Kolmari Profile"

## Phase 3: Welcome

- [ ] "Welcome to Nexit" → "Welcome to Kolmari"
- [ ] "Build Your Nexit Profile" → "Build Your Kolmari Profile"
- [ ] "Start Your Nexit" → "Build My Move Plan"

## Phase 4: Landing page

- [ ] "Start Your Nexit" → "Build My Move Plan"
- [ ] "Nexiters" → "Kolmari Klub members"
- [ ] Review fabricated stats
- [ ] Remove or label fabricated testimonial

## Phase 4: Auth screens

- [ ] "Start Your Nexit" → "Build My Move Plan"
- [ ] "Continue your Nexit Plan" → "Continue your Move Plan"

## Phase 4: SEO pages

- [ ] Review and migrate terminology in SEO content

## Validation

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `npx opennextjs-cloudflare build` passes
- [ ] Legacy terminology audit run
- [ ] Responsive review at 320px, 375px, 768px, 1024px, 1280px, 1440px
