---
component: HvRadio
status: stable
related: [HvRadioGroup, HvCheckBox]
rules: [uikit/raw-elements]
---

# HvRadio

Part of HvRadioGroup: one option of a single choice.

## When to use

- Always inside HvRadioGroup, one per option; React may not track `checked` reliably outside a group.
- A single yes/no: HvCheckBox or HvSwitch instead.

## What the consumer provides

- `label`, and a `value` unique within the group (it defaults to `"on"`).
- `color`: a token name, never a hex.
- Leave `checked`, `name`, `onChange`, `required`, `readOnly` and `status` to the group.

## Spec

- A circle (`radii.full`) with a `borderStrong` outline on `bgContainer`; checked fills `primary` with a `bgContainer` dot.
- Label in `body`, `space.xs` from the circle; row hover `bgHover`; disabled `bgDisabled` with `textDisabled`.

## Don't

- Don't place radios outside a group, or make a group of one.
- Don't leave an option without `label` (or `aria-label`).
