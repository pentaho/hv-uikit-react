# AppShell i18next integration

Optional library for apps that use the [i18next](https://www.i18next.com/) library
and that also implement the conventional locales resource bundles layout.

## Overview

This package provides an opinionated integration between `i18next` and React. It
is intended for applications that need to:

- create i18n instances with sensible defaults;
- initialize those instances from React components with predictable loading
  state; and
- load translation bundles from HTTP-served locale assets.

### Error handling

i18next does not provide a reliable public API to distinguish fatal
initialization errors from partial load failures (where fallback resources are
still usable). Therefore, **`useI18n` does not propagate init errors**.

Load failures degrade gracefully:

- If a fallback language has resources, `t()` returns the fallback value.
- If no resources are available at all, `t()` returns raw keys.

Applications that need stricter guarantees should implement health checks
outside of the i18n layer.

> [!IMPORTANT]
> This package is designed to be bundled with its consumers.
> Additionally, applications using `@hitachivantara/app-shell-i18next` should
> declare a direct dependency on `i18next`.

## Included API

The public API exposed by this package is intentionally small:

| Export                                                                         | Kind             | Summary                                                                                                                        | Detailed documentation                           |
| ------------------------------------------------------------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| `createI18n`                                                                   | Factory function | Creates a pre-configured i18next instance with deferred initialization and opinionated defaults.                               | See the doclet in `src/createI18n.ts`.           |
| `useI18n`                                                                      | React hook       | Triggers initialization for an instance created by `createI18n` and returns reactive readiness state (`isInitialized`).        | See the doclet in `src/useI18n.ts`.              |
| `HttpResourcesBackend`                                                         | i18next backend  | Loads translation bundles from HTTP endpoints under a `locales/` directory, with optional supported-locale manifest filtering. | See the doclet in `src/HttpResourcesBackend.ts`. |
| `FetchOptions`, `HttpResourcesBackendOptions`, `I18nInstance`, `UseI18nResult` | Types            | Type definitions for the backend, instance brand, and hook return state.                                                       | See the respective source files.                 |

## Detailed Reference

The authoritative API documentation already lives in the source doclets for each
export. Those doclets include the details that are intentionally not duplicated
in this README.
