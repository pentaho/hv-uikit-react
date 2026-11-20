---
component: HvVerticalNavigationAction
status: stable
related: [HvVerticalNavigationActions, HvVerticalNavigation, HvButton]
---

# HvVerticalNavigationAction

One action at the bottom of an HvVerticalNavigation, a label with an icon that shrinks to the icon when collapsed.

## When to use

- Inside HvVerticalNavigationActions, for app-level actions (Settings, Help, Collapse menu).

## What the consumer provides

- `label` always: the visible text when open, the `aria-label` when collapsed.
- `icon` on a rail that collapses with `useIcons`: collapsed, it is the only thing shown.

## Spec

- A full-width `secondaryGhost` HvButton, `radii.round`, side padding `space.xs`, inheriting the rail's text color.
