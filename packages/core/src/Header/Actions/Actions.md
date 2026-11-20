---
component: HvHeaderActions
status: stable
related: [HvHeader, HvIconButton, HvBadge, HvAppSwitcher]
---

# HvHeaderActions

The right-aligned group of global actions in an HvHeader: notifications, help, user, app switcher.

## When to use

- As the last child of HvHeader. Page actions belong in HvGlobalActions, not here.

## What the consumer provides

- Children: HvIconButton with a `title` each (an HvBadge inside for unread counts), or a small HvButton.

## Spec

- A row pushed to the end of the bar, gap `space.xs`, no background of its own.
