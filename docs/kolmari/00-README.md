# Kolmari Product Documentation

This directory is the canonical product, design, and implementation documentation for Kolmari.

Kolmari is a relocation decision system — not a travel app. It helps people discover countries, understand relocation pathways, and build a practical plan for life abroad.

## Migration context

Kolmari's existing production behavior remains the functional source of truth. The Kolmari design and product language is the visual and terminology source of truth.

## Source-of-truth order

1. Explicit owner approval.
2. `01-DESIGN.md` for locked identity, vocabulary, and visual rules.
3. The relevant focused document in this directory.
4. Production components, schemas, and tokens.
5. Owner-supplied mockups and external references.
6. Existing Kolmari application behavior.

## Documentation map

| File | Purpose |
|---|---|
| `00-README.md` | This file — navigation and core rules |
| `01-DESIGN.md` | Identity, brand, lexicon, visual rules |
| `02-DESIGN-TOKENS.md` | Colors, typography, geometry, spacing |
| `03-COMPONENTS.md` | Reusable components and contracts |
| `04-LAYOUTS.md` | App shell, sidebar, page layout families |
| `05-PAGE-TEMPLATES.md` | Route-by-route page specifications |
| `06-ADAPTIVE-WORKSPACE.md` | Adaptive country navigation, personalization |
| `07-DATA-MODEL.md` | Data types, persistence, compatibility |
| `08-CONTENT-STANDARDS.md` | Voice, hierarchy, empty states |
| `09-IMPLEMENTATION-RULES.md` | Architecture, phases, completion criteria |
| `10-LLM-RULES.md` | Mandatory instructions for AI contributors |
| `REBRAND-MIGRATION.md` | Migration strategy and classification |
| `REPLACEMENT-MATRIX.md` | Legacy-to-Kolmari term mapping |
| `ROUTE-MIGRATION.md` | Route compatibility and redirect plan |
| `HTML-INTEGRATION.md` | Design file integration rules |
| `MIGRATION-CHECKLIST.md` | Phase-by-phase completion checklist |
| `LEGACY-REFERENCE-AUDIT.md` | Audit of remaining legacy references |
| `DESIGN-TO-CODE-INVENTORY.md` | Screen and component inventory |

## Approved Kolmari terminology

| Purpose | Approved term |
|---|---|
| Product | Kolmari |
| Community | Kolmari Klub |
| Execution workspace | Flutter Mode |
| Country exploration area | Your World |
| Saved or considered countries | Destinations |
| One country | Destination |
| Visa and relocation options | Pathways |
| User relocation plan | My Plan |
| Relocation progress | Move Readiness |
| Schedule and deadlines | Move Timeline |
| Progress system | Progress Tracker |
| Community suitability | Community Fit |
| Country recommendation result | Match Score |
| Greenbook map data | Greenbook Layer |
| Greenbook content | Greenbook Insights |

## Core product rule

Every major screen must help the user answer:

1. Where am I?
2. What does this mean for me?
3. What should I do next?
