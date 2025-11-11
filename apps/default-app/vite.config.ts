import react from "@vitejs/plugin-react";
import unoCSS from "unocss/vite";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { HvAppShellVitePlugin } from "@hitachivantara/app-shell-vite-plugin";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    unoCSS({ mode: "per-module" }),
    cssInjectedByJsPlugin({
      relativeCSSInjection: true,
    }),
    HvAppShellVitePlugin({
      mode,
      type: "app",
      autoViewsAndRoutes: true,
      disableAppsKeyNormalization: true,
      modules: [
        "src/providers/DefaultAppProvider",
        "src/providers/AsyncProvider",
        "src/providers/HiddenProvider",
        "src/providers/DynamicProvider",
        "src/modules/DebugLink",
        "src/modules/ChangeContextValue",
        "src/services/headerActions/CreateNewContentDropDownMenu",
        "src/services/create/useCreateNewReportAction",
        "src/services/create/useCreateNewDashboardAction",
        "src/services/factories/createMessageService",
        "src/services/components/NotificationComponent",
        "src/conditions/useAlwaysTrue",
        "src/conditions/useAlwaysFalse",
        "src/conditions/useAsyncTrue",
        "src/conditions/useAsyncFalse",
        "src/conditions/useFlipToTrue",
        "src/conditions/useFlipToFalse",
        "src/pages/ShouldBeVisible",
        "src/pages/ShouldNotBeVisible",
      ],
    }),
  ],
  server: { port: 5181 },
  preview: { port: 5181 },
}));
