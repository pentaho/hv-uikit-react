---
component: HvLoadingContainer
status: stable
related: [HvLoading, HvSkeleton, HvTable, HvCard]
---

# HvLoadingContainer

Wraps content with a dimming overlay and an HvLoading while it refreshes.

## When to use

- Reloading content that is already on screen: a table re-fetching after a filter or page change, a card updating.
- A first load with nothing to show yet: HvSkeleton shaped like the content.

## What the consumer provides

- `hidden={!isFetching}` (from the data query) to show the overlay only while loading.
- `label` ("Updating results…") or `aria-label`; without either the name is "Loading".

## Spec

- `role="progressbar"`, named by `aria-label`, else a string `label`, else "Loading".
- An overlay of `bgContainer` at partial opacity over the content, with the HvLoading centered; the wrapper takes its parent's height.

## Don't

- Don't wrap the whole page: wrap only the region that is refreshing.
