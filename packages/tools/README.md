# @pentaho/uikit-tools

Tools for apps built with HV UI Kit and the coding agents that work on them: the UI Kit design rules ([templates/rules](templates/rules)), lookups of components, rules and theme tokens from the command line or over MCP (both return the same text), lint against the design rules, and `init`, which points the project's agents at all of it. The [Working with AI](https://pentaho.github.io/uikit-docs/master/docs/working-with-ai) guide walks through it for app developers.

Component props and guidance are read from the installed `@pentaho/uikit-react-core` (`dist/component-metadata.json`: types, JSDoc and each component's design note), and tokens from the installed `@pentaho/uikit-styles` (`dist/dtcg`), so they always match the app's UI Kit version.

## Set up an app

```bash
npm install --save-dev @pentaho/uikit-tools
npx --no-install uikit-tools init
```

`init` writes:

| File                    | Content                                                                                                                                                                                                                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AGENTS.md`             | A marked block that imports each rule file from the installed tools (`@node_modules/@pentaho/uikit-tools/templates/rules/<file>.md`) and lists the commands. The rest of the file is kept.                                                                                                         |
| `CLAUDE.md`             | `@AGENTS.md`, added if missing, so Claude Code loads the same block.                                                                                                                                                                                                                               |
| `.claude/settings.json` | Claude Code: the `uikit-tools hook` when it is about to finish, which sends the project's design-rule lint findings back to it, and the read-only lookups and the screenshots (`npm run shots`) allowed without asking. Other settings are kept.                                                   |
| `.claude/skills/*`      | In a Pentaho plugin (it has a `plugin.json`), copies of the plugin skills (`pentaho-plugin`, `pentaho-plugin-package`), with their reference files, where Claude Code, Copilot and Cursor load them. Codex and Gemini get them in `.agents/skills` (so do Copilot and Cursor without Claude Code). |

With `--agents cursor,codex,gemini` (or `all`), also `GEMINI.md`; Codex, Copilot and Cursor read `AGENTS.md` themselves. With `--mcp`, each agent's `hv-uikit` MCP server config too (`.mcp.json`, `.vscode/mcp.json`, `.cursor/mcp.json`, `.codex/config.toml`, `.gemini/settings.json`); with `--figma`, the skills for Figma screens and design reviews (`pentaho-figma-screens`, `pentaho-figma-review`).

The default is `--agents claude,copilot`; pass one to set up only that agent. Upgrading `@pentaho/uikit-tools` updates the rules and upgrading `@pentaho/uikit-react-core` the component guidance, without running `init` again; only the copied skills need `init` re-run to refresh.

## Commands

| Command                        | Output                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uikit-tools info <Component>` | Import, props and design guidance (the designers' note, variants, states, accessibility, the lint rules that check it). `info dialog` and `info HvDialog` both work; close names are suggested. Several at once (`info HvTable HvPagination`) give each one's guidance with its props by name. `--spec` adds the designers' spec (sizes and tokens); a hook (`info useHvSnackbar`) gives its declaration with its component's guidance. |
| `uikit-tools components`       | Every component with a one-line description; `--limit` and `--offset` page through them.                                                                                                                                                                                                                                                                                                                                                |
| `uikit-tools rules`            | Every design rule section by id (`<file>/<section>`).                                                                                                                                                                                                                                                                                                                                                                                   |
| `uikit-tools rule <id>`        | A rule section as written (`rule tokens/colors`), a whole rule file (`rule tokens`), or the lint rule a finding cites (`rule uikit/raw-elements`).                                                                                                                                                                                                                                                                                      |
| `uikit-tools tokens [words]`   | The theme tokens with their values (light and dark), what each is for, and where to use and avoid it; words filter them (`tokens border`).                                                                                                                                                                                                                                                                                              |
| `uikit-tools lint [paths]`     | The design rules over files or folders (default: the current folder), with the oxlint this package ships, so it works in any project. Exit 1 on findings, 2 when it can't run.                                                                                                                                                                                                                                                          |
| `uikit-tools hook`             | Claude Code's `Stop` hook (`init` adds it): before the agent finishes, runs `lint` on the project and returns the findings to it, once.                                                                                                                                                                                                                                                                                                 |
| `uikit-tools mcp`              | The `hv-uikit` MCP server on stdio, with `list_components`, `get_component`, `list_rules`, `get_rule`, `find_tokens` and `lint`, which return the same text as `components`, `info`, `rules`, `rule`, `tokens` and `lint`.                                                                                                                                                                                                              |

## Lint

To see the `lint` findings in your editor and CI as well, add the rules to your own lint setup. They ship as one plugin, `uikit/*`, run by oxlint and ESLint:

| Export                             | For                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| `@pentaho/uikit-tools/oxlint.json` | oxlint 1.63 or later: add it to `extends`. It loads the plugin and the matching `jsx-a11y` rules |
| `@pentaho/uikit-tools/lint`        | ESLint: `plugins: { uikit }`, and `uikit.configs.recommended.rules`                              |

The rules: `raw-elements`, `no-inline-style`, `no-raw-graphics`, `no-escape-hatches`, `no-hardcoded-values`, `theme-sizes`, `no-arbitrary-utilities`, `deprecated` (read from the installed UI Kit's types), `clickable-elements`, `icon-button-label` and `tag-label`. Each has a failing and a passing example in `src/lint`, tested in `lint.test.ts`; design notes cite them by id, and the test fails on a cited id that doesn't exist.

## Running it with a real agent

`test:e2e` runs without an agent. To try a real one, keep the app it builds and run Claude Code there (this uses API credits):

```bash
npm run test:e2e -w packages/tools -- --keep    # prints "Working in <dir>"; the app is <dir>/app
cd <dir>/app && npx --no-install uikit-tools init --mcp
claude -p --strict-mcp-config --mcp-config .mcp.json --permission-mode dontAsk \
  --allowedTools "Read Glob Grep Edit Write mcp__hv-uikit Bash(npx --no-install uikit-tools:*)" \
  "Answer from the HV UI Kit rules and uikit-tools lookups, not from memory: which HvButton variant should a form's main action use?"
```

Expect the agent to call `get_component` and answer `primary`, one per form.

## Development

```bash
npm run build -w packages/styles -w packages/core   # also writes the tokens (styles/dist/dtcg) and the component metadata (core/dist/component-metadata.json)
npm run build -w packages/tools
npm test -w packages/tools

# In an app outside the repo (needs the builds above):
npm run test:e2e -w packages/tools
```

The end-to-end script packs styles, core and tools into a temporary app and checks that the CLI and MCP agree, that `lint` and the hook report a design problem, that the docs page names only commands and MCP tools that exist, and that upgrades reach the agent without re-running `init`.
