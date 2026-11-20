# Layout Rules

## Introduction

Page and section layout, and loading states.

## Grid

- Build columns that change with the screen with `HvGrid` (`container`, items with `size`); its gaps come from the `spacing`, `rowSpacing` and `columnSpacing` props.
- Build a simple row or stack with flex or grid classes and token gaps (`flex flex-col gap-md`, `grid grid-cols-1 md:grid-cols-3 gap-sm`), or `css()` with `theme.space`.
- Don't use absolute positioning or raw pixel gaps for layout (`tokens/spacing`).

## Container

- Use `HvContainer` to center and bound the main content of a page or section, never a hand-written `max-w-*` with side padding.
- Use one container per page or section region; don't wrap every component in one.

## Consistency

- Keep spacing and layout structure consistent across sibling sections of the same page.

## Loading states

Show loading feedback while data is being fetched or a process is running.

- Use `HvSkeleton` for initial content loads, sized and shaped like the content that will replace it (`variant="text"` for lines, `variant="circle"` for avatars, `variant="square"` for images) so the layout doesn't shift.
- Use `HvLoading` for an in-progress process with no known final shape, such as submitting a form or running a query.
- Use `HvLoadingContainer` to overlay content already on screen while it refreshes.
