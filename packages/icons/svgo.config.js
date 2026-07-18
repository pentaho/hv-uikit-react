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
export default {
  multipass: true,
  quiet: "true",
  plugins: [
    "prefixIds",
    "cleanupAttrs",
    "cleanupEnableBackground",
    "cleanupListOfValues",
    "collapseGroups",
    "convertColors",
    "convertShapeToPath",
    "convertStyleToAttrs",
    "convertTransform",
    "mergePaths",
    "minifyStyles",
    "moveElemsAttrsToGroup",
    "moveGroupAttrsToElems",
    // "removeAttrs",
    "removeComments",
    "removeDesc",
    "removeDimensions",
    "removeDoctype",
    "removeEditorsNSData",
    "removeElementsByAttr",
    "removeEmptyAttrs",
    "removeEmptyContainers",
    "removeEmptyText",
    "removeHiddenElems",
    "removeMetadata",
    "removeNonInheritableGroupAttrs",
    "removeTitle",
    "removeUnusedNS",
    "removeUselessDefs",
    "removeXMLProcInst",
    "sortAttrs",
    {
      name: "removeUselessStrokeAndFill",
      params: {
        removeNone: true,
      },
    },
    {
      name: "preset-default",
      params: {
        overrides: {
          inlineStyles: {
            onlyMatchedOnce: false,
          },
          removeUnknownsAndDefaults: {
            keepDataAttrs: false,
          },
          convertPathData: {
            floatPrecision: 2,
          },
          cleanupNumericValues: {
            floatPrecision: 2,
          },
        },
      },
    },
  ],
};
