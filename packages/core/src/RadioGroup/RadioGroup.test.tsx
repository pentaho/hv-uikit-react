import { useState } from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HvFormStatus } from "../FormElement";
import { HvRadio } from "../Radio";
import { HvRadioGroup } from "./RadioGroup";

const Main = () => (
  <HvRadioGroup label="Choose your favorite radio button">
    <HvRadio label="Radio 1" value="1" />
    <HvRadio label="Radio 2" value="2" checked />
    <HvRadio label="Radio 3" value="3" />
  </HvRadioGroup>
);

const RadioGroupComp = ({ onChange = () => {}, defaultValue = "2" }) => {
  const [value, setValue] = useState<string>(defaultValue);
  const [status, setStatus] = useState<HvFormStatus>("standBy");

  return (
    <HvRadioGroup
      label="Choose the best radio button"
      value={value}
      onChange={(evt, newValue) => {
        setValue(newValue);
        setStatus(newValue === "none" ? "invalid" : "valid");

        onChange();
      }}
      status={status}
      statusMessage="Don't select None!"
      defaultValue={defaultValue}
    >
      <HvRadio label="None" value="none" />
      <HvRadio label="Radio 1" value="1" />
      <HvRadio label="Radio 2" value="2" />
    </HvRadioGroup>
  );
};

describe("RadioGroup", () => {
  describe("general", () => {
    it("should render a group with radio buttons in the expected order", () => {
      const { getByRole, getAllByRole } = render(<Main />);

      const radioGroup = getByRole("radiogroup", {
        name: "Choose your favorite radio button",
      });

      expect(radioGroup).toBeInTheDocument();

      expect(radioGroup).not.toHaveAttribute("aria-disabled");
      expect(radioGroup).toBeValid();
      expect(radioGroup).not.toHaveAccessibleDescription();

      const radioButtons = getAllByRole("radio");

      expect(radioButtons.length).toBe(3);
      expect((radioButtons[0] as HTMLInputElement).value).toBe("1");
      expect((radioButtons[1] as HTMLInputElement).value).toBe("2");
      expect((radioButtons[2] as HTMLInputElement).value).toBe("3");
      expect(radioButtons[0]).not.toBeChecked();
      expect(radioButtons[1]).toBeChecked();
      expect(radioButtons[2]).not.toBeChecked();
      expect(radioButtons[0]).toHaveAttribute("name");
      expect(radioButtons[1]).toHaveAttribute("name");
      expect(radioButtons[2]).toHaveAttribute("name");
      expect(radioButtons[0]).toBeEnabled();
      expect(radioButtons[1]).toBeEnabled();
      expect(radioButtons[2]).toBeEnabled();
    });

    it("should support custom props", () => {
      const { getByRole } = render(
        <HvRadioGroup
          label="Choose your favorite radio button"
          data-testid="favorite-pet"
        >
          <HvRadio label="Radio 1" value="1" />
          <HvRadio label="Radio 2" value="2" checked />
          <HvRadio label="Radio 3" value="3" />
        </HvRadioGroup>,
      );

      const radioGroup = getByRole("radiogroup");

      expect(radioGroup).toHaveAttribute("data-testid", "favorite-pet");
    });
  });

  describe("value", () => {
    it("should have a controlled value", async () => {
      const { getAllByRole, getByLabelText } = render(<RadioGroupComp />);

      const radioButtons = getAllByRole("radio");

      expect(radioButtons[0]).not.toBeChecked();
      expect(radioButtons[1]).not.toBeChecked();
      expect(radioButtons[2]).toBeChecked();

      const radioButton = getByLabelText("Radio 1");

      await userEvent.click(radioButton);

      expect(radioButtons[0]).not.toBeChecked();
      expect(radioButtons[1]).toBeChecked();
      expect(radioButtons[2]).not.toBeChecked();
    });

    it("should have a uncontrolled default value", async () => {
      const onChangeMock = vi.fn();

      const { getAllByRole, getByLabelText } = render(
        <RadioGroupComp onChange={onChangeMock} />,
      );

      const radioButtons = getAllByRole("radio");

      expect(radioButtons[0]).not.toBeChecked();
      expect(radioButtons[1]).not.toBeChecked();
      expect(radioButtons[2]).toBeChecked();

      const clickButton = getByLabelText("Radio 1");

      await userEvent.click(clickButton);

      expect(onChangeMock).toHaveBeenCalledTimes(1);

      expect(radioButtons[0]).not.toBeChecked();
      expect(radioButtons[1]).toBeChecked();
      expect(radioButtons[2]).not.toBeChecked();
    });

    it("should ignore children state when group has defaultValue", () => {
      const { getAllByRole } = render(
        <HvRadioGroup
          label="Choose the best radio button"
          statusMessage="A status message"
          defaultValue="3"
        >
          <HvRadio label="Radio 1" value="1" />
          <HvRadio label="Radio 2" value="2" checked />
          <HvRadio label="Radio 3" value="3" />
        </HvRadioGroup>,
      );

      const radioButtons = getAllByRole("radio");

      expect(radioButtons[0]).not.toBeChecked();
      expect(radioButtons[1]).not.toBeChecked();
      expect(radioButtons[2]).toBeChecked();
    });

    it("should ignore children state when group has value", () => {
      const { getAllByRole } = render(
        <HvRadioGroup
          label="Choose the best radio button"
          statusMessage="A status message"
          value="3"
        >
          <HvRadio label="Radio 1" value="1" />
          <HvRadio label="Radio 2" value="2" checked />
          <HvRadio label="Radio 3" value="3" />
        </HvRadioGroup>,
      );

      const radioButtons = getAllByRole("radio");

      expect(radioButtons[0]).not.toBeChecked();
      expect(radioButtons[1]).not.toBeChecked();
      expect(radioButtons[2]).toBeChecked();
    });
  });

  describe("required", () => {
    it("should add an asterisk to the group label when required", () => {
      const { getByRole } = render(
        <HvRadioGroup
          label="Choose your favorite radio button"
          name="favorite"
          required
        >
          <HvRadio label="Radio 1" value="1" />
          <HvRadio label="Radio 2" value="2" checked />
          <HvRadio label="Radio 3" value="3" />
        </HvRadioGroup>,
      );

      const radioGroup = getByRole("radiogroup");

      const labelId = radioGroup.getAttribute("aria-labelledby") || "";

      const label = document.getElementById(labelId);

      expect(label).toHaveTextContent("Choose your favorite radio button*");
    });
  });

  describe("readonly", () => {
    it("should propagate readonly to child radio buttons", () => {
      const { getAllByRole } = render(
        <HvRadioGroup
          label="Choose your favorite radio button"
          name="favorite"
          readOnly
        >
          <HvRadio label="Radio 1" value="1" />
          <HvRadio label="Radio 2" value="2" checked />
          <HvRadio label="Radio 3" value="3" />
        </HvRadioGroup>,
      );

      const radioButtons = getAllByRole("radio");

      expect(radioButtons[0]).toHaveAttribute("readonly");
      expect(radioButtons[1]).toHaveAttribute("readonly");
      expect(radioButtons[2]).toHaveAttribute("readonly");
    });

    it("should not update state when clicking on readonly radio button", async () => {
      const groupOnChangeMock = vi.fn();
      const radioButtonOnChangeMock = vi.fn();

      const { getByLabelText } = render(
        <HvRadioGroup
          label="Choose your favorite radio button"
          name="favorite"
          readOnly
          onChange={groupOnChangeMock}
        >
          <HvRadio label="Radio 1" value="1" />
          <HvRadio label="Radio 2" value="2" />
          <HvRadio
            label="Radio 3"
            value="3"
            onChange={radioButtonOnChangeMock}
          />
        </HvRadioGroup>,
      );

      const radio3 = getByLabelText("Radio 3");

      await userEvent.click(radio3);

      expect(groupOnChangeMock).toHaveBeenCalledTimes(0);
      expect(radioButtonOnChangeMock).toHaveBeenCalledTimes(0);
      expect(radio3).not.toBeChecked();
    });
  });

  describe("disabled", () => {
    it("should be disabled", async () => {
      const groupOnChangeMock = vi.fn();
      const radioButtonOnChangeMock = vi.fn();

      const { getByLabelText } = render(
        <HvRadioGroup
          label="Choose your favorite radio button"
          name="favorite"
          readOnly
          onChange={groupOnChangeMock}
        >
          <HvRadio label="Radio 1" value="1" />
          <HvRadio label="Radio 2" value="2" />
          <HvRadio
            label="Radio 3"
            value="3"
            onChange={radioButtonOnChangeMock}
          />
        </HvRadioGroup>,
      );

      const radio3 = getByLabelText("Radio 3");

      await userEvent.click(radio3);

      expect(groupOnChangeMock).toHaveBeenCalledTimes(0);
      expect(radioButtonOnChangeMock).toHaveBeenCalledTimes(0);
      expect(radio3).not.toBeChecked();
    });

    it("should support disabled child radio buttons", () => {
      const groupOnChangeMock = vi.fn();
      const radioButtonOnChangeMock = vi.fn();

      const { getAllByRole, getByRole } = render(
        <HvRadioGroup
          label="Choose your favorite radio button"
          name="favorite"
          onChange={groupOnChangeMock}
        >
          <HvRadio label="Radio 1" value="1" />
          <HvRadio
            label="Radio 2"
            value="2"
            disabled
            onChange={radioButtonOnChangeMock}
          />
          <HvRadio label="Radio 3" value="3" />
        </HvRadioGroup>,
      );

      const radioGroup = getByRole("radiogroup");

      expect(radioGroup).not.toHaveAttribute("aria-disabled");

      const radioButtons = getAllByRole("radio");

      expect(radioButtons[0]).toBeEnabled();
      expect(radioButtons[1]).toBeDisabled();
      expect(radioButtons[2]).toBeEnabled();

      expect(groupOnChangeMock).toHaveBeenCalledTimes(0);
      expect(radioButtonOnChangeMock).toHaveBeenCalledTimes(0);
      expect(radioButtons[1]).not.toBeChecked();
    });
  });

  describe("label", () => {
    it("should show a label", () => {
      const { getByText, getByRole } = render(
        <HvRadioGroup label="Choose your favorite radio button" name="favorite">
          <HvRadio label="Radio 1" value="1" />
          <HvRadio label="Radio 2" value="2" />
          <HvRadio label="Radio 3" value="3" />
        </HvRadioGroup>,
      );

      // There is a visible label element
      getByText("Choose your favorite radio button", { selector: "label" });

      // That label content is properly associated with the group
      getByRole("radiogroup", { name: "Choose your favorite radio button" });
    });

    it("should support an external label", () => {
      const { getByRole } = render(
        <>
          <span id="label-element-id">An external label</span>
          <HvRadioGroup aria-labelledby="label-element-id">
            <HvRadio label="Radio 1" value="1" />
            <HvRadio label="Radio 2" value="2" />
            <HvRadio label="Radio 3" value="3" />
          </HvRadioGroup>
        </>,
      );

      const radioGroup = getByRole("radiogroup", { name: "An external label" });

      expect(radioGroup).toHaveAttribute("aria-labelledby", "label-element-id");
    });

    it("should support aria-label", () => {
      const { getByRole } = render(
        <HvRadioGroup aria-label="My Favorite Radio">
          <HvRadio label="Radio 1" value="1" />
          <HvRadio label="Radio 2" value="2" />
          <HvRadio label="Radio 3" value="3" />
        </HvRadioGroup>,
      );

      const radioGroup = getByRole("radiogroup");

      expect(radioGroup).toHaveAttribute("aria-label", "My Favorite Radio");
    });
  });

  describe("description", () => {
    it("should show a description", () => {
      const { getByRole, getByText } = render(
        <HvRadioGroup
          aria-label="My favorite radio button"
          description="Choose a radio button"
        >
          <HvRadio label="Radio 1" value="1" />
          <HvRadio label="Radio 2" value="2" />
          <HvRadio label="Radio 3" value="3" />
        </HvRadioGroup>,
      );

      // The description text is visible
      getByText("Choose a radio button");

      const radioGroup = getByRole("radiogroup");

      expect(radioGroup).toHaveAccessibleDescription("Choose a radio button");
    });

    it("should support an external description", () => {
      const { getByRole } = render(
        <>
          <span id="description-element-id">An external description</span>
          <HvRadioGroup
            aria-label="My favorite radio button"
            aria-describedby="description-element-id"
          >
            <HvRadio label="Radio 1" value="1" />
            <HvRadio label="Radio 2" value="2" />
            <HvRadio label="Radio 3" value="3" />
          </HvRadioGroup>
        </>,
      );

      const radioGroup = getByRole("radiogroup");

      expect(radioGroup).toHaveAccessibleDescription("An external description");
    });
  });

  describe("onChange", () => {
    it("should trigger the onChange by checking a radio button", async () => {
      const onChangeMock = vi.fn();

      const { getByLabelText } = render(
        <HvRadioGroup
          aria-label="My favorite radio button"
          onChange={onChangeMock}
        >
          <HvRadio label="Radio 1" value="1" />
          <HvRadio label="Radio 2" value="2" />
          <HvRadio label="Radio 3" value="3" />
        </HvRadioGroup>,
      );

      const radio1 = getByLabelText("Radio 1");

      await userEvent.click(radio1);

      expect(onChangeMock).toHaveBeenCalledTimes(1);
    });
  });
});
