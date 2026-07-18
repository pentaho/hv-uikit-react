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
import type { HvColor } from "@hitachivantara/uikit-styles";

const hexColorMap: Record<string, HvColor> = {
  "#414141": "text", // secondary
  "#fff": "bgContainer", // atmo1
  "#f0f0f0": "bgPage", // atmo2
  "#ccced0": "border", // atmo4
};

/**
 * Creates a full component string based upon provided svg data and a component name
 * @returns The parsed component string
 */
export const generateComponent = (
  svgOutput: string,
  iconName: string,
  colorArray: string[],
  viewBox: string,
) => {
  const palette = colorArray.map((c) => `"${hexColorMap[c] || c}"`).join(",");
  const finalOutput = /(\/>.*){2,}/.test(svgOutput)
    ? `<>${svgOutput}</>`
    : svgOutput;

  return `export const ${iconName} = createHvIcon("${iconName}", "${viewBox}", [${palette}], ${finalOutput});\n`;
};
