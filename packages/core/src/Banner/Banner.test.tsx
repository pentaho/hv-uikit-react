import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HvBanner, HvBannerProps } from "./Banner";

const bannerLabel = "This is a banner.";

const Banner = (props: Partial<HvBannerProps>) => (
  <HvBanner
    open
    label={bannerLabel}
    actions={[
      { id: "action1", label: "action1" },
      { id: "action2", label: "action2" },
    ]}
    actionsPosition="inline"
    {...props}
  />
);

describe("Banner", () => {
  it("should render the banner label", () => {
    render(<Banner />);

    const banner = screen.getByRole("alert");

    expect(banner).toBeInTheDocument();
    expect(banner).toHaveTextContent(bannerLabel);
  });

  it("should render the close button and call onClose when clicked", async () => {
    const user = userEvent.setup();
    const callbackSpy = vi.fn();

    render(<Banner onClose={callbackSpy} />);

    const closeButton = screen.getByRole("button", { name: "Close" });
    await user.click(closeButton);

    expect(closeButton).toBeInTheDocument();
    expect(callbackSpy).toHaveBeenCalledOnce();
  });

  it("should render the actions and call onAction when clicked", async () => {
    const user = userEvent.setup();
    const callbackSpy = vi.fn();

    render(<Banner onAction={callbackSpy} />);

    const buttons = screen.getAllByRole("button");
    const action1 = screen.getByRole("button", { name: "action1" });
    const action2 = screen.getByRole("button", { name: "action2" });

    await user.click(action1);
    await user.click(action2);

    expect(buttons).toHaveLength(2);
    expect(action1).toBeInTheDocument();
    expect(action2).toBeInTheDocument();
    expect(callbackSpy).toHaveBeenCalledTimes(2);
  });
});
