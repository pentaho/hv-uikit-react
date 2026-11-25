# Anti-pattern Rules

## Prefer UI Kit components

Every standard control has an `Hv*` component: use it over native controls, third-party widgets, or custom implementations of the same interaction (look it up first, `workflow/component-contracts`). Custom parts hold product logic, never their own look.

Native semantic elements and layout wrappers are fine where they don't recreate a UI Kit widget. If no component meets the requirement, say so rather than forcing an unsuitable replacement.

## Self-evident disabled actions

Explain why an action is disabled when the reason is not otherwise clear. Keep the control reachable (`focusableWhenDisabled` on HvButton) and put the reason beside it, not only in a hover tooltip.
