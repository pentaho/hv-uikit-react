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
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HvLabel } from ".";

describe("Label", () => {
  it("should render the label", () => {
    render(<HvLabel label="LABEL" />);
    expect(screen.getByText("LABEL")).toBeInTheDocument();
  });
});
