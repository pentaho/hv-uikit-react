---
component: HvBaseSwitch
status: prefer-alternative
related: [HvSwitch]
---

# HvBaseSwitch

The bare switch track and thumb, without label or validation, for a custom layout; otherwise use HvSwitch.

## When to use

- A custom switch layout (e.g. Off / On text either side): pair it with HvLabel via `id` / `htmlFor` and `aria-describedby`, so the switch keeps its name and description. Otherwise HvSwitch covers labeled and `aria-label`led switches, including in table cells.

## What the consumer provides

- An accessible name: in `inputProps` or from an associated HvLabel.

## Spec

- The input has `role="switch"`; `readOnly` blocks `onChange` and the hover halo.
- As HvSwitch: `textDimmed` track off, `positive` on, `radii.full`, `bgHover` halo.

## Don't

- Don't use it to drop the label: HvSwitch without `label` takes an `aria-label`.
