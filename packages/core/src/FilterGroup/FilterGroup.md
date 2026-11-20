---
component: HvFilterGroup
status: stable
related: [HvSearchInput, HvDropdown, HvTag, HvBulkActions, HvTable]
---

# HvFilterGroup

A button that opens a two-pane panel of filter categories and their values, applied together.

## When to use

- Several filter categories over one list or table (Domain, Owner, Status) where people pick values in each and apply at once.
- One or two filters: an HvDropdown with `multiSelect` per filter. Free text: HvSearchInput.

## What the consumer provides

- `filters` and `value` + `onChange`: `value` holds one array of selected ids per filter, in the same order as `filters`. Omit both and it keeps its own state.
- `onChange` fires on Apply only. Clear resets the pending selection (to `defaultValue` if set) and fires `onClear`; people still press Apply. `onCancel` fires on Cancel, on click outside and on closing, and rolls the selection back.
- `aria-label` or `label`.
- `filterContentProps`: `iconOnly` for an icon trigger; `leftEmptyElement` / `rightEmptyElement` while filters load.

## Spec

- Trigger: a dropdown-style button with a count of selected values. Panel on `bgContainer`: categories on the left, a `bgPageSecondary` rule between the panes, searchable values with select-all on the right.
- Actions at the bottom: Clear `secondaryGhost` at the start; Apply `primary` and Cancel `secondarySubtle` at the end, `space.xs` apart.

## Don't

- Don't hand-write filter values: build `filters` from the data (the list call's facets or the records).
- Don't apply filters with no visible trace: show the active ones (HvTag chips with `onDelete`, or a count) and the result count.
