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

import { HvCard, HvCardContent, HvCardHeader, HvCardMedia } from ".";

describe("Card", () => {
  it("should render header", () => {
    render(
      <HvCard>
        <HvCardHeader title="mockTitle" subheader="mockSubtitle" />
      </HvCard>,
    );
    expect(screen.getByText("mockTitle")).toBeInTheDocument();
    expect(screen.getByText("mockSubtitle")).toBeInTheDocument();
  });

  it("should render image", () => {
    const mockImg = "";
    render(
      <HvCard>
        <HvCardMedia component="img" alt="mockImg" image={mockImg} />
      </HvCard>,
    );
    expect(screen.getByRole("img", { name: /mockImg/ })).toBeInTheDocument();
  });

  it("should render content", () => {
    render(
      <HvCard>
        <HvCardContent>
          <div>mockCardContent</div>
        </HvCardContent>
      </HvCard>,
    );
    expect(screen.getByText("mockCardContent")).toBeInTheDocument();
  });

  it("should render all the components", () => {
    const mockImg = "";
    render(
      <HvCard>
        <HvCardHeader title="mockTitle" subheader="mockSubtitle" />
        <HvCardMedia component="img" alt="mockImg" image={mockImg} />
        <HvCardContent>
          <div>mockCardContent</div>
        </HvCardContent>
      </HvCard>,
    );
    expect(screen.getByText("mockTitle")).toBeInTheDocument();
    expect(screen.getByText("mockSubtitle")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /mockImg/ })).toBeInTheDocument();
    expect(screen.getByText("mockCardContent")).toBeInTheDocument();
  });
});
