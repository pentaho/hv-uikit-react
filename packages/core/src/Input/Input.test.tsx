import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { HvAdornment } from "../FormElement";
import { HvInput, type HvInputProps } from "./Input";

const Suggestions = ({ ...others }: Partial<HvInputProps>) => {
  const [value, setValue] = useState("");

  const suggestionHandler: HvInputProps["suggestionListCallback"] = (
    val: string,
  ) => {
    if (!val && value) return null; // cleared
    return [{ id: "value", label: "value" }]; // all other cases
  };

  return (
    <HvInput
      label="Select a country"
      value={value}
      onChange={(event, val) => setValue(val)}
      suggestionListCallback={suggestionHandler}
      {...others}
    />
  );
};

describe("Input", () => {
  it("renders the input element", () => {
    render(<HvInput />);

    const input = screen.getByRole("textbox");

    expect(input).toBeVisible();
    expect(input).toBeEnabled();
  });

  it("renders the disabled input element", () => {
    render(<HvInput disabled />);

    const input = screen.getByRole("textbox");

    expect(input).toBeVisible();
    expect(input).toBeDisabled();
  });

  it("renders the endAdornment", () => {
    render(<HvInput endAdornment={<div data-testid="icon" />} />);

    expect(screen.getByTestId("icon")).toBeVisible();
  });

  it("renders a text endAdornment", () => {
    render(<HvInput endAdornment="kg" />);
    expect(screen.getByText("kg")).toBeVisible();
  });

  it("renders the label and description", () => {
    render(<HvInput label="LABEL" description="DESCRIPTION" />);
    expect(screen.getByRole("textbox", { name: "LABEL" })).toBeInTheDocument();
    expect(screen.getByText("DESCRIPTION")).toBeInTheDocument();
  });

  it("renders the info message", () => {
    render(<HvInput infoMessage="INFO" />);
    expect(screen.getByText("INFO")).toBeInTheDocument();
  });

  it("renders only the statusMessage when invalid status", () => {
    render(
      <HvInput status="invalid" infoMessage="INFO" statusMessage="ERROR" />,
    );
    expect(screen.getByText("ERROR")).toBeInTheDocument();
    expect(screen.queryByText("INFO")).toBeNull();
  });

  it("renders only the info message when in standby status", () => {
    render(
      <HvInput status="standBy" infoMessage="INFO" statusMessage="ERROR" />,
    );
    expect(screen.getByText("INFO")).toBeInTheDocument();
    expect(screen.queryByText("ERROR")).toBeNull();
  });

  it("can press custom endAdornment with keyboard", async () => {
    const clickMock = vi.fn();
    render(
      <HvInput
        endAdornment={
          <HvAdornment onClick={clickMock} tabIndex={0} icon={<div />} />
        }
      />,
    );

    const user = userEvent.setup();
    await user.tab();
    expect(screen.getByRole("textbox")).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button")).toHaveFocus();
    await user.keyboard("{enter}");
    expect(clickMock).toHaveBeenCalledTimes(1);
  });

  it("renders the startAdornment", () => {
    render(<HvInput startAdornment={<div data-testid="icon" />} />);

    expect(screen.getByTestId("icon")).toBeVisible();
  });

  it("renders the adornment as disabled for the search when the input is disabled", () => {
    render(
      <HvInput
        disabled
        type="search"
        label="My input"
        placeholder="Type something..."
        onEnter={() => {}}
      />,
    );

    expect(screen.getByRole("searchbox")).toBeDisabled();
    const adornment = document.querySelector("button"); // role can't be used since it has aria-hidden
    expect(adornment).toHaveAttribute("aria-disabled", "true");
  });

  it("renders the adornment as disabled for the password when the input is disabled", () => {
    render(
      <HvInput
        disabled
        type="password"
        label="My input"
        placeholder="Type something..."
        onEnter={() => {}}
      />,
    );

    expect(screen.getByLabelText("My input")).toBeDisabled(); // can't find by role searchbox since password inputs don't have a role...
    const adornment = screen.getByLabelText("Click to show password."); // roles can't be used since the parent has aria-hidden
    expect(adornment).toHaveAttribute("aria-disabled", "true");
  });

  it("captures the value in a form submission", async () => {
    const defaultValue = "John Doe";
    let capturedValue = "";
    render(
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          const formData = new FormData(evt.currentTarget);
          capturedValue = formData.get("username") as string;
        }}
      >
        <HvInput name="username" defaultValue={defaultValue} />
        <button type="submit">Submit</button>
      </form>,
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(capturedValue).toBe(defaultValue);
  });

  it("validates email input", async () => {
    const user = userEvent.setup();
    render(
      <HvInput
        type="email"
        label="Email"
        validationMessages={{ error: "Invalid EMAIL" }}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    await user.type(input, "user");
    await user.click(document.body); // blur
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Invalid EMAIL")).toBeInTheDocument();

    await user.type(input, "name@example.com");
    expect(screen.queryByText("Invalid EMAIL")).toBeNull();
  });

  it("resets the value when reset button is pressed", async () => {
    const initialValue = "John Doe";
    render(
      <form onSubmit={(evt) => evt.preventDefault()}>
        <HvInput name="username" defaultValue={initialValue} />
        <button type="reset">Reset</button>
      </form>,
    );

    const user = userEvent.setup();
    await user.type(screen.getByRole("textbox"), "suffix");
    expect(screen.getByRole("textbox")).toHaveValue(`${initialValue}suffix`);

    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("textbox")).toHaveValue(initialValue);
  });

  it("does not trigger the suggestions on focus by default", async () => {
    const user = userEvent.setup();
    render(<Suggestions />);

    const input = screen.getByRole("textbox", {
      name: "Select a country",
    });
    await user.click(input);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("triggers the suggestions on focus when suggestOnFocus is true", async () => {
    const user = userEvent.setup();
    render(<Suggestions suggestOnFocus />);

    const input = screen.getByRole("textbox", {
      name: "Select a country",
    });
    await user.click(input);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("triggers onBlur only when outside the input", async () => {
    const blurMock = vi.fn();
    const user = userEvent.setup();
    render(<Suggestions enablePortal onBlur={blurMock} />);

    const input = screen.getByRole("textbox", {
      name: "Select a country",
    });
    await user.type(input, "value");
    await user.click(screen.getByRole("option", { name: "value" }));

    expect(blurMock).toHaveBeenCalledTimes(0);
  });
});
