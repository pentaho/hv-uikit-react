# @pentaho/uikit-config

UI Kit Sharable projects configurations

## Installation

Install the package in your project, and any peer-dependencies you need

```sh
npm i -D prettier@3 @pentaho/uikit-config
```

## Usage

Extend the configurations in `package.json` or the corresponding config file.

### Prettier

Example [Prettier configuration](https://prettier.io/docs/en/configuration.html#sharing-configurations) in `package.json`:

```json
{
  "prettier": "@pentaho/uikit-config/prettier"
}
```

### TSConfig

```json
{
  "extends": "@pentaho/uikit-config/tsconfig"
}
```

### oxlint

```json
{
  "extends": ["./node_modules/@pentaho/uikit-config/oxlint/strict.json"]
}
```
