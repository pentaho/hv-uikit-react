---
name: pentaho-plugin
description: Build a Pentaho plugin from a request or an approved Figma design - working pages in the Pentaho app frame on sample data, with the real UI components and checked against the design rules, or a change to an existing plugin. Use whenever someone asks for a page, view, admin tool or feature in Pentaho. For screens in Figma first, pentaho-figma-screens; to package the plugin for a server, pentaho-plugin-package.
license: Apache-2.0
compatibility: Needs Node 22.22+, 24.15+ or 26+, npm access to @pentaho/uikit-cli and @pentaho/uikit-tools, and a browser tool for the screenshots.
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

## 2. The project

```sh
npx @pentaho/uikit-cli create <id> -t plugin --title "<Title>" && cd <id> && npm install --no-fund --no-audit && npx --no-install uikit-tools init --agents <yours>
```

The id is lowercase words joined by hyphens; `--agents` is claude, copilot, cursor, codex or gemini. `plugin.json`
describes the plugin: its `menu` (a label, and an icon of the App Shell's set: `Calendar`, `Job`, `Time`, `Report`,
`DataSource`, `Settings`, `User` or `Folders`) and one entry per view (`id`, `title`, `route`, /-led). Each view's page
is `src/pages/<view id>.tsx`; add a view by adding both.

## 3. The pages

- Each page is its view, every state included, in the shared `ViewLayout` (it sets the page's margins). Look each
  component up first (`npx --no-install uikit-tools info HvTable`). The
  App Shell provides `HvProvider`, the theme, the fonts and the snackbar provider (call `useHvSnackbar`): don't add them.
- Layout: filters and the page's actions in one toolbar row above what they act on, each control sized to its
  content, never full width; a row's details or edits in an `HvDialog`, not a drawer; `gap-sm` within a group,
  `gap-md` between groups.
- With a design, build each approved screen with the components the lookups name; the frames (or their images)
  are the reference, and they win over this skill's defaults (a drawer they show, their row count).
- Server calls go through `src/lib/api.ts`. After an action succeeds, update the page from its own state, not by
  asking for the data again.

## 4. Sample data

`samples.json` answers every call, keyed `"METHOD /path"` (`{param}` matches any value; `null` for no body; `{"$status": 503}` for an error), with
`"$written"`: today (YYYY-MM-DD), so its dates stay as old as written. Data people believe: 20 to 30 rows for a list,
every filter's values present, real-looking names and dates, one long name and one missing optional field. A state
with other data is a file of only what changes, `samples.<state>.json`, shown by opening the page with
`?samples=<state>`. Samples ignore query strings, so search, filters and paging run on the page; server-side paging is
an open question for the hand-off. Never edit `samples.json` for a state, and never fake a response in the browser.

## 5. Check and review

After each page, `npm run format && npm run check` until it's clean (`uikit-tools lint` alone checks only the design
rules). Tests: one per view, rendering it on the samples (`answerFromSamples()` from
`src/tests/samples.ts`) and doing its main action. Then run it (`npm run dev`, or `npm run dev -- --port <n>` when the port is taken) and shoot every view and
state in one browser session, at 1440 wide and the main state at 390, waiting for each page's heading rather than a
fixed time, into the plugin's `review/<nn>-<state>.png`. Look at each (beside its design screen, if there is one), fix what's wrong
and reshoot only the states a fix touches. Stop the server when done. Without a browser tool, say so: the states
weren't seen.

## 6. Hand-off

What was built, what's still open (assumptions, questions about real data) and any design-system gaps, in plain words.
Claim only what a screenshot showed: a state you couldn't show is open, not done.

**Changing an existing plugin:** change only what was asked, update `plugin.json` if the views change, then check and
review as above, re-shooting every state the change touches.
