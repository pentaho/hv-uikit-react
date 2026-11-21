---
name: pentaho-plugin
description: Build a Pentaho plugin from a request or an approved Figma design - working pages in the Pentaho app frame on sample data, with the real UI components and checked against the design rules, or a change to an existing plugin. Use whenever someone asks for a page, view, admin tool or feature in Pentaho. For screens in Figma first, pentaho-figma-screens (set up with `uikit-tools init --figma`); to package the plugin for a server, pentaho-plugin-package.
license: Apache-2.0
compatibility: Needs Node 22.22+, 24.15+ or 26+, npm access to @pentaho/uikit-cli and @pentaho/uikit-tools, and Playwright for the screenshots.
---

# Pentaho plugin

**Working with the person.** Whoever asks may not be technical: talk in their words, and don't show them paths, JSON
or code. When someone is there, confirm what you'll build in plain words first. When no one will answer, build what
the request says and list your assumptions in the hand-off.

**Tools.** The UI Kit CLI (`npx @pentaho/uikit-cli create <name> -t plugin`, and the project's `npm run`
scripts) for the plugin's structure; the UI Kit tools (`npx --no-install uikit-tools info | tokens | lint`, or the
`hv-uikit` MCP server) for the components and the design rules. Write commands so they run where no one approves
them: `env NAME=value npm …`, never a subshell.

## 1. What to build

From the request, and the design if there is one: each view (screen), what it shows and what people do there; the
states that need their own screen (empty, details open, confirm delete, an error); the data each view reads and
writes. Titles in sentence case. When you're not sure what a real server would return, say so as an open question.

Decide what each view is for, and build that shape:

- A list people act on: [table.md](table.md).
- A record's details or settings: an `HvSection` per group of fields (`forms`), one Save at the end. A row's details
  and short edits open in an `HvDialog`; a long form takes the list's place in the same view, with a way back (routes
  take no ids); a drawer only when the design shows one.
- Steps in order (creating a schedule): one page, an `HvSection` per step in order, Back and Next, the final action at
  the end. The UI Kit has no wizard, and a dialog holds one short step at most.
- A hierarchy beside its contents (folders and files): an `HvTreeView` (with an `aria-label`) in one column of
  `grid grid-cols-1 md:grid-cols-3 gap-md`, the table in the other two (`md:col-span-2`), so they stack below `md`.
- Reading the selected item is the page's job (a log, a run's output, a folder's files): the item beside the list
  (`grid grid-cols-1 md:grid-cols-3 gap-md`, the item in `md:col-span-2`), below it on narrow screens; not a dialog,
  which would cover the list between every pick, and not a drawer.
- A summary of how things are doing: [summary.md](summary.md).

A view can combine them: a summary above the list it summarises.

## 2. The project

```sh
npx @pentaho/uikit-cli create <id> -t plugin --title "<Title>" --agents <yours> && cd <id>
```

The id is lowercase words joined by hyphens; `--agents` (claude, copilot, cursor, codex, gemini or all) installs the
dependencies, then sets those agents up as `uikit-tools init` does. `plugin.json`
describes the plugin: its `menu` (a label, and an icon of the App Shell's set: `Calendar`, `Job`, `Time`, `Report`,
`DataSource`, `Settings`, `User` or `Folders`) and one entry per view (`id`, `title`, `route`, /-led). For an admin
page, nest the menu entry under the server's Settings with `"parent": "settings"`. Each view's page is
`src/pages/<view id>.tsx`; add a view by adding both. A route is fixed words (no `:id`) and the menu opens the first
view: keep a feature on one view, a record in a dialog or in place of the list, and add a view only for another menu
destination. Who may see a page, and translations beyond the menu label, aren't set by the plugin: say so when the
request asks.

## 3. Sample data

Server calls go through `src/lib/api.ts`, with the Pentaho server's path when you know it (`api/scheduler/…`);
otherwise name one and list it as an open question. `samples.json` answers every call, keyed `"METHOD /path"`
(`{param}` matches any value; `null` for no body; `{"$status": 503}` for an error), with `"$written"`: today
(YYYY-MM-DD), so its dates stay as old as written. Data people believe: 20 to 30 rows for a list, every filter's
values present, real-looking names and dates, one long name and one missing optional field. A state with other data
is a file of only what changes, `samples.<state>.json`, shown by opening the page with `?samples=<state>`. Samples
ignore query strings, so search, filters and paging run on the page; server-side paging is an open question for the
hand-off. Never edit `samples.json` for a state, and never fake a response in the browser. Compute "today" in one
place in `src/lib`, and pin it in tests (`vi.setSystemTime`).

## 4. The pages

- Each page is its view, every state included, in the shared `ViewLayout` (it sets the page's margins; its `actions`
  hold the page-wide action, `layout/page-header`). Look the components up first, several at once
  (`npx --no-install uikit-tools info HvTable HvPagination`). The App Shell provides `HvProvider`, the theme, the
  fonts, the page's `HvContainer` and the snackbar provider (call `useHvSnackbar`): don't add them.
- Filters and the actions on what's listed in one toolbar row above what they act on, each control sized to its
  content from `sm` up (`layout/narrow-screens`); `gap-sm` within a group, `gap-md` between groups.
- With a design, build each approved screen with the components the lookups name; the frames (or their images)
  are the reference, and they win over this skill's defaults (a drawer they show, their row count). A layer
  that's no instance of the library (or named `GAP: …`) is built by hand: list it under **Built by hand**.
- After an action succeeds, update the page from its own state, not by asking for the data again.

## 5. Check and review

After each page, `npm run format && npm run check` until it's clean (`uikit-tools lint` alone checks only the design
rules). Tests: one per view, rendering it on the samples (`answerFromSamples()` from
`src/tests/samples.ts`) and doing its main action. Then run it (`npm run dev`, or `npm run dev -- --port <n>` when the port is taken) and shoot every view and
state with `npm run shots`: list them in `review/shots.json` (`<nn>-<state>` names, the steps that reach each state,
the main state also at `"width": 390` and with `"dark": true`; `npx --no-install uikit-cli shots --help`). It takes
them in one browser session, at full height, into `review/<nn>-<state>.png`; the first time, it may ask you to install
Playwright. Look at each (beside its design screen, if there is one), fix what's wrong
and reshoot only the states a fix touches. Stop the server when done. When no screenshot can be taken, say so: the
states weren't seen.

## 6. Hand-off

What was built and what's still open (assumptions, questions about real data), in plain words, then a note under
four short headings: **Library components used**, **Built by hand**, **Differs from code** (from the design, or
from what the lookups said), **Worth adding to the UI** (a line or two each; "none" when empty). Claim only what a screenshot showed: a state you couldn't show is open, not done.

**Changing an existing plugin:** change only what was asked, update `plugin.json` if the views change, then check and
review as above, re-shooting every state the change touches.
