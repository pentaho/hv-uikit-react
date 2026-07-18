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

import { makeUTCDate } from "../Calendar/utils";
import { HvDatePicker } from "./DatePicker";

const Main = () => <HvDatePicker placeholder="Select date" aria-label="Date" />;

describe("HvDatePicker", () => {
  it("renders the dropdown", () => {
    render(<Main />);
    expect(screen.getByRole("combobox", { name: "Date" })).toBeInTheDocument();
  });

  describe("with minimum configuration", () => {
    it("should not be open", () => {
      render(<HvDatePicker />);

      const calendarButtons = screen.queryAllByRole("button");
      const firstDayOfTheMonth = screen.queryAllByText("1");
      const datePickerDropdown = screen.getByRole("combobox");

      expect(datePickerDropdown).toBeInTheDocument();
      expect(calendarButtons.length).toBe(0);
      expect(firstDayOfTheMonth.length).toBe(0);
    });
    it("should render a calendar component", async () => {
      render(<HvDatePicker />);
      let calendarButtons = screen.queryAllByRole("button");
      let firstDayOfTheMonth = screen.queryAllByText("1");
      const datePickerDropdown = screen.getByRole("combobox");

      expect(datePickerDropdown).toBeInTheDocument();
      expect(calendarButtons.length).toBe(0);
      expect(firstDayOfTheMonth.length).toBe(0);

      userEvent.click(datePickerDropdown);

      calendarButtons = await screen.findAllByRole("button");
      firstDayOfTheMonth = await screen.findAllByText("1");
      expect(calendarButtons.length).toBe(42 + 5);
      expect(firstDayOfTheMonth.length).toBe(2);
    });
  });

  describe("single calendar", () => {
    it("should have a value and not be open", () => {
      render(
        <HvDatePicker value={makeUTCDate(2019, 0, 1, 12)} locale="en-US" />,
      );
      const calendarButtons = screen.queryAllByRole("button");
      const firstDayOfTheMonth = screen.queryAllByText("1");
      const datePickerDropdown = screen.getByRole("combobox");
      const datePickerDropdownValue = screen.getByText("Jan 1, 2019");
      const dateInput = screen.queryByDisplayValue("Jan 1, 2019");

      expect(datePickerDropdown).toBeInTheDocument();
      expect(datePickerDropdownValue).toBeInTheDocument();
      expect(dateInput).not.toBeInTheDocument();
      expect(calendarButtons.length).toBe(0);
      expect(firstDayOfTheMonth.length).toBe(0);
    });
    it("should render a calendar component with a value", async () => {
      render(
        <HvDatePicker value={makeUTCDate(2019, 0, 1, 12)} locale="en-GB" />,
      );
      let calendarButtons = screen.queryAllByRole("button");
      let firstDayOfTheMonth = screen.queryAllByText("1");
      const datePickerDropdown = screen.getByRole("combobox");

      expect(datePickerDropdown).toBeInTheDocument();
      expect(screen.getByText("1 Jan 2019")).toBeInTheDocument();
      expect(screen.queryByDisplayValue("Jan 1, 2019")).not.toBeInTheDocument();
      expect(calendarButtons.length).toBe(0);
      expect(firstDayOfTheMonth.length).toBe(0);

      fireEvent.click(datePickerDropdown);

      calendarButtons = await screen.findAllByRole("button");
      firstDayOfTheMonth = await screen.findAllByText("1");
      const datePickerDropdownValue = await screen.findAllByText("1 Jan 2019");
      const dateInput = screen.getByDisplayValue("1 Jan 2019");
      expect(calendarButtons.length).toBe(42 + 5);
      expect(firstDayOfTheMonth.length).toBe(2);
      expect(datePickerDropdownValue.length).toBe(1);
      expect(dateInput).toBeInTheDocument();
    });
    it("should not call onChange when closing", async () => {
      const onChangeSpy = vi.fn();
      render(<HvDatePicker onChange={onChangeSpy} />);

      let picker = screen.getByRole("combobox");

      await userEvent.click(picker);

      expect(picker).toHaveAttribute("aria-expanded", "true");

      await userEvent.click(document.body);

      picker = screen.getByRole("combobox");
      expect(picker).toHaveAttribute("aria-expanded", "false");
      expect(onChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe("ranged calendar", () => {
    it("should have a value and not be open", () => {
      render(
        <HvDatePicker
          rangeMode
          locale="en-US"
          startValue={new Date(2019, 0, 5, 12)}
          endValue={new Date(2019, 0, 10, 12)}
        />,
      );
      const calendarButtons = screen.queryAllByRole("button");
      const firstDayOfTheMonth = screen.queryAllByText("1");
      const datePickerDropdown = screen.getByRole("combobox");
      const datePickerDropdownValue = screen.getByText("5 - 10 Jan 2019");
      const dateInputLeft = screen.queryByDisplayValue("5, Jan 2019");
      const dateInputRight = screen.queryByDisplayValue("10, Jan 2019");

      expect(datePickerDropdown).toBeInTheDocument();
      expect(datePickerDropdownValue).toBeInTheDocument();
      expect(dateInputLeft).not.toBeInTheDocument();
      expect(dateInputRight).not.toBeInTheDocument();
      expect(calendarButtons.length).toBe(0);
      expect(firstDayOfTheMonth.length).toBe(0);
    });
    it("should render a calendar component with a value", async () => {
      render(
        <HvDatePicker
          rangeMode
          locale="en-US"
          startValue={new Date(2019, 0, 5, 12)}
          endValue={new Date(2019, 0, 10, 12)}
        />,
      );
      let calendarButtons = screen.queryAllByRole("button");
      let firstDayOfTheMonth = screen.queryAllByText("1");
      const datePickerDropdown = screen.getByRole("combobox");
      let datePickerDropdownValue: HTMLElement | HTMLElement[] =
        screen.getByText("5 - 10 Jan 2019");

      expect(datePickerDropdown).toBeInTheDocument();
      expect(datePickerDropdownValue).toBeInTheDocument();

      expect(calendarButtons.length).toBe(0);
      expect(firstDayOfTheMonth.length).toBe(0);

      fireEvent.click(datePickerDropdown);

      calendarButtons = await screen.findAllByRole("button");
      firstDayOfTheMonth = await screen.findAllByText("1");
      datePickerDropdownValue = await screen.findAllByText("5 - 10 Jan 2019");
      const dateInputLeft = screen.getByDisplayValue("Jan 5, 2019");
      const dateInputRight = screen.getByDisplayValue("Jan 10, 2019");
      expect(calendarButtons.length).toBe(86 + 10);
      expect(firstDayOfTheMonth.length).toBe(4);
      expect(datePickerDropdownValue.length).toBe(1);
      expect(dateInputLeft).toBeInTheDocument();
      expect(dateInputRight).toBeInTheDocument();
    });
  });

  describe("calendar custom properties", () => {
    const labels = {
      applyLabel: "OK",
      cancelLabel: "GO BACK",
      title: "TESTING LABEL",
      placeholder: "I'M THE PLACEHOLDER",
    };

    it("should have a value and not be open", () => {
      const {
        queryAllByRole,
        queryAllByText,
        getByRole,
        getByText,
        queryByDisplayValue,
        queryByText,
      } = render(
        <HvDatePicker
          locale="en-US"
          labels={labels}
          placeholder={labels.placeholder}
          horizontalPlacement="left"
          showActions
        />,
      );
      const calendarButtons = queryAllByRole("button");
      const firstDayOfTheMonth = queryAllByText("1");
      const datePickerDropdown = getByRole("combobox");
      const datepickerPlaceholder = getByText(labels.placeholder);
      const dateInput = queryByDisplayValue("MM/DD/YYYY");
      const applyButton = queryByText(labels.applyLabel);
      const cancelButton = queryByText(labels.cancelLabel);

      expect(datePickerDropdown).toBeInTheDocument();
      expect(dateInput).not.toBeInTheDocument();
      expect(applyButton).not.toBeInTheDocument();
      expect(cancelButton).not.toBeInTheDocument();
      expect(datepickerPlaceholder).toBeInTheDocument();
      expect(calendarButtons.length).toBe(0);
      expect(firstDayOfTheMonth.length).toBe(0);
    });
    it("should render a calendar component with a value", async () => {
      const {
        queryAllByRole,
        queryAllByText,
        queryByText,
        getByRole,
        findAllByRole,
        findAllByText,
        findByText,
        getByText,
        queryByDisplayValue,
        findByPlaceholderText,
      } = render(
        <HvDatePicker
          locale="en-US"
          labels={labels}
          placeholder={labels.placeholder}
          horizontalPlacement="left"
          showActions
        />,
      );
      let calendarButtons = queryAllByRole("button");
      let firstDayOfTheMonth = queryAllByText("1");
      const datePickerDropdown = getByRole("combobox");
      const datepickerPlaceholder = getByText(labels.placeholder);
      let dateInput = queryByDisplayValue("MM/DD/YYYY");
      let applyButton = queryByText(labels.applyLabel);
      let cancelButton = queryByText(labels.cancelLabel);

      expect(datePickerDropdown).toBeInTheDocument();
      expect(dateInput).not.toBeInTheDocument();
      expect(applyButton).not.toBeInTheDocument();
      expect(cancelButton).not.toBeInTheDocument();
      expect(datepickerPlaceholder).toBeInTheDocument();
      expect(calendarButtons.length).toBe(0);
      expect(firstDayOfTheMonth.length).toBe(0);

      userEvent.click(datePickerDropdown);

      calendarButtons = await findAllByRole("button");
      firstDayOfTheMonth = await findAllByText("1");
      dateInput = await findByPlaceholderText("MM/DD/YYYY");
      applyButton = await findByText(labels.applyLabel);
      cancelButton = await findByText(labels.cancelLabel);
      expect(calendarButtons.length).toBe(44 + 5);
      expect(firstDayOfTheMonth.length).toBe(2);
      expect(dateInput).toBeInTheDocument();
      expect(applyButton).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
    });
  });

  describe("read only mode", () => {
    it("When in read only mode it shouldn't open the calendar", async () => {
      const { getByRole, queryByRole } = render(
        <HvDatePicker
          placeholder="Can't select a date now"
          aria-label="Read only date picker"
          readOnly
        />,
      );

      const timepickerDropdown = getByRole("combobox");
      expect(timepickerDropdown).toBeInTheDocument();
      expect(timepickerDropdown).toHaveAttribute("aria-expanded", "false");
      userEvent.click(timepickerDropdown); // try to open

      const pickerTooltip = queryByRole("tooltip");
      expect(pickerTooltip).not.toBeInTheDocument();
    });
  });
});
