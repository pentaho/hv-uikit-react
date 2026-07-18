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
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HvTextArea } from "./TextArea";

describe("TextArea", () => {
  it("should render as expected", () => {
    render(
      <HvTextArea
        label="Label"
        placeholder="Enter value"
        rows={5}
        maxCharQuantity={10}
      />,
    );

    const textarea = screen.getByRole("textbox", { name: "Label" });

    expect(textarea).toBeInTheDocument();
    expect(textarea).toBeEnabled();
    expect(textarea).toBeValid();

    expect(textarea).not.toBeRequired();
    expect(textarea).not.toHaveAttribute("readonly");
  });

  it("should be disabled", () => {
    render(<HvTextArea rows={4} label="Label" disabled />);

    const textarea = screen.getByRole("textbox", { name: "Label" });

    expect(textarea).toBeInTheDocument();
    expect(textarea).toBeDisabled();
  });

  it("should be required and the label should have an asterisk", () => {
    render(<HvTextArea rows={4} label="Label" required />);

    const textarea = screen.getByRole("textbox", { name: "Label" });

    expect(textarea).toBeInTheDocument();
    expect(textarea).toBeRequired();

    const label = screen.getByText("Label", { selector: "label" });

    expect(label).toHaveTextContent("Label*");
  });

  it("renders the label and description", () => {
    render(<HvTextArea label="Label" description="Description" />);

    expect(screen.getByRole("textbox", { name: "Label" })).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("renders only the statusMessage when invalid status", () => {
    render(
      <HvTextArea status="invalid" infoMessage="INFO" statusMessage="ERROR" />,
    );
    expect(screen.getByText("ERROR")).toBeInTheDocument();
    expect(screen.queryByText("INFO")).toBeNull();
  });

  it("renders only the info message when in standby status", () => {
    render(
      <HvTextArea status="standBy" infoMessage="INFO" statusMessage="ERROR" />,
    );
    expect(screen.getByText("INFO")).toBeInTheDocument();
    expect(screen.queryByText("ERROR")).toBeNull();
  });

  it("should be readonly", () => {
    render(<HvTextArea rows={4} label="Label" readOnly />);

    const textarea = screen.getByRole("textbox", { name: "Label" });

    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("readonly");
  });

  it("should render the count label correctly", () => {
    render(
      <HvTextArea
        rows={4}
        label="Label"
        defaultValue="Test"
        middleCountLabel="of"
        maxCharQuantity={10}
      />,
    );

    const labelCount = screen.getByText("4");

    expect(labelCount).toBeDefined();
  });

  it("should render the count label correctly and show the warning", () => {
    render(
      <HvTextArea
        rows={4}
        label="Label"
        placeholder="Enter value"
        middleCountLabel="of"
        maxCharQuantity={3}
        defaultValue="Tests"
      />,
    );

    const textarea = screen.getByRole("textbox", { name: "Label" });

    expect(textarea).toBeInTheDocument();
    expect(textarea).toBeInvalid();

    const labelCount = screen.getByText("5");

    expect(labelCount).toBeDefined();
  });

  it("should use the ref passed by the caller", () => {
    const ref = createRef<HTMLElement>();

    expect(ref.current).toBe(null);

    render(
      <HvTextArea
        label="Label"
        placeholder="Enter value"
        rows={4}
        maxCharQuantity={10}
        inputRef={ref}
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});
