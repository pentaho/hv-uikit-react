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
import { describe, expect, it, vi } from "vitest";

import { HvButtonBase } from "./ButtonBase";

describe("Button", () => {
  it("renders the content", () => {
    render(<HvButtonBase>content</HvButtonBase>);

    expect(screen.getByRole("button", { name: "content" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const clickMock = vi.fn();
    render(<HvButtonBase onClick={clickMock}>content</HvButtonBase>);

    const button = screen.getByRole("button", { name: "content" });

    expect(button).toBeInTheDocument();
    expect(clickMock).not.toHaveBeenCalled();

    await user.click(button);
    expect(clickMock).toHaveBeenCalledTimes(1);

    await user.click(button);
    expect(clickMock).toHaveBeenCalledTimes(2);
  });

  it(`is type="button" by default`, () => {
    render(
      <form>
        <HvButtonBase>Button</HvButtonBase>
      </form>,
    );
    const button = screen.getByRole("button", { name: "Button" });
    expect(button).toHaveAttribute("type", "button");
  });

  it(`submits form when type="submit"`, async () => {
    const user = userEvent.setup();
    const submitFn = vi.fn();
    render(
      <form onSubmit={submitFn}>
        <HvButtonBase type="submit">Button</HvButtonBase>
      </form>,
    );

    const button = screen.getByRole("button", { name: "Button" });
    expect(button).toHaveAttribute("type", "submit");

    await user.click(button);
    expect(submitFn).toHaveBeenCalled();
  });

  describe("interactions", () => {
    it("executes passed function on a click", async () => {
      const user = userEvent.setup();
      const buttonSpy = vi.fn();
      const buttonText = "click me";
      render(<HvButtonBase onClick={buttonSpy}>{buttonText}</HvButtonBase>);

      const buttonToTest = screen.getByRole("button", { name: buttonText });
      expect(buttonToTest).toBeInTheDocument();

      await user.click(buttonToTest);
      expect(buttonSpy).toHaveBeenCalled();
    });

    it("executes the passed function on keydown", async () => {
      const user = userEvent.setup();
      const buttonSpy = vi.fn();
      const buttonText = "click me";
      render(<HvButtonBase onClick={buttonSpy}>{buttonText}</HvButtonBase>);

      const buttonToTest = screen.getByRole("button", { name: buttonText });
      expect(buttonToTest).toBeInTheDocument();

      buttonToTest.focus();

      await user.keyboard("{enter}");
      expect(buttonSpy).toHaveBeenCalledOnce();
    });

    it("does not executes the passed function on click", async () => {
      const user = userEvent.setup();
      const buttonSpy = vi.fn();
      const buttonText = "click me";
      render(
        <HvButtonBase disabled onClick={buttonSpy}>
          {buttonText}
        </HvButtonBase>,
      );

      const buttonToTest = screen.getByRole("button", { name: buttonText });
      expect(buttonToTest).toBeInTheDocument();

      await user.click(buttonToTest);
      expect(buttonSpy).not.toHaveBeenCalled();
    });

    it("focus the button", async () => {
      const user = userEvent.setup();
      const buttonSpy = vi.fn();
      const buttonSpyDismiss = vi.fn();
      const buttonDismissText = "don't focus me";
      const buttonText = "focus me";
      render(
        <div data-testid="outer-div">
          <HvButtonBase onClick={buttonSpyDismiss}>
            {buttonDismissText}
          </HvButtonBase>
          <HvButtonBase onClick={buttonSpy}>{buttonText}</HvButtonBase>
        </div>,
      );

      const div = screen.getByTestId("outer-div");
      expect(div).toBeInTheDocument();

      const buttonToDismissTest = screen.getByRole("button", {
        name: buttonDismissText,
      });
      const buttonToTest = screen.getByRole("button", {
        name: buttonDismissText,
      });
      expect(buttonToTest).toBeInTheDocument();
      expect(buttonToDismissTest).toBeInTheDocument();

      await user.keyboard("{tab}");
      await user.keyboard("{tab}");
      await user.keyboard("{enter}");
      expect(buttonSpy).toHaveBeenCalledOnce();
      expect(buttonSpyDismiss).toBeCalledTimes(0);
    });

    it("does not focus the button", async () => {
      const user = userEvent.setup();
      const buttonSpy = vi.fn();
      const buttonSpyDismiss = vi.fn();
      const buttonDismissText = "don't focus me";
      const buttonText = "focus me";
      render(
        <div data-testid="outer-div">
          <HvButtonBase
            disabled
            onClick={buttonSpyDismiss}
            onKeyDown={buttonSpyDismiss}
          >
            {buttonDismissText}
          </HvButtonBase>
          <HvButtonBase disabled onClick={buttonSpy} onKeyDown={buttonSpy}>
            {buttonText}
          </HvButtonBase>
        </div>,
      );

      const div = screen.getByTestId("outer-div");
      expect(div).toBeInTheDocument();

      const buttonToDismissTest = screen.getByRole("button", {
        name: buttonDismissText,
      });
      const buttonToTest = screen.getByRole("button", {
        name: buttonDismissText,
      });
      expect(buttonToTest).toBeInTheDocument();
      expect(buttonToDismissTest).toBeInTheDocument();

      await user.keyboard("{tab}");
      await user.keyboard("{enter}");
      await user.keyboard("{tab}");
      await user.keyboard("{enter}");
      expect(buttonSpy).toBeCalledTimes(0);
      expect(buttonSpyDismiss).toBeCalledTimes(0);
    });
  });

  describe("polymorphic button", () => {
    const CustomLink = ({ to, children, ...others }: any) => (
      <a href={to} {...others}>
        {children}
      </a>
    );

    it("has href", async () => {
      const user = userEvent.setup();
      const buttonSpy = vi.fn();
      render(
        <HvButtonBase component="a" href="/path/to" onClick={buttonSpy}>
          Link
        </HvButtonBase>,
      );

      const button = screen.getByRole("link", { name: "Link" });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("href", "/path/to");

      await user.click(button);
      expect(buttonSpy).toHaveBeenCalledOnce();
    });

    it("custom link", () => {
      render(
        <HvButtonBase component={CustomLink} to="/path/to">
          Link
        </HvButtonBase>,
      );

      const button = screen.getByRole("link", { name: "Link" });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("href", "/path/to");
    });
  });

  describe("focusableWhenDisabled", () => {
    it("is aria-disabled, focusable, isn't disabled or clickable", async () => {
      const user = userEvent.setup();
      const buttonSpy = vi.fn();
      render(
        <HvButtonBase onClick={buttonSpy} focusableWhenDisabled disabled>
          content
        </HvButtonBase>,
      );

      const button = screen.getByRole("button", { name: "content" });

      expect(button).not.toBeDisabled();
      expect(button).toHaveAttribute("aria-disabled", "true");

      await user.click(button);
      expect(buttonSpy).not.toHaveBeenCalled();

      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard("{enter}");
      expect(buttonSpy).not.toHaveBeenCalled();
    });
  });
});
