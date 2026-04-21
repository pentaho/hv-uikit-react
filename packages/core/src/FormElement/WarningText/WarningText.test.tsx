import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HvWarningText, type HvWarningTextProps } from ".";

const TEXT = "text-content";

const setup = (props: Partial<HvWarningTextProps>) =>
  render(<HvWarningText {...props}>{TEXT}</HvWarningText>);

describe("WarningText", () => {
  it("doesn't render component when not visible", () => {
    setup({ isVisible: false });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument();
  });

  it("renders component and value when visible", () => {
    setup({ isVisible: true });
    const component = screen.getByRole("status");
    const content = screen.getByText(TEXT);
    expect(component).toBeVisible();
    expect(content).toBeVisible();
  });

  it("renders custom adornment", () => {
    setup({ isVisible: true, adornment: "FAKE-ICON" });
    expect(screen.getByText("FAKE-ICON")).toBeVisible();
  });
});
