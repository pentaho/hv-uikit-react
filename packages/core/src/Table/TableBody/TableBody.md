---
component: HvTableBody
status: stable
related: [HvTable, HvTableRow, HvTableCell]
rules: [uikit/raw-elements]
---

# HvTableBody

The body row group of an HvTable (a `tbody`).

## When to use

- Once per HvTable, holding an HvTableRow per record of the current page.

## What the consumer provides

- Rows mapped from the page of records the query returned (with the hooks, `table.page`, and spread `getTableBodyProps()`).
- `withNavigation` for arrow-key movement between rows and cells when rows are interactive: each direct child must then be an element with a `key` (non-element children are dropped).

## Spec

- Cells inside it take the body styles: `body` text, row height for dense data.
