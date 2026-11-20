---
component: HvPanel
status: stable
related: [HvSection, HvCard, HvDrawer, HvDropdown, HvFilterGroup]
rules: [uikit/no-inline-style]
---

# HvPanel

A plain padded surface that scrolls its content, the base of dropdown lists, filter panels and detail areas.

## When to use

- A bounded area inside a popover, a side region or a toolbar where content may overflow (it scrolls).
- A titled region of a page: HvSection. One item or summary: HvCard. A sliding side panel: HvDrawer.

## What the consumer provides

- A height or max-height through a class (`max-h-80`) or `css()` when it should scroll.
- `tabIndex={0}` and an `aria-label` when it scrolls, so keyboard users can reach the overflow.

## Spec

- `bgContainer` fill, `space.sm` padding, inherits its parent's corner radius; no border or shadow of its own.

## Don't

- Don't nest panels to make borders or spacing: use token spacing classes (`p-md`) or `css()` on one container.
