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
