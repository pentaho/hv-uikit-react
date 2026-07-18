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

import { HvInfoMessage } from ".";

describe("InfoMessage", () => {
  it("should render the content", () => {
    render(<HvInfoMessage>CONTENT</HvInfoMessage>);
    expect(screen.getByText("CONTENT")).toBeInTheDocument();
  });
});
