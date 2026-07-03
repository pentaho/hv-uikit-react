import { useMemo, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  HvVerticalNavigation,
  HvVerticalNavigationAction,
  HvVerticalNavigationActions,
  HvVerticalNavigationHeader,
  HvVerticalNavigationTree,
  type NavigationData,
} from ".";

const Sample = ({
  useIcons,
  slider,
}: {
  useIcons?: boolean;
  slider?: boolean;
}) => {
  const navigationData = useMemo<NavigationData[]>(
    () => [
      { id: "00", label: "Overview" },
      { id: "01", label: "Analytics" },
      {
        id: "02",
        label: "Storage",
        data: [
          {
            id: "02-01",
            label: "Cloud",
            data: [
              {
                id: "02-01-01",
                label: "Servers",
                href: "https://example.com/servers.html",
              },
              {
                id: "02-01-02",
                label: "HCP Anywhere",
              },
              {
                id: "02-01-03",
                label: "This Computer",
                disabled: true,
              },
            ],
          },
        ],
      },
      {
        id: "03",
        label: "Administration",
        href: "#admin",
        data: [
          {
            id: "03-01",
            label: "Rest API",
            href: "#admin-rest",
            data: [
              {
                id: "03-01-01",
                label: "Log Bundle",
                href: "#admin-rest-logs",
              },
            ],
          },
        ],
      },
    ],
    [],
  );

  const [value, setValue] = useState("00");

  const [show, setShow] = useState(true);

  const handleExpand = () => {
    setShow(!show);
  };
  return (
    <div style={{ display: "flex", width: 220, height: 530 }}>
      <HvVerticalNavigation useIcons={useIcons} slider={slider}>
        <HvVerticalNavigationHeader
          title="Menu"
          onCollapseButtonClick={handleExpand}
          collapseButtonProps={{
            "aria-label": "collapseButton",
            "aria-expanded": show,
          }}
        />
        <HvVerticalNavigationTree
          aria-label="Example 1 navigation"
          collapsible
          selected={value}
          onChange={(event, data) => {
            if (data.id === "02-01-01") {
              event.preventDefault();
              event.stopPropagation();
            }
            setValue(data.id);
          }}
          data={navigationData}
        />
        <HvVerticalNavigationActions>
          <HvVerticalNavigationAction label="Profile" icon={<div />} />
          <HvVerticalNavigationAction label="Logout" icon={<div />} />
        </HvVerticalNavigationActions>
      </HvVerticalNavigation>
    </div>
  );
};

const SliderSample = () => {
  const navigationData = useMemo(
    () => [
      {
        id: "menu1",
        label: "Menu 1",
        path: "",
        data: [
          {
            id: "menu1-1",
            label: "Menu 1-1",
            path: "",
            parent: null,
          },
          {
            id: "menu1-2",
            label: "Menu 1-2",
            path: "",
            data: [
              {
                id: "menu1-2-1",
                label: "Menu 1-2-1",
                path: "",
                parent: null,
              },
              {
                id: "menu1-2-2",
                label: "Menu 1-2-2",
                path: "",
                parent: null,
              },
              {
                id: "menu1-2-3",
                label: "Menu 1-2-3",
                path: "",
                parent: null,
              },
            ],
            parent: null,
          },
          {
            id: "menu1-3",
            label: "Menu 1-3",
            path: "",
            parent: null,
          },
        ],
        parent: null,
      },
      {
        id: "menu2",
        label: "Menu 2",
        path: "",
        parent: null,
      },
      {
        id: "menu3",
        label: "Menu 3",
        path: "",
        parent: null,
      },
    ],
    [],
  );

  const [value, setValue] = useState("menu3");

  return (
    <div style={{ display: "flex", width: 220, height: 530 }}>
      <HvVerticalNavigation slider>
        <HvVerticalNavigationHeader
          title="Menu"
          backButtonProps={{ "aria-label": "backButton" }}
        />
        <HvVerticalNavigationTree
          aria-label="Example 1 navigation"
          collapsible
          selected={value}
          onChange={(event, data) => {
            if (data.id === "02-01-01") {
              event.preventDefault();
              event.stopPropagation();
            }
            setValue(data.id);
          }}
          data={navigationData}
        />
      </HvVerticalNavigation>
    </div>
  );
};

describe("VerticalNavigation", () => {
  it("should collapse", async () => {
    const { getByRole, getByLabelText } = render(<Sample />);

    const collapseButton = getByRole("button", { name: "collapseButton" });
    expect(collapseButton).toBeInTheDocument();
    expect(collapseButton).toHaveAttribute("aria-expanded", "true");

    const nav = getByLabelText("Example 1 navigation");
    expect(nav).toHaveStyle(`display : block`);

    await userEvent.click(collapseButton);

    expect(collapseButton).toHaveAttribute("aria-expanded", "false");
    expect(nav).not.toHaveStyle(`display : none`);
  });

  it("should have icons", async () => {
    const { getByRole, getByLabelText } = render(<Sample useIcons />);

    const collapseButton = getByRole("button", { name: "collapseButton" });
    expect(collapseButton).toBeInTheDocument();
    expect(collapseButton).toHaveAttribute("aria-expanded", "true");

    const nav = getByLabelText("Example 1 navigation");
    expect(nav).toHaveStyle(`display : block`);

    await userEvent.click(collapseButton);

    expect(collapseButton).toHaveAttribute("aria-expanded", "false");
    expect(nav).toHaveStyle(`display : block`);
  });

  it("should render links when `href` is passed", async () => {
    render(<Sample />);

    const button1 = screen.getByRole("button", { name: /Analytics/i });
    expect(button1).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /Administration/i });
    expect(link).toBeInTheDocument();
  });

  it("should select elements when clicked", async () => {
    render(<Sample />);

    const button = screen.getByRole("button", { name: /Analytics/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveAttribute("aria-current");

    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-current", "true");

    const link = screen.getByRole("link", { name: /Administration/i });
    expect(link).toBeInTheDocument();
    expect(link).not.toHaveAttribute("aria-current");
  });

  describe("Slider Navigation", () => {
    it("should not render header on first page", async () => {
      render(<SliderSample />);

      const title = screen.queryByText("Menu");
      expect(title).not.toBeInTheDocument();
    });

    it("should select elements when clicked", async () => {
      render(<SliderSample />);

      const menu3 = screen.getByRole("listitem", { name: /Menu 3/i });
      expect(menu3).toBeInTheDocument();
      expect(menu3).toHaveAttribute("aria-current", "true");

      const menu2 = screen.getByRole("listitem", { name: /Menu 2/i });
      expect(menu2).toBeInTheDocument();
      expect(menu2).not.toHaveAttribute("aria-current");

      await userEvent.click(menu2);
      expect(menu2).toHaveAttribute("aria-current", "true");
      expect(menu3).not.toHaveAttribute("aria-current", "true");
    });

    it("should navigate to child", async () => {
      render(<SliderSample />);

      await userEvent.click(screen.getByRole("button"));

      const newTitle = screen.getByText("Menu 1");
      expect(newTitle).toBeInTheDocument();

      expect(
        screen.queryByRole("listitem", { name: "Menu 2" }),
      ).not.toBeInTheDocument();

      const goBackButton = screen.getByRole("button", { name: "backButton" });
      expect(goBackButton).toBeInTheDocument();

      await userEvent.click(goBackButton);

      expect(
        screen.queryByRole("listitem", { name: "Menu 2" }),
      ).toBeInTheDocument();
    });
  });
});
