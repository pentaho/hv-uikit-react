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

import { HvTab } from "./Tab";

describe("Tab", () => {
  it("should render correctly", () => {
    render(<HvTab label="Clickable tab" />);

    expect(
      screen.getByRole("tab", { name: "Clickable tab" }),
    ).toBeInTheDocument();
  });
});
