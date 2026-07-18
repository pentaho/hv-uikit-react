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
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { HvCarousel, HvCarouselSlide, type HvCarouselProps } from ".";

const setup = ({
  title = "TITLE",
  numImages = 10,
  onChange = () => {},
  ...others
}: HvCarouselProps & { numImages?: number }) => {
  return render(
    <HvCarousel
      title={title}
      onChange={onChange}
      renderThumbnail={(i) => <img src={`/image-${i}`} alt={`label-${i}`} />}
      {...others}
    >
      {[...Array(numImages).keys()].map((i) => (
        <HvCarouselSlide key={i} src={`/image-${i}`} alt={`label-${i}`} />
      ))}
    </HvCarousel>,
  );
};

describe("<HvCarousel>", () => {
  it("renders the general structure", () => {
    const title = "MY_TITLE";
    const numImages = 10;

    setup({ title, numImages });

    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    const images = screen.getAllByRole("img");
    expect(images.length).toBe(numImages * 2); // images + thumbnails

    const prevButton = screen.getByRole("button", { name: "Backwards" });
    expect(prevButton).toBeInTheDocument();
    const nextButton = screen.getByRole("button", { name: "Forwards" });
    expect(nextButton).toBeInTheDocument();

    expect(screen.getByText(`1 / ${numImages}`)).toBeInTheDocument();
  });

  it("switches images on navigation button click", () => {
    const numImages = 10;
    const mockChange = vi.fn();

    setup({ numImages, onChange: mockChange });

    const prevButton = screen.getByRole("button", { name: "Backwards" });
    const nextButton = screen.getByRole("button", { name: "Forwards" });

    expect(screen.getByText(`1 / ${numImages}`)).toBeInTheDocument();
    expect(mockChange).toHaveBeenCalledTimes(0);

    fireEvent.click(nextButton);
    expect(screen.getByText(`2 / ${numImages}`)).toBeInTheDocument();
    expect(mockChange).toHaveBeenCalledTimes(1);

    fireEvent.click(prevButton);
    expect(screen.getByText(`1 / ${numImages}`)).toBeInTheDocument();
    expect(mockChange).toHaveBeenCalledTimes(2);
  });

  it("switches images on thumbnail click", () => {
    const numImages = 10;
    const mockChange = vi.fn();

    setup({ numImages, onChange: mockChange });

    const thumbnail4 = screen.getByRole("button", { name: "label-3" });
    fireEvent.click(thumbnail4);

    expect(screen.getByText(`4 / ${numImages}`)).toBeInTheDocument();
    expect(mockChange).toHaveBeenCalledTimes(1);
    expect(mockChange).toHaveBeenCalledWith(3);
  });

  it("triggers onFullscreen when clicking the fullscreen action", async () => {
    const user = userEvent.setup();
    const mockFullscreen = vi.fn();
    setup({ showFullscreen: true, onFullscreen: mockFullscreen });

    const fullscreenBtn = screen.getByRole("button", { name: "Fullscreen" });
    await user.click(fullscreenBtn);
    expect(mockFullscreen).toHaveBeenCalledTimes(1);

    const closeFullscreenBtn = screen.getByRole("button", { name: "Close" });
    await user.click(closeFullscreenBtn);
    expect(mockFullscreen).toHaveBeenCalledTimes(2);
  });

  it("can override labels", async () => {
    const user = userEvent.setup();
    setup({
      showFullscreen: true,
      labels: {
        backwards: "Backwards1",
        close: "Close1",
        forwards: "Forwards1",
        fullscreen: "Fullscreen1",
      },
    });

    const fullscreenBtn = screen.getByRole("button", { name: "Fullscreen1" });
    expect(fullscreenBtn).toBeInTheDocument();

    const forwardsBtn = screen.getByRole("button", { name: "Forwards1" });
    expect(forwardsBtn).toBeInTheDocument();

    const backwardsBtn = screen.getByRole("button", { name: "Backwards1" });
    expect(backwardsBtn).toBeInTheDocument();

    await user.click(fullscreenBtn);
    const closeFullscreenBtn = screen.getByRole("button", { name: "Close1" });
    expect(closeFullscreenBtn).toBeInTheDocument();
  });
});
