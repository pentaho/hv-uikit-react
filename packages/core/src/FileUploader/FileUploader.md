---
component: HvFileUploader
status: stable
related: [HvFile, HvFileUploaderPreview, HvProgressBar]
---

# HvFileUploader

A drop zone plus a file list for choosing files from the device and following their upload.

## When to use

- Importing files (CSV, models, images) in a form or dialog, one or many.
- Showing an already uploaded file only: an HvListItem or link instead.

## What the consumer provides

- `label`: when omitted the drop zone shows the literal text "Label". With `hideLabels`, pass an `aria-label` through `inputProps`.
- `fileList` is controlled only: `onFilesAdded(files)` adds to your list (files of the wrong type or size already carry `status: "fail"` and an `errorMessage`); `onFileRemoved(file)` removes from it. `progress` and `size` are in bytes.
- The limits line beside the label is built from `maxFileSize` and `accept`; `labels.acceptedFiles` replaces it.

## Spec

- Drop zone: a focusable file input (Enter or Space opens the picker) on `bgContainer` with a dashed `textDisabled` border and `radii.round`; `text` border on hover and focus (plus the focus outline), `primary` while dragging; `bgDisabled` when disabled; "click to upload" in `label` weight, `space.md` inner margin.
- Files below as HvFile rows (`border`, `space.xs` padding) with an HvProgressBar while uploading; each remove button has a tooltip name.

## Don't

- Don't leave uploads with no feedback: set each file's `status` (`progress`, `success`, `fail`) and `errorMessage`.
- Don't drop files that fail validation: keep them in `fileList` so their error shows, and upload only the others.
