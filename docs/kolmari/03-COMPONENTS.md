# Kolmari Components

## Reusable components inventory

| Component | File | Server/Client | Purpose |
|---|---|---|---|
| `AppShell` | `src/components/kolmari/app-shell.tsx` | Client | Sidebar, top bar, mobile nav — migrated to Kolmari labels |
| `Wordmark` | `src/components/kolmari/wordmark.tsx` | Server | Renders brand SVG |
| `ScoreRing` | `src/components/kolmari/rings.tsx` | Server | Move Readiness / Match Score ring |
| `BudgetDonut` | `src/components/kolmari/rings.tsx` | Server | Budget breakdown chart |
| `KlubHeader` | `src/components/community/klub-header.tsx` | Server | Kolmari Klub page header |
| `KlubTabs` | `src/components/community/klub-tabs.tsx` | Client | Tab navigation for Klub sections |
| `DiscoverKlubs` | `src/components/community/discover-klubs.tsx` | Server | Discover klubs section |
| `MyKlubs` | `src/components/community/my-klubs.tsx` | Server | My klubs section |
| `ChatterFeed` | `src/components/community/chatter-feed.tsx` | Server | Chatter/discussion feed |

## Component contracts

### ScoreRing
- `value`: 0–100 number
- `label`: accessible text description
- Never show a score unless the profile is complete
- Always include text fallback alongside the SVG

### BudgetDonut
- Pair color with label and value in legend
- Show empty state when no budget data

### AppShell (Kolmari)
- Sidebar uses Navy Deep background
- Active item uses gold highlight
- Collapsed state stores preference in localStorage with compatibility key
- Mobile bottom nav shows 4 primary destinations

## Rules

- No page component should contain the full page design inline
- Break every page into focused, reusable sub-components
- Only interactive sections use `'use client'`
- Do not create near-duplicate components to match one design file
