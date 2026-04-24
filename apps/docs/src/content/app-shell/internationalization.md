# Internationalization

The **App Shell** supports internationalization of its chrome (header, navigation, error pages) and of configuration
properties (app name, menu labels, logo description, etc.).

Translations are loaded from a file-based layout following the `locales/{lng}/{ns}.json` convention, where `{lng}` is a
[BCP 47](https://www.rfc-editor.org/info/bcp47) language tag and `{ns}` is a translation namespace.

## Namespaces

The App Shell locale file layout uses two namespaces:

| Namespace  | Description                                                                                                                                                                                                                                         |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `appShell` | Translations for the App Shell chrome (header, vertical navigation, error pages, etc.). Shipped with the App Shell packages and can be [overridden](#overriding-app-shell-translations) when building with the Vite plugin.                         |
| `app`      | Translations used to internationalize [App Shell configuration](./configuration) properties (app name, menu labels, logo description, etc.). Provided by the application via locale files or inline [`translations`](./configuration#translations). |

The `appShell` namespace is pre-bundled in English and loaded via HTTP for all other languages. The `app` namespace is
always loaded via HTTP.

## Locale files layout

Translation files follow this directory structure:

```
locales/
  supported-locales.json      ← optional manifest
  en/
    app.json
  pt/
    app.json
  de/
    app.json
```

Each JSON file contains a flat or nested object with translation keys and their values:

```json
{
  "appName": "My Application",
  "pageOne": "Page One",
  "logoDesc": "Company logo"
}
```

At runtime, these files are resolved relative to the [`translationsBaseUrl`](./configuration#translationsbaseurl) (which
defaults to `"./"`).

When using the **App Shell Vite Plugin**, locale files are placed in the application's `public/locales/` directory. The
plugin automatically merges the App Shell's stock resource bundles (for the `appShell` namespace) with the application's
locale files, in both development and production. Local keys always take priority over the stock translations.

This means that applications only need to provide locale files for the `app` namespace — the `appShell` namespace is
handled automatically by the plugin.

> [!NOTE]
> The `appShell` namespace for English is pre-bundled directly in the App Shell code, so the App Shell chrome works even
> without a `locales/` directory being served. Other languages require the locale files to be available via HTTP.

### Supported locales manifest

The optional `supported-locales.json` file is a JSON array of [BCP 47](https://www.rfc-editor.org/info/bcp47) language
tags that declares which locales the application supports:

```json
["en", "pt", "de"]
```

When present, translation backends (such as `HttpResourcesBackend` from `@hitachivantara/app-shell-i18next`) use this
manifest to skip network requests for unsupported languages, letting i18next follow the `fallbackLng` chain instead.
If the file is missing or malformed, all languages are allowed.

When building with the **App Shell Vite Plugin**, the plugin automatically generates a `supported-locales.json` manifest,
with the list of locales discovered on disk based on the locale directories found in `public/locales/`, plus the stock
ones provided by the App Shell's base code (from the `app-shell-ui` package). Any `supported-locales.json` file provided
by the application is ignored and overwritten by the plugin.

### Overriding App Shell translations

If you need to customize any of the App Shell chrome translations (e.g., changing a header label), create a file at
`public/locales/{lng}/appShell.json` (when using the Vite plugin) with just the keys you want to override. The plugin
will deep-merge your overrides on top of the stock translations, with your keys taking priority.

## Migrating from inline `translations`

Previously, translations were provided inline in the `app-shell.config.ts` via the
[`translations`](./configuration#translations) property. This approach is still supported — inline translations are
loaded immediately as preloaded resources in the `app` namespace.

To migrate to file-based translations:

1. Create locale files (e.g., `public/locales/en/app.json` when using the Vite plugin) with your translation keys.
2. Remove the `translations` property from `app-shell.config.ts`.

If both `translations` and locale files are present, inline translations are shown immediately while the HTTP backend
fetches the locale files. When the HTTP response arrives, it overrides the inline translations.

### Example

**Before** (inline):

```ts
// app-shell.config.ts
export default {
  name: "appName",
  menu: [{ label: "pageOne", target: "/page1" }],
  translations: {
    en: {
      appName: "My App",
      pageOne: "Page One",
    },
    pt: {
      appName: "Minha App",
      pageOne: "Página Um",
    },
  },
} satisfies HvAppShellConfig;
```

**After** (file-based):

```ts
// app-shell.config.ts
export default {
  name: "appName",
  menu: [{ label: "pageOne", target: "/page1" }],
} satisfies HvAppShellConfig;
```

```jsonc
// locales/en/app.json (public/locales/en/app.json when using the Vite plugin)
{
  "appName": "My App",
  "pageOne": "Page One",
}
```

```jsonc
// locales/pt/app.json (public/locales/pt/app.json when using the Vite plugin)
{
  "appName": "Minha App",
  "pageOne": "Página Um",
}
```

## Configuring the translations base URL

By default, the translations base URL is `"./"` — translation files are loaded relative to the application's base URL.
This works out of the box for applications compiled with the App Shell Vite Plugin.

For advanced scenarios (e.g., a backend server serving merged translations), the [`translationsBaseUrl`](./configuration#translationsbaseurl)
configuration property can be set to point to a different URL:

```ts
// app-shell.config.ts
export default {
  translationsBaseUrl: "https://my-server.com/api/",
  // ...
} satisfies HvAppShellConfig;
```

The App Shell will then load translations from:
`https://my-server.com/api/locales/{lng}/{ns}.json`

The URL is resolved relative to the `configUrl` (when the config was loaded from a URL) or the configured `baseUrl`.

## Disabling HTTP translation loading

Set `translationsBaseUrl: false` to disable the HTTP backend entirely.
The App Shell will rely solely on inline [`translations`](./configuration#translations) embedded in the config:

```ts
// app-shell.config.ts
export default {
  translationsBaseUrl: false,
  translations: {
    en: { myKey: "My value" },
    pt: { myKey: "Meu valor" },
  },
} satisfies HvAppShellConfig;
```

This is useful for legacy setups where any extra network requests to `/locales/` would produce 404 errors.

> [!WARNING]
> Disabling HTTP loading affects **both** namespaces — `appShell` and `app`.
> The `appShell` namespace is still pre-bundled in English, so the App Shell chrome works in English without a
> `locales/` directory.
> However, all other languages for `appShell` **and** all languages for `app` will no longer be loaded from HTTP.
> If you need translated chrome or translated configuration properties, you must supply them via inline
> [`translations`](./configuration#translations).

## Available languages

The App Shell ships with built-in `appShell` namespace translations for the following languages:

| Language Tag | Language              |
| ------------ | --------------------- |
| `en`         | English               |
| `pt`         | Portuguese            |
| `de`         | German                |
| `fr`         | French                |
| `ja`         | Japanese              |
| `zh-CN`      | Chinese (Simplified)  |
| `zh-TW`      | Chinese (Traditional) |

English is pre-bundled and available synchronously. Other languages are loaded via the HTTP backend.

## Changing the language at runtime

The [`useHvAppShellI18n`](./api-reference#usehvappshelli18n) hook provides access to the current language and a function to change it at runtime. This
is the recommended way for _Views_ and other modules to stay in sync with the App Shell's language, regardless of which
i18n library they use internally.

See the [API Reference](./api-reference#usehvappshelli18n) for details.

## View translations

The App Shell's translation namespaces (`appShell` and `app`) are intended for the App Shell chrome and configuration
properties only. **Views** must manage their own translations independently, using whichever i18n library or approach
they prefer.

To keep the View's language in sync with the App Shell, use the [`useHvAppShellI18n`](./api-reference#usehvappshelli18n) hook to read the current
`language` and react to changes.

Views can and should use the same `locales/` repository for their own translations, using different namespace names to
avoid conflicts with `appShell` and `app`. For example, a View could load its translations from
`locales/{lng}/myView.json`.

## Advanced: i18next library sharing

> [!CAUTION]
> This section covers an advanced topic relevant only when _Views_ or _Providers_ are compiled together with the
> App Shell (i.e., in the `type: "app"` project) and happen to use the i18next library internally.

The App Shell uses [i18next](https://www.i18next.com) and [react-i18next](https://react.i18next.com) internally. These libraries are **not** shared dependencies
loaded externally at runtime — they are bundled into the App Shell compilation produced by the Vite plugin.

This means that _Application Bundles_ (`type: "bundle"`) loaded at runtime have their own copy of i18next and there is
no interaction between the two.

However, _Views_ or _Providers_ compiled in the same `type: "app"` project share the i18next and react-i18next libraries
at the bundler level. In this scenario:

- The `react-i18next` `useTranslation` hook uses React context to find the nearest `I18nextProvider`. If a _View_ or a
  [system/global provider](./configuration#systemproviders) installs its own `I18nextProvider` higher in the component
  tree, it may shadow the App Shell's provider. The App Shell handles this internally, but downstream code using
  `useTranslation` without an explicit instance may pick up the wrong provider.
- To avoid conflicts, code compiled with the App Shell that uses i18next should create its own
  [i18next instance](https://www.i18next.com/overview/api#createinstance) and pass it explicitly to its
  `I18nextProvider` or `useTranslation` calls.
