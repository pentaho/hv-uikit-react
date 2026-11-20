---
component: HvToggleButton
status: stable
related: [HvIconButton, HvSwitch, HvCheckBox, HvMultiButton]
---

# HvToggleButton

An icon button that flips between two opposing states, such as pinned and unpinned.

## When to use

- Two opposing states on one well-known icon (lock / unlock, show / hide, favorite) where on/off wording doesn't fit.
- A setting that applies immediately with a label: HvSwitch. A form choice: HvCheckBox. One of several views: HvMultiButton.

## What the consumer provides

- `notSelectedIcon` and `selectedIcon`, or `children` (the icons are then ignored: swap the child yourself).
- `selected` + `onClick(event, selected)`, or `defaultSelected`.

## Spec

- HvButton in icon mode (`secondaryGhost`, `radii.full`) with `aria-pressed` from the state; hover `bgHover`, disabled `textDisabled`.

## Don't

- Don't use an unfamiliar icon pair: use a checkbox with a label instead.
- Don't leave it without an accessible name: wrap it in HvTooltip whose `title` names the action, or give it an `aria-label`.
