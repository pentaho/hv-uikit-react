import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HvBadge } from "./Badge";

describe("Badge", () => {
  it("should render a small dot when count>0 without showCount", () => {
    render(<HvBadge label={12} />);
    expect(screen.queryByText("12")).toBeNull();
  });

  it("should render correctly with showCount", () => {
    render(<HvBadge label={12} showCount />);
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("should render correctly with showCount and one-digit count", () => {
    render(<HvBadge label={9} showCount />);
    expect(screen.getByText("9")).toBeInTheDocument();
  });

  it("should render nothing when count is 0 even with showCount", () => {
    render(<HvBadge label={0} showCount />);
    expect(screen.queryByText("0")).toBeNull();
  });

  it("should render correctly with maxCount", () => {
    render(<HvBadge label={100} showCount />);
    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("should render correctly with text", () => {
    render(
      <HvBadge label={100} showCount>
        hello
      </HvBadge>,
    );
    expect(screen.queryByText("99+")).toBeInTheDocument();
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("should render correctly with svg", () => {
    render(<HvBadge label={100} showCount icon={<div data-testid="icon" />} />);
    expect(screen.queryByText("99+")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("should render correctly with custom label", () => {
    render(<HvBadge label="New!" />);
    expect(screen.getByText("New!")).toBeInTheDocument();
  });

  it("should render correctly with custom one-character label", () => {
    render(<HvBadge label="!" />);
    expect(screen.getByText("!")).toBeInTheDocument();
  });
});
