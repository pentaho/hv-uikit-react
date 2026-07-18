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
export const navigationData = [
  { id: "components", label: "Components", path: "/" },
  {
    id: "templates",
    label: "Templates",
    path: "/templates",
    data: [
      { id: "welcome", label: "Welcome", path: "/templates/welcome" },
      { id: "assets", label: "Asset Inventory", path: "/templates/assets" },
      { id: "dashboard", label: "Dashboard", path: "/templates/dashboard" },
      { id: "list-view", label: "List View", path: "/templates/list-view" },
      { id: "form", label: "Form", path: "/templates/form" },
      { id: "details", label: "Details View", path: "/templates/details" },
      { id: "kanban", label: "Kanban Board", path: "/templates/kanban" },
      { id: "canvas", label: "Canvas", path: "/templates/canvas" },
    ],
  },
  { id: "flow", label: "Flow", path: "/flow" },
];
