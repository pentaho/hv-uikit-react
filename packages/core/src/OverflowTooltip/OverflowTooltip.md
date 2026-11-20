---
component: HvOverflowTooltip
status: stable
related: [HvTooltip, HvTableCell, HvTypography]
---

# HvOverflowTooltip

Text that truncates with an ellipsis and shows the full text in a tooltip only when it is cut off.

## When to use

- Names, paths and descriptions in table cells, card titles and narrow columns that may not fit.
- `paragraphOverflow` for multi-line text clamped to three lines; it applies only when the text contains a space (a single long word still ends in an ellipsis).
- In HvTable, `hvTextColumn` already wraps cell text in it.
- Text that always fits: plain HvTypography. A hint that isn't the text itself: HvTooltip.

## What the consumer provides

- `data`: the text (or a node) to show and to put in the tooltip.

## Spec

- The text stays the accessible content (it is not renamed), so screen readers read it in full.
- One line, ellipsis at the end, full width of its container at most; the tooltip uses HvTooltip's look and opens on hover only while overflowing.

## Don't

- Don't truncate the main content people need to read (a description on a details page): let it wrap.
- Don't wrap it in an element without a width: it can't overflow, so it never truncates.
