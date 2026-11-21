---
name: pentaho-figma-screens
description: Design Pentaho screens in Figma from a request, with the Pentaho UI library - one frame per view and state, built from its components, variables and text styles, for a designer to review. Use when someone wants screens, a mock-up or a design for a Pentaho page or feature, before or instead of code. To check them, pentaho-figma-review.
license: Apache-2.0
compatibility: Needs a Figma MCP server with write access to a draft file, and @pentaho/uikit-tools installed in the project.
---

# Pentaho screens in Figma

**Working with the person.** Whoever asks may not be technical: talk in their words, and don't show them paths, JSON
or code. When someone is there, confirm what you'll design in plain words first. When no one will answer, design what
the request says and list your assumptions in the hand-off.

**Tools.** Figma's MCP server to search the design system, import and compose; the UI Kit tools (or the `hv-uikit`
MCP server) for the component each need maps to in code: `npx --no-install uikit-tools info <Component> --spec`,
`components`, `tokens <word>`.

## 1. What to design

From the request: each view (screen), what it shows and what people do there, and the states that need their own
frame: a view that loads data has loading, empty and error frames (rule `components/data-states`), plus details open,
confirm delete. Titles in sentence case (rule `content`).

## 2. The frames

- **Where:** a draft Figma file for this feature, never the Pentaho UI library's main file.
- **From the library:** **Pentaho UI** (file `2VFXBat8b1Qj7upl6oHKqZ`): enable it in the file, or import its
  components, variables and text styles by key, searching that library only. Each component has its own page there,
  named as in code without `Hv` (Button, Table). Build only from them. Don't draw components by hand or use a
  look-alike library; bind every color, space and text style. Code names map to Figma's by group: `title2` is
  `Typography/title2`, `space.md` is `space/md`, `bgOverlay` is `Surfaces/bgOverlay`.
- **One frame per view and state,** 1440 wide, as the app frames it: the library's Header (48px, with this
  feature's labels) on top, then the view padded `space.md`, its parts `space.md` apart, opening with its title
  (`title2`) and a description in `text` `space.sm` below (`textSubtle` is for containers); filters and the page's
  actions in one toolbar row above what they act on. A dialog sits over its screen, dimmed with `bgOverlay`.
- **Mapped to code:** for each need, use the component the UI Kit names (`info <Component> --spec`), so every frame can be
  built as it is. A need the library doesn't cover, or a composite that doesn't fit (a table's columns, a dialog's
  content), is a design-system gap: compose a frame from its parts with the same bindings, not a new component, named
  `GAP: <what>` (`GAP: usage bars`), and say so.

## 3. Hand-off

The file's link and the frames it holds, what's still open, then a note under four short headings: **Library
components used**, **Built by hand** (the `GAP:` layers), **Differs from code**, **Worth adding to the UI** (a line or
two each; "none" when empty). Changes the designer asks for are made in Figma. `pentaho-figma-review` checks them;
once they're approved, they're built with the UI Kit components each frame names.
