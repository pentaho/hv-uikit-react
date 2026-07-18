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
import getBasePath from "./basePathUtils";

describe("getBasePath Utils", () => {
  it("empty config returns /", () => {
    expect(getBasePath({})).toBe("/");
  });

  it("should return baseUrl for the baseUrl property", () => {
    expect(getBasePath({ baseUrl: "/dummy-base-url/" })).toBe(
      "/dummy-base-url/",
    );
  });
});
