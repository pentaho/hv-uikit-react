# Migration to v6

UI Kit v6 is a **major release** focused on upgrading critical dependencies, cleaning up long-deprecated APIs, simplifying theming, and improving the overall developer experience. This guide outlines what changed and how to migrate smoothly.

## Main changes

- Updated dependencies: `react@18+` and `@mui/material@7`
- Theme changes: `ds3` removed, `pentahoPlus` → `pentaho`, `ds5` → `next`
- `HvProvider` simplified: single `theme` required, only `light`-`dark` modes
- Removed deprecated components, props, and `classes`

## Update dependencies

Ensure you're using React 18 or later

```sh
npm i react@18 react-dom@18
```

Update MUI to v7 and UI Kit to packages you depend on

```sh
npm i @mui/material@7 @hitachivantara/uikit-react-core@next
```

If you depend on other UI Kit packages or are using App Shell, it's best to update them all at once:

```sh
npm i @mui/material@7 @hitachivantara/uikit-react-{core,icons}@next @hitachivantara/uikit-uno-preset@next @hitachivantara/app-shell-vite-plugin@next
```

## Breaking Changes & Migration Steps

This section lists breaking changes introduced in v6 and how to migrate.

### 1. Theme System Changes

The theme system has been simplified to reduce complexity and align with modern usage patterns and supported design systems naming.

- The NEXT `ds3` theme has been removed as it is no longer supported, you must migrate to `next` or `pentaho`.
- `themes` and `selectedTheme` props were **removed** (multi-theme support must now be handled **by your application**, not by `HvProvider`).
- `colorMode` only supports `light` and `dark` (legacy color modes **`dawn`** and **`wicked`** have been removed).
- `pentahoPlus` → **`pentaho`** (renamed for clarity aligned with Pentaho Design System).
- `ds5` → **`next`** (renamed for clarity aligned with NEXT Design System).
- Only **`light`** and **`dark`** modes are supported.
  Use application logic (e.g., `prefers-color-scheme`, user preferences) to control mode switching.

```diff
-import { ds5, pentahoPlus } from "@hitachivantara/uikit-react-core";
+import { next, pentaho } from "@hitachivantara/uikit-react-core";


<HvProvider
-  themes={[ds5, pentaho]}
-  selectedTheme="ds5"
+  theme={next}

-  colorMode="dawn"
+  colorMode="light"
>
```

In `app-shell.config.ts`, update your `theming` configuration as well, if applicable:

```diff
{
- themes: ["ds5", "pentahoPlus"],
- theme: "pentahoPlus",
+ theme: "pentaho",

- colorMode: "dawn",
+ colorMode: "light",
}
```

### 2. Removed components

The following components have been removed. Use the suggested replacements:

- `HvBox` → native `div` or `span` with styling
- `HvKpi` → `HvCard` & `HvTypography` components
- `HvLink` → `HvTypography` with `link` and `component` props

```diff
- import { HvBox } from "@hitachivantara/uikit-react-core";

-<HvBox style={{}}>
+<div style={{}}>
```

```diff
import {
-  HvKpi,
+  HvCard,
+  HvTypography,
} from "@hitachivantara/uikit-react-core";

-<HvKpi labels={{ title: "Sales", indicator: "$1,000" }} />
+<HvCard>
+  <HvTypography variant="title2">Sales</HvTypography>
+  <HvTypography variant="caption1">$1,000</HvTypography>
+</HvCard>
```

```diff
import {
-  HvLink,
+ HvTypography,
} from "@hitachivantara/uikit-react-core";

-<HvLink route="https://example.com">Click here</HvLink>
+<HvTypography link component="a" href="https://example.com">Click here</HvTypography>
```

### 3. Removed component props

The following props have been removed. Update your code with the suggested replacements:

#### Common Patterns

The `HvActionsGeneric` utility component prop changes are reflected in several components:

- `actionsCallback` → `onAction` (also affects `HvBanner`, `HvBannerContent`, `HvBulkActions`, `HvSnackbar`, `HvSnackbarContent`)
- `category` → `variant` (also affects `HvDropDownMenu`)

````diff
<HvActionsGeneric
-  actionsCallback={handleAction}
+  onAction={handleAction}

-  category="primary"
+  variant="primary"
>
```

```diff
-<HvBanner actionsCallback={handleAction} />
+<HvBanner onAction={handleAction} />

-<HvBulkActions actionsCallback={handleAction} />
+<HvBulkActions onAction={handleAction} />

-<HvSnackbar actionsCallback={handleAction} />
+<HvSnackbar onAction={handleAction} />

-<HvDropDownMenu category="primary" />
+<HvDropDownMenu variant="primary" />
````

#### Icons

The following long-deprecated icons properties were removed in favor of the simpler `size` and `color` props:

- `viewbox` → use `size`
- `height`, `width` → use `size`
- `inverted`, `semantic` → use `color`

```diff
import { User } from "@hitachivantara/uikit-react-icons";

<User
-  viewbox={24}
-  height={32}
-  width={32}
+  size={32}

-  inverted
-  semantic="positive"
+  color="positive"
/>
```

#### Other Removed Props

| Component      | Removed Prop                         | Replacement                 |
| -------------- | ------------------------------------ | --------------------------- |
| HvBadge        | `count`                              | `label`                     |
| HvBadge        | `text`                               | `children`                  |
| HvBadge        | `textVariant`                        | `HvTypography` + `children` |
| HvButton       | `overrideIconColors`                 | —                           |
| HvDialog       | `firstFocusable`                     | `autoFocus` on the element  |
| HvDrawer       | `showBackdrop`                       | `hideBackdrop`              |
| HvDropdown     | `hasTooltips`                        | _always enabled_            |
| HvFileUploader | `acceptedFiles`                      | `accept`                    |
| HvFileUploader | `labels.dropzone`                    | `label`                     |
| HvInput        | `labels.revealPasswordButtonLabel`   | —                           |
| HvPagination   | `labels.paginationFirstPageTitle`    | `labels.firstPage`          |
| HvPagination   | `labels.paginationPreviousPageTitle` | `labels.previousPage`       |
| HvPagination   | `labels.paginationNextPageTitle`     | `labels.nextPage`           |
| HvPagination   | `labels.paginationLastPageTitle`     | `labels.lastPage`           |
| HvQueryBuilder | `query`                              | `defaultValue`              |
| HvScrollTo\*   | `scrollTo`                           | `navigationMode`            |
| HvSuggestions  | `expanded`                           | `open`                      |
| HvTag          | `deleteButtonAriaLabel`              | —                           |
| HvTooltip      | `useSingle`                          | —                           |
| HvTypography   | `paragraph`                          | `component="p"`             |

#### Removed CSS Classes

The following CSS classes have been removed. Use the suggested replacements or modern CSS selectors:

| Component         | Removed Classes                                      | Replacement                            |
| ----------------- | ---------------------------------------------------- | -------------------------------------- |
| HvAdornment       | `classes.icon`, `classes.adornment*`                 | `classes.root`                         |
| HvAvatar          | `classes.status`                                     | `classes.container`                    |
| HvBannerContent   | `classes.baseVariant`, `classes.outContainer`        | `classes.root`                         |
| HvBannerContent   | `classes.actionsInnerContainer`                      | `classes.actionContainer`              |
| HvBaseDropdown    | `classes.headerOpen*`, `classes.panelOpened*`        | `[data-popper-placement]`              |
| HvBaseInput       | `classes.inputRoot*`, `classes.inputBorderContainer` | `classes.root` or `::after`            |
| HvDialogTitle     | `classes.messageContainer`, `classes.titleText`      | `classes.root`                         |
| HvDotPagination   | `classes.radioRoot`                                  | `classes.radio`                        |
| HvDropDownMenu    | `classes.container`, `classes.icon`                  | `classes.root`                         |
| HvGlobalActions   | `classes.globalSectionArea`                          | `classes.global` wrapper               |
| HvGlobalActions   | `classes.globalWrapperComplement`                    | `classes.section` wrapper              |
| HvGlobalActions   | `classes.sectionName`                                | `classes.name`                         |
| HvHeader          | `classes.backgroundColor`                            | `classes.root`                         |
| HvInlineEditor    | `classes.inputBorderContainer`                       | `classes.root::after`                  |
| HvInput           | `classes.inputExtension`                             | `classes.suggestionsContainer::before` |
| HvListItem        | `classes.withStartAdornment`                         | `:has($startAdornment)`                |
| HvListItem        | `classes.withEndAdornment`                           | `:has($endAdornment)`                  |
| HvLoading         | `classes.small*`, `classes.regular*`                 | `[data-size=small/regular]`            |
| HvPagination      | `classes.totalPagesTextContainer`                    | —                                      |
| HvPagination      | `classes.pageSizeOptionsSelect`                      | `classes.pageSizeRoot`                 |
| HvPagination      | `classes.pageSizeInput*`                             | `classes.pageJump`                     |
| HvSection         | `classes.spaceTop`                                   | `classes.hasHeader`                    |
| HvSelect          | `classes.panelOpened*`                               | `[data-popper-placement]`              |
| HvSnackbarContent | `classes.messageSpan`                                | `classes.message`                      |
| HvTableSection    | `classes.spaceTop`                                   | `classes.hasHeader`                    |
| HvTag             | `classes.chipRoot`                                   | `classes.root`                         |
| HvTag             | `classes.button`, `classes.tagButton`                | `classes.deleteIcon`                   |
| HvTag             | `classes.disabledDeleteIcon`                         | `classes.deleteIcon:disabled`          |
| HvTag             | `classes.categorical*`, `classes.focusVisible`       | —                                      |
| HvTagsInput       | `classes.listItemGutters`                            | —                                      |
| HvTagsInput       | `classes.listItemRoot`                               | `classes.chipRoot`                     |
| HvTagsInput       | `classes.tagInputContainer*`, `classes.tagInputRoot` | `classes.input`                        |
| HvTagsInput       | `classes.tagSelected`, `classes.tagInputRootFocused` | `:focus` or `:focus-visible`           |
| HvTagsInput       | `classes.tagInputBorderContainer`                    | `::after`                              |
| HvTagsInput       | `classes.tagInputRootEmpty`                          | —                                      |
| HvTooltip         | `classes.title`, `classes.value*`, `classes.color`   | —                                      |
| HvTooltip         | `classes.tooltipMulti`,                              | `classes.tooltip`                      |
| HvTooltip         | `classes.separator*`                                 | —                                      |

#### Deprecated TypeScript Types

The following TypeScript types have been updated or removed:

```diff
import {
-  HvAvatarSize,
-  HvButtonSize,
+  HvSize,

-  HvScrollToVerticalOption,
-  HvScrollToHorizontalOption,
+  HvScrollToOption,

-  HvButtonRadius,
+  HvRadius,

-  HvDatePickerStatus,
+  HvFormStatus,

-  HvDropdownLabelsProps,
+  HvDropdownLabels,

-  HvTypographyLegacyVariants,
+  HvTypographyVariants,

-  Spacing,
+  HvBreakpoints,

-  HvQueryBuilderChangedQuery,
} from "@hitachivantara/uikit-react-core";
```

## Migration Checklist

Use this checklist to verify a complete and successful upgrade to v6:

- [ ] **UI matches expected design** — layout, spacing, colors, and typography look correct
- [ ] **Components work correctly** — dialogs, dropdowns, focus, and interactions work as expected
- [ ] **Accessibility checks pass** — focus management, roles, and contrast remain valid
- [ ] **No TypeScript errors** — no errors from removed props or updated types
- [ ] **No console warnings or errors** — no runtime warnings or deprecated API messages
- [ ] **Themes behave as expected** — light/dark mode switching works; `next` / `pentaho` tokens applied correctly
- [ ] **Styling updated** — replaced old CSS classes with updated ones or `data-*` attributes
- [ ] **Removed components replaced** — `HvBox`, `HvKpi`, `HvLink` fully migrated to supported alternatives

## Getting Help

### Resources

- **Component Docs:** https://pentaho.github.io/uikit-docs/master/
- **GitHub Issues:** https://github.com/pentaho/hv-uikit-react/issues
- **Support (Docs Section):** https://pentaho.github.io/uikit-docs/master/docs#support
