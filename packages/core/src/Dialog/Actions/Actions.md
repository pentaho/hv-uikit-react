---
component: HvDialogActions
status: stable
related: [HvDialog, HvDialogContent, HvButton]
---

# HvDialogActions

Part of HvDialog (and HvDrawer): the row of buttons that ends it.

## When to use

- The last child of a dialog that asks for a decision.

## What the consumer provides

- HvButton children: Cancel (`secondaryGhost`) first, then the `primary` decision ("Delete asset"); a destructive decision uses `negative`.

## Spec

- Right-aligned, padding `space.sm`, buttons `space.xs` apart; pinned to the bottom in a full-screen dialog.

## Don't

- Don't put more than three buttons in it, or more than one `primary`.
