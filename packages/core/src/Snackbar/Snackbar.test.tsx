import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HvSnackbar, HvSnackbarProps } from "./Snackbar";

const snackbarLabel = "My snackbar";

const setup = (props?: Partial<HvSnackbarProps>) =>
  render(
    <HvSnackbar
      open
      showIcon
      variant="success"
      label={snackbarLabel}
      action={{ id: "action", label: "Action" }}
      {...props}
    />,
  );

describe("Snackbar", () => {
  it("renders the label text", () => {
    setup();
    const snackbar = screen.getByRole("alert");
    expect(snackbar).toBeInTheDocument();
    expect(snackbar).toHaveTextContent(snackbarLabel);
  });

  it("doesn't render when closed", () => {
    setup({ open: false });
    const snackbar = screen.queryByRole("alert");
    expect(snackbar).toBeNull();
  });

  it("renders the label custom content", () => {
    setup({ label: <div>Custom content</div> });
    const snackbar = screen.getByRole("alert");
    expect(snackbar).toHaveTextContent("Custom content");
  });

  it("renders the custom icon icon", () => {
    setup({ customIcon: <div data-testid="iconId" /> });
    const icon = screen.getByTestId("iconId");
    expect(icon).toBeInTheDocument();
  });

  it("renders action and triggers onAction when clicked", async () => {
    const user = userEvent.setup();
    const callbackSpy = vi.fn();

    setup({ onAction: callbackSpy });

    const action = screen.getByRole("button", { name: "Action" });
    await user.click(action);

    expect(action).toBeInTheDocument();
    expect(callbackSpy).toHaveBeenCalledTimes(1);
  });
});
