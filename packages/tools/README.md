# @pentaho/uikit-tools

Tools for apps built with HV UI Kit and the coding agents that work on them:

- **The UI Kit design rules**, in [templates/rules](templates/rules), which agents read before writing UI.
- **Lookups** of components, design rules and theme tokens, from the command line or over MCP. Both return the same text.
- **Lint** of code against the design rules, from the command line, over MCP, or after each edit in Claude Code.
- **`init`**, which points the project's agents at the rules and the MCP server.

Component props and guidance are read from the metadata shipped in the installed `@pentaho/uikit-react-core` (`dist/component-metadata.json`: the components' types and JSDoc, and the design note beside each component), and tokens from the installed `@pentaho/uikit-styles` (`dist/dtcg`), so they always match the UI Kit version the app uses.

## Set up an app

```bash
npm install --save-dev @pentaho/uikit-tools
npx --no-install uikit-tools init
```

`init` writes:

| File                    | Content                                                                                                                                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AGENTS.md`             | A marked block that imports each rule file from the installed tools (`@node_modules/@pentaho/uikit-tools/templates/rules/<file>.md`) and lists the commands. The rest of the file is kept.               |
| `CLAUDE.md`             | `@AGENTS.md`, added if missing, so Claude Code loads the same block.                                                                                                                                     |
| `.mcp.json`             | The `hv-uikit` MCP server for Claude Code. Other servers are kept.                                                                                                                                       |
| `.claude/settings.json` | Claude Code: the `uikit-tools hook` after each edit, which sends the design-rule lint findings in the file back to the agent, and the read-only lookups allowed without asking. Other settings are kept. |
| `.claude/skills/*`      | Claude Code: the Figma skills (`pentaho-figma-screens`, `pentaho-figma-review`), copied; re-run `init` after an upgrade to refresh them. Other agents read them from `node_modules` through `AGENTS.md`. |
| `.vscode/mcp.json`      | The `hv-uikit` MCP server for Copilot. Other servers are kept.                                                                                                                                           |

With `--agents cursor,codex,gemini` (or `all`), also `.cursor/mcp.json`, `.codex/config.toml` and `GEMINI.md` with `.gemini/settings.json`. Codex reads `AGENTS.md` itself.

Upgrading `@pentaho/uikit-tools` updates the rules and upgrading `@pentaho/uikit-react-core` updates the component guidance, without running `init` again. Use `--agents claude` or `--agents copilot` to set up one agent.

## Commands

| Command                        | Output                                                                                                                                                                                                                     |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uikit-tools info <Component>` | Import, props and design guidance (the designers' note, variants, states, accessibility, the lint rules that check it). `info dialog` and `info HvDialog` both work; close names are suggested.                            |
| `uikit-tools components`       | Every component with a one-line description; `--limit` and `--offset` page through them.                                                                                                                                   |
| `uikit-tools rules`            | Every design rule section by id (`<file>/<section>`).                                                                                                                                                                      |
| `uikit-tools rule <id>`        | A rule section as written (`rule tokens/colors`), or a whole rule file (`rule tokens`).                                                                                                                                    |
| `uikit-tools tokens [words]`   | The theme tokens with their values (light and dark), what each is for, and where to use and avoid it; words filter them (`tokens border`).                                                                                 |
| `uikit-tools lint [paths]`     | The design rules over files or folders (default: the current folder), with the oxlint this package ships, so it works in any project. Exit 1 on findings, 2 when it can't run.                                             |
| `uikit-tools hook`             | Claude Code's `PostToolUse` hook (`init` adds it): runs `lint` on the file just written and returns the findings to the agent.                                                                                             |
| `uikit-tools mcp`              | The `hv-uikit` MCP server on stdio, with `list_components`, `get_component`, `list_rules`, `get_rule`, `find_tokens` and `lint`, which return the same text as `components`, `info`, `rules`, `rule`, `tokens` and `lint`. |

## Lint

`npx --no-install uikit-tools lint <paths>` checks code against the design rules in any project, with the oxlint this package ships; agents run it through the `lint` MCP tool, and Claude Code after every edit through the hook. To see the findings in your editor and CI as well, add the rules to your own lint setup. They ship as one plugin, `uikit/*`, run by oxlint and ESLint:

| Export                             | For                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| `@pentaho/uikit-tools/oxlint.json` | oxlint 1.63 or later: add it to `extends`. It loads the plugin and the matching `jsx-a11y` rules |
| `@pentaho/uikit-tools/lint`        | ESLint: `plugins: { uikit }`, and `uikit.configs.recommended.rules`                              |

The rules: `raw-elements`, `no-inline-style`, `no-raw-graphics`, `no-escape-hatches`, `no-hardcoded-values`, `theme-sizes`, `no-arbitrary-utilities`, `deprecated` (read from the installed UI Kit's types), `clickable-elements`, `icon-button-label` and `tag-label`. Each has a failing and a passing example in `src/lint`, tested in `lint.test.ts`; design notes cite them by id, and the test fails on a cited id that doesn't exist.

## Running it with a real agent

`test:e2e` covers setup, lookups and upgrades without an agent. To see an agent go through it, keep the app it builds and run Claude Code there (this uses API credits):

```bash
npm run test:e2e -w packages/tools -- --keep    # prints "Working in <dir>"; the app is <dir>/app
cd <dir>/app
claude -p --strict-mcp-config --mcp-config .mcp.json --permission-mode dontAsk \
  --allowedTools "Read Glob Grep Edit Write mcp__hv-uikit Bash(npx --no-install uikit-tools:*)" \
  "Answer from the HV UI Kit rules and uikit-tools lookups, not from memory: which HvButton variant should a form's main action use?"
```

Expect the agent to call `get_component` and answer `primary`, one per form.

## Development

```bash
npm run extract:contracts -w packages/core    # component metadata → packages/core/dist/component-metadata.json
npm run build -w packages/tools
npm test -w packages/tools

# In an app outside the repo (needs full builds):
npm run build -w packages/styles -w packages/core
npm run test:e2e -w packages/tools
```

The end-to-end script packs styles, core and tools, installs them in a temporary app, and checks that the CLI and MCP return the same answers, that `lint` and the hook report a design problem, that the docs page names only commands and tools that exist, and that upgrades change the rules and component guidance without re-running `init`.

Not done yet: publishing to npm, and adding the tools to `uikit-cli create`.
