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
import { join } from "node:path";
import fs from "fs-extra";
import nodePlop from "node-plop";

import { __dirname } from "./utils.js";

const plop = await nodePlop(`${__dirname}/plopfile.js`);

const createRoute = plop.getGenerator("createRoute");

export const createNavigationFiles = async (path) => {
  const pages = fs.readdirSync(join(path, "src/pages"));

  /* eslint-disable no-await-in-loop */
  for (const page of pages) {
    if (page === "NotFound") break;

    // create routes file from plop template
    await createRoute.runActions({ path, name: page });
  }
};
