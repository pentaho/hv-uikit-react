---
component: HvCard
status: stable
related:
  [
    HvCardHeader,
    HvCardContent,
    HvCardMedia,
    HvActionBar,
    HvStatusIcon,
    HvSection,
    HvTable,
  ]
rules:
  [uikit/no-inline-style, uikit/no-hardcoded-values, uikit/clickable-elements]
---

# HvCard

A container for one item or one summary that leads to more detail: a KPI, an asset.

## When to use

- A grid of comparable items people browse; KPIs on a dashboard (laid out with grid classes and token gaps: `grid grid-cols-2 md:grid-cols-4 gap-sm`). A chart or table panel with a title and actions: HvSection.
- A selectable choice (plans, options): `selectable` with `selected`, inside a group that owns the selection.
- A titled region of a page or form: HvSection. Many records with the same fields: HvTable.

## What the consumer provides

- `bgcolor="bgContainer"`: there is no default fill, so without it the card is transparent.
- Children in order: HvCardHeader (`title`, `subheader`), optional HvCardMedia, HvCardContent, optional HvActionBar.
- `statusColor`: say the status in words too. `icon`: an HvStatusIcon for the card's status only.
- `selected` is visual only: expose the choice through a checkbox, radio or `aria-pressed` in the card.
- A KPI: `bgcolor="bgContainer"`, then HvCardContent with the measure in HvTypography `label`, the figure in `title1` with `component="p"` (it is an `h1` by default) and the change as an HvTag in words; HvSkeleton in its place while loading; a row of them in `grid grid-cols-2 md:grid-cols-4 gap-sm`.
- Interactive cards need a focusable control inside (a link or button named after the item); the card itself is a plain div, so no `onClick` on it.

## Spec

- `bgContainer` surface (via `bgcolor`), `borderSubtle` outline, `shadow`, `radii.large` bottom corners, and top corners too unless `statusColor` is set (the bar sits square on top).
- Header padding `space.xs` by `space.sm`; content padding `space.sm`; the last part gets `space.sm` bottom padding (not HvCardMedia).
- Title in the `label` style, subheader `caption1` in `textSubtle` (pass an HvTypography `title4` for a larger title).
- `statusColor` draws a thin bar on top (none by default); `selected` outlines the card in `primary` and thickens any bar; `selectable` hover is `bgHover` with a `primarySubtle` outline. `icon` sits in the top-right corner.

## Don't

- Don't put a title or body straight in HvCard: use HvCardHeader for the title and HvCardContent for the body, or their spacing is skipped.
- Don't leave buttons loose in the card: put them in HvActionBar, with at most one `primary`.
- Don't nest cards inside cards, or change its look with `style` / hex: use the theme's classes or `css()`, or `bgcolor` / `statusColor` token names.
