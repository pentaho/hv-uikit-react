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
import { render } from "@testing-library/react";

import { HvSimpleGrid } from "./SimpleGrid";

describe("SimpleGrid", () => {
  it("correct render children", () => {
    const { getByTestId } = render(
      <HvSimpleGrid data-testid="ancestor">
        <p data-testid="descendant">Hello world</p>
      </HvSimpleGrid>,
    );
    const ancestor = getByTestId("ancestor");
    const descendant = getByTestId("descendant");
    expect(ancestor).toContainElement(descendant);
  });
});
