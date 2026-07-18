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
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { HvBaseCheckBox } from "./BaseCheckBox";

describe("BaseCheckBox", () => {
  describe("checked", () => {
    it("should be always checked", async () => {
      render(<HvBaseCheckBox checked />);

      const baseCheckbox = screen.getByRole("checkbox");

      expect(baseCheckbox).toBeInTheDocument();
      expect(baseCheckbox).toBeChecked();

      await userEvent.click(baseCheckbox);

      expect(baseCheckbox).toBeChecked();
    });

    it("should be checkable", async () => {
      render(<HvBaseCheckBox />);

      const baseCheckbox = screen.getByRole("checkbox");

      expect(baseCheckbox).toBeInTheDocument();
      expect(baseCheckbox).not.toBeChecked();

      await userEvent.click(baseCheckbox);

      expect(baseCheckbox).toBeChecked();
    });

    it("should be checkable and checked by default", async () => {
      render(<HvBaseCheckBox defaultChecked />);

      const baseCheckbox = screen.getByRole("checkbox");

      expect(baseCheckbox).toBeInTheDocument();
      expect(baseCheckbox).toBeChecked();

      await userEvent.click(baseCheckbox);

      expect(baseCheckbox).not.toBeChecked();
    });
  });
  describe("indeterminate", () => {
    it("should have attribute indeterminate", () => {
      render(<HvBaseCheckBox indeterminate />);

      const baseCheckbox = screen.getByRole("checkbox");

      expect(baseCheckbox).toBeInTheDocument();
      expect(baseCheckbox).toHaveAttribute("data-indeterminate", "true");
    });
  });

  describe("readOnly", () => {
    it("should have attribute readOnly", () => {
      render(<HvBaseCheckBox readOnly />);

      const baseCheckbox = screen.getByRole("checkbox");

      expect(baseCheckbox).toBeInTheDocument();
      expect(baseCheckbox).toHaveAttribute("readOnly");
    });
  });

  describe("required", () => {
    it("should have attribute required", () => {
      render(<HvBaseCheckBox required />);

      const baseCheckbox = screen.getByRole("checkbox");

      expect(baseCheckbox).toBeInTheDocument();
      expect(baseCheckbox).toBeRequired();
    });
  });

  describe("disabled", () => {
    it("should be disabled", () => {
      render(<HvBaseCheckBox disabled />);

      const baseCheckbox = screen.getByRole("checkbox");

      expect(baseCheckbox).toBeInTheDocument();
      expect(baseCheckbox).toBeDisabled();
    });

    it("should not be checkable", async () => {
      render(<HvBaseCheckBox disabled />);

      const baseCheckbox = screen.getByRole("checkbox");
      baseCheckbox.style.pointerEvents = "auto";

      expect(baseCheckbox).toBeInTheDocument();
      expect(baseCheckbox).not.toBeChecked();

      await userEvent.click(baseCheckbox);

      expect(baseCheckbox).not.toBeChecked();
    });
  });
});
