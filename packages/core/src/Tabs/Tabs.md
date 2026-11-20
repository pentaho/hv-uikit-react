---
component: HvTabs
status: stable
related: [HvTab, HvToggleButton, HvMultiButton, HvAccordion]
rules: [uikit/raw-elements]
---

# HvTabs

Switches between peer views of the same thing without leaving the page.

## When to use

- Two to seven peer views of one object (Overview, Details, History).
- `floating` as a compact pill switch for a view setting such as Day / Week / Month.
- Steps in a sequence: a wizard instead. Choosing a value in a form: HvRadioGroup or HvMultiButton.

## What the consumer provides

- `value` (the selected HvTab's `value`, its zero-based index when the tabs have none, or `false` for none) + `onChange(event, value)`.
- HvTab children with `label` (a node, e.g. with an HvBadge count); an icon-only tab omits `label` and needs `aria-label`.
- The panel for the selected value: `role="tabpanel"`, `id`, and `aria-labelledby` pointing at its tab's `id`; give each HvTab `id` and `aria-controls`.
- `variant="scrollable"` with `scrollButtons="auto"` when tabs may overflow on narrow screens.

## Spec

- Tablist roles; arrow keys move between tabs, Tab moves into the panel.
- Tabs in `body`, `label` weight when selected, a `primary` indicator under the selected tab, all on a `border` underline.
- Tab padding `space.sm` at the sides, top corners `radii.base`; hover `bgHover`; disabled `textDisabled`.
- `floating`: a `bgPageSecondary` pill track with a `bgContainer` indicator outlined in `primary`, all `radii.full`.

## Don't

- Don't use tabs as the app's navigation between pages.
- Don't use more than seven tabs, or tabs inside tabs.
- Don't hand-make tabs from buttons: they miss the tablist roles and arrow-key navigation.
