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

import { HvAvatar } from "../Avatar/Avatar";
import { HvAvatarGroup } from "./AvatarGroup";

describe("HvAvatarGroup", () => {
  it("renders the content", () => {
    render(<HvAvatarGroup>TEXT</HvAvatarGroup>);
    expect(screen.getByText("TEXT")).toBeInTheDocument();
  });

  it("renders the correct number of avatars", () => {
    render(
      <HvAvatarGroup>
        <HvAvatar>
          <div role="img" />
        </HvAvatar>
        <HvAvatar>
          <div role="img" />
        </HvAvatar>
        <HvAvatar>
          <div role="img" />
        </HvAvatar>
      </HvAvatarGroup>,
    );

    const renderedAvatars = screen.getAllByRole("img");
    expect(renderedAvatars).toHaveLength(3);
  });

  it("renders the correct number of avatars when `maxVisible` is set", () => {
    render(
      <HvAvatarGroup maxVisible={1}>
        <HvAvatar>
          <div data-testid="img" />
        </HvAvatar>
        <HvAvatar>
          <div data-testid="img" />
        </HvAvatar>
        <HvAvatar>
          <div data-testid="img" />
        </HvAvatar>
      </HvAvatarGroup>,
    );

    const renderedAvatars = screen.getAllByTestId("img");
    expect(renderedAvatars).toHaveLength(1);
  });

  it("renders overflow avatar when number of avatars exceeds maxVisible", () => {
    render(
      <HvAvatarGroup maxVisible={2}>
        <HvAvatar />
        <HvAvatar />
        <HvAvatar />
      </HvAvatarGroup>,
    );

    const overflowAvatar = screen.getByText("+1");
    expect(overflowAvatar).toBeInTheDocument();
  });
});
