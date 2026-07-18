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

import { HvSection } from "./Section";

describe("Section", () => {
  it("contains all the steps", () => {
    render(<HvSection title="Section Title" />);
    expect(screen.getByText("Section Title")).toBeInTheDocument();
  });

  it("renders the content when it's not expandable", () => {
    render(
      <HvSection title="Section Title" expanded>
        <div>Child Content</div>
      </HvSection>,
    );
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  it("renders the content when it's expandable and is expanded by default", () => {
    render(
      <HvSection title="Section Title" expandable defaultExpanded>
        <div>Child Content</div>
      </HvSection>,
    );
    expect(screen.queryByText("Child Content")).toBeInTheDocument();
  });

  it("doesn't render the content when it's expandable and is not expanded by default", () => {
    render(
      <HvSection title="Section Title" expandable defaultExpanded={false}>
        <div>Child Content</div>
      </HvSection>,
    );
    expect(screen.queryByText("Child Content")).not.toBeVisible();
  });

  it("toggles the expanded state when the expand button is clicked", async () => {
    render(
      <HvSection title="Section Title" expandable defaultExpanded={false}>
        <div>Child Content</div>
      </HvSection>,
    );

    expect(screen.queryByText("Child Content")).not.toBeVisible();

    await userEvent.click(screen.getByRole("button"));
    expect(screen.queryByText("Child Content")).toBeVisible();

    await userEvent.click(screen.getByRole("button"));
    expect(screen.queryByText("Child Content")).not.toBeVisible();
  });

  it("toggles the expanded state when the header is clicked", async () => {
    const toggleMock = vi.fn();
    render(
      <HvSection
        title="Section Title"
        expandable
        expandableHeader
        defaultExpanded={false}
        onToggle={toggleMock}
      >
        <div>Child Content</div>
      </HvSection>,
    );

    expect(screen.queryByText("Child Content")).not.toBeVisible();

    await userEvent.click(screen.getByText("Section Title"));
    expect(screen.queryByText("Child Content")).toBeVisible();
    expect(toggleMock).toHaveBeenCalledWith(expect.anything(), true);
  });

  it("doesn't toggle the expanded state when an action is clicked", async () => {
    const toggleMock = vi.fn();
    render(
      <HvSection
        title="Section Title"
        expandable
        expandableHeader
        defaultExpanded={false}
        actions={<button type="button">Action</button>}
        onToggle={toggleMock}
      >
        <div>Child Content</div>
      </HvSection>,
    );

    expect(screen.queryByText("Child Content")).not.toBeVisible();

    await userEvent.click(screen.getByRole("button", { name: "Action" }));
    expect(screen.queryByText("Child Content")).not.toBeVisible();
    expect(toggleMock).not.toHaveBeenCalled();
  });

  it("renders the actions prop", () => {
    const actions = <button type="button">Action 1</button>;
    render(<HvSection title="Section Title" actions={actions} />);

    expect(screen.getByText("Action 1")).toBeInTheDocument();
  });
});
