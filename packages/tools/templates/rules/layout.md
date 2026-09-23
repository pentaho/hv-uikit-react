# HV UI Kit Layout Rules

Rules for page and section layout, spacing, and loading states. Read these before building any page or section.

## Grid

- Build page and section layouts with `HvGrid`
  - Do not use ad-hoc `display: flex`, `display: grid`, or absolute positioning for layout
  - Control gaps with the `spacing`, `rowSpacing`, and `columnSpacing` props

## Container

- Use `HvContainer` to center and bound the main content of a page or section
  - Use one container per page or section region; do not wrap every component in one

## Spacing

- Use space tokens for all gaps, margins, and padding
  - `xxs` (4px), `xs` (8px), `sm` (16px), `md` (24px), `lg` (48px), `xl` (80px)
  - Never raw pixel values

## Consistency

- Keep spacing and layout structure consistent across sibling sections of the same page

## Loading States

Show loading feedback while data is being fetched or a process is running.

- Use `HvSkeleton` for initial content loads, sized and shaped like the content that will replace it (`variant="text"` for lines, `variant="circle"` for avatars, `variant="square"` for images) so the layout does not shift
- Use `HvLoading` for an in-progress process with no known final shape, such as submitting a form or running a query
- Use `HvLoadingContainer` to overlay existing content while a process runs
