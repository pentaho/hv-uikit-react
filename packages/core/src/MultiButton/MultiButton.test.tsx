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
import { HvMultiButton } from "./MultiButton";

describe("MultiButton", () => {
  it("should render the buttons", () => {
    render(
      <HvMultiButton>
        <HvButton key="1" startIcon={<div />}>
          Button1
        </HvButton>
        <HvButton key="2" startIcon={<div />}>
          Button2
        </HvButton>
      </HvMultiButton>,
    );
    const buttons = screen.queryAllByRole("button");
    expect(buttons.length).toBe(2);
  });
});
