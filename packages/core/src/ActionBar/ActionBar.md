---
component: HvActionBar
status: stable
related: [HvCard, HvDialogActions, HvButton]
---

# HvActionBar

A footer strip that holds the actions for a card, panel or task, aligned to the end.

## When to use

- The actions at the bottom of an HvCard or a panel (Cancel, Save).
- Dialog actions: HvDialogActions instead.

## What the consumer provides

- To pin an action to the start, add a flexible, `aria-hidden` spacer element before the end actions.

## Spec

- Full width, `space.sm` padding, `borderSubtle` top divider; items right-aligned and vertically centered. It adds no gap between items: give it `space.xs` gaps through `className`.

## Don't

- Don't put more than one primary button in it; order secondary first, primary last.
- Don't put anything but actions in it (at most a help icon or a start-aligned secondary action such as Reset).
