---
component: HvIconButton
status: stable
related: [HvButton, HvToggleButton, HvTooltip, HvDropDownMenu]
rules: [uikit/raw-elements, uikit/icon-button-label]
---

# HvIconButton

A button with only an icon, with a tooltip that also names it for assistive technology.

## When to use

- Compact repeated actions: edit or delete in a table row, refresh or settings in a toolbar or card header.
- When the icon is universally understood; otherwise use HvButton with a text label.
- An on/off state on one icon: HvToggleButton. A menu of more actions: HvDropDownMenu.

## What the consumer provides

- `title`: what it does, in sentence case ("Delete asset"); it is the tooltip and the `aria-label`.
- The Phosphor icon as `children`.
- `size`: without it the button is only as large as its icon, so set it for a consistent square.

## Spec

- HvButton in icon mode inside an HvTooltip: square, `radii.full`, no padding; hover `primaryDimmed` (keyboard focus `bgHover`), pressed `primarySubtle`, disabled `textDisabled`.
- Disabled stays focusable, so its tooltip can still be read.

## Don't

- Don't leave an icon button without `title`: the title is its accessible name and tooltip (`uikit/icon-button-label`).
- Don't put a rare or ambiguous action behind an icon only.
