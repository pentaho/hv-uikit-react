---
component: HvCardMedia
status: stable
related: [HvCard, HvCardContent]
rules: [uikit/no-raw-graphics]
---

# HvCardMedia

Part of HvCard: an image across the card's full width.

## When to use

- A thumbnail or preview that helps people recognize the item (a report preview, an asset image).
- Not for charts: put the chart inside HvCardContent.

## What the consumer provides

- `image` with `component="img"` and an `alt` that describes it, or `title`: it renders with `role="img"`, so it always needs a name.

## Spec

- Full card width; no padding of its own.
