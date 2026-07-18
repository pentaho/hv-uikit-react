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

import { HvAppSwitcher, type HvAppSwitcherProps } from "./AppSwitcher";

describe("<AppSwitcher /> with minimum configuration", () => {
  const mockAppSwitcherProps: HvAppSwitcherProps = {
    isOpen: true,
    title: "Mock title",
    applications: [
      {
        id: "app-1",
        name: "Mock App 1",
        url: "http://mockapp1/",
        target: "_top",
      },
      {
        id: "app-2",
        name: "Mock App 2",
        iconUrl: "http://mockapp2/icon",
        description: "Mock App 2 Description",
        url: "http://mockapp2/",
        target: "_blank",
      },
      {
        id: "app-3",
        name: "Mock App 3",
        iconUrl: "http://mockapp2/icon",
        description: "Mock App 2 Description",
        url: "http://mockapp2/",
      },
    ],
    footer: undefined,
  };

  it("should render 3 action components", () => {
    render(<HvAppSwitcher {...mockAppSwitcherProps} />);
    const actions = screen.getAllByRole("listitem");
    expect(actions.length).toBe(3);
  });

  it("should have 2 Info icons rendered", () => {
    render(<HvAppSwitcher {...mockAppSwitcherProps} />);
    const images = screen.getAllByAltText(/Description/i);
    expect(images.length).toBe(2);
  });

  it("should use an avatar for actions without icon", () => {
    const { getAllByText } = render(
      <HvAppSwitcher {...mockAppSwitcherProps} />,
    );
    const avatars = getAllByText("MA", { exact: true });
    expect(avatars.length).toBe(1);
  });

  it('should have "aria-hidden" for avatars', () => {
    render(<HvAppSwitcher {...mockAppSwitcherProps} />);

    const hiddenAvatar = screen
      .getAllByRole("listitem")[0]
      .querySelector('[aria-hidden="true"]');
    expect(hiddenAvatar).not.toBeNull();
  });
});
