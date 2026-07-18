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

import { HvButton } from "../Button";
import { HvActionBar } from "./ActionBar";

describe("ActionBar", () => {
  it("renders content correctly", () => {
    render(
      <HvActionBar>
        <HvButton>CONTENT</HvButton>
      </HvActionBar>,
    );
    const content = screen.getByRole("button", { name: "CONTENT" });
    expect(content).toBeInTheDocument();
  });
});
