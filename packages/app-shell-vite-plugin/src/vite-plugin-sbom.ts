import fs from "node:fs";
import path from "node:path";
import sbom from "rollup-plugin-sbom";
import { version as viteVersion, type Plugin, type PluginOption } from "vite";

import { resolveModule } from "./nodeModule.js";
import SHARED_DEPENDENCIES from "./shared-dependencies.js";

export type SbomOptions = NonNullable<Parameters<typeof sbom>[0]>;

/** An npm package shipped inside a bundle copied into the app. */
export interface BundledPackage {
  name: string;
  version: string;
  license?: string;
}

export interface CopiedBundles {
  packages: BundledPackage[];
  /** Copied bundles whose packages could not be determined. */
  problems: string[];
}

type CycloneDxComponent = Record<string, unknown> & {
  purl?: string;
  "bom-ref"?: string;
  components?: CycloneDxComponent[];
};

interface CycloneDxBom {
  metadata?: { component?: CycloneDxComponent };
  components?: CycloneDxComponent[];
  dependencies?: { ref: string; dependsOn?: string[] }[];
}

const DEFAULT_OPTIONS: SbomOptions = {
  specVersion: "1.6",
  outDir: "sbom",
  outFormats: ["json"],
  saveTimestamp: false,
};

/** `rollup-plugin-sbom` needs Rollup 4 or Rolldown, i.e. Vite 5 or later. */
export function isSbomSupported(version: string) {
  return Number(version.split(".")[0]) >= 5;
}

function purlOf({ name, version }: BundledPackage) {
  const encodedName = name.split("/").map(encodeURIComponent).join("/");
  return `pkg:npm/${encodedName}@${encodeURIComponent(version)}`;
}

function toComponent(pkg: BundledPackage): CycloneDxComponent {
  const ref = purlOf(pkg);
  const [group, name] = pkg.name.startsWith("@")
    ? pkg.name.split("/")
    : [undefined, pkg.name];
  const license = pkg.license;

  return {
    type: "library",
    ...(group && { group }),
    name,
    version: pkg.version,
    "bom-ref": ref,
    purl: ref,
    ...(license && {
      licenses: [
        /^[\w.+-]+$/.test(license)
          ? { license: { id: license } }
          : { expression: license },
      ],
    }),
  };
}

function allComponents(components: CycloneDxComponent[]): CycloneDxComponent[] {
  return components.flatMap((c) => [c, ...allComponents(c.components ?? [])]);
}

/** The purl without qualifiers or subpath, e.g. `pkg:npm/a@1.0.0?vcs_url=...` -> `pkg:npm/a@1.0.0`. */
function purlKey(purl: string) {
  return purl.split(/[?#]/)[0];
}

/**
 * Adds *packages* to a CycloneDX JSON SBOM as npm components the root depends on,
 * reusing components already listed with the same purl.
 */
export function addPackages(bom: CycloneDxBom, packages: BundledPackage[]) {
  const components = (bom.components ??= []);
  const dependencies = (bom.dependencies ??= []);
  const refsByPurl = new Map<string, string>();
  for (const c of allComponents(components)) {
    const ref = c["bom-ref"] ?? c.purl;
    if (c.purl && ref) refsByPurl.set(purlKey(c.purl), ref);
  }
  const rootRef = bom.metadata?.component?.["bom-ref"];
  let root = dependencies.find((d) => d.ref === rootRef);
  if (rootRef && !root) {
    root = { ref: rootRef };
    dependencies.push(root);
  }

  for (const pkg of packages) {
    const purl = purlOf(pkg);
    let ref = refsByPurl.get(purl);
    if (!ref) {
      ref = purl;
      refsByPurl.set(purl, ref);
      components.push(toComponent(pkg));
      dependencies.push({ ref });
    }
    if (root && !root.dependsOn?.includes(ref)) {
      (root.dependsOn ??= []).push(ref);
    }
  }

  return bom;
}

function readPackage(file: string, name: string): BundledPackage | undefined {
  for (let dir = path.dirname(file); ; dir = path.dirname(dir)) {
    const packageJson = path.join(dir, "package.json");
    if (fs.existsSync(packageJson)) {
      const pkg = JSON.parse(fs.readFileSync(packageJson, "utf8"));
      if (pkg.name === name) {
        const license =
          typeof pkg.license === "string" ? pkg.license : pkg.license?.type;
        return { name, version: pkg.version, license };
      }
    }
    if (dir === path.dirname(dir)) return undefined;
  }
}

/**
 * Lists the npm packages inside the bundles copied into the app's `bundles/` folder:
 * the shared dependencies built by this plugin (from `esm-externals/manifest.json`),
 * the App Shell and UI Kit shared bundles, and `es-module-shims`.
 */
export function copiedBundlePackages(): CopiedBundles {
  const packages: BundledPackage[] = [];
  const problems: string[] = [];

  let manifest: Record<string, BundledPackage[]> | undefined;
  try {
    manifest = JSON.parse(
      fs.readFileSync(resolveModule("./esm-externals/manifest.json"), "utf8"),
    );
  } catch (error) {
    problems.push(
      `SBOM: cannot read the copied bundles list: ${error instanceof Error ? error.message : error}`,
    );
  }

  const addOwnPackage = (name: string, src: string, bundle: string) => {
    let pkg: BundledPackage | undefined;
    try {
      pkg = readPackage(resolveModule(src), name);
    } catch {
      pkg = undefined;
    }
    if (pkg) packages.push(pkg);
    else
      problems.push(
        `SBOM: cannot find the package of the copied bundle ${bundle}`,
      );
  };

  for (const dep of SHARED_DEPENDENCIES) {
    if (dep.bundleSrc.startsWith("./esm-externals/")) {
      if (!manifest) continue;
      const listed = manifest[dep.bundle];
      if (listed) packages.push(...listed);
      else
        problems.push(
          `SBOM: no package list for the copied bundle ${dep.bundle}`,
        );
    } else {
      addOwnPackage(dep.moduleId, dep.bundleSrc, dep.bundle);
    }
  }
  addOwnPackage("es-module-shims", "es-module-shims", "es-module-shims.js");

  return { packages, problems };
}

/**
 * Generates a CycloneDX SBOM of the build with `rollup-plugin-sbom`, and adds the packages of the
 * prebuilt bundles the App Shell copies into the app, which the bundler never sees.
 *
 * @param options `false` to disable, or `rollup-plugin-sbom` options merged over the defaults
 * @param copiedBundles lists the packages of the copied bundles; omit when none are copied
 */
export default function generateSbom(
  options: boolean | SbomOptions | undefined = true,
  copiedBundles?: () => CopiedBundles,
): PluginOption[] {
  if (options === false) return [];
  if (!isSbomSupported(viteVersion)) {
    console.warn(
      `SBOM generation needs Vite 5 or later (found ${viteVersion}); no SBOM is generated.`,
    );
    return [];
  }

  const sbomOptions: SbomOptions = {
    ...DEFAULT_OPTIONS,
    ...(options === true ? {} : options),
  };
  const jsonOutputs = new Set([
    path.join(sbomOptions.outDir!, `${sbomOptions.outFilename ?? "bom"}.json`),
    ".well-known/sbom",
  ]);

  const addCopiedBundles: Plugin = {
    name: "vite-plugin-sbom-copied-bundles",
    apply: "build",
    generateBundle: {
      order: "post",
      handler(_outputOptions, bundle) {
        if (!copiedBundles) return;

        const { packages, problems } = copiedBundles();
        problems.forEach((problem) => this.warn(problem));

        for (const file of Object.values(bundle)) {
          if (file.type !== "asset" || !jsonOutputs.has(file.fileName)) {
            continue;
          }
          const source =
            typeof file.source === "string"
              ? file.source
              : new TextDecoder().decode(file.source);
          file.source = JSON.stringify(
            addPackages(JSON.parse(source), packages),
            null,
            "\t",
          );
        }
      },
    },
  };

  return [
    { ...(sbom(sbomOptions) as Plugin), apply: "build" },
    addCopiedBundles,
  ];
}
