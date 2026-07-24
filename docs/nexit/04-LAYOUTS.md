# Nexit Layout System

Nexit uses intentional page families. Do not force every route into one dashboard layout.

## 17. Application Shell

Nexit uses a two-zone workspace layout:

1. Collapsible nested navigation sidebar
2. Large focused workspace canvas

```yaml
workspace:
  sidebar:
    width: "248px"
    collapsedWidth: "0px"
    backgroundColor: "{colors.sidebar}"
    borderRight: "1px solid {colors.border}"
    position: "fixed"
    collapsible: true

  header:
    height: "72px"
    persistent: true
    backgroundColor: "{colors.canvas}"
    borderBottom: "1px solid {colors.border}"

  canvas:
    backgroundColor: "{colors.canvas}"
    maxReadableWidth: "960px"
    contentPaddingDesktop: "40px 56px 96px"
    contentPaddingTablet: "32px 32px 80px"
    contentPaddingMobile: "24px 20px 88px"

  mobileSidebar:
    behavior: "drawer"
    width: "min(88vw, 320px)"
```

### Desktop shell behavior

- Sidebar remains fixed.
- Workspace header remains visible.
- Main canvas scrolls independently.
- Sidebar can collapse completely.
- Main canvas expands when collapsed.
- Collapse preference is remembered.

### Mobile shell behavior

- Sidebar becomes an off-canvas drawer.
- Bottom navigation may remain for the highest-level areas.
- Only the active Nextination expands by default.
- Nested country sections remain accessible inside the drawer.

---

## 18. Sidebar Information Architecture

```text
Nexit
[User Name]’s Space

Home
Search
Updates

DISCOVER
Dashboard
Nexitnation
Countries

MY NEXIT
My Nextinations
  Portugal
    Overview
    Economic Profile
    Cost of Living
    Housing
    Nexit Pathways
    Employment
    Healthcare
    Education
    Transportation
    Legal & Taxes
    Daily Life
    Family & Pets
    Greenbook
    Resources
  Spain
  Costa Rica

PLANNING
Nexit Pathways
Nexit Plan
Cost Calculator
Documents

Settings
Profile
```

### Sidebar rules

- Saved countries behave like nested pages.
- Only the active country expands by default.
- Inactive countries remain collapsed.
- Country page sections are not shown as a horizontal tab strip.
- Active row uses gold-soft background and deep navy text.
- Parent and child rows must visually communicate hierarchy.
- Hover controls should appear only when useful.
- Navigation should remain compact and readable.

### Adaptive country section order

The sidebar may reorder country sections based on the user's Nexit Profile.

Examples:

- Families: move Education, Healthcare, Housing, and Family & Pets upward.
- Local job seekers: move Economic Profile, Employment, Pathways, and Legal & Taxes upward.
- Remote workers: move Cost, Pathways, Housing, Legal & Taxes, and Healthcare upward.
- Retirees: move Healthcare, Cost, Housing, Passive Income Pathways, and Legal & Taxes upward.

Always provide:

- Personalized order
- Standard order

Prefer reordering over hiding.

---
## 19. Persistent Country Hero Panel

The country hero is a signature Nexit component and must remain on all country workspace pages.

It acts as the persistent contextual anchor while the page section below changes.

```yaml
countryHero:
  enabled: true
  persistentAcrossCountrySections: true
  backgroundColor: "{colors.navy-deep}"
  textColor: "{colors.on-navy}"
  rounded: "{rounded.xl}"
  padding: "32px 36px"
  layout: "content-left, score-right"
```

### Country hero content

Required:

- Country flag or country code
- Country name
- Base city and region
- Nexit Match label
- Nexit Score
- Top three match reasons
- One meaningful tradeoff
- Likely Pathway summary
- Save as a Nextination
- Compare
- Build Your Nexit Plan

Optional when valid:

- Nexit Readiness
- Profile completeness
- Last reviewed date

### Country hero rules

- Keep the hero visible when moving between country sections.
- Do not recalculate or visibly reorder it during the session.
- Do not show fake readiness, score, or profile values.
- Do not imply visa qualification.
- The hero may become compact after scrolling but must remain available.
- On mobile, stack score and actions below the summary.

### Example

```text
Portugal
Lisbon · Europe

94% Nexit Match
Excellent Match

• Your budget aligns with several Portuguese cities
• Europe is one of your preferred regions
• Remote-work Pathways may support your move

Tradeoff: Central Lisbon may exceed your preferred housing range.

[Save as a Nextination] [Compare] [Build Your Nexit Plan]
```

---

## 20. Country Workspace Page Model

The country hero remains fixed at the top of the country workspace.
Only the content section beneath it changes.

```text
Country Hero
↓
Active Country Page
↓
Sources and Verification
↓
Related Actions
```

### Required country routes

```text
/nextinations/[countrySlug]/overview
/nextinations/[countrySlug]/economic-profile
/nextinations/[countrySlug]/cost-of-living
/nextinations/[countrySlug]/housing
/nextinations/[countrySlug]/pathways
/nextinations/[countrySlug]/employment
/nextinations/[countrySlug]/healthcare
/nextinations/[countrySlug]/education
/nextinations/[countrySlug]/transportation
/nextinations/[countrySlug]/legal-taxes
/nextinations/[countrySlug]/daily-life
/nextinations/[countrySlug]/family-pets
/nextinations/[countrySlug]/greenbook
/nextinations/[countrySlug]/resources
```

Use a shared nested layout so navigation replaces only the main country section content.

---
## 32. Page Template and Content-Disclosure System

This section is authoritative for deciding how every major Nexit page is structured. It combines the restrained workspace mechanics of the original reference analysis with Nexit's brand, persistent country hero, adaptive navigation, and action-oriented content model.

### Page-template registry

Every major route must declare one page template. Do not force all routes into one generic dashboard shell.

```ts
export type NexitPageTemplate =
  | "dashboard-home"
  | "country-workspace"
  | "pathways-directory"
  | "planning-workspace"
  | "calculator-tool"
  | "greenbook-directory"
  | "document-manager"
  | "map-discovery"
  | "comparison-workspace"
  | "settings-form"
  | "standard-document";
```

Recommended route mapping:

| Route | Template | Persistent country hero | Primary disclosure pattern |
|---|---|---:|---|
| `/dashboard` | `dashboard-home` | No | Four concise workspace sections |
| `/nextinations/[countrySlug]/[section]` | `country-workspace` | Yes | Visible answer first, expandable research second |
| `/pathways` | `pathways-directory` | No | Ranked summaries plus pathway accordions |
| `/nexit-plan` | `planning-workspace` | Contextual country summary only | Phase groups and task details |
| `/cost-calculator` | `calculator-tool` | No | Inputs and result visible; assumptions expandable |
| `/greenbook` | `greenbook-directory` | Optional compact country context | Topic groups with provenance labels |
| `/documents` | `document-manager` | No | Status summary plus document-category groups |
| `/nexitnation` | `map-discovery` | No | Map, filters, cards, and detail drawer |
| `/compare` | `comparison-workspace` | No | Side-by-side matrix; details expandable |
| `/settings` | `settings-form` | No | Stable form groups |

### Persistent country workspace rule

The existing Nexit country hero is a signature component and must remain on all country-section routes.

```text
Application shell
↓
Persistent country hero
↓
Active country chapter
↓
Sources and verification
↓
Related action
```

The hero may display only real values:

- country code or flag
- country name, city, and region
- Nexit Match and match label
- top match reasons
- one material tradeoff
- valid pathway categories or count
- real readiness progress, when available
- Save, Compare, and Build Plan actions

Never invent readiness. When no valid readiness calculation exists, hide the gauge or show a profile-completion prompt.

Navigating between Overview, Economic Profile, Cost, Housing, Pathways, Healthcare, Greenbook, and other chapters changes only the chapter content. The hero and app shell remain mounted through a shared nested layout.

## Layout families

```ts
export type NexitPageTemplate =
  | "dashboard-home"
  | "country-workspace"
  | "pathways-directory"
  | "planning-workspace"
  | "calculator-tool"
  | "greenbook-directory"
  | "document-manager"
  | "map-discovery"
  | "comparison-workspace"
  | "settings-form"
  | "standard-document";
```

Every major route declares a template. A template controls composition, navigation behavior, maximum readable width, persistence, and content-disclosure defaults; it must not erase route-specific needs.

## Persistent country workspace

```text
App shell
└── Country workspace layout
    ├── Persistent Country Hero
    ├── Active section context
    ├── Active country chapter
    ├── Sources and verification
    └── Related actions
```

The shared country layout persists while the nested route content changes. Do not reintroduce the old horizontally scrolling country tab row.
