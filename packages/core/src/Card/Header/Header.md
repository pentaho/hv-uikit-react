---
component: HvCardHeader
status: stable
related: [HvCard, HvCardContent, HvStatusIcon]
---

# HvCardHeader

Part of HvCard: its title row, with an optional subheader and icon.

## When to use

- The first child of every HvCard that has a title.

## What the consumer provides

- `title`: short and specific; it is the card's visible name. A string, or an HvTypography (`title4` for a larger heading, with `component="h3"` when the page needs heading levels).
- `icon`: an HvStatusIcon at the end of the row; decorative icons get `aria-hidden`.

## Spec

- Padding `space.xs` by `space.sm`, gap `space.xs`; title in `label`, subheader `caption1` in `textSubtle`.
