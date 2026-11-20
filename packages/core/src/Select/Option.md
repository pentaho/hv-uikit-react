---
component: HvOption
status: stable
related: [HvSelect, HvOptionGroup, HvListItem]
---

# HvOption

Part of HvSelect: one option in its list.

## When to use

- Inside HvSelect (directly or in an HvOptionGroup), one per choice.
- Plain choices need no HvOption: HvSelect's `options` prop covers them; use HvOption for groups or custom content.
- Items of HvDropdown or HvDropDownMenu are data (`values`, `dataList`), not HvOption.

## What the consumer provides

- `label` as plain text when children aren't plain text: it is used for type-ahead and shown in the select once chosen.

## Spec

- Renders as an HvListItem; the highlighted option shows the focus ring, the selected one the list's selected style.

## Don't

- Don't use HvOption outside an HvSelect: it needs the select's context.
