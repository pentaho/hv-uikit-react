---
component: HvSection
status: stable
related: [HvCard, HvAccordion, HvPanel, HvTypography]
rules: [uikit/no-inline-style]
---

# HvSection

A titled, bordered region that groups a page's content under one topic, optionally collapsible.

## When to use

- The regions of a detail or settings page ("Ownership", "Schema", "Activity"), each with its own actions.
- A dashboard panel (a chart, a table) with its title and actions, in a grid or an HvDashboard.
- `expandable` when people often hide a region; several stacked show-and-hide items with less chrome: HvAccordion.
- One item or summary in a grid: HvCard.

## What the consumer provides

- `title`: an HvTypography heading (`title4`, with `component="h2"` or the right level); optional HvStatusIcon before it.
- `actions`: buttons on the right of the header (`secondaryGhost` or HvIconButton with `title`).
- `expanded` + `onToggle(event, open)`, or `defaultExpanded`.
- `expandButtonProps={{ "aria-label": "Collapse ownership" }}`: the expand button is named "Expand" / "Collapse" (English, fixed) and the region takes that name, so name it after the section and localize it.

## Spec

- `expandableHeader` makes the whole header toggle (clicks on `actions` don't); `raisedHeader` draws a bottom border under the header while open.
- `bgContainer` fill, `border` outline, `radii.round` corners.
- Header padding `space.xs` by `space.sm`, gap `space.xs`; content padding `space.sm` (none on top under a header); clickable header hover `bgHover`.

## Don't

- Don't nest sections inside sections or inside cards.
- Don't pass the title as plain text: pass an HvTypography.
