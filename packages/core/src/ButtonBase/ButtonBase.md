---
component: HvButtonBase
status: prefer-alternative
related: [HvButton, HvIconButton]
---

# HvButtonBase

The unstyled clickable primitive under the UI Kit's buttons, for a clickable element with its own look.

## When to use

- Every ordinary action is HvButton, HvIconButton, HvToggleButton or HvDropDownMenu.
- Only a clickable area that isn't a button visually (a custom tile or row).

## Spec

- No padding, inherited text, `radii.base`; hover `primaryDimmed`, pressed `primarySubtle`; disabled `textDisabled`; keyboard focus ring.
- `type="button"` by default. When `disabled` it sets `aria-disabled`, drops `onClick` and leaves the tab order unless `focusableWhenDisabled`; `selected` sets `aria-pressed`.

## Don't

- Don't build a custom-looking button on it: the variants of HvButton already cover the product's actions.
