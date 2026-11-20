---
component: HvFocus
status: internal
related: [HvListContainer, HvTreeView]
---

# HvFocus

An old keyboard-focus helper, deprecated and kept only for the components that still use it inside; it has navigation issues.

## When to use

- Not in projects. Keyboard navigation comes with the components (lists, menus, tree views); for a custom widget, use native focusable elements and a roving `tabIndex`.
