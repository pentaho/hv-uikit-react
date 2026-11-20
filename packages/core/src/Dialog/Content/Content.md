---
component: HvDialogContent
status: stable
related: [HvDialog, HvDialogTitle, HvDialogActions, HvDrawer]
---

# HvDialogContent

Part of HvDialog (and HvDrawer): the scrolling body between the title and the actions.

## When to use

- The message or short form of every dialog and drawer.

## What the consumer provides

- `indentContent` when the title has a status icon, so the text aligns with the title.

## Spec

- String children render as HvTypography `body`.
- Padding `space.sm` on the sides and bottom, none on top; `borderSubtle` dividers appear only when the content scrolls (`dividers` forces them).
