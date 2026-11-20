---
component: HvInlineEditor
status: stable
related: [HvInput, HvTypography, HvTextArea]
---

# HvInlineEditor

Text that turns into a field when clicked, for renaming or editing one value in place.

## When to use

- Renaming a record where it is shown (a dashboard title, an asset name in its header).
- Several fields or anything that needs validation before saving: a form in an HvDialog or HvDrawer.

## What the consumer provides

- `value` + `onChange(event, value)`, or `defaultValue`; save in `onBlur(event, value)`, the commit point.
- `variant`: the HvTypography style it displays and edits in (`title2` for a page heading).
- `aria-label` for the field, and a name for the display button through `buttonProps` ("Rename: Q3 report").
- To commit on Enter, handle `onKeyDown(event, value)` as well as blur: Enter does not save.

## Spec

- Click or Enter on the display button edits, blur saves (an empty value keeps the previous one), Escape cancels.
- Display: a ghost button on `bgContainer`, side padding `space.xs`, outline `primary` on hover and `text` on focus; the pencil in `textDisabled`; empty value in `textDisabled`.
- Edit: the field takes the variant's size so the layout doesn't jump.

## Don't

- Don't make hovering the only way to find out something is editable: keep `showIcon` on where people won't hover.
- Don't let the editor's button have only the value as its name: give it a name that says it edits.
