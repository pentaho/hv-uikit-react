---
component: HvSkeleton
status: stable
related: [HvLoading, HvLoadingContainer, HvEmptyState]
rules: [uikit/no-inline-style]
---

# HvSkeleton

A placeholder shaped like the content that is loading, so the layout doesn't jump when it arrives.

## When to use

- The first load of rows, cards, KPIs or text whose shape you know (on a slow network).
- A wait with no known shape: HvLoading. Refreshing content already shown: HvLoadingContainer.

## What the consumer provides

- `width` / `height` matching the content it replaces; without them it sizes itself to its `children` (hidden while it shows), so wrap the real component.
- `hidden={!isLoading}` with the real content as `children`: the children fade in once it is hidden.
- `role="progressbar"` and `aria-label` ("Loading assets") on the group that stands in for loading content; HvSkeleton adds none, and `hidden` renders a plain wrapper that drops them.

## Spec

- `bgPageSecondary` fill; `text` and `circle` use `radii.full`, `square` uses `radii.base`; the wave sweeps in `border`.

## Don't

- Don't show a skeleton for loaded content, or one that never resolves into an error or empty state.
- Don't mix `pulse` and `wave` on one screen.
