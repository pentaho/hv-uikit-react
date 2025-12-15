import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTheme } from "@hitachivantara/uikit-react-utils";
import { mergeTheme } from "@hitachivantara/uikit-styles";

import { next } from "../themes/next";
import { HvProvider } from "./Provider";

const customTheme = mergeTheme(next, {
  name: "custom-theme",
});

function ChangeModeButton() {
  const { changeMode, selectedMode } = useTheme();

  return (
    <button
      type="button"
      onClick={() => changeMode(selectedMode === "light" ? "dark" : "light")}
    >
      {selectedMode}
    </button>
  );
}

function ChangeThemeButton() {
  const {
    // @ts-expect-error deprecated utility
    changeTheme,
    selectedMode,
  } = useTheme();

  return (
    <button type="button" onClick={() => changeTheme(customTheme)}>
      {selectedMode}
    </button>
  );
}

describe("Provider", () => {
  it("has the color mode selected if no properties are provided", () => {
    const { container } = render(
      <div id="hv-root">
        <HvProvider cssTheme="scoped" rootElementId="hv-root">
          <p>Theme provider test</p>
        </HvProvider>
      </div>,
    );

    const theme = container.querySelector("[data-theme=pentahoPlus]");
    const mode = container.querySelector("[data-color-mode=light]");

    expect(theme).toBeInTheDocument();
    expect(mode).toBeInTheDocument();
  });

  it("has the color mode selected if only the colorMode property is provided", () => {
    const { container } = render(
      <div id="hv-root">
        <HvProvider cssTheme="scoped" rootElementId="hv-root" colorMode="dark">
          <p>Theme provider test</p>
        </HvProvider>
      </div>,
    );

    const theme = container.querySelector("[data-theme=pentahoPlus]");
    const mode = container.querySelector("[data-color-mode=dark]");

    expect(theme).toBeInTheDocument();
    expect(mode).toBeInTheDocument();
  });

  it("falls back to a valid color mode if an invalid value is provided", () => {
    const { container } = render(
      <HvProvider cssTheme="scoped" colorMode={"invalid-mode" as any}>
        <p>Theme provider test</p>
      </HvProvider>,
    );

    const mode = container.querySelector("[data-color-mode=light]");

    expect(screen.getByRole("paragraph")).toBeInTheDocument();
    expect(mode).toBeInTheDocument();
  });

  it("has the correct theme and color mode selected when theme properties are provided", () => {
    const { container } = render(
      <div id="hv-root">
        <HvProvider
          cssTheme="scoped"
          rootElementId="hv-root"
          theme={customTheme}
        >
          <p>Theme provider test</p>
        </HvProvider>
      </div>,
    );

    const theme = container.querySelector("[data-theme=custom-theme]");
    const mode = container.querySelector("[data-color-mode=light]");

    expect(theme).toBeInTheDocument();
    expect(mode).toBeInTheDocument();
  });

  it("changes colorMode on changeMode button click", async () => {
    render(
      <HvProvider colorMode="light">
        <ChangeModeButton />
      </HvProvider>,
    );

    expect(screen.getByRole("button")).toHaveTextContent("light");
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("dark");
  });

  it("changes colorMode on deprecated changeTheme button click", async () => {
    render(
      <HvProvider theme={next} colorMode="light">
        <ChangeThemeButton />
      </HvProvider>,
    );

    expect(screen.getByRole("button")).toHaveTextContent("light");
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("light");
  });
});
