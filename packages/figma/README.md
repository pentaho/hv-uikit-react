# @pentaho/uikit-figma

The Pentaho UI Figma library from code (private, not published). The code is the source of truth for the library's
variables, text styles, documentation pages and Code Connect templates; this package generates them and holds the
Figma plugin that applies them.

| What                      | From                                                                                                                                                                          | To                                  |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Variables and text styles | `@pentaho/uikit-styles/tokens/*` (DTCG, with the notes) and the theme's palette                                                                                               | `figma-sync.json`                   |
| Documentation pages       | `content/page-template.json` filled with `content/pages/*.json`                                                                                                               | the plugin bundle (`dist/code.js`)  |
| Code Connect templates    | `code-connect/library.json` (components, keys), `properties.json`, `overrides.json`, and the components' props (`@pentaho/uikit-react-core`'s `dist/component-metadata.json`) | `code-connect/generated/*.figma.ts` |

## Commands

Build `@pentaho/uikit-styles` and `@pentaho/uikit-react-core` first (their `dist` is read).

| Command                                           | Does                                                                                                                                         |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run generate -w packages/figma`              | Writes `figma-sync.json` and `code-connect/generated/`. `-- --check` only says what's stale.                                                 |
| `npm run build -w packages/figma`                 | Bundles the plugin, with the pages, as `dist/code.js`.                                                                                       |
| `npm run test -w packages/figma`                  | The tests (no build needed: they read the committed files).                                                                                  |
| `FIGMA_TOKEN=… npm run capture -w packages/figma` | Re-captures each component's properties from the library (`file_content:read`).                                                              |
| `FIGMA_TOKEN=… npm run compare -w packages/figma` | Compares the library's variables with `figma-sync.json`, read-only (Enterprise, `file_variables:read`); `-- --strict` exits 1 on a mismatch. |

CI (`.github/workflows/tests.yml`, job "Figma Library Sync") fails when the generated files aren't current
(`generate --check`), and parses the templates. With a `FIGMA_TOKEN` secret (`file_content:read`,
`file_variables:read`, and `file_code_connect:write` to publish) it also, read-only, compares the variables (each
mismatch a warning) and re-captures the properties (failing when they drifted), and on `master` publishes the templates
(`figma connect publish`). Only those steps see the token.

## The sync

Install the plugin from `manifest.json` (Plugins › Development › Import plugin from manifest) in the library file or a
branch of it, and load `figma-sync.json`: it previews, then **Apply** writes.

- Collections: **Primitives** (the palette, no scopes so it stays out of pickers), **Color** (Light and Dark, each
  color an alias of the primitive with its exact value), **Spacing**, **Radius**, **Typography**. Each variable has
  the scopes of what it's for (none for `dimmer` and the shadow color, which only feed other colors), its CSS
  variable as WEB code syntax (`var(--uikit-colors-primary)`) and the token's note as description.
- Each variable keeps what the last sync wrote (shared plugin data), so it is found again after a rename in Figma, and
  a difference is classified: the code moved (updated), a designer changed it (kept, listed as a proposal),
  both changed, or never synced with a different value (conflict, nothing written). Nothing is deleted. Colors compare as 8-bit channels.
- A variable never synced but already in the file under the same collection and name is adopted: unchanged when it
  has the code's values (only its baseline is written), updated when only its description, scopes or code syntax
  differ (the code owns those), else a conflict.
- An apply writes only what changed, plus a missing or stale baseline, so applying again writes nothing. The
  collections it makes are marked; a collection it didn't make never gets a mode added (a missing one is reported).
- Text styles (`Typography/<variant>`) are made when missing; an existing one is never written, only listed when it
  differs.
- **Render pages** draws each documentation page on the Figma page of its name, and redraws it in place. A page names
  library components and color variables, not node ids: in the library they are its own sets; in another file they
  are imported by key. The plugin replaces only what it marked (the page frame, its sections, the components area):
  a same-named frame or a section a designer made stays, and so do their own components unless the area names them.

A page's content (`content/pages/*.json`) is edited by hand in a pull request; the tests check that every component,
variant and color it names exists.

## Code Connect

One parserless template per Figma component. `library.json` says which UI Kit component each Figma component is
drawn for; `rules.ts` maps a property by its name and values against the component's props; `overrides.json` maps the
rest (or names a different snippet root with `element`, or `skip`s with a reason). Generation fails on any property
nothing maps, a stale override, or two components writing one file. Icons map to their `@phosphor-icons/react` name.

## Known limits

- The sync writes variables and text styles; shadows (effect styles), text styles bound to variables, and component
  descriptions aren't synced yet.
- In a file that uses the library, imported components keep the library's own variables, so the documentation's Dark
  panel shows them in their published mode; in the library itself they follow the page's mode.
- A component area's sets are only arranged in the library file (imported sets aren't moved).
- Figma's REST API has no plugin data, so `compare` says what differs, not who changed it; the plugin's preview does.
- Text styles and pages need the Plugin API; only variables can be written through the REST API.
