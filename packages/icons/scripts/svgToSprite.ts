/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
/* eslint-disable no-console */
import fs from "node:fs";
import path from "node:path";
import recursive from "recursive-readdir";

import { generateSymbol } from "./generateSymbol.ts";
import { extractColors, replaceFill } from "./utils.ts";

// Resolve arguments
const inputPath = "assets";
const outputPath = "sprites";

const outputFolder = outputPath
  ? path.resolve(process.cwd(), outputPath)
  : path.resolve(process.cwd());

/**
 * Recursively get all SVG file paths in a directory, grouped by sub-folder name.
 * @param dirPath The path to the directory to search.
 * @returns A Promise that resolves with an object that maps each sub-folder name to an array of SVG file paths.
 */
async function getSvgPathsByGroup(dirPath: string) {
  const svgPathsByGroup: Record<string, string[]> = {};
  const files = await recursive(dirPath);
  for (const file of files) {
    if (path.extname(file) === ".svg") {
      const folderName = path.dirname(file);
      const groupName =
        folderName === dirPath ? "icons" : path.basename(folderName);
      if (!svgPathsByGroup[groupName]) {
        svgPathsByGroup[groupName] = [];
      }
      svgPathsByGroup[groupName].push(file);
    }
  }
  return svgPathsByGroup;
}

// Create the output directory if it doesn't exist
fs.mkdir(outputFolder, { recursive: true }, (err) => {
  if (err) {
    throw Error(err.message);
  }
});

// Create a sprite for each group of SVG files
(async () => {
  const svgPathsByGroup = await getSvgPathsByGroup(inputPath);
  for (const groupName in svgPathsByGroup) {
    if (Object.hasOwn(svgPathsByGroup, groupName)) {
      const svgPaths = svgPathsByGroup[groupName];
      const symbolsSvgPath = path.resolve(
        process.cwd(),
        outputPath,
        `${groupName}.svg`,
      );
      const spriteStream = fs.createWriteStream(symbolsSvgPath, { flags: "w" });
      spriteStream.on("error", (err) => {
        console.error(err);
      });
      spriteStream.on("open", () => {
        spriteStream.write(
          `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" viewBox="0 0 0 0">\n`,
        );

        for (const svgPath of svgPaths) {
          const svgData = fs.readFileSync(svgPath, "utf8");
          const colorObject = extractColors(svgData);
          const svgWithCssVars = replaceFill(svgData, colorObject);
          const symbol = generateSymbol(
            svgWithCssVars,
            path.basename(svgPath, ".svg"),
          );
          spriteStream.write(symbol);
          spriteStream.write("\n");
        }
        spriteStream.write("</svg>");
        spriteStream.end(() => {
          spriteStream.close();
        });
      });
    }
  }
})();
