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
const SELECTORS =
  'input, button, select, textarea, a[href], [tabindex]:not([tabindex="-1"])';

/** Gets the list of focusable elements. */
export const getFocusableList = (node: any) =>
  node?.querySelectorAll(SELECTORS) || [];

/** Auxiliary function to find adjacent nodes to focus. */
export const getPrevNextFocus = (nodeId?: string) => {
  const nodes = getFocusableList(document);

  const nbNodes = nodes.length;
  let index = 0;
  for (; index < nbNodes; index += 1) {
    if (nodes[index].id === nodeId) {
      break;
    }
  }
  return {
    nextFocus: nodes[index + 1 > nbNodes - 1 ? 0 : index + 1],
    prevFocus: nodes[index - 1 < 0 ? nbNodes - 1 : index - 1],
  };
};

/** Get the first and last focusable element from a node. */
export const getFirstAndLastFocus = (node: any) => {
  const focusableList = getFocusableList(node);

  return {
    first: focusableList[0] || null,
    last: focusableList[focusableList.length - 1] || null,
  };
};

export default getPrevNextFocus;
