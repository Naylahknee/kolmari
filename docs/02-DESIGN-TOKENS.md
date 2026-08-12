# Kolmari Design Tokens

The production tokens live under `@theme inline` in `src/app/globals.css`. Do not add a second token block.

## Color tokens

| Token | Value | Role |
|---|---|---|
| `--color-navy` | `#17305b` | Primary headings and branded surfaces |
| `--color-navy-deep` | `#0d1b39` | Darkest surfaces, sidebar, hero |
| `--color-navy-card` | `#122a52` | Raised cards on dark surfaces |
| `--color-gold` | `#f3c516` | Actions, progress, emphasis |
| `--color-gold-deep` | `#c99a00` | Gold text on light backgrounds |
| `--color-gold-soft` | `#fbeeb6` | Supporting chips, highlights |
| `--color-teal` | `#1f9d94` | Community and Greenbook signals |
| `--color-teal-deep` | `#147a74` | Teal text, strong community emphasis |
| `--color-teal-soft` | `#dff5f2` | Community supporting surfaces |
| `--color-canvas` | `#f4f6f9` | Light app background |
| `--color-line` | `#e7ebf1` | Dividers and card borders |
| `--color-muted` | `#6b7a92` | Secondary text |

## Geometry

| Token | Value |
|---|---|
| `--radius-card` | `12px` |
| `--radius-pill` | `9999px` |
| `--radius-field` | `8px` |
| `--radius-btn` | `8px` |

## Typography variables

| Variable | Assigned font |
|---|---|
| `--font-sans` | Geist Sans |
| `--font-mono` | Geist Mono |
| `--font-display` | Playfair Display |

## Usage rules

- Gold is action-only. Teal is community-only.
- Use `font-display` (Playfair) only for large editorial headings.
- Card radii are 12–16px. Pills for compact status only.
- White cards on the light canvas (`#F4F6F9`) for the workspace.
