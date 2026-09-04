# Migration to v7

UI Kit v7 is a **major release** that completes the move to Pentaho. Packages now ship under the `@pentaho/*` scope, Pentaho is the single theme, and the NEXT and v5 compatibility layers have been retired.

Changes fall into four areas:

- **Packages** — new scope, one renamed, one removed, two no longer published
- **Theming** — NEXT theme and the v5 compatibility colors removed; default font is now Inter
- **Components** — some components, props, and style classes retired.
- **Internals** — `@mui/base` replaced by `@base-ui/react`; `HvGrid` migrated to the latest MUI Grid.

This guide covers migrating from `v6` to `v7`.

## Suggested migration sequence

1. Update all package dependencies from `@hitachivantara/*` to `@pentaho/*`.
2. Rename `uikit-react-pentaho` usage to `uikit-react-widgets`.
3. Replace removed `uikit-react-lab` components and any direct `uikit-react-icons` usage.
4. Remove `next` theme usage and replace `pentahoPlus` checks.
5. Replace removed core components (`HvCarousel`, `HvStack`, etc.).
6. Update renamed props and classes.
7. Replace removed v5 compatibility color tokens.
8. Re-run visual and interaction tests for components with deep customization.

## Breaking changes

### 1) Package scope renamed

All public packages moved from `@hitachivantara/*` to `@pentaho/*`.

Update every import and dependency entry.

```diff
-import { HvButton } from "@hitachivantara/uikit-react-core";
+import { HvButton } from "@pentaho/uikit-react-core";
```

`@pentaho/uikit-react-core` also adds `@mui/utils` (`^7.0.2`) as a peer dependency — install it alongside the existing `@mui/material` peer.

### 2) Complete package mapping (v6 → v7)

Every package that existed in `v6.10.0`, with its v7 name and status.

| v6 package                                | v7 package                         | Status in v7         |
| ----------------------------------------- | ---------------------------------- | -------------------- |
| `@hitachivantara/app-shell-events`        | `@pentaho/app-shell-events`        | Renamed, public      |
| `@hitachivantara/app-shell-i18next`       | `@pentaho/app-shell-i18next`       | Renamed, public      |
| `@hitachivantara/app-shell-navigation`    | `@pentaho/app-shell-navigation`    | Renamed, public      |
| `@hitachivantara/app-shell-services`      | `@pentaho/app-shell-services`      | Renamed, public      |
| `@hitachivantara/app-shell-shared`        | `@pentaho/app-shell-shared`        | Renamed, public      |
| `@hitachivantara/app-shell-ui`            | `@pentaho/app-shell-ui`            | Renamed, public      |
| `@hitachivantara/app-shell-vite-plugin`   | `@pentaho/app-shell-vite-plugin`   | Renamed, public      |
| `@hitachivantara/internal`                | `@pentaho/internal`                | Renamed, private     |
| `@hitachivantara/uikit-cli`               | `@pentaho/uikit-cli`               | Renamed, public      |
| `@hitachivantara/uikit-config`            | `@pentaho/uikit-config`            | Renamed, now private |
| `@hitachivantara/uikit-react-code-editor` | `@pentaho/uikit-react-code-editor` | Renamed, public      |
| `@hitachivantara/uikit-react-core`        | `@pentaho/uikit-react-core`        | Renamed, public      |
| `@hitachivantara/uikit-react-icons`       | `@pentaho/uikit-react-icons`       | Renamed, now private |
| `@hitachivantara/uikit-react-lab`         | —                                  | **Removed**          |
| `@hitachivantara/uikit-react-pentaho`     | `@pentaho/uikit-react-widgets`     | **Renamed**, public  |
| `@hitachivantara/uikit-react-shared`      | `@pentaho/uikit-react-shared`      | Renamed, public      |
| `@hitachivantara/uikit-react-utils`       | `@pentaho/uikit-react-utils`       | Renamed, public      |
| `@hitachivantara/uikit-react-viz`         | `@pentaho/uikit-react-viz`         | Renamed, public      |
| `@hitachivantara/uikit-styles`            | `@pentaho/uikit-styles`            | Renamed, public      |
| `@hitachivantara/uikit-uno-preset`        | `@pentaho/uikit-uno-preset`        | Renamed, public      |

Packages marked _private_ are no longer published to npm.

### 3) Widgets package rename + lab package removal

- `@hitachivantara/uikit-react-pentaho` was renamed to `@pentaho/uikit-react-widgets`.
- `@hitachivantara/uikit-react-lab` was removed.

`@pentaho/uikit-react-widgets` exports `HvCanvas` (renamed from `pentaho`) and `HvDashboard` (moved from `lab`).

```diff
-import { HvCanvas } from "@hitachivantara/uikit-react-pentaho";
-import { HvDashboard } from "@hitachivantara/uikit-react-lab";
+import { HvCanvas, HvDashboard } from "@pentaho/uikit-react-widgets";
```

The remaining `lab` components don't ship in v7:

- `HvBlade` and `HvBlades`
- `HvFlow`
- `HvStepNavigation`
- `HvWizard`

If you rely on any of these, copy the source from your `v6.x` codebase before upgrading — it ports across with minimal changes.

### 4) Icons package no longer published

`@hitachivantara/uikit-react-icons` was public in v6. In v7 the package is private, and `@pentaho/uikit-react-core` no longer depends on it.

v7 doesn't ship a direct replacement, so if your application imports icon components directly you'll want to bring your own icon set.

```diff
-import { Info } from "@hitachivantara/uikit-react-icons";
```

### 5) NEXT theme removed and Pentaho theme renamed

The NEXT theme is no longer exported.

- Removed export: `next`
- Removed bundle entry: `themes.next`

```diff
-import { next } from "@hitachivantara/uikit-styles";
+import { pentaho } from "@pentaho/uikit-styles";
```

The Pentaho theme was also renamed: its `name` is now `pentaho` instead of `pentahoPlus`. This is a runtime value, so update any comparisons and any CSS or selectors keyed on the `data-theme` attribute.

```diff
-const isPentahoTheme = activeTheme?.name === "pentahoPlus";
+const isPentahoTheme = activeTheme?.name === "pentaho";
```

```diff
-[data-theme="pentahoPlus"] { ... }
+[data-theme="pentaho"] { ... }
```

### 6) v5 compatibility color tokens removed

`theme.colors` no longer carries the v5 palette (`primary_80`, `secondary_60`, `atmo2`–`atmo4`, `base_light` / `base_dark`) or the legacy visualization shades (`cat1_20` … `cat12_180`, `cat13`–`cat28`) — about 130 tokens.

The current semantic tokens, base colors and visualization shades `cat1`–`cat12` are unchanged, and TypeScript flags every removed one.

### 7) Default font changed

The default body font changed from Open Sans to Inter.

```diff
-font-family: "Open Sans", Arial, Helvetica, sans-serif;
+font-family: "Inter", Arial, Helvetica, sans-serif;
```

If your application relied on Open Sans being bundled, you can load it yourself.

### 8) Core components removed

The following components are no longer part of `@pentaho/uikit-react-core`. They weren't deprecated in v6, so it's worth searching for them directly — a clean v6 build won't flag them:

- `HvCarousel`
- `HvControls`
- `HvLogin`
- `HvScrollToHorizontal`
- `HvScrollToVertical`
- `HvSimpleGrid`
- `HvStack`

Recommended alternatives:

- `HvCarousel`: use a minimal CSS carousel with horizontal scrolling and snap points (for example `overflow-x-scroll snap-x snap-mandatory`), or adopt [Embla Carousel](https://www.embla-carousel.com/).
- `HvControls`: this was a widget/template-style component; copy/adapt the source from your `v6.x` codebase where needed.
- `HvLogin`: this was a minimal template; use the [Login examples](https://pentaho.github.io/uikit-docs/v6.x/examples/login) as a starting point.
- `HvScrollToHorizontal` and `HvScrollToVertical`: use `HvListContainer` + `HvListItem` with `component="a"` and `href="#your-section"`, plus CSS smooth scrolling via [`scroll-behavior`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-behavior).
- `HvSimpleGrid`: replace with utility-grid layouts such as `grid grid-cols-2 md:grid-cols-4`.
- `HvStack`: replace with flex layouts such as `flex gap-sm` (row/column as needed).

### 9) Props and style classes removed

Most of these were deprecated during v6. `disableClear`, `disableRevealPassword`, `disableSearchButton`, and `semantic` weren't, so it's worth searching for those directly.

| Component                     | Removed                                                        | Replacement                                                         |
| ----------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------- |
| `HvInput`, `HvSearchInput`    | `disableClear`, `disableRevealPassword`, `disableSearchButton` | `hideClear`, `hideRevealPassword`, `hideSearchButton`               |
| `HvBannerContent`             | `content`                                                      | `children`                                                          |
| `HvSlider`                    | `onBeforeChange`, `onAfterChange`                              | `onChange`                                                          |
| `HvOverflowTooltip`           | `tooltipsProps`                                                | pass tooltip props directly                                         |
| `HvTableHeader`               | `classes.sortableHeaderText`                                   | target `.HvTableHeader-headerText` within `.HvTableHeader-sortable` |
| `HvTableHeader`               | `classes.sortIcon`                                             | `classes.sortButton`                                                |
| `HvBulkActions`               | `semantic`, `classes.semantic`                                 | removed — action buttons are always `secondaryGhost`                |
| `HvBreadCrumb`                | `classes.a`, and the `HvBreadCrumbPage` class namespace        | `classes.link`, or `classes.currentPage`                            |
| `HvBreadCrumb`                | `classes.centerContainer`, `classes.separatorContainer`        | target `.HvPathElement-centerContainer` / `-separatorContainer`     |
| `HvCanvasSidePanel` (widgets) | `classes.handleOpen`, `classes.handleClose`                    | `classes.handle` with `[aria-expanded]`                             |

```diff
-<HvInput disableClear disableSearchButton />
+<HvInput hideClear hideSearchButton />
```

### 10) Internal base primitives migrated

Core and widgets internals migrated from `@mui/base` to `@base-ui/react`.

For most consumers this is transparent, but it can affect:

- custom style overrides that target internal DOM/class structure
- test selectors coupled to internal markup

It's worth revalidating any deep customization around `Select`, tabs/canvas panels, and dropdown-like controls.

### 11) Grid implementation update

`HvGrid` now wraps `@mui/material/Grid` instead of `@mui/material/GridLegacy`. The `item` prop and the per-breakpoint props `xs`, `sm`, `md`, `lg`, `xl` were removed — sizing goes through `size`.

```diff
-<HvGrid item xs={12} sm={6} />
+<HvGrid size={{ xs: 12, sm: 6 }} />
```

`zeroMinWidth` was also removed; use `style={{ minWidth: 0 }}`.

`spacing`, `rowSpacing`, `columnSpacing`, and `columns` are unchanged, but the underlying layout implementation differs — worth a visual check on nested or complex grids.

### 12) CLI templates removed

Template scaffolding has been retired from `@pentaho/uikit-cli`. The `create` command now uses a single baseline and no longer takes `--templates`.

```diff
-npx @pentaho/uikit-cli@latest create MyAppName --templates Form
+npx @pentaho/uikit-cli@latest create MyAppName
```

## Validation checklist

- No `@hitachivantara/*` imports remain.
- No `@hitachivantara/uikit-react-pentaho`, `uikit-react-lab`, or `uikit-react-icons` dependencies remain.
- No references to `themes.next`, `next`, or `pentahoPlus` remain.
- No imports remain for removed core or `lab` components listed above.
- No usage remains of the removed props and classes listed above.
- No references remain to removed v5 compatibility color tokens.
