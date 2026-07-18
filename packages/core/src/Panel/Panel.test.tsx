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

import { HvPanel } from "./Panel";

describe("Panel", () => {
  it("should render the Panel", async () => {
    render(
      <HvPanel>
        <div>Panel Content</div>
      </HvPanel>,
    );
    const component = await screen.findAllByText("Panel Content");
    expect(component.length).toBe(1);
  });
});
