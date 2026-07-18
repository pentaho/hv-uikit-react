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
import path from "node:path";
import { fileURLToPath } from "node:url";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const __rootPath = path.resolve(__dirname, "..");

export const toPascalCase = (str) =>
  (str.match(/[a-zA-Z0-9]+/g) || [])
    .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
    .join("");

export const toCamelCase = (str) =>
  str
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
    .replace(/^\w/, (c) => c.toLowerCase());

export const toKebabCase = (str) =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join("-");

export const toSentenceCase = (str) =>
  str
    .replace(/([A-Z][a-z]+)/g, " $1")
    .replace(/([A-Z]{2,})/g, " $1")
    .replace(/\s{2,}/g, " ")
    .trim();

export const mergeDependenciesObject = (source, destination) => {
  if (source.dependencies != null) {
    Object.assign(destination.dependencies, source.dependencies);
  }
  if (source.devDependencies != null) {
    Object.assign(destination.devDependencies, source.devDependencies);
  }
};
