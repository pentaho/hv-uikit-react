import fs from "node:fs";
import path from "node:path";

// greedy prefix: the innermost node_modules wins for nested packages
const NODE_MODULES_PACKAGE = /^(.*\/node_modules\/(?:@[^/]+\/)?[^/]+)\//;

/**
 * Returns the package folder of a bundled module, or `undefined` for sources outside `node_modules`.
 *
 * @param {string} moduleId Rollup module id, possibly virtual (`\0` prefix) or with a query
 */
export function packageRoot(moduleId) {
  const id = moduleId.startsWith("\0") ? moduleId.slice(1) : moduleId;
  const file = id.split("?")[0].replaceAll("\\", "/");
  return NODE_MODULES_PACKAGE.exec(file)?.[1];
}

function licenseOf(pkg) {
  if (typeof pkg.license === "string") return pkg.license;
  if (pkg.license?.type) return pkg.license.type;
  if (Array.isArray(pkg.licenses)) {
    return pkg.licenses.map((license) => license.type ?? license).join(" OR ");
  }
  return undefined;
}

function readPackage(root) {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(root, "package.json"), "utf8"),
  );
  return { name: pkg.name, version: pkg.version, license: licenseOf(pkg) };
}

/**
 * Records the npm packages inlined into each output file in `manifest.json`, next to the output.
 * The App Shell Vite plugin uses it to list the bundles it copies into apps in their SBOM.
 */
export default function bundledPackages() {
  const packagesByFile = {};

  return {
    name: "bundled-packages",
    generateBundle(_outputOptions, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== "chunk") continue;

        const packages = new Map();
        for (const [id, info] of Object.entries(chunk.modules)) {
          const root = info.renderedLength > 0 ? packageRoot(id) : undefined;
          if (!root) continue;
          const pkg = readPackage(root);
          packages.set(`${pkg.name}@${pkg.version}`, pkg);
        }
        packagesByFile[chunk.fileName] = [...packages.values()].toSorted(
          (a, b) => a.name.localeCompare(b.name),
        );
      }
    },
    writeBundle(outputOptions) {
      const dir = outputOptions.dir ?? path.dirname(outputOptions.file);
      const file = path.join(dir, "manifest.json");
      const manifest = fs.existsSync(file)
        ? JSON.parse(fs.readFileSync(file, "utf8"))
        : {};
      Object.assign(manifest, packagesByFile);
      fs.writeFileSync(file, `${JSON.stringify(manifest, null, 2)}\n`);
    },
  };
}
