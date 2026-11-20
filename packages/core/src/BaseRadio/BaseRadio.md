---
component: HvBaseRadio
status: prefer-alternative
related: [HvRadio, HvRadioGroup]
---

# HvBaseRadio

The bare radio circle, without label or validation, for a custom control; otherwise use HvRadio inside HvRadioGroup.

## When to use

- Prefer HvRadioGroup: a single choice is normally an HvRadioGroup of HvRadio options. Only for a custom control, named through `inputProps`.

## Spec

- A circle (`radii.full`) as in HvRadio inside a square hover target (`bgHover`).

## Don't

- Don't build a custom radio list from it: HvRadioGroup or HvSelectionList already handle names, state and arrow keys.
