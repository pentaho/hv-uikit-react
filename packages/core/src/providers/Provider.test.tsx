import { render } from "@testing-library/react";

import { createTheme } from "../utils/theme";
import { HvProvider } from "./Provider";

const customThemeInherit = createTheme({
  name: "custom-theme",
  inheritColorModes: true,
});

const customThemeNoInherit = createTheme({
  name: "custom-theme",
  inheritColorModes: false,
  colors: {
    modes: {
      purple: {
        bgContainer: "purple",
      },
    },
  },
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

    const theme = container.querySelector("[data-theme=ds5]");
    const mode = container.querySelector("[data-color-mode=dawn]");

    expect(theme).toBeInTheDocument();
    expect(mode).toBeInTheDocument();
  });

  it("has the color mode selected if only the colorMode property is provided", () => {
    const { container } = render(
      <div id="hv-root">
        <HvProvider
          cssTheme="scoped"
          rootElementId="hv-root"
          colorMode="wicked"
        >
          <p>Theme provider test</p>
        </HvProvider>
      </div>,
    );

    const theme = container.querySelector("[data-theme=ds5]");
    const mode = container.querySelector("[data-color-mode=wicked]");

    expect(theme).toBeInTheDocument();
    expect(mode).toBeInTheDocument();
  });

  it("should have the correct theme and color mode selected if the themes and theme properties are provided", () => {
    const { container } = render(
      <div id="hv-root">
        <HvProvider
          cssTheme="scoped"
          rootElementId="hv-root"
          theme={customThemeInherit}
        >
          <p>Theme provider test</p>
        </HvProvider>
      </div>,
    );

    const theme = container.querySelector("[data-theme=custom-theme]");
    const mode = container.querySelector("[data-color-mode=dawn]");

    expect(theme).toBeInTheDocument();
    expect(mode).toBeInTheDocument();
  });

  it("should have the correct theme and color mode selected if themes, theme and colorMode are provided", () => {
    const { container } = render(
      <div id="hv-root">
        <HvProvider
          cssTheme="scoped"
          rootElementId="hv-root"
          theme={customThemeNoInherit}
          colorMode="purple"
        >
          <p>Theme provider test</p>
        </HvProvider>
      </div>,
    );

    const theme = container.querySelector("[data-theme=custom-theme]");
    const mode = container.querySelector("[data-color-mode=purple]");

    expect(theme).toBeInTheDocument();
    expect(mode).toBeInTheDocument();
  });
});
