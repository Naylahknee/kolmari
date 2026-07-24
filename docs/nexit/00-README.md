# Nexit Product Documentation

This directory is the canonical product, design, and implementation documentation for Nexit.

Nexit is a relocation decision system—not a travel app. The documentation is organized so identity, visual standards, product behavior, page architecture, adaptive navigation, data trust, and implementation rules remain easy to find and difficult to contradict.

## Source-of-truth order

1. Explicit owner approval.
2. `01-DESIGN.md` for locked identity, vocabulary, and visual rules.
3. The relevant focused document in this directory.
4. Production components, schemas, and tokens.
5. Owner-supplied mockups and external references.

When two documents appear to conflict, preserve the highest Seven Layer Dip layer and the more specific rule. External references—including Notion—are structural inspiration only and never override Nexit identity.

## Documentation map

| File | Purpose |
|---|---|
| `01-DESIGN.md` | Identity, philosophy, brand, lexicon, Seven Layer Dip, and visual guardrails |
| `02-DESIGN-TOKENS.md` | Colors, typography, geometry, spacing, elevation, motion, responsive rules |
| `03-COMPONENTS.md` | Reusable components, accordion system, component contracts, accessibility |
| `04-LAYOUTS.md` | Application shell, sidebar, persistent country workspace, page layout families |
| `05-PAGE-TEMPLATES.md` | Route-by-route and chapter-by-chapter page specifications |
| `06-ADAPTIVE-WORKSPACE.md` | Adaptive country navigation, relevance scoring, personalization, persistence |
| `07-DATA-MODEL.md` | Data types, source disclosure, verification, personalization and trust rules |
| `08-CONTENT-STANDARDS.md` | Voice, hierarchy, progressive disclosure, Greenbook labels, empty states |
| `09-IMPLEMENTATION-RULES.md` | Architecture, file structure, phases, testing, performance, completion criteria |
| `10-LLM-RULES.md` | Mandatory instructions for AI contributors |
| `11-NEXITNATION-MAP.md` | Map behavior, Mapbox architecture, country interactions, personalization, responsive states, and validation |
| `12-INTERACTION-DESIGN.md` | Interaction behavior, map-to-region-to-country transitions, motion, state stability, responsive behavior, accessibility, and validation |

## Core product rule

Every major screen must help the user answer:

1. Where am I?
2. What does this mean for me?
3. What should I do next?

Personalization may reorder content, but it must not fabricate data, imply legal eligibility, or hide essential research.
