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
import { describe, expect, it } from "vitest";

import {
  addUseCredentials,
  checkCrossOrigin,
} from "../vite-plugin-crossorigin-fix";

describe("vite-crossorigin-fix", () => {
  describe("checkCrossOrigin", () => {
    it('should return an empty array if no scripts have crossorigin="use-credentials"', () => {
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <title>Test</title>
        </head>
        <body>
          <script src="/assets/main.js"></script>
        </body>
        </html>
      `;

      const result = checkCrossOrigin(html);
      expect(result).toEqual([]);
    });

    it('should return an array of script sources with crossorigin="use-credentials"', () => {
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <title>Test</title>
        </head>
        <body>
          <script src="/assets/main.js" crossorigin="use-credentials" type="module"></script>
        </body>
        </html>
      `;

      const result = checkCrossOrigin(html);
      expect(result).toEqual(["/assets/main.js"]);
    });

    it("should ignore scripts that are not modules", () => {
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <title>Test</title>
        </head>
        <body>
          <script src="/assets/main.js" crossorigin="use-credentials"></script>
        </body>
        </html>
      `;

      const result = checkCrossOrigin(html);
      expect(result).toEqual([]);
    });

    it("should ignore external and data URLs", () => {
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <title>Test</title>
        </head>
        <body>
          <script src="https://external.com/main.js" crossorigin="use-credentials" type="module"></script>
          <script src="data:text/javascript;base64,abcd" crossorigin="use-credentials" type="module"></script>
        </body>
        </html>
      `;

      const result = checkCrossOrigin(html);
      expect(result).toEqual([]);
    });
  });

  describe("addUseCredentials", () => {
    it('should add crossorigin="use-credentials" to all script tags', () => {
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <title>Test</title>
        </head>
        <body>
          <script 
            src="/assets/main.js" 
            crossorigin type="module"></script>
        </body>
        </html>
      `;

      const result = addUseCredentials("main.js", html);
      expect(result).toContain('crossorigin="use-credentials"');
    });

    it('should handle link rel="modulepreload" tags', () => {
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <title>Test</title>
          <link rel="modulepreload"
            href="/assets/main.js"
            crossorigin>
        </head>
        <body>
        </body>
        </html>
      `;

      const result = addUseCredentials("main.js", html);
      expect(result).toContain('crossorigin="use-credentials"');
    });
  });
});
