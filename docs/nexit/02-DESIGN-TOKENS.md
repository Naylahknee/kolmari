# Nexit Design Tokens and Visual Foundations

This file converts Nexit's locked visual identity into reusable implementation rules. Do not create a second token system.

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
## 16. Geometry, Spacing, and Elevation

```yaml
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"

spacing:
  xxs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  xxl: "32px"
  xxxl: "40px"
  section-sm: "48px"
  section: "64px"
```

### Geometry rules

- Sidebar rows: 6px radius
- Buttons: 8px radius
- Inputs: 8px radius
- Standard content cards: 12px radius
- Large country hero panels: 16px radius
- Pills are reserved for compact badges and statuses
- Do not use pill-shaped primary buttons

### Elevation rules

- Most content surfaces should be flat.
- Use borders instead of shadows whenever possible.
- Standard cards: no shadow
- Hover elevation: subtle 1px–2px shadow only
- Country hero: may use a restrained shadow against the light canvas
- Modals and drawers: stronger elevation allowed

---
## 23. Component Tokens

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    border: "1px solid {colors.primary}"

  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.navy}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    border: "1px solid {colors.border-strong}"

  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.navy}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "7px 9px"

  sidebar-row:
    backgroundColor: "transparent"
    textColor: "{colors.body}"
    typography: "{typography.navigation}"
    rounded: "{rounded.sm}"
    padding: "6px 8px"
    minHeight: "32px"

  sidebar-row-active:
    backgroundColor: "{colors.sidebar-active}"
    textColor: "{colors.navy-deep}"
    typography: "{typography.navigation-active}"
    rounded: "{rounded.sm}"

  content-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    rounded: "{rounded.lg}"
    padding: "20px"
    border: "1px solid {colors.border}"
    shadow: "none"

  callout-info:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.body}"
    rounded: "{rounded.md}"
    padding: "14px 16px"
    border: "1px solid {colors.border}"

  callout-match:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.navy-deep}"
    rounded: "{rounded.md}"
    padding: "14px 16px"
    border: "1px solid #E9D77C"

  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-deep}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
    border: "1px solid {colors.border-strong}"
    height: "44px"

  badge-match:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.navy-deep}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
    typography: "{typography.caption}"

  source-disclosure:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
    border: "1px solid {colors.border}"
```

---
## 27. Responsive Behavior

### Breakpoints

| Name | Width | Behavior |
|---|---:|---|
| Mobile | < 768px | Sidebar drawer, stacked country hero, single-column content |
| Tablet | 768–1023px | Collapsible sidebar, compact hero, single-column content |
| Desktop | 1024–1439px | Fixed sidebar, full hero, 960px content canvas |
| Wide desktop | ≥ 1440px | Fixed sidebar, expanded canvas, generous whitespace |

### Country hero responsiveness

- Desktop: content left, score right
- Tablet: content and score remain side by side when space permits
- Mobile: score and actions stack below summary
- Actions wrap without horizontal scrolling

### Sidebar responsiveness

- Desktop: collapsible fixed sidebar
- Tablet: collapsible fixed or overlay sidebar depending on available width
- Mobile: drawer

---

## 28. Motion

Use restrained transitions:

```yaml
motion:
  fast: "120ms ease"
  standard: "180ms ease"
  panel: "220ms cubic-bezier(0.4, 0, 0.2, 1)"
```

Use motion for:

- sidebar collapse
- nested navigation expansion
- drawer transitions
- subtle hover feedback
- section loading transitions

Do not animate:

- match scores during routine navigation
- country hero content between sections
- data tables excessively

---
## 28. Motion

Use restrained transitions:

```yaml
motion:
  fast: "120ms ease"
  standard: "180ms ease"
  panel: "220ms cubic-bezier(0.4, 0, 0.2, 1)"
```

Use motion for:

- sidebar collapse
- nested navigation expansion
- drawer transitions
- subtle hover feedback
- section loading transitions

Do not animate:

- match scores during routine navigation
- country hero content between sections
- data tables excessively

---
