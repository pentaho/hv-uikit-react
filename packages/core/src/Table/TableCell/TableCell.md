---
component: HvTableCell
status: stable
related: [HvTable, HvTableRow, HvTableHeader, HvTag, HvOverflowTooltip]
rules: [uikit/raw-elements, uikit/no-inline-style]
---

# HvTableCell

One cell of an HvTable (a `td`).

## When to use

- Every value in a body row; the column's title goes in HvTableHeader, not a cell.

## What the consumer provides

- The value, formatted with the app's shared date and number formatters; `align="right"` for numbers.
- Long text: HvOverflowTooltip inside the cell; status: HvTag with words; a missing value: an em dash, as the column helpers do.
- With the hooks, spread `cell.getCellProps()` (it sets `variant`, `align` and `sorted` from the column); no `style` on it from a project.

## Spec

- `body` text, compact fixed height, side padding `space.sm`, `borderSubtle` bottom rule; in a sorted column `primary` at 10% alpha.
