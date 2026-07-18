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

describe("TimeAgo with relative timestamp", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("contains the time", () => {
    const timestamp = Date.now();
    render(<HvTimeAgo timestamp={timestamp} />);

    expect(screen.getByText("now")).toBeVisible();
  });

  it("contains the time when the day is yesterday", () => {
    const startOfDay = new Date("2024-01-15T04:00:00Z");
    vi.setSystemTime(startOfDay);

    const yesterday = new Date(startOfDay);
    yesterday.setDate(startOfDay.getDate() - 1);
    render(<HvTimeAgo timestamp={yesterday.getTime()} />);

    expect(screen.getByText(/^yesterday/)).toBeVisible();
  });

  it("contains the time when the day is few minutes into previous day", () => {
    const startOfDay = new Date("2024-01-15T00:04:00Z");
    vi.setSystemTime(startOfDay);

    const yesterday = new Date(startOfDay);
    yesterday.setMinutes(yesterday.getMinutes() - 10);

    render(<HvTimeAgo timestamp={yesterday.getTime()} locale="en" />);

    expect(screen.getByText(/10 minutes ago/i)).toBeVisible();
  });

  it("contains the time when the day is few minutes into next day", () => {
    const endOfDay = new Date("2024-01-15T23:58:00Z");
    vi.setSystemTime(endOfDay);

    const tomorrow = new Date(endOfDay);
    tomorrow.setMinutes(tomorrow.getMinutes() + 10);
    render(<HvTimeAgo timestamp={tomorrow.getTime()} />);

    expect(screen.getByText(/^in 10 minutes/)).toBeVisible();
  });

  it("contains the time when the day is following day", () => {
    const endOfDay = new Date("2024-01-15T23:58:00Z");
    vi.setSystemTime(endOfDay);

    const tomorrow = new Date(endOfDay);
    tomorrow.setMinutes(tomorrow.getMinutes() + 100);
    render(<HvTimeAgo timestamp={tomorrow.getTime()} />);

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
