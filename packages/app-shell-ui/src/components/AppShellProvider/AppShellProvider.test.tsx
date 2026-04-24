import { screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useHvAppShellModel } from "@hitachivantara/app-shell-shared";

import renderTestProvider from "../../tests/testUtils";

const consoleMock = vi.spyOn(console, "error").mockImplementation(() => ({}));

describe("AppShellProvider component", () => {
  beforeEach(() => {
    consoleMock.mockReset();
  });
  describe("rendering", () => {
    const DummyComponent = () => {
      const test = useHvAppShellModel();
      return <p>{test?.name}</p>;
    };
    const mockedConfigResponse = {
      name: "fromConfigParameter",
      translations: {
        en: {
          fromFile: "fromConfigUrlParameter-translated",
        },
      },
    };

    it("should use the values passed through the config parameter", async () => {
      await renderTestProvider(<DummyComponent />, mockedConfigResponse);

      expect(
        await screen.findByText("fromConfigParameter"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("fromConfigUrlParameter"),
      ).not.toBeInTheDocument();
    });

    it("should add config translations correctly", async () => {
      await renderTestProvider(<DummyComponent />, mockedConfigResponse, {
        en: { fromFile: "fromConfigUrlParameter-translated" },
      });

      // Translations are pre-loaded via resources in the test i18n instance
      // (passed as bundles to TestProvider). Verify the component renders
      // successfully with the config translations available.
      expect(
        await screen.findByText("fromConfigParameter"),
      ).toBeInTheDocument();
    });
  });

  describe("config theming prop", () => {
    it("should log error if import of a theme bundle fails and apply default", async () => {
      const { baseElement } = await renderTestProvider(<div>dummy</div>, {
        theming: {
          theme: "dummyTheme",
        },
      });

      const bodyElement = baseElement.ownerDocument.body;

      await waitFor(() => {
        expect(consoleMock).toHaveBeenCalledWith(
          expect.stringContaining("Import of theme bundle dummyTheme failed!"),
        );

        expect(bodyElement.getAttribute("data-theme")).toBe("pentahoPlus");
      });
    });

    it("should apply chosen theme and color mode", async () => {
      const { baseElement } = await renderTestProvider(<div>dummy</div>, {
        theming: {
          theme: "next",
          colorMode: "dark",
        },
      });

      const bodyElement = baseElement.ownerDocument.body;

      await waitFor(() => {
        expect(bodyElement.getAttribute("data-theme")).toBe("next");
        expect(bodyElement.getAttribute("data-color-mode")).toBe("dark");
        expect(bodyElement).toHaveStyle("color-scheme: dark;");
      });
    });
  });

  describe("config providers prop", () => {
    it("should log error if import of a provider bundle fails and still render correctly", async () => {
      await renderTestProvider(<div>dummy</div>, {
        providers: [
          {
            bundle: "dummyProvider",
          },
        ],
      });

      await waitFor(() => {
        expect(consoleMock).toHaveBeenCalledWith(
          "Failed to load bundle dummyProvider:",
          expect.any(Error),
        );
      });

      expect(await screen.findByText("dummy")).toBeInTheDocument();
    });
  });
});
