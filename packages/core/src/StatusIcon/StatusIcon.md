---
component: HvStatusIcon
status: stable
related: [HvTag, HvBanner, HvBadge]
---

# HvStatusIcon

An icon that marks the state of a process or item: success, warning, error or info.

## When to use

- Next to a status word in a table cell, list row or card header ("Failed", "Running").
- A status that must read as words with a tinted chip: HvTag. A message about the page: HvBanner.

## What the consumer provides

- Always a `variant`; `default` and `accent` need a `customIcon` (a Phosphor icon).
- `weight` only affects the four built-in symbols: for a `customIcon` pass the matching Phosphor weight yourself.
- The status text next to it, as HvTypography. It takes no `aria-label` or `title`.
- Experimental: the API may change.

## Spec

- `full` is a tinted square, `simple` the colored symbol only. `full`: the variant's color (`success` positive, `warning`, `error` negative, `info`, `accent`) on its `…Dimmed` fill with a `…Border` outline, `space.xxs` padding; `default` is `text` on `bgPage` with a `borderSubtle` outline.
- Corners grow with size: `radii.base` small, `radii.round` at `md`, `radii.large` at `lg` and `xl`.

## Don't

- Don't show the icon alone: it has no accessible name, so a word beside it carries the meaning.
- Don't use `variant` `default` or `accent` without `customIcon`: they have no built-in symbol and render an empty box.
