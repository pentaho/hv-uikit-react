# UI Kit Action Rules

## Introduction

Actions must communicate their consequences and protect users from accidental data loss.

## Color Actions accordingly

Use the correct theme color to indicate the nature of the action, such as `primary` for main actions, `negative` or `warning` for destructive actions.

## Prevent accidental and destructive actions

Prevent accidental and destructive actions by requiring explicit user intent before performing potentially destructive operations, or a way to recover from the change.
This can include confirmation dialogs, undo options, or additional verification steps.

Examples:

```diff
- <HvButton variant="negative" onClick={deleteAsset}>Delete asset</HvButton>
+ <HvButton variant="negative" onClick={() => setConfirmOpen(true)}>Delete asset</HvButton>
```
