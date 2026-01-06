import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HvTooltip } from "./Tooltip";

const smallTitle = <div>Grid View</div>;

const createTitle = (data: any) => (
  <div>
    <div>{data.title || ""}</div>
    {data.elements.map((element: any) => (
      <div key={element.name}>
        <div>{element.name}</div>
        <div />
        <div>{element.value}</div>
      </div>
    ))}
  </div>
);

const Anchor = (
  <button id="testChild" type="submit">
    Hello World
  </button>
);

describe("Tooltip", () => {
  describe("SingleLine Tooltip", () => {
    it("renders the single line Tooltip", () => {
      render(
        <HvTooltip title={smallTitle} open>
          {Anchor}
        </HvTooltip>,
      );

      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toBeInTheDocument();
    });

    it("doesn't render the single line Tooltip", () => {
      render(<HvTooltip title={smallTitle}>{Anchor}</HvTooltip>);

      expect(screen.queryByRole("tooltip")).toBeNull();
    });

    it("renders the single line Tooltip when hover", async () => {
      render(<HvTooltip title={smallTitle}>{Anchor}</HvTooltip>);

      expect(screen.queryByRole("tooltip")).toBeNull();
      const anchor = screen.getByRole("button", { name: "Hello World" });
      expect(anchor).toBeInTheDocument();

      fireEvent.mouseOver(anchor);

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toBeInTheDocument();
        expect(tooltip.childElementCount).toBe(1);
      });
    });
  });

  const data = {
    elements: [
      { name: "Status", value: "Open" },
      { name: "Date", value: "12/08/2018" },
      { name: "Assignee", value: "Management" },
      { name: "Approval", value: "Not yet requested" },
    ],
  };

  const title = createTitle(data);

  describe("MultiLine Tooltip", () => {
    it("renders the multi line Tooltip", () => {
      render(
        <HvTooltip title={title} open>
          {Anchor}
        </HvTooltip>,
      );

      const tooltip = screen.getByRole("tooltip");
      expect(tooltip).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Open")).toBeInTheDocument();

      expect(screen.getByText("Approval")).toBeInTheDocument();
      expect(screen.getByText("Not yet requested")).toBeInTheDocument();
    });

    it("renders the multi line Tooltip when hover", async () => {
      render(<HvTooltip title={title}>{Anchor}</HvTooltip>);

      expect(screen.queryByRole("tooltip")).toBeNull();
      const anchor = screen.getByRole("button", { name: "Hello World" });
      expect(anchor).toBeInTheDocument();

      fireEvent.mouseOver(anchor);

      await waitFor(() => {
        const tooltip = screen.getByRole("tooltip");
        expect(tooltip).toBeInTheDocument();
      });
    });
  });
});
