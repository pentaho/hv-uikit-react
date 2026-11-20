---
component: HvSwitchColumnCell
status: stable
related: [HvSwitch, HvBaseSwitch, HvTable, HvTableCell]
---

# HvSwitchColumnCell

An on/off switch for a table cell, with optional words on either side.

## When to use

- A setting people toggle per row (enabled, subscribed), directly or through `hvSwitchColumn`.
- A form setting outside a table: HvSwitch with its `label`.

## What the consumer provides

- `switchLabel` is the accessible name. Through `hvSwitchColumn` it is one string for every row, so to name the row ("Enable Sales orders") render HvSwitchColumnCell in your own `Cell`.
- `value` is the row id (`hvSwitchColumn` sets it); `switchProps.onChange(event, checked, value)` receives it.

## Spec

- HvBaseSwitch between `body` labels (`falseLabel` before, `trueLabel` after, hidden from screen readers), vertically centered in the cell.
