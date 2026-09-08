import type { HvAppShellConfig } from "@pentaho/app-shell-shared";

/**
 * Returns the app base path.
 * - The path is calculated by returning the sub-path value for the main app.
 * - Main app is the first app that baseUrl matches window.location
 * - App baseUrl don't have case restrictions
 * - If the main app is not discovered, returns "/"
 *
 * @return The main app baseUrl, or "/" otherwise. Value is always returned in lowercase.
 * @param config The app configuration definition
 */
const getBasePath = (config: HvAppShellConfig) => {
  return config?.baseUrl ?? "/";
};

export default getBasePath;
