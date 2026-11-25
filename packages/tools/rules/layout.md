# Layout Rules

## Grid

- Lay out rows, stacks and columns with flex or grid utility classes, token gaps and breakpoint prefixes (`flex flex-col gap-md`, `grid grid-cols-1 md:grid-cols-3 gap-sm`, `md:col-span-2`), or `css()` with `theme.space`.
- `HvGrid` only when the layout must follow the design system's column grid (`columns="auto"`: 4, 8 or 12 columns by breakpoint) or the approved design sets column spans.
- Don't use absolute positioning or raw pixel gaps for layout (`tokens/spacing`).

## Container

- `HvContainer` centers and caps a page's width. In a Pentaho plugin the App Shell already wraps every view in one: don't add another.
- To keep a form or a reading column narrow, a breakpoint width class (`max-w-sm`), never an arbitrary `max-w-[…]` with side padding.

## Page header

The page's title, with its page-wide action at the right: the main thing to do there ("New subscription"), or on a list with nothing to create, the action on the whole list ("Refresh"). A form's Save stays at the form's end (`forms/fields-and-actions`).

## Narrow screens

Every page holds up at 390 px wide with no sideways scroll. Toolbar controls go full width (`w-full sm:w-auto`); a fixed width (`w-80`, `min-w-64`) takes a breakpoint (`md:w-80`); columns stack below `md`.

## Loading states

`HvSkeleton` shaped like the content for a first load, `HvLoading` for a process (a submit, a query), `HvLoadingContainer` over content that refreshes. `HvLoading` and `HvEmptyState` sit in the middle of the area they stand in for, never at its top: give them its height (`min-h-80` on a page, `h-full` in a panel); `HvLoading` then centers itself, `HvEmptyState` also needs `items-center` (it centers only across).
