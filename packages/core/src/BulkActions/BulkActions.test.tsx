import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HvBulkActions, HvBulkActionsProps } from "./BulkActions";

const Sample = (props: Partial<HvBulkActionsProps>) => {
  const [numSelected, setNumSelected] = useState(0);

  const handleSelectAll = () => {
    setNumSelected(8);
  };

  return (
    <HvBulkActions
      numTotal={8}
      numSelected={numSelected}
      onSelectAll={handleSelectAll}
      maxVisibleActions={2}
      actions={[
        { id: "add", label: "Add", icon: <div /> },
        { id: "delete", label: "Delete", icon: <div /> },
        { id: "lock", label: "Lock", icon: <div /> },
        { id: "put", label: "Preview", icon: <div /> },
      ]}
      {...props}
    />
  );
};

describe("BulkActions", () => {
  it("should render select all component correctly", async () => {
    const user = userEvent.setup();
    render(<Sample />);

    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAccessibleName("0 / 8");

    // Select all
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAccessibleName("8 / 8");
  });

  it("should call select all correctly", async () => {
    const user = userEvent.setup();
    const callbackSpy = vi.fn();

    render(<Sample onSelectAll={callbackSpy} />);

    const checkbox = screen.getByRole("checkbox");

    // Select all
    await user.click(checkbox);

    expect(callbackSpy).toHaveBeenCalledOnce();
  });

  it("should render the actions correctly and call onAction when clicked", async () => {
    const user = userEvent.setup();
    const callbackSpy = vi.fn();

    render(<Sample onAction={callbackSpy} />);

    const buttons = screen.getAllByRole("button");
    const button1 = buttons[0];
    const button2 = buttons[1];
    const button3 = buttons[2];

    expect(buttons).toHaveLength(3);
    expect(button1).toBeDisabled();
    expect(button2).toBeDisabled();
    expect(button3).toBeDisabled();

    const checkbox = screen.getByRole("checkbox");

    // Select all
    await user.click(checkbox);

    expect(button1).toBeEnabled();
    expect(button2).toBeEnabled();
    expect(button3).toBeEnabled();

    // Click action
    await user.click(button1);

    expect(callbackSpy).toHaveBeenCalledTimes(1);

    // Open actions
    await user.click(button3);

    const menu = screen.getByRole("menu");
    const items = screen.getAllByRole("menuitem");

    expect(menu).toBeInTheDocument();
    expect(items).toHaveLength(2);
  });
});
