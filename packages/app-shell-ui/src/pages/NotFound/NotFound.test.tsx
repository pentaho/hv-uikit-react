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
import { screen } from "@testing-library/dom";

import renderTestProvider from "../../tests/testUtils";
import NotFound from "./NotFound";

describe("NotFound", () => {
  it("includes textual and accessibility info", async () => {
    renderTestProvider(<NotFound />);

    const headings = await screen.findAllByRole("heading");
    expect(headings[0].textContent).toBe("404");
    expect(headings[1].textContent).toBe(
      "Oops! Seems like the page is lost in space.",
    );
    expect(
      screen.getByRole("img", {
        name: "404 Page not found",
      }),
    ).toBeDefined();
  });
});
