import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";

import { HvProgressBar } from "./ProgressBar";
import { ProgressBarSimulator } from "./ProgressBarSimulator";

describe("ProgressBar", { timeout: 30000 }, () => {
  describe("Static Determinate Value Tests", () => {
    it("completed progress bar", async () => {
      const { container, findByRole, findByText, getByLabelText } = render(
        <HvProgressBar
          value={100}
          labelProps={{
            "aria-label": "My Aria Label",
            "aria-busy": false,
            "aria-live": "polite",
          }}
        />,
      );

      const progressBar = await findByRole("progressbar");
      await findByText("100%");
      expect(progressBar).toHaveAttribute("aria-valuenow", "100");

      const bar = getByLabelText("My Aria Label");
      expect(bar).toBeInTheDocument();

      expect(container).toBeInTheDocument();
    });

    it("zero progress bar", async () => {
      const { container, findByRole, findByText, getByLabelText } = render(
        <HvProgressBar
          value={0}
          labelProps={{
            "aria-label": "My Aria Label",
            "aria-busy": false,
            "aria-live": "polite",
          }}
        />,
      );
      const progressBar = await findByRole("progressbar");
      await findByText("0%");
      expect(progressBar).toHaveAttribute("aria-valuenow", "0");

      const bar = getByLabelText("My Aria Label");
      expect(bar).toBeInTheDocument();

      expect(container).toBeInTheDocument();
    });

    it("middle progress bar", async () => {
      const { container, findByRole, findByText, getByLabelText } = render(
        <HvProgressBar
          value={50}
          labelProps={{
            "aria-label": "My Aria Label",
            "aria-busy": false,
            "aria-live": "polite",
          }}
        />,
      );
      const progressBar = await findByRole("progressbar");
      await findByText("50%");
      expect(progressBar).toHaveAttribute("aria-valuenow", "50");

      const bar = getByLabelText("My Aria Label");
      expect(bar).toBeInTheDocument();

      expect(container).toBeInTheDocument();
    });

    it("out of bounds progress bar (up)", async () => {
      const { container, findByRole, findByText, getByLabelText } = render(
        <HvProgressBar
          value={200}
          labelProps={{
            "aria-label": "My Aria Label",
            "aria-busy": false,
            "aria-live": "polite",
          }}
        />,
      );
      const progressBar = await findByRole("progressbar");
      await findByText("100%");
      expect(progressBar).toHaveAttribute("aria-valuenow", "100");

      const bar = getByLabelText("My Aria Label");
      expect(bar).toBeInTheDocument();

      expect(container).toBeInTheDocument();
    });

    it("out of bounds progress bar (down)", async () => {
      const { container, findByRole, findByText, getByLabelText } = render(
        <HvProgressBar
          value={-200}
          labelProps={{
            "aria-label": "My Aria Label",
            "aria-busy": false,
            "aria-live": "polite",
          }}
        />,
      );
      const progressBar = await findByRole("progressbar");
      await findByText("0%");
      expect(progressBar).toHaveAttribute("aria-valuenow", "0");

      const bar = getByLabelText("My Aria Label");
      expect(bar).toBeInTheDocument();

      expect(container).toBeInTheDocument();
    });

    it("error", async () => {
      const { container, findByRole, findByText, getByLabelText } = render(
        <HvProgressBar
          value={-200}
          labelProps={{
            "aria-label": "My Aria Label",
            "aria-busy": false,
            "aria-live": "polite",
          }}
        />,
      );
      const progressBar = await findByRole("progressbar");
      await findByText("0%");
      expect(progressBar).toHaveAttribute("aria-valuenow", "0");

      const bar = getByLabelText("My Aria Label");
      expect(bar).toBeInTheDocument();

      expect(container).toBeInTheDocument();
    });
  });

  it("check aria label", async () => {
    const { container, findByRole, getByLabelText } = render(
      <HvProgressBar
        value={100}
        labelProps={{
          "aria-label": "My Aria Label",
          "aria-busy": false,
          "aria-live": "polite",
        }}
      />,
    );
    await findByRole("progressbar");

    const bar = getByLabelText("My Aria Label");

    expect(bar).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  describe("Dynamic Determinate Value Tests", () => {
    it("completed progress bar", async () => {
      const { container, findByRole, findByText } = render(
        <ProgressBarSimulator inc={(v) => v + 75} ariaLabel="Progress Bar" />,
      );

      const progressBar = await findByRole("progressbar");
      const button = await findByText("Start");
      await findByText("0%");
      expect(progressBar).toHaveAttribute("aria-valuenow", "0");

      userEvent.click(button);
      await findByText("100%");
      expect(progressBar).toHaveAttribute("aria-valuenow", "100");
      expect(container).toBeInTheDocument();
    });

    it("error progress bar", async () => {
      const { container, findByRole, findByText } = render(
        <ProgressBarSimulator
          inc={(v) => v + 15}
          ariaLabel="Progress Bar"
          error={30}
        />,
      );

      const progressBar = await findByRole("progressbar");
      const button = await findByText("Start");
      await findByText("0%");

      userEvent.click(button);
      await findByText("30%");
      expect(progressBar).toHaveAttribute("aria-valuenow", "30");
      expect(container).toBeInTheDocument();
    });
  });
});
