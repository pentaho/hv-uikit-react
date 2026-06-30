---
name: uikit-design
description: "Guidelines for building UI pages and components with the HV UI Kit React library. Use when creating pages, layouts, or components; choosing which UI Kit component to use; applying layout with UnoCSS utilities; or following design system conventions. Trigger phrases: ui kit, uikit, HvButton, HvTable, hv component, build a page, create a component."
argument-hint: "Describe the page or paste an image or URL of the design"
---

# UI Kit Design Guidelines

## When to Use

- Creating or editing React pages and components
- Deciding which UI Kit component maps to a UI need
- Laying out elements with the design system's spacing/grid
- Reviewing code for UI Kit best practices

## Core Principles

1. **Reach for UI Kit first.** Before writing custom UI, check the [component catalog](https://pentaho.github.io/uikit-docs/master/components). Every standard widget (button, table, dialogs) has an `Hv*` counterpart.
2. **UnoCSS for layout.** Use utility classes (`flex`, `grid`, `gap-sm`, `p-md`, `w-full`, etc.) from UnoCSS for spacing, sizing, and layout. Avoid inline `style` props or custom CSS for layout concerns. Design tokens (e.g. `gap-sm`, `p-md`) map to the DS spacing scale.
3. **Never recreate what exists.** If a pattern is in the docs, use it. Custom wrappers should only exist to encapsulate _application logic_, not styling.

## Package Imports

```tsx
import {
  HvButton,
  HvCard,
  HvContainer,
} from "@hitachivantara/uikit-react-core";
```

## Procedure

### 1. Identify required components

Browse the following locations for the closest match:

- type declarations in `node_modules`
- [components page](https://pentaho.github.io/uikit-docs/master/components)
- [examples page](https://pentaho.github.io/uikit-docs/master/examples)

### 2. Build layout with UnoCSS utilities

Prefer these patterns:

```tsx
// Vertical stack with spacing
<div className="flex flex-col gap-md">...</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-3 gap-sm">...</div>

// Page wrapper with max width
<div className="max-w-lg mx-auto px-md py-lg">...</div>
```

Design-system spacing tokens available as UnoCSS values: `xxs` `xs` `sm` `md` `lg` `xl`.
Note that while spacing classes, such as `gap-*` or `p-*`, use the spacing units (8px-based), layout classes such as `max-w-*` use the page breakpoint values (eg. lg => 1270px).

### 3. Compose components

Follow these rules:

- Use `HvTypography` for all non default/`body` text, using the correct `variant`.
- Use `HvButton` with the correct `variant`, or `HvButtonBase` for unstyled buttons.
- For data display, use the [`HvTable`](https://pentaho.github.io/uikit-docs/master/components/table) component.
- For user feedback, use `HvSnackbar` / `HvBanner` (not custom toasts).
- For dialogs, use `HvDialog`.
- For forms, use the correct [form components](https://pentaho.github.io/uikit-docs/master/components/form-element#related-components).

### 4. Apply theme tokens in rare custom styles

When UnoCSS utilities are insufficient, inline `style` is fine, such as dynamic values:

```tsx
import { theme } from "@hitachivantara/uikit-react-core";

style={{ color: theme.colors[dynamicThemeColor] }}
```

## Common Patterns

### Layout header + content

```tsx
<div className="flex flex-col gap-md p-md">
  <div className="flex items-center justify-between">
    <HvTypography variant="title2">Page Title</HvTypography>
    <HvButton startIcon={<Add />}>Add Item</HvButton>
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
      <HvCardContent>{item.description}</HvCardContent>
    </HvCard>
  ))}
</div>
```

### Form layout

```tsx
<form className="flex flex-col gap-sm max-w-md">
  <HvInput name="name" label="Name" required />
  <HvSelect name="status" label="Status" options={[]} />
  <HvActionBar className="flex gap-xs justify-end">
    <HvButton variant="secondaryGhost">Cancel</HvButton>
    <HvButton type="submit">Save</HvButton>
  </HvActionBar>
</form>
```

## Resources

- [Component catalog](https://pentaho.github.io/uikit-docs/master/components)
- [Design examples](https://pentaho.github.io/uikit-docs/master/examples)
- [UnoCSS preset docs](https://pentaho.github.io/uikit-docs/master/docs/guides/unocss)
