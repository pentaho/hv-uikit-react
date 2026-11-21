---
component: HvTable
status: stable
related:
  [
    HvTableSection,
    HvTableContainer,
    HvTableHead,
    HvTableBody,
    HvTableRow,
    HvTableHeader,
    HvTableCell,
    HvPagination,
    HvBulkActions,
    HvEmptyState,
    HvSkeleton,
  ]
rules: [uikit/raw-elements]
---

# HvTable

Rows of records people scan, sort, select and act on.

## When to use

- Records with comparable fields (assets, terms, runs); `listrow` when each row reads as one entry. A few text-heavy items: HvCard items in a grid (`grid md:grid-cols-3 gap-sm`). A hierarchy: HvTreeView.

## What the consumer provides

- Composition: HvTableSection (or an HvCard) around HvBulkActions, HvTableContainer > HvTable > HvTableHead / HvTableBody, and HvPagination last.
- State through `useHvTable` plus plugin hooks (`useHvSortBy`, `useHvPagination`, `useHvRowSelection`, `useHvBulkActions`); spread their `get…Props()` on the parts. Server-side data: `manualPagination`, `manualSortBy` and `pageCount`.
- Columns from the helpers: `hvTextColumn` (truncates, full text on hover), `hvNumberColumn` (right-aligned), `hvDateColumn`, `hvTagColumn`. Sorting: `useHvSortBy` and each header's `getHeaderProps()`; `disableSortBy: true` on a column that doesn't sort.
- Sticky columns with the hooks: `useHvTableSticky` and columns with `sticky: "left" | "right"` (widths become fixed). `stickyHeader` needs a height-bounded HvTableContainer.
- An accessible name: `aria-label` or a `<caption>`. Status cells in words (HvTag, or HvStatusIcon beside text).
- Loading: HvSkeleton rows or HvLoadingContainer; failure: a `role="alert"` message with a Retry HvButton; empty: HvEmptyState, not headers only.

## Spec

- Body text in `body`; column titles in `label` on `bgPage`.
- Rows on `bgContainer`, `bgHover` on hover, `selected` on `bgPage`; sorted cells `primary` at 10% alpha; cells padded `space.sm`, divided by `borderSubtle`.
- `listrow`: rows outlined in `border` with `radii.round` corners and a `space.xs` gap.

## Don't

- Don't use a raw `<table>`, `<tr>` or `<td>`: the HvTable parts carry the styles, roles and sort semantics (`uikit/raw-elements`).
- Don't hand-write rows or render unbounded rows: read them from the data query and page them with HvPagination.
- Don't rely on column resizing for essential tasks: it is drag-only, not keyboard accessible.
- Don't put per-row buttons for actions on many rows: use HvBulkActions with row selection.
