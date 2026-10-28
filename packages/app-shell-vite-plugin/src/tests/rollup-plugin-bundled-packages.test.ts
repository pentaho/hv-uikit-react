import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import bundledPackages, {
  packageRoot,
} from "../../rollup-plugin-bundled-packages.js";

let tmp: string;

function addPackage(dir: string, pkg: Record<string, unknown>) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify(pkg));
}

function chunk(fileName: string, modules: Record<string, number>) {
  return {
    type: "chunk",
    fileName,
    modules: Object.fromEntries(
      Object.entries(modules).map(([id, renderedLength]) => [
        id,
        { renderedLength },
      ]),
    ),
  };
}

function build(bundles: ReturnType<typeof chunk>[]) {
  const outDir = path.join(tmp, "dist", "esm-externals");
  fs.mkdirSync(outDir, { recursive: true });
  for (const bundle of bundles) {
    const plugin = bundledPackages() as any;
    const file = path.join(outDir, bundle.fileName);
    plugin.generateBundle({ file }, { [bundle.fileName]: bundle });
    plugin.writeBundle({ file });
  }
  return JSON.parse(
    fs.readFileSync(path.join(outDir, "manifest.json"), "utf8"),
  );
}

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "bundled-packages-"));
});

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

describe("packageRoot", () => {
  it("returns the innermost node_modules package of a module id", () => {
    expect(packageRoot("/a/node_modules/react/index.js")).toBe(
      "/a/node_modules/react",
    );
    expect(
      packageRoot("\0/a/node_modules/@emotion/react/dist/x.js?commonjs-module"),
    ).toBe("/a/node_modules/@emotion/react");
    expect(
      packageRoot("/a/node_modules/react-router-dom/node_modules/b/index.js"),
    ).toBe("/a/node_modules/react-router-dom/node_modules/b");
  });

  it("ignores sources outside node_modules", () => {
    expect(packageRoot("/a/src/export-externals/export-react.js")).toBe(
      undefined,
    );
  });
});

describe("bundledPackages", () => {
  it("lists every package with code in each bundle, with version and license", () => {
    const nm = path.join(tmp, "node_modules");
    addPackage(path.join(nm, "react-router-dom"), {
      name: "react-router-dom",
      version: "6.30.6",
      license: "MIT",
    });
    addPackage(path.join(nm, "@remix-run", "router"), {
      name: "@remix-run/router",
      version: "1.23.4",
      license: { type: "MIT" },
    });
    addPackage(path.join(nm, "scheduler"), {
      name: "scheduler",
      version: "0.23.2",
      licenses: [{ type: "MIT" }],
    });
    addPackage(path.join(nm, "react"), { name: "react", version: "18.3.1" });

    const manifest = build([
      chunk("react-router-dom.production.min.js", {
        [path.join(tmp, "src/export-externals/export-react-router-dom.js")]: 50,
        [path.join(nm, "react-router-dom/dist/index.js")]: 300,
        [`\0${path.join(nm, "@remix-run/router/dist/router.js")}?commonjs-module`]: 10,
        [path.join(nm, "@remix-run/router/dist/router.cjs.js")]: 200,
        [path.join(nm, "scheduler/index.js")]: 100,
        [path.join(nm, "react/index.js")]: 0,
      }),
    ]);

    expect(manifest).toEqual({
      "react-router-dom.production.min.js": [
        { name: "@remix-run/router", version: "1.23.4", license: "MIT" },
        { name: "react-router-dom", version: "6.30.6", license: "MIT" },
        { name: "scheduler", version: "0.23.2", license: "MIT" },
      ],
    });
  });

  it("keeps the packages of every bundle built in the same run", () => {
    const nm = path.join(tmp, "node_modules");
    addPackage(path.join(nm, "react"), {
      name: "react",
      version: "18.3.1",
      license: "MIT",
    });
    addPackage(path.join(nm, "react-dom"), {
      name: "react-dom",
      version: "18.3.1",
      license: "MIT",
    });

    const manifest = build([
      chunk("react.production.min.js", {
        [path.join(nm, "react/index.js")]: 10,
      }),
      chunk("react-dom.production.min.js", {
        [path.join(nm, "react-dom/index.js")]: 10,
      }),
    ]);

    expect(Object.keys(manifest).toSorted()).toEqual([
      "react-dom.production.min.js",
      "react.production.min.js",
    ]);
  });
});
