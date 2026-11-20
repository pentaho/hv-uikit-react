---
component: HvIconContainer
status: stable
related: [HvIcon, HvIconButton, HvStatusIcon]
rules: [uikit/no-hardcoded-values, uikit/no-raw-graphics]
---

# HvIconContainer

A wrapper that sizes and colors a Phosphor icon with the theme's icon sizes and color names.

## When to use

- A Phosphor icon that needs a theme size or a status color: a leading icon in a card title, an icon in an empty slot, a colored state icon next to text.
- Icons inside components (`startIcon`, `icon` props) usually need no wrapper. A status with its standard symbol: HvStatusIcon. A clickable icon: HvIconButton.

## What the consumer provides

- One icon child from `@phosphor-icons/react`.
- `size`: keep to the named sizes, not a number. `color`: a theme color name; without it the icon inherits the text color.

## Spec

- An inline box that centers the icon and scales it with `size`, with a little padding from `sm` up.

## Don't

- Don't set icon sizes in pixels or hex colors: use `size` and a token name for `color` (`uikit/no-hardcoded-values`).
- Don't leave a meaningful icon with no text or name: add words next to it, or `aria-label` with `role="img"`.
