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
import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { HvSlider } from "./Slider";

const RangeSliderControlled = () => {
  const [values, setValues] = useState([0, 51]);

  return <HvSlider label="Failure Rate" values={values} onChange={setValues} />;
};

const SingleSliderControlled = () => {
  const [values, setValues] = useState([0]);

  return <HvSlider label="Failure Rate" values={values} onChange={setValues} />;
};

const assertRangeSliderValuesChange = async () => {
  const user = userEvent.setup();
  const fifty = "50";
  const fiftyOne = "51";
  const eighty = "80";
  const fiftyStyle = "left: 50%;";
  const fiftyOneStyle = "left: 51%;";
  const eightyStyle = "left: 80%;";

  const inputs = screen.getAllByRole("textbox");
  let knobs = screen.getAllByRole("slider");
  expect(inputs.length).toBe(2);
  expect(knobs.length).toBe(2);

  fireEvent.change(inputs[0], { target: { value: fifty } });
  fireEvent.blur(inputs[0]);

  knobs = await screen.findAllByRole("slider");
  expect(knobs[0]).toHaveStyle(fiftyStyle);
  expect(knobs[1]).toHaveStyle(fiftyOneStyle);
  expect(inputs[0]).toHaveValue(fifty);
  expect(inputs[1]).toHaveValue(fiftyOne);

  const eightyMark = screen.getByText(eighty);
  await user.click(eightyMark);

  knobs = await screen.findAllByRole("slider");
  expect(knobs[0]).toHaveStyle(fiftyStyle);
  expect(knobs[1]).toHaveStyle(eightyStyle);
  expect(inputs[0]).toHaveValue(fifty);
};

const assertSingleSliderValueChange = async () => {
  const user = userEvent.setup();
  const fifty = "50";
  const eighty = "80";
  const fiftyStyle = "left: 50%;";
  const eightyStyle = "left: 80%;";

  const input = screen.getByRole("textbox");
  let knob = screen.getByRole("slider");
  expect(input).toBeInTheDocument();
  expect(knob).toBeInTheDocument();

  fireEvent.change(input, { target: { value: fifty } });
  fireEvent.blur(input);

  knob = await screen.findByRole("slider");
  // The version of the slider is not updating the value now so we are testing with the style
  expect(knob).toHaveStyle(fiftyStyle);
  expect(input).toHaveValue(fifty);

  const eightyMark = screen.getByText(eighty);
  await user.click(eightyMark);

  knob = await screen.findByRole("slider");
  expect(knob).toHaveStyle(eightyStyle);
  expect(input).toHaveValue(eighty);
};

const assertOutOfRangeValidation = async (
  max: string | number,
  min: string | number,
  inRangeValue: string | number,
) => {
  const outOfRangeMessage = "The value is out of range";
  let warningText: HTMLElement | null = null;

  const input = screen.getByRole("textbox");
  expect(input).toBeInTheDocument();

  fireEvent.change(input, { target: { value: max } });
  fireEvent.blur(input);

  warningText = await screen.findByText(outOfRangeMessage);
  expect(warningText).toBeInTheDocument();
  expect(input).toBeInvalid();

  fireEvent.change(input, { target: { value: min } });
  fireEvent.blur(input);

  warningText = await screen.findByText(outOfRangeMessage);
  expect(warningText).toBeInTheDocument();
  expect(input).toBeInvalid();

  fireEvent.change(input, { target: { value: inRangeValue } });
  fireEvent.blur(input);

  warningText = screen.queryByText(outOfRangeMessage);
  expect(warningText).not.toBeInTheDocument();
  expect(input).not.toBeInvalid();
};

describe("Slider", () => {
  describe("Single", () => {
    it("renders as expected", () => {
      render(<HvSlider label="Failure Rate" defaultValues={[10]} />);

      const text = screen.getByText("Failure Rate");
      const knob = screen.getByRole("slider");
      const input = screen.getByRole("textbox");
      expect(text).toBeInTheDocument();
      expect(knob).toBeInTheDocument();
      expect(input).toBeInTheDocument();
    });

    it("renders an error when statusMessage is set", () => {
      render(
        <HvSlider
          label="Failure Rate"
          status="invalid"
          statusMessage="Invalid"
        />,
      );

      const knob = screen.queryByRole("slider");
      const input = screen.getByRole("textbox");
      const text = screen.getByText("Failure Rate");
      const warningText = screen.getByText("Invalid");
      expect(knob).not.toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(text).toBeInTheDocument();
      expect(warningText).toBeInTheDocument();
      expect(input).toBeInvalid();
    });

    it("renders without an input", () => {
      render(<HvSlider label="Failure Rate" defaultValues={[10]} hideInput />);

      const knob = screen.getByRole("slider");
      const input = screen.queryByRole("textbox");
      const text = screen.getByText("Failure Rate");
      expect(knob).toBeInTheDocument();
      expect(input).not.toBeInTheDocument();
      expect(text).toBeInTheDocument();
    });

    it("renders with no label and no input", () => {
      render(
        <HvSlider
          knobProps={[{ "aria-label": "no-label-knob" }]}
          hideInput
          defaultValues={[10]}
        />,
      );

      const knob = screen.getByRole("slider");
      const input = screen.queryByRole("textbox");
      const text = screen.queryByRole("Failure Rate");
      expect(knob).toBeInTheDocument();
      expect(input).not.toBeInTheDocument();
      expect(text).not.toBeInTheDocument();
    });

    it("changes its value when uncontrolled by using the input and knob", async () => {
      render(<HvSlider label="Failure Rate" defaultValues={[10]} />);
      await assertSingleSliderValueChange();
    });

    it("changes values when controlled by using the input and knob", async () => {
      render(<SingleSliderControlled />);
      await assertSingleSliderValueChange();
    });

    it("does not change value when disabled by using the input and knob", async () => {
      const user = userEvent.setup();
      const fifty = "50";
      const eighty = "80";
      const ten = "10";
      const tenStyle = "left: 10%;";
      render(<HvSlider label="Failure Rate" defaultValues={[10]} disabled />);

      const input = screen.getByRole("textbox");
      let knob = screen.getByRole("slider");
      expect(input).toBeInTheDocument();
      expect(knob).toBeInTheDocument();

      fireEvent.change(input, { target: { value: fifty } });
      fireEvent.blur(input);

      knob = await screen.findByRole("slider");
      expect(knob).toHaveStyle(tenStyle);
      expect(input).toHaveValue(ten);

      const eightyMark = screen.getByText(eighty);
      await user.click(eightyMark);

      knob = await screen.findByRole("slider");
      expect(knob).toHaveStyle(tenStyle);
      expect(input).toHaveValue(ten);
    });

    it("renders error message on blur when required and removes it when value is typed", async () => {
      const user = userEvent.setup();
      const empty = "";
      const eighty = "80";
      const ten = "10";
      const tenStyle = "left: 10%;";
      const eightyStyle = "left: 80%;";
      const requiredMessage = "The value is required";
      let warningText: HTMLElement | null = null;
      render(<HvSlider label="Failure Rate" required />);

      const input = screen.getByRole("textbox");
      let knob = screen.queryByRole("slider");
      expect(input).toBeInTheDocument();
      expect(knob).not.toBeInTheDocument();

      fireEvent.blur(input);

      warningText = await screen.findByText(requiredMessage);
      expect(warningText).toBeInTheDocument();
      expect(input).toHaveValue(empty);
      expect(input).toBeInvalid();

      const eightyMark = screen.getByText(eighty);
      await user.click(eightyMark);

      knob = await screen.findByRole("slider");
      expect(knob).toHaveStyle(eightyStyle);
      expect(input).toHaveValue(eighty);

      warningText = screen.queryByText(requiredMessage);
      expect(warningText).not.toBeInTheDocument();
      expect(input).not.toBeInvalid();

      fireEvent.change(input, { target: { value: empty } });
      fireEvent.blur(input);

      warningText = await screen.findByText(requiredMessage);
      expect(warningText).toBeInTheDocument();
      expect(input).toBeInvalid();

      knob = screen.queryByRole("slider");
      expect(knob).not.toBeInTheDocument();

      // Fill by input
      fireEvent.change(input, { target: { value: ten } });
      fireEvent.blur(input);

      knob = await screen.findByRole("slider");
      expect(knob).toHaveStyle(tenStyle);
      expect(input).toHaveValue(ten);

      warningText = screen.queryByText(requiredMessage);
      expect(warningText).not.toBeInTheDocument();
      expect(input).not.toBeInvalid();
    });

    it("does not render error message on blur when value is empty and required is false", async () => {
      const requiredMessage = "The value is required";
      const empty = "";
      let warningText: HTMLElement | null = null;
      render(<HvSlider label="Failure Rate" />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();

      fireEvent.blur(input);

      warningText = screen.queryByText(requiredMessage);
      expect(warningText).not.toBeInTheDocument();
      expect(input).toHaveValue(empty);
      expect(input).not.toBeInvalid();
    });

    it("renders error message when value typed is not between maxPointValue and minPointValue for default values", async () => {
      render(<HvSlider label="Failure Rate" />);
      await assertOutOfRangeValidation("110", "-5", "10");
    });

    // Added since we had bugs related with the validation for different values
    it("renders error message when value typed is not between maxPointValue and minPointValue for custom values", async () => {
      render(
        <HvSlider
          defaultValues={[50]}
          label="Test"
          minPointValue={10}
          maxPointValue={500}
          markStep={98}
          divisionQuantity={490}
        />,
      );
      await assertOutOfRangeValidation("501", "5", "200");
    });

    // Added since we had bugs related with the validation for different values
    it("renders slider with decimal values (markDigits) correctly", async () => {
      render(
        <HvSlider
          label="Decimal Slider"
          minPointValue={0.01}
          maxPointValue={1}
          markStep={10}
          divisionQuantity={100}
          markDigits={2}
          formatMark={(label) => `Mark: ${label}`}
        />,
      );

      // Test decimal marks
      const marks = screen.getAllByText(/Mark:/i);
      const marksContent = marks.map((mark) => mark.innerHTML);
      expect(marks).toHaveLength(11);
      expect(marksContent).toEqual([
        "Mark: 0.01",
        "Mark: 0.11",
        "Mark: 0.21",
        "Mark: 0.31",
        "Mark: 0.41",
        "Mark: 0.50",
        "Mark: 0.60",
        "Mark: 0.70",
        "Mark: 0.80",
        "Mark: 0.90",
        "Mark: 1.00",
      ]);

      await assertOutOfRangeValidation(1.01, 0, 0.5);
    });
  });

  describe("Range", () => {
    it("renders as expected", () => {
      render(<HvSlider label="Failure Rate" defaultValues={[10, 40]} />);

      const knobs = screen.getAllByRole("slider");
      const inputs = screen.getAllByRole("textbox");
      const text = screen.getByText("Failure Rate");
      expect(knobs.length).toBe(2);
      expect(inputs.length).toBe(2);
      expect(text).toBeInTheDocument();
    });

    it("renders an error when statusMessage is set", () => {
      render(
        <HvSlider
          label="Failure Rate"
          status="invalid"
          statusMessage="Invalid"
          defaultValues={[undefined, 53]}
        />,
      );

      const knobs = screen.getAllByRole("slider");
      const inputs = screen.getAllByRole("textbox");
      const text = screen.getByText("Failure Rate");
      const warningText = screen.getByText("Invalid");
      expect(knobs.length).toBe(1);
      expect(inputs.length).toBe(2);
      expect(text).toBeInTheDocument();
      expect(warningText).toBeInTheDocument();
      inputs.map((input) => expect(input).toBeInvalid());
    });

    it("changes values when uncontrolled by using the input and knob", async () => {
      render(<HvSlider label="Failure Rate" defaultValues={[10, 40]} />);
      await assertRangeSliderValuesChange();
    });

    it("changes values when controlled by using the input and knob", async () => {
      render(<RangeSliderControlled />);
      await assertRangeSliderValuesChange();
    });

    it("does not change values when disabled by using the input and knob", async () => {
      const user = userEvent.setup();
      const forty = "40";
      const ten = "10";
      const sixty = "60";
      const tenStyle = "left: 10%;";
      const fortyStyle = "left: 40%;";
      render(
        <HvSlider label="Failure Rate" defaultValues={[10, 40]} disabled />,
      );

      const inputs = screen.getAllByRole("textbox");
      let knobs = screen.getAllByRole("slider");
      expect(inputs.length).toBe(2);
      expect(knobs.length).toBe(2);

      fireEvent.change(inputs[0], { target: { value: sixty } });
      fireEvent.blur(inputs[0]);

      knobs = await screen.findAllByRole("slider");
      expect(knobs[0]).toHaveStyle(tenStyle);
      expect(knobs[1]).toHaveStyle(fortyStyle);
      expect(inputs[0]).toHaveValue(ten);
      expect(inputs[1]).toHaveValue(forty);

      const sixtyMark = screen.getByText(sixty);
      await user.click(sixtyMark);

      knobs = await screen.findAllByRole("slider");
      expect(knobs[0]).toHaveStyle(tenStyle);
      expect(knobs[1]).toHaveStyle(fortyStyle);
      expect(inputs[0]).toHaveValue(ten);
      expect(inputs[1]).toHaveValue(forty);
    });

    it("renders error message on blur when required and removes it when value is typed", async () => {
      const fifty = "50";
      const fiftyOne = "51";
      const fiftyStyle = "left: 50%;";
      const fiftyOneStyle = "left: 51%;";
      const requiredMessage = "The value is required";
      const empty = "";
      let warningText: HTMLElement | null = null;
      render(
        <HvSlider
          label="Failure Rate"
          required
          defaultValues={[undefined, undefined]}
        />,
      );

      const inputs = screen.getAllByRole("textbox");
      let knobs = screen.queryAllByRole("slider");
      expect(inputs.length).toBe(2);
      expect(knobs.length).toBe(0);

      fireEvent.blur(inputs[0]);

      warningText = await screen.findByText(requiredMessage);
      expect(warningText).toBeInTheDocument();
      expect(inputs[0]).toHaveValue(empty);
      expect(inputs[0]).toBeInvalid();
      expect(inputs[1]).toHaveValue(empty);
      expect(inputs[1]).toBeInvalid();

      fireEvent.change(inputs[0], { target: { value: fifty } });
      fireEvent.blur(inputs[0]);

      knobs = await screen.findAllByRole("slider");
      warningText = screen.queryByText(requiredMessage);
      expect(knobs[0]).toHaveStyle(fiftyStyle);
      expect(knobs[1]).toHaveStyle(fiftyOneStyle);
      expect(inputs[0]).toHaveValue(fifty);
      expect(inputs[1]).toHaveValue(fiftyOne);
      expect(warningText).not.toBeInTheDocument();
      expect(inputs[0]).not.toBeInvalid();
      expect(inputs[1]).not.toBeInvalid();
    });

    it("renders error message when value typed is between maxPointValue and minPointValue", async () => {
      const max = "110";
      const min = "-5";
      const ten = "10";
      const twenty = "20";
      const outOfRangeMessage = "The value is out of range";
      let warningText: HTMLElement | null = null;
      render(
        <HvSlider
          label="Failure Rate"
          defaultValues={[undefined, undefined]}
        />,
      );

      const inputs = screen.getAllByRole("textbox");
      expect(inputs.length).toBe(2);

      fireEvent.change(inputs[0], { target: { value: max } });
      fireEvent.blur(inputs[0]);

      warningText = await screen.findByText(outOfRangeMessage);
      expect(warningText).toBeInTheDocument();
      expect(inputs[0]).toBeInvalid();
      expect(inputs[1]).toBeInvalid();

      fireEvent.change(inputs[0], { target: { value: min } });
      fireEvent.blur(inputs[0]);

      warningText = await screen.findByText(outOfRangeMessage);
      expect(warningText).toBeInTheDocument();
      expect(inputs[0]).toBeInvalid();
      expect(inputs[1]).toBeInvalid();

      fireEvent.change(inputs[0], { target: { value: ten } });
      fireEvent.blur(inputs[0]);
      fireEvent.change(inputs[1], { target: { value: twenty } });
      fireEvent.blur(inputs[1]);

      warningText = screen.queryByText(outOfRangeMessage);
      expect(warningText).not.toBeInTheDocument();
      expect(inputs[0]).not.toBeInvalid();
      expect(inputs[1]).not.toBeInvalid();
    });
  });
});
