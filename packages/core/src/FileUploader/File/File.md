---
component: HvFile
status: stable
related: [HvFileUploader, HvFileUploaderPreview, HvProgressBar]
---

# HvFile

Part of HvFileUploader: one file row with its name, size, progress and status.

## When to use

- The uploader renders these from `fileList`; use it directly only for a custom file list beside a custom drop zone.

## What the consumer provides

- `data`: `progress` and `size` are in bytes (the bar shows `progress / size`); `preview` is an HvFileUploaderPreview.
- `onFileRemoved(file)` and `removeFileButtonLabel`: the remove button's name, with no default on HvFile (only HvFileUploader supplies one).
- HvFile renders an `li`: put it in a `ul` (HvFileList does).

## Spec

- Row on `bgContainer` with a `border` outline, bottom corners `radii.round`, `space.xs` padding and gap; name in `label`; preview in a square slot before the remove button.
- Status icon `positive` on success, `negative` on fail (the error text replaces the size); an HvProgressBar while `progress`.

## Don't

- Don't leave a file row without a status once upload starts: `progress`, then `success` or `fail` with `errorMessage`.
