---
component: HvCardContent
status: stable
related: [HvCard, HvCardHeader, HvCardMedia]
---

# HvCardContent

Part of HvCard: the padded body under the header.

## When to use

- Every card body: text, a KPI value with its HvTag, a chart from `@pentaho/uikit-react-viz` (HvBarChart, HvLineChart, HvDonutChart).

## What the consumer provides

- Text through HvTypography; lay it out with flex or grid classes and token gaps (`flex flex-col gap-xs`), or `css()`.

## Spec

- Padding `space.sm` (no bottom padding: the card adds it after its last part); `space.xs` above a following HvCardMedia.

## Don't

- Don't put body content straight in HvCard: it loses the padding.
