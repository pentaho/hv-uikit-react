# HV UI Kit Actions Rules

Rules for dialogs and destructive operations.

## Dialogs

- Use `HvDialog` for interactions that need a focused decision or input, such as editing an item or deleting an asset

## Confirmation

- Every destructive action (delete, remove, discard, irreversible change) must be confirmed in an `HvDialog` before it runs
  - The confirm action performs the change; the cancel action leaves data unchanged
  - Never run destructive logic directly from the triggering button

## Destructive Buttons

- Use `HvButton` with `variant="negativeGhost"` for destructive actions
