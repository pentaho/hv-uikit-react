---
component: HvVerticalNavigation
status: stable
related:
  [
    HvVerticalNavigationHeader,
    HvVerticalNavigationTree,
    HvVerticalNavigationActions,
    HvVerticalNavigationAction,
    HvHeader,
    HvHeaderNavigation,
    HvTabs,
  ]
rules: [uikit/raw-elements, uikit/deprecated]
---

# HvVerticalNavigation

A collapsible side rail for an application's global navigation, with a tree of sections and actions at the bottom.

## When to use

- Only for the app's top-level chrome.
- Many sections or a hierarchy on wide screens; a few flat destinations fit HvHeaderNavigation.
- Switching views inside one page: HvTabs.

## What the consumer provides

- `open` is controlled only: the app owns the state; toggle it from HvVerticalNavigationHeader's `onCollapseButtonClick` or an HvVerticalNavigationAction.
- `useIcons` for a usable collapsed rail: without it no icons render and a collapsed rail shows only the header's expand button. `slider`: drill-down levels for small screens.
- `children`: HvVerticalNavigationHeader, one or more HvVerticalNavigationTree (each a `nav` landmark: give each an `aria-label`), HvVerticalNavigationActions; other content (branding, a primary action) fits between them.
- `collapsedMode` is deprecated: use `useIcons`.

## Spec

- Always dark: `textLight` text on a dark surface in both modes (fixed, not a token), so theme color changes don't reach it.
- With `useIcons`, items show their icon, or the label's first letter in an avatar; collapsed, items get a tooltip and parents open their children in a flyout (hover to peek, click to keep open).
- Padding `space.sm`; each child separated by a divider; items `radii.round`, `body` text, the selected one on a dark blue fill (fixed, not a token); header title in `title3`.
- Fixed rail width that shrinks to one icon column when collapsed (motion off under reduced motion).

## Don't

- Don't add a second side navigation inside an app that already has one.
- Don't set `mode="treeview"` on its tree without a real need for arrow-key navigation: it overrides standard Tab behavior.
- Don't collapse the rail without `useIcons` and icons on the items: people lose every destination's cue.
