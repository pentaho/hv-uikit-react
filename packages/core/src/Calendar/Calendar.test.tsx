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

import { HvCalendar } from "./Calendar";

describe("<Calendar /> with minimum configuration", () => {
  it("should render composed navigation components", () => {
    const { container } = render(<HvCalendar />);

    expect(
      container.getElementsByClassName(
        "HvComposedNavigation-navigationContainer",
      ),
    ).toHaveLength(1);
  });
});

describe("<Calendar /> with configurations", () => {
  it("renders the month and year", () => {
    const selectedDate = new Date("2020-01-10");
    render(
      <HvCalendar
        visibleMonth={selectedDate.getMonth() + 1}
        visibleYear={selectedDate.getFullYear()}
        value={selectedDate}
      />,
    );

    expect(screen.getByText("January")).toBeInTheDocument();
    expect(screen.getByText("2020")).toBeInTheDocument();
  });
});
