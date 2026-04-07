import { act, render, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import type { HvStepProps } from "./DefaultNavigation";
import { HvStepNavigation } from "./StepNavigation";

type StepType = Pick<
  HvStepProps,
  "state" | "title" | "onClick" | "className" | "disabled"
> & {
  separatorClassName?: string;
  titleClassName?: string;
};

const steps: StepType[] = [
  { title: "Completed", state: "Completed" },
  { title: "Failed", state: "Failed" },
  { title: "Pending", state: "Pending" },
  { title: "Current", state: "Current" },
  { title: "Enabled", state: "Enabled" },
  { title: "Disabled", state: "Disabled" },
];

describe("StepNavigation", () => {
  it("should contain all the steps", () => {
    const { getByLabelText } = render(<HvStepNavigation steps={steps} />);

    expect(getByLabelText("Completed")).toBeInTheDocument();
    expect(getByLabelText("Failed")).toBeInTheDocument();
    expect(getByLabelText("Pending")).toBeInTheDocument();
    expect(getByLabelText("Current")).toBeInTheDocument();
    expect(getByLabelText("Enabled")).toBeInTheDocument();
    expect(getByLabelText("Disabled")).toBeInTheDocument();
  });

  it("should show a tooltip on hover", () => {
    const { getByLabelText, findByRole, queryByRole } = render(
      <HvStepNavigation type="Simple" showTitles={false} steps={steps} />,
    );
    act(async () => {
      userEvent.hover(getByLabelText("Pending"));
      const tooltip = await findByRole("tooltip");
      expect(tooltip).toBeInTheDocument();
      userEvent.unhover(getByLabelText("Pending"));
      await waitForElementToBeRemoved(() => queryByRole("tooltip"));
      expect(tooltip).not.toBeInTheDocument();
    });
  });
});
