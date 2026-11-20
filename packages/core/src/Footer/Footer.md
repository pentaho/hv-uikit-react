---
component: HvFooter
status: stable
related: [HvHeader, HvTypography]
---

# HvFooter

A thin bar at the end of an application with the product name, copyright and a few links.

## When to use

- Only for the app's top-level chrome, when the design calls for legal or support links; pages inside an app don't add one.

## What the consumer provides

- `copyright=""` removes the copyright line.
- `links`: one node, or several HvTypography links (`link`, `component="a"`, `href`) in a wrapper spaced with gap classes (`flex gap-xs`).
- Place it at the end of the layout: it does not stick to the bottom on its own. One per page.

## Spec

- A `footer` landmark: `bgContainer` bar with a `border` line on top, padding `space.xs` by `space.sm`, gap `space.xs`.
- Name in the `label` style on the left; copyright in `body` and links on the right, divided by a `text` separator.
- Below the small breakpoint it stacks vertically and drops the separator.

## Don't

- Don't put page actions or navigation in the footer: actions go in HvGlobalActions, navigation in the header or side rail.
- Don't leave the defaults on a non-Pentaho product: `name` defaults to "Pentaho" and `copyright` to Pentaho's.
