import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { HvRadio, HvRadioProps } from "./Radio";

const RadioSample = () => {
  const [checkedValue, setCheckedValue] = useState(null);

  return (
    <>
      <HvRadio
        name="main"
        label="Radio 1"
        value="1"
        checked={checkedValue === "1"}
        onChange={(_evt, _checked, value) => setCheckedValue(value)}
      />
      <HvRadio
        name="main"
        label="Radio 2"
        value="2"
        checked={checkedValue === "2"}
        onChange={(_evt, _checked, value) => setCheckedValue(value)}
      />
    </>
  );
};

const Disabled = () => {
  const [checkedValue, setCheckedValue] = useState(null);

  return (
    <>
      <HvRadio
        disabled
        name="main"
        label="Radio 1"
        value="1"
        checked={checkedValue === "1"}
        onChange={(_evt, _checked, value) => setCheckedValue(value)}
      />
      <HvRadio
        disabled
        name="main"
        label="Radio 2"
        value="2"
        checked={checkedValue === "2"}
        onChange={(_evt, _checked, value) => setCheckedValue(value)}
      />
    </>
  );
};

const ReadOnly = () => {
  const [checkedValue, setCheckedValue] = useState(null);

  return (
    <>
      <HvRadio
        readOnly
        name="main"
        label="Radio 1"
        value="1"
        checked={checkedValue === "1"}
        onChange={(_evt, _checked, value) => setCheckedValue(value)}
      />
      <HvRadio
        readOnly
        name="main"
        label="Radio 2"
        value="2"
        checked={checkedValue === "2"}
        onChange={(_evt, _checked, value) => setCheckedValue(value)}
      />
    </>
  );
};

describe("HvRadio", () => {
  it("can have name", () => {
    render(<HvRadio name="main" label="Radio 1" value="1" />);

    const radioBtn = screen.getByRole("radio");
    expect(radioBtn).toHaveAttribute("name", "main");
  });

  it("can have a controlled checked state", () => {
    render(<HvRadio name="main" label="Radio 1" value="1" checked />);

    const radioBtn = screen.getByRole("radio");

    expect(radioBtn).toBeChecked();

    fireEvent.click(radioBtn);

    expect(radioBtn).toBeChecked();
  });

  it("allows interactions", () => {
    render(<RadioSample />);
    const radioBtns = screen.getAllByRole("radio");

    const radioBtn1 = screen.getByRole("radio", { name: "Radio 1" });
    const radioBtn2 = screen.getByRole("radio", { name: "Radio 2" });

    expect(radioBtns.length).toBe(2);

    expect(radioBtn1).toHaveAttribute("value", "1");

    expect(radioBtn2).toHaveAttribute("value", "2");

    expect(radioBtn1).not.toBeChecked();
    expect(radioBtn2).not.toBeChecked();

    fireEvent.click(radioBtn1);

    expect(radioBtn1).toBeChecked();
    expect(radioBtn2).not.toBeChecked();

    fireEvent.click(radioBtn2);

    expect(radioBtn1).not.toBeChecked();
    expect(radioBtn2).toBeChecked();

    fireEvent.click(radioBtn2);

    expect(radioBtn1).not.toBeChecked();
    expect(radioBtn2).toBeChecked();
  });

  it("can be disabled", () => {
    render(<Disabled />);
    const radioBtns = screen.getAllByRole("radio");

    const [radioBtn1, radioBtn2] = [...radioBtns];

    expect(radioBtn1).toBeDisabled();
    expect(radioBtn2).toBeDisabled();
  });

  it("doesn't update state when clicking disabled", async () => {
    const onChangeSpy = vi.fn();

    const RadioBtns = () => (
      <>
        <HvRadio
          disabled
          name="disabled1"
          label="Radio 1"
          value="1"
          checked
          onChange={onChangeSpy}
        />
        <HvRadio
          disabled
          name="disabled2"
          label="Radio 2"
          value="2"
          checked={false}
          onChange={onChangeSpy}
        />
      </>
    );

    render(<RadioBtns />);

    const radioBtns = screen.getAllByRole("radio");

    const [radioBtn1, radioBtn2] = [...radioBtns];
    radioBtn1.style.pointerEvents = "auto";
    radioBtn2.style.pointerEvents = "auto";

    expect(radioBtn1).toBeDisabled();
    expect(radioBtn2).toBeDisabled();

    expect(radioBtn1).toBeChecked();
    expect(radioBtn2).not.toBeChecked();

    await userEvent.click(radioBtn1);
    await userEvent.click(radioBtn2);

    expect(onChangeSpy).toHaveBeenCalledTimes(0);
    expect(onChangeSpy).toHaveBeenCalledTimes(0);
    expect(radioBtn1).toBeChecked();
    expect(radioBtn2).not.toBeChecked();
  });

  it("can be readonly", () => {
    render(<ReadOnly />);

    const radioBtns = screen.getAllByRole("radio");

    const [radioBtn1, radioBtn2] = [...radioBtns];

    expect(radioBtn1).toHaveAttribute("readonly");
    expect(radioBtn2).toHaveAttribute("readonly");
  });

  it("doesn't update state when clicking readonly", () => {
    const DisabledSample = ({ onChange }: Partial<HvRadioProps>) => {
      return (
        <>
          <HvRadio
            readOnly
            name="readonly"
            label="Radio 1"
            value="1"
            onChange={onChange}
          />
          <HvRadio
            readOnly
            name="readonly"
            label="Radio 2"
            value="2"
            checked
            onChange={onChange}
          />
        </>
      );
    };

    const onChangeSpy = vi.fn();

    render(<DisabledSample onChange={onChangeSpy} />);

    const radioBtns = screen.getAllByRole("radio");

    const [radioBtn1, radioBtn2] = [...radioBtns];

    expect(radioBtn1).not.toBeChecked();
    expect(radioBtn2).toBeChecked();

    fireEvent.click(radioBtn1);
    fireEvent.click(radioBtn2);

    expect(onChangeSpy).toHaveBeenCalledTimes(0);
    expect(radioBtn1).not.toBeChecked();
    expect(radioBtn2).toBeChecked();
  });

  it("can show a label", () => {
    render(<RadioSample />);

    // there is a visible label element
    screen.getByText("Radio 1", { selector: "label" });
    screen.getByText("Radio 2", { selector: "label" });
    // that label content is properly associated with the group
    screen.getByRole("radio", { name: "Radio 1" });
    screen.getByRole("radio", { name: "Radio 2" });
  });

  it("supports aria roles", () => {
    render(
      <>
        <div id="radioDescriptor">Radio button description</div>
        <HvRadio
          name="Radio 1"
          label="Radio 1"
          value="1"
          checked
          aria-label="Radio 1"
          aria-labelledby="radioDescriptor"
          aria-describedby="radioDescriptor"
        />
      </>,
    );

    const radioBtn = screen.getByRole("radio");
    expect(radioBtn).toHaveAttribute("aria-label", "Radio 1");
    expect(radioBtn).toHaveAttribute("aria-labelledby", "radioDescriptor");
    expect(radioBtn).toHaveAttribute("aria-describedby", "radioDescriptor");
    expect(radioBtn).toHaveAccessibleDescription("Radio button description");
  });

  it("checking a radio button triggers the onchange", () => {
    const onChangeSpy = vi.fn();

    const { getByRole } = render(
      <HvRadio
        name="Radio 1"
        label="Radio 1"
        value="1"
        onChange={onChangeSpy}
      />,
    );

    const radioBtn = getByRole("radio");
    fireEvent.click(radioBtn);

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith(expect.anything(), true, "1");
  });
});
