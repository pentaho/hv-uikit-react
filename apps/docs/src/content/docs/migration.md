# Migration Guide

UI Kit v6 is a **major cleanup release** focused on removing deprecated APIs, simplifying theming, modernizing tokens, and improving the overall developer experience. This guide outlines what changed and how to migrate smoothly.

## Table of Contents

- [What's New in v6](#whats-new-in-v6)
- [Installation & Dependencies](#installation--dependencies)
- [Breaking Changes & Migration Steps](#breaking-changes--migration-steps)
- [Migration Checklist](#migration-checklist)
- [Getting Help](#getting-help)

## What's New in v6

- Updated dependencies: **React 18+** and **MUI v7**
- Theme updates: **DS3 removed**, `pentahoPlus` → `pentaho`, `ds5` → `next`
- `HvProvider` simplified: single **`theme`** required, only **light/dark** modes
- Removed deprecated components, props, and CSS classes
- Updated component specs and modernized theme tokens
- Streamlined TypeScript types with improved DX

## Installation & Dependencies

### Peer Dependencies

Make sure your app meets the following minimum versions before upgrading to UI Kit v6:

**Updated requirements:**

- `@mui/material: ^7.0.2` (upgraded from v5.x)
- `react: >=18.0.0` (upgraded from v17.x)
- `react-dom: >=18.0.0`

**Unchanged:**

- `@emotion/react: ^11.11.1`
- `@emotion/styled: ^11.11.0`

## Breaking Changes & Migration Steps

This section lists breaking changes introduced in v6 and how to migrate.

### 1. Theme System Changes

The theme system has been simplified to reduce complexity and align with modern usage patterns and supported design systems naming.

#### HvProvider API Changes

- `theme` prop is now **required**.
- `themes` and `selectedTheme` props were **removed** (multi-theme support must now be handled **by your application**, not by `HvProvider`).
- `colorMode` only supports **`light`** and **`dark`** (legacy color modes **`dawn`** and **`wicked`** have been removed).

#### Themes & Color Modes

- `pentahoPlus` → **`pentaho`** (renamed for clarity aligned with Pentaho Design System).
- `ds5` → **`next`** (renamed for clarity aligned with NEXT Design System).
- Only **`light`** and **`dark`** modes are supported.
  Use application logic (e.g., `prefers-color-scheme`, user preferences) to control mode switching.

```diff
<HvProvider
-  themes={[ds5, pentaho]}
-  selectedTheme="ds5"
-  colorMode="dawn"
+  theme={next}
+  colorMode="light"
>
```

#### DS3 Theme Removal

- The DS3 theme has been removed as it is no longer supported.
- You must migrate to `next` or `pentaho`.

```diff
- import { ds3 } from "@hitachivantara/uikit-react-core";
+ import { next } from "@hitachivantara/uikit-react-core";

- <HvProvider theme={ds3}>
+ <HvProvider theme={next}>
```

### 2. Component Changes

#### Removed Components

The following components have been removed. Use the suggested replacements:

| Component | Replacement                        |
| --------- | ---------------------------------- |
| `HvBox`   | native `div` + styling             |
| `HvKpi`   | `HvCard` + `HvTypography` patterns |
| `HvLink`  | `HvTypography` with link variant   |

#### Deprecated Props

The following props have been removed. Update your code with the suggested replacements:

**Common Patterns:**

- `actionsCallback` → `onAction` (ActionsGeneric, Banner, BannerContent, BulkActions, Snackbar, SnackbarContent)
- `category` → `variant` (ActionsGeneric, DropDownMenu)
- `selectAllLabel` → removed (BulkActions, CheckBoxGroup)
- `hasTooltips` → always enabled (Dropdown, List)

**Component-Specific Changes:**

| Component            | Removed Prop                  | Replacement                      |
| -------------------- | ----------------------------- | -------------------------------- |
| Badge                | `count`                       | use `label`                      |
| Badge                | `text`                        | use `children`                   |
| Badge                | `textVariant`                 | use `HvTypography` on `children` |
| Button               | `overrideIconColors`          | removed                          |
| Dialog               | `firstFocusable`              | use `autoFocus` on the element   |
| Drawer               | `showBackdrop`                | use `hideBackdrop`               |
| FileUploader         | `acceptedFiles`               | use `accept`                     |
| FileUploader         | `labels.dropzone`             | use `label`                      |
| Icons                | `viewbox`                     | use `size`                       |
| Icons                | `height`, `width`             | use `size`                       |
| Icons                | `inverted`, `semantic`        | use `color`                      |
| Input.labels         | `revealPasswordButtonLabel`   | removed                          |
| Pagination.labels    | `paginationFirstPageTitle`    | use `firstPage`                  |
| Pagination.labels    | `paginationPreviousPageTitle` | use `previousPage`               |
| Pagination.labels    | `paginationNextPageTitle`     | use `nextPage`                   |
| Pagination.labels    | `paginationLastPageTitle`     | use `lastPage`                   |
| QueryBuilder         | `query`                       | use `defaultValue`               |
| QueryBuilder Context | `selectLocation`              | removed                          |
| ScrollTo\*           | `scrollTo`                    | use `navigationMode`             |
| Suggestions          | `expanded`                    | use `open`                       |
| Tag                  | `deleteButtonAriaLabel`       | removed                          |
| Tooltip              | `useSingle`                   | removed (multiline supported)    |
| Typography           | `paragraph`                   | use `component="p"`              |

#### Deprecated CSS Classes

The following CSS classes have been removed. Use the suggested replacements or modern CSS selectors:

**Component-Specific Changes:**

| Component              | Removed Classes                                                                                        | Replacement                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| Avatar                 | `status`                                                                                               | `classes.container`                    |
| BannerContent          | `baseVariant`, `outContainer`                                                                          | `classes.root`                         |
| BannerContent          | `actionsInnerContainer`                                                                                | `classes.actionContainer`              |
| BaseDropdown           | `headerOpen*`, `panelOpened*`                                                                          | `[data-popper-placement]`              |
| BaseInput              | `inputRoot*`, `inputBorderContainer`                                                                   | `classes.*` or `::after`               |
| Dialog.Title           | `messageContainer`, `titleText`                                                                        | `classes.root`                         |
| DotPagination          | `radioRoot`                                                                                            | `classes.radio`                        |
| DropDownMenu           | `container`, `icon`                                                                                    | `classes.root`                         |
| FormElement.Adornment  | `icon`, `adornment*`                                                                                   | `classes.root`                         |
| GlobalActions          | `globalSectionArea`                                                                                    | `classes.global` wrapper               |
| GlobalActions          | `globalWrapperComplement`                                                                              | `classes.section` wrapper              |
| GlobalActions          | `sectionName`                                                                                          | `classes.name`                         |
| Header                 | `backgroundColor`                                                                                      | `classes.root`                         |
| InlineEditor           | `inputBorderContainer`                                                                                 | `classes.root::after`                  |
| Input                  | `inputExtension`                                                                                       | `classes.suggestionsContainer::before` |
| Input                  | `inputBorderContainer`                                                                                 | `::after`                              |
| ListContainer.ListItem | `withStartAdornment`                                                                                   | `:has($startAdornment)`                |
| ListContainer.ListItem | `withEndAdornment`                                                                                     | `:has($endAdornment)`                  |
| Loading                | `small*`, `regular*`                                                                                   | `data-size="small/regular"`            |
| Pagination             | `totalPagesTextContainer`                                                                              | removed                                |
| Pagination             | `pageSizeOptionsSelect`                                                                                | `classes.pageSizeRoot`                 |
| Pagination             | `pageSizeInput*`                                                                                       | `classes.pageJump`                     |
| Section                | `spaceTop`                                                                                             | `hasHeader`                            |
| Select                 | `panelOpened*`                                                                                         | `[data-popper-placement]`              |
| SnackbarContent        | `messageSpan`                                                                                          | `classes.message`                      |
| TableSection           | `spaceTop`                                                                                             | `hasHeader`                            |
| Tag                    | `chipRoot`                                                                                             | `root`                                 |
| Tag                    | `button`, `tagButton`, `focusVisible`, `disabledDeleteIcon`, `categoricalFocus`, `categoricalDisabled` | removed                                |
| TagsInput              | `listItemGutters`                                                                                      | removed                                |
| TagsInput              | `listItemRoot`                                                                                         | `chipRoot`                             |
| TagsInput              | `tagInputContainer*`, `tagInputRoot`                                                                   | `classes.input`                        |
| TagsInput              | `tagSelected`, `tagInputRootFocused`                                                                   | `:focus` or `:focus-visible`           |
| TagsInput              | `tagInputBorderContainer`                                                                              | `::after`                              |
| TagsInput              | `tagInputRootEmpty`                                                                                    | removed                                |
| Tooltip                | `tooltipMulti`, `title`, `value*`, `color`, `separator*`                                               | removed                                |

#### Deprecated TypeScript Types

The following TypeScript types have been updated or removed:

**Consolidated Types:**

- `HvAvatarSize`, `HvButtonSize` → `HvSize`
- `HvScrollToVerticalOption`, `HvScrollToHorizontalOption` → `HvScrollToOption`

**Renamed Types:**

- `HvButtonRadius` → `HvRadius`
- `HvDatePickerStatus` → `HvFormStatus`
- `HvDropdownLabelsProps` → `HvDropdownLabels`
- `HvTypographyLegacyVariants` → `HvTypographyVariants`
- `Spacing` (SimpleGrid) → `HvBreakpoints`

**Removed Types:**

- `HvQueryBuilderChangedQuery` → removed

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
