---
name: uikit-design
description: "Guidelines for building UI pages and components with the UI Kit React library. Use when creating pages, layouts, or components; choosing which UI Kit component to use; applying layout with UnoCSS utilities; or reviewing code for UI Kit conventions. Trigger phrases: ui kit, uikit, HvButton, HvTable, build a page, create a component."
argument-hint: "Describe the page or paste an image or URL of the design"
---

# UI Kit Design Guidelines

## Core Principles

1. **Reach for UI Kit first.** Every standard widget (button, table, dialog) has an `Hv*` counterpart. Custom wrappers encapsulate _application logic_, never styling.
2. **UnoCSS for layout.** Use utility classes (`flex`, `grid`, `gap-sm`, `p-md`, `w-full`) for spacing, sizing and layout, not inline `style` or custom CSS.

```tsx
import { Plus } from "@phosphor-icons/react"; // icons come from Phosphor
import { HvButton, HvCard, HvContainer } from "@pentaho/uikit-react-core";
```

## Procedure

### 1. Identify required components

Look for the closest match in:

- `npx --no-install uikit-tools components` and `npx --no-install uikit-tools info <Component>` (when the app has `@pentaho/uikit-tools`): when to use each component, its props, and its declaration file, `node_modules/@pentaho/uikit-react-core/dist/<Component>/<Component>.d.ts`
- type declarations in `node_modules`
- the [component catalog](https://pentaho.github.io/uikit-docs/master/components) and [examples](https://pentaho.github.io/uikit-docs/master/examples)

### 2. Build layout with UnoCSS utilities

```tsx
// Vertical stack with spacing
<div className="flex flex-col gap-md">...</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-3 gap-sm">...</div>

// Page content centered and capped at a breakpoint, with the built-in gutters
<HvContainer maxWidth="lg">...</HvContainer>
```

Spacing tokens: `xxs` `xs` `sm` `md` `lg` `xl` (4, 8, 16, 24, 48 and 80px). Spacing classes (`gap-*`, `p-*`) use them; width classes such as `max-w-*` use the page breakpoints (`lg` is 1270px). See the [UnoCSS preset docs](https://pentaho.github.io/uikit-docs/master/docs/guides/unocss).

### 3. Compose components

- `HvTypography` for all text, with the correct `variant`.
- `HvButton` with the correct `variant` (`primary` once per view, `secondarySubtle`, `secondaryGhost`), `HvIconButton` with a `title` for icon-only actions.
- [`HvTable`](https://pentaho.github.io/uikit-docs/master/components/table) for data display.
- `HvSnackbar` / `HvBanner` for feedback, not custom toasts.
- `HvDialog` for dialogs.
- The [form components](https://pentaho.github.io/uikit-docs/master/components/form-element#related-components) for forms.

### 4. Theme tokens in rare custom styles

When utilities are insufficient, use `css()` with `theme` from `@pentaho/uikit-react-core`. Inline `style` is only for values computed at run time:

```tsx
style={{ color: theme.colors[dynamicThemeColor] }}
```

## Common Patterns

### Layout header + content

```tsx
<div className="flex flex-col gap-md p-md">
  <div className="flex items-center justify-between">
    <HvTypography variant="title2" component="h1">
      Page title
    </HvTypography>
    <HvButton startIcon={<Plus />}>Add item</HvButton>
  </div>
  {/* content */}
</div>
```

### Card grid

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-sm">
  {items.map((item) => (
    <HvCard key={item.id} bgcolor="bgContainer">
      <HvCardHeader title={item.name} />
      <HvCardContent>
        <HvTypography>{item.description}</HvTypography>
      </HvCardContent>
    </HvCard>
  ))}
</div>
```

### Form layout

```tsx
<form className="flex flex-col gap-sm max-w-md">
  <HvInput name="name" label="Name" required />
  <HvSelect name="status" label="Status" options={statusOptions} />
  <div className="flex justify-end gap-xs">
    <HvButton variant="secondaryGhost">Cancel</HvButton>
    <HvButton type="submit">Save</HvButton>
  </div>
</form>
```
