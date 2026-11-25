# @pentaho/uikit-cli

Creates UI Kit apps and Pentaho plugins, and packages plugins for a Pentaho server.

This version isn't published yet (it's `private` until released with `@pentaho/uikit-tools`): in this repository, run
it as `node packages/cli/dist/index.js` after `npm run build -w packages/cli`.

```sh
npx @pentaho/uikit-cli@latest --help
npx @pentaho/uikit-cli@latest create --help
```

## Creating an app

```sh
npx @pentaho/uikit-cli@latest create              # asks what to create, in an interactive terminal
npx @pentaho/uikit-cli@latest create my-app       # an App Shell app; -t vite for a plain one
npx @pentaho/uikit-cli@latest create my-app --features help-link --no-auto-routes
```

Without a name, `create` asks only for what the flags didn't give. It won't write into a folder that has files unless you pass `--force`, which empties it first (keeping `.git`). `.` creates in the current folder. New apps lint with the UI Kit design rules (`@pentaho/uikit-tools`).

### Coding agents

`create` can install the dependencies and set up coding agents (`AGENTS.md`, the design rules, Claude Code's lint hook, the plugin skills in a plugin: what `uikit-tools init` writes; MCP servers only with `uikit-tools init --mcp`):

```sh
npx @pentaho/uikit-cli@latest create my-app --agents claude,cursor   # claude, copilot, cursor, codex, gemini, or all
npx @pentaho/uikit-cli@latest create my-app --no-agents              # only install, and no question
npx @pentaho/uikit-cli@latest create my-app --no-install             # neither (init needs the install), no question
```

In an interactive terminal (outside CI) without these flags, it asks whether to do it and for which agents. Anywhere else (CI, a pipe) it does neither, so scripts and agents can run it unattended; run `npm install` and `npx --no-install uikit-tools init` yourself then. If the install or `init` fails, the project stays and the error says what is left to run.

## Pentaho plugins

```sh
npx @pentaho/uikit-cli@latest create job-health -t plugin [--title "Job health"]
cd job-health && npm install
npm run dev       # the plugin in a local App Shell, on sample data (samples.json)
npm run check     # format, types and lint, with the UI Kit design rules
npm test          # unit tests
npm run package   # uikit-cli package: build, check the bundles against plugin.json, and zip (--built: use dist)
npm run shots     # uikit-cli shots: screenshot the running views listed in review/shots.json into review/
```

`package` writes `<id>.zip`, to unzip into a Pentaho server's `pentaho-solutions/system`. The server-side layout is not yet verified on a server. The [Pentaho plugins guide](https://pentaho.github.io/uikit-docs/master/app-shell/pentaho-plugins) covers the project, the zip, samples, coding agents and the known limits.

`shots` takes every screenshot in one browser session, each at the full height of the App Shell's scrolling main panel. It uses the project's Playwright (the templates pin it) and its Chromium: `npx playwright install chromium` once, or it falls back to an installed Chrome. `review/shots.json` lists each shot (`[{ "name": "03-delete", "url": "http://localhost:5173/connections", "steps": [{ "click": "Delete" }] }]`); `npx uikit-cli shots --help` lists the steps (`click`, `fill`, `press`, `wait`), `width` and `dark`.

The CLI needs Node 22.22, 24.15 or 26 and later.

Exit codes: 0 done, 1 a check failed (`package`) or a shot did (`shots`), 2 a usage or run error, 130 canceled.

## How to test

```sh
npm test -w packages/cli -- --run   # create, package, shots
npm run test:apps -w packages/cli   # each template's app built and checked (slow)
npm run test:e2e -w packages/cli    # the packed CLI outside the repo
```

## License

This project is licensed under the terms of the [Apache 2.0 license](/LICENSE.md).
