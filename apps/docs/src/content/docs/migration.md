# Migration to v7

UI Kit v7 is a **major release** focused on tighter integration with the Pentaho UI, and AI tools.

This guide focuses on migrating from `v6` to `v7`.

## Suggested migration sequence

1. Update all package dependencies from `@hitachivantara/*` to `@pentaho/*`.
2. Rename `uikit-react-pentaho` usage to `uikit-react-widgets`.
3. Remove any direct usage of `uikit-react-lab`.
4. Remove `next` theme usage and replace `pentahoPlus` checks.
5. Replace removed core components (`HvCarousel`, `HvStack`, etc.).
6. Re-run visual and interaction tests for components with deep customization.

## Breaking changes

### 1) Package scope renamed

All public packages moved from `@hitachivantara/*` to `@pentaho/*`.

Update every import and dependency entry.

```diff
-import { HvButton } from "@hitachivantara/uikit-react-core";
+import { HvButton } from "@pentaho/uikit-react-core";
```

### 2) Widgets package rename + lab package removal

- `@hitachivantara/uikit-react-pentaho` was renamed to `@pentaho/uikit-react-widgets`.
- `@hitachivantara/uikit-react-lab` was removed.

If you were importing from `lab`, migrate to stable APIs where available or to `widgets` when functionality moved there.

```diff
-import { HvDashboard } from "@hitachivantara/uikit-react-pentaho";
+import { HvDashboard } from "@pentaho/uikit-react-widgets";
```

### 2.1) Complete package mapping (v6 -> v7)

The table below includes all packages that existed in `v6.10.0`, their v7 names, and current status.

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
| `@hitachivantara/uikit-react-shared`      | `@pentaho/uikit-react-shared`      | Renamed, public      |
| `@hitachivantara/uikit-react-utils`       | `@pentaho/uikit-react-utils`       | Renamed, public      |
| `@hitachivantara/uikit-react-viz`         | `@pentaho/uikit-react-viz`         | Renamed, public      |
| `@hitachivantara/uikit-styles`            | `@pentaho/uikit-styles`            | Renamed, public      |
| `@hitachivantara/uikit-uno-preset`        | `@pentaho/uikit-uno-preset`        | Renamed, public      |

### 3) NEXT theme removed

The NEXT theme is no longer exported.

- Removed export: `next`
- Removed bundle entry: `themes.next`

Also, the Pentaho theme identifier was renamed:

- `pentahoPlus` -> `pentaho`

```diff
-import next from "./themes/next";
 import pentaho from "./themes/pentaho";

-export { next, pentaho };
-export const themes = { next, pentaho };
+export { pentaho };
+export const themes = { pentaho };
```

### 4) Deprecated core components removed

The following components were removed from `@pentaho/uikit-react-core`:

- `HvCarousel`
- `HvControls`
- `HvLogin`
- `HvScrollToHorizontal`
- `HvScrollToVertical`
- `HvSimpleGrid`
- `HvStack`

Remove those imports and replace with alternatives in your application code.

Recommended alternatives:

- `HvCarousel`: use a minimal CSS carousel with horizontal scrolling and snap points (for example `overflow-x-scroll snap-x snap-mandatory`), or adopt [Embla Carousel](https://www.embla-carousel.com/).
- `HvControls`: this was a widget/template-style component; copy/adapt the source from your `v6.x` codebase where needed.
- `HvLogin`: this was a minimal template; use the [Login examples](https://pentaho.github.io/uikit-docs/v6.x/examples/login) as a starting point.
- `HvScrollToHorizontal` and `HvScrollToVertical`: use `HvListContainer` + `HvListItem` with `component="a"` and `href="#your-section"`, plus CSS smooth scrolling via [`scroll-behavior`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-behavior).
- `HvSimpleGrid`: replace with utility-grid layouts such as `grid grid-cols-2 md:grid-cols-4`.
- `HvStack`: replace with flex layouts such as `flex gap-sm` (row/column as needed).

```diff
-export * from "./Carousel";
-export * from "./Controls";
-export * from "./Login";
-export * from "./ScrollToHorizontal";
-export * from "./ScrollToVertical";
-export * from "./SimpleGrid";
-export * from "./Stack";
```

### 5) Internal base primitives migrated

Core and widgets internals migrated from `@mui/base` to `@base-ui/react`.

For most consumers this is transparent, but it can affect:

- custom style overrides that target internal DOM/class structure
- test selectors coupled to internal markup

Revalidate any deep customization around `Select`, tabs/canvas panels, and dropdown-like controls.

### 6) Grid implementation update

`HvGrid` migrated from legacy MUI Grid APIs to current MUI Grid APIs.

If you rely on grid internals or legacy behavior, verify layout parity (especially spacing and breakpoint behavior).

```diff
-import MuiGrid, { type GridLegacyProps as MuiGridProps } from "@mui/material/GridLegacy";
+import MuiGrid, { type GridProps as MuiGridProps } from "@mui/material/Grid";

-<HvGrid item xs={12} sm={6} />
+<HvGrid size={{ xs: 12, sm: 6 }} />
```

## Validation checklist

- No `@hitachivantara/*` imports remain.
- No `@hitachivantara/uikit-react-pentaho` or `@hitachivantara/uikit-react-lab` dependencies remain.
- No references to `themes.next`, `next`, or `pentahoPlus` remain.
- No imports remain for removed components listed above.
