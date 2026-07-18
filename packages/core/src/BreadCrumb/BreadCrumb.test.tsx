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
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { HvBreadCrumb } from "./BreadCrumb";

const data = [
  { label: "Label 1", path: "route1" },
  { label: "Label 2", path: "route2" },
  { label: "Label 3", path: "route3" },
  { label: "Label 4", path: "route4" },
  { label: "Label 5", path: "route5" },
  { label: "Label 6", path: "route6" },
  { label: "Label 7", path: "route7" },
];

describe("BreadCrumb", () => {
  it("renders the correct number of items", () => {
    render(<HvBreadCrumb listRoute={data} />);
    expect(screen.queryAllByRole("listitem").length).toBe(7);
    expect(screen.getByText("Label 1")).toBeInTheDocument();
    expect(screen.getByText("Label 7")).toBeInTheDocument();
  });

  it("renders the correct number of items if maxVisible is specified", () => {
    render(<HvBreadCrumb listRoute={data} maxVisible={3} />);
    expect(screen.queryAllByRole("listitem").length).toBe(4);
    expect(screen.getByText("Label 1")).toBeInTheDocument();
    expect(screen.queryByText("Label 2")).toBeNull();
    expect(screen.queryByText("Label 5")).toBeNull();
    expect(screen.getByText("Label 6")).toBeInTheDocument();
    expect(screen.getByText("Label 7")).toBeInTheDocument();
  });

  it("renders an URL correctly", () => {
    render(<HvBreadCrumb url="https://example.com/route1/route2/route3" />);
    const firstLink = screen.getByRole("link", { name: /route1/i });
    expect(firstLink).toBeInTheDocument();
    expect(firstLink).toHaveAttribute("href", "https://example.com/route1");
    expect(screen.getByRole("link", { name: /route2/i })).toBeInTheDocument();
    expect(screen.getByText(/route3/i)).toBeInTheDocument();
  });

  it("renders a path correctly", () => {
    render(<HvBreadCrumb url="/path1/path2/path3" />);
    const firstLink = screen.getByRole("link", { name: /path1/i });
    expect(firstLink).toBeInTheDocument();
    expect(firstLink).toHaveAttribute("href", "/path1");
    expect(screen.getByRole("link", { name: /path2/i })).toBeInTheDocument();
    expect(screen.getByText(/path3/i)).toBeInTheDocument();
  });

  it("renders home icon and triggers onClick", async () => {
    const handleClick = vi.fn();
    render(
      <HvBreadCrumb
        listRoute={data}
        home={{ label: "Home", path: "/" }}
        onClick={handleClick}
      />,
    );
    const homeButton = screen.getByRole("link", { name: /home/i });
    expect(homeButton).toBeInTheDocument();
    await userEvent.click(homeButton);
    expect(handleClick).toHaveBeenCalled();
  });
});
