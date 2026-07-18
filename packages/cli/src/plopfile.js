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
const createRoute = {
  actions: [
    {
      type: "append",
      path: "{{path}}/src/routes.tsx",
      pattern: "// APP ROUTES",
      template: `  { path: "{{kebabCase name}}", lazy: () => import("./pages/{{name}}") },`,
    },
  ],
};

const createReadMe = {
  actions: [
    {
      type: "add",
      path: "{{path}}/README.md",
      templateFile: "plop-templates/README.md.hbs",
    },
  ],
};

const createAppShellIndexHtml = {
  actions: [
    {
      type: "add",
      path: "{{path}}/index.html",
      templateFile: "plop-templates/app-shell/index.html.hbs",
      force: true,
    },
  ],
};

const createAppShellConfig = {
  actions: [
    {
      type: "add",
      path: "{{path}}/app-shell.config.ts",
      templateFile: "plop-templates/app-shell/app-shell.config.ts.hbs",
    },
  ],
};

const createAppShellAutoMenu = {
  actions: [
    {
      type: "append",
      path: "{{path}}/vite.config.ts",
      pattern: "autoViewsAndRoutes: true,",
      template: `      autoMenu: true,`,
    },
  ],
};

export default (plop) => {
  plop.setHelper("precurly", (t) => `${t}`);
  plop.setGenerator("createRoute", createRoute);
  plop.setGenerator("createReadMe", createReadMe);
  plop.setGenerator("createAppShellIndexHtml", createAppShellIndexHtml);
  plop.setGenerator("createAppShellConfig", createAppShellConfig);
  plop.setGenerator("createAppShellAutoMenu", createAppShellAutoMenu);
};
