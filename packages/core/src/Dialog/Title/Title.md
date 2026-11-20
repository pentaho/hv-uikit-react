---
component: HvDialogTitle
status: stable
related: [HvDialog, HvDrawer, HvStatusIcon]
---

# HvDialogTitle

Part of HvDialog (and HvDrawer): the title row that names the dialog.

## When to use

- The first child of every HvDialog; also the heading of an HvDrawer panel.

## What the consumer provides

- The title in sentence case, saying what the decision is ("Delete 3 assets?"); a `variant` adds the matching HvStatusIcon.
- In an HvDialog it names the dialog automatically. In an HvDrawer, give it an `id` and point the panel's `aria-labelledby` at it.

## Spec

- `title4` text; padding `space.sm` with room on the right for the close button; icon gap `space.xs`.
