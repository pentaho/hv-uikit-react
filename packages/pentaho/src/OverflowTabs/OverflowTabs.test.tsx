import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { OverflowTabs, type OverflowTab } from "./OverflowTabs";

describe("OverflowTabs", () => {
  const tabs: OverflowTab[] = [
    { label: "Summary" },
    { label: "Details" },
    { label: "Properties" },
  ];

  it("renders all tabs when space is available", () => {
    render(<OverflowTabs tabs={tabs} value={0} onChange={vi.fn()} />);

    expect(screen.getByRole("tab", { name: "Summary" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Details" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Properties" })).toBeInTheDocument();
  });

  it("marks the selected tab as active", () => {
    render(<OverflowTabs tabs={tabs} value={1} onChange={vi.fn()} />);

    expect(screen.getByRole("tab", { name: "Details" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("calls onChange when a tab is clicked", async () => {
    const handleChange = vi.fn();
    render(<OverflowTabs tabs={tabs} value={0} onChange={handleChange} />);

    await userEvent.click(screen.getByRole("tab", { name: "Details" }));

    expect(handleChange).toHaveBeenCalledWith(expect.anything(), 1);
  });

  it("calls onChange with custom value when tab is clicked", async () => {
    const tabsWithValues: OverflowTab[] = [
      { label: "Summary", value: "summary" },
      { label: "Details", value: "details" },
    ];

    const handleChange = vi.fn();
    render(
      <OverflowTabs
        tabs={tabsWithValues}
        value="summary"
        onChange={handleChange}
      />,
    );

    await userEvent.click(screen.getByRole("tab", { name: "Details" }));

    expect(handleChange).toHaveBeenCalledWith(expect.anything(), "details");
  });

  it("does not crash when tabs array changes", () => {
    const largeTabs: OverflowTab[] = [
      { label: "Summary" },
      { label: "Details" },
      { label: "Properties" },
      { label: "Lineage" },
      { label: "Quality" },
    ];
    const smallTabs: OverflowTab[] = [
      { label: "Summary" },
      { label: "Details" },
    ];

    const { rerender } = render(
      <OverflowTabs tabs={largeTabs} value={0} onChange={vi.fn()} />,
    );

    rerender(<OverflowTabs tabs={smallTabs} value={0} onChange={vi.fn()} />);

    expect(screen.getByRole("tab", { name: "Summary" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Details" })).toBeInTheDocument();
    expect(
      screen.queryByRole("tab", { name: "Properties" }),
    ).not.toBeInTheDocument();
  });
});
