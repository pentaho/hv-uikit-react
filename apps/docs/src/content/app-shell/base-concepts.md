# Base concepts

This section aims to clarify some of the terms used throughout the **App Shell** documentation.

## Micro-frontends

Client-side architectural pattern where independently deployed frontend functionality is put together to form an application.
Check out [micro-frontends.org](https://micro-frontends.org/) for more information.

## ES Modules

[**ES modules**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) are the native module system for JavaScript, introduced in ECMAScript 2015 (ES6). They are natively supported by modern browsers, which makes them a future-proof choice.

**Bundling** is the process of combining all modules accessible from an entry point into a single ES module. This process improves performance, optimizes loading, and enhances code organization.

## Shared dependencies

A few libraries are not bundled at runtime but dynamically loaded at runtime. It is used to improve performance by sharing libraries between _Application Bundles_ (reducing bundle sizes and loading the shared library only once) and when sharing the same instance is desired or required (like `react` and `react-dom`, for avoiding invalid hook calls in _Shared Modules_).

That means that, despite the version of the library used by the _Application Bundle_, the version used at runtime will be the one provided by the **App Shell**. As such, discrepancies should be avoided, as problems might arise in production that are not detected during development.

These are the current shared dependencies and their versions:

| Library                              | Version    |
| ------------------------------------ | ---------- |
| `react`, `react-dom`                 | `^18.2.0`  |
| `react-router-dom`                   | `^6.9.0`   |
| `@emotion/cache`, `@emotion/react`   | `^11.11.0` |
| `@hitachivantara/uikit-react-shared` | `latest`   |
| `@hitachivantara/app-shell-shared`   | `latest`   |
| `@hitachivantara/app-shell-services` | `latest`   |

## Shared Modules

_Shared Modules_ are ES modules exported by _Application Bundles_ to be imported by other _Application Bundles_. They can be UI components or simply functionality exposed via an API.

They are declared in the `vite.config.ts` file, using the `modules` parameter:

```ts
HvAppShellVitePlugin({
  modules: [
    "src/pages/PlanetList",
    "src/pages/PlanetView",
    "src/pages/PlanetForm",
  ],
});
```

The **App Shell** itself is able to load the following types of _Shared Modules_:

- **View**: Module exporting a React Component intended to be rendered in a **App Shell** panel (usually the main panel, as a page). It's configured in the **App Shell** configuration file in the `mainPanel.views` array. Detailed in the [next section](./routing).
- **Header Action**: Module exporting a React Component that provides a button (or other small UI component) to be rendered in the right-hand side of the **App Shell** header. It's configured in the **App Shell** configuration file in the `header.actions` array. Detailed in the [Header Actions](./header-actions) section.
- **System Provider**: Module exporting a React Component that provides a React Context at the top of the component tree, wrapping the entire **App Shell**, always loaded and cannot have conditions. They're configured in the **App Shell** configuration file in the [`systemProviders`](./configuration#systemproviders) array.
- **Provider**: Module exporting a React Component that provides a React Context to be used by other _Shared Modules_. Unlike System Providers, these can be conditionally loaded. They're configured in the **App Shell** configuration file in the [`providers`](./configuration#providers) array.
- **Condition**: Module exporting a React Hook that returns a boolean result to control which elements should be displayed or loaded. They're referenced in the **App Shell** configuration file using the [`conditions`](./configuration#conditions) property on various configuration objects.
- **Theme**: Module that exports a UI Kit theme definition. They can be referenced in the **App Shell** configuration file in the [`theming`](./configuration#theming) section.
- **Service**: Module that follows a provider/consumer model and is configured in the **App Shell** configuration file in the [`services`](./configuration#services) object, when using the `bundle` reference syntax of a service definition. This module can be explicitly consumed by application code.

All the above _Shared Modules_ types assume its subject is exported as the default export of the module. In the case of `services`, the nature of the default export can be configured.
