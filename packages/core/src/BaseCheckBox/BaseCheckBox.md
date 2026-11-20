---
component: HvBaseCheckBox
status: prefer-alternative
related: [HvCheckBox, HvCheckBoxGroup]
---

# HvBaseCheckBox

The bare check box, without label or validation, for a custom control; otherwise use HvCheckBox.

## When to use

- Prefer HvCheckBox, which covers labeled, unlabeled (with `aria-label`) and table-row checkboxes.
- Only for a custom control HvCheckBox can't express: name it through `inputProps` (a top-level `aria-label` lands on the root, not the input).

## Spec

- A square target the height of a default (`md`) button, `radii.base`, `bgHover` on hover; the box itself as in HvCheckBox.
