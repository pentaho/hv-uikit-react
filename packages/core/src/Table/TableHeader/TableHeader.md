---
component: HvTableHeader
status: stable
related: [HvTable, HvTableHead, HvTableCell]
rules: [uikit/raw-elements]
---

# HvTableHeader

A column title (a `th`), with optional sorting and resizing.

## When to use

- One per column inside HvTableHead; in a body row only for a row title (it gets `scope="row"`).

## What the consumer provides

- A short sentence-case title ("Last updated"); `align="right"` for numbers, matching their cells.
- Sorting props from `useHvSortBy`'s `getHeaderProps()`; resizing: `resizable` with `resizerProps` from `useHvResizeColumns`.
- The head's sort button is named "Sort": rename it through `sortButtonProps` (e.g. for translation).

## Spec

- Sets `aria-sort` (`none` when sortable but unsorted).
- `label` text, side padding `space.sm`, `borderSubtle` bottom rule; head cells on `bgPage`.
- Sortable headers highlight in `bgHover` on hover and focus; the sort icon appears then and stays visible once the column is sorted; resizing shows a `primaryStrong` edge (also while hovering the resize handle).
