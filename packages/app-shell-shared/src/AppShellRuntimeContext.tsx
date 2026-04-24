import { createContext, useContext } from "react";
import type { i18n } from "i18next";

/**
 * Context for providing runtime information and utilities to the App Shell.
 * This context supports the App Shell's internal operations and should not be used outside.
 *
 * Currently, exposes the I18next instance that the App Shell internal modules should use for translations.
 *
 * The reason this is needed, and that the I18next instance installed via `I18nextProvider` by
 * `AppShellContainer` is that the App Shell UI and associated packages is typically compiled
 * together with other custom code, using the App Shell vite plugin. Hence, the I18next library
 * is  shared with the custom code. If the custom code installs its own I18next instance at a
 * high enough level in the component tree, for example, inside a global or (even wider impact)
 * system provider, all the internal App Shell UI components beneath it would no longer be guaranteed
 * to access the original, root I18next instance.
 *
 * To use I18next properly from within the App Shell internal code, do, for example:
 * ```ts
 * const { i18n } = useHvAppShellRuntimeContext();
 * const { t } = useTranslation(ns, {i18n});
 * ```
 *
 * The current package, `app-shell-shared`, is a special case as it cannot depend on `i18next` at runtime (only
 * i18next types which are removed when compiling to JS can be referenced). See how {@link useHvMenuItems} handles this.
 *
 * The custom App Shell ultimately compiling the code should not use the root I18next provider.
 * It may not be configured as needed by external code. It can however, have its own I18next instance, which can/should
 * be configured for the same resource bundle repository (of `./locales/{{lng}}/{{ns}}.json`), rooted at the configured
 * translations base path via {@link HvAppShellConfig#translationsBaseUrl}, albeit consuming other namespaces.
 * This repository is required when providing translations outside the App Shell configuration (i.e., not embedded in
 * the configuration via {@link HvAppShellConfig#translations}).
 */
export interface HvAppShellRuntimeContextValue {
  i18n: i18n;
}

export const HvAppShellRuntimeContext = createContext<
  HvAppShellRuntimeContextValue | undefined
>(undefined);

export const useHvAppShellRuntimeContext =
  (): HvAppShellRuntimeContextValue => {
    const context = useContext(HvAppShellRuntimeContext);
    if (!context) {
      throw new Error(
        "useHvAppShellRuntimeContext must be used within HvAppShellRuntimeContext.Provider",
      );
    }

    return context;
  };
