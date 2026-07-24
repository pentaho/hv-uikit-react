import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HvButton } from "../Button";
import { HvHeaderActions } from "./Actions";
import { HvHeaderBrand } from "./Brand";
import { HvHeader } from "./Header";
import { HvHeaderNavigation } from "./Navigation";

describe("Header", () => {
  it("should render correctly with no data", () => {
    const { container } = render(<HvHeader />);
    expect(container).toBeDefined();
  });

  it("should render correctly the brand data", () => {
    const { getByText, getByTestId } = render(
      <HvHeader>
        <HvHeaderBrand logo={<div data-testid="logo" />} name="Pentaho App" />
      </HvHeader>,
    );
    expect(getByText("Pentaho App")).toBeInTheDocument();
    expect(getByTestId("logo")).toBeInTheDocument();
  });

  it("should render correctly the navigation menu", () => {
    const navigationData = [
      {
        id: "1",
        label: "text",
        href: "test-link",
        data: [
          {
            id: "1-1",
            label: "text",
          },
        ],
      },
      {
        id: "2",
        label: "text",
      },
    ];

    const { getAllByText, getAllByRole, getByRole } = render(
      <HvHeader>
        <HvHeaderNavigation data={navigationData} />
      </HvHeader>,
    );
    expect(getAllByRole("link")).toHaveLength(1);
    expect(getByRole("link", { name: "text" })).toBeInTheDocument();
    expect(getAllByText("text")).toHaveLength(3);
  });

  it("should render correctly the actions elements", () => {
    const { getAllByRole } = render(
      <HvHeader>
        <HvHeaderActions aria-label="My-aria-label">
          <HvButton
            onClick={() => {}}
            aria-label="Open Notifications panel"
            variant="primaryGhost"
          >
            Badge
          </HvButton>
          <HvButton
            onClick={() => {}}
            aria-label="Open User panel"
            variant="primaryGhost"
          >
            User
          </HvButton>
        </HvHeaderActions>
      </HvHeader>,
    );
    expect(getAllByRole("button")).toHaveLength(2);
  });
});
