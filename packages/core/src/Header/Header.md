---
component: HvHeader
status: stable
related:
  [
    HvHeaderBrand,
    HvHeaderNavigation,
    HvHeaderActions,
    HvVerticalNavigation,
    HvGlobalActions,
  ]
rules: [uikit/raw-elements]
---

# HvHeader

The application's top bar: brand on the left, optional top-level navigation, global actions on the right.

## When to use

- Only for the app's top-level chrome; a page inside an app that already has a header doesn't add one, and App Shell apps and plugins get theirs from the shell.
- A page's own title with its actions: HvGlobalActions. Section navigation in a sidebar: HvVerticalNavigation.
- Compose it from HvHeaderBrand, HvHeaderNavigation (up to two levels of links) and HvHeaderActions.
- With a sidebar below it, set `levels={1}` on HvHeaderNavigation and put the second level in HvVerticalNavigation.

## What the consumer provides

- `children`: HvHeaderBrand, then HvHeaderNavigation, then HvHeaderActions (pushed to the right); each is optional and other children are fine (a menu HvIconButton, an HvTypography title).
- An `aria-label` ("Main") on the navigation inside it.
- On narrow screens hide HvHeaderNavigation and show a menu HvIconButton instead; the header doesn't do that by itself.

## Spec

- A `header` landmark: `bgContainer` bar with a `borderSubtle` bottom line, the theme's header height, side padding `space.sm`; stacks above page content.

## Don't

- Don't add a second header inside an app that already has one.
- Don't leave the default `position="fixed"` inside a page: it pins to the viewport and covers the app's chrome; use `relative` or `static`.
- Don't leave icon-only actions without a name: use HvIconButton with a `title` (`uikit/icon-button-label`).
