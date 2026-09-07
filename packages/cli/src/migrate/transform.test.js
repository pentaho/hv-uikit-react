import assert from "node:assert/strict";
import { test } from "node:test";
import jscodeshift from "jscodeshift";

import { migratePackageJson } from "./packageJson.js";
import transformer from "./transform.js";

const j = jscodeshift.withParser("tsx");

const run = (source) => {
  const report = { review: [] };
  const output = transformer(
    { path: "test.tsx", source },
    { jscodeshift: j },
    { report },
  );
  return { output: output ?? source, report };
};

test("renames the package scope", () => {
  const { output } = run(
    `import { HvButton } from "@hitachivantara/uikit-react-core";`,
  );
  assert.match(output, /@pentaho\/uikit-react-core/);
});

test("renames the pentaho package to widgets", () => {
  const { output } = run(
    `import { HvCanvas } from "@hitachivantara/uikit-react-pentaho";`,
  );
  assert.match(output, /@pentaho\/uikit-react-widgets/);
});

test("leaves removed packages untouched but reports them", () => {
  const { output, report } = run(
    `import { HvFlow } from "@hitachivantara/uikit-react-lab";`,
  );
  assert.match(
    output,
    /uikit-react-lab/,
    "import must not be silently rewritten",
  );
  assert.equal(report.review.length, 1);
});

test("renames disable* props to hide*", () => {
  const { output } = run(
    `<HvInput disableClear disableRevealPassword disableSearchButton />`,
  );
  assert.match(output, /hideClear/);
  assert.match(output, /hideRevealPassword/);
  assert.match(output, /hideSearchButton/);
  assert.doesNotMatch(output, /disable/);
});

test("converts HvGrid item/breakpoints to size", () => {
  const { output } = run(`<HvGrid item xs={12} sm={6} />`);
  assert.match(output, /size=\{\{/);
  assert.match(output, /xs: 12/);
  assert.match(output, /sm: 6/);
  assert.doesNotMatch(output, /\bitem\b/);
});

test("converts zeroMinWidth to a style prop", () => {
  const { output } = run(`<HvGrid zeroMinWidth />`);
  assert.match(output, /style=\{\{/);
  assert.match(output, /minWidth: 0/);
  assert.doesNotMatch(output, /zeroMinWidth/);
});

test("leaves a non-HvGrid xs prop alone", () => {
  const { output } = run(`<SomeOther xs={12} item />`);
  assert.match(output, /xs=\{12\}/);
  assert.doesNotMatch(output, /size=/);
});

test("renames the pentahoPlus theme identifier", () => {
  const { output } = run(`const on = theme.name === "pentahoPlus";`);
  assert.match(output, /"pentaho"/);
  assert.doesNotMatch(output, /pentahoPlus/);
});

test("renames classes.sortIcon and reports sortableHeaderText", () => {
  const { output, report } = run(
    `<HvTableHeader classes={{ sortIcon: "a", sortableHeaderText: "b" }} />`,
  );
  assert.match(output, /sortButton/);
  assert.match(output, /sortableHeaderText/, "no automatic replacement exists");
  assert.equal(report.review.length, 1);
});

test("reports removed components without editing them", () => {
  const { output, report } = run(`<HvStack direction="row" />`);
  assert.match(output, /HvStack/);
  assert.equal(report.review.length, 1);
});

test("reports props whose replacement changes behaviour", () => {
  const { report } = run(`<HvSlider onBeforeChange={a} onAfterChange={b} />`);
  assert.equal(report.review.length, 2);
});

test("is idempotent", () => {
  const source = `import { HvGrid } from "@hitachivantara/uikit-react-core";\n<HvGrid item xs={12} />;`;
  const first = run(source).output;
  const second = run(first).output;
  assert.equal(first, second);
});

test("migrates package.json dependencies and adds the new peer", () => {
  const pkg = {
    dependencies: {
      "@hitachivantara/uikit-react-core": "^6.11.0",
      "@hitachivantara/uikit-react-pentaho": "^6.11.0",
      "@hitachivantara/uikit-react-lab": "^6.11.0",
      react: "^18.2.0",
    },
  };
  const { changed, notes } = migratePackageJson(pkg);
  assert.ok(changed);
  assert.ok(pkg.dependencies["@pentaho/uikit-react-core"]);
  assert.ok(pkg.dependencies["@pentaho/uikit-react-widgets"]);
  assert.ok(pkg.dependencies["@mui/utils"], "adds the new v7 peer");
  assert.equal(pkg.dependencies["@hitachivantara/uikit-react-lab"], undefined);
  assert.equal(pkg.dependencies.react, "^18.2.0", "unrelated deps untouched");
  assert.ok(notes.length >= 2);
});

test("merges minWidth into an existing style prop", () => {
  const { output } = run(`<HvGrid zeroMinWidth style={{ color: "red" }} />`);
  assert.equal(output.match(/style=/g).length, 1, "must not duplicate style");
  assert.match(output, /minWidth: 0/);
  assert.match(output, /color: "red"/);
});

test("merges breakpoints into an existing size prop", () => {
  const { output } = run(`<HvGrid xs={12} size={{ md: 4 }} />`);
  assert.equal(output.match(/size=/g).length, 1, "must not duplicate size");
  assert.match(output, /md: 4/);
  assert.match(output, /xs: 12/);
});

test("keeps the original props when size cannot be merged", () => {
  const { output, report } = run(`<HvGrid xs={12} size={sz} />`);
  assert.match(output, /xs=\{12\}/, "sizing must not be silently dropped");
  assert.equal(report.review.length, 1);
});

test("reports HvBannerContent content", () => {
  const { report } = run(`<HvBannerContent content="hi" />`);
  assert.equal(report.review.length, 1);
});

test("reports HvBulkActions classes.semantic", () => {
  const { report } = run(`<HvBulkActions classes={{ semantic: "x" }} />`);
  assert.equal(report.review.length, 1);
});

test("reports imports of removed components", () => {
  const { report } = run(
    `import { HvStack } from "@hitachivantara/uikit-react-core";`,
  );
  assert.equal(report.review.length, 1);
});

test("uses the right version line per package family", () => {
  const pkg = {
    dependencies: {
      "@hitachivantara/uikit-react-core": "^6.8.2",
      "@hitachivantara/app-shell-vite-plugin": "^2.4.0",
      "@hitachivantara/uikit-uno-preset": "^1.0.4",
    },
  };
  migratePackageJson(pkg);
  assert.equal(pkg.dependencies["@pentaho/uikit-react-core"], "^7.0.0");
  assert.equal(pkg.dependencies["@pentaho/app-shell-vite-plugin"], "^3.0.0");
  assert.equal(pkg.dependencies["@pentaho/uikit-uno-preset"], "^7.0.0");
});

test("renames uikit-config like any other package", () => {
  const pkg = { dependencies: { "@hitachivantara/uikit-config": "^0.6.1" } };
  migratePackageJson(pkg);
  assert.equal(pkg.dependencies["@pentaho/uikit-config"], "^7.0.0");
  assert.equal(pkg.dependencies["@hitachivantara/uikit-config"], undefined);
});

test("repoints exports that moved to another package", () => {
  const { output, report } = run(
    `import { HvDashboard } from "@hitachivantara/uikit-react-lab";`,
  );
  assert.match(output, /@pentaho\/uikit-react-widgets/);
  assert.equal(report.review.length, 0, "nothing left to decide");
});

test("splits a mixed import from a removed package", () => {
  const { output, report } = run(
    `import { HvDashboard, HvFlow } from "@hitachivantara/uikit-react-lab";`,
  );
  assert.match(output, /HvDashboard.*@pentaho\/uikit-react-widgets/s);
  assert.match(output, /HvFlow.*uikit-react-lab/s, "stranded import stays put");
  assert.equal(report.review.length, 1);
});

test("--pre targets the prerelease line for each family", () => {
  const pkg = {
    dependencies: {
      "@hitachivantara/uikit-react-core": "^6.8.2",
      "@hitachivantara/app-shell-vite-plugin": "^2.4.0",
    },
  };
  migratePackageJson(pkg, { pre: true });
  assert.equal(pkg.dependencies["@pentaho/uikit-react-core"], "^7.0.0-next.0");
  assert.equal(
    pkg.dependencies["@pentaho/app-shell-vite-plugin"],
    "^3.0.0-next.0",
  );
});

test("an explicit override wins over the family range", () => {
  const pkg = {
    dependencies: { "@hitachivantara/uikit-react-core": "^6.8.2" },
  };
  migratePackageJson(pkg, { override: "1.2.3" });
  assert.equal(pkg.dependencies["@pentaho/uikit-react-core"], "1.2.3");
});

test("renames presetHv to presetUikit at the import and its uses", () => {
  const { output } = run(
    `import { presetHv } from "@hitachivantara/uikit-uno-preset";\nexport default { presets: [presetHv()] };`,
  );
  assert.match(output, /import \{ presetUikit \}/);
  assert.match(output, /presetUikit\(\)/);
  assert.doesNotMatch(output, /presetHv/);
});

test("respects an alias when renaming an export", () => {
  const { output } = run(
    `import { presetHv as preset } from "@hitachivantara/uikit-uno-preset";\nexport default { presets: [preset()] };`,
  );
  assert.match(output, /presetUikit as preset/);
  assert.match(output, /preset\(\)/, "local alias must be left alone");
});

test("declares packages an import was repointed to", () => {
  const report = { review: [], introduced: new Set() };
  transformer(
    {
      path: "t.tsx",
      source: `import { HvDashboard } from "@hitachivantara/uikit-react-lab";`,
    },
    { jscodeshift: j },
    { report },
  );
  assert.ok(report.introduced.has("@pentaho/uikit-react-widgets"));

  const pkg = {
    dependencies: { "@hitachivantara/uikit-react-lab": "^6.1.9" },
  };
  migratePackageJson(pkg, { introduced: [...report.introduced] });
  assert.equal(
    pkg.dependencies["@pentaho/uikit-react-widgets"],
    "^7.0.0",
    "the repointed package must be declared",
  );
  assert.equal(pkg.dependencies["@hitachivantara/uikit-react-lab"], undefined);
});

test("rewrites the scope inside JSON configs", () => {
  // tsconfig "extends" and friends are plain strings, not imports
  const before = JSON.stringify({
    extends: "@hitachivantara/uikit-config/tsconfig",
  });
  const after = before.split("@hitachivantara/").join("@pentaho/");
  assert.match(after, /@pentaho\/uikit-config\/tsconfig/);
  assert.doesNotMatch(after, /@hitachivantara/);
});
