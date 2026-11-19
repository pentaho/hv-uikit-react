import { existsSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

/**
 * Type declarations as one `.d.ts` per source module, beside its `.js`, so a reader (a person or a coding agent)
 * finds a component's types in `dist/<Component>/<Component>.d.ts` instead of one large bundle.
 *
 * Relative imports in the declarations get the extension Node's ESM resolution needs (`./Button.styles.js`,
 * `./utils/index.js`): without it, apps on `moduleResolution: node16`/`nodenext` can't follow them and, with
 * `skipLibCheck`, the types silently become `any`.
 */
const SOURCE = [".ts", ".tsx", ".d.ts"];
const RELATIVE =
  /(\bfrom\s+|\bimport\s*\(\s*|\bimport\s+)(["'])(\.{1,2}(?:\/[^"']*)?)\2/g;

/** `spec`, imported from `fromDir` in the sources, as Node resolves it: with `.js` or `/index.js`. */
function withExtension(spec: string, fromDir: string) {
  if (/\.(m|c)?js$/.test(spec)) return spec;
  const target = resolve(fromDir, spec);
  if (SOURCE.some((ext) => existsSync(target + ext))) return `${spec}.js`;
  if (SOURCE.some((ext) => existsSync(join(target, `index${ext}`))))
    return `${spec}/index.js`;
  throw new Error(`Can't resolve "${spec}" from ${fromDir} for the types`);
}

/** Options for vite-plugin-dts: the package's `src` as one declaration file per module in `dist`. */
export function dtsOptions(packageDir: string, tsconfigPath: string) {
  const src = join(packageDir, "src");
  const dist = join(packageDir, "dist");
  return {
    bundleTypes: false,
    tsconfigPath,
    entryRoot: src,
    include: ["src"],
    exclude: [
      "src/**/*.test.ts",
      "src/**/*.test.tsx",
      "src/**/*.stories.tsx",
      "src/**/stories/**",
      "src/**/tests/**",
    ],
    // the maps would point at sources the package doesn't ship
    compilerOptions: { declarationMap: false },
    beforeWriteFile(filePath: string, content: string) {
      const fromDir = join(src, dirname(relative(dist, filePath)));
      return {
        content: content.replace(
          RELATIVE,
          (_, lead, quote, spec) =>
            `${lead}${quote}${withExtension(spec, fromDir)}${quote}`,
        ),
      };
    },
  };
}
