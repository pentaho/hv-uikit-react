import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HvTimeAgo } from "./TimeAgo";

const EM_DASH = "—";

describe("TimeAgo without timestamp", () => {
  it("should render the emptyElement", () => {
    render(<HvTimeAgo />);

    const component = screen.getByText(EM_DASH);
    expect(component).toBeVisible();
  });

  it("should render the custom emptyElement", () => {
    const MOCK_EMPTY = "EMPTY";
    render(<HvTimeAgo emptyElement={MOCK_EMPTY} />);

    const component = screen.getByText(MOCK_EMPTY);
    expect(component).toBeVisible();
  });
});

describe("TimeAgo with timestamp", () => {
  it("should contain the relative time", () => {
    const timestamp = Date.now();
    render(<HvTimeAgo timestamp={timestamp} />);

    expect(screen.getByText("now")).toBeVisible();
  });

  it("should contain the relative time when the day is yesterday", () => {
    const timestamp = new Date().setDate(new Date().getDate() - 1);
    render(<HvTimeAgo timestamp={timestamp} />);

    expect(screen.getByText(/^yesterday/)).toBeVisible();
  });

  it("should show yesterday for timestamp less than a day ago from previous day", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 58, 0, 0); // Late night timestamp
    const timestamp = yesterday.getTime();

    render(<HvTimeAgo timestamp={timestamp} locale="en" />);

    expect(screen.getByText(/^yesterday/i)).toBeVisible();
  });

  it("should contain the relative time when the day is tomorrow", () => {
    const timestamp = new Date().setDate(new Date().getDate() + 1);
    render(<HvTimeAgo timestamp={timestamp} />);

    expect(screen.getByText(/^tomorrow/)).toBeVisible();
  });
});

describe("TimeAgo with custom locale", () => {
  it("should present the time in the appropriate locale", () => {
    const timestamp = new Date(2024, 0, 1, 15, 0, 0).getTime();
    render(<HvTimeAgo timestamp={timestamp} locale="en-US" />);
    expect(screen.getByText("Jan 1, 2024, 3:00 PM")).toBeVisible();
    render(<HvTimeAgo timestamp={timestamp} locale="en-GB" />);
    expect(screen.getByText("1 Jan 2024, 15:00")).toBeVisible();
  });
});

describe("TimeAgo with custom Button element", () => {
  it("should render the Button", () => {
    render(<HvTimeAgo timestamp={Date.now()} component="button" />);
    expect(screen.getByRole("button")).toBeVisible();
  });
});

describe("TimeAgo with justText", () => {
  it("should render the text", () => {
    const timestamp = Date.now();
    render(<HvTimeAgo justText timestamp={timestamp} />);

    expect(screen.getByText("now")).toBeInTheDocument();
  });

  it("should not render the custom component", () => {
    const timestamp = Date.now();
    render(<HvTimeAgo justText timestamp={timestamp} component="button" />);

    expect(screen.getByText("now")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
