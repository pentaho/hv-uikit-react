---
component: HvTooltip
status: stable
related: [HvIconButton, HvOverflowTooltip, HvButton]
---

# HvTooltip

A short hint shown on hover, focus or tap, which also names the element it describes.

## When to use

- Explaining an icon, an abbreviation or a disabled control's reason in a few words.
- Icon-only buttons: HvIconButton with `title`, which adds the tooltip for you. Text cut off by its column: HvOverflowTooltip.
- Content people need to read or act on (links, forms, long help): HvDrawer, HvDialog or text on the page.

## What the consumer provides

- `title`: a short sentence-case string (it becomes the child's accessible name; pass `describeChild` when the child already has a name and the tooltip adds detail).
- One focusable child element that accepts a ref: an HvButton, HvIconButton, HvTypography with `tabIndex={0}`, or a link.
- An empty `title` hides the tooltip.
- `disableFocusListener` and `disableHoverListener` switch off one trigger; keep focus on, or keyboard users never see it.

## Spec

- `body` text on `bgContainer` with a soft elevation shadow, `space.xs` by `space.sm` padding, `radii.round` corners; it fits its content up to a maximum width.
- Shows after a short delay, hides on Escape and when focus or the pointer leaves.

## Don't

- Don't put essential information only in a tooltip: touch and keyboard users may never see it.
- Don't put interactive content inside it (buttons, links).
- Don't put a tooltip on a disabled HvButton without `focusableWhenDisabled`, or on a non-focusable element: the child must be focusable and forward its ref and props (wrap a component that doesn't in a `span` with `tabIndex={0}`).
