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

import InternalAction from "./InternalAction";

describe("InternalAction Component", () => {
  it("should not render anything when the bundle doesn't have a match", () => {
    const { container } = render(<InternalAction bundle="dummy-bundle" />);

    expect(container).toBeEmptyDOMElement();
  });
});
