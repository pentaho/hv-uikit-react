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
/** Extracts the SVG viewBox */
export const extractSize = (fileData: string) => {
  const viewBoxRegexp = /viewBox="(\d*?) (\d*?) (\d*?) (\d*?)"/;
  return (viewBoxRegexp.exec(fileData) || []).slice(1, 5).join(" ");
};

/** Creates a standardized component name from a given file and filename */
export const extractColors = (fileData: string) => {
  const regexp = /fill="(.*?)"/g; // find all the fills inside the component

  const foundColors: string[] = fileData.match(regexp) || [];
  return [...new Set(foundColors)].map((c) => c.slice(6, -1));
};

/** Extract colors from the svg to an object */
export const replaceFill = (fileData: string, colorArray: string[]) => {
  let result = fileData;
  colorArray.forEach((element, index) => {
    result = result
      .split(`fill="${element}"`)
      .join(
        index === 0
          ? `className="color${index}" `
          : `className="color${index}" fill="var(--color-${index})" `,
      );
  });

  return result;
};
