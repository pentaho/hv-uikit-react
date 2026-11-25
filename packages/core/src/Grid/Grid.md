---
component: HvGrid
status: stable
related: [HvContainer, HvCard]
rules: [uikit/no-inline-style, uikit/theme-sizes]
---

# HvGrid

A responsive column grid (12 columns, or the design system's 4 / 8 / 12 with `columns="auto"`) for laying out cards and regions.

## When to use

- A layout that must follow the design system's column grid (`columns="auto"`: 4, 8 or 12 columns by breakpoint), or whose column spans the approved design sets.
- Most layouts, card grids and KPI rows included: flex or grid utility classes with token gaps and breakpoint prefixes (`grid grid-cols-2 md:grid-cols-4 gap-sm`) are lighter.

## What the consumer provides

- A `container` HvGrid with item HvGrids as children.
- On each item, `size` as a number of columns or per breakpoint (`{ xs: 4, sm: 4, md: 3 }`); the old `xs` / `sm` / `md` item props no longer exist.
- `spacing="auto"` (the default) is two spacing units below `md` and four from `md`; `rowSpacing` / `columnSpacing` split it.

## Spec

- Built on the theme's breakpoints (`xs`, `sm`, `md`, `lg`, `xl`) and its eight-unit spacing factor; no colors or surfaces of its own.

## Don't

- Don't set `sx` (it is ignored) or `style` on the grid or its items: layout comes from its props, extra styling from classes or `css()` (`uikit/no-inline-style`).
- Don't place items outside a `container`, or make a grid per card.
