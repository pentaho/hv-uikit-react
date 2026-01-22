import { useContext } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mock, vi } from "vitest";

import { LOCAL_STORAGE_KEYS } from "../hooks/useLocalStorage";
import renderTestProvider from "../tests/testUtils";
import { NavigationContext } from "./NavigationProvider";

vi.mock("@mui/material/useMediaQuery", async () => {
  const mod = await vi.importActual("@mui/material/useMediaQuery");
  return {
    ...(mod as object),
    default: vi.fn().mockReturnValue(false),
  };
});

const TestComponent = () => {
  const {
    selectedMenuItemId,
    rootMenuItemId,
    items,
    verticalNavigationItems,
    hasVerticalNavigation,
    showHeaderSubMenu,
    isCompactMode,
    verticalNavigationMode,
    switchVerticalNavigationMode,
  } = useContext(NavigationContext);

  return (
    <div>
      <span>selectedMenuItemId: {selectedMenuItemId}</span>
      <span>rootMenuItemId: {rootMenuItemId}</span>
      <span>items: {items.length}</span>
      <span>verticalNavigationItems: {verticalNavigationItems.length}</span>
      <span>hasVerticalNavigation: {hasVerticalNavigation.toString()}</span>
      <span>showHeaderSubMenu: {showHeaderSubMenu.toString()}</span>
      <span>isCompactMode: {isCompactMode.toString()}</span>
      <span>verticalNavigationMode: {verticalNavigationMode}</span>
      <button type="button" onClick={switchVerticalNavigationMode}>
        Switch Vertical Navigation Mode
      </button>
    </div>
  );
};

describe("NavigationProvider", () => {
  it("should render the component with the correct values from the context", async () => {
    renderTestProvider(<TestComponent />, {
      menu: [
        {
          label: "Menu 1",
          submenus: [
            {
              label: "Menu 1-1",
              target: "/menu1-1",
            },
            {
              label: "Menu 1-2",
              target: "/menu1-2",
            },
            {
              label: "Menu 1-3",
              target: "/menu1-3",
            },
          ],
        },
        {
          label: "Menu 2",
          target: "/menu2",
        },
        {
          label: "Menu 3",
          target: "/menu3",
        },
      ],
      navigationMode: "TOP_AND_LEFT",
    });

    expect(
      await screen.findByText("selectedMenuItemId: 0-0"),
    ).toBeInTheDocument();
    expect(screen.getByText("rootMenuItemId: 0")).toBeInTheDocument();
    expect(screen.getByText("items: 3")).toBeInTheDocument();
    expect(screen.getByText("verticalNavigationItems: 3")).toBeInTheDocument();
    expect(screen.getByText("hasVerticalNavigation: true")).toBeInTheDocument();
    expect(screen.getByText("showHeaderSubMenu: false")).toBeInTheDocument();
    expect(screen.getByText("isCompactMode: false")).toBeInTheDocument();
    expect(
      screen.getByText("verticalNavigationMode: EXPANDED"),
    ).toBeInTheDocument();

    const button = screen.getByRole("button", {
      name: "Switch Vertical Navigation Mode",
    });

    await userEvent.click(button);

    expect(
      screen.getByText("verticalNavigationMode: COLLAPSED"),
    ).toBeInTheDocument();
  });

  it("should inherit verticalNavigationMode from localStorage when isCompactMode is false", async () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.NAV_EXPANDED, "false");

    renderTestProvider(<TestComponent />);

    expect(
      await screen.findByText("verticalNavigationMode: COLLAPSED"),
    ).toBeInTheDocument();

    localStorage.removeItem(LOCAL_STORAGE_KEYS.NAV_EXPANDED);
  });

  it("should switch between verticalNavigationMode EXPANDED / COLLAPSED when isCompactMode is false", async () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.NAV_EXPANDED, "true");
    renderTestProvider(<TestComponent />);

    const button = await screen.findByRole("button", {
      name: "Switch Vertical Navigation Mode",
    });

    expect(
      screen.getByText("verticalNavigationMode: EXPANDED"),
    ).toBeInTheDocument();

    await userEvent.click(button);

    expect(
      screen.getByText("verticalNavigationMode: COLLAPSED"),
    ).toBeInTheDocument();

    await userEvent.click(button);

    expect(
      screen.getByText("verticalNavigationMode: EXPANDED"),
    ).toBeInTheDocument();
    localStorage.removeItem(LOCAL_STORAGE_KEYS.NAV_EXPANDED);
  });

  it("should switch between verticalNavigationMode CLOSED / EXPANDED when isCompactMode is true", async () => {
    (useMediaQuery as unknown as Mock).mockReturnValue(true);
    renderTestProvider(<TestComponent />);

    const button = await screen.findByRole("button", {
      name: "Switch Vertical Navigation Mode",
    });

    expect(
      screen.getByText("verticalNavigationMode: CLOSED"),
    ).toBeInTheDocument();
    await userEvent.click(button);

    expect(
      screen.getByText("verticalNavigationMode: EXPANDED"),
    ).toBeInTheDocument();

    await userEvent.click(button);

    expect(
      screen.getByText("verticalNavigationMode: CLOSED"),
    ).toBeInTheDocument();
  });
});
