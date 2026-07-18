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
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { HvDropdown } from "./Dropdown";

describe("Dropdown", () => {
  it("should open dropdown on click", async () => {
    render(
      <HvDropdown
        aria-label="Main sample"
        multiSelect
        showSearch
        values={[
          { label: "value 1" },
          { label: "value 2", selected: true },
          { label: "value 3" },
          { label: "value 4" },
        ]}
      />,
    );

    const dropdown = screen.getByRole("combobox");

    expect(dropdown).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(dropdown);

    expect(dropdown).toHaveAttribute("aria-expanded", "true");
  });

  it("should be disabled", async () => {
    const { container } = render(
      <HvDropdown
        aria-label="Main sample"
        multiSelect
        showSearch
        disabled
        values={[
          { label: "value 1" },
          { label: "value 2", selected: true },
          { label: "value 3" },
          { label: "value 4" },
        ]}
      />,
    );
    expect(
      container.getElementsByClassName("HvBaseDropdown-rootDisabled"),
    ).toHaveLength(1);

    const DropdownHeader = screen.getByRole("combobox");

    expect(DropdownHeader).toHaveAttribute("aria-expanded", "false");
  });

  it("should be invalid", async () => {
    render(
      <HvDropdown
        aria-label="Main sample"
        multiSelect
        showSearch
        status="invalid"
        values={[
          { label: "value 1" },
          { label: "value 2", selected: true },
          { label: "value 3" },
          { label: "value 4" },
        ]}
      />,
    );

    const DropdownHeader = screen.getByRole("combobox");

    expect(DropdownHeader).toHaveAttribute("aria-invalid", "true");
  });

  it("renders list inside combobox if disablePortal", () => {
    render(
      <HvDropdown
        label="Sample"
        expanded
        disablePortal
        values={[
          { label: "value 1" },
          { label: "value 2" },
          { label: "value 3" },
        ]}
      />,
    );

    const dropdownHeader = screen.getByRole("combobox");
    expect(dropdownHeader.parentElement?.querySelector("ul")).toBeTruthy();
  });

  it("should select one", async () => {
    render(
      <HvDropdown
        aria-label="Main sample"
        multiSelect
        showSearch
        values={[
          { label: "value 1" },
          { label: "value 2" },
          { label: "value 3" },
          { label: "value 4" },
        ]}
      />,
    );

    const DropdownHeader = screen.getByRole("combobox");

    expect(DropdownHeader).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(DropdownHeader);

    expect(DropdownHeader).toHaveAttribute("aria-expanded", "true");

    const options = screen.getAllByRole("listitem");

    expect(options).toHaveLength(4);
    expect(within(options[0]).getByRole("checkbox")).not.toBeChecked();

    await userEvent.click(options[0]);
    expect(within(options[0]).getByRole("checkbox")).toBeChecked();
  });

  it("read Only", async () => {
    render(
      <HvDropdown
        aria-label="Main sample"
        multiSelect
        showSearch
        readOnly
        values={[
          { label: "value 1" },
          { label: "value 2" },
          { label: "value 3" },
          { label: "value 4" },
        ]}
      />,
    );

    const DropdownHeader = screen.getByRole("combobox");

    expect(DropdownHeader).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(DropdownHeader);

    expect(DropdownHeader).toHaveAttribute("aria-expanded", "false");
  });

  it("has Apply button disabled when no changes are made", async () => {
    render(
      <HvDropdown
        aria-label="Main sample"
        multiSelect
        values={[
          { label: "value 1" },
          { label: "value 2", selected: true },
          { label: "value 3" },
          { label: "value 4" },
        ]}
      />,
    );

    await userEvent.click(screen.getByRole("combobox"));

    const getApplyButton = () => screen.getByRole("button", { name: "Apply" });
    const getCheckBox = () => screen.getByRole("checkbox", { name: "value 1" });

    expect(getApplyButton()).toBeDisabled();

    await userEvent.click(getCheckBox());
    expect(getCheckBox()).toBeChecked();
    expect(getApplyButton()).toBeEnabled();

    await userEvent.click(getCheckBox());
    expect(getApplyButton()).toBeDisabled();
  });

  it("doesn't select disabled items when Select All is clicked", async () => {
    render(
      <HvDropdown
        aria-label="Main sample"
        multiSelect
        showSearch
        values={[
          { label: "value 1", disabled: true, selected: false },
          { label: "value 2", selected: false },
          { label: "value 3", selected: false },
        ]}
      />,
    );

    await userEvent.click(screen.getByRole("combobox"));

    const checkboxes = screen.getAllByRole("checkbox");

    const selectAllCheckbox = checkboxes[0];
    await userEvent.click(selectAllCheckbox);

    expect(checkboxes).toHaveLength(4);

    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[1]).toBeDisabled();

    expect(checkboxes[2]).toBeChecked();
    expect(checkboxes[3]).toBeChecked();
  });
});
