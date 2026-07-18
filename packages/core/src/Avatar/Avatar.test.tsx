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

import { HvAvatar } from "./Avatar";

describe("Avatar", () => {
  it("renders the text", () => {
    render(<HvAvatar>AB</HvAvatar>);

    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("renders the icon", () => {
    render(
      <HvAvatar>
        <div data-testid="login" />
      </HvAvatar>,
    );

    expect(screen.getByTestId("login")).toBeInTheDocument();
  });
});
