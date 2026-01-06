import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HvDropdown } from "../Dropdown";
import { HvTypography } from "../Typography";
import { HvAccordion } from "./Accordion";

const Main = () => (
  <>
    <HvAccordion label="Analytics" headingLevel={1}>
      <HvTypography>Views</HvTypography>
    </HvAccordion>
    <HvAccordion label="System">
      <HvTypography>item 2</HvTypography>
    </HvAccordion>
    <HvAccordion label="Data">
      <HvTypography>item 3</HvTypography>
    </HvAccordion>
  </>
);

const Controlled = () => {
  const [open, setOpen] = useState(false);
  return (
    <HvAccordion
      label="Analytics"
      expanded={open}
      onChange={() => setOpen(!open)}
    >
      <HvTypography>Views</HvTypography>
    </HvAccordion>
  );
};

const assertClosedEnabledButton = (
  component: HTMLElement,
  name?: string | RegExp,
) => {
  expect(component).toBeInTheDocument();
  expect(component).toHaveAttribute("aria-expanded", "false");
  expect(component).toHaveAttribute("aria-disabled", "false");

  if (name != null) {
    expect(component).toHaveAccessibleName(name);
  }
};

const assertClosedDisabledButton = (component: HTMLElement) => {
  expect(component).toBeInTheDocument();
  expect(component).toHaveAttribute("aria-expanded", "false");
  expect(component).toHaveAttribute("aria-disabled", "true");
};

const assertShowHideWithMouse = async () => {
  const user = userEvent.setup();
  const analyticsItem = screen.getByRole("button", { name: /Analytics/i });
  const analyticsContent = screen.getByText("Views");

  assertClosedEnabledButton(analyticsItem);
  expect(analyticsContent).not.toBeVisible();

  await user.click(analyticsItem);
  expect(analyticsItem).toHaveAttribute("aria-expanded", "true");
  expect(analyticsContent).toBeVisible();
};

const assertShowHideWithKeyboard = async () => {
  const user = userEvent.setup();
  const analyticsItem = screen.getByRole("button", { name: /Analytics/i });
  const analyticsContent = screen.getByText("Views");

  assertClosedEnabledButton(analyticsItem);
  expect(analyticsContent).not.toBeVisible();

  await user.tab();
  expect(analyticsContent).not.toBeVisible();

  await user.keyboard("{enter}");
  expect(analyticsItem).toHaveAttribute("aria-expanded", "true");
  expect(analyticsContent).toBeVisible();

  await user.keyboard("{enter}");
  expect(analyticsItem).toHaveAttribute("aria-expanded", "false");
  expect(analyticsContent).not.toBeVisible();
};

describe("Accordion", () => {
  it("renders the component as expected", () => {
    render(<Main />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    assertClosedEnabledButton(buttons[0], /Analytics/i);
    assertClosedEnabledButton(buttons[1], /System/i);
    assertClosedEnabledButton(buttons[2], /Data/i);
  });

  it("shows and hides the content using the mouse when uncontrolled", async () => {
    render(<Main />);
    await assertShowHideWithMouse();
  });

  it("shows and hides the content using the keyboard when uncontrolled", async () => {
    render(<Main />);
    await assertShowHideWithKeyboard();
  });

  it("shows and hides the content using the mouse when controlled", async () => {
    render(<Controlled />);
    await assertShowHideWithMouse();
  });

  it("shows and hides the content using the keyboard when controlled", async () => {
    render(<Controlled />);
    await assertShowHideWithKeyboard();
  });

  it("doesn't open when disabled using the mouse", async () => {
    const user = userEvent.setup();
    render(
      <HvAccordion label="Analytics" headingLevel={1} disabled>
        <HvTypography>Views</HvTypography>
      </HvAccordion>,
    );

    const analyticsItem = screen.getByRole("button", { name: /Analytics/i });
    const analyticsContent = screen.getByText("Views");
    assertClosedDisabledButton(analyticsItem);
    expect(analyticsContent).not.toBeVisible();

    await user.click(analyticsItem);
    assertClosedDisabledButton(analyticsItem);
    expect(analyticsContent).not.toBeVisible();
  });

  it("doesn't open when disabled using the keyboard", async () => {
    const user = userEvent.setup();
    render(
      <HvAccordion label="Analytics" headingLevel={1} disabled>
        <HvTypography>Views</HvTypography>
      </HvAccordion>,
    );

    const analyticsItem = screen.getByRole("button", { name: /Analytics/i });
    const analyticsContent = screen.getByText("Views");
    assertClosedDisabledButton(analyticsItem);
    expect(analyticsContent).not.toBeVisible();

    await user.tab();
    expect(analyticsContent).not.toBeVisible();

    await user.keyboard("{enter}");
    assertClosedDisabledButton(analyticsItem);
    expect(analyticsContent).not.toBeVisible();
  });

  it("uses the right heading level when defined", () => {
    render(<Main />);

    const headings = screen.getAllByRole("heading");
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveAccessibleName(/Analytics/i);
  });

  it("is opened at first when defaultExpand is set to true", async () => {
    const user = userEvent.setup();
    render(
      <HvAccordion label="Analytics" defaultExpanded>
        <HvTypography>Views</HvTypography>
      </HvAccordion>,
    );

    const analyticsItem = screen.getByRole("button", { name: /Analytics/i });
    const analyticsContent = screen.getByText("Views");
    expect(analyticsItem).toBeInTheDocument();
    expect(analyticsItem).toHaveAttribute("aria-expanded", "true");
    expect(analyticsItem).toHaveAttribute("aria-disabled", "false");
    expect(analyticsContent).toBeVisible();

    await user.click(analyticsItem);
    assertClosedEnabledButton(analyticsItem);
    expect(analyticsContent).not.toBeVisible();
  });

  it("doesn't use `preventDefault` and `stopPropagation`", async () => {
    const user = userEvent.setup();
    const toggleSpy = vi.fn();
    render(
      <>
        <HvAccordion label="Analytics">
          <HvTypography>Views</HvTypography>
        </HvAccordion>
        <HvDropdown defaultExpanded onToggle={toggleSpy} />
      </>,
    );

    await user.click(screen.getByRole("button", { name: /Analytics/i }));
    expect(toggleSpy).toHaveBeenCalledOnce();
  });
});
