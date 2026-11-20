---
component: HvTableSection
status: stable
related: [HvTable, HvSection, HvBulkActions, HvPagination, HvTableContainer]
---

# HvTableSection

The titled frame around a table, its bulk actions and its pagination.

## When to use

- Around one table with its HvBulkActions above and HvPagination below: it joins them into one bordered block.

## What the consumer provides

- HvSection's props (`title` as an HvTypography `title4`, `actions` for the whole table).
- Children in order: HvBulkActions, HvTableContainer with HvTable (or HvLoadingContainer around it), HvPagination.

## Spec

- Removes the inner padding; pagination sits on `bgPage` above a `borderSubtle` rule, with `space.xs` padding; bulk actions get `space.xs` / `space.sm` padding.
- Header cells on `bgPage` with a `bgPageSecondary` bottom rule; the last row has no bottom border.
