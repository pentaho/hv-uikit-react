---
component: HvGlobalActions
status: stable
related: [HvButton, HvIconButton, HvDropDownMenu, HvBreadCrumb, HvSection]
---

# HvGlobalActions

A page's title bar with the actions that affect the whole page, kept in view while scrolling.

## When to use

- The top of a page: its title (an `h1`) with one primary action and a few secondary ones (Export, Share, more in an HvDropDownMenu). Use it sparingly: skip it where the page title alone is enough.
- `variant="section"`: a title with actions for one group of content inside the page.
- A titled card-like region of a page: HvSection.

## What the consumer provides

- `title`: a string becomes a heading (`h1` for global, `h2` for section, or `headingLevel`); a node (HvBreadCrumb, an icon) renders as given with no heading, so the page needs one elsewhere.
- `children`: the actions, as HvButton (one `primary`), HvIconButton with `title`, HvDropDownMenu with `placement="left"` (the actions are right-aligned).
- `position="fixed"` leaves side margins that scale with the breakpoint. `backButton` (global only): an HvIconButton titled "Back" for detail pages.

## Spec

- Global: sticky by default; a `bgContainer` bar with `radii.round` corners and a `border` outline over a translucent `bgPage` band, title in `title3`. Section: a `border` line on top, title in `title4`.
- Padding `space.xs`; start padding `space.sm` on global, none on section; actions right-aligned with gap `space.xs`.
- Its global title is `title3`, smaller than the `title2` page heading the guidelines suggest elsewhere; use one or the other on a page.

## Don't

- Don't use more than one `variant="global"` per page, or `global` for a group inside the page: it renders an `h1` and sticks.
- Don't put actions inside `title`: pass them as `children`.
- Don't pick `headingLevel` for its look: it changes only the element; the variant sets the style.
