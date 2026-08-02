# Kolmari Design System — practical reference

The concrete, code-accurate companion to `DESIGN.md` (the brand standard). Every
value here mirrors `src/app/globals.css` (`@theme` tokens + component classes).
**Do not hardcode hex in components — use the token.** Tokens live once, in
`globals.css`; never add a second token block.

Gold is **action-only** (primary buttons, active progress, emphasis). Teal is
**community-only** (Greenbook Insights, Community Fit). Soft tints are supporting
surfaces, never the primary treatment.

## Color

### Brand — navy & gold
| Token | Hex | Role |
| --- | --- | --- |
| `--color-navy` | `#17305B` | Primary headings, body ink, branded surfaces |
| `--color-navy-deep` | `#0D1B39` | Sidebar, hero, header block, dark lockups |
| `--color-navy-card` | `#122A52` | Raised cards on dark surfaces |
| `--color-gold` | `#F3C516` | Primary actions, active progress, emphasis |
| `--color-gold-deep` | `#C99A00` | Gold text / fine detail on light grounds |
| `--color-gold-soft` | `#FBEEB6` | Supporting chips, active tab fill, highlights |

### Community — teal
| Token | Hex | Role |
| --- | --- | --- |
| `--color-teal` | `#1F9D94` | Greenbook & Community Fit actions/signals |
| `--color-teal-deep` | `#147A74` | Teal text, strong community emphasis |
| `--color-teal-soft` | `#DFF5F2` | Community / Greenbook supporting surfaces |

### Surface & text
| Token | Hex | Role |
| --- | --- | --- |
| `--color-canvas` | `#F4F6F9` | Light app background |
| `--color-line` | `#E7EBF1` | Dividers, card borders |
| `--color-line-strong` | `#DBE1EA` | Input borders, stronger separators |
| `--color-muted` | `#6B7A92` | Secondary text |
| `--color-muted-soft` | `#8090A8` | Tertiary labels |

### Status
| Token | Hex | Soft | Use |
| --- | --- | --- | --- |
| `--color-ok` | `#1F7A4D` | `--color-ok-soft` `#D6F3E4` | Success, ready, complete |
| `--color-warn` | `#B8890A` | `--color-warn-soft` `#FBEEB6` | In-progress, attention |
| `--color-danger` | `#F0637A` | — | Errors, destructive |
| `--color-info` | `#3A5A94` | `--color-info-soft` `#E3EBF7` | Neutral info |

## Typography

- **Geist Sans** (`--font-sans` / `--font-display`) — all UI, navigation, headings, body, data. Loaded via `next/font` in `layout.tsx`.
- **Geist Mono** (`--font-mono`) — technical/code-like values only.
- Sentence case in product UI; uppercase + `letter-spacing` only for compact labels.

| Role | Size / weight |
| --- | --- |
| Display | ~34px / 800 / `-0.02em` |
| H1 | ~26px / 800 |
| H2 | ~18px / 700 |
| Body | 15px / 400 |
| Small | 13px / 500, muted |
| Label | 11px / 700 / `0.14em` uppercase, muted |

## Buttons

One primary (gold) action per view; everything else is outline or ghost. All ≥44px tall (small variants 36px).

- **Primary** — `.gold-button`: gold bg, navy text, weight 700, radius 8px (`--radius-btn`), `--shadow-gold`, lifts 1px on hover (`#ffd83d`), `opacity .55` disabled.
- **Outline (secondary)** — white/surface bg, `1px solid --color-line-strong`, navy text, hover `--color-canvas`. In Tailwind: `border border-line px-3.5 py-2 text-xs font-bold text-navy hover:bg-canvas`.
- **Ghost** — transparent, hover tint. **Nav-solid** — `bg-navy text-white` for add/confirm.
- Small = 36px min-height, `px-3.5`, `text-xs`.

## Inputs

One shared **`.field`** class covers text/number/date/select/textarea: `min-height:44px`, `1px solid --color-line-strong`, radius 8px, white bg, `padding: 0 14px`. Focus = gold ring `rgba(243,197,22,.18)` + `--color-gold-deep` border. Labels sit above, 12px bold.

## Surfaces & badges

- **`.card-surface`** — white, `1px solid --color-line`, radius 12px (`--radius-card`), `--shadow-card`. Don't turn every section into a card.
- **Badges / pills** — radius-full, encode state in color + shape: gold-soft (`bg-gold-soft text-gold-deep`), teal-soft (community), ok-soft (ready), `rgba(240,99,122,.16)`+danger (error), canvas+muted (neutral). Pair a colored dot with the label for status.

## Tabs — global segmented style

The standard tab style across the app (My Plan, Account, Destinations, Kolmari Klub, and country pages). A bordered container of rounded tab buttons; the **active tab is filled `--color-gold-soft` with bold navy text** — never an underline.

```html
<div class="k-tabbar">
  <div class="k-tabs" role="tablist">
    <button role="tab" aria-selected="true" class="k-tab">Overview <span class="k-count">3</span></button>
    <button role="tab" aria-selected="false" class="k-tab">Documents</button>
  </div>
</div>
```

- `.k-tabbar` — `1px solid --color-line`, radius 12px, white.
- `.k-tabs` — flex, `gap 2px`, `padding 6px`, horizontal scroll (no scrollbar chrome).
- `.k-tab` — `padding 8px 13px`, radius 8px, `12.5px / 600`, muted; hover canvas/navy.
- Active via `aria-selected="true"` (or `.is-active`) → gold-soft fill, navy, 700.
- `.k-count` — optional count pill inside a tab.

## Header pills

The workspace header (`TopBar`) is a frosted bar (`rgba(247,248,251,.6)`, `backdrop-filter: blur+saturate`, 56px, bottom hairline). Right cluster:

- **View preference pill** `.view-control` — one white, `1px solid --color-line`, radius-full container labeled `VIEW`. Currency (`USD` / `EUR`) and measurement system (`US` / `Metric`) live inside the same pill. Each option is radius-full; the selected option uses `--color-navy-deep` with white text. Do not render separate rectangular segmented controls.
- **Notification bell** `.tb-bell` — 32×32, radius 8px, icon `--color-muted`, hover `--color-canvas` + navy.
- **Profile pill** `.profile-pill` — white, `1px solid --color-line`, radius-full, `padding 3px 10px 3px 3px`, hover border `--color-line-strong` + bg `#FBFCFE`. Contains `.profile-avatar` (26px circle, **navy bg + gold initials**) and `.profile-name` (12.5px/600 navy, first name). Initials come from the real account `display_name` — never a placeholder name.

## Geometry, elevation, motion

| Token | Value |
| --- | --- |
| `--radius-card` / `--radius-tile` | 12px |
| `--radius-btn` / `--radius-field` | 8px |
| `--radius-sidebar-row` | 6px |
| `--radius-pill` | 9999px |
| `--shadow-card` | `0 1px 3px 0 rgba(16,34,68,.08), 0 1px 2px -1px rgba(16,34,68,.06)` |
| `--shadow-gold` | `0 8px 20px -8px rgba(216,169,4,.6)` |
| `--shadow-shell` | `0 4px 24px -8px rgba(16,34,68,.18)` |
| Motion | fast `120ms` (controls) · standard `180ms` · panel `220ms` · `cubic-bezier(.4,0,.2,1)` |

Motion is calm — no bounce/confetti — and fully disabled under `prefers-reduced-motion`.

## Working rules

1. Gold = action only. Teal = community only.
2. Use tokens, never raw hex, in components. One token block (`globals.css`).
3. Soft tints are supporting surfaces, never the primary brand treatment.
4. Main content width ~1180px, centered. Restrained radii. Pills for statuses/filters, not every container.
5. Tabs use the global `.k-tab*` classes; the active tab is gold-soft, not underlined.
