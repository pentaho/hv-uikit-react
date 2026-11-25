# Action Rules

## Color actions accordingly

Use `primary` for the main action and `negative` for destructive ones (`negativeSubtle` or `negativeGhost` in lists and rows). Not the `warning…` or `positive…` button variants: their text is below AA.

## Prevent accidental and destructive actions

Require explicit intent before a destructive operation (a confirmation dialog or an extra verification step), or offer a way to recover (undo).

The confirmation names the item it acts on ("Delete "Sales by territory"?").

## Confirm actions on several items

Before an action on several selected items runs, an `HvDialog` says how many and names every one, never only a count or the first few; after it, say how each went.
