---
component: HvDropdownColumnCell
status: prefer-alternative
related: [HvDropdown, HvTable, HvTableCell]
---

# HvDropdownColumnCell

HvDropdown under a table-cell name, used by the `hvDropdownColumn` helper.

## When to use

- Only through `hvDropdownColumn` in a `useHvTable` columns list, for an editable choice per row (an owner, a stage); written by hand, use HvDropdown in an HvTableCell (the same component). Row actions: HvDropDownMenu in an `actions` cell.

## What the consumer provides

- The cell value is that row's `values` array; an empty or missing array disables the dropdown and shows `disabledPlaceholder`. Single select only.
- The helper sets `aria-labelledby` to the column header id, so give the header an `id`; for a per-row name ("Owner of Sales orders") render HvDropdown in your own cell with `aria-label`.
