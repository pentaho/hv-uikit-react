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

import { HvTypography } from "../Typography";
import { HvContainer } from "./Container";

describe("Container", () => {
  it("renders the content", () => {
    render(
      <HvContainer>
        <HvTypography variant="title1">CONTENT</HvTypography>
      </HvContainer>,
    );
    expect(
      screen.getByRole("heading", { name: "CONTENT" }),
    ).toBeInTheDocument();
  });
});
