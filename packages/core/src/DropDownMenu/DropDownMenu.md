---
component: HvDropDownMenu
status: stable
related: [HvButton, HvIconButton, HvActionsGeneric, HvDropdown, HvMultiButton]
rules: [uikit/raw-elements]
---

# HvDropDownMenu

A button that opens a menu of actions, by default an overflow (three dots) icon.

## When to use

- Secondary or overflow actions on a row, card or toolbar (Duplicate, Export, Delete).
- With HvMultiButton `split`, the variants of a main action.
- Choosing a value: HvDropdown or HvSelect. Many row actions with some visible: HvActionsGeneric.

## What the consumer provides

- `dataList` items; `onClick(event, item)` runs the action.
- `keepOpened` defaults to true: set it to false for action menus so the menu closes after a choice.
- `expanded` + `onToggle(event, open)` to control it.

## Spec

- Trigger: an icon button (HvDropdownButton; `aria-haspopup="menu"`, `aria-expanded`); while open it carries the `shadow`.
- Enter or Space opens it and focuses the first item; arrows move; Escape and Tab close.
- Panel on `bgContainer` with `space.sm` padding; items as in HvListContainer.

## Don't

- Don't use the menu as a value picker: it has no selected value.
- Don't keep the generic default name: pass `labels={{ dropdownMenu: "Actions for <item>" }}` or `aria-label`.
- Don't hide primary actions in the menu.
