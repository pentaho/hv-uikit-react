---
component: HvOptionGroup
status: stable
related: [HvSelect, HvOption]
---

# HvOptionGroup

Part of HvSelect: a labeled group of HvOption items in its list.

## When to use

- Grouping a select's options under headings (Regions, then countries).
- Groups work only with HvOption children, not with HvSelect's `options` prop.
- Options with no natural category need no groups.

## What the consumer provides

- `label`: optional in the API, always give one; and HvOption children.

## Spec

- Heading in the `label` style; no list bullets.

## Don't

- Don't leave a group without a `label`: the heading is what names the group for screen readers.
