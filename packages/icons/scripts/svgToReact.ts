/* eslint-disable no-console */
import fs from "node:fs/promises";
import { parse, resolve } from "node:path";
import { transform } from "@svgr/core";

import { generateComponent } from "./generateComponent.ts";
import { extractColors, extractSize, replaceFill } from "./utils.ts";

const transformToJsx = (fileData: string, iconName: string) => {
  const svgJsx = transform.sync(fileData, {
    plugins: ["@svgr/plugin-jsx"],
    jsxRuntime: "automatic",
    // we only care about the JSX part of the generated React component
    template: (vars, { tpl }) => tpl`${vars.jsx}`,
  });

  // TODO: simplify this logic
  const viewBox = extractSize(svgJsx);
  const colorArray = extractColors(svgJsx);
  const jsxSvgFixedColors = replaceFill(svgJsx, colorArray)
    // remove svg tag, keeping only the content
    .replace(/<svg.*?>(.*?)<\/svg>;/s, "$1");

  // Wrap it up in a React component
  return generateComponent(jsxSvgFixedColors, iconName, colorArray, viewBox);
};

/** Converts all SVGs in `inputDir` to JSX & writes result to `outputFile` */
async function convertSvgFiles(inputDir: string, outputFile: string) {
  const files = await fs.readdir(resolve(inputDir), { withFileTypes: true });
  const svgFiles = files.filter((f) => f.isFile() && f.name.endsWith(".svg"));

  const data = await Promise.all(
    svgFiles.map(async (f) => ({
      name: parse(f.name).name.replace(/[-.]g/, ""),
      data: await fs.readFile(resolve(inputDir, f.name), "utf-8"),
    })),
  );

  const headers = `import { createHvIcon } from "./IconBase";`;
  const output = data.map((f) => transformToJsx(f.data, f.name)).join("");

  await fs.writeFile(resolve(outputFile), `${headers}\n${output}`);
}

const makeHeaders = (name: string) => `
export * from "./${name}";
import * as ${name} from "./${name}";
export { ${name} };
`;

async function main() {
  const inputPath = "assets";
  const outputPath = "src";

  await fs.mkdir(resolve(outputPath), { recursive: true });

  await convertSvgFiles(inputPath, `${outputPath}/icons.tsx`);

  const files = await fs.readdir(inputPath, { withFileTypes: true });
  const subDirs = files.filter((f) => f.isDirectory()).map((f) => f.name);

  await Promise.all(
    subDirs.map((dir) =>
      convertSvgFiles(`${inputPath}/${dir}`, `${outputPath}/${dir}.tsx`),
    ),
  );

  const allDirs = ["icons", ...subDirs];

  const indexFile = `
export * from "./IconBase";
export * from "./IconSprite";
export * from "./IconContainer";
${allDirs.map(makeHeaders).join("")}
`;
  await fs.writeFile(resolve("src/index.ts"), indexFile);
}

main();
