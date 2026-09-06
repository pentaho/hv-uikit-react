import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  HvBreadCrumb,
  HvButton,
  HvIconButton,
  HvTab,
  HvTabs,
} from "@hitachivantara/uikit-react-core";

import { PageTitle } from "./PageTitle";

describe("PageTitle", () => {
  it("renders title as h1 heading", () => {
    render(<PageTitle title="Test Page Title" />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Test Page Title",
    );
  });

  it("renders description text", () => {
    render(<PageTitle title="Title" description="Description text" />);

    expect(screen.getByText("Description text")).toBeInTheDocument();
  });

  it("renders breadcrumbs", () => {
    render(
      <PageTitle
        title="Title"
        breadcrumb={
          <HvBreadCrumb
            listRoute={[
              { label: "Home", path: "/" },
              { label: "Current", path: "" },
            ]}
          />
        }
      />,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Current")).toBeInTheDocument();
  });

  it("renders back button", () => {
    render(
      <PageTitle
        title="Title"
        backButton={
          <HvIconButton title="Go back">
            <div>Back</div>
          </HvIconButton>
        }
      />,
    );

    expect(screen.getByRole("button", { name: "Go back" })).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    render(
      <PageTitle
        title="Title"
        actions={
          <>
            <HvButton>Action 1</HvButton>
            <HvButton>Action 2</HvButton>
          </>
        }
      />,
    );

    expect(
      screen.getByRole("button", { name: "Action 1" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Action 2" }),
    ).toBeInTheDocument();
  });

  it("renders tabs", () => {
    render(
      <PageTitle
        title="Title"
        tabs={
          <HvTabs value={0}>
            <HvTab label="Tab 1" />
            <HvTab label="Tab 2" />
          </HvTabs>
        }
      />,
    );

    expect(screen.getByRole("tab", { name: "Tab 1" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab 2" })).toBeInTheDocument();
  });
});
