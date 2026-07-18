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
/**
 * Creates a full component string based upon provided svg data and a component name
 * @returns content of the `<svg>` as a `<symbol>` with `componentName` as the `id`
 */
export const generateSymbol = (svgOutput: string, componentName: string) => {
  return svgOutput
    .replace(/<svg/, `<symbol id="${componentName}"`)
    .replace(`xmlns="http://www.w3.org/2000/svg"`, "")
    .replace(`</svg>`, `</symbol>`)
    .replace(/\n/g, "")
    .replace(/ {2,}/g, " ");
};
