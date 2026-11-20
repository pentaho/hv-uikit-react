---
component: HvListItem
status: stable
related: [HvListContainer, HvSelectionList]
---

# HvListItem

Part of HvListContainer and HvSelectionList: one row of the list.

## When to use

- Inside HvListContainer (display) or HvSelectionList (selection, where `value` identifies it).

## What the consumer provides

- `children` (the text), optional `startAdornment` (a Phosphor icon) and `endAdornment` (an icon or an icon button); each removes that side's gutter.
- `value` in HvSelectionList; `interactive`, `condensed`, `disableGutters` and `selectable` default to the container's.

## Spec

- `role` is set by HvSelectionList (`option` or `menuitem` adds `aria-selected` and `aria-disabled`); `disabled` ignores `onClick`; `separator` draws no divider after the last item.
- `body` text, `space.xs` side gutters; hover and selected `bgHover`, focus `bgPageSecondary`; disabled `textDisabled` on `bgDisabled`; separator in `border`.

## Don't

- Don't use it outside a list container: it renders an `li`.
