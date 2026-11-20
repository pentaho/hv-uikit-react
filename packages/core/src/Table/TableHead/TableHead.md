---
component: HvTableHead
status: stable
related: [HvTable, HvTableHeader, HvTableRow]
rules: [uikit/raw-elements]
---

# HvTableHead

The header row group of an HvTable (a `thead`).

## When to use

- Once per HvTable, holding one HvTableRow of HvTableHeader cells (two rows for grouped columns).

## What the consumer provides

- With the hooks, spread `getTableHeadProps()` on HvTableHead (it sets `stickyHeader` when the table option is on) and `headerGroup.getHeaderGroupProps()` on each HvTableRow.
- `stickyHeader` works only inside a height-bounded HvTableContainer.

## Spec

- Cells inside it take the head styles: `label` text on `bgPage`.
