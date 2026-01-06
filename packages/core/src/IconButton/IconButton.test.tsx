import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { HvIconButton, HvIconButtonProps } from "./IconButton";

const title = "My tooltip button";

const renderIconButton = (props?: Partial<HvIconButtonProps>) =>
  render(
    <HvIconButton title={title} {...props}>
      <div data-testid="downloadIconId" />
    </HvIconButton>,
  );

const assertTooltipWhenHovered = async () => {
  const user = userEvent.setup();
  await user.hover(screen.getByRole("button", { name: title }));
  await waitFor(() => {
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent(title);
  });
};

const assertTooltipWhenTabbed = async () => {
  const user = userEvent.setup();
  await user.tab();
  await waitFor(() => {
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent(title);
  });
};

describe("HvIconButton", () => {
  it("renders icon", () => {
    renderIconButton();
    expect(screen.getByTestId("downloadIconId")).toBeInTheDocument();
  });

  it("is clickable and tooltip appears on hover", async () => {
    const user = userEvent.setup();
    const buttonSpy = vi.fn();
    renderIconButton({ onClick: buttonSpy });

    await user.click(screen.getByRole("button", { name: title }));
    expect(buttonSpy).toHaveBeenCalledTimes(1);

    await user.keyboard("{enter}");
    expect(buttonSpy).toHaveBeenCalledTimes(2);

    await assertTooltipWhenHovered();
  });

  it("is not clickable when disabled and tooltip appears on hover", async () => {
    const user = userEvent.setup();
    const buttonSpy = vi.fn();
    renderIconButton({ disabled: true, onClick: buttonSpy });

    await user.click(screen.getByRole("button", { name: title }));
    expect(buttonSpy).not.toHaveBeenCalled();

    await user.keyboard("{enter}");
    expect(buttonSpy).not.toHaveBeenCalled();

    await assertTooltipWhenHovered();
  });

  it("renders tooltip when focused with the keyboard", async () => {
    renderIconButton();
    await assertTooltipWhenTabbed();
  });

  it("renders tooltip when disabled and focused with the keyboard", async () => {
    renderIconButton({ disabled: true });
    await assertTooltipWhenTabbed();
  });
});
