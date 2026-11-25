---
component: HvDialog
status: stable
related:
  [
    HvDialogTitle,
    HvDialogContent,
    HvDialogActions,
    HvDrawer,
    HvBanner,
    HvButton,
  ]
rules: [uikit/raw-elements]
---

# HvDialog

A modal step that needs a decision or a short form before people go back to the page.

## When to use

- Confirming a destructive or irreversible action; a short form (up to about five fields); in a Pentaho plugin, a row's details and short edits (a long form takes the list's place in the view).
- Details people read while keeping the list in view: beside it, in grid classes; HvDrawer only when the approved design shows one. A message that needs no decision: HvBanner or HvSnackbar.

## What the consumer provides

- `open` + `onClose(event, reason)`: you own the state. `onClose` adds the close button (named by `buttonTitle`) and closing on Escape and backdrop click.
- Children in order: HvDialogTitle, HvDialogContent, HvDialogActions.
- Actions: one `primary` button named for the decision ("Delete asset"), a `secondaryGhost` "Cancel"; destructive confirmations use a negative variant.
- `variant` only when the dialog states that outcome; pair it with the same `variant` on HvDialogTitle.
- An `alertdialog` that must not be dismissed: omit `onClose` and set `role="alertdialog"` with `aria-describedby` pointing at the message; that removes the close button, Escape and backdrop dismissal.
- `disableBackdropClick` also blocks Escape but keeps the close button; only for must-answer dialogs. Handle unsaved changes in `onClose` instead.
- Width: the dialog is as wide as its content up to `maxWidth`, or fills it with `fullWidth`. Never a fixed width in `css()`.
- No HvDialogTitle: pass `aria-label`.

## Spec

- Focus moves in on open, stays inside and returns to the trigger on close; HvDialogTitle names the dialog.
- `bgContainer` surface with `radii.large` corners and a raised shadow, over the `bgOverlay` backdrop; text in `text`.
- `variant` (`success`, `warning`, `error`) adds a top bar in `positive`, `warning` or `negative`.
- Close button at the top-right, inset `space.sm`; title in `title4`; title, content and actions padded `space.sm`.
- With long content the dialog grows in height up to a maximum that leaves a margin above and below.

## Don't

- Don't use a raw `<dialog>` or a hand-made overlay.
- Don't write a title as plain text, a body without HvDialogContent, or buttons outside HvDialogActions.
- Don't use more than three buttons, or two primary ones; don't put long forms and multi-step flows in it (use a page).
