---
component: HvTag
status: stable
related: [HvStatusIcon, HvBadge, HvTagsInput, HvButton]
rules: [uikit/no-hardcoded-values, uikit/tag-label, uikit/deprecated]
---

# HvTag

A short label for a status or a category.

## When to use

- Status in a row or card: `color` `positive`, `warning`, `negative` or `info`, always with words ("Certified", "Failing"); no `color` for a neutral tag.
- Categories (domains, types): `type="categorical"` with `color` `cat1` to `cat12`.
- Removable filter chips (`onDelete`) and toggle chips (`selectable`). A count on an icon: HvBadge. Editing a list of tags in a form: HvTagsInput.

## What the consumer provides

- `label`: required in practice, it is the accessible name.
- `selectable` with `selected` / `defaultSelected`; `onClick(event, selected)` gives the new selected state.
- `variant` is deprecated: use `type` and `color`.

## Spec

- A clickable tag is a button; a plain one is not focusable. Delete and Backspace on a focused tag call `onDelete`; `aria-pressed` is set only while selected; `disabled` hides the delete icon.
- Status tags: the status `…Strong` text on its `…Dimmed` fill with a `…Border` outline; clickable ones hover to `…Subtle`. The warning tag's text is currently below AA at small sizes.
- Neutral: `text` on `bgContainer`, `border` outline. Categorical: `text` on the category color at 20% alpha. Disabled: `textDisabled` on `bgDisabled`.
- `xs` text in `caption2`, `sm` in `caption1`, `md` in `body`; `radii.base` corners for `xs` and `sm`, `radii.round` for `md`.

## Don't

- Don't use color without words: the label is the meaning.
- Don't put long text in a tag: it is one or two words (it truncates at a fixed width; if it must be long, pass `label` as an HvOverflowTooltip so the full text shows on hover).
- Don't put hex values in `color`, or use a tag as an action button: use HvButton for actions (`uikit/no-hardcoded-values`).
- Don't fake a tag with a styled `span` or `div`, or use an emoji as its icon: use HvTag, with an icon element in `icon`.
