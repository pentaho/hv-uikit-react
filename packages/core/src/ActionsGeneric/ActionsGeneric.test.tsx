import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HvActionsGeneric, HvActionsGenericProps } from "./ActionsGeneric";

const actions: HvActionsGenericProps["actions"] = [
  { id: "post", label: "Add", icon: <div />, disabled: true },
  { id: "get", label: "Preview", icon: <div />, iconOnly: true },
  { id: "put", label: "Upload", disabled: true, iconOnly: false },
  { id: "delete", label: "Delete" },
];

describe("ActionsGeneric", () => {
  it("should only show maxVisibleActions actions and a dropdown menu should have the remaining actions", async () => {
    const user = userEvent.setup();
    render(<HvActionsGeneric actions={actions} maxVisibleActions={2} />);

    const buttons = screen.getAllByRole("button");
    const dropdownBtn = screen.getByRole("button", { name: "Dropdown menu" });

    expect(buttons).toHaveLength(3);
    expect(dropdownBtn).toBeInTheDocument();

    await user.click(dropdownBtn);

    const menu = screen.getByRole("menu");
    const menuItems = screen.getAllByRole("menuitem");

    expect(menu).toBeInTheDocument();
    expect(menuItems).toHaveLength(2);
  });

  it("should call onAction on action click", async () => {
    const user = userEvent.setup();
    const callbackSpy = vi.fn();
    render(
      <HvActionsGeneric
        actions={actions}
        onAction={callbackSpy}
        maxVisibleActions={2}
      />,
    );

    const previewBtn = screen.getByRole("button", { name: "Preview" });

    await user.click(previewBtn);
    expect(callbackSpy).toHaveBeenCalledTimes(1);

    const dropdownBtn = screen.getByRole("button", { name: "Dropdown menu" });
    await user.click(dropdownBtn);

    const deleteItem = screen.getByText("Delete");
    await user.click(deleteItem);

    expect(callbackSpy).toHaveBeenCalledTimes(2);
  });

  it("should not call onAction if the action is disabled", async () => {
    const user = userEvent.setup();
    const callbackSpy = vi.fn();
    render(
      <HvActionsGeneric
        actions={actions}
        onAction={callbackSpy}
        maxVisibleActions={2}
      />,
    );

    const addBtn = screen.getByRole("button", { name: "Add" });

    await user.click(addBtn);
    expect(callbackSpy).not.toHaveBeenCalled();

    const dropdownBtn = screen.getByRole("button", { name: "Dropdown menu" });
    await user.click(dropdownBtn);

    const uploadItem = screen.getByText("Upload");
    await user.click(uploadItem);

    expect(callbackSpy).not.toHaveBeenCalled();
  });

  it("should render an icon button when iconOnly is true for an action", async () => {
    const user = userEvent.setup();
    render(<HvActionsGeneric actions={actions} maxVisibleActions={2} />);

    const addBtn = screen.getByRole("button", { name: "Add" });
    expect(addBtn).toHaveTextContent("Add");

    const previewBtn = screen.getByRole("button", { name: "Preview" });
    expect(previewBtn).not.toHaveTextContent("Preview");

    await user.hover(previewBtn);
    await waitFor(() => {
      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent("Preview");
    });
  });

  it("should render icon buttons for all visible actions when iconOnly is true at the component level", async () => {
    const user = userEvent.setup();
    render(
      <HvActionsGeneric iconOnly actions={actions} maxVisibleActions={1} />,
    );

    const addBtn = screen.getByRole("button", { name: "Add" });
    expect(addBtn).not.toHaveTextContent("Add");

    await user.hover(addBtn);
    await waitFor(() => {
      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent("Add");
    });
  });

  it("iconOnly at the action level should override iconOnly", async () => {
    render(
      <HvActionsGeneric iconOnly actions={actions} maxVisibleActions={3} />,
    );

    const uploadBtn = screen.getByRole("button", { name: "Upload" });
    expect(uploadBtn).toHaveTextContent("Upload");
  });
});
