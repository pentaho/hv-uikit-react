---
component: HvButton
status: stable
related: [HvIconButton, HvDropDownMenu, HvMultiButton, HvToggleButton]
rules: [uikit/raw-elements, uikit/no-hardcoded-values, uikit/icon-button-label]
---

# HvButton

Triggers an action; one primary button per view, form or dialog.

## When to use

- `primary` for the main action; `secondaryGhost` for Cancel and minor actions (toolbars, cards, table rows); `secondarySubtle` for secondary actions outside forms and dialogs.
- Destructive: `negative` in a confirming dialog, `negativeSubtle` or `negativeGhost` in lists. Success and warning actions: `primary` or `secondarySubtle`, with the status in words or an icon.
- Icon only: HvIconButton. Several related actions behind one control: HvDropDownMenu. Grouped options or a split button: HvMultiButton. An on/off icon: HvToggleButton.

## What the consumer provides

- `children`: a sentence-case verb ("Save changes").
- `disabled` with `focusableWhenDisabled`, so keyboard and screen-reader users still reach it; say why nearby.
- `selected` only for real toggles (it sets `aria-pressed`); `component` for a router link.
- An `icon` HvButton is square, defaults to `secondaryGhost` and needs `aria-label`; prefer HvIconButton.

## Spec

- `label` text style (smaller at `sm`), `radii.full`, side padding `space.sm` (`space.md` at `lg`), focus ring on keyboard focus.
- Contained: white text (fixed, not a token) on the color; `primary` hovers `primaryStrong`, pressed `primaryDeep`; status fills hover their `…Deep`.
- Subtle: `primaryDimmed` fill, `primarySubtle` border; status subtles their `…Dimmed` fill, `…Border` outline, `…Subtle` hover. `secondarySubtle`: no fill, `secondary` outline at 40% alpha (only the deprecated `secondary` / `subtle` get `bgPage` fill and `border`).
- Ghost: no fill. Hover `primaryDimmed`, pressed `primarySubtle`; status variants hover `…Dimmed`, pressed `…Subtle`.
- Disabled: `textDisabled` on `bgDisabled` (ghost stays transparent).

## Don't

- Don't place two primary buttons side by side, or a primary button in every row.
- Don't make an icon-only HvButton with no name: use HvIconButton with a `title` (`uikit/icon-button-label`).
- Don't use a raw `<button>` (`uikit/raw-elements`) or color values on `color`; don't combine a semantic `variant` with `color`.
- Don't use the `positive…` or `warning…` variants: their text is currently below AA.
