# Action Rules

## Introduction

Actions must communicate their consequences and protect users from accidental data loss.

## Color actions accordingly

Use `primary` for the main action and `negative` for destructive ones (`negativeSubtle` or `negativeGhost` in lists and rows). Not the `warning…` or `positive…` button variants: their text is below AA.

## Prevent accidental and destructive actions

Require explicit intent before a destructive operation (a confirmation dialog or an extra verification step), or offer a way to recover (undo).

Examples:

```diff
- <HvButton variant="negative" onClick={deleteAsset}>Delete asset</HvButton>
+ <HvButton variant="negative" onClick={() => setConfirmOpen(true)}>Delete asset</HvButton>
```
