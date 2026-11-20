---
component: HvLabel
status: stable
related: [HvFormElement, HvInfoMessage, HvWarningText]
rules: [uikit/raw-elements]
---

# HvLabel

Part of HvFormElement: the visible label of a form control, with the required mark.

## When to use

- Labeling a custom control inside HvFormElement; the kit's fields render it from their `label` prop.
- A section heading above several fields: HvTypography with a title variant, not a label.

## What the consumer provides

- `htmlFor` (the control's id); `required` and `disabled` follow HvFormElement when not passed.

## Spec

- `label` type style at normal weight; the required asterisk in `negative`, hidden from screen readers (the control carries `required`); `textDisabled` when disabled; gap `space.xxs` to its child.

## Don't

- Don't leave a label unbound to its control: pass `htmlFor` (or nest the control as its child) so clicking it focuses the control.
