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
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HvGlobalActions } from "./GlobalActions";

describe("GlobalActions", () => {
  it("should render the header with the correct title and heading level", () => {
    const headingLevel = 3;

    const { container, getByText } = render(
      <HvGlobalActions title="mockTitle" headingLevel={headingLevel} />,
    );

    expect(getByText("mockTitle")).toBeInTheDocument();
    expect(container.querySelector(`h${headingLevel}`)).toBeDefined();
  });

  it("should render the back button", () => {
    const backButton = <div>mockBackButton</div>;

    const { getByText } = render(<HvGlobalActions backButton={backButton} />);

    expect(getByText("mockBackButton")).toBeInTheDocument();
  });
});
