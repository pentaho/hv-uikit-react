# @pentaho/uikit-cli

This CLI provides a way to automate tasks you regularly perform as part of your development workflow.

Whether it is quickly starting a new application or scaffolding out components, it will help you standardize these tasks in a consistent and predictable manner.

## Usage

For usage documentation, run the CLI with the `--help` option for any `<command>`. Examples:

```sh
npx @pentaho/uikit-cli@latest --help
npx @pentaho/uikit-cli@latest <command> --help
```

## Creating an App

You can create a new app using the provided baseline.

To get started, use the following command:

```sh
npx @pentaho/uikit-cli@latest create
```

It launches an interactive experience that guides you through setting up a new app.

You can also directly specify the app name. For example:

```sh
npx @pentaho/uikit-cli@latest create MyAppName
```

## How to test

You can run the project locally by executing the following command:

```
node <path-to-repo>/uikit-cli/src/index.js create
```

## License

This project is licensed under the terms of the [Apache 2.0 license](/LICENSE.md).

## Migrating from v6 to v7

Upgrade an application's UI Kit usage in place:

```shell
npx @pentaho/uikit-cli@latest migrate ./src
```

It rewrites what can be changed safely — the `@pentaho/*` package scope, the
`uikit-react-pentaho` -> `uikit-react-widgets` rename, `disable*` -> `hide*`
input props, `HvGrid` `item`/breakpoint props to `size`, the `pentahoPlus`
theme name — and updates the dependency entries in `package.json`.

Anything needing a decision (removed components, props whose behaviour changed)
is reported rather than edited, with a file and line reference.

Use `--dry` to preview:

```shell
npx @pentaho/uikit-cli@latest migrate ./src --dry
```

While v7 is published under the `next` tag, pass `--pre` so the dependency
ranges resolve:

```shell
npx @pentaho/uikit-cli@latest migrate ./src --pre
```

Dependencies change, so reinstall before starting your dev server.

See the [migration guide](https://pentaho.github.io/uikit-docs/next/docs/migration)
for the full list of changes.
