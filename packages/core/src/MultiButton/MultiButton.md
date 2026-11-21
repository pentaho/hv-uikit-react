---
component: HvMultiButton
status: stable
related: [HvButton, HvDropDownMenu, HvTabs, HvRadioGroup]
---

# HvMultiButton

A connected group of buttons: a segmented choice of views, or a split button with a menu.

## When to use

- Switching between two to five views or modes of the same content (List / Grid, Day / Week / Month), with the current one `selected`; or toggling a set of options (days of the week).
- `split` with an HvButton plus an HvDropDownMenu: a main action with its variants.
- Peer sections of a page: HvTabs. A form choice that is submitted: HvRadioGroup.

## What the consumer provides

- HvButton children, each with `onClick` and `selected`; the app keeps the selection in state (the group doesn't).
- `aria-label` on the group when its purpose isn't obvious from nearby text.
- `variant`, `size` and `disabled` apply to every child; `vertical` is ignored with `split`.
- A width for text segments: they have no padding of their own and share the group's width equally (up to 200px each), so without one, text touches the outline (`className={css({ width: "15rem" })}` for two or three short labels; never `style`, `uikit/no-inline-style`).

## Spec

- `selected` sets `aria-pressed`; more than one can be selected.
- Group: `bgPage` fill, `border` outline, `radii.full` (`radii.large` when vertical); segment text `body`.
- Selected segment: `primary` text in `label` weight on `primaryDimmed`, outlined in its text color; hover `bgHover`; disabled `textDisabled`.
- `split`: segments join without a gap, divided by a thin line in the current text color; the menu trigger keeps its own border.

## Don't

- Don't mix actions and selections in one group.
- Don't leave icon-only segments with no name: give each an `aria-label` (an icon-only HvButton with `icon`).
