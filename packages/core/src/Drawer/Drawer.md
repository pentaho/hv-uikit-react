---
component: HvDrawer
status: stable
related: [HvDialog, HvDialogTitle, HvDialogContent, HvDialogActions, HvPanel]
rules: [uikit/raw-elements, uikit/no-inline-style]
---

# HvDrawer

A panel that slides in from the edge of the screen for details or edits, keeping the page in view.

## When to use

- The details of a selected row or card, a filter panel, or an edit form longer than a dialog should hold.
- A decision that blocks the page: HvDialog. Content that is always visible: a region of the page (HvSection, HvPanel).
- In a Pentaho plugin, a row's details and edits open in HvDialog instead, unless the approved design shows a drawer.

## What the consumer provides

- `open` + `onClose(event, reason)`: you own the state. With `onClose` it gets a close button (named by `buttonTitle`) and closes on Escape and backdrop click.
- Content: HvDialogTitle, HvDialogContent and, for edits, HvDialogActions (Cancel, then the primary action).
- `PaperProps={{ component: "aside", className: <a class with the width (left, right) or height (top, bottom): `w-1/3`, or `css()`>, "aria-labelledby": <the title's id> }}`: the panel has no size or name of its own.
- `disableBackdropClick` keeps it open on outside clicks (Escape still closes).
- A side panel that pushes the page instead of covering it: `variant="persistent"` with `ModalProps={{ keepMounted: true }}`; size the page content from `open` yourself.

## Spec

- `bgContainer` paper with `shadow`, scrolling when content overflows, no padding of its own (its children pad themselves).
- `bgOverlay` backdrop; close button at the top-right, inset `space.sm`.

## Don't

- Don't hand-make a fixed side panel or overlay.
- Don't set a width with `style` or a raw number: size the paper with a class (`w-1/3`) or `css()` (a percentage or a width built from `theme.space`).
- Don't open a drawer with no title, or nest drawers.
