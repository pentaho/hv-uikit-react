---
component: HvTab
status: stable
related: [HvTabs, HvBadge]
---

# HvTab

Part of HvTabs: one tab in the tab list.

## When to use

- One per view inside HvTabs.

## What the consumer provides

- `value`: HvTabs' `value` / `onChange` use the tab's index unless you give each HvTab a `value`.
- A count next to the label: wrap the label in HvBadge with `showCount`.
