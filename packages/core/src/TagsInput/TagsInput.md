---
component: HvTagsInput
status: stable
related: [HvTag, HvInput, HvDropdown]
rules: [uikit/raw-elements]
---

# HvTagsInput

A field where people type values that become removable tags: keywords, emails, labels.

## When to use

- A free list of short values people add and remove (tags, recipients, keywords).
- Choosing several from a known list: HvDropdown with `multiSelect`, or `suggestionListCallback` with `suggestionsLoose={false}`.

## What the consumer provides

- `value` / `defaultValue` (strings or HvTag props) + `onChange(event, tags)` (always HvTag props, `{ label }`).
- `commitTagOn` takes `event.code` names (`Enter`, `Comma`, `Space`) and is ignored with `suggestionListCallback`; with suggestions, Enter adds a typed value only when `suggestionsLoose` is true.
- `maxTagsQuantity` shows a counter and marks the field invalid when exceeded; it doesn't block adding.
- `resizable` works with `multiline` only.

## Spec

- With the field empty, Backspace or Delete removes the last tag; arrow keys, Home and End move between tags, and Delete or Backspace on a focused tag removes it.
- Field with `radii.round` corners, `textDimmed` outline, `primary` on hover and focus, `negative` when invalid; tags spaced by `space.xxs`.
- Text in `body`, placeholder `textSubtle`; disabled on `bgDisabled`, read-only on `bgPage`.

## Don't

- Don't add long phrases as tags: tags are one or two words.
- Don't leave a tags input with no hint of how to add: say "Press Enter to add" in `description`, and match it to `commitTagOn` (it is wrong with other keys or with suggestions).
- Don't use a placeholder as the label.
