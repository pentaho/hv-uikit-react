import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const resolved: Record<string, string> = {};

vi.mock("rollup-plugin-sbom", () => ({
  default: vi.fn(() => ({ name: "rollup-plugin-sbom" })),
}));

vi.mock("../nodeModule.js", () => ({
  resolveModule: (moduleName: string) => {
    if (!resolved[moduleName]) throw new Error(`Cannot find ${moduleName}`);
    return resolved[moduleName];
  },
}));

const { default: rollupPluginSbom } = await import("rollup-plugin-sbom");
const {
  default: generateSbom,
  addPackages,
  copiedBundlePackages,
  isSbomSupported,
} = await import("../vite-plugin-sbom");

const ROOT_REF = "pkg:npm/%40pentaho-apps/my-app@1.0.0";

const REACT_ROUTER = [
  { name: "@remix-run/router", version: "1.23.4", license: "MIT" },
  { name: "react-router-dom", version: "6.30.6", license: "MIT" },
];

function bom(components: Record<string, unknown>[] = []) {
  return {
    bomFormat: "CycloneDX",
    specVersion: "1.6",
    metadata: { component: { "bom-ref": ROOT_REF, name: "my-app" } },
    components,
    dependencies: [{ ref: ROOT_REF, dependsOn: [] as string[] }],
  };
}

function runPostProcessor(
  plugins: any[],
  bundle: Record<string, { type: string; fileName: string; source: string }>,
) {
  const postProcessor = plugins[1];
  const warn = vi.fn();
  postProcessor.generateBundle.handler.call({ warn }, {}, bundle);
  return warn;
}

describe("generateSbom", () => {
  beforeEach(() => {
    vi.mocked(rollupPluginSbom).mockClear();
  });

  it("adds rollup-plugin-sbom for builds with the default output", () => {
    const plugins = generateSbom(true, undefined) as any[];

    expect(rollupPluginSbom).toHaveBeenCalledWith({
      specVersion: "1.6",
      outDir: "sbom",
      outFormats: ["json"],
      saveTimestamp: false,
    });
    expect(plugins[0]).toMatchObject({
      name: "rollup-plugin-sbom",
      apply: "build",
    });
    expect(plugins[1].apply).toBe("build");
  });

  it("passes custom options over the defaults", () => {
    generateSbom({ outDir: "cyclonedx", generateSerial: true }, undefined);

    expect(rollupPluginSbom).toHaveBeenCalledWith({
      specVersion: "1.6",
      outDir: "cyclonedx",
      outFormats: ["json"],
      saveTimestamp: false,
      generateSerial: true,
    });
  });

  it("can be disabled", () => {
    expect(generateSbom(false, undefined)).toEqual([]);
    expect(rollupPluginSbom).not.toHaveBeenCalled();
  });

  it("adds the copied bundles to both JSON outputs", () => {
    const plugins = generateSbom(true, () => ({
      packages: REACT_ROUTER,
      problems: [],
    })) as any[];
    const source = JSON.stringify(bom());
    const bundle = {
      "sbom/bom.json": { type: "asset", fileName: "sbom/bom.json", source },
      ".well-known/sbom": {
        type: "asset",
        fileName: ".well-known/sbom",
        source,
      },
      "index.js": { type: "chunk", fileName: "index.js", source: "code" },
    };

    runPostProcessor(plugins, bundle);

    for (const file of ["sbom/bom.json", ".well-known/sbom"]) {
      const result = JSON.parse(bundle[file as "sbom/bom.json"].source);
      expect(result.components.map((c: any) => c.purl)).toEqual([
        "pkg:npm/%40remix-run/router@1.23.4",
        "pkg:npm/react-router-dom@6.30.6",
      ]);
    }
    expect(bundle["index.js"].source).toBe("code");
  });

  it("uses the configured output folder", () => {
    const plugins = generateSbom({ outDir: "cyclonedx" }, () => ({
      packages: REACT_ROUTER,
      problems: [],
    })) as any[];
    const bundle = {
      "cyclonedx/bom.json": {
        type: "asset",
        fileName: "cyclonedx/bom.json",
        source: JSON.stringify(bom()),
      },
    };

    runPostProcessor(plugins, bundle);

    expect(
      JSON.parse(bundle["cyclonedx/bom.json"].source).components,
    ).toHaveLength(2);
  });

  it("leaves the SBOM unchanged when no bundles are copied", () => {
    const plugins = generateSbom(true, undefined) as any[];
    const source = JSON.stringify(bom());
    const bundle = {
      "sbom/bom.json": { type: "asset", fileName: "sbom/bom.json", source },
    };

    runPostProcessor(plugins, bundle);

    expect(bundle["sbom/bom.json"].source).toBe(source);
  });

  it("warns about copied bundles it cannot describe", () => {
    const plugins = generateSbom(true, () => ({
      packages: [],
      problems: ["no package list for react.production.min.js"],
    })) as any[];

    const warn = runPostProcessor(plugins, {});

    expect(warn).toHaveBeenCalledWith(
      "no package list for react.production.min.js",
    );
  });
});

describe("isSbomSupported", () => {
  it("requires Vite 5 or later", () => {
    expect(isSbomSupported("4.5.3")).toBe(false);
    expect(isSbomSupported("5.0.0")).toBe(true);
    expect(isSbomSupported("8.0.12")).toBe(true);
  });
});

describe("addPackages", () => {
  it("adds npm components with purl, licenses and a dependency from the root", () => {
    const result = addPackages(bom(), [
      { name: "@emotion/cache", version: "11.14.0", license: "MIT" },
      { name: "dual", version: "1.0.0", license: "(MIT OR Apache-2.0)" },
      { name: "unlicensed", version: "2.0.0" },
    ]);

    expect(result.components).toEqual([
      {
        type: "library",
        group: "@emotion",
        name: "cache",
        version: "11.14.0",
        "bom-ref": "pkg:npm/%40emotion/cache@11.14.0",
        purl: "pkg:npm/%40emotion/cache@11.14.0",
        licenses: [{ license: { id: "MIT" } }],
      },
      {
        type: "library",
        name: "dual",
        version: "1.0.0",
        "bom-ref": "pkg:npm/dual@1.0.0",
        purl: "pkg:npm/dual@1.0.0",
        licenses: [{ expression: "(MIT OR Apache-2.0)" }],
      },
      {
        type: "library",
        name: "unlicensed",
        version: "2.0.0",
        "bom-ref": "pkg:npm/unlicensed@2.0.0",
        purl: "pkg:npm/unlicensed@2.0.0",
      },
    ]);
    expect(result.dependencies).toEqual([
      {
        ref: ROOT_REF,
        dependsOn: [
          "pkg:npm/%40emotion/cache@11.14.0",
          "pkg:npm/dual@1.0.0",
          "pkg:npm/unlicensed@2.0.0",
        ],
      },
      { ref: "pkg:npm/%40emotion/cache@11.14.0" },
      { ref: "pkg:npm/dual@1.0.0" },
      { ref: "pkg:npm/unlicensed@2.0.0" },
    ]);
  });

  it("does not duplicate components already in the SBOM", () => {
    const existing = {
      type: "library",
      name: "react-router-dom",
      version: "6.30.6",
      "bom-ref": "pkg:npm/react-router-dom@6.30.6",
      purl: "pkg:npm/react-router-dom@6.30.6",
    };

    const result = addPackages(bom([existing]), [
      ...REACT_ROUTER,
      ...REACT_ROUTER,
    ]) as Required<ReturnType<typeof addPackages>>;

    expect(result.components.map((c: any) => c.purl)).toEqual([
      "pkg:npm/react-router-dom@6.30.6",
      "pkg:npm/%40remix-run/router@1.23.4",
    ]);
    expect(result.components[0]).toBe(existing);
    expect(result.dependencies.map((d: any) => d.ref)).toEqual([
      ROOT_REF,
      "pkg:npm/%40remix-run/router@1.23.4",
    ]);
    expect(result.dependencies[0].dependsOn).toEqual([
      "pkg:npm/%40remix-run/router@1.23.4",
      "pkg:npm/react-router-dom@6.30.6",
    ]);
  });

  it("matches existing components whose purl has qualifiers", () => {
    const ref =
      "pkg:npm/react-dom@18.3.1?vcs_url=git%2Bhttps%3A%2F%2Fgithub.com%2Ffacebook%2Freact.git";
    const existing = {
      type: "library",
      name: "react-dom",
      version: "18.3.1",
      "bom-ref": ref,
      purl: ref,
    };

    const result = addPackages(bom([existing]), [
      { name: "react-dom", version: "18.3.1", license: "MIT" },
    ]) as Required<ReturnType<typeof addPackages>>;

    expect(result.components).toEqual([existing]);
    expect(result.dependencies).toEqual([{ ref: ROOT_REF, dependsOn: [ref] }]);
  });
});

describe("copiedBundlePackages", () => {
  let tmp: string;

  function addPackage(dir: string, pkg: Record<string, unknown>, file: string) {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify(pkg));
    fs.writeFileSync(path.join(dir, file), "");
    return path.join(dir, file);
  }

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "copied-bundles-"));
    const nm = path.join(tmp, "node_modules");
    const manifest = path.join(tmp, "dist", "esm-externals", "manifest.json");
    fs.mkdirSync(path.dirname(manifest), { recursive: true });
    fs.writeFileSync(
      manifest,
      JSON.stringify({
        "react.production.min.js": [
          { name: "react", version: "18.3.1", license: "MIT" },
        ],
        "react-dom.production.min.js": [
          { name: "react-dom", version: "18.3.1", license: "MIT" },
        ],
        "react-router-dom.production.min.js": REACT_ROUTER,
        "emotion-react.production.min.js": [
          { name: "@emotion/react", version: "11.14.0", license: "MIT" },
        ],
        "emotion-cache.production.min.js": [
          { name: "@emotion/cache", version: "11.14.0", license: "MIT" },
        ],
      }),
    );
    resolved["./esm-externals/manifest.json"] = manifest;
    resolved["es-module-shims"] = addPackage(
      path.join(nm, "es-module-shims"),
      { name: "es-module-shims", version: "1.10.1", license: "MIT" },
      "dist/es-module-shims.js",
    );
    for (const [name, bundle] of [
      ["app-shell-shared", "app-shell-shared.esm.js"],
      ["app-shell-services", "app-shell-services.esm.js"],
      ["uikit-react-shared", "uikit-react-shared.esm.js"],
    ]) {
      resolved[`@pentaho/${name}/bundles/${bundle}`] = addPackage(
        path.join(nm, "@pentaho", name),
        { name: `@pentaho/${name}`, version: "3.0.1", license: "Apache-2.0" },
        `dist/bundles/${bundle}`,
      );
    }
  });

  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
    for (const key of Object.keys(resolved)) delete resolved[key];
  });

  it("lists the packages inside every copied bundle", () => {
    const { packages, problems } = copiedBundlePackages();

    expect(problems).toEqual([]);
    expect(packages.map((p) => `${p.name}@${p.version}`)).toEqual([
      "react@18.3.1",
      "react-dom@18.3.1",
      "@remix-run/router@1.23.4",
      "react-router-dom@6.30.6",
      "@emotion/react@11.14.0",
      "@emotion/cache@11.14.0",
      "@pentaho/app-shell-shared@3.0.1",
      "@pentaho/app-shell-services@3.0.1",
      "@pentaho/uikit-react-shared@3.0.1",
      "es-module-shims@1.10.1",
    ]);
    expect(packages.at(-1)?.license).toBe("MIT");
  });

  it("reports bundles missing from the manifest", () => {
    const manifest = resolved["./esm-externals/manifest.json"];
    const listed = JSON.parse(fs.readFileSync(manifest, "utf8"));
    delete listed["react.production.min.js"];
    fs.writeFileSync(manifest, JSON.stringify(listed));

    const { packages, problems } = copiedBundlePackages();

    expect(problems).toEqual([
      "SBOM: no package list for the copied bundle react.production.min.js",
    ]);
    expect(packages.map((p) => p.name)).not.toContain("react");
  });

  it("reports a missing manifest once", () => {
    delete resolved["./esm-externals/manifest.json"];

    const { problems } = copiedBundlePackages();

    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/^SBOM: cannot read the copied bundles list/);
  });
});
