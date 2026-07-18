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
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HvCheckBox } from "../CheckBox";
import { HvCheckBoxGroup } from "./CheckBoxGroup";

const Main = () => (
  <HvCheckBoxGroup label="Favorite Pet">
    <HvCheckBox value="dogs" label="Dogs" />
    <HvCheckBox value="cats" label="Cats" />
    <HvCheckBox value="dragons" label="Dragons" />
  </HvCheckBoxGroup>
);

describe("CheckBoxGroup", () => {
  describe("general", () => {
    it("should render a group with checkboxes in the expected order", () => {
      const { getByRole, getAllByRole } = render(<Main />);

      const checkboxGroup = getByRole("group", { name: "Favorite Pet" });

      expect(checkboxGroup).toBeInTheDocument();

      // Default
      expect(checkboxGroup).toBeValid();
      expect(checkboxGroup).not.toBeRequired();
      expect(checkboxGroup).not.toHaveAttribute("aria-disabled");
      expect(checkboxGroup).not.toHaveAccessibleDescription();

      // Children ordered and rendered as expected
      const checkboxes = getAllByRole("checkbox");
      expect(checkboxes.length).toBe(3);
      expect((checkboxes[0] as HTMLInputElement).value).toBe("dogs");
      expect((checkboxes[1] as HTMLInputElement).value).toBe("cats");
      expect((checkboxes[2] as HTMLInputElement).value).toBe("dragons");
      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
      expect(checkboxes[0]).not.toHaveAttribute("name");
      expect(checkboxes[1]).not.toHaveAttribute("name");
      expect(checkboxes[2]).not.toHaveAttribute("name");
      expect(checkboxes[0]).toBeEnabled();
      expect(checkboxes[1]).toBeEnabled();
      expect(checkboxes[2]).toBeEnabled();
    });

    it("should support custom props", () => {
      const { getByRole } = render(
        <HvCheckBoxGroup label="Favorite Pet" data-testid="favorite-pet">
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      const checkboxGroup = getByRole("group");

      expect(checkboxGroup).toBeInTheDocument();

      expect(checkboxGroup).toHaveAttribute("data-testid", "favorite-pet");
    });
  });

  describe("name", () => {
    it("should have child checkboxes that can have names", () => {
      const { getAllByRole } = render(
        <HvCheckBoxGroup label="Favorite Pet">
          <HvCheckBox value="dogs" label="Dogs" name="snoopy" />
          <HvCheckBox value="cats" label="Cats" name="garfield" />
          <HvCheckBox value="dragons" label="Dragons" name="falkor" />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");

      expect(checkboxes[0]).toHaveAttribute("name", "snoopy");
      expect(checkboxes[1]).toHaveAttribute("name", "garfield");
      expect(checkboxes[2]).toHaveAttribute("name", "falkor");
    });

    it("should propagate group name to child checkboxes but not to the select all checkbox", () => {
      const { getAllByRole } = render(
        <HvCheckBoxGroup
          showSelectAll
          label="Favorite Pet"
          name="awesome-react-aria"
        >
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");

      expect(checkboxes[0]).not.toHaveAttribute("name");
      expect(checkboxes[1]).toHaveAttribute("name", "awesome-react-aria");
      expect(checkboxes[2]).toHaveAttribute("name", "awesome-react-aria");
      expect(checkboxes[3]).toHaveAttribute("name", "awesome-react-aria");
    });

    it("should have child that can override the name", () => {
      const { getAllByRole } = render(
        <HvCheckBoxGroup label="Favorite Pet" name="awesome-react-aria">
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox name="another-name" value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");

      expect(checkboxes[0]).toHaveAttribute("name", "awesome-react-aria");
      expect(checkboxes[1]).toHaveAttribute("name", "another-name");
      expect(checkboxes[2]).toHaveAttribute("name", "awesome-react-aria");
    });
  });

  describe("value", () => {
    it("should be able to have a controlled value", async () => {
      const { getAllByRole, getByLabelText } = render(
        <HvCheckBoxGroup label="Favorite Pet" value={["cats"]}>
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");

      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();

      const dragons = getByLabelText("Dragons");

      // Try to check
      await userEvent.click(dragons);

      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
    });

    it("should be able to have a uncontrolled default value", async () => {
      const onChangeMock = vi.fn();

      const { getAllByRole, getByLabelText } = render(
        <HvCheckBoxGroup
          label="Favorite Pet"
          defaultValue={["cats"]}
          onChange={onChangeMock}
        >
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");

      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();

      const dragons = getByLabelText("Dragons");

      // Check
      await userEvent.click(dragons);

      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock).toHaveBeenCalledWith(expect.anything(), [
        "cats",
        "dragons",
      ]);

      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).toBeChecked();
    });

    it("should be able to have a uncontrolled default value from the children state", async () => {
      const onChangeMock = vi.fn();

      const { getAllByRole, getByLabelText } = render(
        <HvCheckBoxGroup label="Favorite Pet" onChange={onChangeMock}>
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" checked />
          <HvCheckBox value="dragons" label="Dragons" defaultChecked />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");

      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).toBeChecked();

      const dragons = getByLabelText("Dragons");

      // Uncheck
      await userEvent.click(dragons);

      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock).toHaveBeenCalledWith(expect.anything(), ["cats"]);

      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
    });

    it("should ignore the children state when group has defaultValue", () => {
      const { getAllByRole } = render(
        <HvCheckBoxGroup label="Favorite Pet" defaultValue={["dogs"]}>
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" checked />
          <HvCheckBox value="dragons" label="Dragons" defaultChecked />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");

      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
    });

    it("should ignore the children state when group has value", () => {
      const { getAllByRole } = render(
        <HvCheckBoxGroup label="Favorite Pet" value={["dogs"]}>
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" checked />
          <HvCheckBox value="dragons" label="Dragons" defaultChecked />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");

      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
    });
  });

  describe("required", () => {
    it("should add an asterisk to the group label when required", () => {
      const { getByRole } = render(
        <HvCheckBoxGroup label="Favorite Pet" required>
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      const checkboxGroup = getByRole("group");

      const labelId = checkboxGroup.getAttribute("aria-labelledby");

      const label = document.getElementById(labelId || "");

      expect(label).toHaveTextContent("Favorite Pet*");
    });

    it("should not propagate to the child checkboxes when required", () => {
      const { getAllByRole } = render(
        <HvCheckBoxGroup label="Favorite Pet" required>
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");

      expect(checkboxes[0]).not.toBeRequired();
      expect(checkboxes[1]).not.toBeRequired();
      expect(checkboxes[2]).not.toBeRequired();
    });
  });

  describe("readonly", () => {
    it("should propagate to child checkboxes when readonly", () => {
      const { getAllByRole } = render(
        <HvCheckBoxGroup label="Favorite Pet" readOnly>
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");

      expect(checkboxes[0]).toHaveAttribute("readonly");
      expect(checkboxes[1]).toHaveAttribute("readonly");
      expect(checkboxes[2]).toHaveAttribute("readonly");
    });

    it("should not update state by clicking readonly checkbox", async () => {
      const groupOnChangeMock = vi.fn();
      const checkboxOnChangeMock = vi.fn();

      const { getAllByRole, getByLabelText } = render(
        <HvCheckBoxGroup
          label="Favorite Pet"
          readOnly
          onChange={groupOnChangeMock}
        >
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox
            value="dragons"
            label="Dragons"
            onChange={checkboxOnChangeMock}
          />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");
      const dragons = getByLabelText("Dragons");

      // Try to check
      await userEvent.click(dragons);

      expect(groupOnChangeMock).toHaveBeenCalledTimes(0);
      expect(checkboxOnChangeMock).toHaveBeenCalledTimes(0);
      expect(checkboxes[2]).not.toBeChecked();
    });
  });

  describe("disabled", () => {
    it("should be disabled", async () => {
      const groupOnChangeMock = vi.fn();
      const checkboxOnChangeMock = vi.fn();

      const { getByRole, getAllByRole, getByLabelText } = render(
        <HvCheckBoxGroup
          label="Favorite Pet"
          disabled
          onChange={groupOnChangeMock}
        >
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox
            value="dragons"
            label="Dragons"
            onChange={checkboxOnChangeMock}
          />
        </HvCheckBoxGroup>,
      );

      const checkboxGroup = getByRole("group");
      expect(checkboxGroup).toHaveAttribute("aria-disabled", "true");

      const checkboxes = getAllByRole("checkbox");
      expect(checkboxes[0]).toBeDisabled();
      expect(checkboxes[1]).toBeDisabled();
      expect(checkboxes[2]).toBeDisabled();

      const dragons = getByLabelText("Dragons");
      dragons.style.pointerEvents = "auto";

      // Try to check
      await userEvent.click(dragons);

      expect(groupOnChangeMock).toHaveBeenCalledTimes(0);
      expect(checkboxOnChangeMock).toHaveBeenCalledTimes(0);
      expect(checkboxes[2]).not.toBeChecked();
    });

    it("should support disabled child checkboxes", async () => {
      const groupOnChangeMock = vi.fn();
      const checkboxOnChangeMock = vi.fn();

      const { getAllByRole, getByRole, getByLabelText } = render(
        <HvCheckBoxGroup label="Favorite Pet" onChange={groupOnChangeMock}>
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox
            value="cats"
            label="Cats"
            disabled
            onChange={checkboxOnChangeMock}
          />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      const checkboxGroup = getByRole("group");
      expect(checkboxGroup).not.toHaveAttribute("aria-disabled");

      const checkboxes = getAllByRole("checkbox");
      expect(checkboxes[0]).toBeEnabled();
      expect(checkboxes[1]).toBeDisabled();
      expect(checkboxes[2]).toBeEnabled();

      const cats = getByLabelText("Cats");
      cats.style.pointerEvents = "auto";

      // Try to check
      await userEvent.click(cats);

      expect(groupOnChangeMock).toHaveBeenCalledTimes(0);
      expect(checkboxOnChangeMock).toHaveBeenCalledTimes(0);
      expect(checkboxes[1]).not.toBeChecked();
    });
  });

  describe("label", () => {
    it("should show a label", () => {
      const { getByText, getByRole } = render(
        <HvCheckBoxGroup label="Favorite Pet">
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      // There is a visible label element
      expect(
        getByText("Favorite Pet", { selector: "label" }),
      ).toBeInTheDocument();

      // That label content is properly associated with the group
      expect(getByRole("group", { name: "Favorite Pet" })).toBeInTheDocument();
    });

    it("should support an external label", () => {
      const { getByRole } = render(
        <>
          <span id="label-element-id">An external label</span>
          <HvCheckBoxGroup aria-labelledby="label-element-id">
            <HvCheckBox value="dogs" label="Dogs" />
            <HvCheckBox value="cats" label="Cats" />
            <HvCheckBox value="dragons" label="Dragons" />
          </HvCheckBoxGroup>
        </>,
      );

      const checkboxGroup = getByRole("group", { name: "An external label" });

      expect(checkboxGroup).toHaveAttribute(
        "aria-labelledby",
        "label-element-id",
      );
    });

    it("should support aria-label", () => {
      const { getByRole } = render(
        <HvCheckBoxGroup aria-label="My Favorite Pet">
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      const checkboxGroup = getByRole("group");

      expect(checkboxGroup).toHaveAttribute("aria-label", "My Favorite Pet");
    });
  });

  describe("description", () => {
    it("should show a description", () => {
      const { getByRole, getByText } = render(
        <HvCheckBoxGroup label="Favorite Pet" description="Choose an animal">
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      // The description text is visible
      getByText("Choose an animal");

      const checkboxGroup = getByRole("group");

      expect(checkboxGroup).toHaveAccessibleDescription("Choose an animal");
    });

    it("should support an external description", () => {
      const { getByRole } = render(
        <>
          <span id="description-element-id">An external description</span>
          <HvCheckBoxGroup
            label="Favorite Pet"
            aria-describedby="description-element-id"
          >
            <HvCheckBox value="dogs" label="Dogs" />
            <HvCheckBox value="cats" label="Cats" />
            <HvCheckBox value="dragons" label="Dragons" />
          </HvCheckBoxGroup>
        </>,
      );

      const checkboxGroup = getByRole("group");

      expect(checkboxGroup).toHaveAccessibleDescription(
        "An external description",
      );
    });
  });

  describe("onChange", () => {
    it("should trigger the onChange by checking a checkbox", async () => {
      const onChangeMock = vi.fn();

      const { getByLabelText } = render(
        <HvCheckBoxGroup label="Favorite Pet" onChange={onChangeMock}>
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      const dragons = getByLabelText("Dragons");

      // Check
      await userEvent.click(dragons);

      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock).toHaveBeenCalledWith(expect.anything(), ["dragons"]);
    });

    it("should trigger the onChange by unchecking a checkbox", async () => {
      const onChangeMock = vi.fn();

      const { getByLabelText } = render(
        <HvCheckBoxGroup label="Favorite Pet" onChange={onChangeMock}>
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" checked />
        </HvCheckBoxGroup>,
      );

      const dragons = getByLabelText("Dragons");

      // Uncheck
      await userEvent.click(dragons);

      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock).toHaveBeenCalledWith(expect.anything(), []);
    });

    it("should trigger the onChange by checking select all", async () => {
      const onChangeMock = vi.fn();

      render(
        <HvCheckBoxGroup
          showSelectAll
          label="Favorite Pet"
          onChange={onChangeMock}
        >
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      // Check all
      await userEvent.click(screen.getByLabelText("0 / 3"));

      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock).toHaveBeenCalledWith(expect.anything(), [
        "dogs",
        "cats",
        "dragons",
      ]);
    });

    it("should trigger the onChange by unchecking select all", async () => {
      const onChangeMock = vi.fn();

      const { getByLabelText } = render(
        <HvCheckBoxGroup
          showSelectAll
          label="Favorite Pet"
          onChange={onChangeMock}
        >
          <HvCheckBox value="dogs" label="Dogs" checked />
          <HvCheckBox value="cats" label="Cats" checked />
          <HvCheckBox value="dragons" label="Dragons" checked />
        </HvCheckBoxGroup>,
      );

      const selectAll = getByLabelText("3 / 3");

      // Uncheck all
      await userEvent.click(selectAll);

      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock).toHaveBeenCalledWith(expect.anything(), []);
    });
  });

  describe("status", () => {
    it("should display the statusMessage when the status is invalid", () => {
      const { getByRole } = render(
        <HvCheckBoxGroup
          label="Favorite Pet"
          status="invalid"
          statusMessage="The error message"
        >
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      const checkboxGroup = getByRole("group");

      expect(checkboxGroup).toBeInvalid();
      expect(checkboxGroup).toHaveErrorMessage("The error message");
    });

    it("should not display the statusMessage when the status is valid", () => {
      const { getByRole, queryByText } = render(
        <HvCheckBoxGroup
          label="Favorite Pet"
          status="valid"
          statusMessage="The error message"
        >
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      const checkboxGroup = getByRole("group");
      expect(checkboxGroup).toBeValid();

      const error = queryByText("The error message");
      expect(error).not.toBeInTheDocument();
    });

    it("should set the group invalid, not the child checkboxes", () => {
      const { getByRole, getAllByRole } = render(
        <HvCheckBoxGroup label="Favorite Pet" status="invalid">
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      const checkboxGroup = getByRole("group");
      expect(checkboxGroup).toBeInvalid();

      const checkboxes = getAllByRole("checkbox");
      expect(checkboxes[0]).toBeValid();
      expect(checkboxes[1]).toBeValid();
      expect(checkboxes[2]).toBeValid();
    });

    it("built-in validation: should display error when required and no checkbox is selected", async () => {
      const { getByRole, getByLabelText } = render(
        <HvCheckBoxGroup label="Favorite Pet" required>
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" checked />
        </HvCheckBoxGroup>,
      );

      const checkboxGroup = getByRole("group");
      expect(checkboxGroup).toBeValid();

      const dragons = getByLabelText("Dragons");

      // Uncheck
      await userEvent.click(dragons);

      expect(checkboxGroup).toBeInvalid();
      expect(checkboxGroup).toHaveErrorMessage("Required");
    });

    it("built-in validation: should display error when required and select all is unchecked", async () => {
      const { getByRole } = render(
        <HvCheckBoxGroup label="Favorite Pet" showSelectAll required>
          <HvCheckBox value="dogs" label="Dogs" checked />
          <HvCheckBox value="cats" label="Cats" checked />
          <HvCheckBox value="dragons" label="Dragons" checked />
        </HvCheckBoxGroup>,
      );

      const checkboxGroup = getByRole("group");
      expect(checkboxGroup).toBeValid();

      const selectAll = getByRole("checkbox", { name: "3 / 3" });

      // Uncheck all
      await userEvent.click(selectAll);

      expect(checkboxGroup).toBeInvalid();
      expect(checkboxGroup).toHaveErrorMessage("Required");
    });

    it("built-in validation: should not display error before user interaction", async () => {
      const { getByRole, getByLabelText, queryByText } = render(
        <HvCheckBoxGroup label="Favorite Pet" required>
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      const checkboxGroup = getByRole("group");
      expect(checkboxGroup).toBeValid();
      expect(queryByText("Required")).not.toBeInTheDocument();

      const dragons = getByLabelText("Dragons");

      // Check
      await userEvent.click(dragons);

      // Uncheck
      await userEvent.click(dragons);

      expect(checkboxGroup).toBeInvalid();
      expect(checkboxGroup).toHaveErrorMessage("Required");
    });
  });

  describe("selectAll", () => {
    it("should have select all initial state as unchecked when no child checkbox is selected", () => {
      const { getByRole } = render(
        <HvCheckBoxGroup showSelectAll label="Favorite Pet">
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      const selectAll = getByRole("checkbox", { name: "0 / 3" });

      expect(selectAll).not.toBeChecked();
      expect(selectAll).not.toHaveAttribute("data-indeterminate", "true");
    });

    it("should have select all initial state as checked when all child checkboxes are selected", () => {
      const { getByRole } = render(
        <HvCheckBoxGroup showSelectAll label="Favorite Pet">
          <HvCheckBox value="dogs" label="Dogs" checked />
          <HvCheckBox value="cats" label="Cats" checked />
          <HvCheckBox value="dragons" label="Dragons" checked />
        </HvCheckBoxGroup>,
      );

      const selectAll = getByRole("checkbox", { name: "3 / 3" });

      expect(selectAll).toBeChecked();
      expect(selectAll).not.toHaveAttribute("data-indeterminate", "true");
    });

    it("should have select all initial state as indeterminate when only some child checkboxes are selected", () => {
      const { getByRole } = render(
        <HvCheckBoxGroup showSelectAll label="Favorite Pet">
          <HvCheckBox value="dogs" label="Dogs" checked />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" checked />
        </HvCheckBoxGroup>,
      );

      const selectAll = getByRole("checkbox", { name: "2 / 3" });

      expect(selectAll).not.toBeChecked();
      expect(selectAll).toHaveAttribute("data-indeterminate", "true");
    });

    it("should select all child checkboxes by clicking an unchecked select all box", async () => {
      const { getAllByRole } = render(
        <HvCheckBoxGroup showSelectAll label="Favorite Pet">
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");
      const selectAll = checkboxes[0];

      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
      expect(checkboxes[3]).not.toBeChecked();

      // Check all
      await userEvent.click(selectAll);

      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).toBeChecked();
      expect(checkboxes[3]).toBeChecked();

      expect(selectAll).toBeChecked();
      expect(selectAll).not.toHaveAttribute("data-indeterminate", "true");
    });

    it("should unselect all child checkboxes by clicking an checked select all box", async () => {
      const { getAllByRole } = render(
        <HvCheckBoxGroup showSelectAll label="Favorite Pet">
          <HvCheckBox value="dogs" label="Dogs" checked />
          <HvCheckBox value="cats" label="Cats" checked />
          <HvCheckBox value="dragons" label="Dragons" checked />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");
      const selectAll = checkboxes[0];

      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).toBeChecked();
      expect(checkboxes[3]).toBeChecked();

      // Uncheck all
      await userEvent.click(selectAll);

      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
      expect(checkboxes[3]).not.toBeChecked();

      expect(selectAll).not.toBeChecked();
      expect(selectAll).not.toHaveAttribute("data-indeterminate", "true");
    });

    it("should unselect all child checkboxes by clicking an indeterminate select all box", async () => {
      const { getAllByRole } = render(
        <HvCheckBoxGroup showSelectAll label="Favorite Pet">
          <HvCheckBox value="dogs" label="Dogs" checked />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" checked />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");
      const selectAll = checkboxes[0];

      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
      expect(checkboxes[3]).toBeChecked();

      // Check all
      await userEvent.click(selectAll);

      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
      expect(checkboxes[3]).not.toBeChecked();

      expect(selectAll).not.toBeChecked();
      expect(selectAll).not.toHaveAttribute("data-indeterminate", "true");
    });

    it("should change an unchecked select all box to indeterminate when selecting a child checkbox", async () => {
      const { getAllByRole } = render(
        <HvCheckBoxGroup showSelectAll label="Favorite Pet">
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");
      const selectAll = checkboxes[0];

      expect(selectAll).not.toBeChecked();
      expect(selectAll).not.toHaveAttribute("data-indeterminate", "true");

      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
      expect(checkboxes[3]).not.toBeChecked();

      // Check
      await userEvent.click(checkboxes[2]);

      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).toBeChecked();
      expect(checkboxes[3]).not.toBeChecked();

      expect(selectAll).not.toBeChecked();
      expect(selectAll).toHaveAttribute("data-indeterminate", "true");
    });

    it("should change an unchecked select all box to checked when selecting the only child checkbox", async () => {
      const { getAllByRole } = render(
        <HvCheckBoxGroup showSelectAll label="Favorite Pet">
          <HvCheckBox value="dogs" label="Dogs" />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");
      const selectAll = checkboxes[0];

      expect(selectAll).not.toBeChecked();
      expect(selectAll).not.toHaveAttribute("data-indeterminate", "true");

      expect(checkboxes[1]).not.toBeChecked();

      // Check
      await userEvent.click(checkboxes[1]);

      expect(checkboxes[1]).toBeChecked();

      expect(selectAll).toBeChecked();
      expect(selectAll).not.toHaveAttribute("data-indeterminate", "true");
    });

    it("should change a checked select all box to indeterminate when unselecting a child checkbox", async () => {
      const { getAllByRole } = render(
        <HvCheckBoxGroup showSelectAll label="Favorite Pet">
          <HvCheckBox value="dogs" label="Dogs" checked />
          <HvCheckBox value="cats" label="Cats" checked />
          <HvCheckBox value="dragons" label="Dragons" checked />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");
      const selectAll = checkboxes[0];

      expect(selectAll).toBeChecked();
      expect(selectAll).not.toHaveAttribute("data-indeterminate", "true");

      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).toBeChecked();
      expect(checkboxes[3]).toBeChecked();

      // Uncheck
      await userEvent.click(checkboxes[2]);

      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
      expect(checkboxes[3]).toBeChecked();

      expect(selectAll).not.toBeChecked();
      expect(selectAll).toHaveAttribute("data-indeterminate", "true");
    });

    it("should change a checked select all box to unchecked when unselecting the only child checkbox", async () => {
      const { getAllByRole } = render(
        <HvCheckBoxGroup showSelectAll label="Favorite Pet">
          <HvCheckBox value="dogs" label="Dogs" checked />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");
      const selectAll = checkboxes[0];

      expect(selectAll).toBeChecked();
      expect(selectAll).not.toHaveAttribute("data-indeterminate", "true");

      expect(checkboxes[1]).toBeChecked();

      // Uncheck
      await userEvent.click(checkboxes[1]);

      expect(checkboxes[1]).not.toBeChecked();

      expect(selectAll).not.toBeChecked();
      expect(selectAll).not.toHaveAttribute("data-indeterminate", "true");
    });

    it("should change an indeterminate select all box to unchecked when unselecting all child checkboxes", async () => {
      const { getAllByRole } = render(
        <HvCheckBoxGroup showSelectAll label="Favorite Pet">
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" checked />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");
      const selectAll = checkboxes[0];

      expect(selectAll).not.toBeChecked();
      expect(selectAll).toHaveAttribute("data-indeterminate", "true");

      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
      expect(checkboxes[3]).toBeChecked();

      // Uncheck
      await userEvent.click(checkboxes[3]);

      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
      expect(checkboxes[3]).not.toBeChecked();

      expect(selectAll).not.toBeChecked();
      expect(selectAll).not.toHaveAttribute("data-indeterminate", "true");
    });

    it("should change an indeterminate select all box to checked when selecting all child checkboxes", async () => {
      const { getAllByRole } = render(
        <HvCheckBoxGroup showSelectAll label="Favorite Pet">
          <HvCheckBox value="dogs" label="Dogs" checked />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" checked />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");
      const selectAll = checkboxes[0];

      expect(selectAll).not.toBeChecked();
      expect(selectAll).toHaveAttribute("data-indeterminate", "true");

      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
      expect(checkboxes[3]).toBeChecked();

      // Check
      await userEvent.click(checkboxes[2]);

      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).toBeChecked();
      expect(checkboxes[3]).toBeChecked();

      expect(selectAll).toBeChecked();
      expect(selectAll).not.toHaveAttribute("data-indeterminate", "true");
    });
  });

  describe("shift select", () => {
    it("should select a single item when shift is pressed", async () => {
      const { getAllByRole, getByLabelText } = render(<Main />);

      const checkboxes = getAllByRole("checkbox");

      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();

      const dogs = getByLabelText("Dogs");

      // Select
      fireEvent.click(dogs, { shiftKey: true });

      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
    });

    it("should select items in a range when shift is pressed", async () => {
      const { getAllByRole, getByLabelText } = render(<Main />);

      const checkboxes = getAllByRole("checkbox");

      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();

      const dogs = getByLabelText("Dogs");
      const dragons = getByLabelText("Dragons");

      // Select all
      fireEvent.click(dogs, { shiftKey: true });
      fireEvent.click(dragons, { shiftKey: true });

      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).toBeChecked();
    });

    it("should deselect an item using metaKey after shift selection", () => {
      const { getAllByRole, getByLabelText } = render(<Main />);

      const checkboxes = getAllByRole("checkbox");

      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();

      const dogs = getByLabelText("Dogs");
      const dragons = getByLabelText("Dragons");

      // Select all
      fireEvent.click(dogs, { shiftKey: true });
      fireEvent.click(dragons, { shiftKey: true });

      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).toBeChecked();

      const cats = getByLabelText("Cats");

      // Deselect
      fireEvent.click(cats, { metaKey: true });

      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).toBeChecked();
    });

    it("should select alternates items using metaKey", () => {
      const { getAllByRole, getByLabelText } = render(<Main />);

      const checkboxes = getAllByRole("checkbox");

      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();

      const dogs = getByLabelText("Dogs");
      const cats = getByLabelText("Cats");
      const dragons = getByLabelText("Dragons");

      // Select
      fireEvent.click(dogs, { metaKey: true });
      fireEvent.click(cats, { metaKey: true });
      fireEvent.click(dragons, { metaKey: true });

      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).toBeChecked();
    });

    it("should flip selected items using shiftKey and metaKey", () => {
      const { getAllByRole, getByLabelText } = render(
        <HvCheckBoxGroup label="Favorite Pet">
          <HvCheckBox value="dogs" label="Dogs" />
          <HvCheckBox value="cats" label="Cats" />
          <HvCheckBox value="dragons" label="Dragons" />
          <HvCheckBox value="horses" label="Horses" />
          <HvCheckBox value="hamsters" label="Hamsters" />
          <HvCheckBox value="rabbits" label="Rabbits" />
        </HvCheckBoxGroup>,
      );

      const checkboxes = getAllByRole("checkbox");

      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
      expect(checkboxes[3]).not.toBeChecked();
      expect(checkboxes[4]).not.toBeChecked();
      expect(checkboxes[5]).not.toBeChecked();

      const dogs = getByLabelText("Dogs");
      const dragons = getByLabelText("Dragons");
      const rabbits = getByLabelText("Rabbits");

      // Select and deselect
      fireEvent.click(dogs, { metaKey: true });
      fireEvent.click(dragons, { metaKey: true });
      fireEvent.click(rabbits, { shiftKey: true });

      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).toBeChecked();
      expect(checkboxes[3]).toBeChecked();
      expect(checkboxes[4]).toBeChecked();
      expect(checkboxes[5]).toBeChecked();

      // Select and deselect
      fireEvent.click(dogs, { shiftKey: true });

      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).toBeChecked();
      expect(checkboxes[3]).not.toBeChecked();
      expect(checkboxes[4]).not.toBeChecked();
      expect(checkboxes[5]).not.toBeChecked();
    });
  });
});
