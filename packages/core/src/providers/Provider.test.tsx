import { render } from "@testing-library/react";
import { mergeTheme } from "@hitachivantara/uikit-styles";

import { next } from "../themes/next";
import { HvProvider } from "./Provider";

const customTheme = mergeTheme(next, {
  name: "custom-theme",
});

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

  it("should have the correct theme and color mode selected if the themes and theme properties are provided", () => {
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
});
