---
component: HvHeaderNavigation
status: stable
related: [HvHeader, HvHeaderMenuBar, HvHeaderMenuItem, HvVerticalNavigation]
---

# HvHeaderNavigation

The top-level links of an HvHeader, with an optional second level that opens below the bar.

## When to use

- Inside HvHeader, for a handful of top-level destinations; a deeper or longer hierarchy: HvVerticalNavigation.
- With a sidebar below the header, set `levels={1}` and show the second level in HvVerticalNavigation.

## What the consumer provides

- `data`: a parent without `href` links to its first child's.
- `selected` (the current item's id) + `onClick(event, item)`: route in `onClick` and set `selected` to the clicked id.
- `aria-label` ("Main") for its `nav` landmark.

## Spec

- The selected leaf gets `aria-current="page"`, its ancestor `aria-current="true"`; items are reachable with Tab; the second level opens on hover or keyboard focus; Enter or Space on an item calls `onClick`.
- Items in `body` text, `label` weight when selected with a `text` underline, padding `space.xs` by `space.sm`, hover `bgHover`.
- The items are centered across the header; the navigation overlays the full bar, and brand and actions stay clickable above it.
- The second level opens on `bgPage` under the bar with a `borderSubtle` line.

## Don't

- Don't nest more than two levels: deeper `data` is ignored.
- Don't rely on `href` alone: clicks are prevented, so route in `onClick`.
