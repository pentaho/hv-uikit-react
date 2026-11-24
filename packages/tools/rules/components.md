# Component Rules

## Introduction

Which component to reach for. `npx --no-install uikit-tools info <Component>` has each one's props and guidance.

## Text

Text always through `HvTypography` with a `variant` (`title2` for the page heading with `component="h1"`, `title3`/`title4` for sections, `body`, `label`, `caption1`).

## Status

`HvTag` with `color` `positive`, `warning`, `negative` or `info` (none for neutral), or `HvStatusIcon`, always with a text label.

## Controls

`HvButton` (variants `primary`, `secondarySubtle`, `secondaryGhost`, `negative…`; see `actions/color-actions-accordingly`), `HvIconButton` (icon-only, needs `title`), `HvInput`, `HvSearchInput`, `HvDropdown` or `HvSelect`, `HvTextArea`, `HvCheckBox`, `HvRadioGroup`, `HvSwitch`.

## Data

`HvTable` + `HvTableContainer`/`HvTableHead`/`HvTableBody`/`HvTableRow`/`HvTableHeader`/`HvTableCell` (optionally `useHvData`, `useHvSortBy`, `useHvPagination` hooks) and `HvPagination`. A whole page of records (KPIs, search, filters, bulk actions, pagination) combines `HvTable`, `HvFilterGroup`, `HvBulkActions` and `HvPagination`.

## Containers

`HvCard`, `HvSection`, `HvDrawer` (side panel), `HvDialog`. Page layout is in the `layout` rules.

## Data states

A view that loads data has four states, each a component: loading (`layout/loading-states`), empty (`HvEmptyState`, which needs an icon, with an action), error (a message with Retry; `HvBanner` for the whole page) and data. `HvSnackbar` confirms an action.
