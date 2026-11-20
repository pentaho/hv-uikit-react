---
component: HvAppSwitcher
status: stable
related: [HvAppSwitcherAction, HvDrawer, HvHeaderActions, HvIconButton]
rules: [uikit/deprecated]
---

# HvAppSwitcher

A panel listing the platform's applications so people can jump between them.

## When to use

- The app chrome of a multi-application platform: opened from an HvIconButton in HvHeaderActions, shown in an HvDrawer or a popover.
- Navigation within one application: HvVerticalNavigation or HvHeaderNavigation instead.

## What the consumer provides

- `applications`: entries without a `name` are skipped. `iconElement` wins over `iconUrl`; with neither it shows the initials of the first two words of the name.
- `onActionClickedCallback`, and `isActionSelectedCallback` returning true for the current app (it gets the selected style).
- Many entries scroll vertically: cap the height with `className`.

## Spec

- Each application is a button (a link when it has a `url`, `_top` by default) named by its `name`, with its description attached to the info icon.
- Built on HvPanel; title in the `label` style with `space.sm` below; actions in a wrapping list with gap `space.xs`.
- Each action has a colored start edge (its `color`, `text` by default, `textDisabled` when disabled) and its name in the `label` style.

## Don't

- Don't open and close it with the deprecated `isOpen`: put it inside an HvDrawer (or a panel you show) and control that (`uikit/deprecated`).
- Don't rely on long application names or descriptions as the only cue: names wrap at two lines; descriptions are a tooltip.
