---
component: HvColorPicker
status: stable
related: [HvBaseDropdown, HvFormElement]
rules: [uikit/no-hardcoded-values]
---

# HvColorPicker

A field that opens a color picker with recommended, saved and custom colors.

## When to use

- People choosing a color as data: a category color, a chart series color in a settings panel.
- Styling the project itself: never; colors come from the theme by name.

## What the consumer provides

- `label`.
- `value` + `onChange(color)` (every change while picking) or `onChangeComplete(color)` (the throttled final value).
- Saved colors: `savedColorsValue` with `onSavedColorAdded` / `onSavedColorRemoved`; translate the add/delete button names with their `…AriaLabel` props.
- `iconOnly` (a compact swatch button) still needs `aria-label` or a `label`.

## Spec

- The dropdown field (`textDimmed` outline, `primary` on hover) showing a swatch and the value; panel sections spaced `space.md`.
- Opening the panel moves focus to the first input inside it.

## Don't

- Don't write color values in project code (defaults, recommended lists): read them from the app's data or leave the component's defaults.
- Don't pass color names or tokens as `value`: it must be HEX, since the swatch uses it directly.
- Don't leave a picker without `label` or `aria-label`.
