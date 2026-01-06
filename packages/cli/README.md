# Hitachi Vantara UI Kit CLI

The Hitachi Vantara CLI for UI Kit apps.

This CLI provides a way to automate tasks you regularly perform as part of your development workflow.

Whether is quickly start a new application or scaffolding out templates and components, it will help you standardize these tasks in a consistent, and predictable manner.

## Usage

For usage documentation, run the CLI with the `--help` option for any `<command>`. Examples:

```sh
npx @hitachivantara/uikit-cli@latest --help
npx @hitachivantara/uikit-cli@latest <command> --help
```

## Creating an App

You can create a new app using the different baselines provided and our official supported templates.

To get started, use the following command:

```sh
npx @hitachivantara/uikit-cli@latest create
```

It launches an interactive experience that guides you through setting up a new app.

You can also directly specify the app name and the template to use. For example:

```sh
npx @hitachivantara/uikit-cli@latest create MyAppName --templates Form
```

## How to test

You can run the project locally by executing the following command:

```
node <path-to-repo>/uikit-cli/src/index.js create
```

## License

This project is licensed under the terms of the [Apache 2.0 license](/LICENSE.md).
