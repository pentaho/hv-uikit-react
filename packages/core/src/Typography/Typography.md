---
component: HvTypography
status: stable
related: [HvOverflowTooltip, HvTimeAgo, HvLabel]
rules: [uikit/no-hardcoded-values, uikit/no-inline-style, uikit/raw-elements]
---

# HvTypography

All text in the UI, set in one of the theme's type styles by `variant`.

## When to use

- Every heading, paragraph, label and caption a project writes: `title2` with `component="h1"` for the page heading, `title3` / `title4` for sections and cards, `body` for copy, `label` for emphasis and field-like labels, `caption1` for secondary lines and metadata.
- `display` and `title1` for a big number in a KPI card, not for page headings (they render `h1` by default, so set `component`).
- `captionLabel` for emphasis within secondary text.
- Form field labels come with the field (`label` prop); text that may be clipped: HvOverflowTooltip.

## What the consumer provides

- `component` to keep the heading order right; titles render `h1`–`h4` by default.
- `noWrap` needs a width on the element; `link` styles an `a` you give `href`.
- Color other than `text`: a class (`text-textSubtle`), or `css()` with `theme.colors.*`.

## Spec

- `fontFamily.body`; each variant pairs size, line height and weight from the theme (titles, `label` and `captionLabel` semibold; `body`, `caption1` and `caption2` normal); color inherits, `text` by default.
- Default elements: `body` a `p`, `label` a `span`, captions a `div`. `disabled` uses `textDisabled`; `link` uses `primary`, underlined.

## Don't

- Don't set font sizes, weights or line heights in classes or `css()`: pick a `variant`.
- Don't choose headings by look alone: keep the heading order right with `component` (`h1`, `h2`, `h3`) and pick the `variant` for size.
- Don't make color the only difference between two texts, or use hex colors: use `textSubtle` (`text-textSubtle`) for secondary text on containers (`text` directly on `bgPage`), and a status word for state.
