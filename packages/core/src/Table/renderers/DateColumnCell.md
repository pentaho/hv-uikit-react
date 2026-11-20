---
component: HvDateColumnCell
status: prefer-alternative
related: [HvTable, HvTableCell, HvTimeAgo, HvOverflowTooltip]
---

# HvDateColumnCell

A table cell renderer that prints a date in the browser's short date and medium time format.

## When to use

- Through `hvDateColumn` in a `useHvTable` columns list, when the table uses the column helpers.
- Otherwise prefer plain HvTableCell text from the app's one date formatter (or HvTimeAgo for recent events), so every date in the project reads the same.

## Spec

- An empty `date` shows an em dash; the text sits in HvOverflowTooltip, so a clipped date shows in full on hover.
