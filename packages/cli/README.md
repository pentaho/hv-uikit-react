# @pentaho/uikit-cli

Creates UI Kit apps and Pentaho plugins, and packages plugins for a Pentaho server.

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

Given a name, `create` never prompts, so agents and CI can run it; without one, it asks only for what the flags didn't give. It won't write into a folder that has files unless you pass `--force`, which empties it first (keeping `.git`). `.` creates in the current folder. New apps lint with the UI Kit design rules (`@pentaho/uikit-tools`); run `npx --no-install uikit-tools init` in the app to set up coding agents.

## Pentaho plugins

```sh
npx @pentaho/uikit-cli@latest create job-health -t plugin [--title "Job health"]
cd job-health && npm install
npm run dev       # the plugin in a local App Shell, on sample data (samples.json)
npm run check     # format, types and lint, with the UI Kit design rules
npm test          # unit tests
npm run package   # uikit-cli package: build, check the bundles against plugin.json, and zip (--built: use dist)
```

`package` writes `<id>.zip`, to unzip into a Pentaho server's `pentaho-solutions/system`. The server-side layout is not yet verified on a server. The [Pentaho plugins guide](https://pentaho.github.io/uikit-docs/master/app-shell/pentaho-plugins) covers the project, the zip, samples, coding agents and the known limits.

The CLI needs Node 22.22, 24.15 or 26 and later.

Exit codes: 0 done, 1 a check failed (`package`), 2 a usage or run error, 130 canceled.

## How to test

```sh
npm test -w packages/cli
```

## License

This project is licensed under the terms of the [Apache 2.0 license](/LICENSE.md).
