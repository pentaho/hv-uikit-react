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
const createAppContainerElement = (id?: string): HTMLElement => {
  const panelContainerId = "app-shell-panel-container";
  let panelContainerElement = document.getElementById(id ?? panelContainerId);

  if (!panelContainerElement) {
    panelContainerElement = document.createElement("div");
    panelContainerElement.id = panelContainerId;
    document.body.appendChild(panelContainerElement);
  }

  return panelContainerElement;
};

export default createAppContainerElement;
