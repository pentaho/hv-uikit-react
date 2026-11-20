---
component: HvTableContainer
status: stable
related: [HvTable, HvTableSection]
---

# HvTableContainer

The scrolling box around an HvTable.

## When to use

- Always around HvTable: it scrolls wide tables sideways and, with a bounded height, lets `stickyHeader` work.

## What the consumer provides

- A height limit through a class (`max-h-96`) or `css()` when the header should stick.

## Spec

- Full width, scrolls on overflow, with a little bottom padding so focus rings on the last row aren't clipped (removed inside HvTableSection).
