---
component: HvFileUploaderPreview
status: stable
related: [HvFileUploader, HvFile, HvButton]
---

# HvFileUploaderPreview

Part of HvFileUploader: the thumbnail slot of a file, optionally a button that opens it.

## When to use

- As a file's `preview` in the uploader's `fileList`, e.g. an image thumbnail; with `onClick` it opens a larger view.

## What the consumer provides

- Without `onClick` it renders `children` as is (pass the image or icon straight as `preview`); with it, it is a button that needs an `aria-label`. `disableOverlay` only matters with `onClick`.

## Spec

- A small HvButton-based square with `radii.base`; when clickable, hovering shows a `primaryDimmed` overlay with an eye icon.

## Don't

- Don't leave a clickable preview with no name: give it an `aria-label` ("Preview report.png").
- Don't leak object URLs: revoke them in `onUnload`.
- Don't pass an inline `onUnload`: memoize it (`useCallback`), or the URL is revoked on every render.
