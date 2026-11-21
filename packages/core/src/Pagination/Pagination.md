---
component: HvPagination
status: stable
related: [HvTable, HvTableSection, HvDotPagination]
---

# HvPagination

Page controls under a table or list: page size, first / previous / next / last, and a page-number field.

## When to use

- Under every HvTable or long list whose records come in pages; inside HvTableSection it joins the table's frame.
- Stepping through a few slides or cards (a carousel, onboarding): HvDotPagination.

## What the consumer provides

- `page` (zero-based) + `onPageChange(page)`, with `pages`; or spread `getHvPaginationProps()` from the table instance (needs the `useHvPagination` plugin).
- `pageSize` + `onPageSizeChange`.
- `canPrevious` (`page > 0`) and `canNext` (`page < pages - 1`): required in practice, because the arrows stay disabled unless they are true.
- Sentence-case `labels` (the defaults are Title Case): `{ firstPage: "First page", previousPage: "Previous page", nextPage: "Next page", lastPage: "Last page" }`; they name the icon buttons for screen readers.

## Spec

- `caption1` text; page-size selector left, navigation centered with `space.xs` gaps; `space.sm` above it outside a table section.
- Navigation is icon buttons; the page field takes a number, committed on Enter or blur and clamped to the page range; `showPageJump={false}` shows a plain number.

## Don't

- Don't compute page numbers from a hand-written array: the list call returns the page and the total; derive `pages` from them.
- Don't leave it visible and enabled with one page of results: hide it, or pass both `canPrevious` and `canNext` false.
- Don't keep the default Title Case button names in a product UI.
