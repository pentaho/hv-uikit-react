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

import { HvSkeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("doesn't show the Skeleton element if it's hidden", () => {
    render(<HvSkeleton data-testid="skeleton" hidden />);
    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
  });

  it("has the appropriate role when provided", () => {
    render(<HvSkeleton role="progressbar" aria-label="Loading" />);
    expect(
      screen.getByRole("progressbar", { name: "Loading" }),
    ).toBeInTheDocument();
  });
});
