---
component: HvActionsGeneric
status: stable
related: [HvDropDownMenu, HvButton, HvIconButton, HvBulkActions, HvTable]
---

# HvActionsGeneric

A row of action buttons from a list, collapsing the extra ones into an overflow menu.

## When to use

- Row actions in a table, card or panel header where the set comes from data (`maxVisibleActions` keeps the row compact).
- Inside HvBulkActions, HvBanner and HvBannerContent it renders their actions for you.
- One or two fixed buttons: plain HvButton or HvIconButton.

## What the consumer provides

- `actions` + `onAction(event, action)`; extra fields on an action (e.g. `color`) pass through to its button. A single React element as `actions` renders as is.
- `dropdownMenuProps` with an `aria-label` for the overflow menu.

## Spec

- Buttons in a row with a `space.xs` gap; overflow is an HvDropDownMenu with the dots icon, opening to the left.

## Don't

- Don't show more than two or three actions per row: set `maxVisibleActions` and let the rest go to the menu.
- Don't leave icon-only actions without a `label`: the label becomes the tooltip and accessible name.
