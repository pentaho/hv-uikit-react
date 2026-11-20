---
component: HvTableRow
status: stable
related: [HvTable, HvTableCell, HvTableHeader]
rules: [uikit/raw-elements]
---

# HvTableRow

One row of an HvTable (a `tr`).

## When to use

- One per record in HvTableBody, and one in HvTableHead for the column titles.

## What the consumer provides

- A `key` from the record's id; HvTableCell (or HvTableHeader for a row title) children.
- `hover` and `selected`: `useHvTable`'s `getRowProps()` sets them (selection with `useHvRowSelection`), so pass them by hand only without the hooks. `striped` for long read-only lists.
- A clickable row still needs a real control in it (a link or button) for keyboard and screen-reader users.

## Spec

- `bgContainer` fill; `striped` even rows on `bgContainer` at 60% alpha; `bgHover` on hover when `hover` or `striped`; `selected` on `bgPage`.
- In a `listrow` table: outlined in `border` with `radii.round` corners; selected rows outlined in `text`.
