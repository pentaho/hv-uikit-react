import fs from "node:fs";
import path from "node:path";
import virtual from "@rollup/plugin-virtual";
import type { PluginOption } from "vite";

const ID_PREFIX = `/@id/`;

export const extraDependencies: Record<string, string> = {
  "@hv/uikit-icons/": "./icons/",
};

/**
 * Auxiliary function to get the extraDependencies string
 * @returns a string with the extraDependencies content separated by commas
 */
export const getExtraDependenciesString = (): string => {
  let extraDependenciesString = "";
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const key in extraDependencies) {
    extraDependenciesString += `\\"${key}\\": \\"${extraDependencies[key]}\\",`;
  }
  extraDependenciesString = extraDependenciesString.slice(0, -1);
  return extraDependenciesString;
};

function markExternal(keys: (string | RegExp)[]): PluginOption {
  return {
    name: "vite-plugin-importmap-mark-external",
    enforce: "pre",
    apply: "serve",

    // while in dev, we need to mark keys from the importmapElements that match the id as external)
    resolveId: (id: string) =>
      keys.some((key) =>
        typeof key === "string" ? id.startsWith(key) : key.test(id),
      )
        ? {
            id,
            external: true,
          }
        : undefined,

    // Avoid the warning: The following dependencies are imported but could not be resolved: [dependency] (imported by [sourceFile])
    load: (id: string) => {
      if (keys.includes(id)) {
        // Vite will try to resolve the modules even when externalized
        // In order to suppress the warning, a stub module is returned
        return "export default {};";
      }

      return undefined;
    },
  };
}

function replaceIdPrefix(keys: (string | RegExp)[]): PluginOption {
  const reg = new RegExp(`${ID_PREFIX}(${keys.join("|")})`, "g");

  return {
    name: "vite-plugin-importmap-replace-idprefix",
    enforce: "pre",
    apply: "serve",

    // while in dev, we need to prevent 'vite:import-analysis' on runtime modules
    transform: (code) =>
      reg.test(code) ? code.replace(reg, (m, s1) => s1) : code,
  };
}

/**
 * Generate and injects the importmap tag into index.html
 * @param importmapElements The importmap elements to be included
 * @param sharedDependencies The shared packages (other than application bundles)
 * @param externalImportMap Flag to control if the importmap should be externalized
 * @param placeholderEntryPoint Flag to control if the importmap should be a placeholder
 */
export default function generateImportmap(
  importmapElements: Record<string, string>,
  sharedDependencies: string[],
  externalImportMap = false,
  placeholderEntryPoint = false,
): PluginOption {
  const keys = Object.keys(importmapElements);
  const devKeys = keys.filter(
    (key) => !sharedDependencies.some((lib) => lib.startsWith(key)),
  );

  let devMode = false;

  const importmapString = JSON.stringify(
    { imports: importmapElements },
    null,
    2,
  );

  const importmapScript = `const im = document.createElement('script');
im.type = 'importmap';
im.textContent = \`${importmapString}\`;
document.currentScript.after(im);
`;

  return [
    {
      name: "vite-plugin-importmap",
      enforce: "pre",

      // don't optimize / pre-transform deps that are in the importmap
      // except for react and react-dom when in dev mode
      config(config, { command }) {
        devMode = command !== "build";

        // vite docs says we can mutate the passed-in config directly
        // assigning to a new variable just to avoid the eslint warning
        const returnValue = config;

        // make sure optimizeDeps is defined
        returnValue.optimizeDeps = returnValue.optimizeDeps ?? {};

        returnValue.optimizeDeps.exclude = [
          ...(config.optimizeDeps?.exclude ?? []),
          ...(devMode ? devKeys : keys),
        ];

        if (devMode) {
          return;
        }

        // mark the modules referenced in the importmap as external
        const excludedModules = keys.map((key) => {
          if (key.endsWith("/")) {
            return new RegExp(`^${key}.*`);
          }

          return key;
        });

        console.info("Shared packages marked as external: ", excludedModules);

        // make sure build's rollupOptions is defined
        returnValue.build = returnValue.build ?? {};
        returnValue.build.rollupOptions = returnValue.build.rollupOptions ?? {};
        returnValue.build.rollupOptions.external =
          returnValue.build.rollupOptions.external ?? [];

        if (typeof returnValue.build.rollupOptions.external === "function") {
          // in case the developer has defined a custom external function
          // we wrap it and check our excluded modules first and call the original function if needed
          const originalExternal = returnValue.build.rollupOptions.external;

          returnValue.build.rollupOptions.external = (id, ...args) => {
            if (excludedModules.some((m) => m === id)) {
              return true;
            }

            return originalExternal(id, ...args);
          };
        } else {
          // otherwise we just add our excluded modules to the list supplied by the developer
          const externalModules: (string | RegExp)[] = [];

          if (Array.isArray(returnValue.build.rollupOptions.external)) {
            externalModules.push(...returnValue.build.rollupOptions.external);
          } else {
            externalModules.push(returnValue.build.rollupOptions.external);
          }

          externalModules.push(...excludedModules);

          returnValue.build.rollupOptions.external = externalModules;
        }
      },

      // while in dev, we need to prevent 'vite:import-analysis' on runtime modules
      // and also to say they're resolved (as external)
      // (it will still output an error in the console, but it won't break)
      // known issue: https://github.com/vitejs/vite/issues/11633
      configResolved(resolvedConfig) {
        if (!devMode) {
          return;
        }

        // this is a hack: we want to add the plugins only after the config is resolved,
        // however, because vite:react-refresh overrides the `resolveId` hook,
        // we need to add our `markExternal` before it
        const index = resolvedConfig.plugins.findIndex(
          (plugin) => plugin.name === "vite:react-refresh",
        );

        // if the plugin changes its name or is removed, fallback to as it was
        if (index === -1) {
          // @ts-expect-error
          resolvedConfig.plugins.push(markExternal(devKeys));
        } else {
          // if present, `markExternal` will be put right before the `vite:react-refresh` plugin
          // @ts-expect-error
          resolvedConfig.plugins.splice(index, 0, markExternal(devKeys));
        }

        // `replaceIdPrefix` transformation can be put at the end as it was
        // @ts-expect-error
        resolvedConfig.plugins.push(replaceIdPrefix(devKeys));
      },

      /**
       * Rollup hook with the info for bundle generation
       * It will be used to create a new configuration with:
       *  - bundles replace with the final location (e.g. -> "bundle": "src/pages/Main" transformed to "bundle": "pages/Main.js",
       * @param options build options
       */
      async generateBundle(options) {
        if (!externalImportMap || placeholderEntryPoint) {
          return;
        }

        // obtain the directory (dist) where the new config file will be placed
        let targetDir: string | undefined;
        if (options.dir) {
          targetDir = options.dir;
        } else if (options.file) {
          targetDir = path.dirname(options.file);
        }

        if (!targetDir) {
          throw new Error(
            "Please set outputPath, so we can know where to place the json file",
          );
        }

        // create the targetDir if it does not exist
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        // support for external import maps isn't yet available (https://github.com/WICG/import-maps/issues/235)
        // workaround: https://github.com/WICG/import-maps/issues/235#issuecomment-1002340944
        fs.writeFileSync(
          path.resolve(targetDir, "importmap.js"),
          importmapScript,
        );
      },

      // inject the importmap script and also the es-module-shims script
      transformIndexHtml: {
        order: "post",
        handler: (html) => ({
          html,
          tags: [
            {
              tag: "script",
              attrs: { async: true, src: "./bundles/es-module-shims.js" },
              injectTo: "head-prepend",
            },
            externalImportMap
              ? {
                  tag: "script",
                  attrs: { src: "./importmap.js" },
                  injectTo: "head-prepend",
                }
              : {
                  tag: "script",
                  attrs: { type: "importmap" },
                  injectTo: "head-prepend",
                  children: placeholderEntryPoint
                    ? "%%APPSHELL_IMPORTMAP%%"
                    : importmapString,
                },
          ],
        }),
      },
    },
    externalImportMap
      ? virtual({
          "/importmap.js": importmapScript,
        })
      : false,
  ];
}
