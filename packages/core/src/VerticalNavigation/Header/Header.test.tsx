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

import { HvVerticalNavigationHeader } from ".";

const Sample = () => {
  return (
    <HvVerticalNavigationHeader
      title="Menu"
      openIcon={<div />}
      closeIcon={<div />}
      collapseButtonProps={{
        "aria-label": "collapseButton",
        "aria-expanded": true,
      }}
    />
  );
};

describe("VerticalNavigation - Header", () => {
  it("should be defined", () => {
    const { container } = render(<Sample />);
    expect(container).toBeDefined();
  });
});
