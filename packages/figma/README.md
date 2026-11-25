# @pentaho/uikit-figma

The Pentaho UI Figma library from code (private, not published). The code is the source of truth for the library's
variables, text styles, documentation pages and Code Connect templates. This package generates them, and builds the
scripts a coding agent runs in a Figma file through Figma's MCP server to write them there. The two-way sync (keeping a
designer's edits, conflicts, comparing a file with the code) comes in a later pull request.

| What                      | From                                                                                                                                                                          | To                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Variables and text styles | `@pentaho/uikit-styles/tokens/*` (DTCG, with the notes) and the theme's palette                                                                                               | `figma-sync.json`, then `dist/agent/library/` |
| Documentation pages       | `content/page-template.json` filled with `content/pages/*.json`                                                                                                               | `dist/agent/pages/<page>/`                    |
| Code Connect templates    | `code-connect/library.json` (components, keys), `properties.json`, `overrides.json`, and the components' props (`@pentaho/uikit-react-core`'s `dist/component-metadata.json`) | `code-connect/generated/*.figma.ts`           |

## Commands

Build `@pentaho/uikit-styles` and `@pentaho/uikit-react-core` first (their `dist` is read).

| Command                               | Does                                                                                         |
| ------------------------------------- | -------------------------------------------------------------------------------------------- |
| `npm run generate -w packages/figma`  | Writes `figma-sync.json` and `code-connect/generated/`. `-- --check` only says what's stale. |
| `npm run build -w packages/figma`     | Writes the agent scripts to `dist/agent/`.                                                   |
| `npm test -w packages/figma -- --run` | The tests (no build needed: they read the committed files).                                  |

CI (`.github/workflows/tests.yml`, job "Figma Library Sync") fails when the generated files aren't current, parses
the templates and builds the agent scripts. CI never writes to Figma: publishing the Code Connect templates
(`npx figma connect publish`, with `file_code_connect:write`) is a manual step, agreed with the design team.

## Writing the library with an agent

Figma's REST API can't write text styles or draw pages, so an agent writes them with the Plugin API, through the
Figma MCP server's `use_figma` tool. Never point it at the published library: use a branch of it or a test file.

1. `npm run build -w packages/figma`.
2. **The core:** pass `dist/agent/core.js` to `use_figma`, exactly as it is. It stores the code that writes on the
   file, once (again after a rebuild: a task's scripts refuse another build's core).
3. **The variables and text styles:** the same with each script in `dist/agent/library/`, in order. The first ones
   store the data on the file; the last one checks it and the core arrived unchanged, writes, and returns a
   report. Collections and variables are matched by name, made where missing and rewritten where they exist (a
   designer's edit to one is overwritten). Text styles too.
4. **A documentation page:** the same with `dist/agent/pages/<page>/`, once the variables and text styles are in the
   file. It draws on the Figma page of that name (made when missing), with the library's components (the file's own,
   else imported by key), and redraws in place; a frame or section a designer made is kept.

`use_figma` takes at most 50,000 characters, so the data is packed (`src/agent/pack.ts`: the palette as hex per
family, the rest as tuples over shared tables) and split in slices of 20,000 characters, which an agent passes on
reliably. If a script was altered on the way, the last one says so and writes nothing: run the task's scripts again,
from the first.

## The sync file

`figma-sync.json` holds the library's variables and text styles:

- Collections: **Primitives** (the palette, no scopes so it stays out of pickers), **Color** (Light and Dark, each
  color an alias of the primitive with its exact value), **Spacing**, **Radius**, **Typography**. Each variable has
  the scopes of what it's for (none for `dimmer` and the shadow color, which only feed other colors), its CSS
  variable as WEB code syntax (`var(--uikit-colors-primary)`) and the token's note as description.
- Text styles: `Typography/<variant>`.

## Code Connect

One parserless template per Figma component. `library.json` says which UI Kit component each Figma component is
drawn for; `rules.ts` maps a property by its name and values against the component's props; `overrides.json` maps the
rest (or names a different snippet root with `element`, or `skip`s with a reason). Generation fails on any property
nothing maps, a stale override, or two components writing one file. Icons map to their `@phosphor-icons/react` name.

## Known limits

- Writing is one way: the code wins. Keeping a designer's edits and reporting conflicts is the later two-way sync.
- Shadows (effect styles), text styles bound to variables, and component descriptions aren't written yet.
- In a file that uses the library, imported components keep the library's own variables, so a page's Dark panel shows
  them in their published mode; in the library itself they follow the panel's mode. The components area is drawn only
  in the library itself (imported sets aren't moved).
- `properties.json` is captured from the library; the script that refreshes it comes back with the sync.
