---
component: HvVerticalNavigationHeader
status: stable
related: [HvVerticalNavigation, HvVerticalNavigationTree]
---

# HvVerticalNavigationHeader

The top of an HvVerticalNavigation: its title and the collapse button.

## When to use

- As the first child of HvVerticalNavigation.

## What the consumer provides

- `onCollapseButtonClick` toggling the parent's `open`: the collapse button appears only with it.
- `collapseButtonProps` with an `aria-label` ("Collapse navigation") and `aria-expanded` set to the parent's `open`: the button has neither of its own.

## Spec

- Title in `title3` (`label` in slider mode), inheriting the rail's `textLight`; hidden when collapsed.
- Slider mode: nothing shows at the first level; in a sub-level the Back button (`aria-label` "Back" by default) and the parent's name show.
