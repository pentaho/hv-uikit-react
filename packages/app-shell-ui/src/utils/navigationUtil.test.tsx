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
import { getAppIdFromBundle } from "./navigationUtil";

describe("test navigation utilities", () => {
  describe("test `getAppIdFromBundle` method", () => {
    it("should return the value up to the first slash in the bundle path when it's a non scoped bundle", () => {
      expect(getAppIdFromBundle("dummy-app/pages/dummy-page")).toBe(
        "dummy-app",
      );
    });

    it("should return the value up to the second slash in the bundle path when it's a scoped bundle", () => {
      expect(
        getAppIdFromBundle("@dummy-namespace/dummy-app/pages/dummy-page"),
      ).toBe("@dummy-namespace/dummy-app");
    });
  });
});
