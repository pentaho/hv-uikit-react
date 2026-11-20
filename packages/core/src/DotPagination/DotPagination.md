---
component: HvDotPagination
status: stable
related: [HvPagination, HvRadioGroup]
---

# HvDotPagination

A row of dots for moving between a few slides or steps, one radio button per page.

## When to use

- A carousel, an image gallery or a short onboarding sequence with a handful of pages.
- Records in pages (tables, lists): HvPagination. Steps that must be done in order: a wizard.

## What the consumer provides

- `page` + `onPageChange`: it is controlled only, so set `page` (zero-based) from `onPageChange` or the selected dot never moves.
- `getItemAriaLabel(page)` returning "Page 2 of 5" or the slide's title; an `aria-label` for the group ("Slides"), with `role="navigation"` when the dots move between slides.

## Spec

- Horizontal dots with `space.xs` gaps; the current page is a larger `text` dot; round (`radii.full`) `bgHover` focus and hover area.
- Arrow keys move between pages, as in a radio group.

## Don't

- Don't use it for more than about seven pages: dots stop being countable.
- Don't leave dots without names: screen readers read each as an unnamed radio.
