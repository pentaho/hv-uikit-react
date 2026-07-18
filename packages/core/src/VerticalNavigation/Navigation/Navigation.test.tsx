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
import { describe, expect, it } from "vitest";

import { HvVerticalNavigationTree } from "./Navigation";

const Sample = () => {
  return <HvVerticalNavigationTree aria-label="Example 1 navigation" />;
};

describe("VerticalNavigation - Navigation", () => {
  it("should be defined", () => {
    const { container } = render(<Sample />);
    expect(container).toBeDefined();
  });
});
