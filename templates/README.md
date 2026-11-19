# Templates

The apps `npx @pentaho/uikit-cli create` starts from, each a complete, runnable workspace app:

| Template | `create -t`     | For                                                                                                                  |
| -------- | --------------- | -------------------------------------------------------------------------------------------------------------------- |
| `app`    | `app` (default) | An app in the App Shell: each folder in `src/pages` is a view with its route and menu entry.                         |
| `vite`   | `vite`          | A standalone app without the App Shell, with its own routes and header.                                              |
| `plugin` | `plugin`        | A Pentaho plugin: an App Shell app described by `plugin.json`, run on sample data and packaged for a Pentaho server. |

All three share the same scripts (`dev`, `build`, `preview`, `test`, `check`, `lint`, `format`; the plugin adds `package`), test setup, lint config (with the UI Kit design rules) and `AGENTS.md` layout.

In the repository, their `@pentaho/*` dependencies are the workspace packages (`*`); `create` writes the released versions. Work on one like any workspace app (`npm run dev -w templates/app`); the CLI's tests create each one and run its checks, build and tests.
