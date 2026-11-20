---
component: HvBulkActions
status: stable
related: [HvTable, HvCheckBox, HvActionsGeneric, HvPagination]
---

# HvBulkActions

The bar above a table or list with the select-all checkbox, the selection count and actions on the selected items.

## When to use

- Any list or table where people select rows to act on several at once (delete, export, assign).
- Actions for one row: in the row (HvActionsGeneric or HvDropDownMenu).

## What the consumer provides

- `numTotal`, `numSelected`; `onSelectAll(event, checked)`: you decide what it selects (usually the current page; clear everything when any are selected). The checkbox is checked whenever `numSelected > 0` and indeterminate when `0 < numSelected < numTotal`, so a click on a partial selection reports `checked: false`.
- `actions` + `onAction`; `maxVisibleActions` sends the rest to a menu.
- `showSelectAllPages` + `onSelectAllPages`: the button shows only while some but not all items are selected.
- `checkboxProps`: the select-all checkbox's label is only the count, so give it a descriptive name (`aria-label` or `label`) such as "Select all".

## Spec

- `bgContainer` bar with a `border` outline, `radii.round` corners, `space.xs` padding and gap below; `bgDisabled` when disabled.
- Select-all HvCheckBox with an "N / total" label; actions are `secondaryGhost` buttons at the end.

## Don't

- Don't enable actions with nothing selected: leave `actionsDisabled` unset and they disable at zero selected.
- Don't show a count that lies across pages: pass the real `numTotal` and use `showSelectAllPages` when the table is paged.
