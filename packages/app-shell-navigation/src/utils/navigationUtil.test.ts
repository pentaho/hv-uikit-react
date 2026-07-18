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
import compileHref from "./navigationUtil";

describe("test navigation utilities", () => {
  describe("test `compileHref` method", () => {
    it("should return same as input without hrefOptions", () => {
      expect(compileHref("/param1")).toBe("/param1");
      expect(compileHref("/param1/param2?mode=dark")).toBe(
        "/param1/param2?mode=dark",
      );
    });

    it("should replace href placeholders with hrefOptions correctly", () => {
      expect(
        compileHref("/dummyRoute2/:test/something/:dummy", {
          test: "details",
          dummy: "4",
        }),
      ).toBe("/dummyRoute2/details/something/4");

      expect(
        compileHref("/dummyRoute3/:color/:color2", {
          color: "dark",
          color2: "light",
        }),
      ).toBe("/dummyRoute3/dark/light");

      expect(
        compileHref("/dummyRoute3/:color2/:color", {
          color: "dark",
          color2: "light",
        }),
      ).toBe("/dummyRoute3/light/dark");
    });

    it("should encode href correctly", () => {
      expect(
        compileHref("/:cardText", {
          cardText: "Text for card",
        }),
      ).toBe("/Text%20for%20card");
    });
  });
});
