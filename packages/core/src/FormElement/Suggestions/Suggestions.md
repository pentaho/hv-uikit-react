---
component: HvSuggestions
status: internal
related: [HvInput, HvTagsInput, HvDropdownPanel]
---

# HvSuggestions

The suggestion list HvInput and HvTagsInput open while people type; internal to them.

## When to use

- Not directly: give HvInput or HvTagsInput a `suggestionListCallback(value)` that returns `{ id, label, value? }` items (`id` is the key, so give each one; `value` is what gets inserted and defaults to the label, so a non-text `label` needs a `value`).
- Picking from a fixed list: HvSelect or HvDropdown with `showSearch`.
