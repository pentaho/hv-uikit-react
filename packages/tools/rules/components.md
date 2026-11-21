# Component Rules

## Imports

- Components come from `@pentaho/uikit-react-core` and are named `Hv*`; charts from `@pentaho/uikit-react-viz`.
- Icons come from `@phosphor-icons/react`, never `@pentaho/uikit-react-icons` (internal); no hand-drawn `<svg>`.
- Never import from `@mui/*` or `@base-ui/*` (`import type` is fine where a prop's type comes from there): they are the UI Kit's internals, not its API. For breakpoints in code, `useWidth`.

## Text

Text always through `HvTypography` with a `variant` (`title2` for the page heading with `component="h1"`, `title3`/`title4` for sections, `body`, `label`, `caption1`); never inline font sizes or weights.

## Status

`HvTag` with `color` `positive`, `warning`, `negative` or `info` (none for neutral), or `HvStatusIcon`, always with a text label, never color alone. The `warning` tag's text is below AA at small sizes: keep it short and beside its meaning.

A kind of thing (a reason, a type, a format) is not a status: a neutral `HvTag`, or `type="categorical"` with `color` `cat1` to `cat12`, so status colors keep meaning good or bad.

## Controls

`HvButton` (variants in `actions/color-actions-accordingly`), `HvIconButton` (icon-only, needs `title`), `HvInput`, `HvSearchInput`, `HvDropdown` or `HvSelect`, `HvTextArea`, `HvCheckBox`, `HvRadioGroup`, `HvSwitch`.

## Data

- `HvTable` with `useHvTable` and its plugin hooks (`useHvSortBy`, `useHvPagination`), and `HvPagination`.
- Actions on one row: `HvDropDownMenu` in the row's last cell (`keepOpened={false}`, named "Actions for <item>"), or `HvActionsGeneric` when some stay visible. Actions on several rows at once: `HvBulkActions` with row selection, its checkbox named ("Select all").
- Narrow a list with `HvSearchInput` and an `HvDropdown` (`multiSelect`) per filter; `HvFilterGroup` for three or more, showing the active filters.
- Charts: `@pentaho/uikit-react-viz` (HvBarChart, HvLineChart, HvDonutChart) inside an `HvVizProvider`, never hand-drawn SVG.

## Containers

`HvCard`, `HvSection`, `HvDialog`; `HvDrawer` only when the approved design shows one. Page layout is in the `layout` rules.

A dashboard's panels (a chart, a table, a list) are `HvSection`s with their title and actions, its KPIs `HvCard`s, laid out with grid classes; `HvDashboard` (`@pentaho/uikit-react-widgets`) only when people should be able to rearrange or resize the panels themselves, and the panels stay `HvSection`s.

## Data states

A view that loads data has four states, each a component: loading (`layout/loading-states`), empty (`HvEmptyState`, with an action when there's a next step; `role="status"` when it replaces filtered results), error (a message with Retry, `role="alert"`; for the whole view, `HvBannerContent variant="error"` above the content, in the page's flow: `HvBanner` floats and covers the view's title) and data. A snackbar confirms an action (`useHvSnackbar` where the app provides `HvSnackbarProvider`, as the App Shell does).
