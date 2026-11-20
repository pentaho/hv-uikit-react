---
component: HvProgressColumnCell
status: prefer-alternative
related: [HvProgressBar, HvTable, HvTableCell]
---

# HvProgressColumnCell

A thin progress bar for a table cell, showing a part of a total.

## When to use

- Through `hvProgressColumn(col, getPartial, getTotal, color?)` in a `useHvTable` columns list; it labels the bar with the column header and shows an em dash when the total is 0 or missing.
- Written by hand, prefer HvProgressBar in the cell: it shows the value as text and carries a status.

## What the consumer provides

- `aria-labelledby`: the id of an element naming the measure; the bar has no visible number, so show the value as text nearby.

## Spec

- Percentage rounded down; a `total` of 0 gives 0%. `border` track; `positive` bar for `primary`, `text` bar for `secondary`.
