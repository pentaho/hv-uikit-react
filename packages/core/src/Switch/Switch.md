---
component: HvSwitch
status: stable
related: [HvCheckBox, HvToggleButton, HvBaseSwitch]
rules: [uikit/raw-elements]
---

# HvSwitch

An on/off control for a setting that takes effect immediately.

## When to use

- Turning a feature or setting on and off right away (Notifications, Auto-refresh).
- A choice submitted with a form, or agreeing to terms: HvCheckBox. Two opposing icon states: HvToggleButton.

## What the consumer provides

- `checked` + `onChange(event, checked, value)`, or `defaultChecked`.
- `labelPosition`: `top` (the default), or `left` / `right` of the control.
- `color` replaces the track color in both states: use it only for meaning (`warning`, `negative`).
- `status="invalid"` with `statusMessage`; `aria-errormessage` can point to an external error element.

## Spec

- `role="switch"`; Tab to focus, Space toggles.
- Track pill (`radii.full`): `textDimmed` off, `positive` on; the thumb is a white disc (fixed, not a token) with no outline; hover halo `bgHover` around the control.
- Label beside the control: `space.xs` outer padding, `space.xxs` between label and control.
- Disabled: `bgDisabled` track, thumb outlined in `textDisabled`, not-allowed cursor. Read-only: `border` track off, `positive` mixed 50% dimmer on, no hover halo.
- Invalid: a `negative` rule under the control; `statusMessage` is the message (uncontrolled `required` and unchecked shows "Required").

## Don't

- Don't leave a switch with no label: pass `label`, or `aria-label` when the label is elsewhere.
- Don't use a switch for a setting that only applies after Save: that's a checkbox.
