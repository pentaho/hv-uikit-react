---
component: HvAccordion
status: stable
related: [HvSection, HvTabs, HvVerticalNavigation]
---

# HvAccordion

A labeled button that shows or hides the content under it, in place.

## When to use

- Secondary detail people open on demand: advanced options, an FAQ, groups of filters in a side panel.
- Any accordion with a title, actions or a bordered region: HvSection (`expandable`, `expandableHeader`, `expanded` + `onToggle`): it brings the header, actions and border. Keep HvAccordion for a bare, borderless group. Peer views of the same thing: HvTabs.

## What the consumer provides

- `expanded` + `onChange(event, value)` when controlled: `value` is the state before the toggle, so set `!value`.
- `headingLevel` so screen readers list it among the page headings; without it there is no heading.
- `disabled` with the reason nearby.

## Spec

- The button carries `aria-expanded` and controls the region; Enter and Space toggle it.
- A full-width button with a caret that turns when open, text in `label`; the content sits `space.xs` below.
- Disabled text in `textDisabled`; no border or fill of its own.

## Don't

- Don't hide content most people need: show it.
- Don't nest an accordion inside an accordion.
